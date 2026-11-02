# E.C.A — Eden Control Autoconfig (plugin de Decky)

Panel en el **menú rápido de Steam (QAM)** para gestionar los mandos de
[Eden](https://eden-emu.dev/) sin abrir una terminal:

- Ver qué mandos ve Eden: tipo (DualSense / integrado / pad virtual), conexión
  (Bluetooth / USB / virtual de Steam), puerto y **serie (MAC)**.
- Elegir **qué mando es el Player 1**, aunque Steam cambie los puertos entre
  sesiones.
- Elegir **cuántos DualSense** configurar y qué hacer con el mando integrado.
- **Previsualizar** lo que se aplicaría (no escribe nada), **aplicar**,
  volver al estado anterior a E.C.A y ver el **log**.

Todo se maneja con **mando o táctil**: D-pad + A/B. No hace falta teclado.

## Requisitos

- Decky Loader **3.x** (`api_version: 1`).
- SteamOS (probado en **ROG Ally X**).
- ES-DE con *Custom Event Scripts* activado (el panel avisa y lo explica).
- Este plugin **no** necesita root: corre como `deck`, para que Eden pueda
  seguir escribiendo su configuración.

## Instalación

1. Descarga `eca-decky.zip` de la última Release (o genera el tuyo
   con `bash build.sh`).
2. En la consola: **Decky → Developer → Install Plugin from ZIP**.
   Se instala en `~/homebrew/plugins/EdenAutoconfig/` (la carpeta conserva
   ese nombre a propósito: así la actualización sustituye a la versión
   anterior en vez de dejar dos plugins instalados).
3. Abre el panel del plugin en el menú rápido y pulsa **Instalar scripts**
   (la primera vez). Eso copia los scripts a `~/eden-autoconfig`, deja el hook
   de ES-DE en `~/ES-DE/scripts/game-start/` y comprueba que SDL responde.
4. En ES-DE: *Other settings → Enable custom event scripts*.

## Uso diario

1. Conecta los mandos.
2. Abre el panel → **Recargar mandos**.
3. Con **un solo mando**, se fija solo como **mando principal**: su tarjeta
   lleva una **★ dorada** arriba a la derecha. Al conectar más, sigue siendo el
   principal hasta que pulses **A** en otro (no hace falta liberar nada).
4. Cada tarjeta se identifica por su **icono** (PlayStation, Xbox, Switch,
   Steam o mando integrado) y muestra la **conexión** (`Bluetooth`, `USB`,
   `Interno`, `Virtual`) con su icono. Solo si el mando es **desconocido**
   aparece su nombre. Arriba a la derecha: **★ dorada** si es el principal, o el
   **número de jugador** en un badge azul (`2`, `3`, `4`…). Con **dos o más**
   mandos del mismo tipo se añade un sufijo de la MAC.
5. Con **dos o más mandos** la lista pasa a **tarjetas cuadradas, 2 por fila**
   (4 mandos = 2 filas de 2). Con uno solo se ve una tarjeta ancha.
6. Ajusta cuántos mandos configurar y qué hacer con el integrado.
7. **Recargar mandos** está justo debajo de las tarjetas (el panel ya se
   refresca al abrirse).
8. **Estado**, **Ajustes** y **Avanzado** están **plegadas**: pulsa A en su
   cabecera para abrirlas (la cabecera muestra un resumen, así no hace falta
   abrirlas para nada habitual). La sección **Mandos** siempre está abierta.
9. Todo lo de soporte (*Aplicar ahora*, *Restaurar todo*, *Ver log*) está
   dentro de **Avanzado**, fuera del camino normal.

Los avisos cortos (por qué no se puede fijar un mando, "pulsa otra vez", etc.)
salen como **notificaciones** que Steam retira solas. Si el aviso es largo (el
diagnóstico de `hidraw`), se abre en una **ventana** para poder leerlo o
copiarlo.

### Reconocer un mando (vibración)

- **A sobre una tarjeta** → ese mando **vibra 300 ms** y la tarjeta destella en
  cian. Sirve para saber cuál es cuál cuando se han mezclado.
- **Dos toques seguidos (menos de 1,5 s)** → ese mando pasa a ser el principal.
  Un solo toque solo vibra, así no se cambia el principal sin querer.
- Solo DualSense (el integrado y los de otros tipos usan otro protocolo). Si no
  hay permisos sobre `/dev/hidraw*`, el panel lo dice.
- Para encontrar el mando se usa su **MAC** (`uniq` o `HID_UNIQ` del `uevent`);
  si el sistema no la da, se usa el único DualSense conectado o el **orden de
  puerto**. Si aun así falla, el panel muestra un **diagnóstico** con lo que ve
  en `/sys/class/hidraw`.
- Nota técnica: el reporte de Bluetooth lleva un **CRC-32 con semilla `0xA2`**
  (`crc32(0xA2 || reporte)`). Con un CRC normal, el mando descarta el reporte en
  silencio.

El botón **Instalar scripts** solo aparece si faltan o están desfasados; cuando
todo está al día, no ocupa sitio.

### Mando integrado con 4 mandos

Con **4 mandos** conectados no queda hueco: el mando integrado pasa solo a
**«no usar»** (la fila indica `(auto)` y no se puede cambiar). Cuando
desconectas uno, el panel **recupera tu elección anterior** (`primero` o
`ultimo`) automáticamente. Tu preferencia se guarda en
`~/.config/eden-autoconfig-decky/estado.json`.

## Cómo guarda tus ajustes

Escribe un **bloque gestionado** al final de
`~/eden-autoconfig/eden-autoconfig.conf`:

```ini
# >>> eden-autoconfig-decky >>>
P1_SERIE="4c:b9:9b:e9:bc:26"
JUGADORES_MAX=2
ORDEN_INTEGRADO="ignorar"
ORDEN_DUALSENSE="mac"
# <<< eden-autoconfig-decky <<<
```

- Solo se reemplaza ese bloque; **el resto del fichero queda igual** (con copia
  de seguridad previa en `~/.config/eden-autoconfig-decky/`).
- El hook de ES-DE lee ese mismo `.conf`, así que lo que elijas en el panel es
  lo que se aplica al lanzar el juego.
- Si borras el bloque, vuelves exactamente a tu configuración anterior.

## Restaurar todo (volver atrás)

**Avanzado → Restaurar todo** devuelve el equipo al estado anterior a E.C.A:

1. Restaura el `qt-config.ini` **original**, guardado la primera vez en
   `~/eden-autoconfig/stock/qt-config.ini` (ese fichero no se borra nunca).
2. Quita el **bloque de preferencias** del `.conf`.
3. **Desactiva el hook** de ES-DE (lo mueve fuera de
   `~/ES-DE/scripts/game-start/`).

Se guarda una copia del estado actual antes de tocar nada, así que se puede
deshacer. Después, el panel muestra arriba **«Reactivar hook»**: al pulsarlo se
vuelve a copiar el hook y todo funciona como antes.

### Copias de seguridad

El bloque del plugin fija `RETENCION_BACKUPS=10`: el script conserva solo las
**10 copias más recientes** de `qt-config.ini` (unos 300 KB) y borra el resto en
cada aplicación. El original para «Restaurar todo» vive aparte, en `stock/`, y
no entra en esa rotación.

## Límites conocidos

- Solo se puede fijar **un mando concreto como mando principal**
  (`P1_SERIE`). El resto de jugadores sigue el orden elegido (conexión o MAC).
  Si quieres "P2 = este mando exacto", hoy no se puede sin tocar el script.
- Si un mando no informa de su serie (pasa con algunos pads virtuales), no se
  puede fijar; el panel te lo dice.
- El **mando integrado** no se fija por serie: se pone como Player 1 con el
  ajuste «Mando integrado → Player 1».
- El cambio automático del integrado ocurre al **abrir el panel**, al
  **Aplicar**. Si conectas el 4º DualSense y lanzas el
  juego sin pasar por el panel, el hook aplica lo que quedó guardado (con
  `ultimo` serían 5 jugadores); con abrir el panel una vez queda corregido.
- Probado solo en ROG Ally X. En otras consolas el patrón del mando integrado
  (`INTEGRADO_PATRON`) puede necesitar ajuste en el `.conf`.

## Desarrollo

```bash
bash build.sh        # sincroniza scripts/ + compila + genera el zip
```

Paleta del panel (estilo Joy-Con): azul `#0AB9E6` para lo general, rojo
`#FF3C28` para el mando principal, dorado `#F5C518` para la estrella, verde
`#32E632` (USB) y violeta `#B400E6` (virtual/otros). Las tarjetas usan fondo
carbón con texto claro fijo, para que se vean igual en tema claro y oscuro.

- `scripts/` es una **copia generada** desde `eden_controller/` (la carpeta de
  los scripts, dentro de este mismo proyecto). **No se edita aquí**: los cambios
  van a esa carpeta y se vuelven a copiar con `build.sh`.
- `scripts/VERSION` guarda versión + hash; el panel compara el hash con lo
  instalado y avisa si está desactualizado.
- El backend (`main.py`) no reimplementa nada: ejecuta los scripts instalados.
  Se puede probar sin consola con un `HOME` falso y `EDEN_FAKE_SDL`.

## Desinstalar

Quita el plugin desde Decky. **No se borra** `~/eden-autoconfig` (ahí están tus
plantillas, backups y el `.conf`); si quieres volver a la configuración previa
del todo, borra el bloque marcado del `.conf`.
