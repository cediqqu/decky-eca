# Changelog

Todos los cambios relevantes de E.C.A se documentan aquí. El formato sigue
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones usan
[SemVer](https://semver.org/lang/es/).

## [Unreleased]

<!-- Añade aquí los cambios sin versión. Al publicar, crea ## [x.y.z] - YYYY-MM-DD. -->

## [1.0.0] - 2026-11-02

### Añadido

- **Panel de mandos en el menú rápido de Steam.** Muestra los mandos que ve Eden,
  su conexión y la MAC cuando hay varios del mismo tipo, y permite fijar el
  Player 1 sin abrir una terminal.
- **Detección por SDL.** El panel y el hook consultan la misma SDL que usa Eden,
  así que usan el guid y el puerto reales de cada mando.
- **Player 1 por MAC.** Un DualSense concreto sigue siendo el principal aunque
  Steam renumere los puertos entre sesiones.
- **Selección de DualSense y mando integrado.** Permite elegir cuántos DualSense
  usar (1 a 4) y si el integrado es Player 1, va al final o no se usa.
- **Identificación por vibración.** Un toque vibra un DualSense; dos toques
  seguidos lo fijan como principal.
- **Restaurar todo.** Devuelve el `qt-config.ini` original, quita el bloque
  gestionado y desactiva el hook de ES-DE.
- **Copias de seguridad con retención.** Conserva las 10 copias más recientes de
  `qt-config.ini` y mantiene el original aparte en `stock/`.
- **Escenario de Steam Input.** El panel muestra cuándo Eden ve pads virtuales de
  Valve.
- **Documentación en español e inglés.** README principal en español y versión
  en inglés en `README.en.md`.

### Cambiado

- **README reescrito.** Corrige requisitos y límites, enlaza el zip directo y
  añade una comprobación de instalación.

### Seguridad

- **Ejecución sin root.** El backend corre como `deck`. Una vez instalados los
  scripts, el panel solo escribe el bloque gestionado del `.conf` y su estado en
  `~/.config/eden-autoconfig-decky/`.

[Unreleased]: https://github.com/CeDiqqu/decky-eca/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/CeDiqqu/decky-eca/releases/tag/v1.0.0
