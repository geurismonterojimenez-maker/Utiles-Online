import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BookOpen, Calculator, CalendarDays, CheckCircle2, Clock3,
  FileText, GraduationCap, Menu, Moon, Quote, Sparkles, Sun, Type, X
} from "lucide-react";

type Tool = {
  slug: string;
  title: string;
  short: string;
  category: string;
  icon: typeof Calculator;
  color: string;
};

const TOOLS: Tool[] = [
  { slug: "calculadora-de-notas", title: "Calculadora de notas", short: "Calcula tu promedio simple o ponderado y descubre si aprobaste.", category: "Cálculo académico", icon: Calculator, color: "violet" },
  { slug: "nota-necesaria-para-aprobar", title: "Nota necesaria para aprobar", short: "Averigua cuánto necesitas obtener en el examen final.", category: "Cálculo académico", icon: GraduationCap, color: "cyan" },
  { slug: "contador-de-palabras", title: "Contador de palabras", short: "Cuenta palabras, caracteres, oraciones y tiempo de lectura.", category: "Escritura", icon: Type, color: "orange" },
  { slug: "generador-apa", title: "Generador de referencias APA", short: "Crea referencias de libros y páginas web en formato APA 7.", category: "Escritura", icon: Quote, color: "pink" },
  { slug: "temporizador-pomodoro", title: "Temporizador Pomodoro", short: "Estudia por bloques y toma descansos sin perder el ritmo.", category: "Productividad", icon: Clock3, color: "green" },
  { slug: "creador-de-horarios", title: "Creador de horarios", short: "Organiza materias y genera un horario semanal imprimible.", category: "Organización", icon: CalendarDays, color: "blue" },
];

const pathSlug = () => window.location.pathname.replace(/^\/|\/$/g, "");

function useMetadata(tool?: Tool) {
  useEffect(() => {
    const title = tool ? `${tool.title} gratis | Útiles Online` : "Útiles Online | Herramientas gratuitas para estudiar mejor";
    const description = tool?.short ?? "Calculadoras académicas, herramientas de escritura y recursos gratuitos para estudiantes y docentes.";
    document.title = title;
    const setMeta = (selector: string, attr: string, value: string) => {
      let node = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
      if (!node) {
        node = document.createElement(selector.startsWith("link") ? "link" : "meta");
        document.head.appendChild(node);
      }
      node.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('link[rel="canonical"]', "href", `https://utilesonline.com/${tool ? tool.slug : ""}`);
  }, [tool]);
}

function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("uo-theme") === "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("uo-theme", dark ? "dark" : "light");
  }, [dark]);
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Útiles Online, inicio">
        <span className="brand-mark"><Sparkles size={20} /></span>
        <span>Útiles <strong>Online</strong></span>
      </a>
      <nav className={open ? "nav open" : "nav"} aria-label="Navegación principal">
        <a href="/#herramientas">Herramientas</a>
        <a href="/#para-estudiantes">Para estudiantes</a>
        <a href="/#para-docentes">Para docentes</a>
        <a href="/#guias">Guías</a>
      </nav>
      <div className="header-actions">
        <button className="icon-button" onClick={() => setDark(!dark)} aria-label="Cambiar tema">{dark ? <Sun size={19} /> : <Moon size={19} />}</button>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Abrir menú">{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div><a className="brand footer-brand" href="/"><span className="brand-mark"><Sparkles size={18} /></span><span>Útiles <strong>Online</strong></span></a>
        <p>Herramientas gratuitas y claras para estudiar, enseñar y organizarse mejor.</p></div>
      <div><strong>Herramientas</strong><a href="/calculadora-de-notas">Calculadora de notas</a><a href="/contador-de-palabras">Contador de palabras</a><a href="/generador-apa">Generador APA</a></div>
      <div><strong>Información</strong><a href="/acerca-de">Acerca de</a><a href="/privacidad">Privacidad</a><a href="/contacto">Contacto</a></div>
      <small>© {new Date().getFullYear()} Útiles Online. Recursos educativos gratuitos.</small>
    </footer>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return <a className={`tool-card ${tool.color}`} href={`/${tool.slug}`}>
    <span className="tool-icon"><Icon /></span><span className="eyebrow">{tool.category}</span>
    <h3>{tool.title}</h3><p>{tool.short}</p><span className="card-link">Usar herramienta <ArrowRight size={17} /></span>
  </a>;
}

function Home() {
  useMetadata();
  return <><Header /><main>
    <section className="hero">
      <div className="hero-copy">
        <span className="pill"><Sparkles size={15} /> Gratis, rápido y sin registro</span>
        <h1>Herramientas útiles para <em>aprender mejor.</em></h1>
        <p>Calcula tus notas, mejora tus trabajos y organiza tu tiempo con recursos sencillos creados para estudiantes y docentes.</p>
        <div className="hero-buttons"><a className="button primary" href="#herramientas">Explorar herramientas <ArrowRight size={18} /></a><a className="button secondary" href="/calculadora-de-notas">Calcular mis notas</a></div>
        <div className="trust-row"><span><CheckCircle2 /> Sin crear cuenta</span><span><CheckCircle2 /> Privado</span><span><CheckCircle2 /> Funciona en móvil</span></div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
        <div className="float-card card-a"><Calculator /><span>Promedio</span><strong>87.5</strong></div>
        <div className="float-card card-b"><Clock3 /><span>Sesión</span><strong>25:00</strong></div>
        <div className="float-card card-c"><FileText /><span>Palabras</span><strong>1,248</strong></div>
        <div className="hero-center"><BookOpen size={70} /></div>
      </div>
    </section>
    <section className="tools-section" id="herramientas">
      <div className="section-heading"><div><span className="eyebrow">Herramientas destacadas</span><h2>Todo lo que necesitas, en un solo lugar</h2></div><p>Recursos prácticos que resuelven tareas reales en segundos.</p></div>
      <div className="tool-grid">{TOOLS.map(t => <ToolCard key={t.slug} tool={t} />)}</div>
    </section>
    <section className="audience" id="para-estudiantes">
      <div><span className="eyebrow">Para estudiantes</span><h2>Menos tiempo calculando.<br />Más tiempo aprendiendo.</h2><p>Cada herramienta explica el resultado para que puedas entenderlo, no solo copiarlo.</p>
        <ul><li><CheckCircle2 /> Resultados instantáneos y fáciles de interpretar</li><li><CheckCircle2 /> Datos procesados únicamente en tu dispositivo</li><li><CheckCircle2 /> Diseñado para secundaria y universidad</li></ul>
      </div><div className="stat-panel"><div><strong>6</strong><span>herramientas gratuitas</span></div><div><strong>0</strong><span>registros necesarios</span></div><div><strong>100%</strong><span>adaptado a móvil</span></div></div>
    </section>
    <section className="teacher" id="para-docentes"><div className="teacher-icon"><GraduationCap /></div><div><span className="eyebrow">Para docentes</span><h2>Recursos que simplifican tu día</h2><p>Calcula promedios, prepara referencias y comparte herramientas directas con tus estudiantes.</p></div><a className="button secondary" href="#herramientas">Ver recursos <ArrowRight size={18} /></a></section>
    <section className="seo-copy" id="guias"><span className="eyebrow">Aprender con claridad</span><h2>Herramientas educativas hechas para el uso diario</h2><p>Útiles Online reúne calculadoras académicas y recursos de productividad que ayudan a tomar mejores decisiones durante el estudio. Todas las herramientas incluyen instrucciones, ejemplos y resultados comprensibles.</p></section>
  </main><Footer /></>;
}

function ToolShell({ tool, children, guide }: { tool: Tool; children: React.ReactNode; guide: React.ReactNode }) {
  useMetadata(tool);
  const Icon = tool.icon;
  return <><Header /><main className="tool-page">
    <nav className="breadcrumbs"><a href="/">Inicio</a><span>/</span><a href="/#herramientas">Herramientas</a><span>/</span><span>{tool.title}</span></nav>
    <section className={`tool-hero ${tool.color}`}><span className="tool-icon large"><Icon /></span><div><span className="eyebrow">{tool.category}</span><h1>{tool.title}</h1><p>{tool.short}</p></div></section>
    <section className="workspace">{children}</section>
    <section className="guide">{guide}</section>
    <section className="more-tools"><h2>También te puede servir</h2><div className="tool-grid compact">{TOOLS.filter(t => t.slug !== tool.slug).slice(0, 3).map(t => <ToolCard key={t.slug} tool={t} />)}</div></section>
  </main><Footer /></>;
}

function GradeCalculator() {
  const tool = TOOLS[0]; const [rows, setRows] = useState([{ name: "Tareas", grade: 85, weight: 30 }, { name: "Parcial", grade: 78, weight: 30 }, { name: "Proyecto", grade: 92, weight: 40 }]);
  const totalWeight = rows.reduce((a, r) => a + Number(r.weight), 0);
  const result = totalWeight ? rows.reduce((a, r) => a + Number(r.grade) * Number(r.weight), 0) / totalWeight : 0;
  const update = (i: number, key: string, value: string) => setRows(rows.map((r, n) => n === i ? { ...r, [key]: key === "name" ? value : Number(value) } : r));
  return <ToolShell tool={tool} guide={<><h2>¿Cómo se calcula el promedio ponderado?</h2><p>Multiplica cada calificación por su porcentaje, suma los resultados y divide entre la suma de los porcentajes. Si todas las actividades valen lo mismo, utiliza pesos iguales.</p><h3>Ejemplo</h3><p>Una tarea de 85 con valor de 30%, un parcial de 78 con valor de 30% y un proyecto de 92 con valor de 40% producen un promedio de 85.9.</p></>}>
    <div className="calculator-card"><div className="table-head"><span>Actividad</span><span>Nota</span><span>Peso %</span><span></span></div>
      {rows.map((r, i) => <div className="grade-row" key={i}><input aria-label={`Actividad ${i + 1}`} value={r.name} onChange={e => update(i, "name", e.target.value)} /><input aria-label={`Nota ${i + 1}`} type="number" min="0" max="100" value={r.grade} onChange={e => update(i, "grade", e.target.value)} /><input aria-label={`Peso ${i + 1}`} type="number" min="0" max="100" value={r.weight} onChange={e => update(i, "weight", e.target.value)} /><button onClick={() => setRows(rows.filter((_, n) => n !== i))} aria-label="Eliminar fila"><X size={17} /></button></div>)}
      <button className="text-button" onClick={() => setRows([...rows, { name: "Nueva actividad", grade: 0, weight: 0 }])}>+ Añadir actividad</button>
    </div><Result title="Tu promedio es" value={result.toFixed(1)} detail={`Peso utilizado: ${totalWeight}%`} status={result >= 70 ? "¡Buen trabajo! Estás aprobando." : "Aún puedes mejorar tu promedio."} />
  </ToolShell>;
}

function RequiredGrade() {
  const tool = TOOLS[1]; const [current, setCurrent] = useState(75); const [completed, setCompleted] = useState(70); const [target, setTarget] = useState(70);
  const remaining = 100 - completed; const needed = remaining > 0 ? (target * 100 - current * completed) / remaining : 0;
  return <ToolShell tool={tool} guide={<><h2>Cómo saber qué nota necesitas</h2><p>La calculadora considera tu promedio actual, el porcentaje ya evaluado y la nota final que deseas alcanzar. El resultado representa la calificación necesaria en el porcentaje restante.</p></>}>
    <div className="form-card"><label>Promedio actual<input type="number" value={current} min="0" max="100" onChange={e => setCurrent(Number(e.target.value))} /></label><label>Porcentaje completado<input type="number" value={completed} min="0" max="100" onChange={e => setCompleted(Number(e.target.value))} /></label><label>Promedio que deseas alcanzar<input type="number" value={target} min="0" max="100" onChange={e => setTarget(Number(e.target.value))} /></label></div>
    <Result title="Necesitas obtener" value={needed > 100 ? "Más de 100" : Math.max(0, needed).toFixed(1)} detail={`En el ${remaining}% restante`} status={needed <= 100 ? "La meta es matemáticamente posible." : "Con esos valores, la meta no es alcanzable."} />
  </ToolShell>;
}

function WordCounter() {
  const tool = TOOLS[2]; const [text, setText] = useState("");
  const stats = useMemo(() => { const clean = text.trim(); const words = clean ? clean.split(/\s+/).length : 0; return { words, chars: text.length, noSpaces: text.replace(/\s/g, "").length, sentences: clean ? (clean.match(/[.!?]+/g) || []).length || 1 : 0, minutes: Math.max(1, Math.ceil(words / 220)) }; }, [text]);
  return <ToolShell tool={tool} guide={<><h2>¿Qué cuenta esta herramienta?</h2><p>Reconoce palabras separadas por espacios, caracteres con y sin espacios, oraciones delimitadas por signos y un tiempo aproximado de lectura basado en 220 palabras por minuto.</p></>}>
    <div className="counter-stats"><div><strong>{stats.words}</strong><span>Palabras</span></div><div><strong>{stats.chars}</strong><span>Caracteres</span></div><div><strong>{stats.sentences}</strong><span>Oraciones</span></div><div><strong>{stats.minutes} min</strong><span>Lectura</span></div></div>
    <textarea className="big-textarea" placeholder="Escribe o pega tu texto aquí…" value={text} onChange={e => setText(e.target.value)} />
    <div className="privacy-note"><CheckCircle2 /> El texto no se envía ni se guarda en ningún servidor.</div>
  </ToolShell>;
}

function ApaGenerator() {
  const tool = TOOLS[3]; const [type, setType] = useState("web"); const [author, setAuthor] = useState(""); const [year, setYear] = useState(""); const [title, setTitle] = useState(""); const [source, setSource] = useState(""); const [url, setUrl] = useState("");
  const citation = author || title ? type === "web" ? `${author || "Autor"}. (${year || "s. f."}). ${title || "Título de la página"}. ${source || "Nombre del sitio"}. ${url}` : `${author || "Autor"}. (${year || "s. f."}). ${title || "Título del libro"}. ${source || "Editorial"}.` : "";
  return <ToolShell tool={tool} guide={<><h2>Referencias en formato APA 7</h2><p>APA organiza las fuentes normalmente con autor, fecha, título y fuente. Revisa siempre los requisitos particulares de tu institución antes de entregar un trabajo.</p></>}>
    <div className="form-card"><label>Tipo de fuente<select value={type} onChange={e => setType(e.target.value)}><option value="web">Página web</option><option value="book">Libro</option></select></label><label>Autor o institución<input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Apellido, N." /></label><label>Año<input value={year} onChange={e => setYear(e.target.value)} placeholder="2026" /></label><label>Título<input value={title} onChange={e => setTitle(e.target.value)} /></label><label>{type === "web" ? "Nombre del sitio" : "Editorial"}<input value={source} onChange={e => setSource(e.target.value)} /></label>{type === "web" && <label>URL<input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://" /></label>}</div>
    <div className="citation-box"><span>Referencia generada</span><p>{citation || "Completa los campos para generar tu referencia."}</p><button className="button primary" disabled={!citation} onClick={() => navigator.clipboard.writeText(citation)}>Copiar referencia</button></div>
  </ToolShell>;
}

function Pomodoro() {
  const tool = TOOLS[4]; const [seconds, setSeconds] = useState(25 * 60); const [running, setRunning] = useState(false);
  useEffect(() => { if (!running) return; const id = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000); return () => clearInterval(id); }, [running]);
  const format = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return <ToolShell tool={tool} guide={<><h2>¿Cómo funciona la técnica Pomodoro?</h2><p>Trabaja con concentración durante 25 minutos, descansa 5 y repite. Después de cuatro sesiones, toma una pausa más larga de 15 a 30 minutos.</p></>}>
    <div className="timer-card"><span className="eyebrow">Sesión de concentración</span><strong>{format}</strong><div><button className="button primary" onClick={() => setRunning(!running)}>{running ? "Pausar" : "Comenzar"}</button><button className="button secondary" onClick={() => { setRunning(false); setSeconds(25 * 60); }}>Reiniciar</button></div><div className="timer-presets"><button onClick={() => { setSeconds(25 * 60); setRunning(false); }}>25 min</button><button onClick={() => { setSeconds(5 * 60); setRunning(false); }}>5 min</button><button onClick={() => { setSeconds(15 * 60); setRunning(false); }}>15 min</button></div></div>
  </ToolShell>;
}

function ScheduleMaker() {
  const tool = TOOLS[5]; const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]; const [items, setItems] = useState([{ day: "Lunes", time: "08:00", subject: "Matemáticas" }]);
  return <ToolShell tool={tool} guide={<><h2>Organiza tu semana de estudio</h2><p>Añade cada clase o bloque de estudio, revisa que los horarios no se solapen y guarda la página como PDF desde la opción de impresión de tu navegador.</p></>}>
    <div className="schedule-form"><select id="new-day"><option>{days[0]}</option>{days.slice(1).map(d => <option key={d}>{d}</option>)}</select><input id="new-time" type="time" defaultValue="09:00" /><input id="new-subject" placeholder="Materia o actividad" /><button className="button primary" onClick={() => { const day = (document.getElementById("new-day") as HTMLSelectElement).value; const time = (document.getElementById("new-time") as HTMLInputElement).value; const subject = (document.getElementById("new-subject") as HTMLInputElement).value; if (subject) setItems([...items, { day, time, subject }]); }}>Añadir</button></div>
    <div className="schedule-grid">{days.map(day => <div key={day}><strong>{day}</strong>{items.filter(i => i.day === day).sort((a, b) => a.time.localeCompare(b.time)).map((i, n) => <article key={n}><time>{i.time}</time><span>{i.subject}</span></article>)}</div>)}</div>
  </ToolShell>;
}

function Result({ title, value, detail, status }: { title: string; value: string; detail: string; status: string }) {
  return <div className="result-card"><span>{title}</span><strong>{value}</strong><small>{detail}</small><p><CheckCircle2 /> {status}</p></div>;
}

function InfoPage({ title }: { title: string }) {
  useMetadata({ ...TOOLS[0], title, short: `Información sobre ${title.toLowerCase()}.` });
  return <><Header /><main className="info-page"><span className="eyebrow">Útiles Online</span><h1>{title}</h1><p>Estamos construyendo recursos educativos gratuitos, fáciles de usar y respetuosos con la privacidad.</p><p>Para consultas generales puedes escribir a contacto@utilesonline.com.</p><a className="button primary" href="/">Volver al inicio</a></main><Footer /></>;
}

export default function App() {
  const slug = pathSlug();
  if (!slug) return <Home />;
  if (slug === "calculadora-de-notas") return <GradeCalculator />;
  if (slug === "nota-necesaria-para-aprobar") return <RequiredGrade />;
  if (slug === "contador-de-palabras") return <WordCounter />;
  if (slug === "generador-apa") return <ApaGenerator />;
  if (slug === "temporizador-pomodoro") return <Pomodoro />;
  if (slug === "creador-de-horarios") return <ScheduleMaker />;
  if (["acerca-de", "privacidad", "contacto"].includes(slug)) return <InfoPage title={slug === "acerca-de" ? "Acerca de" : slug[0].toUpperCase() + slug.slice(1)} />;
  return <><Header /><main className="info-page not-found"><span>404</span><h1>Página no encontrada</h1><p>La dirección solicitada no existe o fue reemplazada.</p><a className="button primary" href="/">Explorar herramientas</a></main><Footer /></>;
}
