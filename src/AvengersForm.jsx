import { useState } from "react";
import FotosUpload from "./FotosUpload.jsx";
import AudioRecorder from "./AudioRecorder.jsx";

const YELLOW = "#E9FF7B";
const BLACK = "#0A0A0A";
const GRAY = "#888";
const LIGHT = "#F7F7F5";
const BORDER = "#E0E0E0";

const steps = [
  { id: "identidad", label: "Identidad", icon: "✦" },
  { id: "visual", label: "Visual", icon: "◈" },
  { id: "nicho", label: "Nicho", icon: "◎" },
  { id: "equipo", label: "Equipo", icon: "⬡" },
  { id: "resumen", label: "Resumen", icon: "▤" },
];

const initialForm = {
  nombre: "", instagram: "", tiktok: "", youtube: "", linkedin: "", otraPlataforma: "",
  plataformas: [], frecuencia: "",
  cincoPalabras: "",
  nicho: "", temas: "", temasExcluidos: "",
  coloresSi: "", coloresNo: "",
  tipografiaSi: "", tipografiaNo: "",
  referentesPortadas: "", lookFeel: "",
  fotos: [], audio: null,
  edicionSi: "", edicionNo: "", animacionesSi: "", animacionesNo: "",
  tieneFilmmaker: "", tieneEditor: "", tieneDiseñador: "",
  equipoContacto: "",
  referentesSheet: "",
};

const PLATAFORMAS = ["Instagram", "TikTok", "YouTube Shorts", "LinkedIn"];

const RESPONSIVE_CSS = `
  @media (max-width: 640px) {
    .af-header { padding: 12px 16px !important; gap: 10px !important; }
    .af-container { padding: 0 14px !important; }
    .af-steps { gap: 6px !important; padding: 20px 0 16px !important; }
    .af-step-circle { width: 28px !important; height: 28px !important; font-size: 12px !important; }
    .af-step-label { font-size: 9px !important; }
    .af-card { padding: 20px 16px !important; border-radius: 12px !important; }
    .af-grid-2 { grid-template-columns: 1fr !important; }
    .af-nav { flex-wrap: wrap !important; gap: 10px !important; }
    .af-nav-btn { flex: 1 1 auto !important; padding: 12px 16px !important; }
  }
`;

function Tag({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
        background: active ? YELLOW : "white", color: BLACK,
        border: `1.5px solid ${active ? "#c8dc00" : BORDER}`,
        fontWeight: active ? 700 : 400, transition: "all 0.15s",
      }}
    >{children}</button>
  );
}

function Field({ label, hint, children, required }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: BLACK, marginBottom: 4 }}>
        {label}{required && <span style={{ color: "#c00", marginLeft: 3 }}>*</span>}
      </label>
      {hint && <p style={{ fontSize: 12, color: GRAY, margin: "0 0 6px 0", lineHeight: 1.5 }}>{hint}</p>}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, multiline, rows = 3 }) {
  const base = {
    width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14,
    border: `1.5px solid ${BORDER}`, background: "white", color: BLACK,
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    resize: multiline ? "vertical" : "none",
  };
  return multiline
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={base} />
    : <input value={value} onChange={onChange} placeholder={placeholder} style={base} />;
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {options.map(o => (
        <Tag key={o} active={value === o} onClick={() => onChange(o)}>{o}</Tag>
      ))}
    </div>
  );
}

function StepHeader({ step, current }) {
  const done = steps.findIndex(s => s.id === current) > steps.findIndex(s => s.id === step.id);
  const active = step.id === current;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div className="af-step-circle" style={{
        width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        background: active ? YELLOW : done ? "#333" : LIGHT,
        color: active ? BLACK : done ? "white" : GRAY,
        fontSize: active ? 16 : 14, fontWeight: 700, border: `2px solid ${active ? "#c8dc00" : done ? "#333" : BORDER}`,
        transition: "all 0.2s",
      }}>{done ? "✓" : step.icon}</div>
      <span className="af-step-label" style={{ fontSize: 11, color: active ? BLACK : GRAY, fontWeight: active ? 700 : 400 }}>{step.label}</span>
    </div>
  );
}

function SummaryField({ label, value }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: GRAY, letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14, color: BLACK, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
        {value || <span style={{ color: GRAY }}>—</span>}
      </div>
    </div>
  );
}

function SummarySection({ title, children }) {
  return (
    <div style={{ background: LIGHT, borderRadius: 10, padding: 18, marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: BLACK, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

function Summary({ data }) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Resumen</h2>
      <p style={{ color: GRAY, fontSize: 14, marginBottom: 24 }}>
        Revisa los datos que llenaste. El equipo de media de 30X los usará para armar tu onboarding.
      </p>

      <SummarySection title="IDENTIDAD">
        <SummaryField label="Nombre / marca" value={data.nombre} />
        <SummaryField label="Plataformas" value={data.plataformas.join(", ")} />
        <SummaryField label="Frecuencia" value={data.frecuencia} />
        <SummaryField label="5 palabras" value={data.cincoPalabras} />
      </SummarySection>

      <SummarySection title="VISUAL">
        <SummaryField label="Colores SÍ" value={data.coloresSi} />
        <SummaryField label="Colores NO" value={data.coloresNo} />
        <SummaryField label="Tipografía SÍ" value={data.tipografiaSi} />
        <SummaryField label="Tipografía NO" value={data.tipografiaNo} />
        <SummaryField label="Look & feel" value={data.lookFeel} />
      </SummarySection>

      <SummarySection title="NICHO">
        <SummaryField label="Nicho" value={data.nicho} />
        <SummaryField label="Temas exclusivos" value={data.temas} />
        <SummaryField label="Temas excluidos" value={data.temasExcluidos} />
        <SummaryField label="Referentes (sheet)" value={data.referentesSheet} />
      </SummarySection>

      <SummarySection title="EQUIPO">
        <SummaryField label="Filmmaker" value={data.tieneFilmmaker} />
        <SummaryField label="Editor" value={data.tieneEditor} />
        <SummaryField label="Diseñador" value={data.tieneDiseñador} />
        <SummaryField label="Contacto de equipo" value={data.equipoContacto} />
      </SummarySection>

      <SummarySection title="FOTOS">
        {data.fotos.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {data.fotos.map((f) => (
              <img key={f.url} src={f.url} alt={f.name} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: `1.5px solid ${BORDER}` }} />
            ))}
          </div>
        ) : (
          <span style={{ color: GRAY, fontSize: 14 }}>—</span>
        )}
      </SummarySection>

      <SummarySection title="AUDIO">
        {data.audio ? (
          <audio controls src={data.audio.url} style={{ width: "100%" }} />
        ) : (
          <span style={{ color: GRAY, fontSize: 14 }}>—</span>
        )}
      </SummarySection>
    </div>
  );
}

export default function AvengersForm() {
  const [current, setCurrent] = useState("identidad");
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const setVal = (key) => (val) => setForm(f => ({ ...f, [key]: val }));
  const togglePlat = (p) => setForm(f => ({
    ...f, plataformas: f.plataformas.includes(p)
      ? f.plataformas.filter(x => x !== p)
      : [...f.plataformas, p]
  }));

  const currentIdx = steps.findIndex(s => s.id === current);
  const next = () => { if (currentIdx < steps.length - 1) setCurrent(steps[currentIdx + 1].id); };
  const prev = () => { if (currentIdx > 0) setCurrent(steps[currentIdx - 1].id); };

  const renderStep = () => {
    switch (current) {
      case "identidad": return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Tu identidad</h2>
          <p style={{ color: GRAY, fontSize: 14, marginBottom: 28 }}>Empieza con lo básico — quién eres y dónde estás.</p>

          <Field label="Nombre completo / Nombre de marca" required>
            <Input value={form.nombre} onChange={set("nombre")} placeholder="Ej: María Torres · @mariatorres" />
          </Field>

          <Field label="Plataformas donde publicaremos" hint="Selecciona todas en las que estás activo/a" required>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {PLATAFORMAS.map(p => (
                <Tag key={p} active={form.plataformas.includes(p)} onClick={() => togglePlat(p)}>{p}</Tag>
              ))}
            </div>
          </Field>

          {form.plataformas.includes("Instagram") && (
            <Field label="@ de Instagram"><Input value={form.instagram} onChange={set("instagram")} placeholder="@tuusuario" /></Field>
          )}
          {form.plataformas.includes("TikTok") && (
            <Field label="@ de TikTok"><Input value={form.tiktok} onChange={set("tiktok")} placeholder="@tuusuario" /></Field>
          )}
          {form.plataformas.includes("YouTube Shorts") && (
            <Field label="Canal de YouTube"><Input value={form.youtube} onChange={set("youtube")} placeholder="URL del canal" /></Field>
          )}
          {form.plataformas.includes("LinkedIn") && (
            <Field label="Perfil de LinkedIn"><Input value={form.linkedin} onChange={set("linkedin")} placeholder="URL del perfil" /></Field>
          )}

          <Field label="¿Con qué frecuencia quieres publicar?" hint="Por plataforma si es diferente" required>
            <Input value={form.frecuencia} onChange={set("frecuencia")} placeholder="Ej: IG 5x/semana, TikTok diario" />
          </Field>

          <Field label="5 palabras que definen tu marca personal"
            hint='Piensa: si alguien te describe en 5 palabras, ¿cuáles serían? Ejemplo bueno: "disruptivo, directo, técnico, ambicioso, honesto". Ejemplo malo: "creativo, auténtico, apasionado, innovador, líder" — esas no dicen nada específico.'
            required>
            <Input value={form.cincoPalabras} onChange={set("cincoPalabras")} placeholder="Ej: irreverente, técnico, datos, humor seco, sin filtros" />
          </Field>
        </div>
      );

      case "visual": return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Identidad visual</h2>
          <p style={{ color: GRAY, fontSize: 14, marginBottom: 28 }}>Esto guía todo lo que el equipo de diseño y edición produce para ti.</p>

          <Field label="Colores que SÍ quieres ver" hint="Colores específicos, familias, o sensaciones. Ej: negro, blanco, un acento azul eléctrico — nada pastel." required>
            <Input value={form.coloresSi} onChange={set("coloresSi")} multiline rows={2} placeholder="Ej: negro sobre blanco, acento amarillo neón, paleta oscura y contrastante" />
          </Field>

          <Field label="Colores que NO deben aparecer NUNCA" hint="Sé específico/a — esto es una regla dura para el equipo." required>
            <Input value={form.coloresNo} onChange={set("coloresNo")} multiline rows={2} placeholder="Ej: no pasteles, no verde lima, no naranja" />
          </Field>

          <Field label="Tipografía o estilo de texto que te gusta" hint="Puedes describir (serif clásica, sans-serif bold, condensada) o mencionar ejemplos de marcas.">
            <Input value={form.tipografiaSi} onChange={set("tipografiaSi")} placeholder="Ej: tipografía bold y grande, estilo editorial, sans-serif moderna" />
          </Field>

          <Field label="Tipografía o estilo de texto que NO quieres">
            <Input value={form.tipografiaNo} onChange={set("tipografiaNo")} placeholder="Ej: no scripts, no caligrafía, no fuentes decorativas" />
          </Field>

          <Field label="Look & feel del feed de Instagram" hint="Describe cómo quieres que se vea tu feed al abrirlo. ¿Qué sensación debe dar?" required>
            <Input value={form.lookFeel} onChange={set("lookFeel")} multiline rows={3} placeholder="Ej: oscuro, limpio, profesional. Fotos de producto sobre fondo negro. Texto bold. Nada de flores ni filtros cálidos." />
          </Field>

          <Field label="Referentes de portadas / thumbnails" hint="Links a cuentas o imágenes de portadas que te gustan como referencia. Pueden ser de cualquier industria.">
            <Input value={form.referentesPortadas} onChange={set("referentesPortadas")} multiline rows={3} placeholder="Ej: @lexfridman en YouTube, portadas de MrBeast, estilo Alex Hormozi..." />
          </Field>

          <Field label="Fotos de referencia" hint="Sube hasta 5 fotos tuyas o de tu marca que el equipo de diseño pueda usar como referencia visual.">
            <FotosUpload fotos={form.fotos} onChange={setVal("fotos")} />
          </Field>

          <Field label="Audio contando quién eres y tu marca personal"
            hint="Graba un audio detallado, directo desde el navegador: quién eres, tu trayectoria, y qué quieres proyectar con tu marca personal. Mientras más contexto des, mejor entenderá el equipo de media tu voz y tono."
            required>
            <AudioRecorder audio={form.audio} onChange={setVal("audio")} />
          </Field>

          <div className="af-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Estilos de edición que te gustan" hint="Links a videos o describe el estilo">
              <Input value={form.edicionSi} onChange={set("edicionSi")} multiline rows={3} placeholder="Ej: cortes rápidos, subtítulos grandes, B-roll dinámico..." />
            </Field>
            <Field label="Estilos de edición que NO quieres">
              <Input value={form.edicionNo} onChange={set("edicionNo")} multiline rows={3} placeholder="Ej: no transiciones de brillo, no música de fondo muy alta..." />
            </Field>
            <Field label="Animaciones que te gustan">
              <Input value={form.animacionesSi} onChange={set("animacionesSi")} multiline rows={2} placeholder="Ej: texto que aparece letra a letra, zoom gradual..." />
            </Field>
            <Field label="Animaciones que NO quieres">
              <Input value={form.animacionesNo} onChange={set("animacionesNo")} multiline rows={2} placeholder="Ej: no glitch, no efectos de película vieja..." />
            </Field>
          </div>
        </div>
      );

      case "nicho": return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Tu nicho</h2>
          <p style={{ color: GRAY, fontSize: 14, marginBottom: 28 }}>Esta es la pregunta más importante del onboarding. Un nicho claro es lo que te diferencia de los otros Avengers.</p>

          <Field label="¿Cuál es tu nicho?" hint="Sé muy específico/a. No es 'negocios' — es 'growth para founders B2B en etapa pre-Serie A'. No es 'salud' — es 'longevidad y performance para ejecutivos de 40+'." required>
            <Input value={form.nicho} onChange={set("nicho")} multiline rows={3} placeholder="Ej: ventas consultivas para empresas de software en Latam · marketing de contenido para marcas personales en etapa de 0 a 10k seguidores" />
          </Field>

          <Field label="Temas que vas a tratar EXCLUSIVAMENTE tú" hint="Qué temas son tuyos y no los tocará ningún otro Avenger. El equipo de media los protege." required>
            <Input value={form.temas} onChange={set("temas")} multiline rows={3} placeholder="Ej: cold outreach, cierre de deals enterprise, onboarding de sales reps, forecasting de pipeline..." />
          </Field>

          <Field label="Temas que NO vas a tocar nunca" hint="Qué está fuera de tu scope — por decisión, no por incapacidad.">
            <Input value={form.temasExcluidos} onChange={set("temasExcluidos")} multiline rows={2} placeholder="Ej: no política, no criptomonedas, no motivación genérica..." />
          </Field>

          <Field label="Lista de referentes del nicho (Google Sheet)"
            hint={
              <span>
                Mínimo 30 cuentas/creadores de tu nicho. <strong>Regla clave: preferentemente en inglés u otros idiomas</strong> — no contenido en español latinoamericano. Se acepta español de España.
                <br />Formato: Google Sheet con una columna de links. Si no tienes 30, el equipo de media co-construye el resto contigo.
              </span>
            }
            required>
            <Input value={form.referentesSheet} onChange={set("referentesSheet")} placeholder="https://docs.google.com/spreadsheets/d/..." />
          </Field>
        </div>
      );

      case "equipo": return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Tu equipo</h2>
          <p style={{ color: GRAY, fontSize: 14, marginBottom: 28 }}>Esto define qué recursos asigna 30X y cuáles integra de tu lado.</p>

          <Field label="¿Tienes filmmaker o equipo de grabación propio?" required>
            <RadioGroup options={["Sí, tengo", "No, necesito uno de 30X", "Tengo parcialmente"]}
              value={form.tieneFilmmaker} onChange={setVal("tieneFilmmaker")} />
          </Field>

          <Field label="¿Tienes editor de video propio?" required>
            <RadioGroup options={["Sí, tengo", "No, necesito uno de 30X", "Tengo parcialmente"]}
              value={form.tieneEditor} onChange={setVal("tieneEditor")} />
          </Field>

          <Field label="¿Tienes diseñador gráfico propio?" required>
            <RadioGroup options={["Sí, tengo", "No, necesito uno de 30X", "Tengo parcialmente"]}
              value={form.tieneDiseñador} onChange={setVal("tieneDiseñador")} />
          </Field>

          {(form.tieneFilmmaker === "Sí, tengo" || form.tieneEditor === "Sí, tengo" || form.tieneDiseñador === "Sí, tengo" ||
            form.tieneFilmmaker === "Tengo parcialmente" || form.tieneEditor === "Tengo parcialmente" || form.tieneDiseñador === "Tengo parcialmente") && (
            <Field label="Datos de contacto de tu equipo"
              hint="Nombre, rol y email o WhatsApp de cada persona. El Lead de Media de 30X les dará accesos al pipeline.">
              <Input value={form.equipoContacto} onChange={set("equipoContacto")} multiline rows={4}
                placeholder="Ej: Juan Pérez · Editor · +52 55 1234 5678&#10;Ana García · Diseñadora · ana@email.com" />
            </Field>
          )}

          <div style={{ background: "#FAFFF0", border: `1.5px solid #D8F060`, borderRadius: 10, padding: 18, marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 8 }}>🔐 Entrega de accesos</div>
            <p style={{ fontSize: 13, color: BLACK, margin: 0, lineHeight: 1.7 }}>
              Los accesos a tus cuentas (usuario y contraseña) <strong>no se ingresan aquí</strong>. 
              El Lead de Media de 30X te contactará para acordar un canal seguro de entrega.
              <br />Prepara accesos para todas las plataformas que seleccionaste en el paso 1.
            </p>
          </div>
        </div>
      );

      case "resumen": return <Summary data={form} />;

      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: LIGHT, fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", padding: "0 0 60px 0" }}>
      <style>{RESPONSIVE_CSS}</style>
      {/* Header */}
      <div className="af-header" style={{ background: BLACK, padding: "14px 28px", display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontWeight: 900, fontSize: 18, color: YELLOW }}>30X</span>
        <div style={{ width: 1, height: 20, background: "#444" }} />
        <span style={{ color: "#888", fontSize: 13 }}>Onboarding · Programa Avengers</span>
      </div>

      <div className="af-container" style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>
        {/* Step indicator */}
        <div className="af-steps" style={{ padding: "28px 0 24px", display: "flex", justifyContent: "center", gap: 24, position: "relative" }}>
          <div style={{
            position: "absolute", top: 46, left: "12%", right: "12%", height: 2,
            background: `linear-gradient(to right, ${BLACK} ${(currentIdx / (steps.length - 1)) * 100}%, ${BORDER} ${(currentIdx / (steps.length - 1)) * 100}%)`,
          }} />
          {steps.map(s => <StepHeader key={s.id} step={s} current={current} />)}
        </div>

        {/* Form card */}
        <div className="af-card" style={{ background: "white", borderRadius: 16, padding: "32px 32px 28px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}` }}>
          {renderStep()}
        </div>

        {/* Navigation */}
        {current !== "resumen" && (
          <div className="af-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
            <button className="af-nav-btn" onClick={prev} disabled={currentIdx === 0} style={{
              padding: "12px 24px", borderRadius: 8, border: `1.5px solid ${BORDER}`,
              background: "white", cursor: currentIdx === 0 ? "not-allowed" : "pointer",
              fontSize: 14, color: currentIdx === 0 ? GRAY : BLACK, fontWeight: 600,
            }}>← Anterior</button>

            <span style={{ fontSize: 12, color: GRAY }}>{currentIdx + 1} de {steps.length}</span>

            <button className="af-nav-btn" onClick={next} style={{
              padding: "12px 28px", borderRadius: 8, border: "none",
              background: YELLOW, cursor: "pointer", fontSize: 14, color: BLACK, fontWeight: 800,
            }}>
              {currentIdx === steps.length - 2 ? "Ver Resumen →" : "Siguiente →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
