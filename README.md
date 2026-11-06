# N.E.C.A: Nintendo-EmuDeck Controller Autoconf

Plugin de [Decky](https://decky.xyz/) que autoconfigura los mandos de los
emuladores de Nintendo desde el menú rápido de Steam (QAM): **[Eden](https://eden-emu.dev/)**
(Switch), **Dolphin** (GameCube/Wii) y **Cemu** (Wii U). Fija el **Player 1**,
elige **cuántos DualSense** usar y **qué hacer con el mando integrado**, y lo
aplica al lanzar el juego desde [ES-DE](https://es-de.org/). Sin root.

[![Release](https://img.shields.io/github/v/release/CeDiqqu/decky-eca?label=release)](https://github.com/CeDiqqu/decky-eca/releases/latest)
[![Licencia](https://img.shields.io/github/license/CeDiqqu/decky-eca)](https://github.com/CeDiqqu/decky-eca/blob/main/LICENSE)

[English](https://github.com/CeDiqqu/decky-eca/blob/main/README.en.md) · **Español**

> **Estado:** v1.0.0 (2 nov 2026), primera versión pública. Probada en **ROG Xbox
> Ally X** con SteamOS y DualSense por Bluetooth. Mantenida por
> [CeDiqqu](https://github.com/CeDiqqu), sin cadencia fija.

Cambios por versión: [CHANGELOG.md](https://github.com/CeDiqqu/decky-eca/blob/main/CHANGELOG.md).

Pensado para PC de mano con SteamOS y ES-DE (EmuDeck), no para Windows.

## Por qué N.E.C.A

- **Tres emuladores, una sola configuración.** Eden (Switch), Dolphin
  (GameCube/Wii) y Cemu (Wii U) reciben el mando que les toca al lanzar.
- **El Player 1 va por MAC, no por puerto.** Steam puede renumerar los puertos
  entre sesiones; N.E.C.A fija el mando concreto.
- **En tu configuración, solo escribe un bloque marcado** al final de
  `eden-autoconfig.conf`. El resto del fichero, tus plantillas y tus copias
  quedan intactos.
- **Corre como `deck`, sin root**, para que Eden siga pudiendo escribir su
  `qt-config.ini`.
- **No reimplementa la lógica**: el panel llama a los scripts de
  `eden-autoconfig`, los mismos que puedes usar por terminal.
- **Se puede deshacer**: restaura el `qt-config.ini` original, quita el bloque y
  desactiva el hook.

Cuándo **no** usarlo: si no lanzas los juegos desde ES-DE (el hook vive ahí), si
tu handheld no es ASUS (el patrón del mando integrado puede necesitar ajuste) o
si necesitas fijar más de un jugador por MAC.

## Requisitos

- **Decky Loader** con `api_version: 1` (el plugin declara ese valor).
- **SteamOS** en un PC de mano (probado en ROG Xbox Ally X). No soporta Windows.
- **Eden** (AppImage) con el perfil `emudeck` en
  `<config>/input/emudeck.ini`, que crea EmuDeck. Si usas otro perfil, cambia
  `PERFIL` en `~/eden-autoconfig/eden-autoconfig.conf`.
- **ES-DE** con *Custom Event Scripts* activado. El plugin espera ES-DE en
  `~/ES-DE` (la ruta de EmuDeck); si está en otro sitio, el hook no se instala
  solo.
- **Eden cerrado** antes de *Aplicar* o *Restaurar*. Al aplicar, el script se
  niega si Eden está en marcha; al restaurar, ciérralo para que no reescriba el
  `qt-config.ini` al salir.
- Opcional: permiso de escritura en `/dev/hidraw*` para la vibración. Si no lo
  hay, el panel lo diagnostica y el resto sigue funcionando.

## Instalación

1. Descarga **[neca-decky.zip](https://github.com/CeDiqqu/decky-eca/releases/latest/download/neca-decky.zip)**.
2. En la consola: **Decky → Developer → Install Plugin from ZIP**. Se instala en
   `~/homebrew/plugins/EdenAutoconfig/` (la carpeta conserva ese nombre para que
   la actualización sustituya a la versión anterior).
3. Abre el panel en el menú rápido y pulsa **Instalar scripts** (solo la primera
   vez). Copia los scripts a `~/eden-autoconfig`, deja el hook en
   `~/ES-DE/scripts/game-start/` si existe esa carpeta y comprueba que SDL
   responde.
4. En ES-DE: **Other settings → Enable custom event scripts**.

Comprueba que en **Estado** aparece `scripts 1.0.0 · hook OK`. También puedes
comprobarlo por terminal:

```bash
~/eden-autoconfig/eden-autoconfig.sh --status
```

Debe encontrar Eden, el perfil `emudeck` y decir `Eden en ejecucion: no`.

Para actualizar, instala el zip nuevo; no hace falta desinstalar antes.

## Uso rápido

1. Conecta los mandos y abre el panel: se refresca solo.
2. Con **un solo DualSense**, se fija solo como principal y su tarjeta lleva una
   **★ dorada**. Si ya hay uno fijado, sigue siendo el principal mientras esté
   conectado.
3. Para cambiar de principal, **dos toques seguidos** (menos de 1,5 s) sobre otra
   tarjeta. Un toque solo hace vibrar; así no se cambia sin querer.
4. Ajusta **cuántos DualSense** usar (1 a 4) y qué hacer con el **mando integrado**
   en **Ajustes**.
5. En **Avanzado → Aplicar ahora** escribes la configuración. Los badges de las
   tarjetas muestran el jugador que le tocaría antes de aplicar; no se escribe
   nada hasta ese momento.

**Estado** es una fila fija con el escenario, los mandos, la versión y el estado
del hook. **Ajustes** y **Avanzado** están plegados: pulsa A en su cabecera para
abrirlos. **Mandos** siempre está abierto y **Recargar mandos** está justo debajo
de las tarjetas.

Cada tarjeta muestra el **icono** de la familia (PlayStation, Xbox, Switch, Steam
o mando integrado), la **conexión** (Bluetooth, USB, Interno o Virtual) y, solo
si hay varios del mismo tipo, un sufijo de la **MAC** para distinguirlos. Los
mandos desconocidos muestran además su nombre.

Los avisos cortos se pintan dentro del panel y desaparecen a los 5 s. Los errores
largos (por ejemplo, el diagnóstico de `hidraw`) se abren en una ventana para
poder leerlos o copiarlos.

## Reconocer un mando por vibración

- **Un toque** sobre una tarjeta DualSense: el mando vibra 300 ms y la tarjeta
  destella en cian.
- **Dos toques seguidos** (menos de 1,5 s): ese mando pasa a ser el principal.
- **Solo DualSense**: es el único protocolo implementado. El mando integrado no
  vibra; si usas otro tipo de mando, usa otra vía para identificarlo.
- Para localizarlo se usa su MAC (`uniq` o `HID_UNIQ` del `uevent`). Si el
  sistema no la da, se usa el único DualSense conectado o el orden de puerto. Si
  falla, el panel muestra un diagnóstico de `/sys/class/hidraw`.
- Si no hay permisos sobre `/dev/hidraw*`, la vibración no funciona; el resto del
  plugin sí.

## Qué escribe (y cómo volver atrás)

Una vez instalados los scripts, el panel solo escribe dos cosas en tu casa:

1. Un **bloque gestionado** al final de `~/eden-autoconfig/eden-autoconfig.conf`.
2. Su estado privado en `~/.config/eden-autoconfig-decky/`.

El bloque se sustituye entero; el resto del `.conf` no se toca. Ejemplo:

```ini
# >>> eden-autoconfig-decky >>>
P1_SERIE="4c:b9:9b:e9:bc:26"
JUGADORES_MAX=2
ORDEN_INTEGRADO="ignorar"
ORDEN_DUALSENSE="mac"
RETENCION_BACKUPS=10
# <<< eden-autoconfig-decky <<<
```

- El hook de ES-DE lee ese mismo `.conf`, así que lo que eliges en el panel es lo
  que se aplica al lanzar el juego.
- Si el `.conf` ya existía, se guarda una copia del anterior en
  `~/.config/eden-autoconfig-decky/` antes de reemplazar el bloque.
- Si borras el bloque, el `.conf` vuelve a tus valores anteriores. El
  `qt-config.ini` no se toca por borrar el bloque.

**Restaurar todo** (en **Avanzado**) devuelve el equipo al estado anterior a
N.E.C.A. Eden debe estar cerrado:

1. Restaura el `qt-config.ini` original, guardado la primera vez en
   `~/eden-autoconfig/stock/qt-config.ini` (ese fichero no se borra nunca).
2. Quita el bloque de preferencias del `.conf`.
3. Desactiva el hook de ES-DE (lo mueve fuera de
   `~/ES-DE/scripts/game-start/`).

Antes de tocar nada se guarda una copia del estado actual en
`~/eden-autoconfig/backups/`. Después, el panel muestra **Reactivar hook** para
volver a copiarlo. Si necesitas deshacer la restauración:

```bash
~/eden-autoconfig/eden-autoconfig.sh --list-backups
~/eden-autoconfig/eden-autoconfig.sh --restore latest
```

El plugin fija `RETENCION_BACKUPS=10`: conserva las **10 copias más recientes** de
`qt-config.ini` y borra las demás en cada aplicación. El original de `stock/` vive
aparte y no entra en esa rotación.

### Desinstalar

1. **Avanzado → Restaurar todo** para devolver el `qt-config.ini` y quitar el
   hook.
2. Quita el plugin desde Decky.

Si desinstalas sin restaurar, el hook seguirá en
`~/ES-DE/scripts/game-start/` y seguirá aplicando el `.conf` aunque el plugin ya
no esté. `~/eden-autoconfig` no se borra al desinstalar: ahí están tus plantillas,
backups y el `.conf`.

## Límites conocidos

- Solo se puede fijar **un mando concreto como Player 1** (`P1_SERIE`). El resto
  sigue el orden elegido (conexión o MAC). No hay “P2 = este mando exacto”.
- Si un mando no informa de su serie (pasa con algunos pads virtuales), no se
  puede fijar; el panel te lo dice.
- El **mando integrado** no se fija por serie: se pone como Player 1 con
  **Ajustes → Mando integrado**.
- Con **4 DualSense** conectados no queda hueco: el integrado pasa solo a **no
  usar** y no se puede cambiar hasta que desconectes uno. Al desconectarlo, el
  panel recupera tu elección anterior al volver a abrirse.
- El cambio automático del integrado ocurre al **abrir el panel** o al
  **Aplicar**. Si conectas el 4.º DualSense y lanzas el juego sin pasar por el
  panel, el hook aplica lo que quedó guardado; con abrir el panel una vez queda
  corregido.
- Con **Steam Input activado** para ES-DE, Eden ve pads virtuales de Valve. El
  panel detecta ese escenario, pero la asignación exacta Player N = DualSense N
  solo es fiable con Steam Input desactivado para ES-DE.
- Probado solo en **ROG Xbox Ally X**. En otras handhelds, `INTEGRADO_PATRON`
  puede necesitar ajuste en el `.conf`.

## Desarrollo

```bash
npx tsc --noEmit          # tipado
python3 test_backend.py   # pruebas del backend
bash build.sh             # sincroniza scripts/ + compila + genera el zip
```

`build.sh` necesita Node 20+ y Python 3. El zip lleva una carpeta raíz
`EdenAutoconfig/`.

- `scripts/` es una **copia generada** desde `eden_controller/` (la fuente de
  verdad). No se edita ahí; los cambios van a `eden_controller/` y se copian con
  `build.sh`.
- `scripts/VERSION` guarda versión y hash; el panel compara el hash con lo
  instalado y avisa si está desactualizado.
- El backend (`main.py`) no reimplementa nada: ejecuta los scripts instalados. Se
  puede probar sin consola con un `HOME` falso y `EDEN_FAKE_SDL`.
- Detalles de SDL, CRC del GUID, plantillas y diagnóstico:
  [README de `eden_controller`](https://github.com/CeDiqqu/decky-eca/blob/main/eden_controller/README.md).

## Licencia

BSD-3-Clause. Ver [LICENSE](https://github.com/CeDiqqu/decky-eca/blob/main/LICENSE).

Si algo no cuadra, abre un [issue](https://github.com/CeDiqqu/decky-eca/issues)
con el log de `~/eden-autoconfig/log.txt`.
