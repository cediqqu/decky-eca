import type { CSSProperties, ReactNode } from "react";
import {
  ButtonItem,
  ConfirmModal,
  DialogBody,
  DialogBodyText,
  DialogButton,
  DialogButtonPrimary,
  DialogFooter,
  ModalRoot,
  PanelSection,
  PanelSectionRow,
  showModal,
  staticClasses,
} from "@decky/ui";
import { call, definePlugin } from "@decky/api";
import { SiAsus, SiLenovo, SiMsi, SiSteamdeck } from "react-icons/si";
import { useEffect, useRef, useState } from "react";
import {
  FaBan,
  FaBluetoothB,
  FaCheck,
  FaChevronDown,
  FaChevronRight,
  FaCog,
  FaDownload,
  FaExclamationTriangle,
  FaFileAlt,
  FaGamepad,
  FaInfoCircle,
  FaMicrochip,
  FaMinus,
  FaPalette,
  FaPlaystation,
  FaSlidersH,
  FaStar,
  FaSteam,
  FaSyncAlt,
  FaUndo,
  FaUsb,
  FaQuestion,
  FaXbox,
} from "react-icons/fa";

// ---------------------------------------------------------------------------
//  Tipos que devuelve main.py
// ---------------------------------------------------------------------------
type Mando = {
  nombre: string;
  sdl: string;
  clase: string;
  familia: string;
  conexion: string;
  guid: string;
  puerto: string;
  serie: string;
  virtual: boolean;
  gamepad: boolean;
  principal: boolean;
  es_principal: boolean;
  jugador: number | null;
};

type Prefs = {
  P1_SERIE: string;
  JUGADORES_MAX: string;
  ORDEN_INTEGRADO: string;
  ORDEN_DUALSENSE: string;
  COLOR: string;
};

type Maquina = { vendor: string; producto: string; placa: string };

type PlanMando = { n: string; nombre: string; clase: string };

type Plan = {
  sistema: string;
  fecha: string;
  modo: string;
  max: string;
  sdl: string;
  lib: string;
  detectados: string;
  mandos: PlanMando[];
  fuera: string[];
  aviso: string[];
};

type Estado = {
  ok: boolean;
  instalado: boolean;
  ruta: string;
  base: string;
  conf: string;
  prefs: Prefs;
  mandos: Mando[];
  escenario: string;
  ds_conectados: number;
  otros_conectados: number;
  integrado_auto: boolean;
  hook: boolean;
  esde: boolean | null;
  version: string;
  hash_instalado: string;
  desactualizado: boolean;
  reparar: boolean;
  faltan: string[];
  planes: Record<string, Plan | null>;
  maquina: Maquina;
  aviso: string;
};

type Salida = { exit: number; salida: string; mensaje?: string };

// ---------------------------------------------------------------------------
//  Paleta (Joy-Con) y utilidades
// ---------------------------------------------------------------------------
const C = {
  azul: "#0AB9E6",
  rojo: "#FF3C28",
  verde: "#3DDC84",
  violeta: "#B47BFF",
  naranja: "#FF8A3D",
  rosa: "#FF5C8A",
  turquesa: "#2EE6C8",
  ambar: "#FFB454",
  dorado: "#F5C518",
  carbon1: "#262628",
  carbon2: "#141416",
  texto: "#EDEFF2",
  texto2: "#B8BCC2",
  gris: "#8A8F98",
};

// acentos que puede elegir el usuario (el "color" del plugin)
const ACENTOS: Record<string, { nombre: string; hex: string }> = {
  azul: { nombre: "Azul", hex: "#0AB9E6" },
  verde: { nombre: "Verde", hex: "#3DDC84" },
  violeta: { nombre: "Violeta", hex: "#B47BFF" },
  naranja: { nombre: "Naranja", hex: "#FF8A3D" },
  rosa: { nombre: "Rosa", hex: "#FF5C8A" },
  turquesa: { nombre: "Turquesa", hex: "#2EE6C8" },
};

function hexA(hex: string, alfa: number): string {
  const h = hex.replace("#", "");
  const completo =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(completo, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alfa})`;
}

function colorDe(m: Mando): string {
  switch (m.familia) {
    case "playstation":
      return C.azul;
    case "xbox":
      return C.verde;
    case "switch":
      return C.rojo;
    case "steam":
      return C.violeta;
    default:
      return C.gris;
  }
}

function IconoFamilia(props: { familia: string; size: number }) {
  switch (props.familia) {
    case "playstation":
      return <FaPlaystation size={props.size} />;
    case "xbox":
      return <FaXbox size={props.size} />;
    case "steam":
      return <FaSteam size={props.size} />;
    case "switch":
    case "integrado":
      return <FaGamepad size={props.size} />;
    default:
      return <FaQuestion size={props.size} />;
  }
}

function colorConexion(conexion: string): string {
  if (conexion.startsWith("Bluetooth")) return C.azul;
  if (conexion === "USB") return C.verde;
  if (conexion.startsWith("Virtual")) return C.violeta;
  return C.gris;
}

function macCorta(serie: string): string {
  const partes = (serie || "").split(":");
  if (partes.length >= 2) {
    return `…${partes[partes.length - 2]}:${partes[partes.length - 1]}`;
  }
  return serie;
}

const ESCENARIO_CORTO: Record<string, string> = {
  nativo: "Nativo",
  steam_input: "Steam Input",
  steam_input_integrado: "Steam Input · integrado",
  solo_integrado: "Solo integrado",
  sin_mandos: "Sin mandos",
};

const INTEGRADO_TXT: Record<string, string> = {
  ignorar: "no usar",
  primero: "Player 1",
  ultimo: "ultimo jugador",
};

const ESTILOS = `
@keyframes ede-latido {
  0%, 100% { opacity: .88; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}
@keyframes ede-aparecer {
  from { opacity: 0; transform: translateY(-2px); }
  to   { opacity: 1; transform: none; }
}
.ede-estrella { animation: ede-latido 2.6s ease-in-out infinite; }
/* el boton de la celda no necesita padding propio: lo pone la tarjeta */
.ede-celda > div { padding: 0 !important; border-radius: 16px !important; }
/* capa de foco de Steam: mas suave y dentro de la tarjeta */
.ede-zona .gpfocus { background: rgba(255,255,255,0.05) !important; border-radius: 14px !important; }
/* --- tarjetas: foco y micro-animaciones (estilo PdC) --- */
.ede-tarjeta { transition: box-shadow 140ms ease, transform 140ms ease, border-color 140ms ease; }
.ede-zona .gpfocus .ede-tarjeta,
.ede-celda:hover .ede-tarjeta {
  border-color: var(--ede-acento, #0AB9E6) !important;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22),
              0 0 0 2px var(--ede-acento, #0AB9E6),
              0 0 14px var(--ede-acento-halo, rgba(10,185,230,0.45)) !important;
  transform: scale(1.02);
}
.ede-icono-tile { display: inline-flex; transition: transform 160ms ease, filter 160ms ease; }
.ede-zona .gpfocus .ede-icono-tile { transform: scale(1.08); filter: brightness(1.12); }
.ede-icono-caja { display: inline-flex; align-items: center; justify-content: center; transition: box-shadow 160ms ease; }
.ede-zona .gpfocus .ede-icono-caja { box-shadow: 0 0 12px var(--ede-glow, rgba(10,185,230,0.55)); }
.ede-zona .gpfocus .ede-anim-pop { animation: ede-icono-pop 420ms cubic-bezier(.2,.8,.2,1) both; }
.ede-zona .gpfocus .ede-anim-giro { animation: ede-icono-giro 480ms ease-out both; }
.ede-zona .gpfocus .ede-anim-latido { animation: ede-icono-latido 460ms ease-out both; }
.ede-zona .gpfocus .ede-anim-barrido { animation: ede-icono-barrido 380ms ease-out both; }
@keyframes ede-icono-pop { 0% { transform: scale(.82); } 60% { transform: scale(1.14); } 100% { transform: scale(1); } }
@keyframes ede-icono-giro { 0% { transform: rotate(-30deg); } 70% { transform: rotate(5deg); } 100% { transform: rotate(0); } }
@keyframes ede-icono-latido { 0% { transform: scale(.9); opacity: .7; } 55% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); } }
@keyframes ede-icono-barrido { 0% { transform: translateY(3px); opacity: .5; } 100% { transform: translateY(0); opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .ede-tarjeta, .ede-icono-tile, .ede-icono-caja { transition: none; }
  .ede-zona .gpfocus .ede-tarjeta { transform: none; }
  .ede-zona .gpfocus .ede-icono-tile,
  .ede-zona .gpfocus .ede-anim-pop,
  .ede-zona .gpfocus .ede-anim-giro,
  .ede-zona .gpfocus .ede-anim-latido,
  .ede-zona .gpfocus .ede-anim-barrido { animation: none; transform: none; }
}
.ede-aparecer { animation: ede-aparecer 150ms ease-out; }
@media (prefers-reduced-motion: reduce) {
  .ede-estrella, .ede-aparecer { animation: none; }
}
`;

// ---------------------------------------------------------------------------
//  Piezas visuales
// ---------------------------------------------------------------------------
/** Icono dentro de un circulo (estilo ajustes de Switch). */
function CirculoIcono(props: {
  children: ReactNode;
  color: string;
  lado?: number;
}) {
  const lado = props.lado ?? 26;
  return (
    <span
      style={{
        width: `${lado}px`,
        height: `${lado}px`,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        background: hexA(props.color, 0.18),
        border: `1px solid ${hexA(props.color, 0.45)}`,
        color: props.color,
      }}
    >
      {props.children}
    </span>
  );
}

/** Tarjeta de aviso (icono a la izquierda), como las notificaciones de Switch. */
function Aviso(props: {
  children: ReactNode;
  tono?: "info" | "atencion";
  onClick?: () => void;
}) {
  const color = props.tono === "atencion" ? C.rojo : C.azul;
  return (
    <div
      onClick={props.onClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "9px 12px",
        borderRadius: "14px",
        border: "1px solid rgba(128,128,128,0.22)",
        background:
          "linear-gradient(120deg, rgba(22,22,24,0.92), rgba(30,30,33,0.78))",
        color: C.texto,
        fontSize: "0.78em",
        lineHeight: 1.4,
        whiteSpace: "pre-wrap",
      }}
    >
      <CirculoIcono color={color} lado={26}>
        {props.tono === "atencion" ? (
          <FaExclamationTriangle size={11} />
        ) : (
          <FaInfoCircle size={11} />
        )}
      </CirculoIcono>
      <div style={{ minWidth: 0 }}>{props.children}</div>
    </div>
  );
}

/** Glifo circular tipo prompt de Switch. */
function GlifoA() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "15px",
        height: "15px",
        borderRadius: "50%",
        background: "#fff",
        color: "#1a1a1a",
        fontSize: "0.62em",
        fontWeight: 800,
        lineHeight: 1,
        flex: "0 0 auto",
      }}
    >
      A
    </span>
  );
}

function Chip(props: {
  texto: string;
  color?: string;
  tenue?: boolean;
  icono?: ReactNode;
}) {
  const color = props.color ?? C.azul;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "0.66em",
        fontWeight: 700,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        color: props.tenue ? "inherit" : color,
        opacity: props.tenue ? 0.75 : 1,
        border: `1px solid ${props.tenue ? "rgba(128,128,128,0.4)" : hexA(color, 0.5)}`,
        background: props.tenue ? "rgba(128,128,128,0.14)" : hexA(color, 0.14),
      }}
    >
      {props.icono}
      {props.texto}
    </span>
  );
}

function IconoConexion(props: { conexion: string; size?: number }) {
  const s = props.size ?? 9;
  if (props.conexion.startsWith("Bluetooth")) return <FaBluetoothB size={s} />;
  if (props.conexion === "USB") return <FaUsb size={s} />;
  if (props.conexion.startsWith("Virtual")) return <FaSteam size={s} />;
  return <FaMicrochip size={s} />;
}

function IconoTile(props: { m: Mando; lado: number }) {
  const color = colorDe(props.m);
  return (
    <div
      style={{
        width: `${props.lado}px`,
        height: `${props.lado}px`,
        borderRadius: "9px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        background: `linear-gradient(145deg, ${hexA(color, 0.35)}, ${hexA(color, 0.06)})`,
        border: `1px solid ${hexA(color, 0.5)}`,
        boxShadow: `inset 0 0 10px ${hexA(color, 0.15)}`,
        color,
      }}
    >
      <IconoFamilia familia={props.m.familia} size={props.lado * 0.55} />
    </div>
  );
}

function estiloBadge(color: string): CSSProperties {
  return {
    position: "absolute",
    top: "5px",
    right: "5px",
    minWidth: "18px",
    height: "18px",
    padding: "0 4px",
    borderRadius: "999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.64em",
    fontWeight: 800,
    lineHeight: 1,
    color,
    background: "rgba(0,0,0,0.55)",
    border: `1px solid ${hexA(color, 0.7)}`,
    boxShadow: `0 0 7px ${hexA(color, 0.35)}`,
    boxSizing: "border-box",
  };
}

/** Arriba a la derecha: estrella si es el principal; si no, su jugador. */
function Badge(props: { m: Mando }) {
  const { m } = props;

  if (m.es_principal) {
    return (
      <FaStar
        className="ede-estrella"
        style={{
          position: "absolute",
          top: "4px",
          right: "6px",
          color: C.dorado,
          fontSize: "0.88em",
          filter: `drop-shadow(0 0 4px ${hexA(C.dorado, 0.9)})`,
        }}
      />
    );
  }

  if (m.jugador) {
    return <div style={estiloBadge(C.azul)}>{m.jugador}</div>;
  }

  return (
    <div style={{ ...estiloBadge(C.gris), width: "18px", padding: 0 }}>
      {m.clase === "Integrado" ? <FaBan size={8} /> : <FaMinus size={8} />}
    </div>
  );
}

function estiloTarjeta(principal: boolean, color: string): CSSProperties {
  return {
    position: "relative",
    borderRadius: "16px",
    boxSizing: "border-box",
    overflow: "hidden",
    color: C.texto,
    border: `1px solid ${principal ? hexA(C.rojo, 0.8) : "rgba(255,255,255,0.10)"}`,
    background:
      `radial-gradient(130% 100% at 100% 0%, ${hexA(color, 0.22)}, transparent 62%), ` +
      `linear-gradient(155deg, ${C.carbon1}, ${C.carbon2})`,
    boxShadow: principal
      ? `0 0 12px ${hexA(C.rojo, 0.35)}, inset 0 0 14px ${hexA(C.rojo, 0.10)}`
      : "0 1px 3px rgba(0,0,0,0.45)",
    transition: "border-color 180ms ease, box-shadow 180ms ease",
  };
}

// --- tarjeta ancha (1 mando) ----------------------------------------------
function FilaMando(props: {
  m: Mando;
  mostrarMac: boolean;
  destello: boolean;
  onClick: () => void;
}) {
  const { m, mostrarMac, destello, onClick } = props;
  const color = colorDe(m);
  return (
    <ButtonItem layout="below" onClick={onClick}>
      <div
        className="ede-tarjeta"
        style={{
          ...estiloTarjeta(m.es_principal, color),
          ...(destello
            ? {
                border: `1px solid ${C.azul}`,
                boxShadow: `0 0 16px ${hexA(C.azul, 0.6)}`,
              }
            : null),
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "9px 46px 9px 9px",
        }}
      >
        <Badge m={m} />
        <IconoTile m={m} lado={36} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            {m.familia === "desconocido" ? (
              <span style={{ fontWeight: 700, fontSize: "0.95em" }}>
                {m.sdl || m.nombre || m.clase}
              </span>
            ) : null}
            {mostrarMac && m.serie ? (
              <span style={{ fontSize: "0.58em", color: C.texto2, opacity: 0.55 }}>
                {macCorta(m.serie)}
              </span>
            ) : null}
          </div>
          <div style={{ marginTop: "4px" }}>
            <Chip
              texto={m.conexion}
              color={colorConexion(m.conexion)}
              icono={<IconoConexion conexion={m.conexion} size={9} />}
            />
          </div>
        </div>
      </div>
    </ButtonItem>
  );
}

// --- tarjeta cuadrada (2 o mas mandos) -------------------------------------
function MandoCuadrado(props: {
  m: Mando;
  mostrarMac: boolean;
  destello: boolean;
  onClick: () => void;
}) {
  const { m, mostrarMac, destello, onClick } = props;
  const color = colorDe(m);
  return (
    <ButtonItem layout="below" onClick={onClick}>
      <div
        className="ede-tarjeta"
        style={{
          ...estiloTarjeta(m.es_principal, color),
          ...(destello
            ? {
                border: `1px solid ${C.azul}`,
                boxShadow: `0 0 16px ${hexA(C.azul, 0.6)}`,
              }
            : null),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "96px",
          width: "100%",
          padding: 0,
          textAlign: "center",
        }}
      >
        <Badge m={m} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
            flex: 1,
            padding: "10px 5px 5px",
          }}
        >
          <IconoTile m={m} lado={34} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              fontSize: "0.6em",
              color: colorConexion(m.conexion),
            }}
          >
            <IconoConexion conexion={m.conexion} size={8} />
            {m.conexion}
          </div>
          {mostrarMac && m.serie ? (
            <div
              style={{
                fontSize: "0.53em",
                color: C.texto2,
                opacity: 0.5,
                lineHeight: 1,
              }}
            >
              {macCorta(m.serie)}
            </div>
          ) : null}
        </div>
        {m.familia === "desconocido" ? (
          <div
            style={{
              padding: "3px 5px",
              background: "rgba(0,0,0,0.38)",
              borderTop: `1px solid ${hexA(color, 0.3)}`,
              fontSize: "0.64em",
              fontWeight: 700,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {m.sdl || m.nombre || m.clase}
          </div>
        ) : null}
      </div>
    </ButtonItem>
  );
}

function BotonAccion(props: {
  icono: ReactNode;
  texto: string;
  onClick: () => void;
}) {
  return (
    <ButtonItem layout="below" onClick={props.onClick}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          padding: "4px 8px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(128,128,128,0.18)",
        }}
      >
        <CirculoIcono color={C.azul} lado={22}>
          {props.icono}
        </CirculoIcono>
        <span>{props.texto}</span>
      </div>
    </ButtonItem>
  );
}

// --- icono de la maquina integrada -----------------------------------------
function IconoPortatil(props: { size?: number }) {
  const lado = props.size ?? 17;
  return (
    <svg
      width={lado}
      height={lado}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-1.5a2 2 0 0 1-1.7-.9l-.8-1.2a1.2 1.2 0 0 0-2 0l-.8 1.2a2 2 0 0 1-1.7.9H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 1.8A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h.8l.8-1.2a3 3 0 0 1 4.8 0l.8 1.2H17a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8H7Z" />
      <rect x="6.6" y="6.4" width="10.8" height="6.8" rx="1.2" />
      <circle cx="8.1" cy="16.3" r="1.05" />
      <circle cx="15.9" cy="16.3" r="1.05" />
    </svg>
  );
}

function textoMaquina(m: Maquina | null | undefined, nombre: string): string {
  return `${m?.vendor ?? ""} ${m?.producto ?? ""} ${m?.placa ?? ""} ${nombre}`.toLowerCase();
}

// "ROG Ally RC71L_RC71L" -> "ROG Ally"; "ROG Ally X RC72LA_RC72LA" -> "ROG Ally X"
function limpiarModelo(producto: string): string {
  return (producto || "")
    .replace(/\s+[A-Z0-9][A-Z0-9_-]{4,}$/, "")
    .trim();
}

function nombreMaquina(m: Maquina | null | undefined): string {
  if (!m) return "";
  const t = textoMaquina(m, "");
  if (
    t.includes("valve") ||
    t.includes("jupiter") ||
    t.includes("galileo") ||
    t.includes("steam deck")
  ) {
    return "Steam Deck";
  }
  if (t.includes("asustek") || t.includes("asus")) {
    return limpiarModelo(m.producto) || limpiarModelo(m.placa) || "ROG Ally";
  }
  if (t.includes("micro-star") || t.includes("msi")) {
    return limpiarModelo(m.producto) || limpiarModelo(m.placa) || "MSI Claw";
  }
  if (t.includes("lenovo") || t.includes("legion")) {
    // Lenovo suele traer un codigo en product_name ("83E1"): mejor la placa.
    return limpiarModelo(m.placa) || limpiarModelo(m.producto) || "Legion Go";
  }
  return limpiarModelo(m.producto) || limpiarModelo(m.placa);
}

function IconoMaquina(props: {
  maquina?: Maquina | null;
  nombre: string;
  size?: number;
}) {
  const t = textoMaquina(props.maquina, props.nombre);
  const lado = props.size ?? 17;
  if (
    t.includes("valve") ||
    t.includes("jupiter") ||
    t.includes("galileo") ||
    t.includes("steam deck") ||
    t.includes("deck controller")
  ) {
    return <SiSteamdeck size={lado} />;
  }
  if (
    t.includes("asustek") ||
    t.includes("asus") ||
    t.includes("rog") ||
    t.includes("ally")
  ) {
    return <SiAsus size={lado} />;
  }
  if (t.includes("micro-star") || t.includes("msi") || t.includes("claw")) {
    return <SiMsi size={lado} />;
  }
  if (t.includes("lenovo") || t.includes("legion")) {
    return <SiLenovo size={lado} />;
  }
  if (t.includes("xbox")) return <FaXbox size={lado} />;
  return <IconoPortatil size={lado} />;
}

// --- tarjeta de accion (cuadrada, como las de los mandos) ------------------
type AnimIcono = "pop" | "giro" | "latido" | "barrido";

function IconoTarjeta(props: {
  icono: ReactNode;
  color: string;
  anim?: AnimIcono;
}) {
  return (
    <span className="ede-icono-tile">
      <span className={`ede-icono-anim ede-anim-${props.anim ?? "pop"}`}>
        <span
          className="ede-icono-caja"
          style={
            {
              width: "36px",
              height: "36px",
              borderRadius: "11px",
              background: props.color,
              color: "#ffffff",
              flex: "0 0 auto",
              "--ede-glow": hexA(props.color, 0.6),
            } as CSSProperties
          }
        >
          {props.icono}
        </span>
      </span>
    </span>
  );
}

function TarjetaAccion(props: {
  icono: ReactNode;
  titulo: string;
  detalle?: string;
  color?: string;
  anim?: AnimIcono;
  onClick: () => void;
}) {
  const color = props.color ?? C.azul;
  return (
    <ButtonItem layout="below" onClick={props.onClick}>
      <div
        className="ede-tarjeta"
        style={{
          ...estiloTarjeta(false, color),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "96px",
          width: "100%",
          padding: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "10px 6px",
            width: "100%",
          }}
        >
          <IconoTarjeta icono={props.icono} color={color} anim={props.anim} />
          <div style={{ fontSize: "0.7em", fontWeight: 700, lineHeight: 1.15 }}>
            {props.titulo}
          </div>
          {props.detalle ? (
            <div style={{ fontSize: "0.62em", opacity: 0.7, lineHeight: 1.15 }}>
              {props.detalle}
            </div>
          ) : null}
        </div>
      </div>
    </ButtonItem>
  );
}

// --- tarjeta ancha (icono a la izquierda, como el menu de PdC) --------------
function TarjetaFila(props: {
  icono: ReactNode;
  titulo: string;
  detalle?: string;
  color?: string;
  anim?: AnimIcono;
  onClick: () => void;
}) {
  const color = props.color ?? C.azul;
  return (
    <ButtonItem layout="below" onClick={props.onClick}>
      <div
        className="ede-tarjeta"
        style={{
          ...estiloTarjeta(false, color),
          display: "flex",
          alignItems: "center",
          gap: "11px",
          width: "100%",
          padding: "10px 12px",
          textAlign: "left",
        }}
      >
        <IconoTarjeta icono={props.icono} color={color} anim={props.anim} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: "0.8em", fontWeight: 700, lineHeight: 1.2 }}>
            {props.titulo}
          </div>
          {props.detalle ? (
            <div style={{ fontSize: "0.68em", opacity: 0.7, lineHeight: 1.2 }}>
              {props.detalle}
            </div>
          ) : null}
        </div>
        <span style={{ opacity: 0.45, display: "flex", flex: "0 0 auto" }}>
          <FaChevronRight size={11} />
        </span>
      </div>
    </ButtonItem>
  );
}

// --- rejilla de 2 columnas -------------------------------------------------
function Rejilla(props: { children: ReactNode }) {
  return (
    <PanelSectionRow>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "6px",
          width: "100%",
        }}
      >
        {props.children}
      </div>
    </PanelSectionRow>
  );
}

// --- seccion colapsable ----------------------------------------------------
function Seccion(props: {
  titulo: string;
  icono: ReactNode;
  color?: string;
  resumen?: string;
  abierta: boolean;
  onToggle?: () => void;
  children: ReactNode;
}) {
  const cabecera = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
        width: "100%",
      }}
    >
      <CirculoIcono color={props.color ?? C.azul} lado={26}>
        {props.icono}
      </CirculoIcono>
      <span style={{ fontWeight: 700 }}>{props.titulo}</span>
      {props.resumen ? (
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.7em",
            opacity: 0.55,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {props.resumen}
        </span>
      ) : null}
      {props.onToggle ? (
        <span
          style={{
            marginLeft: props.resumen ? "6px" : "auto",
            opacity: 0.6,
            display: "flex",
            flex: "0 0 auto",
          }}
        >
          {props.abierta ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
        </span>
      ) : null}
    </div>
  );

  return (
    <PanelSection>
      <PanelSectionRow>
        {props.onToggle ? (
          <ButtonItem layout="below" onClick={props.onToggle}>
            {cabecera}
          </ButtonItem>
        ) : (
          cabecera
        )}
      </PanelSectionRow>
      <div
        style={{
          height: "1px",
          background: "rgba(128,128,128,0.16)",
          margin: "0 6px 6px",
        }}
      />
      {props.abierta ? (
        <div className="ede-aparecer ede-zona">{props.children}</div>
      ) : null}
    </PanelSection>
  );
}

// ---------------------------------------------------------------------------
//  Ventana emergente de texto (paginada: D-pad y dedo)
// ---------------------------------------------------------------------------
const LINEAS_POR_PAGINA = 16;

function VentanaTexto(props: {
  titulo: string;
  texto: string;
  onCerrar: () => void;
}) {
  const [pagina, setPagina] = useState(0);

  const lineas = (props.texto || "").replace(/\s+$/, "").split("\n");
  const total = Math.max(1, Math.ceil(lineas.length / LINEAS_POR_PAGINA));
  const actual = Math.min(pagina, total - 1);
  const desde = actual * LINEAS_POR_PAGINA;
  const hasta = Math.min(desde + LINEAS_POR_PAGINA, lineas.length);

  return (
    <ModalRoot strTitle={props.titulo} bAllowFullSize onCancel={props.onCerrar}>
      <DialogBody>
        <DialogBodyText
          style={{
            fontFamily: "monospace",
            fontSize: "0.85em",
            lineHeight: 1.35,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: "45vh",
            overflowY: "auto",
          }}
        >
          {lineas.slice(desde, hasta).join("\n")}
        </DialogBodyText>
      </DialogBody>
      <DialogFooter>
        <DialogButton disabled={actual <= 0} onClick={() => setPagina(actual - 1)}>
          {"◀ Anteriores"}
        </DialogButton>
        <DialogButtonPrimary onClick={props.onCerrar}>Cerrar</DialogButtonPrimary>
        <DialogButton
          disabled={actual >= total - 1}
          onClick={() => setPagina(actual + 1)}
        >
          {"Siguientes ▶"}
        </DialogButton>
      </DialogFooter>
      <div
        style={{
          textAlign: "center",
          fontSize: "0.75em",
          opacity: 0.6,
          marginTop: "8px",
        }}
      >
        lineas {lineas.length ? desde + 1 : 0}-{hasta} de {lineas.length}
      </div>
    </ModalRoot>
  );
}

function abrirVentana(titulo: string, texto: string) {
  const cierre = { f: () => {} };
  const res = showModal(
    <VentanaTexto titulo={titulo} texto={texto} onCerrar={() => cierre.f()} />
  );
  cierre.f = res.Close;
}

// ---------------------------------------------------------------------------
//  Ventana de asignacion (Cemu / Dolphin)
// ---------------------------------------------------------------------------
function VentanaAsignacion(props: {
  planes: Record<string, Plan | null>;
  onCerrar: () => void;
  onNuevo: (e: Estado) => void;
}) {
  const [planes, setPlanes] = useState(props.planes);
  const [ocupado, setOcupado] = useState(false);
  const [nota, setNota] = useState("");

  const comprobar = async () => {
    if (ocupado) return;
    setOcupado(true);
    setNota("Comprobando…");
    try {
      const nuevo = await call<[], Estado>("comprobar");
      setPlanes(nuevo.planes);
      props.onNuevo(nuevo);
      setNota(nuevo.aviso || "Plan recalculado");
    } catch (err) {
      setNota(String(err));
    } finally {
      setOcupado(false);
    }
  };

  const bloque = (clave: "wiiu" | "dolphin", etiqueta: string) => {
    const pl = planes?.[clave];
    return (
      <div key={clave} style={{ marginBottom: "12px" }}>
        <div style={{ fontWeight: 700 }}>{etiqueta}</div>
        {pl ? (
          <>
            <div style={{ opacity: 0.6, fontSize: "0.85em" }}>
              {pl.modo} · {pl.fecha} · máximo {pl.max} ·{" "}
              {pl.sdl === "ok" ? "SDL ok" : "SDL error"}
            </div>
            {pl.mandos.length === 0 ? (
              <div style={{ color: C.dorado }}>Ningún mando asignado.</div>
            ) : (
              pl.mandos.map((m) => (
                <div key={m.n}>
                  <span style={{ color: C.azul, fontWeight: 700 }}>M{m.n}</span>{" "}
                  {m.nombre}{" "}
                  <span style={{ opacity: 0.5 }}>[{m.clase}]</span>
                </div>
              ))
            )}
            {pl.fuera.map((f) => (
              <div key={f} style={{ color: C.gris, fontSize: "0.92em" }}>
                fuera: {f.replace("|", ": ")}
              </div>
            ))}
            {pl.aviso.map((a) => (
              <div key={a} style={{ color: C.dorado, fontSize: "0.92em" }}>
                {a}
              </div>
            ))}
          </>
        ) : (
          <div style={{ opacity: 0.6 }}>
            Sin datos todavía. Pulsa «Comprobar ahora».
          </div>
        )}
      </div>
    );
  };

  return (
    <ModalRoot strTitle="Asignación" bAllowFullSize onCancel={props.onCerrar}>
      <DialogBody>
        <DialogBodyText>
          <div
            style={{
              maxHeight: "45vh",
              overflowY: "auto",
              fontSize: "0.9em",
              lineHeight: 1.4,
            }}
          >
            {bloque("wiiu", "Cemu (Wii U)")}
            {bloque("dolphin", "Dolphin (GC/Wii)")}
            {nota ? (
              <div style={{ marginTop: "6px", opacity: 0.75, fontSize: "0.9em" }}>
                {nota}
              </div>
            ) : null}
          </div>
        </DialogBodyText>
      </DialogBody>
      <DialogFooter>
        <DialogButton disabled={ocupado} onClick={() => void comprobar()}>
          {ocupado ? "Comprobando…" : "Comprobar ahora"}
        </DialogButton>
        <DialogButtonPrimary onClick={props.onCerrar}>Cerrar</DialogButtonPrimary>
      </DialogFooter>
    </ModalRoot>
  );
}

function abrirAsignacion(
  planes: Record<string, Plan | null>,
  onNuevo: (e: Estado) => void
) {
  const cierre = { f: () => {} };
  const res = showModal(
    <VentanaAsignacion
      planes={planes}
      onCerrar={() => cierre.f()}
      onNuevo={onNuevo}
    />
  );
  cierre.f = res.Close;
}

// ---------------------------------------------------------------------------
//  Panel
// ---------------------------------------------------------------------------
function Content() {
  const [est, setEst] = useState<Estado | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [abiertas, setAbiertas] = useState<Record<string, boolean>>({});
  const [aviso, setAviso] = useState("");
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [destello, setDestello] = useState<string | null>(null);
  const [ultimo, setUltimo] = useState<Record<string, number>>({});

  const toggle = (id: string) =>
    setAbiertas((prev) => ({ ...prev, [id]: !prev[id] }));

  // avisos pasajeros: se pintan dentro del panel y se borran solos
  const avisar = (mensaje: string) => {
    setAviso(mensaje);
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAviso(""), 5000);
  };

  const limpiarAviso = () => {
    if (temporizador.current) clearTimeout(temporizador.current);
    setAviso("");
  };

  const refrescar = async () => {
    try {
      const nuevo = await call<[], Estado>("estado");
      setEst(nuevo);
      if (nuevo.aviso) avisar(nuevo.aviso);
    } catch (e) {
      abrirVentana("Error", String(e));
    }
  };

  useEffect(() => {
    void refrescar();
  }, []);

  const conBloqueo = async (fn: () => Promise<void>) => {
    if (ocupado) return;
    setOcupado(true);
    try {
      await fn();
    } catch (e) {
      abrirVentana("Error", String(e));
    } finally {
      setOcupado(false);
    }
  };

  const TOCAR_MS = 1500;

  const vibrar = (m: Mando) => {
    void call<[string, string], { ok: boolean; salida: string }>(
      "vibrar",
      m.serie,
      m.puerto
    )
      .then((r) => {
        if (r.ok) return;
        if (r.salida.includes("\n")) abrirVentana("No se pudo vibrar", r.salida);
        else avisar(r.salida);
      })
      .catch(() => {});
    setDestello(m.serie);
    setTimeout(() => setDestello((d) => (d === m.serie ? null : d)), 420);
  };

  const tocarMando = (m: Mando) =>
    conBloqueo(async () => {
      if (m.clase === "Integrado") {
        avisar(
          "El mando integrado no vibra ni se fija por serie: se pone como Player 1 " +
            "con el ajuste «Mando integrado»."
        );
        return;
      }
      if (!m.serie) {
        avisar(
          `"${m.sdl || m.nombre}" no informa de su serie, asi que no puedo dirigirme a el.`
        );
        return;
      }

      vibrar(m);

      const ahora = Date.now();
      const anterior = ultimo[m.serie] ?? 0;
      const doble = ahora - anterior < TOCAR_MS;
      setUltimo((u) => ({ ...u, [m.serie]: ahora }));

      if (m.es_principal) {
        avisar("Este ya es el principal.");
        return;
      }
      if (est && est.ds_conectados <= 1) {
        avisar("Con un solo mando conectado, ya es el principal.");
        return;
      }
      if (!doble) {
        avisar("Pulsa otra vez para hacerlo principal.");
        return;
      }

      const nuevo = await call<[string], Estado>("alternar_principal", m.serie);
      setEst(nuevo);
      if (nuevo.aviso) {
        avisar(nuevo.aviso);
      } else {
        const p = nuevo.mandos.find((x) => x.serie === m.serie);
        setUltimo((u) => ({ ...u, [m.serie]: 0 }));
        avisar(`${p?.sdl || p?.nombre || "Mando"} es ahora el principal`);
      }
    });

  const ciclar = (clave: string) =>
    conBloqueo(async () => {
      const nuevo = await call<[string], Estado>("ciclar", clave);
      setEst(nuevo);
      if (nuevo.aviso) avisar(nuevo.aviso);
    });

  const aplicar = () =>
    conBloqueo(async () => {
      const r = await call<[], Salida>("aplicar");
      abrirVentana(`Aplicar: ${r.mensaje ?? "salida " + r.exit}`, r.salida);
      await refrescar();
    });

  const verLog = () =>
    conBloqueo(async () => {
      const r = await call<[], { salida: string }>("ver_log");
      abrirVentana("Log (ultimas lineas)", r.salida);
    });

  const instalar = () =>
    conBloqueo(async () => {
      const r = await call<
        [],
        { ok: boolean; exit: number; salida: string }
      >("instalar_scripts");
      abrirVentana(
        r.ok ? "Scripts instalados" : `Error instalando (${r.exit})`,
        r.salida
      );
      await refrescar();
    });

  const restaurarTodo = () => {
    showModal(
      <ConfirmModal
        strTitle="Restaurar todo"
        strDescription={
          "Se restaurara el qt-config.ini anterior a E.C.A, se quitaran las " +
          "preferencias del plugin y se desactivara el hook de ES-DE.\n\n" +
          "Eden debe estar cerrado. Se guarda una copia del estado actual.\n\n" +
          "Podras reactivar el hook con el boton de arriba."
        }
        strOKButtonText="Restaurar"
        strCancelButtonText="Cancelar"
        onOK={() => {
          void conBloqueo(async () => {
            const r = await call<[], { ok: boolean; salida: string }>(
              "restaurar_todo"
            );
            abrirVentana(r.ok ? "Restaurado" : "Restaurado con problemas", r.salida);
            await refrescar();
          });
        }}
        onCancel={() => {}}
      />
    );
  };

  if (!est) {
    return (
      <PanelSection title="E.C.A">
        <PanelSectionRow>
          <div style={{ opacity: 0.8 }}>Leyendo mandos...</div>
        </PanelSectionRow>
      </PanelSection>
    );
  }

  const p = est.prefs;
  const cuadricula = est.mandos.length >= 2;
  const integradoNombre =
    est.mandos.find((m) => m.clase === "Integrado")?.nombre ?? "";
  const maquinaNombre = nombreMaquina(est.maquina);
  const acentoInfo = ACENTOS[p.COLOR] ?? ACENTOS.azul;
  const acento = acentoInfo.hex;

  // la MAC solo cuando hay mas de un mando del mismo tipo
  const repetidos = (clase: string) =>
    est.mandos.filter((x) => x.clase === clase).length > 1;

  const textoMandos = (e: Estado) => {
    const partes: string[] = [];
    if (e.ds_conectados > 0) partes.push(`${e.ds_conectados} DualSense`);
    if (e.otros_conectados > 0) {
      partes.push(`${e.otros_conectados} ${e.otros_conectados === 1 ? "otro" : "otros"}`);
    }
    return partes.length ? partes.join(" · ") : "sin mandos externos";
  };

  const resumenPlanes = (() => {
    const trozos: string[] = [];
    for (const [clave, etiqueta] of [
      ["wiiu", "Cemu"],
      ["dolphin", "Dolphin"],
    ] as const) {
      const pl = est.planes?.[clave];
      if (pl && pl.mandos.length) trozos.push(`${etiqueta} ${pl.mandos.length}`);
    }
    return trozos.length ? trozos.join(" · ") : "sin datos";
  })();

  const resumenAjustes = `${p.JUGADORES_MAX} · ${INTEGRADO_TXT[p.ORDEN_INTEGRADO] ?? p.ORDEN_INTEGRADO}${
    est.integrado_auto ? " (auto)" : ""
  }`;

  return (
    <div
      style={
        {
          "--ede-acento": acento,
          "--ede-acento-halo": hexA(acento, 0.45),
        } as CSSProperties
      }
    >
      <style>{ESTILOS}</style>

      {maquinaNombre ? (
        <PanelSection>
          <PanelSectionRow>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  minHeight: "24px",
                  maxWidth: "100%",
                  padding: "3px 9px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    flex: "0 0 auto",
                    color: acento,
                  }}
                >
                  <IconoMaquina
                    maquina={est.maquina}
                    nombre={integradoNombre}
                    size={13}
                  />
                </span>
                <span
                  style={{
                    fontSize: "0.72em",
                    fontWeight: 650,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {maquinaNombre}
                </span>
              </div>
            </div>
          </PanelSectionRow>
        </PanelSection>
      ) : null}

      {!est.instalado || est.desactualizado || !est.hook ? (
        <PanelSection
          title={
            !est.instalado
              ? "Primer uso"
              : !est.hook
                ? "Hook desactivado"
                : est.reparar
                  ? "Reparar"
                  : "Actualizar"
          }
        >
          <PanelSectionRow>
            <BotonAccion
              icono={<FaDownload size={14} />}
              texto={
                !est.instalado
                  ? "Instalar scripts"
                  : !est.hook
                    ? "Reactivar hook"
                    : est.reparar
                      ? "Reparar instalación"
                      : "Actualizar scripts"
              }
              onClick={instalar}
            />
          </PanelSectionRow>
        </PanelSection>
      ) : null}

      {est.esde === false ? (
        <PanelSection>
          {est.esde === false ? (
            <PanelSectionRow>
              <Aviso tono="atencion">
                ES-DE: activa «Other settings → Enable custom event scripts». Sin
                eso no se aplica al lanzar el juego.
              </Aviso>
            </PanelSectionRow>
          ) : null}
        </PanelSection>
      ) : null}

      <PanelSection>
        <PanelSectionRow>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <CirculoIcono color={acento} lado={26}>
              <FaInfoCircle size={12} />
            </CirculoIcono>
            <div style={{ minWidth: 0, fontSize: "0.78em", lineHeight: 1.35 }}>
              <div style={{ fontWeight: 700 }}>Estado</div>
              <div style={{ opacity: 0.7 }}>
                {ESCENARIO_CORTO[est.escenario] ?? est.escenario} ·{" "}
                {textoMandos(est)} · scripts {est.version} ·{" "}
                <span style={{ color: est.hook ? C.verde : C.rojo }}>
                  {est.hook ? "hook OK" : "hook falta"}
                </span>
              </div>
            </div>
          </div>
        </PanelSectionRow>
      </PanelSection>

      <Seccion
        titulo="Mandos"
        color={acento}
        icono={<FaGamepad size={13} />}
        abierta={true}
      >
        {est.mandos.length === 0 ? (
          <PanelSectionRow>
            <div style={{ opacity: 0.8 }}>
              No se detecta ningun mando. Enciende el mando y pulsa Recargar.
            </div>
          </PanelSectionRow>
        ) : cuadricula ? (
          <PanelSectionRow>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "6px",
                width: "100%",
              }}
            >
              {est.mandos.map((m) => (
                <div
                  key={`${m.guid}-${m.puerto}`}
                  className="ede-celda"
                  style={{
                    minWidth: 0,
                    maxWidth: "100%",
                    overflow: "hidden",
                    borderRadius: "16px",
                  }}
                >
                  <MandoCuadrado
                    m={m}
                    mostrarMac={repetidos(m.clase)}
                    destello={destello === m.serie}
                    onClick={() => tocarMando(m)}
                  />
                </div>
              ))}
            </div>
          </PanelSectionRow>
        ) : (
          est.mandos.map((m) => (
            <PanelSectionRow key={`${m.guid}-${m.puerto}`}>
              <FilaMando
                m={m}
                mostrarMac={repetidos(m.clase)}
                destello={destello === m.serie}
                onClick={() => tocarMando(m)}
              />
            </PanelSectionRow>
          ))
        )}
        {aviso ? (
          <PanelSectionRow>
            <Aviso tono="atencion" onClick={limpiarAviso}>
              {aviso}
            </Aviso>
          </PanelSectionRow>
        ) : null}
        {est.ds_conectados > Number(p.JUGADORES_MAX) ? (
          <PanelSectionRow>
            <div style={{ fontSize: "0.68em", color: C.dorado }}>
              Se configuran {p.JUGADORES_MAX} de {est.ds_conectados} mandos.
              Cambialo en Ajustes → Mandos a configurar.
            </div>
          </PanelSectionRow>
        ) : null}
        {est.mandos.length > 1 ? (
          <PanelSectionRow>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.68em",
                opacity: 0.6,
              }}
            >
              <GlifoA /> vibrar · dos toques seguidos = mando principal
            </div>
          </PanelSectionRow>
        ) : null}
        <PanelSectionRow>
          <BotonAccion
            icono={<FaSyncAlt size={14} />}
            texto="Recargar mandos"
            onClick={() => conBloqueo(refrescar)}
          />
        </PanelSectionRow>
      </Seccion>

      <PanelSection>
        <PanelSectionRow>
          <TarjetaFila
            color={C.turquesa}
            icono={<FaFileAlt size={16} />}
            titulo="Asignación"
            detalle={resumenPlanes}
            onClick={() => abrirAsignacion(est.planes, setEst)}
          />
        </PanelSectionRow>
      </PanelSection>

      <Seccion
        titulo="Ajustes"
        color={C.violeta}
        icono={<FaSlidersH size={12} />}
        resumen={resumenAjustes}
        abierta={Boolean(abiertas.ajustes)}
        onToggle={() => toggle("ajustes")}
      >
        <Rejilla>
          <div className="ede-celda">
            <TarjetaAccion
              color={acento}
              icono={<FaGamepad size={17} />}
              anim="latido"
              titulo="Mandos"
              detalle={`${p.JUGADORES_MAX} jugadores`}
              onClick={() => ciclar("max")}
            />
          </div>
          <div className="ede-celda">
            <TarjetaAccion
              color={C.naranja}
              icono={
                <IconoMaquina
                  maquina={est.maquina}
                  nombre={integradoNombre}
                />
              }
              anim="pop"
              titulo="Integrado"
              detalle={`${maquinaNombre ? `${maquinaNombre} · ` : ""}${
                INTEGRADO_TXT[p.ORDEN_INTEGRADO] ?? p.ORDEN_INTEGRADO
              }${est.integrado_auto ? " (auto)" : ""}`}
              onClick={() => ciclar("integrado")}
            />
          </div>
          <div className="ede-celda">
            <TarjetaAccion
              color={acento}
              icono={<FaPalette size={17} />}
              anim="pop"
              titulo="Color"
              detalle={acentoInfo.nombre}
              onClick={() => ciclar("color")}
            />
          </div>
        </Rejilla>
      </Seccion>

      <Seccion
        titulo="Avanzado"
        color={C.ambar}
        icono={<FaCog size={13} />}
        abierta={Boolean(abiertas.avanzado)}
        onToggle={() => toggle("avanzado")}
      >
        <Rejilla>
          <div className="ede-celda">
            <TarjetaAccion
              color={C.verde}
              icono={<FaCheck size={17} />}
              anim="pop"
              titulo="Aplicar"
              detalle="Ahora"
              onClick={aplicar}
            />
          </div>
          <div className="ede-celda">
            <TarjetaAccion
              icono={<FaUndo size={16} />}
              anim="giro"
              titulo="Restaurar"
              detalle="Todo"
              color={C.rojo}
              onClick={restaurarTodo}
            />
          </div>
          <div className="ede-celda">
            <TarjetaAccion
              icono={<FaFileAlt size={16} />}
              anim="barrido"
              titulo="Ver log"
              detalle="log.txt"
              color={C.gris}
              onClick={verLog}
            />
          </div>
        </Rejilla>
      </Seccion>
    </div>
  );
}

export default definePlugin(() => {
  return {
    name: "E.C.A",
    titleView: <div className={staticClasses.Title}>E.C.A</div>,
    content: <Content />,
    icon: <FaGamepad />,
    onDismount() {
      console.log("E.C.A descargado");
    },
  };
});
