#!/usr/bin/env bash
# =============================================================================
#  eden-driver-dolphin.sh  --  Dolphin (GameCube / Wii)
# =============================================================================
#  EmuDeck ya deja GCPadNew.ini y WiimoteNew.ini con TODOS los bindings puestos.
#  Lo unico que cambia entre sesiones es la linea:
#
#      Device = SDL/<indice>/<nombre>
#
#  donde <indice> es el indice global de SDL (el que da eden-mandos-sdl.sh en su
#  8.o campo) y <nombre> el nombre SDL del mando. Este driver reescribe SOLO esa
#  linea en cada puerto; el resto del fichero queda byte a byte igual.
#
#  Uso (normalmente a traves del despachador):
#     eden-autoconfig.sh --sistema gc
#     eden-autoconfig.sh --sistema gc --dry-run
#     eden-autoconfig.sh --sistema gc --status
#     eden-autoconfig.sh --sistema gc --restore [latest|N]
#
#  Codigos de salida: 0 ok | 1 error | 2 nada que hacer | 3 Dolphin abierto |
#                     4 no encuentro la configuracion
# =============================================================================

set -u

DOLPHIN_DIRS=(
    "$HOME/.var/app/org.DolphinEmu.dolphin-emu/config/dolphin-emu"
    "$HOME/.config/dolphin-emu"
    "$HOME/.dolphin-emu"
    "$HOME/Documents/Dolphin Emulator"
)

QUIET=0
d_say()  { [ "$QUIET" = "1" ] && return 0; printf '%s\n' "$*"; }
d_warn() { printf 'AVISO: %s\n' "$*" >&2; }
d_err()  { printf 'ERROR: %s\n' "$*" >&2; }

# ------------------------------------------------------------------ rutas ---
d_dir() {
    local d
    for d in "${DOLPHIN_DIRS[@]}"; do
        if [ -f "$d/GCPadNew.ini" ] || [ -f "$d/WiimoteNew.ini" ]; then
            printf '%s' "$d"
            return 0
        fi
    done
    return 1
}

d_backups() {
    printf '%s/dolphin' "$(nucleo_base)/backups"
}

d_en_ejecucion() {
    pgrep -fa 'dolphin-emu|Dolphin\.AppImage|DolphinQt' 2>/dev/null \
        | grep -v -e pgrep -e eden-autoconfig >/dev/null
}

# ---------------------------------------------------------------- mandos ----
# La lista y el plan los pone el nucleo (igual que Eden y Cemu).
d_planificar() { nucleo_planificar eden; }

# Devuelve el valor de Device para el jugador N (1..)
d_device() {
    local n="$1"
    printf 'SDL/%s/%s' "${PLAN_INDICE[$((n - 1))]}" "${PLAN_SDL[$((n - 1))]}"
}

# ------------------------------------------------------------------ parche --
# Reescribe las lineas Device de las secciones indicadas en $2 (fichero de
# asignaciones "Seccion=valor"). Escribe atomico y valida antes de aceptar.
d_parchear() {
    local fichero="$1" asg="$2" tmp
    tmp="$fichero.tmp.$$"

    awk -v asg="$asg" '
        BEGIN {
            while ((getline l < asg) > 0) {
                if (l == "") continue
                i = index(l, "=")
                if (i == 0) continue
                mapa[substr(l, 1, i - 1)] = substr(l, i + 1)
            }
        }
        /^[ \t]*\[/ {
            sec = $0
            sub(/^[ \t]*\[/, "", sec)
            sub(/\][ \t]*$/, "", sec)
        }
        {
            if ((sec in mapa) && $0 ~ /^[ \t]*Device[ \t]*=/) {
                match($0, /^[ \t]*/)
                print substr($0, 1, RLENGTH) "Device = " mapa[sec]
            } else {
                print
            }
        }
    ' "$fichero" >"$tmp" || { rm -f "$tmp"; return 1; }

    if ! d_validar "$fichero" "$tmp"; then
        rm -f "$tmp"
        d_err "el resultado no es valido (¿cambio algo mas que Device?); no toco nada"
        return 1
    fi

    chmod --reference="$fichero" "$tmp" 2>/dev/null || true
    mv -f "$tmp" "$fichero"
}

# Mismas secciones, mismo numero de lineas y todo igual salvo las Device.
d_validar() {
    local orig="$1" nuevo="$2"
    [ "$(grep -c '^[ \t]*\[' "$orig")" -eq "$(grep -c '^[ \t]*\[' "$nuevo")" ] || return 1
    [ "$(wc -l <"$orig")" -eq "$(wc -l <"$nuevo")" ] || return 1
    diff -q <(grep -v '^[ \t]*Device[ \t]*=' "$orig") \
            <(grep -v '^[ \t]*Device[ \t]*=' "$nuevo") >/dev/null
}

# ------------------------------------------------------------------ acciones
d_asignaciones() { # $1 = prefijo de seccion (GCPad | Wiimote)  -> stdout
    local prefijo="$1" n
    for n in $(seq 1 "${#PLAN_NOMBRE[@]}"); do
        printf '%s%s=%s\n' "$prefijo" "$n" "$(d_device "$n")"
    done
}

d_cmd_status() {
    local dir
    dir="$(d_dir)" || { d_err "no encuentro la configuracion de Dolphin"; return 4; }
    d_say "Dolphin            : $dir"
    d_say "en ejecucion       : $(d_en_ejecucion && echo SI || echo no)"
    d_planificar || true
    nucleo_imprimir_plan
    local f
    for f in GCPadNew.ini WiimoteNew.ini; do
        [ -f "$dir/$f" ] || continue
        d_say "--- $f"
        grep -n '^[ \t]*\[.\+\][ \t]*$\|^[ \t]*Device[ \t]*=' "$dir/$f" | sed 's/^/  /'
    done
    return 0
}

d_cmd_dryrun() {
    local dir
    dir="$(d_dir)" || { d_err "no encuentro la configuracion de Dolphin"; return 4; }
    d_planificar || {
        nucleo_imprimir_plan
        nucleo_guardar_plan dolphin dry-run
        return 2
    }
    d_say "Dolphin: $dir"
    nucleo_imprimir_plan
    local f prefijo n
    for f in GCPadNew.ini WiimoteNew.ini; do
        [ -f "$dir/$f" ] || continue
        prefijo="GCPad"
        [ "$f" = "WiimoteNew.ini" ] && prefijo="Wiimote"
        d_say "--- $f"
        for n in $(seq 1 "${#PLAN_NOMBRE[@]}"); do
            d_say "  [$prefijo$n] Device = $(d_device "$n")"
        done
    done
    d_say "(dry-run: no se ha escrito nada)"
    nucleo_guardar_plan dolphin dry-run
    nucleo_registrar dolphin dry-run
    return 0
}

d_cmd_aplicar() {
    local dir
    dir="$(d_dir)" || { d_err "no encuentro la configuracion de Dolphin"; return 4; }

    if d_en_ejecucion; then
        d_err "Dolphin esta en ejecucion. Cierralo y vuelve a intentarlo."
        return 3
    fi

    d_planificar || {
        [ "$QUIET" = "1" ] || nucleo_imprimir_plan
        nucleo_guardar_plan dolphin aplicar
        nucleo_registrar dolphin aplicar
        d_warn "no hay mandos que asignar: dejo la configuracion como estaba"
        return 2
    }

    local bk stamp f prefijo
    bk="$(d_backups)"
    mkdir -p "$bk" || { d_err "no puedo crear $bk"; return 1; }
    stamp="$(date +%Y%m%d-%H%M%S)"

    for f in GCPadNew.ini WiimoteNew.ini; do
        [ -f "$dir/$f" ] || continue
        prefijo="GCPad"
        [ "$f" = "WiimoteNew.ini" ] && prefijo="Wiimote"

        cp -p "$dir/$f" "$bk/$f.$stamp" || { d_err "no puedo hacer backup de $f"; return 1; }
        d_asignaciones "$prefijo" >"$bk/.asg.$$"
        if d_parchear "$dir/$f" "$bk/.asg.$$"; then
            d_say "$f actualizado"
        else
            rm -f "$bk/.asg.$$"
            d_err "no pude actualizar $f (backup en $bk/$f.$stamp)"
            return 1
        fi
        rm -f "$bk/.asg.$$"
    done

    # retencion (misma idea que en Eden)
    local ret="${RETENCION_BACKUPS:-10}"
    if [ "$ret" -gt 0 ] 2>/dev/null; then
        ls -1t "$bk"/GCPadNew.ini.* 2>/dev/null | tail -n +$((ret + 1)) | while read -r viejo; do
            rm -f "$viejo"
        done
        ls -1t "$bk"/WiimoteNew.ini.* 2>/dev/null | tail -n +$((ret + 1)) | while read -r viejo; do
            rm -f "$viejo"
        done
    fi

    nucleo_guardar_plan dolphin aplicar
    nucleo_registrar dolphin aplicar
    return 0
}

d_cmd_restore() {
    local cual="${1:-latest}" bk origen
    bk="$(d_backups)"
    [ -d "$bk" ] || { d_err "no hay copias de Dolphin"; return 1; }

    for f in GCPadNew.ini WiimoteNew.ini; do
        if [ "$cual" = "latest" ]; then
            origen="$(ls -1t "$bk"/$f.* 2>/dev/null | head -n 1)"
        else
            origen="$(ls -1t "$bk"/$f.* 2>/dev/null | sed -n "${cual}p")"
        fi
        [ -n "${origen:-}" ] || { d_warn "no hay copia de $f"; continue; }
        local dir
        dir="$(d_dir)" || { d_err "no encuentro la configuracion de Dolphin"; return 4; }
        cp -f "$origen" "$dir/$f" && d_say "restaurado $f <- $(basename "$origen")"
    done
    return 0
}

# ------------------------------------------------------------------- CLI ----
d_usage() {
    cat <<EOF
driver Dolphin (GameCube / Wii)

USO
  eden-autoconfig.sh --sistema gc                aplica
  eden-autoconfig.sh --sistema gc --dry-run      enseña el plan, sin escribir
  eden-autoconfig.sh --sistema gc --status       estado y Device actuales
  eden-autoconfig.sh --sistema gc --restore [latest|N]
  eden-autoconfig.sh --sistema gc --help
EOF
}

main() {
    local modo="aplicar" restore_arg="latest"
    while [ $# -gt 0 ]; do
        case "$1" in
            --status)   modo="status" ;;
            --dry-run|--dryrun) modo="dryrun" ;;
            --restore)
                modo="restore"
                case "${2:-}" in
                    ''|--*) : ;;
                    *) restore_arg="$2"; shift ;;
                esac
                ;;
            --help|-h) d_usage; return 0 ;;
            --quiet|-q) QUIET=1 ;;
            --verbose|-v) : ;;
            *)
                d_err "opcion no reconocida: $1"
                d_usage >&2
                return 1
                ;;
        esac
        shift
    done

    case "$modo" in
        status)  d_cmd_status ;;
        dryrun)  d_cmd_dryrun ;;
        restore) d_cmd_restore "$restore_arg" ;;
        *)       d_cmd_aplicar ;;
    esac
}
