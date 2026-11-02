# E.C.A: Eden Control Autoconfig

A [Decky](https://decky.xyz/) plugin that configures [Eden](https://eden-emu.dev/)'s
controllers from the Steam Quick Access Menu (QAM): it sets **Player 1**, picks
**how many DualSense controllers** to use and **what to do with the built-in
controller**, and applies it when a game launches from [ES-DE](https://es-de.org/).
No root.

[![Release](https://img.shields.io/github/v/release/CeDiqqu/decky-eca?label=release)](https://github.com/CeDiqqu/decky-eca/releases/latest)
[![License](https://img.shields.io/github/license/CeDiqqu/decky-eca)](https://github.com/CeDiqqu/decky-eca/blob/main/LICENSE)

[Español](https://github.com/CeDiqqu/decky-eca/blob/main/README.md) · **English**

> **Status:** v1.0.0 (Nov 2, 2026), first public release. Tested on **ROG Xbox
> Ally X** running SteamOS with a DualSense over Bluetooth. Maintained by
> [CeDiqqu](https://github.com/CeDiqqu), with no fixed release cadence.

Changes by version: [CHANGELOG.md](https://github.com/CeDiqqu/decky-eca/blob/main/CHANGELOG.md) (in Spanish).

Built for SteamOS handhelds with ES-DE (EmuDeck), not for Windows.

## Why E.C.A

- **Player 1 is stored by MAC, not by port.** Steam can renumber ports between
  sessions; E.C.A pins the exact controller.
- **In your configuration, it only writes one marked block** at the end of
  `eden-autoconfig.conf`. The rest of the file, your templates and your backups
  stay untouched.
- **It runs as `deck`, without root**, so Eden can still write its
  `qt-config.ini`.
- **It does not reimplement the logic**: the panel calls the `eden-autoconfig`
  scripts, the same ones you can use from a terminal.
- **It can be undone**: it restores the original `qt-config.ini`, removes the
  block and disables the hook.

When **not** to use it: if you do not launch games from ES-DE (the hook lives
there), if your handheld is not an ASUS model (the built-in controller pattern
may need tuning), or if you need to pin more than one player by MAC.

## Requirements

- **Decky Loader** with `api_version: 1` (the plugin declares that value).
- **SteamOS** on a handheld (tested on ROG Xbox Ally X). Windows is not
  supported.
- **Eden** (AppImage) with the `emudeck` profile at
  `<config>/input/emudeck.ini`, created by EmuDeck. If you use another profile,
  change `PERFIL` in `~/eden-autoconfig/eden-autoconfig.conf`.
- **ES-DE** with *Custom Event Scripts* enabled. The plugin expects ES-DE at
  `~/ES-DE` (EmuDeck's path); if it lives elsewhere, the hook is not installed
  automatically.
- **Eden closed** before *Apply* or *Restore*. Apply refuses to run while Eden is
  open; close it before restoring too, so it does not overwrite `qt-config.ini`
  on exit.
- Optional: write access to `/dev/hidraw*` for vibration. If it is missing, the
  panel shows a diagnostic and everything else keeps working.

The panel UI is in Spanish; the steps below show the labels exactly as they
appear, with the English meaning in parentheses.

## Installation

1. Download **[eca-decky.zip](https://github.com/CeDiqqu/decky-eca/releases/latest/download/eca-decky.zip)**.
2. On the handheld: **Decky → Developer → Install Plugin from ZIP**. It installs
   to `~/homebrew/plugins/EdenAutoconfig/` (the folder keeps that name so an
   update replaces the previous version).
3. Open the panel in the Quick Access Menu and press **Instalar scripts**
   (Install scripts) the first time. It copies the scripts to
   `~/eden-autoconfig`, installs the hook in `~/ES-DE/scripts/game-start/` if that
   folder exists, and checks that SDL responds.
4. In ES-DE: **Other settings → Enable custom event scripts**.

Check that **Estado** (Status) shows `scripts 1.0.0 · hook OK`. You can also
check from a terminal:

```bash
~/eden-autoconfig/eden-autoconfig.sh --status
```

It should find Eden and the `emudeck` profile and report `Eden en ejecucion: no`.

To update, install the new zip; there is no need to uninstall the old version
first.

## Quick start

1. Connect the controllers and open the panel: it refreshes on its own.
2. With **a single DualSense**, it is set as the primary controller
   automatically and its card gets a **gold ★**. If a primary is already set, it
   stays primary while it is connected.
3. To change the primary controller, **double-tap** another card (less than
   1.5 s apart). A single tap only vibrates, so you cannot change it by accident.
4. Set **how many DualSense controllers** to use (1 to 4) and what to do with the
   **built-in controller** under **Ajustes** (Settings).
5. **Avanzado → Aplicar ahora** (Advanced → Apply now) writes the configuration.
   The badges on the cards show which player each controller would get before
   you apply; nothing is written until then.

**Estado** (Status) is a fixed row with the scenario, the controllers, the
version and the hook state. **Ajustes** (Settings) and **Avanzado** (Advanced)
are collapsed: press A on their header to open them. **Mandos** (Controllers) is
always open, and **Recargar mandos** (Reload controllers) sits right below the
cards.

Each card shows the family **icon** (PlayStation, Xbox, Switch, Steam or
built-in), the **connection** (Bluetooth, USB, Internal or Virtual), and, only
when there are several controllers of the same type, a **MAC** suffix to tell
them apart. Unknown controllers also show their name.

Short notices are drawn inside the panel and disappear after 5 s. Long errors
(for example, the `hidraw` diagnostic) open in a window so you can read or copy
them.

## Identifying a controller by vibration

- **One tap** on a DualSense card: the controller vibrates for 300 ms and the
  card flashes cyan.
- **Two taps in a row** (less than 1.5 s apart): that controller becomes the
  primary one.
- **DualSense only**: it is the only implemented protocol. The built-in
  controller does not vibrate; use another method to identify other controller
  types.
- The controller is located by its MAC (`uniq` or the `uevent`'s `HID_UNIQ`). If
  the system does not expose it, the only connected DualSense or the port order
  is used. If that fails, the panel shows a diagnostic of
  `/sys/class/hidraw`.
- Without permission on `/dev/hidraw*`, vibration does not work; the rest of the
  plugin still does.

## What it writes (and how to undo it)

Once the scripts are installed, the panel only writes two things on your system:

1. A **managed block** at the end of `~/eden-autoconfig/eden-autoconfig.conf`.
2. Its private state in `~/.config/eden-autoconfig-decky/`.

The block is replaced as a whole; the rest of the `.conf` is untouched. Example:

```ini
# >>> eden-autoconfig-decky >>>
P1_SERIE="4c:b9:9b:e9:bc:26"
JUGADORES_MAX=2
ORDEN_INTEGRADO="ignorar"
ORDEN_DUALSENSE="mac"
RETENCION_BACKUPS=10
# <<< eden-autoconfig-decky <<<
```

- The ES-DE hook reads that same `.conf`, so what you choose in the panel is what
  gets applied when the game launches.
- If the `.conf` already existed, a copy of the previous version is saved in
  `~/.config/eden-autoconfig-decky/` before the block is replaced.
- If you delete the block, the `.conf` goes back to your previous values.
  Deleting the block does not touch `qt-config.ini`.

**Restaurar todo** (Restore everything) under **Avanzado** (Advanced) returns the
device to its pre-E.C.A state. Eden must be closed:

1. It restores the original `qt-config.ini`, saved the first time in
   `~/eden-autoconfig/stock/qt-config.ini` (that file is never deleted).
2. It removes the preferences block from the `.conf`.
3. It disables the ES-DE hook (moves it out of
   `~/ES-DE/scripts/game-start/`).

Before changing anything, it saves a copy of the current state in
`~/eden-autoconfig/backups/`. After that, the panel shows **Reactivar hook**
(Reactivate hook) to install the hook again. If you need to undo the restore:

```bash
~/eden-autoconfig/eden-autoconfig.sh --list-backups
~/eden-autoconfig/eden-autoconfig.sh --restore latest
```

The plugin sets `RETENCION_BACKUPS=10`: it keeps the **10 most recent**
`qt-config.ini` backups and deletes the rest on each apply. The original in
`stock/` lives separately and is not part of that rotation.

### Uninstall

1. **Avanzado → Restaurar todo** (Advanced → Restore everything) to put the
   `qt-config.ini` back and remove the hook.
2. Remove the plugin from Decky.

If you uninstall without restoring, the hook remains in
`~/ES-DE/scripts/game-start/` and keeps applying the `.conf` even though the
plugin is gone. Uninstalling does not delete `~/eden-autoconfig`: your
templates, backups and `.conf` live there.

## Known limits

- Only **one specific controller can be pinned as Player 1** (`P1_SERIE`). The
  rest follow the chosen order (connection or MAC). There is no “P2 = this exact
  controller”.
- If a controller does not report a serial (some virtual pads), it cannot be
  pinned; the panel tells you.
- The **built-in controller** is not pinned by serial: it is set as Player 1
  with **Ajustes → Mando integrado** (Settings → Built-in controller).
- With **4 DualSense** controllers connected there is no room left: the built-in
  controller is automatically set to **not used** and cannot be changed until you
  disconnect one. When you do, the panel restores your previous choice the next
  time it opens.
- The automatic built-in change happens when the **panel opens** or when you
  **Apply**. If you connect the 4th DualSense and launch a game without opening
  the panel, the hook applies what was saved; opening the panel once fixes it.
- With **Steam Input enabled** for ES-DE, Eden sees Valve's virtual pads. The
  panel detects that scenario, but the exact Player N = DualSense N mapping is
  only reliable with Steam Input disabled for ES-DE.
- Tested only on **ROG Xbox Ally X**. On other handhelds, `INTEGRADO_PATRON` may
  need adjustment in the `.conf`.

## Development

```bash
npx tsc --noEmit          # type check
python3 test_backend.py   # backend tests
bash build.sh             # sync scripts/ + build + package the zip
```

`build.sh` requires Node 20+ and Python 3. The zip contains a single root
folder, `EdenAutoconfig/`.

- `scripts/` is a **generated copy** of `eden_controller/` (the source of truth).
  Do not edit it there; change `eden_controller/` and copy with `build.sh`.
- `scripts/VERSION` stores the version and hash; the panel compares the hash
  with the installed copy and warns when it is out of date.
- The backend (`main.py`) does not reimplement anything: it runs the installed
  scripts. It can be tested without a console using a fake `HOME` and
  `EDEN_FAKE_SDL`.
- SDL, GUID CRC, templates and diagnostics:
  [`eden_controller` README](https://github.com/CeDiqqu/decky-eca/blob/main/eden_controller/README.md)
  (in Spanish).

## License

BSD-3-Clause. See [LICENSE](https://github.com/CeDiqqu/decky-eca/blob/main/LICENSE).

If something does not add up, open an
[issue](https://github.com/CeDiqqu/decky-eca/issues) with the log from
`~/eden-autoconfig/log.txt`.
