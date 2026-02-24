import { useState, useEffect, useRef, useCallback, useReducer } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";

// ═══════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════
const DB = {
  get: (k, d = null) => { try { const v = localStorage.getItem("sgi2_" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem("sgi2_" + k, JSON.stringify(v)); } catch {} },
};

// ═══════════════════════════════════════════════════════
// INITIAL DATA
// ═══════════════════════════════════════════════════════
const INIT = () => ({
  branding:            DB.get("branding",            { nombre: "Mi Empresa", logo: null, colorPrimario: "#2563eb", colorSecundario: "#0891b2" }),
  usuarios:            DB.get("usuarios",            [{ id:"u1", nombre:"Administrador", email:"admin@empresa.com", password:"admin123", perfil:"Administrador", area:"Dirección", activo:true }]),
  sesion:              DB.get("sesion",              null),
  notificaciones:      DB.get("notificaciones",      []),
  tareas:              DB.get("tareas",              []),
  empresa:             DB.get("empresa",             { normas:[] }),
  contexto:            DB.get("contexto",            { factores:[], foda:{} }),
  partesInteresadas:   DB.get("partesInteresadas",   []),
  requisitosLegales:   DB.get("requisitosLegales",   []),
  procesos:            DB.get("procesos",            []),
  objetivos:           DB.get("objetivos",           []),
  kpis:                DB.get("kpis",                []),
  kpiRegistros:        DB.get("kpiRegistros",        []),
  riesgosEstrategicos: DB.get("riesgosEstrategicos", []),
  riesgosOperativos:   DB.get("riesgosOperativos",   []),
  peligros:            DB.get("peligros",            []),
  aspectosAmbientales: DB.get("aspectosAmbientales", []),
  auditorias:          DB.get("auditorias",          []),
  noConformidades:     DB.get("noConformidades",     []),
  oportunidades:       DB.get("oportunidades",       []),
  revisionDireccion:   DB.get("revisionDireccion",   []),
  mantenimiento:       DB.get("mantenimiento",       []),
  calibraciones:       DB.get("calibraciones",       []),
  capacitaciones:      DB.get("capacitaciones",      []),
  planCapacitacion:    DB.get("planCapacitacion",    []),
  personal:            DB.get("personal",            []),
  orgNodes:            DB.get("orgNodes",            []),
  perfilesPuesto:      DB.get("perfilesPuesto",      []),
  proveedores:         DB.get("proveedores",         []),
  comunicaciones:      DB.get("comunicaciones",      []),
  documentos:          DB.get("documentos",          []),
  gestionCambio:       DB.get("gestionCambio",       []),
  activos:             DB.get("activos",             []),
  emergencias:         DB.get("emergencias",         []),
  indicadoresEnergia:  DB.get("indicadoresEnergia",  []),
  competencias:        DB.get("competencias",        []),
});

// ═══════════════════════════════════════════════════════
// REDUCER
// ═══════════════════════════════════════════════════════
const reducer = (state, action) => {
  switch (action.type) {
    case "SET":    { const ns = { ...state, [action.key]: action.val }; DB.set(action.key, action.val); return ns; }
    case "LOGIN":  { DB.set("sesion", action.user); return { ...state, sesion: action.user }; }
    case "LOGOUT": { DB.set("sesion", null); return { ...state, sesion: null }; }
    default: return state;
  }
};

// ═══════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════
const P = {
  home:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  building:"M4 2h16v20H4zM8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01M12 18v4",
  users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  law:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  gear:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51",
  target:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  chart:"M18 20V10M12 20V4M6 20v-6M2 20h20",
  alert:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  leaf:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
  clip:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z",
  tool:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  book:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  check:"M20 6L9 17l-5-5",
  x:"M18 6L6 18M6 6l12 12",
  plus:"M12 5v14M5 12h14",
  edit:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z",
  trash:"M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6",
  eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  bell:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  mail:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  upload:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  lock:"M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  person:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  menu:"M3 12h18M3 6h18M3 18h18",
  search:"M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  trending:"M22 7l-9.5 9.5-4-4L2 17M16 7h6v6",
  clock:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  settings:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  org:"M3 3h6v6H3zM15 3h6v6h-6zM9 21H3v-6h6zM21 21h-6v-6h6zM6 9v3M18 9v3M6 12h12M12 15v6",
  award:"M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12",
  energy:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  asset:"M2 3h20v14H2zM8 21h8M12 17v4",
  doc:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  calendar:"M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  supply:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  change:"M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4",
  norm:"M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z",
  audit:"M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  info:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8h.01M12 12v4",
  logout:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  down:"M6 9l6 6 6-6",
  right:"M9 18l6-6-6-6",
  fire:"M12 2c0 0-4 6-4 10a4 4 0 0 0 8 0c0-4-4-10-4-10z",
  refresh:"M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  road:"M3 17l3-10 3 5 3-8 3 8 3-5 3 10M3 17h18",
};
const Ic = ({ n, s = 16, col }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col || "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={P[n] || ""} />
  </svg>
);

// ═══════════════════════════════════════════════════════
// DESIGN — light, clean, professional
// ═══════════════════════════════════════════════════════
const T = (b) => ({
  bg: "#f8fafc", bg1: "#ffffff", bg2: "#f1f5f9", bg3: "#e2e8f0",
  border: "#e2e8f0", border2: "#cbd5e1",
  brand: b?.colorPrimario || "#2563eb",
  brand2: b?.colorSecundario || "#0891b2",
  t1: "#0f172a", t2: "#334155", t3: "#64748b", t4: "#94a3b8",
  ok: "#16a34a", warn: "#d97706", danger: "#dc2626", info: "#0284c7",
});

// ═══════════════════════════════════════════════════════
// PRIMITIVES
// ═══════════════════════════════════════════════════════
const makeInpStyle = (tok) => ({
  background: "#fff", border: `1.5px solid ${tok.border2}`, borderRadius: 9,
  padding: "8px 12px", color: tok.t1, fontSize: "0.84rem", width: "100%",
  boxSizing: "border-box", outline: "none", fontFamily: "inherit",
  transition: "border-color .15s", boxShadow: "0 1px 3px rgba(0,0,0,.04)",
});

const Inp = ({ tok, ...p }) => {
  const s = makeInpStyle(tok);
  return <input style={s} onFocus={e => e.target.style.borderColor = tok.brand} onBlur={e => e.target.style.borderColor = tok.border2} {...p} />;
};
const Sel = ({ tok, children, ...p }) => {
  const s = makeInpStyle(tok);
  return <select style={s} {...p}>{children}</select>;
};
const Tex = ({ tok, rows = 4, ...p }) => {
  const s = { ...makeInpStyle(tok), resize: "vertical", minHeight: rows * 22 };
  return <textarea style={s} onFocus={e => e.target.style.borderColor = tok.brand} onBlur={e => e.target.style.borderColor = tok.border2} {...p} />;
};

const Fld = ({ label, half, third, children }) => (
  <div style={{ flex: third ? "1 1 calc(33.33% - .75rem)" : half ? "1 1 calc(50% - .5rem)" : "1 1 100%", minWidth: third ? 148 : half ? 190 : "100%", marginBottom: "1rem" }}>
    <label style={{ display: "block", fontSize: "0.67rem", fontWeight: 700, color: "#64748b", marginBottom: "0.28rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</label>
    {children}
  </div>
);
const Row = ({ children }) => <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>{children}</div>;

const Card = ({ children, style = {} }) => (
  <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "1.4rem", boxShadow: "0 1px 5px rgba(0,0,0,.05)", ...style }}>
    {children}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", icon, full, size = "md", disabled, tok }) => {
  const [h, setH] = useState(false);
  const brand = tok?.brand || "#2563eb";
  const sz = { sm: { padding: "5px 11px", fontSize: "0.73rem" }, md: { padding: "8px 17px", fontSize: "0.83rem" }, lg: { padding: "11px 24px", fontSize: "0.9rem" } };
  const v = {
    primary: { background: h ? brand + "e0" : brand, color: "#fff", boxShadow: h ? `0 4px 14px ${brand}50` : `0 2px 7px ${brand}30`, border: "none" },
    ghost:   { background: h ? "#f1f5f9" : "transparent", color: h ? "#0f172a" : "#475569", border: "1.5px solid " + (h ? "#cbd5e1" : "#e2e8f0") },
    danger:  { background: h ? "#b91c1c" : "#fef2f2", color: h ? "#fff" : "#dc2626", border: "1.5px solid #fca5a5" },
    success: { background: h ? "#15803d" : "#f0fdf4", color: h ? "#fff" : "#16a34a", border: "1.5px solid #86efac" },
    outline: { background: h ? brand + "10" : "transparent", color: brand, border: `1.5px solid ${brand}` },
  };
  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      onClick={!disabled ? onClick : undefined}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 9, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: 600, opacity: disabled ? .5 : 1, width: full ? "100%" : "auto", justifyContent: "center", transition: "all .16s", ...sz[size], ...v[variant] }}>
      {icon && <Ic n={icon} s={13} />}{children}
    </button>
  );
};

const BadgeColors = { blue:["#1d4ed8","#dbeafe"], green:["#15803d","#dcfce7"], red:["#b91c1c","#fee2e2"], amber:["#92400e","#fef3c7"], purple:["#5b21b6","#ede9fe"], gray:["#374151","#f3f4f6"], cyan:["#0e7490","#cffafe"] };
const statusColorMap = { "Activo":"green","Activa":"green","Cumple":"green","Eficaz":"green","Cerrada":"green","Realizado":"green","Alcanzado":"green","Aprobado":"green","Vigente":"green","Operativo":"green","Implementada":"green",
  "En Proceso":"blue","Programada":"blue","En curso":"blue","En implementación":"blue",
  "Abierta":"red","No Cumple":"red","No Eficaz":"red","Vencido":"red","Crítico":"red","No aprobado":"red","Fuera de uso":"red",
  "Pendiente":"amber","Parcial":"amber","Alta":"red","Media":"amber","Baja":"green","En riesgo":"red","Condicionado":"amber",
  "Inactivo":"gray","Cancelada":"gray","Cancelado":"gray","Obsoleto":"gray",
};
const Bdg = ({ label }) => {
  const [fg, bg] = BadgeColors[statusColorMap[label] || "gray"] || BadgeColors.gray;
  return <span style={{ background: bg, color: fg, border: `1px solid ${fg}25`, borderRadius: 6, padding: "2px 8px", fontSize: "0.69rem", fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>;
};
const ColorBdg = ({ label, color = "blue" }) => {
  const [fg, bg] = BadgeColors[color] || BadgeColors.blue;
  return <span style={{ background: bg, color: fg, borderRadius: 6, padding: "2px 8px", fontSize: "0.69rem", fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>;
};

const Modal = ({ title, onClose, children, wide, icon, tok }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(3px)" }}>
    <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 18, width: "100%", maxWidth: wide ? 960 : 660, maxHeight: "92vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.75rem", borderBottom: "1.5px solid #f1f5f9", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          {icon && <Ic n={icon} s={17} col={tok?.brand || "#2563eb"} />}
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>{title}</h3>
        </div>
        <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 7, padding: 5, cursor: "pointer", display: "flex" }}><Ic n="x" s={16} /></button>
      </div>
      <div style={{ padding: "1.6rem" }}>{children}</div>
    </div>
  </div>
);

const SecHdr = ({ title, subtitle, icon, tok, children }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.6rem", flexWrap: "wrap", gap: "1rem" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
      {icon && <div style={{ width: 42, height: 42, borderRadius: 12, background: `${tok?.brand || "#2563eb"}12`, border: `1.5px solid ${tok?.brand || "#2563eb"}25`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n={icon} s={20} col={tok?.brand || "#2563eb"} /></div>}
      <div>
        <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{title}</h2>
        {subtitle && <p style={{ margin: "0.2rem 0 0", color: "#94a3b8", fontSize: "0.81rem" }}>{subtitle}</p>}
      </div>
    </div>
    <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>{children}</div>
  </div>
);

const Kpi = ({ label, value, icon, color = "#2563eb", sub }) => (
  <div style={{ background: `${color}08`, border: `1.5px solid ${color}20`, borderRadius: 13, padding: "1rem 1.15rem", flex: 1, minWidth: 130 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem" }}>
      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
      <Ic n={icon} s={15} col={color} />
    </div>
    <div style={{ fontSize: "1.9rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: "0.67rem", color: "#94a3b8", marginTop: "0.2rem" }}>{sub}</div>}
  </div>
);

const ProgBar = ({ value, max = 100, color = "#2563eb", label }) => {
  const pct = Math.min(100, max > 0 ? Math.round((value / max) * 100) : 0);
  return (
    <div>
      {label && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: "0.75rem", color: "#475569" }}>{label}</span><span style={{ fontSize: "0.75rem", fontWeight: 700, color }}>{pct}%</span></div>}
      <div style={{ height: 5, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width .5s" }} />
      </div>
    </div>
  );
};

const Semaforo = ({ val, meta, invert }) => {
  const pct = meta > 0 ? (val / meta) * 100 : 0;
  const ok = invert ? pct <= 100 : pct >= 80;
  const warn = invert ? pct <= 125 : pct >= 50;
  const col = ok ? "#16a34a" : warn ? "#d97706" : "#dc2626";
  return <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div style={{ width: 12, height: 12, borderRadius: "50%", background: col, boxShadow: `0 0 7px ${col}` }} />
    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: col }}>{pct.toFixed(0)}%</span>
  </div>;
};

const Tbl = ({ cols, rows, onEdit, onDel, tok, empty = "Sin registros" }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.81rem" }}>
      <thead>
        <tr style={{ background: "#f8fafc" }}>
          {cols.map(c => <th key={c.k || c.l} style={{ padding: "9px 11px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" }}>{c.l}</th>)}
          {(onEdit || onDel) && <th style={{ padding: "9px 11px", color: "#64748b", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase" }}>Acc.</th>}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && <tr><td colSpan={cols.length + 1} style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8" }}>{empty}</td></tr>}
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", transition: "background .1s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = ""}>
            {cols.map(c => <td key={c.k || c.l} style={{ padding: "9px 11px", color: "#334155", verticalAlign: "middle" }}>{c.r ? c.r(row) : (row[c.k] || "—")}</td>)}
            {(onEdit || onDel) && <td style={{ padding: "9px 11px", whiteSpace: "nowrap" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {onEdit && <button onClick={() => onEdit(row, i)} style={{ background: "#f1f5f9", border: "none", borderRadius: 7, padding: "4px 8px", cursor: "pointer", display: "flex" }} title="Editar"><Ic n="edit" s={13} /></button>}
                {onDel && <button onClick={() => onDel(i)} style={{ background: "#fef2f2", border: "none", borderRadius: 7, padding: "4px 8px", cursor: "pointer", display: "flex" }} title="Eliminar"><Ic n="trash" s={13} /></button>}
              </div>
            </td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ═══════════════════════════════════════════════════════
// NORMATIVE GAP ANALYSIS DATA
// ═══════════════════════════════════════════════════════
const REQUISITOS_NORMATIVOS = [
  // ISO 9001
  { norma:"ISO 9001", num:"4.1", titulo:"Comprensión del contexto organizacional", key:"contexto", gap:"Factores internos y externos que afectan al SGI" },
  { norma:"ISO 9001", num:"4.2", titulo:"Necesidades y expectativas de las partes interesadas", key:"partesInteresadas", gap:"Partes interesadas relevantes y sus requisitos" },
  { norma:"ISO 9001", num:"4.3", titulo:"Alcance del SGC", key:"empresa", gap:"Límites, aplicabilidad y justificación de exclusiones" },
  { norma:"ISO 9001", num:"4.4", titulo:"Sistema de gestión de la calidad y sus procesos", key:"procesos", gap:"Mapa de procesos con entradas, salidas, recursos e indicadores" },
  { norma:"ISO 9001", num:"5.2", titulo:"Política de calidad", key:"empresa", gap:"Política documentada, comunicada y disponible" },
  { norma:"ISO 9001", num:"5.3", titulo:"Roles, responsabilidades y autoridades", key:"personal", gap:"Organigrama y perfiles de puesto documentados" },
  { norma:"ISO 9001", num:"6.1", titulo:"Acciones para abordar riesgos y oportunidades", key:"riesgosEstrategicos", gap:"Matriz de riesgos con tratamiento definido" },
  { norma:"ISO 9001", num:"6.2", titulo:"Objetivos de calidad y planificación", key:"objetivos", gap:"Objetivos medibles con indicadores, responsables y plazos" },
  { norma:"ISO 9001", num:"6.3", titulo:"Planificación de los cambios", key:"gestionCambio", gap:"⚠ BRECHA FRECUENTE: Registro formal de cambios planificados" },
  { norma:"ISO 9001", num:"7.1.5", titulo:"Recursos de seguimiento y medición", key:"calibraciones", gap:"⚠ BRECHA FRECUENTE: Control de equipos de medición y calibración" },
  { norma:"ISO 9001", num:"7.2/7.3", titulo:"Competencia y toma de conciencia", key:"personal", gap:"Evaluación de competencias y evidencia de formación" },
  { norma:"ISO 9001", num:"7.4", titulo:"Comunicación", key:"comunicaciones", gap:"⚠ BRECHA FRECUENTE: Plan de comunicaciones (qué, quién, cuándo, cómo)" },
  { norma:"ISO 9001", num:"7.5", titulo:"Información documentada", key:"documentos", gap:"⚠ BRECHA FRECUENTE: Control de versiones, aprobaciones y distribución" },
  { norma:"ISO 9001", num:"8.4", titulo:"Control de procesos y proveedores externos", key:"proveedores", gap:"⚠ BRECHA FRECUENTE: Criterios de evaluación y calificación de proveedores" },
  { norma:"ISO 9001", num:"9.1", titulo:"Seguimiento, medición, análisis y evaluación", key:"kpis", gap:"KPIs con frecuencia, responsable, meta y registro de mediciones" },
  { norma:"ISO 9001", num:"9.2", titulo:"Auditoría interna", key:"auditorias", gap:"Programa anual de auditorías internas con resultados" },
  { norma:"ISO 9001", num:"9.3", titulo:"Revisión por la dirección", key:"revisionDireccion", gap:"Revisiones formales con entradas y decisiones documentadas" },
  { norma:"ISO 9001", num:"10.2", titulo:"No conformidades y acciones correctivas", key:"noConformidades", gap:"Registro con análisis de causa raíz y verificación de eficacia" },
  // ISO 14001
  { norma:"ISO 14001", num:"6.1.2", titulo:"Aspectos e impactos ambientales", key:"aspectosAmbientales", gap:"Identificación y evaluación de aspectos significativos" },
  { norma:"ISO 14001", num:"6.1.3", titulo:"Requisitos legales y otros requisitos ambientales", key:"requisitosLegales", gap:"Registro de legislación ambiental aplicable y evaluación de cumplimiento" },
  { norma:"ISO 14001", num:"8.2", titulo:"Preparación y respuesta ante emergencias", key:"emergencias", gap:"⚠ BRECHA FRECUENTE: Plan de emergencias ambientales documentado" },
  // ISO 45001
  { norma:"ISO 45001", num:"6.1.1", titulo:"Identificación de peligros y evaluación de riesgos SST", key:"peligros", gap:"Identificación sistemática con jerarquía de controles" },
  { norma:"ISO 45001", num:"6.1.4", titulo:"Requisitos legales SST", key:"requisitosLegales", gap:"Legislación en SST aplicable con evaluación de cumplimiento" },
  { norma:"ISO 45001", num:"5.4", titulo:"Consulta y participación de los trabajadores", key:"comunicaciones", gap:"⚠ BRECHA FRECUENTE: Evidencia de participación de trabajadores en SST" },
  { norma:"ISO 45001", num:"8.2", titulo:"Preparación y respuesta ante emergencias SST", key:"emergencias", gap:"⚠ BRECHA FRECUENTE: Plan de emergencias SST y simulacros" },
  // ISO 50001
  { norma:"ISO 50001", num:"6.4", titulo:"Línea de base energética", key:"indicadoresEnergia", gap:"⚠ BRECHA FRECUENTE: Línea de base e IDEn definidos formalmente" },
  { norma:"ISO 50001", num:"6.5", titulo:"Indicadores de desempeño energético (IDEn)", key:"kpis", gap:"Indicadores específicos de consumo y eficiencia energética" },
  // ISO 55001
  { norma:"ISO 55001", num:"8.1", titulo:"Planificación y control operacional de activos", key:"activos", gap:"Registro de activos críticos con plan de mantenimiento" },
  // ISO 39001
  { norma:"ISO 39001", num:"6.1.2", titulo:"Factores de riesgo vial y SSV", key:"peligros", gap:"Identificación de factores de riesgo vial" },
];

const getCobertura = (key, state) => {
  const map = {
    contexto: (state.contexto?.factores || []).length,
    partesInteresadas: (state.partesInteresadas || []).length,
    empresa: state.empresa?.alcance ? 1 : 0,
    procesos: (state.procesos || []).length,
    personal: (state.personal || []).length,
    riesgosEstrategicos: (state.riesgosEstrategicos || []).length,
    objetivos: (state.objetivos || []).length,
    gestionCambio: (state.gestionCambio || []).length,
    calibraciones: (state.calibraciones || []).length,
    comunicaciones: (state.comunicaciones || []).length,
    documentos: (state.documentos || []).length,
    proveedores: (state.proveedores || []).length,
    kpis: (state.kpis || []).length,
    auditorias: (state.auditorias || []).length,
    revisionDireccion: (state.revisionDireccion || []).length,
    noConformidades: (state.noConformidades || []).length,
    aspectosAmbientales: (state.aspectosAmbientales || []).length,
    requisitosLegales: (state.requisitosLegales || []).length,
    emergencias: (state.emergencias || []).length,
    peligros: (state.peligros || []).length,
    indicadoresEnergia: (state.indicadoresEnergia || []).length,
    activos: (state.activos || []).length,
  };
  return (map[key] || 0) > 0;
};

// ═══════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════
const NAV_GROUPS = [
  { g: "Panel", items:[
    { id:"dashboard",      label:"Panel de Control",   icon:"home" },
    { id:"notificaciones", label:"Notificaciones",      icon:"bell" },
    { id:"tareas",         label:"Mis Tareas",          icon:"clip" },
  ]},
  { g: "Contexto y Planificación", items:[
    { id:"empresa",            label:"Organización / Alcance",  icon:"building" },
    { id:"contexto",           label:"Análisis de Contexto",    icon:"refresh" },
    { id:"partesInteresadas",  label:"Partes Interesadas",      icon:"users" },
    { id:"requisitosLegales",  label:"Requisitos Legales",      icon:"law" },
    { id:"gestionCambio",      label:"Gestión del Cambio",      icon:"change" },
  ]},
  { g: "Procesos y Operación", items:[
    { id:"procesos",       label:"Mapa de Procesos",         icon:"gear" },
    { id:"objetivos",      label:"Objetivos del SGI",        icon:"target" },
    { id:"kpis",           label:"KPIs e Indicadores",       icon:"chart" },
    { id:"comunicaciones", label:"Comunicaciones",           icon:"mail" },
    { id:"documentos",     label:"Información Documentada",  icon:"doc" },
    { id:"proveedores",    label:"Proveedores Externos",     icon:"supply" },
    { id:"emergencias",    label:"Plan de Emergencias",      icon:"fire" },
  ]},
  { g: "Riesgos", items:[
    { id:"riesgosEstrategicos", label:"Riesgos Estratégicos",  icon:"alert" },
    { id:"riesgosOperativos",   label:"Riesgos Operativos",    icon:"alert" },
    { id:"peligros",            label:"Peligros SST",          icon:"shield" },
    { id:"aspectosAmbientales", label:"Aspectos Ambientales",  icon:"leaf" },
    { id:"activos",             label:"Gestión de Activos",    icon:"asset" },
    { id:"indicadoresEnergia",  label:"Energía (IDEn)",        icon:"energy" },
  ]},
  { g: "Evaluación y Mejora", items:[
    { id:"auditorias",          label:"Auditorías",             icon:"audit" },
    { id:"noConformidades",     label:"NC e Incidentes",        icon:"x" },
    { id:"oportunidades",       label:"Oportunidades de Mejora",icon:"star" },
    { id:"revisionDireccion",   label:"Revisión por Dirección", icon:"eye" },
  ]},
  { g: "Soporte", items:[
    { id:"personal",        label:"RRHH / Legajos",        icon:"person" },
    { id:"capacitaciones",  label:"Capacitación",          icon:"book" },
    { id:"mantenimiento",   label:"Mantenimiento",         icon:"tool" },
    { id:"calibraciones",   label:"Calibración / Medición",icon:"norm" },
  ]},
  { g: "Análisis", items:[
    { id:"cobertura", label:"Cobertura Normativa",  icon:"norm" },
  ]},
  { g: "Administración", items:[
    { id:"usuarios",  label:"Usuarios y Accesos",   icon:"lock" },
    { id:"branding",  label:"Configuración / Marca",icon:"settings" },
  ]},
];

// ═══════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════
function Login({ state, dispatch }) {
  const tok = T(state.branding);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const login = () => {
    const u = (state.usuarios || []).find(u => u.email === email && u.password === pass && u.activo !== false);
    if (u) dispatch({ type: "LOGIN", user: u });
    else setErr("Credenciales incorrectas o usuario inactivo.");
  };

  const b = state.branding || {};
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {b.logo
            ? <img src={b.logo} alt="Logo" style={{ maxWidth: 130, maxHeight: 65, objectFit: "contain", marginBottom: "1rem" }} />
            : <div style={{ width: 60, height: 60, borderRadius: 17, background: `linear-gradient(135deg,${tok.brand},${tok.brand2})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", boxShadow: `0 8px 24px ${tok.brand}40` }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: "1.3rem" }}>{(b.nombre || "SZ").slice(0,2).toUpperCase()}</span>
              </div>}
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: tok.t1 }}>{b.nombre || "SGI Platform"}</h1>
          <p style={{ margin: "0.3rem 0 0", color: tok.t4, fontSize: "0.84rem" }}>Sistema Integrado de Gestión</p>
        </div>
        <Card style={{ padding: "2rem" }}>
          <Fld label="Correo electrónico"><Inp tok={tok} type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==="Enter"&&login()} /></Fld>
          <Fld label="Contraseña"><Inp tok={tok} type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key==="Enter"&&login()} /></Fld>
          {err && <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, padding:"8px 12px", color:"#dc2626", fontSize:"0.81rem", marginBottom:"1rem" }}>{err}</div>}
          <Btn tok={tok} full size="lg" onClick={login} icon="lock">Acceder al sistema</Btn>
          <p style={{ margin:"1rem 0 0", fontSize:"0.72rem", color:tok.t4, textAlign:"center" }}>Demo: admin@empresa.com / admin123</p>
        </Card>
        <p style={{ textAlign:"center", fontSize:"0.7rem", color:tok.t4, marginTop:"1rem" }}>Powered by SZ Consultora</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════
function Dashboard({ state, dispatch, tok }) {
  const s = state;
  const user = s.sesion;
  const normas = s.empresa?.normas || [];
  const ncAbiertas = (s.noConformidades||[]).filter(n=>n.estado==="Abierta").length;
  const tareasUser = (s.tareas||[]).filter(t=>t.asignadoId===user?.id&&t.estado!=="Completada").length;
  const notifNoLeidas = (s.notificaciones||[]).filter(n=>n.destinatarioId===user?.id&&!n.leida).length;

  const vencidas = [...(s.auditorias||[]),...(s.mantenimiento||[]),...(s.calibraciones||[])]
    .filter(i=>i.fechaPlazo&&i.estado!=="Realizado"&&i.estado!=="Cerrada"&&new Date(i.fechaPlazo)<new Date()).length;

  const kpiRecientes = (s.kpis||[]).slice(0,6).map(kpi=>{
    const regs = (s.kpiRegistros||[]).filter(r=>r.kpiId===kpi.id).sort((a,b)=>new Date(b.fecha)-new Date(a.fecha));
    return { ...kpi, ultimo: regs[0] };
  });

  const objetivosData = [
    { name:"Alcanzado", val:(s.objetivos||[]).filter(o=>o.estado==="Alcanzado").length, color:"#16a34a" },
    { name:"En curso", val:(s.objetivos||[]).filter(o=>o.estado==="En curso").length, color:"#2563eb" },
    { name:"En riesgo", val:(s.objetivos||[]).filter(o=>o.estado==="En riesgo").length, color:"#dc2626" },
  ].filter(d=>d.val>0);

  return (
    <div>
      <div style={{ marginBottom:"1.6rem" }}>
        <h1 style={{ margin:0, fontSize:"1.75rem", fontWeight:800, color:tok.t1, letterSpacing:"-0.025em" }}>Bienvenido, {user?.nombre?.split(" ")[0]}</h1>
        <div style={{ display:"flex", gap:"6px", marginTop:"0.6rem", flexWrap:"wrap" }}>
          {normas.map(n=><ColorBdg key={n} label={n} color="blue" />)}
          {normas.length===0&&<span style={{fontSize:"0.78rem",color:tok.t4}}>Configure las normas en Organización</span>}
        </div>
      </div>

      {/* Alerts */}
      <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem", marginBottom:"1.5rem" }}>
        {ncAbiertas>0&&<div style={{background:"#fef2f2",border:"1.5px solid #fca5a5",borderRadius:10,padding:"0.7rem 1rem",display:"flex",alignItems:"center",gap:"0.75rem",fontSize:"0.83rem",color:"#b91c1c",fontWeight:600}}><Ic n="alert" s={16} col="#b91c1c" />{ncAbiertas} NC/Incidente{ncAbiertas>1?"s":"" } abierto{ncAbiertas>1?"s":""}</div>}
        {vencidas>0&&<div style={{background:"#fffbeb",border:"1.5px solid #fcd34d",borderRadius:10,padding:"0.7rem 1rem",display:"flex",alignItems:"center",gap:"0.75rem",fontSize:"0.83rem",color:"#92400e",fontWeight:600}}><Ic n="clock" s={16} col="#92400e" />{vencidas} actividad{vencidas>1?"es":""} con plazo vencido</div>}
        {tareasUser>0&&<div style={{background:"#eff6ff",border:"1.5px solid #bfdbfe",borderRadius:10,padding:"0.7rem 1rem",display:"flex",alignItems:"center",gap:"0.75rem",fontSize:"0.83rem",color:"#1d4ed8",fontWeight:600}}><Ic n="clip" s={16} col="#1d4ed8" />{tareasUser} tarea{tareasUser>1?"s":""} pendiente{tareasUser>1?"s":""} asignada{tareasUser>1?"s":""}</div>}
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))", gap:"0.8rem", marginBottom:"1.6rem" }}>
        <Kpi label="Procesos" value={(s.procesos||[]).length} icon="gear" color={tok.brand} />
        <Kpi label="KPIs activos" value={(s.kpis||[]).length} icon="chart" color="#10b981" />
        <Kpi label="NC abiertas" value={ncAbiertas} icon="x" color="#dc2626" />
        <Kpi label="Riesgos" value={(s.riesgosEstrategicos||[]).length+(s.riesgosOperativos||[]).length} icon="alert" color="#d97706" />
        <Kpi label="Auditorías" value={(s.auditorias||[]).length} icon="audit" color="#8b5cf6" />
        <Kpi label="Proveedores" value={(s.proveedores||[]).length} icon="supply" color="#0891b2" />
        <Kpi label="Personal" value={(s.personal||[]).length} icon="users" color="#d97706" />
        <Kpi label="Mis tareas" value={tareasUser} icon="clip" color={tok.brand} />
      </div>

      {/* Charts */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem", marginBottom:"1.25rem" }}>
        <Card>
          <div style={{ fontSize:"0.72rem", fontWeight:700, color:tok.t3, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"1rem" }}>Estado de Objetivos</div>
          {(s.objetivos||[]).length > 0
            ? <ResponsiveContainer width="100%" height={160}>
                <BarChart data={objetivosData} margin={{top:5,right:5,left:-25,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize:11,fill:"#94a3b8"}} />
                  <YAxis tick={{fontSize:11,fill:"#94a3b8"}} />
                  <Tooltip contentStyle={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,fontSize:"0.78rem"}} />
                  <Bar dataKey="val" name="Objetivos" fill={tok.brand} radius={[4,4,0,0]}>
                    {objetivosData.map((d,i) => <rect key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            : <p style={{color:tok.t4,fontSize:"0.82rem"}}>Sin objetivos definidos.</p>}
        </Card>

        <Card>
          <div style={{ fontSize:"0.72rem", fontWeight:700, color:tok.t3, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"1rem" }}>NC e Incidentes por Estado</div>
          {["Abierta","En Proceso","Cerrada"].map(est=>{
            const cnt=(s.noConformidades||[]).filter(n=>n.estado===est).length;
            const total=(s.noConformidades||[]).length;
            const col=est==="Cerrada"?"#16a34a":est==="En Proceso"?"#2563eb":"#dc2626";
            return total>0?<div key={est} style={{marginBottom:"0.7rem"}}><ProgBar value={cnt} max={total} label={`${est}: ${cnt}`} color={col}/></div>:null;
          })}
          {(s.noConformidades||[]).length===0&&<p style={{color:tok.t4,fontSize:"0.82rem"}}>Sin NC registradas.</p>}
        </Card>
      </div>

      {/* KPI Semáforos */}
      {kpiRecientes.length>0&&(
        <Card style={{ marginBottom:"1.25rem" }}>
          <div style={{ fontSize:"0.72rem", fontWeight:700, color:tok.t3, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"1rem" }}>Semáforo de KPIs</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"0.75rem" }}>
            {kpiRecientes.map(kpi=>(
              <div key={kpi.id} style={{ background:"#f8fafc", borderRadius:10, padding:"0.85rem", border:"1.5px solid #e2e8f0" }}>
                <div style={{ fontSize:"0.75rem", fontWeight:600, color:tok.t2, marginBottom:"0.4rem" }}>{kpi.nombre}</div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ fontSize:"1.2rem", fontWeight:800, color:tok.t1 }}>{kpi.ultimo?`${kpi.ultimo.valor}${kpi.unidad?" "+kpi.unidad:""}` : "—"}</div>
                  {kpi.ultimo&&<Semaforo val={Number(kpi.ultimo.valor)} meta={Number(kpi.meta)} invert={kpi.invert} />}
                </div>
                <div style={{ fontSize:"0.67rem", color:tok.t4, marginTop:"3px" }}>Meta: {kpi.meta} {kpi.unidad||""}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Cobertura normativa rápida */}
      {normas.length>0&&(
        <Card>
          <div style={{ fontSize:"0.72rem", fontWeight:700, color:tok.t3, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"1rem" }}>Cobertura normativa</div>
          {normas.map(norma=>{
            const reqs = REQUISITOS_NORMATIVOS.filter(r=>r.norma===norma);
            const cubiertas = reqs.filter(r=>getCobertura(r.key,state)).length;
            const pct = reqs.length>0?Math.round((cubiertas/reqs.length)*100):0;
            const col = pct>=80?"#16a34a":pct>=50?"#d97706":"#dc2626";
            return <div key={norma} style={{marginBottom:"0.75rem"}}><ProgBar value={cubiertas} max={reqs.length} label={`${norma}: ${cubiertas}/${reqs.length} cláusulas`} color={col} /></div>;
          })}
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// KPIs MODULE
// ═══════════════════════════════════════════════════════
function KpisModule({ state, dispatch, tok }) {
  const [tab, setTab] = useState("kpis");
  const [showKpiModal, setShowKpiModal] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [kpiForm, setKpiForm] = useState({});
  const [regForm, setRegForm] = useState({ kpiId:"", valor:"", fecha:new Date().toISOString().slice(0,10), observacion:"" });

  const kpis = state.kpis || [];
  const regs = state.kpiRegistros || [];

  const saveKpis = v => dispatch({ type:"SET", key:"kpis", val:v });
  const saveRegs = v => dispatch({ type:"SET", key:"kpiRegistros", val:v });

  const TABS = [
    { id:"kpis", label:"Definición", icon:"target" },
    { id:"carga", label:"Carga de datos", icon:"plus" },
    { id:"graficos", label:"Gráficos", icon:"chart" },
  ];

  const handleSaveKpi = () => {
    const l = [...kpis];
    const e = { ...kpiForm, id: kpiForm.id||Date.now().toString() };
    if (editIdx!==null) l[editIdx]=e; else l.push(e);
    saveKpis(l); setShowKpiModal(false);
  };

  const handleSaveReg = () => {
    if (!regForm.kpiId||!regForm.valor) return;
    saveRegs([...regs, { ...regForm, id:Date.now().toString() }]);
    setShowRegModal(false);
    setRegForm({ kpiId:"", valor:"", fecha:new Date().toISOString().slice(0,10), observacion:"" });
  };

  const chartData = (kpi) => regs.filter(r=>r.kpiId===kpi.id).sort((a,b)=>new Date(a.fecha)-new Date(b.fecha)).slice(-18).map(r=>({ fecha:r.fecha?.slice(5), valor:Number(r.valor), meta:Number(kpi.meta) }));

  return (
    <div>
      <SecHdr title="KPIs e Indicadores" subtitle="Definición, carga periódica y visualización del desempeño" icon="chart" tok={tok}>
        {tab==="kpis"&&<Btn tok={tok} icon="plus" onClick={()=>{setKpiForm({frecuencia:"Mensual",invert:false});setEditIdx(null);setShowKpiModal(true);}}>Nuevo KPI</Btn>}
        {tab==="carga"&&<Btn tok={tok} icon="plus" onClick={()=>setShowRegModal(true)}>Cargar medición</Btn>}
      </SecHdr>

      <div style={{ display:"flex", gap:4, padding:4, background:"#f1f5f9", borderRadius:10, marginBottom:"1.5rem", flexWrap:"wrap" }}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 13px", borderRadius:8, border:"none", background:tab===t.id?"#fff":"transparent", color:tab===t.id?tok.brand:tok.t3, fontWeight:600, fontSize:"0.79rem", cursor:"pointer", transition:"all .15s", boxShadow:tab===t.id?"0 1px 4px #0001":"none" }}><Ic n={t.icon} s={13} />{t.label}</button>)}
      </div>

      {tab==="kpis"&&(
        <Card>
          <Tbl tok={tok}
            cols={[
              {l:"KPI",k:"nombre"},{l:"Proceso",k:"proceso"},{l:"Norma",k:"normaISO"},
              {l:"Meta",r:r=>`${r.meta||"—"} ${r.unidad||""}`},{l:"Umbral",r:r=>`${r.umbral||"—"} ${r.unidad||""}`},
              {l:"Frecuencia",k:"frecuencia"},{l:"Responsable",k:"responsable"},
              {l:"Sentido",r:r=><Bdg label={r.invert?"Menor=Mejor":"Mayor=Mejor"} />},
            ]}
            rows={kpis}
            onEdit={(row,i)=>{setKpiForm(row);setEditIdx(i);setShowKpiModal(true);}}
            onDel={i=>{const l=[...kpis];l.splice(i,1);saveKpis(l);}}
            empty="No hay KPIs definidos."
          />
        </Card>
      )}

      {tab==="carga"&&(
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:"1rem" }}>
          {kpis.map(kpi=>{
            const r = regs.filter(r=>r.kpiId===kpi.id).sort((a,b)=>new Date(b.fecha)-new Date(a.fecha));
            const ult = r[0];
            return (
              <Card key={kpi.id}>
                <div style={{fontWeight:700,fontSize:"0.9rem",color:tok.t1,marginBottom:"0.3rem"}}>{kpi.nombre}</div>
                <div style={{fontSize:"0.71rem",color:tok.t4,marginBottom:"0.75rem"}}>{kpi.proceso} · {kpi.frecuencia}</div>
                {ult&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.4rem"}}>
                  <span style={{fontSize:"1.5rem",fontWeight:800,color:tok.t1}}>{ult.valor} <span style={{fontSize:"0.75rem",fontWeight:400,color:tok.t4}}>{kpi.unidad}</span></span>
                  <Semaforo val={Number(ult.valor)} meta={Number(kpi.meta)} invert={kpi.invert} />
                </div>}
                <div style={{fontSize:"0.7rem",color:tok.t4,marginBottom:"0.75rem"}}>Meta: {kpi.meta} {kpi.unidad} · Último: {ult?.fecha||"Sin datos"}</div>
                <Btn tok={tok} variant="outline" size="sm" full icon="plus" onClick={()=>{setRegForm({kpiId:kpi.id,valor:"",fecha:new Date().toISOString().slice(0,10),observacion:""});setShowRegModal(true);}}>Cargar dato</Btn>
              </Card>
            );
          })}
          {kpis.length===0&&<Card><p style={{color:tok.t4,textAlign:"center",padding:"2rem"}}>Defina KPIs primero en la pestaña "Definición".</p></Card>}
        </div>
      )}

      {tab==="graficos"&&(
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          {kpis.map(kpi=>{
            const data = chartData(kpi);
            if (data.length===0) return (
              <Card key={kpi.id}>
                <div style={{fontWeight:700,fontSize:"0.9rem",color:tok.t1,marginBottom:"0.3rem"}}>{kpi.nombre}</div>
                <p style={{color:tok.t4,fontSize:"0.82rem"}}>Sin datos cargados. Ve a "Carga de datos" para registrar mediciones.</p>
              </Card>
            );
            const ult = data[data.length-1];
            return (
              <Card key={kpi.id}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem",flexWrap:"wrap",gap:"0.5rem"}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:"0.95rem",color:tok.t1}}>{kpi.nombre}</div>
                    <div style={{fontSize:"0.71rem",color:tok.t4}}>{kpi.proceso} · {kpi.frecuencia} · Fórmula: {kpi.formula||"—"}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:"0.67rem",color:tok.t4}}>Último valor</div>
                      <div style={{fontSize:"1.3rem",fontWeight:800,color:tok.t1}}>{ult?.valor} <span style={{fontSize:"0.75rem",fontWeight:400}}>{kpi.unidad}</span></div>
                    </div>
                    <Semaforo val={Number(ult?.valor||0)} meta={Number(kpi.meta)} invert={kpi.invert} />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data} margin={{top:5,right:10,left:-25,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="fecha" tick={{fontSize:11,fill:"#94a3b8"}} />
                    <YAxis tick={{fontSize:11,fill:"#94a3b8"}} />
                    <Tooltip contentStyle={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,fontSize:"0.78rem"}} />
                    <ReferenceLine y={Number(kpi.meta)} stroke="#16a34a" strokeDasharray="5 4" label={{value:"Meta",fill:"#16a34a",fontSize:11}} />
                    {kpi.umbral&&<ReferenceLine y={Number(kpi.umbral)} stroke="#d97706" strokeDasharray="5 4" label={{value:"Umbral",fill:"#d97706",fontSize:11}} />}
                    <Line type="monotone" dataKey="valor" stroke={tok.brand} strokeWidth={2.5} dot={{fill:tok.brand,r:4}} activeDot={{r:6}} name="Valor real" />
                    <Legend wrapperStyle={{fontSize:"0.75rem"}} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            );
          })}
          {kpis.length===0&&<Card><p style={{color:tok.t4,textAlign:"center",padding:"3rem"}}>Sin KPIs definidos.</p></Card>}
        </div>
      )}

      {showKpiModal&&<Modal title={editIdx!==null?"Editar KPI":"Nuevo KPI"} onClose={()=>setShowKpiModal(false)} wide icon="chart" tok={tok}>
        <Fld label="Nombre del KPI"><Inp tok={tok} value={kpiForm.nombre||""} onChange={e=>setKpiForm({...kpiForm,nombre:e.target.value})} placeholder="Ej: Satisfacción del cliente, Tasa de accidentes..." /></Fld>
        <Row>
          <Fld label="Proceso relacionado" half><Inp tok={tok} value={kpiForm.proceso||""} onChange={e=>setKpiForm({...kpiForm,proceso:e.target.value})} /></Fld>
          <Fld label="Norma ISO" half><Sel tok={tok} value={kpiForm.normaISO||""} onChange={e=>setKpiForm({...kpiForm,normaISO:e.target.value})}><option value="">General</option><option>ISO 9001</option><option>ISO 14001</option><option>ISO 45001</option><option>ISO 50001</option><option>ISO 55001</option><option>ISO 39001</option></Sel></Fld>
        </Row>
        <Row>
          <Fld label="Fórmula de cálculo" half><Inp tok={tok} value={kpiForm.formula||""} onChange={e=>setKpiForm({...kpiForm,formula:e.target.value})} placeholder="(NC/Total)×100" /></Fld>
          <Fld label="Unidad de medida" third><Inp tok={tok} value={kpiForm.unidad||""} onChange={e=>setKpiForm({...kpiForm,unidad:e.target.value})} placeholder="%, hs, u, kg..." /></Fld>
        </Row>
        <Row>
          <Fld label="Meta" third><Inp tok={tok} type="number" value={kpiForm.meta||""} onChange={e=>setKpiForm({...kpiForm,meta:e.target.value})} /></Fld>
          <Fld label="Umbral de alerta" third><Inp tok={tok} type="number" value={kpiForm.umbral||""} onChange={e=>setKpiForm({...kpiForm,umbral:e.target.value})} /></Fld>
          <Fld label="Frecuencia" third><Sel tok={tok} value={kpiForm.frecuencia||"Mensual"} onChange={e=>setKpiForm({...kpiForm,frecuencia:e.target.value})}><option>Diario</option><option>Semanal</option><option>Mensual</option><option>Trimestral</option><option>Semestral</option><option>Anual</option></Sel></Fld>
        </Row>
        <Row>
          <Fld label="Responsable" half><Inp tok={tok} value={kpiForm.responsable||""} onChange={e=>setKpiForm({...kpiForm,responsable:e.target.value})} /></Fld>
          <Fld label="Sentido del indicador" half><Sel tok={tok} value={kpiForm.invert?"invert":"normal"} onChange={e=>setKpiForm({...kpiForm,invert:e.target.value==="invert"})}><option value="normal">Mayor es mejor (ej: satisfacción)</option><option value="invert">Menor es mejor (ej: defectos, accidentes)</option></Sel></Fld>
        </Row>
        <Btn tok={tok} full onClick={handleSaveKpi}>Guardar KPI</Btn>
      </Modal>}

      {showRegModal&&<Modal title="Cargar medición" onClose={()=>setShowRegModal(false)} icon="plus" tok={tok}>
        <Fld label="KPI"><Sel tok={tok} value={regForm.kpiId} onChange={e=>setRegForm({...regForm,kpiId:e.target.value})}><option value="">Seleccionar KPI...</option>{kpis.map(k=><option key={k.id} value={k.id}>{k.nombre} ({k.unidad||"s/u"})</option>)}</Sel></Fld>
        <Row><Fld label="Valor medido" half><Inp tok={tok} type="number" step="any" value={regForm.valor} onChange={e=>setRegForm({...regForm,valor:e.target.value})} /></Fld><Fld label="Fecha" half><Inp tok={tok} type="date" value={regForm.fecha} onChange={e=>setRegForm({...regForm,fecha:e.target.value})} /></Fld></Row>
        <Fld label="Observaciones"><Tex tok={tok} value={regForm.observacion} onChange={e=>setRegForm({...regForm,observacion:e.target.value})} rows={3} /></Fld>
        <Btn tok={tok} full onClick={handleSaveReg}>Guardar medición</Btn>
      </Modal>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COBERTURA NORMATIVA
// ═══════════════════════════════════════════════════════
function CoberturaModule({ state, tok }) {
  const normasEmpresa = state.empresa?.normas || [];
  const reqs = normasEmpresa.length>0 ? REQUISITOS_NORMATIVOS.filter(r=>normasEmpresa.includes(r.norma)) : REQUISITOS_NORMATIVOS;
  const cubiertas = reqs.filter(r=>getCobertura(r.key,state)).length;
  const pct = reqs.length>0?Math.round((cubiertas/reqs.length)*100):0;
  const normasUnicas = [...new Set(reqs.map(r=>r.norma))];
  const colores = {"ISO 9001":"#2563eb","ISO 14001":"#16a34a","ISO 45001":"#d97706","ISO 50001":"#8b5cf6","ISO 55001":"#0891b2","ISO 39001":"#dc2626"};

  return (
    <div>
      <SecHdr title="Cobertura Normativa" subtitle="Gap analysis — verificación de requisitos normativos con datos registrados" icon="norm" tok={tok} />
      <Card style={{ marginBottom:"1.5rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"2rem", flexWrap:"wrap" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:"3.5rem", fontWeight:900, color:pct>=80?"#16a34a":pct>=50?"#d97706":"#dc2626", lineHeight:1 }}>{pct}%</div>
            <div style={{ fontSize:"0.81rem", color:tok.t3, marginTop:"0.25rem" }}>Cobertura general</div>
          </div>
          <div style={{ flex:1, minWidth:200 }}>
            <ProgBar value={cubiertas} max={reqs.length} label={`${cubiertas} de ${reqs.length} requisitos con datos registrados`} color={pct>=80?"#16a34a":pct>=50?"#d97706":"#dc2626"} />
            <p style={{ margin:"0.75rem 0 0", fontSize:"0.77rem", color:tok.t4, lineHeight:1.6 }}>Este indicador muestra qué porcentaje de los requisitos normativos aplicables tienen registros en el sistema. Una cobertura alta facilita la demostración de cumplimiento ante auditorías de certificación.</p>
          </div>
        </div>
      </Card>

      {normasUnicas.map(norma=>{
        const rn=reqs.filter(r=>r.norma===norma);
        const cn=rn.filter(r=>getCobertura(r.key,state)).length;
        const pn=Math.round((cn/rn.length)*100);
        const col=colores[norma]||tok.brand;
        return (
          <Card key={norma} style={{ marginBottom:"1rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.85rem", flexWrap:"wrap", gap:"0.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                <div style={{ width:9, height:9, borderRadius:"50%", background:col }} />
                <h3 style={{ margin:0, fontWeight:700, fontSize:"0.95rem", color:tok.t1 }}>{norma}</h3>
              </div>
              <div style={{ display:"flex", gap:"1rem", alignItems:"center" }}>
                <span style={{ fontSize:"0.81rem", color:tok.t3 }}>{cn}/{rn.length} cláusulas</span>
                <span style={{ fontWeight:800, fontSize:"1.05rem", color:pn>=80?"#16a34a":pn>=50?"#d97706":"#dc2626" }}>{pn}%</span>
              </div>
            </div>
            <ProgBar value={cn} max={rn.length} color={col} />
            <div style={{ marginTop:"1rem", display:"grid", gap:"0.35rem" }}>
              {rn.map(req=>{
                const tiene=getCobertura(req.key,state);
                const esGap=req.gap.startsWith("⚠");
                return (
                  <div key={req.num} style={{ display:"flex", alignItems:"flex-start", gap:"0.65rem", padding:"6px 10px", background:tiene?"#f0fdf4":esGap?"#fff7ed":"#fefce8", borderRadius:7, border:`1px solid ${tiene?"#bbf7d0":esGap?"#fed7aa":"#fef08a"}` }}>
                    <Ic n={tiene?"check":"alert"} s={14} col={tiene?"#16a34a":esGap?"#d97706":"#ca8a04"} />
                    <span style={{ fontSize:"0.67rem", fontWeight:700, color:tok.t3, minWidth:40, flexShrink:0 }}>{req.num}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"0.78rem", color:tok.t2 }}>{req.titulo}</div>
                      {!tiene&&<div style={{ fontSize:"0.69rem", color:esGap?"#92400e":"#854d0e", marginTop:"2px" }}>{req.gap}</div>}
                    </div>
                    <span style={{ fontSize:"0.66rem", background:tiene?"#dcfce7":esGap?"#ffedd5":"#fefce8", color:tiene?"#15803d":esGap?"#c2410c":"#a16207", borderRadius:5, padding:"1px 7px", fontWeight:700, whiteSpace:"nowrap", flexShrink:0 }}>{tiene?"✓ Con datos":esGap?"⚠ GAP":"Sin datos"}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BRANDING
// ═══════════════════════════════════════════════════════
function BrandingModule({ state, dispatch, tok }) {
  const [form, setForm] = useState({ ...state.branding });
  const ref = useRef();

  const handleLogo = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => setForm(x=>({...x,logo:ev.target.result}));
    r.readAsDataURL(f);
  };

  const save = () => { dispatch({ type:"SET", key:"branding", val:form }); };

  return (
    <div>
      <SecHdr title="Configuración de Marca" subtitle="Personalice el sistema con la identidad de su empresa" icon="settings" tok={tok} />
      <Card style={{ maxWidth:580 }}>
        <Fld label="Nombre de la organización"><Inp tok={tok} value={form.nombre||""} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="Razón social..." /></Fld>
        <Fld label="Logo">
          <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={handleLogo} />
          <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
            {form.logo?<img src={form.logo} alt="Logo" style={{maxWidth:110,maxHeight:55,objectFit:"contain",border:"1.5px solid #e2e8f0",borderRadius:8,padding:4}} />
              :<div style={{width:80,height:48,background:"#f1f5f9",borderRadius:8,border:"1.5px dashed #cbd5e1",display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",fontSize:"0.71rem"}}>Sin logo</div>}
            <div style={{display:"flex",gap:"0.5rem"}}>
              <Btn tok={tok} variant="ghost" icon="upload" onClick={()=>ref.current?.click()}>Subir</Btn>
              {form.logo&&<Btn tok={tok} variant="ghost" icon="x" onClick={()=>setForm({...form,logo:null})}>Quitar</Btn>}
            </div>
          </div>
        </Fld>
        <Row>
          <Fld label="Color principal" half>
            <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
              <input type="color" value={form.colorPrimario||"#2563eb"} onChange={e=>setForm({...form,colorPrimario:e.target.value})} style={{width:40,height:34,borderRadius:7,border:"1.5px solid #e2e8f0",cursor:"pointer",padding:2}} />
              <Inp tok={tok} value={form.colorPrimario||"#2563eb"} onChange={e=>setForm({...form,colorPrimario:e.target.value})} style={{...makeInpStyle(tok),width:100}} />
            </div>
          </Fld>
          <Fld label="Color secundario" half>
            <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
              <input type="color" value={form.colorSecundario||"#0891b2"} onChange={e=>setForm({...form,colorSecundario:e.target.value})} style={{width:40,height:34,borderRadius:7,border:"1.5px solid #e2e8f0",cursor:"pointer",padding:2}} />
              <Inp tok={tok} value={form.colorSecundario||"#0891b2"} onChange={e=>setForm({...form,colorSecundario:e.target.value})} style={{...makeInpStyle(tok),width:100}} />
            </div>
          </Fld>
        </Row>
        <div style={{padding:"1rem",background:"#f8fafc",borderRadius:10,border:"1.5px solid #e2e8f0",marginBottom:"1rem"}}>
          <div style={{fontSize:"0.67rem",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.75rem"}}>Vista previa</div>
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.75rem"}}>
            <div style={{width:36,height:36,borderRadius:9,background:`linear-gradient(135deg,${form.colorPrimario||"#2563eb"},${form.colorSecundario||"#0891b2"})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:"0.85rem"}}>
              {(form.nombre||"ME").slice(0,2).toUpperCase()}
            </div>
            <div style={{fontWeight:700,fontSize:"0.9rem",color:tok.t1}}>{form.nombre||"Mi Empresa"}</div>
          </div>
          <div style={{display:"flex",gap:"0.5rem"}}>
            <span style={{background:form.colorPrimario||"#2563eb",color:"#fff",borderRadius:8,padding:"6px 14px",fontWeight:600,fontSize:"0.8rem"}}>Botón primario</span>
            <span style={{background:"transparent",color:form.colorPrimario||"#2563eb",border:`1.5px solid ${form.colorPrimario||"#2563eb"}`,borderRadius:8,padding:"5px 13px",fontWeight:600,fontSize:"0.8rem"}}>Outline</span>
          </div>
        </div>
        <Btn tok={tok} full size="lg" icon="check" onClick={save}>Guardar configuración</Btn>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// USUARIOS
// ═══════════════════════════════════════════════════════
const PERFILES = { "Administrador":"Acceso total + gestión de usuarios", "Responsable SGI":"Acceso completo, sin gestión de usuarios", "Auditor Interno":"Auditorías y NC (solo lectura el resto)", "Jefe de Área":"Su área + carga de datos asignados", "Operador":"Solo módulos asignados, solo escritura", "Solo lectura":"Consulta toda la información" };

function UsuariosModule({ state, dispatch, tok }) {
  const [showUser, setShowUser] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [uForm, setUForm] = useState({});
  const [tForm, setTForm] = useState({ titulo:"", descripcion:"", asignadoId:"", prioridad:"Media", plazo:"", modulo:"" });

  const usuarios = state.usuarios || [];
  const tareas = state.tareas || [];
  const saveU = v => dispatch({ type:"SET", key:"usuarios", val:v });
  const saveT = v => dispatch({ type:"SET", key:"tareas", val:v });

  const handleSaveU = () => {
    const l=[...usuarios];
    const e={...uForm, id:uForm.id||Date.now().toString(), activo:uForm.activo!==false};
    if(editIdx!==null) l[editIdx]=e; else l.push(e);
    saveU(l); setShowUser(false);
  };

  const handleSaveTask = () => {
    const t={ ...tForm, id:Date.now().toString(), estado:"Pendiente", creadoPor:state.sesion?.id, fechaCreacion:new Date().toISOString() };
    saveT([...tareas, t]);
    // simulate notification
    const notifs = [...(state.notificaciones||[])];
    const dest = usuarios.find(u=>u.id===tForm.asignadoId);
    if(dest){
      notifs.unshift({ id:Date.now().toString(), destinatarioId:dest.id, destinatarioEmail:dest.email, asunto:`Nueva tarea: ${tForm.titulo}`, mensaje:`Se le ha asignado la tarea "${tForm.titulo}" en el módulo ${tForm.modulo||"SGI"}. Plazo: ${tForm.plazo||"Sin plazo"}.`, tipo:"tarea", fecha:new Date().toISOString(), leida:false });
      dispatch({ type:"SET", key:"notificaciones", val:notifs });
    }
    setShowTask(false);
    setTForm({ titulo:"", descripcion:"", asignadoId:"", prioridad:"Media", plazo:"", modulo:"" });
  };

  const allModules = NAV_GROUPS.flatMap(g=>g.items);

  return (
    <div>
      <SecHdr title="Usuarios y Accesos" subtitle="Gestión de usuarios, perfiles y asignación de tareas con notificaciones" icon="lock" tok={tok}>
        <Btn tok={tok} variant="ghost" icon="clip" onClick={()=>setShowTask(true)}>Asignar tarea</Btn>
        <Btn tok={tok} icon="plus" onClick={()=>{setUForm({perfil:"Operador",activo:true});setEditIdx(null);setShowUser(true);}}>Nuevo usuario</Btn>
      </SecHdr>

      {/* Perfiles */}
      <Card style={{ marginBottom:"1.25rem", background:"#f8fafc" }}>
        <div style={{ fontSize:"0.71rem", fontWeight:700, color:tok.t3, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.75rem" }}>Perfiles de acceso</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"0.5rem" }}>
          {Object.entries(PERFILES).map(([p,d])=>(
            <div key={p} style={{ background:"#fff", borderRadius:8, padding:"0.65rem 0.85rem", border:"1.5px solid #e2e8f0" }}>
              <div style={{ fontWeight:700, fontSize:"0.78rem", color:tok.t1, marginBottom:"2px" }}>{p}</div>
              <div style={{ fontSize:"0.7rem", color:tok.t3 }}>{d}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom:"1.25rem" }}>
        <Tbl tok={tok} cols={[{l:"Nombre",k:"nombre"},{l:"Email",k:"email"},{l:"Perfil",r:r=><Bdg label={r.perfil} />},{l:"Área",k:"area"},{l:"Estado",r:r=><Bdg label={r.activo!==false?"Activo":"Inactivo"} />}]}
          rows={usuarios}
          onEdit={(row,i)=>{setUForm(row);setEditIdx(i);setShowUser(true);}}
          onDel={i=>{const l=[...usuarios];l.splice(i,1);saveU(l);}}
        />
      </Card>

      <Card>
        <div style={{ fontSize:"0.71rem", fontWeight:700, color:tok.t3, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"1rem" }}>Tareas asignadas</div>
        <Tbl tok={tok}
          cols={[{l:"Tarea",k:"titulo"},{l:"Asignado a",r:r=>usuarios.find(u=>u.id===r.asignadoId)?.nombre||"—"},{l:"Módulo",k:"modulo"},{l:"Plazo",k:"plazo"},{l:"Prioridad",r:r=><Bdg label={r.prioridad} />},{l:"Estado",r:r=><Bdg label={r.estado} />}]}
          rows={tareas}
          onEdit={(row,i)=>{const l=[...tareas];l[i]={...row,estado:"Completada"};saveT(l);}}
          onDel={i=>{const l=[...tareas];l.splice(i,1);saveT(l);}}
        />
      </Card>

      {showUser&&<Modal title={editIdx!==null?"Editar usuario":"Nuevo usuario"} onClose={()=>setShowUser(false)} icon="person" tok={tok}>
        <Row><Fld label="Nombre completo" half><Inp tok={tok} value={uForm.nombre||""} onChange={e=>setUForm({...uForm,nombre:e.target.value})} /></Fld><Fld label="Email" half><Inp tok={tok} type="email" value={uForm.email||""} onChange={e=>setUForm({...uForm,email:e.target.value})} /></Fld></Row>
        <Row><Fld label="Contraseña" half><Inp tok={tok} type="password" value={uForm.password||""} onChange={e=>setUForm({...uForm,password:e.target.value})} placeholder="Mín. 6 caracteres" /></Fld><Fld label="Perfil" half><Sel tok={tok} value={uForm.perfil||"Operador"} onChange={e=>setUForm({...uForm,perfil:e.target.value})}>{Object.keys(PERFILES).map(p=><option key={p}>{p}</option>)}</Sel></Fld></Row>
        <Row><Fld label="Área / Departamento" half><Inp tok={tok} value={uForm.area||""} onChange={e=>setUForm({...uForm,area:e.target.value})} /></Fld><Fld label="Estado" half><Sel tok={tok} value={uForm.activo!==false?"activo":"inactivo"} onChange={e=>setUForm({...uForm,activo:e.target.value==="activo"})}><option value="activo">Activo</option><option value="inactivo">Inactivo</option></Sel></Fld></Row>
        <Btn tok={tok} full onClick={handleSaveU}>Guardar usuario</Btn>
      </Modal>}

      {showTask&&<Modal title="Asignar tarea" onClose={()=>setShowTask(false)} icon="clip" tok={tok}>
        <Fld label="Título de la tarea"><Inp tok={tok} value={tForm.titulo} onChange={e=>setTForm({...tForm,titulo:e.target.value})} placeholder="Qué debe realizar..." /></Fld>
        <Fld label="Descripción"><Tex tok={tok} value={tForm.descripcion} onChange={e=>setTForm({...tForm,descripcion:e.target.value})} rows={3} /></Fld>
        <Row>
          <Fld label="Asignar a" half><Sel tok={tok} value={tForm.asignadoId} onChange={e=>setTForm({...tForm,asignadoId:e.target.value})}><option value="">Seleccionar usuario...</option>{usuarios.map(u=><option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>)}</Sel></Fld>
          <Fld label="Módulo relacionado" half><Sel tok={tok} value={tForm.modulo} onChange={e=>setTForm({...tForm,modulo:e.target.value})}><option value="">Sin módulo</option>{allModules.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</Sel></Fld>
        </Row>
        <Row>
          <Fld label="Prioridad" half><Sel tok={tok} value={tForm.prioridad} onChange={e=>setTForm({...tForm,prioridad:e.target.value})}><option>Alta</option><option>Media</option><option>Baja</option></Sel></Fld>
          <Fld label="Plazo" half><Inp tok={tok} type="date" value={tForm.plazo} onChange={e=>setTForm({...tForm,plazo:e.target.value})} /></Fld>
        </Row>
        <Btn tok={tok} full icon="mail" onClick={handleSaveTask}>Asignar y notificar</Btn>
      </Modal>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// NOTIFICACIONES
// ═══════════════════════════════════════════════════════
function NotificacionesModule({ state, dispatch, tok }) {
  const user = state.sesion;
  const notifs = (state.notificaciones||[]).filter(n=>n.destinatarioId===user?.id).sort((a,b)=>new Date(b.fecha)-new Date(a.fecha));
  const noLeidas = notifs.filter(n=>!n.leida).length;

  const marcar = id => {
    const l=(state.notificaciones||[]).map(n=>n.id===id?{...n,leida:true}:n);
    dispatch({ type:"SET", key:"notificaciones", val:l });
  };
  const marcarTodas = () => {
    const l=(state.notificaciones||[]).map(n=>n.destinatarioId===user?.id?{...n,leida:true}:n);
    dispatch({ type:"SET", key:"notificaciones", val:l });
  };

  const typeData = { tarea:{icon:"clip",color:"#2563eb"}, alerta:{icon:"alert",color:"#dc2626"}, info:{icon:"info",color:"#0891b2"}, vencimiento:{icon:"clock",color:"#d97706"} };

  return (
    <div>
      <SecHdr title="Notificaciones" subtitle={`${noLeidas} sin leer`} icon="bell" tok={tok}>
        {noLeidas>0&&<Btn tok={tok} variant="ghost" icon="check" onClick={marcarTodas}>Marcar todas como leídas</Btn>}
      </SecHdr>
      {notifs.length===0
        ? <Card><div style={{textAlign:"center",padding:"4rem",color:tok.t4}}><Ic n="bell" s={40} /><p style={{marginTop:"1rem"}}>No hay notificaciones.</p></div></Card>
        : notifs.map(n=>{
          const td=typeData[n.tipo]||typeData.info;
          return (
            <div key={n.id} onClick={()=>marcar(n.id)}
              style={{ display:"flex", gap:"1rem", padding:"1rem 1.25rem", background:n.leida?"#fff":`${td.color}06`, border:`1.5px solid ${n.leida?"#f1f5f9":td.color+"30"}`, borderRadius:12, marginBottom:"0.5rem", cursor:"pointer", transition:"background .15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
              onMouseLeave={e=>e.currentTarget.style.background=n.leida?"#fff":`${td.color}06`}>
              <div style={{ width:36,height:36,borderRadius:9,background:`${td.color}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:td.color }}>
                <Ic n={td.icon} s={16} />
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"0.5rem"}}>
                  <div style={{fontWeight:n.leida?500:700,fontSize:"0.84rem",color:tok.t1}}>{n.asunto}</div>
                  {!n.leida&&<div style={{width:8,height:8,borderRadius:"50%",background:td.color,flexShrink:0,marginTop:4}} />}
                </div>
                <div style={{fontSize:"0.78rem",color:tok.t2,marginTop:"2px"}}>{n.mensaje}</div>
                <div style={{fontSize:"0.67rem",color:tok.t4,marginTop:"4px"}}>{new Date(n.fecha).toLocaleString("es-AR")} · {n.destinatarioEmail}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TAREAS
// ═══════════════════════════════════════════════════════
function TareasModule({ state, dispatch, tok }) {
  const user = state.sesion;
  const tareas = (state.tareas||[]).filter(t=>t.asignadoId===user?.id);
  const allMods = NAV_GROUPS.flatMap(g=>g.items);

  const upd = (id, estado) => {
    const l=(state.tareas||[]).map(t=>t.id===id?{...t,estado}:t);
    dispatch({ type:"SET", key:"tareas", val:l });
  };

  return (
    <div>
      <SecHdr title="Mis Tareas" subtitle="Tareas pendientes asignadas" icon="clip" tok={tok} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.8rem", marginBottom:"1.4rem" }}>
        <Kpi label="Pendientes" value={tareas.filter(t=>t.estado==="Pendiente").length} icon="clock" color="#d97706" />
        <Kpi label="En proceso" value={tareas.filter(t=>t.estado==="En Proceso").length} icon="trending" color={tok.brand} />
        <Kpi label="Completadas" value={tareas.filter(t=>t.estado==="Completada").length} icon="check" color="#16a34a" />
      </div>
      {tareas.length===0
        ? <Card><div style={{textAlign:"center",padding:"4rem",color:tok.t4}}><Ic n="check" s={40} /><p style={{marginTop:"1rem"}}>¡Sin tareas pendientes!</p></div></Card>
        : tareas.map(t=>{
          const mod = allMods.find(m=>m.id===t.modulo);
          const venc = t.plazo&&new Date(t.plazo)<new Date()&&t.estado!=="Completada";
          return (
            <Card key={t.id} style={{ marginBottom:"0.75rem", borderColor:venc?"#fca5a5":undefined }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"0.75rem"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.3rem",flexWrap:"wrap"}}>
                    <Bdg label={t.prioridad} />{mod&&<ColorBdg label={mod.label} color="gray" />}{venc&&<ColorBdg label="VENCIDA" color="red" />}
                  </div>
                  <div style={{fontWeight:700,fontSize:"0.9rem",color:tok.t1}}>{t.titulo}</div>
                  {t.descripcion&&<p style={{margin:"0.25rem 0 0",fontSize:"0.79rem",color:tok.t2}}>{t.descripcion}</p>}
                  <div style={{fontSize:"0.71rem",color:tok.t4,marginTop:"0.35rem"}}>
                    {t.plazo&&`📅 Plazo: ${t.plazo}`}
                    {t.fechaCreacion&&` · Creada: ${new Date(t.fechaCreacion).toLocaleDateString("es-AR")}`}
                  </div>
                </div>
                <div style={{display:"flex",gap:"0.5rem"}}>
                  {t.estado!=="En Proceso"&&t.estado!=="Completada"&&<Btn tok={tok} size="sm" variant="outline" onClick={()=>upd(t.id,"En Proceso")}>Iniciar</Btn>}
                  {t.estado!=="Completada"&&<Btn tok={tok} size="sm" variant="success" icon="check" onClick={()=>upd(t.id,"Completada")}>Completar</Btn>}
                </div>
              </div>
            </Card>
          );
        })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// EMPRESA MODULE
// ═══════════════════════════════════════════════════════
function EmpresaModule({ state, dispatch, tok }) {
  const [form, setForm] = useState({ normas:[], ...state.empresa });
  const ALL_NORMAS = ["ISO 9001","ISO 14001","ISO 45001","ISO 50001","ISO 55001","ISO 39001","ISO 27001"];
  const tog = n => setForm(f=>({ ...f, normas:(f.normas||[]).includes(n)?(f.normas||[]).filter(x=>x!==n):[...(f.normas||[]),n] }));
  const save = () => { dispatch({ type:"SET", key:"empresa", val:form }); };
  return (
    <div>
      <SecHdr title="Organización y Alcance del SGI" subtitle="Datos generales, política, misión, visión y normas aplicables" icon="building" tok={tok} />
      <Card>
        <Row><Fld label="Nombre de la organización" half><Inp tok={tok} value={form.nombre||""} onChange={e=>setForm({...form,nombre:e.target.value})} /></Fld><Fld label="Sector / Rubro" half><Inp tok={tok} value={form.rubro||""} onChange={e=>setForm({...form,rubro:e.target.value})} /></Fld></Row>
        <Row><Fld label="Responsable del SGI" half><Inp tok={tok} value={form.responsable||""} onChange={e=>setForm({...form,responsable:e.target.value})} /></Fld><Fld label="Ciudad / País" half><Inp tok={tok} value={form.ciudad||""} onChange={e=>setForm({...form,ciudad:e.target.value})} /></Fld></Row>
        <Fld label="Alcance del Sistema de Gestión (cláusula 4.3)"><Tex tok={tok} value={form.alcance||""} onChange={e=>setForm({...form,alcance:e.target.value})} rows={3} placeholder="Descripción del alcance: productos/servicios incluidos, ubicaciones, procesos..." /></Fld>
        <Fld label="Exclusiones y justificación"><Tex tok={tok} value={form.exclusiones||""} onChange={e=>setForm({...form,exclusiones:e.target.value})} rows={2} /></Fld>
        <Fld label="Política del SGI (cláusula 5.2)"><Tex tok={tok} value={form.politica||""} onChange={e=>setForm({...form,politica:e.target.value})} rows={7} placeholder="Redacte la política del sistema de gestión..." /></Fld>
        <Row><Fld label="Misión" half><Tex tok={tok} value={form.mision||""} onChange={e=>setForm({...form,mision:e.target.value})} rows={3} /></Fld><Fld label="Visión" half><Tex tok={tok} value={form.vision||""} onChange={e=>setForm({...form,vision:e.target.value})} rows={3} /></Fld></Row>
        <Fld label="Valores organizacionales"><Inp tok={tok} value={form.valores||""} onChange={e=>setForm({...form,valores:e.target.value})} placeholder="Integridad, compromiso, calidad..." /></Fld>
        <Fld label="Normas del SGI aplicables">
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem",marginTop:"0.25rem"}}>
            {ALL_NORMAS.map(n=><button key={n} onClick={()=>tog(n)} style={{padding:"6px 13px",borderRadius:8,border:`1.5px solid ${(form.normas||[]).includes(n)?tok.brand:"#e2e8f0"}`,background:(form.normas||[]).includes(n)?`${tok.brand}10`:"#fff",color:(form.normas||[]).includes(n)?tok.brand:tok.t3,fontWeight:600,fontSize:"0.8rem",cursor:"pointer",transition:"all .15s"}}>{n}</button>)}
          </div>
        </Fld>
        <Btn tok={tok} size="lg" icon="check" onClick={save}>Guardar organización</Btn>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// GENERIC MODULE  (covers ~20 modules with field definitions)
// ═══════════════════════════════════════════════════════
const MODULE_DEFS = {
  contexto: {
    title:"Análisis de Contexto",subtitle:"Factores internos y externos — FODA (cláusula 4.1)",icon:"refresh",
    key:"contexto", isArray:false, listKey:"factores",
    fields:[["Tipo","tipo","select",["Interno","Externo"]],["Categoría","categoria","select",["Político","Económico","Social","Tecnológico","Ambiental","Legal","Competencia","Proceso interno","Cultura","Infraestructura"]],["Descripción","descripcion","textarea"],["Impacto en el SGI","impacto","textarea"],["Relevancia","relevancia","select",["Alta","Media","Baja"]]],
    cols:[{l:"Tipo",k:"tipo"},{l:"Categoría",k:"categoria"},{l:"Descripción",k:"descripcion"},{l:"Relevancia",r:r=><Bdg label={r.relevancia} />}],
  },
  partesInteresadas: {
    title:"Partes Interesadas",subtitle:"Identificación de stakeholders y sus requisitos (cláusula 4.2)",icon:"users",
    key:"partesInteresadas",
    fields:[["Nombre / Grupo","nombre","text"],["Tipo","tipo","select",["Interna","Externa"]],["Requisitos","requisitos","textarea"],["Expectativas","expectativas","textarea"],["Influencia","influencia","select",["Alta","Media","Baja"]],["Interés","interes","select",["Alto","Medio","Bajo"]],["Estrategia de gestión","estrategia","textarea"]],
    cols:[{l:"Nombre",k:"nombre"},{l:"Tipo",k:"tipo"},{l:"Requisitos",k:"requisitos"},{l:"Influencia",r:r=><Bdg label={r.influencia} />},{l:"Interés",r:r=><Bdg label={r.interes} />}],
  },
  requisitosLegales: {
    title:"Requisitos Legales y Otros",subtitle:"Identificación y evaluación de cumplimiento (cláusula 6.1.3 / 6.1.4)",icon:"law",
    key:"requisitosLegales",
    fields:[["Norma / Ley / Reglamento","norma","text"],["Tipo","tipo","select",["Legal","Reglamentario","Contractual","Voluntario","Sectorial"]],["Descripción","descripcion","textarea"],["Alcance","alcance","text"],["Norma ISO","normaISO","select",["ISO 9001","ISO 14001","ISO 45001","ISO 50001","Todas"]],["Cumplimiento","cumplimiento","select",["Cumple","Parcial","No Cumple","No Aplica"]],["Evidencia","evidencia","text"],["Responsable evaluación","responsable","text"],["Próxima revisión","proxRevision","date"]],
    cols:[{l:"Norma/Ley",k:"norma"},{l:"Tipo",k:"tipo"},{l:"ISO",k:"normaISO"},{l:"Cumplimiento",r:r=><Bdg label={r.cumplimiento} />},{l:"Responsable",k:"responsable"}],
  },
  gestionCambio: {
    title:"Gestión del Cambio",subtitle:"Registro de cambios planificados y su gestión (cláusula 6.3)",icon:"change",
    key:"gestionCambio",
    fields:[["Descripción del cambio","descripcion","textarea"],["Tipo","tipo","select",["Proceso","Producto/Servicio","Tecnología","Estructura","Normativo","Otro"]],["Impacto potencial","impacto","textarea"],["Riesgos del cambio","riesgos","textarea"],["Recursos necesarios","recursos","textarea"],["Acciones de gestión","acciones","textarea"],["Responsable","responsable","text"],["Fecha propuesta","fecha","date"],["Estado","estado","select",["Propuesto","Aprobado","En implementación","Implementado","Rechazado"]]],
    cols:[{l:"Descripción",k:"descripcion"},{l:"Tipo",k:"tipo"},{l:"Responsable",k:"responsable"},{l:"Fecha",k:"fecha"},{l:"Estado",r:r=><Bdg label={r.estado} />}],
  },
  procesos: {
    title:"Mapa de Procesos",subtitle:"Caracterización de procesos del SGI (cláusula 4.4 / 8.1)",icon:"gear",
    key:"procesos",
    fields:[["Nombre del proceso","nombre","text"],["Tipo","tipo","select",["Estratégico","Core / Misional","Soporte"]],["Objetivo","objetivo","textarea"],["Responsable","responsable","text"],["Entradas","entradas","textarea"],["Salidas","salidas","textarea"],["Recursos","recursos","textarea"],["Indicadores","indicadores","textarea"],["Riesgos asociados","riesgos","textarea"],["Controles","controles","textarea"],["Norma ISO","normaISO","select",["ISO 9001","ISO 14001","ISO 45001","Todas"]]],
    cols:[{l:"Proceso",k:"nombre"},{l:"Tipo",k:"tipo"},{l:"Responsable",k:"responsable"},{l:"Norma",k:"normaISO"}],
  },
  objetivos: {
    title:"Objetivos del SGI",subtitle:"Objetivos medibles con planes de acción (cláusula 6.2)",icon:"target",
    key:"objetivos",
    fields:[["Descripción del objetivo","descripcion","textarea"],["Norma ISO","normaISO","select",["ISO 9001","ISO 14001","ISO 45001","ISO 50001","ISO 55001","General"]],["Proceso relacionado","proceso","text"],["Meta","meta","text"],["Indicador de seguimiento","indicador","text"],["Avance (%)","avance","number"],["Responsable","responsable","text"],["Plazo","plazo","date"],["Acciones para lograrlo","acciones","textarea"],["Estado","estado","select",["En curso","Alcanzado","En riesgo","Cancelado"]]],
    cols:[{l:"Objetivo",k:"descripcion"},{l:"Norma",k:"normaISO"},{l:"Meta",k:"meta"},{l:"Avance",r:r=><div style={{minWidth:100}}><ProgBar value={Number(r.avance)||0} max={100} color="#2563eb" label={`${r.avance||0}%`} /></div>},{l:"Estado",r:r=><Bdg label={r.estado} />}],
  },
  comunicaciones: {
    title:"Plan de Comunicaciones",subtitle:"Comunicación interna y externa (cláusula 7.4 — ¡Brecha frecuente!)",icon:"mail",
    key:"comunicaciones",
    fields:[["Tema","tema","text"],["Tipo","tipo","select",["Interna","Externa"]],["Qué comunicar","que","textarea"],["A quién","quien","text"],["Cuándo / Frecuencia","cuando","text"],["Canal","como","select",["Reunión","Email","Cartelera","Intranet","Informe","Web","Otro"]],["Responsable","responsable","text"],["Norma ISO","normaISO","select",["ISO 9001","ISO 14001","ISO 45001","Todas"]],["Evidencia","evidencia","text"]],
    cols:[{l:"Tema",k:"tema"},{l:"Tipo",k:"tipo"},{l:"A quién",k:"quien"},{l:"Canal",k:"como"},{l:"Norma",k:"normaISO"}],
  },
  documentos: {
    title:"Información Documentada",subtitle:"Control de documentos y registros (cláusula 7.5)",icon:"doc",
    key:"documentos",
    fields:[["Título","titulo","text"],["Tipo","tipo","select",["Procedimiento","Instructivo","Registro","Política","Plan","Formulario","Manual","Otro"]],["Código","codigo","text"],["Versión","version","text"],["Área responsable","area","text"],["Elaborado por","elaborado","text"],["Revisado por","revisado","text"],["Aprobado por","aprobado","text"],["Fecha de aprobación","fechaAprobacion","date"],["Norma ISO","normaISO","select",["ISO 9001","ISO 14001","ISO 45001","Todas"]],["Ubicación / URL","ubicacion","text"],["Estado","estado","select",["Vigente","En revisión","Obsoleto"]]],
    cols:[{l:"Título",k:"titulo"},{l:"Tipo",k:"tipo"},{l:"Código",k:"codigo"},{l:"Versión",k:"version"},{l:"Aprobado",k:"aprobado"},{l:"Estado",r:r=><Bdg label={r.estado} />}],
  },
  proveedores: {
    title:"Proveedores Externos",subtitle:"Selección, evaluación y control de proveedores (cláusula 8.4)",icon:"supply",
    key:"proveedores",
    fields:[["Nombre del proveedor","nombre","text"],["Tipo de suministro","tipo","text"],["Criticidad","criticidad","select",["Alta","Media","Baja"]],["Criterios de selección","criterios","textarea"],["Última evaluación","ultimaEval","date"],["Criterios evaluados","criteriosEval","textarea"],["Calificación","calificacion","select",["Aprobado","Condicionado","No aprobado"]],["Observaciones","observaciones","textarea"]],
    cols:[{l:"Proveedor",k:"nombre"},{l:"Tipo",k:"tipo"},{l:"Criticidad",r:r=><Bdg label={r.criticidad} />},{l:"Calificación",r:r=><Bdg label={r.calificacion} />},{l:"Última eval.",k:"ultimaEval"}],
  },
  emergencias: {
    title:"Plan de Emergencias",subtitle:"Preparación y respuesta ante emergencias — ISO 14001 §8.2 / ISO 45001 §8.2",icon:"fire",
    key:"emergencias",
    fields:[["Tipo de emergencia","tipo","text"],["Descripción del escenario","descripcion","textarea"],["Sistema","sistema","select",["Ambiental","SST","Ambos"]],["Procedimiento de respuesta","procedimiento","textarea"],["Recursos necesarios","recursos","textarea"],["Responsable","responsable","text"],["Comunicaciones de emergencia","comunicaciones","textarea"],["Teléfonos de emergencia","telefonos","text"],["Frecuencia de simulacro","frecuenciaSimulacro","text"],["Último simulacro","ultimoSimulacro","date"],["Resultado simulacro","resultadoSimulacro","textarea"]],
    cols:[{l:"Tipo",k:"tipo"},{l:"Sistema",k:"sistema"},{l:"Responsable",k:"responsable"},{l:"Último simulacro",k:"ultimoSimulacro"}],
  },
  riesgosEstrategicos: {
    title:"Riesgos Estratégicos",subtitle:"Riesgos y oportunidades del SGI (cláusula 6.1)",icon:"alert",
    key:"riesgosEstrategicos",
    fields:[["Descripción del riesgo","descripcion","textarea"],["Categoría","categoria","select",["Estratégico","Operativo","Financiero","Legal","Reputacional","Ambiental","SST"]],["Norma ISO","normaISO","select",["ISO 9001","ISO 14001","ISO 45001","ISO 50001","Todas"]],["Causas","causa","textarea"],["Consecuencias","consecuencia","textarea"],["Probabilidad inherente (1-5)","probI","select",["1","2","3","4","5"]],["Impacto inherente (1-5)","impI","select",["1","2","3","4","5"]],["Tratamiento","tratamiento","select",["Aceptar","Mitigar","Transferir","Eliminar"]],["Controles existentes","controles","textarea"],["Probabilidad residual (1-5)","probR","select",["1","2","3","4","5"]],["Impacto residual (1-5)","impR","select",["1","2","3","4","5"]],["Responsable","responsable","text"]],
    cols:[{l:"Riesgo",k:"descripcion"},{l:"Categoría",k:"categoria"},{l:"Riesgo inhte.",r:r=>{const v=(+r.probI||1)*(+r.impI||1);return <Bdg label={v>=15?"Crítico":v>=8?"Alto":v>=4?"Moderado":"Bajo"} />}},{l:"Tratamiento",k:"tratamiento"},{l:"Riesgo resid.",r:r=>{const v=(+r.probR||1)*(+r.impR||1);return <Bdg label={v>=15?"Crítico":v>=8?"Alto":v>=4?"Moderado":"Bajo"} />}},{l:"Responsable",k:"responsable"}],
  },
  riesgosOperativos: {
    title:"Riesgos Operativos",subtitle:"Riesgos a nivel de proceso",icon:"alert",
    key:"riesgosOperativos",
    fields:[["Proceso","proceso","text"],["Descripción del riesgo","descripcion","textarea"],["Causas","causa","textarea"],["Consecuencias","consecuencia","textarea"],["Probabilidad (1-5)","probabilidad","select",["1","2","3","4","5"]],["Impacto (1-5)","impacto","select",["1","2","3","4","5"]],["Controles","controles","textarea"],["Tratamiento","tratamiento","select",["Aceptar","Mitigar","Transferir","Eliminar"]],["Responsable","responsable","text"]],
    cols:[{l:"Proceso",k:"proceso"},{l:"Riesgo",k:"descripcion"},{l:"Nivel",r:r=>{const v=(+r.probabilidad||1)*(+r.impacto||1);return <Bdg label={v>=15?"Crítico":v>=8?"Alto":v>=4?"Moderado":"Bajo"} />}},{l:"Tratamiento",k:"tratamiento"}],
  },
  peligros: {
    title:"Identificación de Peligros y Evaluación de Riesgos SST",subtitle:"Cláusula 6.1.1 ISO 45001 — Jerarquía de controles",icon:"shield",
    key:"peligros",
    fields:[["Área / Sector","area","text"],["Tarea / Actividad","tarea","text"],["Peligro identificado","peligro","textarea"],["Tipo de peligro","tipo","select",["Físico","Químico","Biológico","Ergonómico","Psicosocial","Mecánico","Eléctrico","Locativo","Vial","Otro"]],["Daño potencial","dano","textarea"],["Probabilidad (1-5)","probabilidad","select",["1","2","3","4","5"]],["Severidad (1-5)","severidad","select",["1","2","3","4","5"]],["Jerarquía de control","jerarquia","select",["Eliminación","Sustitución","Controles de ingeniería","Controles administrativos","EPP"]],["Control específico","control","textarea"],["Responsable","responsable","text"],["Estado","estado","select",["Identificado","Controlado","Residual aceptable"]]],
    cols:[{l:"Área",k:"area"},{l:"Peligro",k:"peligro"},{l:"Tipo",k:"tipo"},{l:"Nivel",r:r=>{const v=(+r.probabilidad||1)*(+r.severidad||1);return <Bdg label={v>=15?"Crítico":v>=8?"Alto":v>=4?"Moderado":"Bajo"} />}},{l:"Jerarquía",k:"jerarquia"},{l:"Estado",r:r=><Bdg label={r.estado} />}],
  },
  aspectosAmbientales: {
    title:"Aspectos e Impactos Ambientales",subtitle:"Identificación y evaluación de aspectos significativos (cláusula 6.1.2 ISO 14001)",icon:"leaf",
    key:"aspectosAmbientales",
    fields:[["Área / Proceso","area","text"],["Actividad","actividad","text"],["Aspecto ambiental","aspecto","textarea"],["Impacto ambiental","impacto","textarea"],["Condición","condicion","select",["Normal","Anormal","Emergencia"]],["Magnitud (1-5)","magnitud","select",["1","2","3","4","5"]],["Probabilidad (1-5)","probabilidad","select",["1","2","3","4","5"]],["¿Significativo?","significativo","select",["Sí","No"]],["Medida de control","medidaControl","textarea"],["Objetivo ambiental asociado","objetivo","text"],["Responsable","responsable","text"]],
    cols:[{l:"Área",k:"area"},{l:"Aspecto",k:"aspecto"},{l:"Impacto",k:"impacto"},{l:"Significativo",r:r=><Bdg label={r.significativo==="Sí"?"Sí":"No"} />},{l:"Control",k:"medidaControl"}],
  },
  activos: {
    title:"Gestión de Activos",subtitle:"Inventario y plan de gestión de activos (ISO 55001 §8.1/8.3)",icon:"asset",
    key:"activos",
    fields:[["Activo / Equipo","nombre","text"],["Código / Tag","codigo","text"],["Tipo","tipo","select",["Inmueble","Maquinaria","Equipo","Vehículo","IT","Instrumento","Otro"]],["Área","area","text"],["Valor de reposición ($)","valor","text"],["Vida útil estimada","vidaUtil","text"],["Año de adquisición","anio","text"],["Estado","estado","select",["Operativo","En mantenimiento","Fuera de servicio"]],["Criticidad","criticidad","select",["Alta","Media","Baja"]],["Responsable","responsable","text"]],
    cols:[{l:"Activo",k:"nombre"},{l:"Código",k:"codigo"},{l:"Tipo",k:"tipo"},{l:"Criticidad",r:r=><Bdg label={r.criticidad} />},{l:"Estado",r:r=><Bdg label={r.estado} />}],
  },
  indicadoresEnergia: {
    title:"Indicadores de Desempeño Energético (IDEn)",subtitle:"Línea de base e IDEn — ISO 50001 §6.4/6.5",icon:"energy",
    key:"indicadoresEnergia",
    fields:[["Nombre del IDEn","nombre","text"],["Fuente de energía","fuente","select",["Electricidad","Gas natural","GLP","Combustible líquido","Solar","Biomasa","Otro"]],["Proceso / Sistema","proceso","text"],["Unidad de medida","unidad","text"],["Línea de base","lineaBase","text"],["Año de línea de base","anioBase","text"],["Meta de mejora (%)","meta","text"],["Fórmula de cálculo","formula","text"],["Responsable","responsable","text"]],
    cols:[{l:"IDEn",k:"nombre"},{l:"Fuente",k:"fuente"},{l:"Proceso",k:"proceso"},{l:"Unidad",k:"unidad"},{l:"Línea base",k:"lineaBase"},{l:"Meta",r:r=>`${r.meta}%`}],
  },
  auditorias: {
    title:"Auditorías",subtitle:"Programa y registro de auditorías internas (cláusula 9.2)",icon:"audit",
    key:"auditorias",
    fields:[["Tipo","tipo","select",["Interna","Segunda parte","Tercera parte / Certificación"]],["Norma auditada","norma","select",["ISO 9001","ISO 14001","ISO 45001","ISO 50001","SGI Integrado"]],["Proceso / Área","proceso","text"],["Auditor responsable","auditor","text"],["Fecha programada","fechaProgramada","date"],["Fecha realizada","fechaRealizada","date"],["Estado","estado","select",["Programada","En Proceso","Finalizada","Cancelada"]],["Hallazgos","hallazgos","textarea"],["NC detectadas","ncDetectadas","text"],["Observaciones","observaciones","textarea"],["Conclusión","conclusion","textarea"],["Plazo para AC","fechaPlazo","date"]],
    cols:[{l:"Tipo",k:"tipo"},{l:"Norma",k:"norma"},{l:"Proceso",k:"proceso"},{l:"Auditor",k:"auditor"},{l:"Fecha prog.",k:"fechaProgramada"},{l:"Estado",r:r=><Bdg label={r.estado} />}],
  },
  noConformidades: {
    title:"No Conformidades e Incidentes",subtitle:"Gestión completa con análisis de causa raíz y verificación de eficacia (cláusula 10.2)",icon:"x",
    key:"noConformidades",
    fields:[["Título","titulo","text"],["Subtipo","subtipo","select",["No Conformidad","Observación","Incidente","Accidente","Casi Accidente","Desvío"]],["Sistema","sistema","select",["Calidad","Ambiental","SST","General"]],["Origen","origen","select",["Auditoría interna","Auditoría externa","Reclamo de cliente","Incidente","Monitoreo","Reporte de empleado","Revisión por dirección"]],["Descripción detallada","descripcion","textarea"],["Detectado por","detectadoPor","text"],["Fecha de detección","fechaDeteccion","date"],["Norma / Cláusula","clausula","text"],["Gravedad","gravedad","select",["Baja","Media","Alta","Crítica"]],["Corrección inmediata","correccion","textarea"],["Causa raíz","causaRaiz","textarea"],["Método análisis","metodo","select",["5 Por Qué","Ishikawa","Análisis libre","8D"]],["Acciones correctivas","accionesCorrectivas","textarea"],["Responsable","responsable","text"],["Plazo","plazo","date"],["Eficacia","eficacia","select",["Pendiente","Eficaz","Parcialmente Eficaz","No Eficaz"]],["Evidencia de eficacia","evidenciaEficacia","textarea"],["Fecha verificación","fechaVerificacion","date"],["Estado","estado","select",["Abierta","En Proceso","Cerrada","Cancelada"]],["Impacto en matriz de riesgos","impactoRiesgos","textarea"]],
    cols:[{l:"#",r:(_,i)=>i+1},{l:"Título",k:"titulo"},{l:"Subtipo",k:"subtipo"},{l:"Sistema",k:"sistema"},{l:"Gravedad",r:r=><Bdg label={r.gravedad} />},{l:"Responsable",k:"responsable"},{l:"Plazo",k:"plazo"},{l:"Eficacia",r:r=><Bdg label={r.eficacia||"Pendiente"} />},{l:"Estado",r:r=><Bdg label={r.estado} />}],
  },
  oportunidades: {
    title:"Oportunidades de Mejora",subtitle:"Identificación y seguimiento de mejoras (cláusula 10.1/10.3)",icon:"star",
    key:"oportunidades",
    fields:[["Descripción de la oportunidad","descripcion","textarea"],["Origen","origen","select",["Auditoría","Revisión por dirección","KPIs","Análisis de NC","Sugerencia interna","Benchmarking"]],["Proceso relacionado","proceso","text"],["Beneficio esperado","beneficio","textarea"],["Prioridad","prioridad","select",["Alta","Media","Baja"]],["Responsable","responsable","text"],["Plazo","plazo","date"],["Estado","estado","select",["Identificada","En Proceso","Implementada","Desestimada"]]],
    cols:[{l:"Oportunidad",k:"descripcion"},{l:"Origen",k:"origen"},{l:"Prioridad",r:r=><Bdg label={r.prioridad} />},{l:"Responsable",k:"responsable"},{l:"Estado",r:r=><Bdg label={r.estado} />}],
  },
  revisionDireccion: {
    title:"Revisión por la Dirección",subtitle:"Entradas cláusula 9.3.2 y salidas 9.3.3 — ISO 9001/14001/45001",icon:"eye",
    key:"revisionDireccion",
    fields:[["Período revisado","periodo","text"],["Fecha de revisión","fecha","date"],["Participantes","participantes","textarea"],["Desempeño de procesos y KPIs","desempeno","textarea"],["Estado de objetivos","estadoObjetivos","textarea"],["Resultado de auditorías","auditorias","textarea"],["NC y acciones correctivas","ncAcciones","textarea"],["Desempeño de proveedores","proveedores","textarea"],["Riesgos y oportunidades","riesgosOportunidades","textarea"],["Cambios en contexto y partes interesadas","cambios","textarea"],["Adecuación de recursos","recursos","textarea"],["Oportunidades de mejora identificadas","mejoras","textarea"],["Decisiones de la dirección","decisiones","textarea"],["Compromisos y acciones (salidas 9.3.3)","compromisos","textarea"],["Fecha próxima revisión","proxRevision","date"],["Estado","estado","select",["Planificada","Realizada"]]],
    cols:[{l:"Período",k:"periodo"},{l:"Fecha",k:"fecha"},{l:"Participantes",k:"participantes"},{l:"Decisiones",k:"decisiones"},{l:"Estado",r:r=><Bdg label={r.estado} />}],
  },
  mantenimiento: {
    title:"Mantenimiento",subtitle:"Planificación y registro de actividades de mantenimiento",icon:"tool",
    key:"mantenimiento",
    fields:[["Equipo / Instalación","equipo","text"],["Código","codigo","text"],["Área","area","text"],["Tipo","tipo","select",["Preventivo","Correctivo","Predictivo","Mejorativo"]],["Descripción de la tarea","descripcion","textarea"],["Frecuencia","frecuencia","select",["Diario","Semanal","Mensual","Trimestral","Semestral","Anual"]],["Responsable","responsable","text"],["Fecha programada","fechaProgramada","date"],["Fecha realizada","fechaRealizada","date"],["Estado","estado","select",["Programado","Realizado","Vencido","Cancelado"]],["Observaciones","observaciones","textarea"]],
    cols:[{l:"Equipo",k:"equipo"},{l:"Tipo",k:"tipo"},{l:"Frecuencia",k:"frecuencia"},{l:"Responsable",k:"responsable"},{l:"F. Programada",k:"fechaProgramada"},{l:"Estado",r:r=><Bdg label={r.estado} />}],
  },
  calibraciones: {
    title:"Calibración y Seguimiento y Medición",subtitle:"Control de equipos de medición (cláusula 7.1.5 — ¡Brecha frecuente!)",icon:"norm",
    key:"calibraciones",
    fields:[["Equipo / Instrumento","equipo","text"],["Código / Tag","codigo","text"],["Magnitud medida","magnitud","text"],["Rango de medición","rango","text"],["Resolución / Apreciación","resolucion","text"],["Intervalo de calibración","intervalo","text"],["Última calibración","ultimaCalib","date"],["Próxima calibración","proxCalib","date"],["Laboratorio calibrador","laboratorio","text"],["N° de certificado","numeroCert","text"],["Resultado","resultado","select",["Apto","No Apto","Condicional","En verificación"]],["Estado","estado","select",["Vigente","Vencido","Fuera de uso","Dado de baja"]]],
    cols:[{l:"Equipo",k:"equipo"},{l:"Código",k:"codigo"},{l:"Magnitud",k:"magnitud"},{l:"Próx. calib.",k:"proxCalib"},{l:"Resultado",r:r=><Bdg label={r.resultado} />},{l:"Estado",r:r=><Bdg label={r.estado} />}],
  },
  capacitaciones: {
    title:"Registro de Capacitaciones",subtitle:"Formación, toma de conciencia y evaluación de eficacia (cláusula 7.2/7.3)",icon:"book",
    key:"capacitaciones",
    fields:[["Tema / Nombre","tema","text"],["Tipo","tipo","select",["Interna","Externa","E-learning","Taller","Congreso"]],["Norma ISO","normaISO","select",["ISO 9001","ISO 14001","ISO 45001","ISO 50001","General"]],["Objetivo","objetivo","textarea"],["Destinatarios","destinatarios","text"],["Instructor / Proveedor","instructor","text"],["Duración","duracion","text"],["Modalidad","modalidad","select",["Presencial","Virtual","Mixta","Autoformación"]],["Fecha","fecha","date"],["N° asistentes","asistentes","number"],["Calificación promedio (1-5)","calificacion","number"],["Metodología evaluación eficacia","metodologiaEficacia","select",["Prueba escrita","Evaluación en puesto","Observación directa","Cuestionario"]],["Resultado eficacia","resultadoEficacia","textarea"],["Estado","estado","select",["Programada","Realizada","Cancelada"]],["Eficacia","eficacia","select",["Pendiente","Eficaz","Parcialmente Eficaz","No Eficaz"]]],
    cols:[{l:"Tema",k:"tema"},{l:"Tipo",k:"tipo"},{l:"Fecha",k:"fecha"},{l:"Asistentes",k:"asistentes"},{l:"Estado",r:r=><Bdg label={r.estado} />},{l:"Eficacia",r:r=><Bdg label={r.eficacia||"Pendiente"} />}],
  },
  personal: {
    title:"RRHH / Legajos del Personal",subtitle:"Gestión de personal, competencias y documentación (cláusula 7.1/7.2)",icon:"person",
    key:"personal",
    fields:[["Nombre completo","nombre","text"],["Puesto","puesto","text"],["Área / Departamento","area","text"],["N° de Legajo","legajo","text"],["DNI / CUIL","dni","text"],["Fecha de ingreso","ingreso","date"],["Email","email","email"],["Nivel educativo","educacion","select",["Primario","Secundario","Terciario","Universitario","Posgrado"]],["Estado","estado","select",["Activo","Inactivo","Licencia","Egresado"]]],
    cols:[{l:"Nombre",k:"nombre"},{l:"Puesto",k:"puesto"},{l:"Área",k:"area"},{l:"Legajo",k:"legajo"},{l:"Estado",r:r=><Bdg label={r.estado} />}],
  },
};

function GenericModule({ moduleId, state, dispatch, tok }) {
  const def = MODULE_DEFS[moduleId];
  if (!def) return <div style={{padding:"2rem",color:tok.t4}}>Módulo "{moduleId}" en desarrollo.</div>;

  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({});

  const getList = () => {
    if (def.isArray===false) return (state[def.key]?.[def.listKey]) || [];
    return state[def.key] || [];
  };
  const setList = (l) => {
    if (def.isArray===false) dispatch({ type:"SET", key:def.key, val:{ ...(state[def.key]||{}), [def.listKey]:l } });
    else dispatch({ type:"SET", key:def.key, val:l });
  };

  const rows = getList();

  const handleSave = () => {
    const l = [...rows];
    const e = { ...form, id:form.id||Date.now().toString() };
    if (editIdx!==null) l[editIdx]=e; else l.push(e);
    setList(l); setShowModal(false); setForm({});
  };

  return (
    <div>
      <SecHdr title={def.title} subtitle={def.subtitle} icon={def.icon} tok={tok}>
        <Btn tok={tok} icon="plus" onClick={()=>{setForm({});setEditIdx(null);setShowModal(true);}}>Agregar</Btn>
      </SecHdr>
      <Card>
        <Tbl tok={tok} cols={def.cols} rows={rows}
          onEdit={(row,i)=>{setForm(row);setEditIdx(i);setShowModal(true);}}
          onDel={i=>{const l=[...rows];l.splice(i,1);setList(l);}}
          empty={`No hay ${def.title.toLowerCase()} registrados.`}
        />
      </Card>
      {showModal&&(
        <Modal title={editIdx!==null?`Editar ${def.title}`:`Nuevo registro — ${def.title}`} onClose={()=>setShowModal(false)} wide icon={def.icon} tok={tok}>
          <div style={{maxHeight:"65vh",overflowY:"auto",paddingRight:4}}>
            <Row>
              {def.fields.map(([label,key,type,options])=>{
                const isHalf = def.fields.length > 6;
                return (
                  <Fld key={key} label={label} half={isHalf&&type!=="textarea"}>
                    {type==="textarea"
                      ? <Tex tok={tok} value={form[key]||""} onChange={e=>setForm({...form,[key]:e.target.value})} rows={3} />
                      : type==="select"
                      ? <Sel tok={tok} value={form[key]||""} onChange={e=>setForm({...form,[key]:e.target.value})}><option value="">Seleccionar...</option>{(options||[]).map(o=><option key={o}>{o}</option>)}</Sel>
                      : <Inp tok={tok} type={type} value={form[key]||""} onChange={e=>setForm({...form,[key]:e.target.value})} />}
                  </Fld>
                );
              })}
            </Row>
          </div>
          <div style={{marginTop:"1rem",paddingTop:"1rem",borderTop:"1.5px solid #f1f5f9"}}>
            <Btn tok={tok} full onClick={handleSave}>Guardar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function SGIPlatform() {
  const [state, dispatch] = useReducer(reducer, null, INIT);
  const tok = T(state.branding);
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(() => Object.fromEntries(NAV_GROUPS.map(g=>[g.g,true])));

  // PWA manifest
  useEffect(() => {
    const m = { name:state.branding?.nombre||"SGI Platform", short_name:"SGI", start_url:"/", display:"standalone", background_color:"#f8fafc", theme_color:tok.brand };
    const blob = new Blob([JSON.stringify(m)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    let link = document.querySelector("link[rel='manifest']");
    if (!link) { link = document.createElement("link"); link.rel="manifest"; document.head.appendChild(link); }
    link.href = url;
    document.querySelector("meta[name='theme-color']")?.setAttribute("content", tok.brand);
  }, [state.branding, tok.brand]);

  // Viewport meta for mobile
  useEffect(() => {
    let vm = document.querySelector("meta[name='viewport']");
    if (!vm) { vm = document.createElement("meta"); vm.name="viewport"; document.head.appendChild(vm); }
    vm.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
  }, []);

  if (!state.sesion) return <Login state={state} dispatch={dispatch} />;

  const user = state.sesion;
  const notifCount = (state.notificaciones||[]).filter(n=>n.destinatarioId===user?.id&&!n.leida).length;
  const taskCount = (state.tareas||[]).filter(t=>t.asignadoId===user?.id&&t.estado!=="Completada").length;

  const navTo = (id) => { setActive(id); setMobileOpen(false); };

  const renderModule = () => {
    const p = { state, dispatch, tok };
    if (active === "dashboard")  return <Dashboard {...p} />;
    if (active === "notificaciones") return <NotificacionesModule {...p} />;
    if (active === "tareas")     return <TareasModule {...p} />;
    if (active === "kpis")       return <KpisModule {...p} />;
    if (active === "cobertura")  return <CoberturaModule state={state} tok={tok} />;
    if (active === "branding")   return <BrandingModule {...p} />;
    if (active === "usuarios")   return <UsuariosModule {...p} />;
    if (active === "empresa")    return <EmpresaModule {...p} />;
    return <GenericModule moduleId={active} {...p} />;
  };

  const Sidebar = ({ mobile = false }) => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* Logo */}
      <div style={{ padding: sidebarOpen||mobile ? "1.1rem 1rem" : "0.9rem 0.55rem", borderBottom:"1.5px solid #f1f5f9", display:"flex", alignItems:"center", gap:"0.7rem", cursor:"pointer", flexShrink:0 }}
        onClick={()=>{ if(!mobile) setSidebarOpen(!sidebarOpen); }}>
        {state.branding?.logo
          ? <img src={state.branding.logo} alt="Logo" style={{maxWidth:sidebarOpen||mobile?75:28,maxHeight:34,objectFit:"contain",flexShrink:0}} />
          : <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${tok.brand},${tok.brand2})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"0.78rem",color:"#fff",flexShrink:0}}>
              {(state.branding?.nombre||"SZ").slice(0,2).toUpperCase()}
            </div>}
        {(sidebarOpen||mobile)&&<div>
          <div style={{fontWeight:800,fontSize:"0.8rem",color:tok.t1,lineHeight:1.1}}>{state.branding?.nombre||"Mi Empresa"}</div>
          <div style={{fontSize:"0.57rem",color:tok.t4,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:2}}>SGI Platform</div>
        </div>}
      </div>
      {/* Nav */}
      <nav style={{ flex:1, overflowY:"auto", padding:"0.5rem 0.35rem" }}>
        {NAV_GROUPS.map(group=>(
          <div key={group.g}>
            {(sidebarOpen||mobile)&&(
              <button onClick={()=>setExpandedGroups(eg=>({...eg,[group.g]:!eg[group.g]}))}
                style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"0.4rem 0.6rem",background:"none",border:"none",cursor:"pointer",color:tok.t4,fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>
                {group.g}<Ic n={expandedGroups[group.g]?"down":"right"} s={11} />
              </button>
            )}
            {(expandedGroups[group.g]||!(sidebarOpen||mobile))&&group.items.map(item=>{
              const isAct = active===item.id;
              return (
                <button key={item.id} onClick={()=>navTo(item.id)} title={!(sidebarOpen||mobile)?item.label:""}
                  style={{display:"flex",alignItems:"center",gap:"0.55rem",width:"100%",padding:sidebarOpen||mobile?"0.55rem 0.65rem":"0.6rem",borderRadius:9,border:"none",background:isAct?`${tok.brand}12`:"transparent",color:isAct?tok.brand:tok.t3,cursor:"pointer",fontSize:"0.78rem",fontWeight:isAct?700:500,marginBottom:1,transition:"all .13s",justifyContent:sidebarOpen||mobile?"flex-start":"center",borderLeft:`2px solid ${isAct?tok.brand:"transparent"}`}}>
                  <Ic n={item.icon} s={15} />
                  {(sidebarOpen||mobile)&&<span style={{flex:1,textAlign:"left"}}>{item.label}</span>}
                  {(sidebarOpen||mobile)&&item.id==="notificaciones"&&notifCount>0&&<span style={{background:"#dc2626",color:"#fff",borderRadius:10,padding:"1px 5px",fontSize:"0.58rem",fontWeight:700}}>{notifCount}</span>}
                  {(sidebarOpen||mobile)&&item.id==="tareas"&&taskCount>0&&<span style={{background:tok.brand,color:"#fff",borderRadius:10,padding:"1px 5px",fontSize:"0.58rem",fontWeight:700}}>{taskCount}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      {/* User */}
      {(sidebarOpen||mobile)&&(
        <div style={{padding:"0.85rem 1rem",borderTop:"1.5px solid #f1f5f9",display:"flex",alignItems:"center",gap:"0.65rem",flexShrink:0}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:`${tok.brand}20`,display:"flex",alignItems:"center",justifyContent:"center",color:tok.brand,fontWeight:700,fontSize:"0.7rem",flexShrink:0}}>
            {(user?.nombre||"U").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:"0.76rem",fontWeight:600,color:tok.t1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user?.nombre}</div>
            <div style={{fontSize:"0.62rem",color:tok.t4}}>{user?.perfil}</div>
          </div>
          <button onClick={()=>dispatch({type:"LOGOUT"})} title="Cerrar sesión" style={{background:"none",border:"none",cursor:"pointer",color:tok.t4,display:"flex",padding:4}}>
            <Ic n="logout" s={14} />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        body { background: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased; overflow: hidden; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        input, select, textarea { font-family: 'Plus Jakarta Sans', sans-serif; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        input[type=color] { -webkit-appearance: none; padding: 0; }
        /* Mobile */
        @media (max-width: 768px) {
          .desk-sidebar { display: none !important; }
          .desk-topbar { display: none !important; }
          .mob-header { display: flex !important; }
          .main-pad { padding: 1rem !important; }
        }
        @media (min-width: 769px) {
          .mob-header { display: none !important; }
          .mob-overlay { display: none !important; }
        }
      `}</style>

      <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
        {/* DESKTOP SIDEBAR */}
        <aside className="desk-sidebar" style={{ width:sidebarOpen?228:52, minWidth:sidebarOpen?228:52, background:"#fff", borderRight:"1.5px solid #f1f5f9", transition:"all .22s", overflow:"hidden", flexShrink:0, boxShadow:"1px 0 6px rgba(0,0,0,.04)", zIndex:100 }}>
          <Sidebar />
        </aside>

        {/* MOBILE OVERLAY */}
        {mobileOpen&&<div className="mob-overlay" onClick={()=>setMobileOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000}} />}
        {mobileOpen&&(
          <aside style={{position:"fixed",left:0,top:0,bottom:0,width:260,background:"#fff",zIndex:1001,boxShadow:"4px 0 20px rgba(0,0,0,.15)",overflowY:"auto"}}>
            <Sidebar mobile />
          </aside>
        )}

        {/* MAIN */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
          {/* MOBILE HEADER */}
          <div className="mob-header" style={{ display:"none", alignItems:"center", justifyContent:"space-between", padding:"0.85rem 1rem", background:"#fff", borderBottom:"1.5px solid #f1f5f9", flexShrink:0, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
            <button onClick={()=>setMobileOpen(true)} style={{background:"none",border:"1.5px solid #e2e8f0",borderRadius:8,padding:6,cursor:"pointer",display:"flex"}}><Ic n="menu" s={18} /></button>
            <div style={{fontWeight:800,fontSize:"0.9rem",color:tok.t1}}>{state.branding?.nombre||"SGI"}</div>
            <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
              {notifCount>0&&<button onClick={()=>navTo("notificaciones")} style={{background:"#fef2f2",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",border:"none",cursor:"pointer",color:"#dc2626",fontWeight:700,fontSize:"0.72rem"}}>{notifCount}</button>}
            </div>
          </div>

          {/* DESKTOP TOPBAR */}
          <div className="desk-topbar" style={{ height:50, background:"#fff", borderBottom:"1.5px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 1.4rem", flexShrink:0 }}>
            <div style={{display:"flex",alignItems:"center",gap:"0.65rem"}}>
              <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:"none",border:"1.5px solid #e2e8f0",borderRadius:7,padding:5,cursor:"pointer",display:"flex"}}><Ic n="menu" s={14} /></button>
              <span style={{fontSize:"0.76rem",color:tok.t4}}>{NAV_GROUPS.flatMap(g=>g.items).find(i=>i.id===active)?.label||"Panel"}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"0.85rem"}}>
              <button onClick={()=>navTo("notificaciones")} style={{position:"relative",background:"none",border:"none",cursor:"pointer",color:tok.t3,display:"flex"}}>
                <Ic n="bell" s={18} />
                {notifCount>0&&<span style={{position:"absolute",top:-4,right:-4,background:"#dc2626",color:"#fff",borderRadius:"50%",width:15,height:15,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.55rem",fontWeight:700}}>{notifCount}</span>}
              </button>
              <button onClick={()=>navTo("tareas")} style={{position:"relative",background:"none",border:"none",cursor:"pointer",color:tok.t3,display:"flex"}}>
                <Ic n="clip" s={18} />
                {taskCount>0&&<span style={{position:"absolute",top:-4,right:-4,background:tok.brand,color:"#fff",borderRadius:"50%",width:15,height:15,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.55rem",fontWeight:700}}>{taskCount}</span>}
              </button>
              <span style={{fontSize:"0.73rem",color:tok.t4}}>{user?.nombre}</span>
              <ColorBdg label={user?.perfil} color="blue" />
              <button onClick={()=>dispatch({type:"LOGOUT"})} style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:7,padding:"4px 9px",cursor:"pointer",color:"#dc2626",fontSize:"0.71rem",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>
                <Ic n="logout" s={12} />Salir
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <main className="main-pad" style={{ flex:1, overflowY:"auto", padding:"1.65rem 1.85rem", background:"#f8fafc" }}>
            {renderModule()}
          </main>
        </div>
      </div>
    </>
  );
}
