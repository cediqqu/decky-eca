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
  aviso: string;
};

type Salida = { exit: number; salida: string; mensaje?: string };

// ---------------------------------------------------------------------------
//  Paleta (Joy-Con) y utilidades
// ---------------------------------------------------------------------------
const C = {
  azul: "#0AB9E6",
  rojo: "#FF3C28",
  verde: "#32E632",
  violeta: "#B400E6",
  dorado: "#F5C518",
  carbon1: "#262628",
  carbon2: "#141416",
  texto: "#EDEFF2",
  texto2: "#B8BCC2",
  gris: "#8A8F98",
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
.ede-zona .gpfocus .ede-tarjeta { outline: 1px solid rgba(10,185,230,0.9); outline-offset: -1px; }
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

  const resumenAjustes = `${p.JUGADORES_MAX} · ${INTEGRADO_TXT[p.ORDEN_INTEGRADO] ?? p.ORDEN_INTEGRADO}${
    est.integrado_auto ? " (auto)" : ""
  }`;

  return (
    <>
      <style>{ESTILOS}</style>

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
            <CirculoIcono color={C.azul} lado={26}>
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

      <Seccion
        titulo="Ajustes"
        icono={<FaSlidersH size={12} />}
        resumen={resumenAjustes}
        abierta={Boolean(abiertas.ajustes)}
        onToggle={() => toggle("ajustes")}
      >
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => ciclar("max")}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Mandos a configurar</span>
              <span style={{ fontWeight: 700 }}>{p.JUGADORES_MAX}</span>
            </div>
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => ciclar("integrado")}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Mando integrado</span>
              <span style={{ fontWeight: 700 }}>
                {INTEGRADO_TXT[p.ORDEN_INTEGRADO] ?? p.ORDEN_INTEGRADO}
                {est.integrado_auto ? " (auto)" : ""}
              </span>
            </div>
          </ButtonItem>
        </PanelSectionRow>
      </Seccion>

      <Seccion
        titulo="Avanzado"
        color={C.gris}
        icono={<FaCog size={13} />}
        abierta={Boolean(abiertas.avanzado)}
        onToggle={() => toggle("avanzado")}
      >
        <PanelSectionRow>
          <BotonAccion
            icono={<FaCheck size={14} />}
            texto="Aplicar ahora"
            onClick={aplicar}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <BotonAccion
            icono={<FaUndo size={13} />}
            texto="Restaurar todo"
            onClick={restaurarTodo}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <BotonAccion
            icono={<FaFileAlt size={13} />}
            texto="Ver log"
            onClick={verLog}
          />
        </PanelSectionRow>
      </Seccion>
    </>
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
