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
    INTEGRADO_PATRON="${INTEGRADO_PATRON:-*rog*|*ally*|*asus*|*hid-asus*|*microsoft x-box 360 pad*}"
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
