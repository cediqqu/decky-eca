#!/usr/bin/env bash
# =============================================================================
#  10-eden-autoconfig.sh  --  script de evento 'game-start' de ES-DE
# =============================================================================
#  ES-DE ejecuta los ficheros que haya en ~/ES-DE/scripts/game-start/
#  (en orden lexicografico) y ESPERA a que terminen antes de lanzar el
#  emulador. Eso garantiza que la configuracion de Eden ya esta escrita
#  cuando Eden arranca.
#
#  Argumentos que pasa ES-DE (documentado en su INSTALL.md):
#     $1 = ruta completa del fichero del juego
#     $2 = nombre del juego (como aparece en la gamelist)
#     $3 = nombre del sistema            (para Switch: "switch")
#     $4 = nombre completo del sistema   ("Nintendo Switch")
#
#  Este script solo actua cuando el sistema es Switch y NUNCA debe impedir
#  que el juego arranque: siempre termina con exit 0.
#
#  Instalacion: copiar a ~/ES-DE/scripts/game-start/10-eden-autoconfig.sh
#               y dar permisos:  chmod 755 ~/ES-DE/scripts/game-start/10-eden-autoconfig.sh
# =============================================================================

set -u

SISTEMA="${3:-}"
JUEGO="${1:-}"
SISTEMA_LARGO="${4:-}"

# --- ¿es un juego de Switch? -------------------------------------------------
es_switch=0
if [ -n "$SISTEMA" ]; then
    case "$SISTEMA" in
        switch|Switch|SWITCH|nsw|NSW) es_switch=1 ;;
    esac
else
    # Por si alguna version no pasara el nombre del sistema: miramos el
    # nombre largo y la ruta del juego.
    case "$SISTEMA_LARGO $JUEGO" in
        *[Ss]witch*) es_switch=1 ;;
    esac
fi
[ "$es_switch" -eq 1 ] || exit 0

# --- localizar el script principal ------------------------------------------
SCRIPT="${EDEN_AUTOCONFIG_BIN:-$HOME/eden-autoconfig/eden-autoconfig.sh}"
if [ ! -r "$SCRIPT" ]; then
    echo "10-eden-autoconfig: no encuentro $SCRIPT (nada que hacer)" >&2
    exit 0
fi

# --quiet: solo errores por pantalla; el resumen queda en
# ~/eden-autoconfig/log.txt y una linea en stderr (visible en es_log.txt).
bash "$SCRIPT" --quiet || true

exit 0
