#!/usr/bin/env bash
# =============================================================================
#  eden-nucleo.sh  --  piezas compartidas por los drivers de E.C.A
# =============================================================================
#  Fase 0 del refactor: aqui vive lo que necesitan TODOS los drivers. De
#  momento son las rutas y la carga de preferencias comunes; el driver de Eden
#  sigue con su propia carga (no se toca para no cambiar su comportamiento).
# =============================================================================

# Carpeta de trabajo (~/eden-autoconfig) y fichero de preferencias.
nucleo_base() { printf '%s' "${EDEN_AUTOCONFIG_DIR:-$HOME/eden-autoconfig}"; }
nucleo_conf() {
    local base
    base="$(nucleo_base)"
    printf '%s' "${EDEN_AUTOCONFIG_CONF:-$base/eden-autoconfig.conf}"
}

# Carga el .conf (si existe) y deja valores por defecto coherentes con el
# driver de Eden: cuantos mandos configurar, que hacer con el integrado y que
# mando es el principal.
nucleo_prefs() {
    local conf
    conf="$(nucleo_conf)"
    if [ -r "$conf" ]; then
        # shellcheck disable=SC1090
        . "$conf" >/dev/null 2>&1 || true
    fi
    JUGADORES_MAX="${JUGADORES_MAX:-4}"
    ORDEN_INTEGRADO="${ORDEN_INTEGRADO:-ignorar}"
    P1_SERIE="${P1_SERIE:-}"
    DUALSENSE_PATRON="${DUALSENSE_PATRON:-*wireless controller*|*dualsense*}"
    INTEGRADO_PATRON="${INTEGRADO_PATRON:-*rog*|*ally*|*asus*|*hid-asus*|*microsoft x-box 360 pad*|*steam deck*|*deck controller*}"
}

# Ruta al ayudante de SDL (junto a los scripts).
nucleo_helper_sdl() {
    local base
    base="$(nucleo_base)"
    if [ -r "${AQUI:-.}/eden-mandos-sdl.sh" ]; then
        printf '%s' "${AQUI:-.}/eden-mandos-sdl.sh"
    elif [ -r "$base/eden-mandos-sdl.sh" ]; then
        printf '%s' "$base/eden-mandos-sdl.sh"
    else
        return 1
    fi
}

# Compara un nombre con un patron tipo "a|b|c" (glob, sin distinguir mayusculas)
nucleo_coincide() {
    local nombre patron p
    nombre="${1,,}"
    patron="${2,,}"
    local IFS='|'
    for p in $patron; do
        # shellcheck disable=SC2254
        case "$nombre" in $p) return 0 ;; esac
    done
    return 1
}

# ---------------------------------------------------------------------------
#  Lista de mandos y plan de asignacion (compartido por Cemu y Dolphin)
# ---------------------------------------------------------------------------
# Salida, una linea por gamepad:
#   NOMBRE|SDL|SERIE|INDICE|CLASE|UUID
#     CLASE = dual | integrado | otro
#     UUID  = "<puerto>_<guid>" en el dialecto pedido ($1 = eden|cemu)
nucleo_mandos() {
    local modo="${1:-eden}" helper out
    helper="$(nucleo_helper_sdl)" || return 1
    if [ "$modo" = "cemu" ]; then
        out="$(SDL_FUENTE=sistema SDL_GUID_MODO=cemu bash "$helper" 2>/dev/null)" || return 1
    else
        out="$(bash "$helper" 2>/dev/null)" || return 1
    fi
    printf '%s\n' "$out" | while IFS='|' read -r nombre guid puerto tipo esgp sdl serie indice; do
        case "$nombre" in ''|'#'*) continue ;; esac
        [ "${esgp:-0}" = "1" ] || continue
        local clase="otro"
        # "Wireless Controller" vale para DualShock/DualSense, pero un
        # "Xbox Wireless Controller" NO es un DualSense (lo mete el patron).
        if nucleo_coincide "$nombre" "${DUALSENSE_PATRON:-*dualsense*}" \
           && ! nucleo_coincide "$nombre" "*xbox*|*x-box*"; then
            clase="dual"
        elif nucleo_coincide "$nombre" "${INTEGRADO_PATRON:-}"; then
            clase="integrado"
        fi
        printf '%s|%s|%s|%s|%s|%s_%s\n' "$nombre" "${sdl:-$nombre}" "${serie:-}" \
            "${indice:-0}" "$clase" "${puerto:-0}" "$guid"
    done
}

# Rellena el plan (arrays PLAN_*) respetando ORDEN_INTEGRADO, P1_SERIE y
# JUGADORES_MAX. Devuelve 0 si hay algo, 2 si no hay mandos.
#   PLAN_NOMBRE  nombre que da SDL/Eden      PLAN_SDL   nombre SDL
#   PLAN_SERIE   serie (MAC)                 PLAN_INDICE indice SDL
#   PLAN_CLASE   dual|integrado|otro         PLAN_UUID  "<puerto>_<guid>"
nucleo_planificar() { # $1 = eden|cemu
    local modo="${1:-eden}" linea nombre sdl serie indice clase uuid
    nucleo_prefs
    PLAN_NOMBRE=(); PLAN_SDL=(); PLAN_SERIE=(); PLAN_INDICE=()
    PLAN_CLASE=(); PLAN_UUID=()

    local duales=() integrados=() otros=()
    while IFS= read -r linea; do
        [ -n "$linea" ] || continue
        IFS='|' read -r nombre sdl serie indice clase uuid <<<"$linea"
        case "$clase" in
            dual)      duales+=("$linea") ;;
            integrado) integrados+=("$linea") ;;
            *)         otros+=("$linea") ;;
        esac
    done < <(nucleo_mandos "$modo")

    local lista=() orden_int="ultimo" incluir_int=0
    case "${ORDEN_INTEGRADO:-ignorar}" in
        ignorar) incluir_int=0 ;;
        primero) incluir_int=1; orden_int="primero" ;;
        *)       incluir_int=1; orden_int="ultimo" ;;
    esac
    # sin ningun DualSense el integrado entra siempre, y de primero
    if [ "${#duales[@]}" -eq 0 ]; then
        incluir_int=1
        orden_int="primero"
    fi

    # ordenar cada grupo por indice SDL (orden de conexion)
    local ordenada
    if [ "${#duales[@]}" -gt 0 ]; then
        ordenada=()
        while IFS= read -r linea; do ordenada+=("$linea"); done < <(
            printf '%s\n' "${duales[@]}" | sort -t'|' -k4,4n
        )
        duales=("${ordenada[@]}")
    fi
    if [ "${#integrados[@]}" -gt 0 ]; then
        ordenada=()
        while IFS= read -r linea; do ordenada+=("$linea"); done < <(
            printf '%s\n' "${integrados[@]}" | sort -t'|' -k4,4n
        )
        integrados=("${ordenada[@]}")
    fi
    if [ "${#otros[@]}" -gt 0 ]; then
        ordenada=()
        while IFS= read -r linea; do ordenada+=("$linea"); done < <(
            printf '%s\n' "${otros[@]}" | sort -t'|' -k4,4n
        )
        otros=("${ordenada[@]}")
    fi

    if [ "${#duales[@]}" -gt 0 ]; then
        if [ "$incluir_int" -eq 1 ] && [ "$orden_int" = "primero" ]; then
            [ "${#integrados[@]}" -gt 0 ] && lista+=("${integrados[0]}")
            lista+=("${duales[@]}")
        else
            lista+=("${duales[@]}")
            if [ "$incluir_int" -eq 1 ] && [ "${#integrados[@]}" -gt 0 ]; then
                lista+=("${integrados[0]}")
            fi
        fi
    else
        [ "${#integrados[@]}" -gt 0 ] && lista+=("${integrados[@]}")
        [ "${#otros[@]}" -gt 0 ] && lista+=("${otros[@]}")
    fi
    [ "${#lista[@]}" -gt 0 ] || return 2

    # el principal (P1_SERIE) va primero
    if [ -n "${P1_SERIE:-}" ]; then
        local i out=()
        for i in "${!lista[@]}"; do
            IFS='|' read -r nombre sdl serie indice clase uuid <<<"${lista[$i]}"
            if [ "$serie" = "$P1_SERIE" ]; then
                out=("${lista[$i]}")
                unset 'lista[$i]'
                break
            fi
        done
        [ "${#out[@]}" -gt 0 ] && lista=("${out[@]}" "${lista[@]}")
    fi

    local tope="${JUGADORES_MAX:-4}" i
    [ "$tope" -gt 8 ] 2>/dev/null && tope=8
    [ "$tope" -lt 1 ] 2>/dev/null && tope=1

    for i in "${!lista[@]}"; do
        [ "$i" -lt "$tope" ] || break
        IFS='|' read -r nombre sdl serie indice clase uuid <<<"${lista[$i]}"
        PLAN_NOMBRE+=("$nombre")
        PLAN_SDL+=("$sdl")
        PLAN_SERIE+=("$serie")
        PLAN_INDICE+=("$indice")
        PLAN_CLASE+=("$clase")
        PLAN_UUID+=("$uuid")
    done

    [ "${#PLAN_NOMBRE[@]}" -gt 0 ] || return 2
    return 0
}
