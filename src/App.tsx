import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BookOpen, Calculator, CalendarDays, CheckCircle2, Clock3,
  Download, FileText, GraduationCap, Heart, Menu, Moon, Quote, Save, Search,
  Share2, Sparkles, Sun, Trash2, Type, X
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
  { slug: "calculadora-gpa", title: "Calculadora de GPA", short: "Convierte tus materias a la escala universitaria de 4.0.", category: "Cálculo académico", icon: GraduationCap, color: "blue" },
  { slug: "conversor-de-calificaciones", title: "Conversor de calificaciones", short: "Convierte notas entre escalas de 5, 10, 20 y 100 puntos.", category: "Cálculo académico", icon: Calculator, color: "orange" },
  { slug: "calculadora-de-asistencia", title: "Calculadora de asistencia", short: "Calcula tu porcentaje de asistencia y cuántas faltas puedes tener.", category: "Cálculo académico", icon: CheckCircle2, color: "green" },
  { slug: "contador-de-palabras", title: "Contador de palabras", short: "Cuenta palabras, caracteres, oraciones y tiempo de lectura.", category: "Escritura", icon: Type, color: "orange" },
  { slug: "generador-apa", title: "Generador de referencias APA", short: "Crea referencias de libros y páginas web en formato APA 7.", category: "Escritura", icon: Quote, color: "pink" },
  { slug: "generador-de-portadas", title: "Generador de portadas", short: "Crea una portada académica limpia y descárgala para imprimir.", category: "Escritura", icon: FileText, color: "violet" },
  { slug: "limpiador-de-texto", title: "Limpiador de texto", short: "Corrige espacios, saltos y capitalización con un clic.", category: "Escritura", icon: Type, color: "cyan" },
  { slug: "temporizador-pomodoro", title: "Temporizador Pomodoro", short: "Estudia por bloques y toma descansos sin perder el ritmo.", category: "Productividad", icon: Clock3, color: "green" },
  { slug: "creador-de-horarios", title: "Creador de horarios", short: "Organiza materias y genera un horario semanal imprimible.", category: "Organización", icon: CalendarDays, color: "blue" },
  { slug: "calculadora-cientifica", title: "Calculadora científica", short: "Resuelve operaciones, potencias, raíces y trigonometría.", category: "Matemáticas", icon: Calculator, color: "violet" },
  { slug: "conversor-de-unidades", title: "Conversor de unidades", short: "Convierte longitud, masa, temperatura y tiempo.", category: "Matemáticas", icon: ArrowRight, color: "cyan" },
  { slug: "planificador-de-tareas", title: "Planificador de tareas", short: "Organiza entregas y exámenes por prioridad y fecha.", category: "Organización", icon: CalendarDays, color: "pink" },
];

const pathSlug = () => window.location.pathname.replace(/^\/|\/$/g, "");
const track = (event: string, details: Record<string, unknown> = {}) => {
  const win = window as Window & { dataLayer?: Record<string, unknown>[] };
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({ event, ...details });
};
const saveFile = (name: string, content: string, type = "text/plain") => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
};

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
        <a href="/calculadoras-academicas">Calculadoras</a>
        <a href="/organizacion-y-estudio">Organización</a>
        <a href="/guias">Guías</a>
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
      <div><strong>Recursos</strong><a href="/calculadoras-academicas">Calculadoras académicas</a><a href="/herramientas-de-escritura">Escritura</a><a href="/organizacion-y-estudio">Organización</a><a href="/guias">Guías</a></div>
      <div><strong>Información</strong><a href="/acerca-de">Acerca de</a><a href="/metodologia">Metodología</a><a href="/privacidad">Privacidad</a><a href="/contacto">Contacto</a></div>
      <small>© {new Date().getFullYear()} Útiles Online. Recursos educativos gratuitos.</small>
    </footer>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return <a className={`tool-card ${tool.color}`} href={`/${tool.slug}`} onClick={() => {
    const recent = JSON.parse(localStorage.getItem("uo-recent") || "[]") as string[];
    localStorage.setItem("uo-recent", JSON.stringify([tool.slug, ...recent.filter(s => s !== tool.slug)].slice(0, 4)));
    track("select_tool", { tool: tool.slug, category: tool.category });
  }}>
    <span className="tool-icon"><Icon /></span><span className="eyebrow">{tool.category}</span>
    <h3>{tool.title}</h3><p>{tool.short}</p><span className="card-link">Usar herramienta <ArrowRight size={17} /></span>
  </a>;
}

function Home() {
  useMetadata();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem("uo-favorites") || "[]"));
  const categories = ["Todas", ...Array.from(new Set(TOOLS.map(t => t.category)))];
  const visible = TOOLS.filter(t => (category === "Todas" || t.category === category) && `${t.title} ${t.short}`.toLowerCase().includes(query.toLowerCase()));
  const toggleFavorite = (slug: string) => {
    const next = favorites.includes(slug) ? favorites.filter(s => s !== slug) : [...favorites, slug];
    setFavorites(next); localStorage.setItem("uo-favorites", JSON.stringify(next));
  };
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
      <div className="tool-finder"><label><Search size={19} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar calculadora, escritura, horarios…" /></label><div>{categories.map(c => <button className={category === c ? "active" : ""} onClick={() => setCategory(c)} key={c}>{c}</button>)}</div></div>
      <div className="tool-grid">{visible.map(t => <div className="tool-card-wrap" key={t.slug}><button className={`favorite ${favorites.includes(t.slug) ? "active" : ""}`} onClick={() => toggleFavorite(t.slug)} aria-label={favorites.includes(t.slug) ? `Quitar ${t.title} de favoritos` : `Guardar ${t.title} en favoritos`}><Heart size={18} /></button><ToolCard tool={t} /></div>)}</div>
      {!visible.length && <div className="empty-state"><Search /><h3>No encontramos esa herramienta</h3><p>Prueba con “notas”, “texto”, “horario” o selecciona otra categoría.</p></div>}
    </section>
    <section className="audience" id="para-estudiantes">
      <div><span className="eyebrow">Para estudiantes</span><h2>Menos tiempo calculando.<br />Más tiempo aprendiendo.</h2><p>Cada herramienta explica el resultado para que puedas entenderlo, no solo copiarlo.</p>
        <ul><li><CheckCircle2 /> Resultados instantáneos y fáciles de interpretar</li><li><CheckCircle2 /> Datos procesados únicamente en tu dispositivo</li><li><CheckCircle2 /> Diseñado para secundaria y universidad</li></ul>
      </div><div className="stat-panel"><div><strong>{TOOLS.length}</strong><span>herramientas gratuitas</span></div><div><strong>0</strong><span>registros necesarios</span></div><div><strong>100%</strong><span>adaptado a móvil</span></div></div>
    </section>
    <section className="teacher" id="para-docentes"><div className="teacher-icon"><GraduationCap /></div><div><span className="eyebrow">Para docentes</span><h2>Recursos que simplifican tu día</h2><p>Calcula promedios, prepara referencias y comparte herramientas directas con tus estudiantes.</p></div><a className="button secondary" href="#herramientas">Ver recursos <ArrowRight size={18} /></a></section>
    <section className="seo-copy" id="guias"><span className="eyebrow">Aprender con claridad</span><h2>Guías prácticas para dudas reales</h2><p>Aprende el método detrás de cada resultado con explicaciones, fórmulas y ejemplos revisados.</p><div className="guide-links"><a href="/guias/como-calcular-promedio-final">Cómo calcular el promedio final <ArrowRight /></a><a href="/guias/como-citar-pagina-web-apa-7">Cómo citar una web en APA 7 <ArrowRight /></a><a href="/guias/tecnica-pomodoro">Cómo aplicar la técnica Pomodoro <ArrowRight /></a></div><a className="button secondary" href="/guias">Ver todas las guías</a></section>
  </main><Footer /></>;
}

function ToolShell({ tool, children, guide }: { tool: Tool; children: React.ReactNode; guide: React.ReactNode }) {
  useMetadata(tool);
  const Icon = tool.icon;
  useEffect(() => track("view_tool", { tool: tool.slug, category: tool.category }), [tool]);
  return <><Header /><main className="tool-page">
    <nav className="breadcrumbs"><a href="/">Inicio</a><span>/</span><a href="/#herramientas">Herramientas</a><span>/</span><span>{tool.title}</span></nav>
    <section className={`tool-hero ${tool.color}`}><span className="tool-icon large"><Icon /></span><div><span className="eyebrow">{tool.category}</span><h1>{tool.title}</h1><p>{tool.short}</p></div></section>
    <section className="workspace">{children}</section>
    <AdSpace label="Publicidad" />
    <section className="guide">{guide}</section>
    <AdSpace label="Contenido patrocinado" />
    <section className="more-tools"><h2>También te puede servir</h2><div className="tool-grid compact">{TOOLS.filter(t => t.slug !== tool.slug).slice(0, 3).map(t => <ToolCard key={t.slug} tool={t} />)}</div></section>
  </main><Footer /></>;
}

function AdSpace({ label }: { label: string }) {
  return <aside className="ad-space" aria-label={label}><span>{label}</span><div className="ad-placeholder">Espacio publicitario</div></aside>;
}

function GradeCalculator() {
  const tool = TOOLS.find(t => t.slug === "calculadora-de-notas")!;
  const [rows, setRows] = useState<{ name: string; grade: number; weight: number }[]>(() => JSON.parse(localStorage.getItem("uo-grades") || "null") || [{ name: "Tareas", grade: 85, weight: 30 }, { name: "Parcial", grade: 78, weight: 30 }, { name: "Proyecto", grade: 92, weight: 40 }]);
  const [scale, setScale] = useState(100); const [passing, setPassing] = useState(70); const [copied, setCopied] = useState(false);
  const totalWeight = rows.reduce((a, r) => a + Number(r.weight), 0);
  const result = totalWeight ? rows.reduce((a, r) => a + Number(r.grade) * Number(r.weight), 0) / totalWeight : 0;
  const update = (i: number, key: string, value: string) => setRows(rows.map((r, n) => n === i ? { ...r, [key]: key === "name" ? value : Number(value) } : r));
  useEffect(() => localStorage.setItem("uo-grades", JSON.stringify(rows)), [rows]);
  const summary = `Mi promedio ponderado es ${result.toFixed(1)} de ${scale}, con ${totalWeight}% evaluado.`;
  const share = async () => { if (navigator.share) await navigator.share({ title: "Mi promedio", text: summary, url: location.href }); else { await navigator.clipboard.writeText(summary); setCopied(true); } track("share_result", { tool: tool.slug }); };
  return <ToolShell tool={tool} guide={<><h2>¿Cómo se calcula el promedio ponderado?</h2><p>Multiplica cada calificación por su porcentaje, suma los resultados y divide entre la suma de los porcentajes. Si todas las actividades valen lo mismo, utiliza pesos iguales.</p><h3>Ejemplo</h3><p>Una tarea de 85 con valor de 30%, un parcial de 78 con valor de 30% y un proyecto de 92 con valor de 40% producen un promedio de 85.7.</p></>}>
    <div className="calculator-card"><div className="calculator-options"><label>Escala<select value={scale} onChange={e => setScale(Number(e.target.value))}>{[5, 10, 20, 100].map(v => <option value={v} key={v}>0 a {v}</option>)}</select></label><label>Nota mínima<input type="number" min="0" max={scale} value={passing} onChange={e => setPassing(Number(e.target.value))} /></label></div><div className="table-head"><span>Actividad</span><span>Nota</span><span>Peso %</span><span></span></div>
      {rows.map((r, i) => <div className="grade-row" key={i}><input aria-label={`Actividad ${i + 1}`} value={r.name} onChange={e => update(i, "name", e.target.value)} /><input aria-label={`Nota ${i + 1}`} type="number" min="0" max={scale} value={r.grade} onChange={e => update(i, "grade", e.target.value)} /><input aria-label={`Peso ${i + 1}`} type="number" min="0" max="100" value={r.weight} onChange={e => update(i, "weight", e.target.value)} /><button onClick={() => setRows(rows.filter((_, n) => n !== i))} aria-label="Eliminar fila"><X size={17} /></button></div>)}
      <button className="text-button" onClick={() => setRows([...rows, { name: "Nueva actividad", grade: 0, weight: 0 }])}>+ Añadir actividad</button>
      {totalWeight !== 100 && <p className="validation-note">El peso suma {totalWeight}%. Para un promedio final completo debe sumar 100%.</p>}
    </div><div><Result title="Tu promedio es" value={result.toFixed(1)} detail={`Peso utilizado: ${totalWeight}%`} status={result >= passing ? "¡Buen trabajo! Estás aprobando." : "Aún puedes mejorar tu promedio."} /><div className="result-actions"><button onClick={share}><Share2 size={17} /> {copied ? "Copiado" : "Compartir"}</button><button onClick={() => window.print()}><Download size={17} /> Guardar PDF</button><button onClick={() => { setRows([]); localStorage.removeItem("uo-grades"); }}><Trash2 size={17} /> Limpiar</button></div></div>
  </ToolShell>;
}

function RequiredGrade() {
  const tool = TOOLS.find(t => t.slug === "nota-necesaria-para-aprobar")!; const [current, setCurrent] = useState(75); const [completed, setCompleted] = useState(70); const [target, setTarget] = useState(70);
  const remaining = 100 - completed; const needed = remaining > 0 ? (target * 100 - current * completed) / remaining : 0;
  return <ToolShell tool={tool} guide={<><h2>Cómo saber qué nota necesitas</h2><p>La calculadora considera tu promedio actual, el porcentaje ya evaluado y la nota final que deseas alcanzar. El resultado representa la calificación necesaria en el porcentaje restante.</p></>}>
    <div className="form-card"><label>Promedio actual<input type="number" value={current} min="0" max="100" onChange={e => setCurrent(Number(e.target.value))} /></label><label>Porcentaje completado<input type="number" value={completed} min="0" max="100" onChange={e => setCompleted(Number(e.target.value))} /></label><label>Promedio que deseas alcanzar<input type="number" value={target} min="0" max="100" onChange={e => setTarget(Number(e.target.value))} /></label></div>
    <Result title="Necesitas obtener" value={needed > 100 ? "Más de 100" : Math.max(0, needed).toFixed(1)} detail={`En el ${remaining}% restante`} status={needed <= 100 ? "La meta es matemáticamente posible." : "Con esos valores, la meta no es alcanzable."} />
  </ToolShell>;
}

function WordCounter() {
  const tool = TOOLS.find(t => t.slug === "contador-de-palabras")!; const [text, setText] = useState("");
  const stats = useMemo(() => { const clean = text.trim(); const words = clean ? clean.split(/\s+/).length : 0; return { words, chars: text.length, noSpaces: text.replace(/\s/g, "").length, sentences: clean ? (clean.match(/[.!?]+/g) || []).length || 1 : 0, minutes: Math.max(1, Math.ceil(words / 220)) }; }, [text]);
  return <ToolShell tool={tool} guide={<><h2>¿Qué cuenta esta herramienta?</h2><p>Reconoce palabras separadas por espacios, caracteres con y sin espacios, oraciones delimitadas por signos y un tiempo aproximado de lectura basado en 220 palabras por minuto.</p></>}>
    <div className="counter-stats"><div><strong>{stats.words}</strong><span>Palabras</span></div><div><strong>{stats.chars}</strong><span>Caracteres</span></div><div><strong>{stats.sentences}</strong><span>Oraciones</span></div><div><strong>{stats.minutes} min</strong><span>Lectura</span></div></div>
    <textarea className="big-textarea" placeholder="Escribe o pega tu texto aquí…" value={text} onChange={e => setText(e.target.value)} />
    <div className="privacy-note"><CheckCircle2 /> El texto no se envía ni se guarda en ningún servidor.</div>
  </ToolShell>;
}

function ApaGenerator() {
  const tool = TOOLS.find(t => t.slug === "generador-apa")!;
  const [type, setType] = useState("web"); const [author, setAuthor] = useState(""); const [year, setYear] = useState(""); const [title, setTitle] = useState(""); const [source, setSource] = useState(""); const [url, setUrl] = useState(""); const [extra, setExtra] = useState("");
  const [history, setHistory] = useState<string[]>(() => JSON.parse(localStorage.getItem("uo-citations") || "[]")); const [copied, setCopied] = useState(false);
  const citation = useMemo(() => {
    if (!author && !title) return "";
    const base = `${(author || "Autor").replace(/[.\s]+$/, "")}. (${year || "s. f."}). `;
    if (type === "book") return `${base}${title || "Título del libro"}. ${source || "Editorial"}.${extra ? ` ${extra}.` : ""}`;
    if (type === "article") return `${base}${title || "Título del artículo"}. ${source || "Nombre de la revista"}${extra ? `, ${extra}` : ""}.${url ? ` ${url}` : ""}`;
    if (type === "video") return `${base}${title || "Título del video"} [Video]. ${source || "Plataforma"}. ${url}`;
    if (type === "thesis") return `${base}${title || "Título de la tesis"} [Tesis, ${source || "Institución"}]. ${url}`;
    return `${base}${title || "Título de la página"}. ${source || "Nombre del sitio"}. ${url}`;
  }, [type, author, year, title, source, url, extra]);
  const addCitation = () => { if (!citation) return; const next = [citation, ...history.filter(c => c !== citation)].slice(0, 20); setHistory(next); localStorage.setItem("uo-citations", JSON.stringify(next)); track("generate_citation", { source_type: type }); };
  const copyCitation = async () => { await navigator.clipboard.writeText(citation); setCopied(true); addCitation(); };
  return <ToolShell tool={tool} guide={<><h2>Referencias en formato APA 7</h2><p>APA organiza las fuentes con autor, fecha, título y fuente. Los títulos de libros y revistas deben llevar cursiva al pegar la referencia en tu procesador de texto. Revisa mayúsculas, DOI y requisitos particulares de tu institución.</p><h3>Cita dentro del texto</h3><p>Para una cita parentética utiliza (Apellido, año). Para una cita narrativa utiliza Apellido (año). Si no hay fecha se emplea “s. f.”.</p></>}>
    <div className="form-card"><label>Tipo de fuente<select value={type} onChange={e => setType(e.target.value)}><option value="web">Página web</option><option value="book">Libro</option><option value="article">Artículo científico</option><option value="video">Video</option><option value="thesis">Tesis</option></select></label><label>Autor o institución<input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Apellido, N." /></label><label>Año<input value={year} onChange={e => setYear(e.target.value)} placeholder="2026 o s. f." /></label><label>Título<input value={title} onChange={e => setTitle(e.target.value)} /></label><label>{type === "book" ? "Editorial" : type === "article" ? "Revista" : type === "thesis" ? "Institución" : "Sitio o plataforma"}<input value={source} onChange={e => setSource(e.target.value)} /></label>{["book", "article"].includes(type) && <label>{type === "article" ? "Volumen, número y páginas" : "Edición (opcional)"}<input value={extra} onChange={e => setExtra(e.target.value)} placeholder={type === "article" ? "12(3), 20–35" : "2.ª ed."} /></label>}{type !== "book" && <label>URL o DOI<input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://" /></label>}</div>
    <div className="citation-box"><span>Referencia generada</span><p>{citation || "Completa autor o título para generar tu referencia."}</p><div className="citation-actions"><button className="button primary" disabled={!citation} onClick={copyCitation}>{copied ? "Referencia copiada" : "Copiar referencia"}</button><button className="button secondary" disabled={!citation} onClick={addCitation}><Save size={17} /> Guardar</button></div><small>Cita parentética: {author ? `(${author.split(",")[0]}, ${year || "s. f."})` : "—"}</small></div>
    {history.length > 0 && <div className="citation-history"><div><h3>Bibliografía guardada</h3><button onClick={() => saveFile("referencias-apa.txt", history.join("\n\n"))}><Download size={17} /> Exportar</button></div>{history.map((item, i) => <article key={`${item}-${i}`}><p>{item}</p><button onClick={() => { const next = history.filter((_, n) => n !== i); setHistory(next); localStorage.setItem("uo-citations", JSON.stringify(next)); }} aria-label="Eliminar referencia"><X size={16} /></button></article>)}</div>}
  </ToolShell>;
}

function Pomodoro() {
  const tool = TOOLS.find(t => t.slug === "temporizador-pomodoro")!; const [seconds, setSeconds] = useState(25 * 60); const [running, setRunning] = useState(false);
  useEffect(() => { if (!running) return; const id = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000); return () => clearInterval(id); }, [running]);
  const format = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return <ToolShell tool={tool} guide={<><h2>¿Cómo funciona la técnica Pomodoro?</h2><p>Trabaja con concentración durante 25 minutos, descansa 5 y repite. Después de cuatro sesiones, toma una pausa más larga de 15 a 30 minutos.</p></>}>
    <div className="timer-card"><span className="eyebrow">Sesión de concentración</span><strong>{format}</strong><div><button className="button primary" onClick={() => setRunning(!running)}>{running ? "Pausar" : "Comenzar"}</button><button className="button secondary" onClick={() => { setRunning(false); setSeconds(25 * 60); }}>Reiniciar</button></div><div className="timer-presets"><button onClick={() => { setSeconds(25 * 60); setRunning(false); }}>25 min</button><button onClick={() => { setSeconds(5 * 60); setRunning(false); }}>5 min</button><button onClick={() => { setSeconds(15 * 60); setRunning(false); }}>15 min</button></div></div>
  </ToolShell>;
}

function ScheduleMaker() {
  const tool = TOOLS.find(t => t.slug === "creador-de-horarios")!;
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  type ScheduleItem = { day: string; start: string; end: string; subject: string; color: string };
  const [items, setItems] = useState<ScheduleItem[]>(() => JSON.parse(localStorage.getItem("uo-schedule") || "null") || [{ day: "Lunes", start: "08:00", end: "09:00", subject: "Matemáticas", color: "#6d4aff" }]);
  const [draft, setDraft] = useState<ScheduleItem>({ day: "Lunes", start: "09:00", end: "10:00", subject: "", color: "#6d4aff" });
  const [showWeekend, setShowWeekend] = useState(false); const [error, setError] = useState("");
  useEffect(() => localStorage.setItem("uo-schedule", JSON.stringify(items)), [items]);
  const addItem = () => {
    if (!draft.subject.trim() || draft.start >= draft.end) return setError("Escribe una actividad y selecciona una hora final posterior a la inicial.");
    if (items.some(i => i.day === draft.day && draft.start < i.end && draft.end > i.start)) return setError("Ese bloque se cruza con otra actividad del mismo día.");
    setItems([...items, { ...draft, subject: draft.subject.trim() }]); setDraft({ ...draft, subject: "" }); setError(""); track("create_schedule_block");
  };
  const visibleDays = showWeekend ? days : days.slice(0, 5);
  const exportSchedule = () => saveFile("mi-horario.csv", `Día,Inicio,Fin,Actividad\n${items.map(i => `${i.day},${i.start},${i.end},"${i.subject.replaceAll('"', '""')}"`).join("\n")}`, "text/csv");
  return <ToolShell tool={tool} guide={<><h2>Organiza tu semana de estudio</h2><p>Añade cada clase o bloque de estudio, revisa que los horarios no se solapen y guarda la página como PDF desde la opción de impresión de tu navegador.</p></>}>
    <div className="schedule-form"><select aria-label="Día" value={draft.day} onChange={e => setDraft({ ...draft, day: e.target.value })}>{days.map(d => <option key={d}>{d}</option>)}</select><input aria-label="Hora inicial" type="time" value={draft.start} onChange={e => setDraft({ ...draft, start: e.target.value })} /><input aria-label="Hora final" type="time" value={draft.end} onChange={e => setDraft({ ...draft, end: e.target.value })} /><input aria-label="Materia o actividad" value={draft.subject} onChange={e => setDraft({ ...draft, subject: e.target.value })} placeholder="Materia o actividad" /><input aria-label="Color" type="color" value={draft.color} onChange={e => setDraft({ ...draft, color: e.target.value })} /><button className="button primary" onClick={addItem}>Añadir</button></div>
    <div className="schedule-actions"><label><input type="checkbox" checked={showWeekend} onChange={e => setShowWeekend(e.target.checked)} /> Mostrar fin de semana</label><button onClick={() => window.print()}><Download size={17} /> Guardar PDF</button><button onClick={exportSchedule}><Save size={17} /> Exportar CSV</button><button onClick={() => setItems([])}><Trash2 size={17} /> Vaciar</button></div>
    {error && <p className="validation-note full">{error}</p>}
    <div className={`schedule-grid ${showWeekend ? "weekend" : ""}`}>{visibleDays.map(day => <div key={day}><strong>{day}</strong>{items.filter(i => i.day === day).sort((a, b) => a.start.localeCompare(b.start)).map((item, n) => <article key={`${item.start}-${n}`} style={{ borderLeftColor: item.color }}><time>{item.start}–{item.end}</time><span>{item.subject}</span><button onClick={() => setItems(items.filter(i => i !== item))} aria-label={`Eliminar ${item.subject}`}><X size={14} /></button></article>)}</div>)}</div>
  </ToolShell>;
}

function GpaCalculator() {
  const tool = TOOLS.find(t => t.slug === "calculadora-gpa")!;
  const [courses, setCourses] = useState([{ name: "Matemáticas", grade: "A", credits: 3 }, { name: "Lengua", grade: "B+", credits: 3 }]);
  const points: Record<string, number> = { "A": 4, "A-": 3.7, "B+": 3.3, "B": 3, "B-": 2.7, "C+": 2.3, "C": 2, "C-": 1.7, "D": 1, "F": 0 };
  const credits = courses.reduce((sum, c) => sum + Number(c.credits), 0);
  const gpa = credits ? courses.reduce((sum, c) => sum + points[c.grade] * Number(c.credits), 0) / credits : 0;
  const update = (i: number, key: string, value: string | number) => setCourses(courses.map((c, n) => n === i ? { ...c, [key]: value } : c));
  return <ToolShell tool={tool} guide={<><h2>Cómo calcular el GPA</h2><p>Cada letra se transforma en puntos de la escala 4.0. Luego se multiplica por los créditos de la materia y se divide entre el total de créditos. Confirma siempre la escala específica de tu universidad.</p></>}>
    <div className="calculator-card"><div className="table-head"><span>Materia</span><span>Nota</span><span>Créditos</span><span></span></div>{courses.map((c, i) => <div className="grade-row" key={i}><input value={c.name} aria-label={`Materia ${i + 1}`} onChange={e => update(i, "name", e.target.value)} /><select value={c.grade} aria-label={`Calificación ${i + 1}`} onChange={e => update(i, "grade", e.target.value)}>{Object.keys(points).map(p => <option key={p}>{p}</option>)}</select><input type="number" min="1" value={c.credits} aria-label={`Créditos ${i + 1}`} onChange={e => update(i, "credits", Number(e.target.value))} /><button onClick={() => setCourses(courses.filter((_, n) => n !== i))} aria-label="Eliminar materia"><X size={17} /></button></div>)}<button className="text-button" onClick={() => setCourses([...courses, { name: "Nueva materia", grade: "A", credits: 3 }])}>+ Añadir materia</button></div>
    <Result title="Tu GPA estimado" value={gpa.toFixed(2)} detail={`${credits} créditos incluidos`} status={gpa >= 3 ? "Rendimiento académico sólido." : "Identifica las materias con mayor oportunidad de mejora."} />
  </ToolShell>;
}

function GradeConverter() {
  const tool = TOOLS.find(t => t.slug === "conversor-de-calificaciones")!;
  const [value, setValue] = useState(85); const [from, setFrom] = useState(100); const [to, setTo] = useState(20);
  const converted = Math.max(0, Math.min(to, value / from * to));
  return <ToolShell tool={tool} guide={<><h2>Conversión proporcional de calificaciones</h2><p>La conversión divide la nota entre la escala original y multiplica el resultado por la escala de destino. Esto conserva el mismo porcentaje de rendimiento.</p></>}>
    <div className="form-card"><label>Calificación<input type="number" value={value} min="0" max={from} onChange={e => setValue(Number(e.target.value))} /></label><label>Escala original<select value={from} onChange={e => setFrom(Number(e.target.value))}>{[5, 10, 20, 100].map(v => <option key={v} value={v}>{v} puntos</option>)}</select></label><label>Escala de destino<select value={to} onChange={e => setTo(Number(e.target.value))}>{[5, 10, 20, 100].map(v => <option key={v} value={v}>{v} puntos</option>)}</select></label></div>
    <Result title={`Equivale a ${to} puntos`} value={converted.toFixed(2)} detail={`${(value / from * 100).toFixed(1)}% de rendimiento`} status="Conversión proporcional completada." />
  </ToolShell>;
}

function AttendanceCalculator() {
  const tool = TOOLS.find(t => t.slug === "calculadora-de-asistencia")!;
  const [classes, setClasses] = useState(40); const [attended, setAttended] = useState(36); const [minimum, setMinimum] = useState(80);
  const percentage = classes ? attended / classes * 100 : 0;
  const possibleAbsences = Math.max(0, Math.floor(classes * (1 - minimum / 100)));
  return <ToolShell tool={tool} guide={<><h2>Cómo interpretar tu asistencia</h2><p>El porcentaje se obtiene dividiendo las clases asistidas entre las clases impartidas. El máximo de ausencias es una estimación basada en el requisito seleccionado.</p></>}>
    <div className="form-card"><label>Clases impartidas<input type="number" min="1" value={classes} onChange={e => setClasses(Number(e.target.value))} /></label><label>Clases asistidas<input type="number" min="0" max={classes} value={attended} onChange={e => setAttended(Number(e.target.value))} /></label><label>Asistencia mínima requerida<input type="number" min="1" max="100" value={minimum} onChange={e => setMinimum(Number(e.target.value))} /></label></div>
    <Result title="Tu asistencia actual" value={`${percentage.toFixed(1)}%`} detail={`Máximo estimado: ${possibleAbsences} ausencias`} status={percentage >= minimum ? "Cumples el mínimo seleccionado." : "Estás por debajo del mínimo requerido."} />
  </ToolShell>;
}

function CoverGenerator() {
  const tool = TOOLS.find(t => t.slug === "generador-de-portadas")!;
  const [data, setData] = useState({ institution: "Nombre de la institución", title: "Título del trabajo", student: "Nombre del estudiante", subject: "Asignatura", teacher: "Docente", date: new Date().toISOString().slice(0, 10) });
  const update = (key: string, value: string) => setData({ ...data, [key]: value });
  return <ToolShell tool={tool} guide={<><h2>Portadas académicas claras</h2><p>Una buena portada identifica la institución, el trabajo, el estudiante, la asignatura, el docente y la fecha. Revisa si tu centro exige un formato específico.</p></>}>
    <div className="form-card">{Object.entries(data).map(([key, value]) => <label key={key}>{({ institution: "Institución", title: "Título", student: "Estudiante", subject: "Asignatura", teacher: "Docente", date: "Fecha" } as Record<string, string>)[key]}<input type={key === "date" ? "date" : "text"} value={value} onChange={e => update(key, e.target.value)} /></label>)}</div>
    <div className="cover-preview"><span>{data.institution}</span><h2>{data.title}</h2><div><p><strong>Estudiante:</strong> {data.student}</p><p><strong>Asignatura:</strong> {data.subject}</p><p><strong>Docente:</strong> {data.teacher}</p><p><strong>Fecha:</strong> {data.date}</p></div><button className="button primary no-print" onClick={() => window.print()}>Imprimir o guardar PDF</button></div>
  </ToolShell>;
}

function TextCleaner() {
  const tool = TOOLS.find(t => t.slug === "limpiador-de-texto")!;
  const [text, setText] = useState(""); const [cleaned, setCleaned] = useState("");
  const clean = () => setCleaned(text.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim());
  const sentenceCase = () => setCleaned(text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, m => m.toUpperCase()).replace(/[ \t]+/g, " ").trim());
  return <ToolShell tool={tool} guide={<><h2>Limpia textos copiados</h2><p>Elimina espacios duplicados, líneas excesivas y errores frecuentes de formato. El procesamiento ocurre únicamente en tu navegador.</p></>}>
    <div className="text-tools"><textarea className="big-textarea" value={text} onChange={e => setText(e.target.value)} placeholder="Pega el texto original…" /><div><button className="button primary" onClick={clean}>Limpiar espacios</button><button className="button secondary" onClick={sentenceCase}>Formato oración</button></div><textarea className="big-textarea" value={cleaned} onChange={e => setCleaned(e.target.value)} placeholder="El resultado aparecerá aquí…" /><button className="button secondary" disabled={!cleaned} onClick={() => navigator.clipboard.writeText(cleaned)}>Copiar resultado</button></div>
  </ToolShell>;
}

function ScientificCalculator() {
  const tool = TOOLS.find(t => t.slug === "calculadora-cientifica")!;
  const [a, setA] = useState(9); const [b, setB] = useState(2); const [operation, setOperation] = useState("power");
  const result = useMemo(() => {
    if (operation === "power") return Math.pow(a, b);
    if (operation === "root") return b === 0 ? NaN : Math.pow(a, 1 / b);
    if (operation === "sin") return Math.sin(a * Math.PI / 180);
    if (operation === "cos") return Math.cos(a * Math.PI / 180);
    if (operation === "log") return Math.log10(a);
    if (operation === "ln") return Math.log(a);
    return 0;
  }, [a, b, operation]);
  return <ToolShell tool={tool} guide={<><h2>Operaciones científicas frecuentes</h2><p>Calcula potencias, raíces, logaritmos y funciones trigonométricas. Los ángulos de seno y coseno se interpretan en grados.</p></>}>
    <div className="form-card"><label>Operación<select value={operation} onChange={e => setOperation(e.target.value)}><option value="power">Potencia aᵇ</option><option value="root">Raíz b de a</option><option value="sin">Seno de a</option><option value="cos">Coseno de a</option><option value="log">Logaritmo base 10</option><option value="ln">Logaritmo natural</option></select></label><label>Valor a<input type="number" value={a} onChange={e => setA(Number(e.target.value))} /></label>{["power", "root"].includes(operation) && <label>Valor b<input type="number" value={b} onChange={e => setB(Number(e.target.value))} /></label>}</div>
    <Result title="Resultado" value={Number.isFinite(result) ? Number(result.toFixed(8)).toString() : "No definido"} detail="Revisa los valores antes de utilizar el resultado." status="Operación calculada localmente." />
  </ToolShell>;
}

function UnitConverter() {
  const tool = TOOLS.find(t => t.slug === "conversor-de-unidades")!;
  const groups = { longitud: { metro: 1, kilometro: 1000, centimetro: .01, pulgada: .0254, pie: .3048 }, masa: { kilogramo: 1, gramo: .001, libra: .453592, onza: .0283495 }, tiempo: { segundo: 1, minuto: 60, hora: 3600, dia: 86400 } };
  const [group, setGroup] = useState<keyof typeof groups>("longitud"); const [value, setValue] = useState(1); const [from, setFrom] = useState("metro"); const [to, setTo] = useState("kilometro");
  const units = groups[group] as Record<string, number>; const result = value * (units[from] || 1) / (units[to] || 1);
  const changeGroup = (g: keyof typeof groups) => { const keys = Object.keys(groups[g]); setGroup(g); setFrom(keys[0]); setTo(keys[1]); };
  return <ToolShell tool={tool} guide={<><h2>Conversión de unidades</h2><p>Selecciona una magnitud, la unidad original y la unidad de destino. La herramienta utiliza factores de conversión estándar.</p></>}>
    <div className="form-card"><label>Magnitud<select value={group} onChange={e => changeGroup(e.target.value as keyof typeof groups)}>{Object.keys(groups).map(g => <option key={g} value={g}>{g}</option>)}</select></label><label>Cantidad<input type="number" value={value} onChange={e => setValue(Number(e.target.value))} /></label><label>De<select value={from} onChange={e => setFrom(e.target.value)}>{Object.keys(units).map(u => <option key={u}>{u}</option>)}</select></label><label>A<select value={to} onChange={e => setTo(e.target.value)}>{Object.keys(units).map(u => <option key={u}>{u}</option>)}</select></label></div>
    <Result title={`Resultado en ${to}`} value={Number(result.toPrecision(8)).toString()} detail={`${value} ${from} equivalen a ${result} ${to}`} status="Conversión completada." />
  </ToolShell>;
}

function TaskPlanner() {
  const tool = TOOLS.find(t => t.slug === "planificador-de-tareas")!;
  const [tasks, setTasks] = useState<{ title: string; date: string; priority: string; done: boolean }[]>(() => JSON.parse(localStorage.getItem("uo-tasks") || "[]"));
  const [title, setTitle] = useState(""); const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); const [priority, setPriority] = useState("media");
  useEffect(() => localStorage.setItem("uo-tasks", JSON.stringify(tasks)), [tasks]);
  return <ToolShell tool={tool} guide={<><h2>Planifica entregas y exámenes</h2><p>Registra cada pendiente con fecha y prioridad. La información se guarda solamente en este navegador y puedes marcarla como completada.</p></>}>
    <div className="planner-form"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Tarea o examen" /><input type="date" value={date} onChange={e => setDate(e.target.value)} /><select value={priority} onChange={e => setPriority(e.target.value)}><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select><button className="button primary" onClick={() => { if (title.trim()) { setTasks([...tasks, { title: title.trim(), date, priority, done: false }]); setTitle(""); } }}>Añadir</button></div>
    <div className="task-list">{tasks.length === 0 && <p>No tienes tareas registradas.</p>}{[...tasks].sort((a, b) => a.date.localeCompare(b.date)).map((task, i) => <article key={`${task.title}-${i}`} className={task.done ? "done" : ""}><button onClick={() => setTasks(tasks.map(t => t === task ? { ...t, done: !t.done } : t))} aria-label="Marcar como completada"><CheckCircle2 /></button><div><strong>{task.title}</strong><span>{task.date} · Prioridad {task.priority}</span></div><button onClick={() => setTasks(tasks.filter(t => t !== task))} aria-label="Eliminar tarea"><X /></button></article>)}</div>
  </ToolShell>;
}

function Result({ title, value, detail, status }: { title: string; value: string; detail: string; status: string }) {
  return <div className="result-card"><span>{title}</span><strong>{value}</strong><small>{detail}</small><p><CheckCircle2 /> {status}</p></div>;
}

const CONTENT: Record<string, { title: string; intro: string; sections: { heading: string; text: string }[]; tools?: string[] }> = {
  "calculadoras-academicas": { title: "Calculadoras académicas gratuitas", intro: "Calcula promedios, metas, GPA y asistencia con resultados explicados paso a paso.", tools: ["calculadora-de-notas", "nota-necesaria-para-aprobar", "calculadora-gpa", "conversor-de-calificaciones", "calculadora-de-asistencia"], sections: [{ heading: "Elige la calculadora adecuada", text: "Usa el promedio ponderado cuando cada actividad tenga un peso distinto; el GPA para créditos universitarios; y la calculadora de asistencia para comprobar requisitos mínimos." }, { heading: "Resultados para tomar decisiones", text: "Cada resultado es una estimación basada en los datos que introduces. Contrástalo con el reglamento y la escala oficial de tu institución." }] },
  "herramientas-de-escritura": { title: "Herramientas de escritura académica", intro: "Cuenta, limpia, organiza y cita textos sin enviar su contenido a nuestros servidores.", tools: ["contador-de-palabras", "generador-apa", "generador-de-portadas", "limpiador-de-texto"], sections: [{ heading: "Mejora la presentación", text: "Antes de entregar, revisa extensión, ortografía, estructura, citas y formato. Estas herramientas resuelven la parte mecánica para que concentres tu tiempo en las ideas." }] },
  "organizacion-y-estudio": { title: "Organización y técnicas de estudio", intro: "Convierte fechas, clases y sesiones de concentración en un plan semanal realista.", tools: ["temporizador-pomodoro", "creador-de-horarios", "planificador-de-tareas"], sections: [{ heading: "Planificar sin saturarse", text: "Empieza por fechas fijas, divide proyectos grandes en tareas pequeñas y reserva pausas. Un horario útil también deja espacio para cambios." }] },
  "recursos-para-docentes": { title: "Recursos gratuitos para docentes", intro: "Herramientas listas para proyectar, compartir o usar durante la preparación de clases.", tools: ["calculadora-de-notas", "creador-de-horarios", "generador-apa", "contador-de-palabras"], sections: [{ heading: "Uso responsable en el aula", text: "Comparte el enlace directo de cada herramienta y explica el método detrás del resultado. Así el recurso apoya el aprendizaje en vez de sustituirlo." }] },
  "guias": { title: "Guías para estudiar mejor", intro: "Explicaciones claras y ejemplos prácticos para resolver dudas académicas frecuentes.", sections: [{ heading: "Cálculo académico", text: "Aprende a diferenciar promedio simple y ponderado, estimar la nota final y convertir escalas sin perder proporcionalidad." }, { heading: "Escritura y organización", text: "Consulta cómo citar en APA 7, organizar un horario y usar Pomodoro de forma sostenible." }] },
  "guias/como-calcular-promedio-final": { title: "Cómo calcular el promedio final paso a paso", intro: "El promedio final puede ser simple o ponderado. La diferencia está en cuánto vale cada evaluación.", sections: [{ heading: "Promedio simple", text: "Suma todas las notas y divide entre la cantidad de notas. Úsalo solamente cuando todas tengan el mismo valor." }, { heading: "Promedio ponderado", text: "Multiplica cada nota por su porcentaje, suma los productos y divide entre el total de pesos. Comprueba que los porcentajes sumen 100." }, { heading: "Ejemplo", text: "Si tareas valen 30%, parcial 30% y proyecto 40%, notas de 85, 78 y 92 dan 85.7 puntos." }], tools: ["calculadora-de-notas", "nota-necesaria-para-aprobar"] },
  "guias/nota-necesaria-para-aprobar": { title: "Cómo saber qué nota necesitas para aprobar", intro: "Puedes calcular la nota necesaria usando tu promedio actual, el porcentaje completado y la meta.", sections: [{ heading: "La fórmula", text: "Resta del objetivo total los puntos ya obtenidos y divide entre el porcentaje pendiente. Si el resultado supera la escala máxima, la meta no es alcanzable con una sola evaluación." }], tools: ["nota-necesaria-para-aprobar", "calculadora-de-notas"] },
  "guias/como-citar-pagina-web-apa-7": { title: "Cómo citar una página web en APA 7", intro: "Una referencia web suele incluir autor, fecha, título, sitio y URL.", sections: [{ heading: "Sin autor o sin fecha", text: "Si no hay autor, comienza por el título. Si no aparece una fecha verificable, usa la abreviatura s. f. No inventes información." }, { heading: "Revisión final", text: "Comprueba que el enlace funcione, aplica sangría francesa en la bibliografía y conserva el orden alfabético." }], tools: ["generador-apa", "contador-de-palabras"] },
  "guias/promedio-simple-vs-ponderado": { title: "Promedio simple vs. ponderado", intro: "El promedio simple trata todas las notas por igual; el ponderado respeta el valor de cada actividad.", sections: [{ heading: "Cuándo usar cada uno", text: "Usa el simple para actividades equivalentes. Usa el ponderado cuando el programa indica porcentajes distintos para tareas, exámenes o proyectos." }], tools: ["calculadora-de-notas"] },
  "guias/tecnica-pomodoro": { title: "Técnica Pomodoro: guía práctica", intro: "Pomodoro alterna periodos de concentración con pausas breves para reducir la fatiga.", sections: [{ heading: "Un ciclo sostenible", text: "Trabaja 25 minutos, descansa 5 y repite. Después de cuatro ciclos, toma una pausa de 15 a 30 minutos. Ajusta los bloques si la tarea requiere más continuidad." }], tools: ["temporizador-pomodoro", "planificador-de-tareas"] },
  "guias/organizar-horario-universitario": { title: "Cómo organizar un horario universitario", intro: "Un buen horario combina clases, traslados, estudio individual, entregas y descanso.", sections: [{ heading: "Orden recomendado", text: "Coloca primero las clases y compromisos fijos. Añade bloques de repaso cerca de cada clase, evita solapamientos y deja márgenes para imprevistos." }], tools: ["creador-de-horarios", "planificador-de-tareas"] }
};

function ContentPage({ slug }: { slug: string }) {
  const page = CONTENT[slug];
  useEffect(() => { document.title = `${page.title} | Útiles Online`; const meta = document.querySelector('meta[name="description"]'); meta?.setAttribute("content", page.intro); }, [page]);
  return <><Header /><main className="content-page"><nav className="breadcrumbs"><a href="/">Inicio</a><span>/</span><a href="/guias">Recursos</a><span>/</span><span>{page.title}</span></nav><header><span className="eyebrow">Recurso educativo</span><h1>{page.title}</h1><p>{page.intro}</p><span className="reviewed"><CheckCircle2 /> Contenido revisado por el equipo editorial · Actualizado en julio de 2026</span></header>{page.tools && <section><h2>Herramientas relacionadas</h2><div className="tool-grid">{page.tools.map(slug => <ToolCard key={slug} tool={TOOLS.find(t => t.slug === slug)!} />)}</div></section>}<article>{page.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p></section>)}</article><section className="faq"><h2>Preguntas frecuentes</h2><details><summary>¿Estas herramientas son gratuitas?</summary><p>Sí. Puedes utilizarlas sin crear una cuenta.</p></details><details><summary>¿Se guardan mis datos?</summary><p>Los cálculos se realizan en tu navegador. Las funciones de guardado usan el almacenamiento local de tu dispositivo.</p></details></section><AdSpace label="Publicidad" /></main><Footer /></>;
}

function InfoPage({ slug }: { slug: string }) {
  const data = {
    "acerca-de": { title: "Acerca de Útiles Online", body: ["Útiles Online crea herramientas educativas gratuitas, claras y accesibles para estudiantes y docentes de habla hispana.", "Cada recurso explica su método, funciona sin registro y se revisa antes de publicarse. Nuestro objetivo es ahorrar tiempo sin ocultar cómo se obtiene el resultado."] },
    privacidad: { title: "Política de privacidad", body: ["Las calculadoras procesan los datos en tu navegador. Las tareas, horarios, favoritos y referencias que decides guardar permanecen en el almacenamiento local de tu dispositivo.", "Utilizamos servicios de medición y publicidad de Google que pueden emplear cookies según tu consentimiento y configuración. No solicitamos nombres, documentos académicos ni contraseñas. Puedes borrar los datos locales desde la configuración del navegador."] },
    contacto: { title: "Contacto", body: ["Puedes escribir a contacto@utilesonline.com para reportar errores, proponer una herramienta o solicitar una corrección editorial.", "Indica la dirección de la página, el dispositivo utilizado y una descripción clara. No envíes notas, documentos ni información personal sensible."] },
    metodologia: { title: "Metodología editorial y de cálculo", body: ["Las fórmulas se implementan con aritmética estándar y se prueban con casos conocidos, límites y valores inválidos. Las conversiones indican sus factores y las guías distinguen recomendaciones generales de reglas institucionales.", "Revisamos periódicamente enlaces, compatibilidad móvil, accesibilidad y claridad. Una calculadora orienta, pero no sustituye el reglamento oficial de tu centro educativo."] }
  }[slug]!;
  useEffect(() => { document.title = `${data.title} | Útiles Online`; }, [data.title]);
  return <><Header /><main className="info-page"><span className="eyebrow">Útiles Online</span><h1>{data.title}</h1>{data.body.map(p => <p key={p}>{p}</p>)}<p><strong>Última actualización:</strong> 28 de julio de 2026.</p><a className="button primary" href="/">Volver al inicio</a></main><Footer /></>;
}

export default function App() {
  const slug = pathSlug();
  if (!slug) return <Home />;
  if (slug === "calculadora-de-notas") return <GradeCalculator />;
  if (slug === "nota-necesaria-para-aprobar") return <RequiredGrade />;
  if (slug === "calculadora-gpa") return <GpaCalculator />;
  if (slug === "conversor-de-calificaciones") return <GradeConverter />;
  if (slug === "calculadora-de-asistencia") return <AttendanceCalculator />;
  if (slug === "contador-de-palabras") return <WordCounter />;
  if (slug === "generador-apa") return <ApaGenerator />;
  if (slug === "generador-de-portadas") return <CoverGenerator />;
  if (slug === "limpiador-de-texto") return <TextCleaner />;
  if (slug === "temporizador-pomodoro") return <Pomodoro />;
  if (slug === "creador-de-horarios") return <ScheduleMaker />;
  if (slug === "calculadora-cientifica") return <ScientificCalculator />;
  if (slug === "conversor-de-unidades") return <UnitConverter />;
  if (slug === "planificador-de-tareas") return <TaskPlanner />;
  if (CONTENT[slug]) return <ContentPage slug={slug} />;
  if (["acerca-de", "privacidad", "contacto", "metodologia"].includes(slug)) return <InfoPage slug={slug} />;
  return <><Header /><main className="info-page not-found"><span>404</span><h1>Página no encontrada</h1><p>La dirección solicitada no existe o fue reemplazada.</p><a className="button primary" href="/">Explorar herramientas</a></main><Footer /></>;
}
