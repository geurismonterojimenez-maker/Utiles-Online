import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowRight, CheckCircle2, Clock3, Download, Plus, RotateCcw, Save, Search, Trash2, X } from "lucide-react";

export type ExtraToolCatalogItem = {
  slug: string;
  title: string;
  short: string;
  category: string;
  color: string;
};

export const EXTRA_TOOL_CATALOG: ExtraToolCatalogItem[] = [
  { slug: "calculadora-calificacion-examen", title: "Calificación de examen", short: "Convierte respuestas correctas e incorrectas en porcentaje, nota y letra.", category: "Cálculo académico", color: "violet" },
  { slug: "calculadora-promedio-semestral", title: "Promedio semestral", short: "Calcula el promedio de materias por créditos y compara periodos.", category: "Cálculo académico", color: "cyan" },
  { slug: "calculadora-gpa-acumulado", title: "GPA acumulado", short: "Combina tu GPA anterior con las materias del nuevo semestre.", category: "Cálculo académico", color: "blue" },
  { slug: "calculadora-curva-notas", title: "Curva de notas", short: "Analiza puntuaciones y crea límites de calificación configurables.", category: "Docentes", color: "orange" },
  { slug: "creador-de-rubricas", title: "Creador de rúbricas", short: "Diseña criterios, niveles de desempeño y puntuaciones imprimibles.", category: "Docentes", color: "pink" },
  { slug: "generador-de-grupos", title: "Generador de grupos", short: "Distribuye estudiantes aleatoriamente en equipos equilibrados.", category: "Docentes", color: "green" },
  { slug: "planificador-estudio-examenes", title: "Planificador para exámenes", short: "Distribuye temas y horas disponibles hasta la fecha del examen.", category: "Organización", color: "blue" },
  { slug: "tarjetas-de-estudio", title: "Tarjetas de estudio", short: "Crea y repasa tarjetas guardadas en este dispositivo.", category: "Estudio", color: "violet" },
  { slug: "calculadora-tiempo-estudio", title: "Tiempo de estudio", short: "Calcula sesiones necesarias según temas, fecha y disponibilidad.", category: "Organización", color: "cyan" },
  { slug: "verificador-legibilidad", title: "Verificador de legibilidad", short: "Analiza palabras, oraciones, párrafos y dificultad aproximada.", category: "Escritura", color: "orange" },
  { slug: "edad-academica-graduacion", title: "Año de graduación", short: "Estima edad académica y fecha de graduación según el programa.", category: "Cálculo académico", color: "pink" },
  { slug: "conversor-gpa-porcentaje", title: "GPA a porcentaje", short: "Convierte entre GPA de 4 o 5 puntos y porcentaje orientativo.", category: "Cálculo académico", color: "blue" },
  { slug: "organizador-bibliografia", title: "Organizador de bibliografía", short: "Guarda fuentes, autores, enlaces y notas de investigación.", category: "Escritura", color: "violet" },
  { slug: "ordenar-referencias", title: "Ordenar referencias", short: "Ordena una bibliografía alfabéticamente y elimina duplicados.", category: "Escritura", color: "cyan" },
  { slug: "comparador-de-textos", title: "Comparador de textos", short: "Compara dos versiones y detecta líneas añadidas o eliminadas.", category: "Escritura", color: "orange" },
  { slug: "calendario-academico", title: "Calendario académico", short: "Registra exámenes, entregas y actividades importantes.", category: "Organización", color: "pink" },
  { slug: "tabla-periodica-interactiva", title: "Tabla periódica", short: "Busca elementos y consulta número, símbolo, masa y categoría.", category: "Ciencias", color: "green" },
  { slug: "calculadora-fracciones", title: "Calculadora de fracciones", short: "Suma, resta, multiplica y divide fracciones paso a paso.", category: "Matemáticas", color: "blue" },
  { slug: "ecuaciones-lineales", title: "Ecuaciones lineales", short: "Resuelve ecuaciones de la forma ax + b = c con procedimiento.", category: "Matemáticas", color: "violet" },
  { slug: "calculadora-porcentajes", title: "Calculadora de porcentajes", short: "Calcula porcentajes, aumentos, descuentos y variaciones.", category: "Matemáticas", color: "cyan" },
  { slug: "decimal-fraccion-porcentaje", title: "Decimal, fracción y porcentaje", short: "Convierte valores entre tres representaciones equivalentes.", category: "Matemáticas", color: "orange" },
  { slug: "generador-hojas-ejercicios", title: "Generador de ejercicios", short: "Crea hojas aleatorias de operaciones con respuestas.", category: "Docentes", color: "pink" },
  { slug: "selector-estudiantes", title: "Selector de estudiantes", short: "Elige estudiantes al azar sin repetir hasta completar la lista.", category: "Docentes", color: "green" },
  { slug: "preparador-exposiciones", title: "Preparador de exposiciones", short: "Distribuye el tiempo, ensaya y controla la duración de tu presentación.", category: "Estudio", color: "blue" },
  { slug: "registro-asistencia-docentes", title: "Registro de asistencia", short: "Registra presentes y ausentes y exporta el resumen.", category: "Docentes", color: "violet" },
  { slug: "repaso-espaciado", title: "Repaso espaciado", short: "Programa automáticamente cuándo volver a estudiar cada tema.", category: "Estudio", color: "cyan" },
  { slug: "simulador-de-examenes", title: "Simulador de exámenes", short: "Crea preguntas, responde con tiempo y revisa tus errores.", category: "Estudio", color: "orange" },
  { slug: "recuperacion-activa", title: "Recuperación activa", short: "Escribe lo que recuerdas y evalúa tu dominio sin mirar apuntes.", category: "Estudio", color: "pink" },
  { slug: "planificador-proyectos-academicos", title: "Planificador de proyectos", short: "Divide tesis y trabajos largos en etapas con fechas y progreso.", category: "Organización", color: "green" },
  { slug: "organizador-de-materias", title: "Organizador de materias", short: "Reúne horarios, docentes, notas, tareas y objetivos por asignatura.", category: "Organización", color: "blue" },
  { slug: "matriz-prioridades-academicas", title: "Matriz de prioridades", short: "Clasifica pendientes por urgencia e importancia.", category: "Organización", color: "violet" },
  { slug: "rastreador-habitos-estudio", title: "Hábitos de estudio", short: "Registra sesiones, minutos y rachas semanales.", category: "Estudio", color: "cyan" },
  { slug: "mapa-conceptual", title: "Mapa conceptual", short: "Organiza un tema, conceptos y relaciones para imprimir.", category: "Estudio", color: "orange" },
  { slug: "generador-preguntas-repaso", title: "Preguntas de repaso", short: "Convierte conceptos en preguntas para practicar recuperación activa.", category: "Estudio", color: "pink" },
  { slug: "apuntes-cornell", title: "Apuntes Cornell", short: "Toma notas con pistas, contenido principal y resumen.", category: "Escritura", color: "green" },
  { slug: "registro-de-errores", title: "Registro de errores", short: "Guarda ejercicios fallidos, correcciones y fechas de repetición.", category: "Estudio", color: "blue" },
  { slug: "organizador-investigacion", title: "Organizador de investigación", short: "Reúne fuentes, citas, ideas y referencias por tema.", category: "Escritura", color: "violet" },
  { slug: "panel-academico", title: "Panel académico personal", short: "Consulta materias, tareas, hábitos, próximos eventos y progreso.", category: "Organización", color: "cyan" }
];

const findTool = (slug: string) => EXTRA_TOOL_CATALOG.find(tool => tool.slug === slug)!;
const number = (value: string | number) => Number(value) || 0;
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);
const download = (name: string, text: string) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  link.download = name; link.click(); URL.revokeObjectURL(link.href);
};

function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return initial; }
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue] as const;
}

function Shell({ slug, header, footer, children }: { slug: string; header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const tool = findTool(slug);
  const related = EXTRA_TOOL_CATALOG.filter(item => item.slug !== slug && item.category === tool.category).slice(0, 4);
  useEffect(() => {
    document.title = `${tool.title} gratis | Útiles Online`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", tool.short);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://utilesonline.com/${slug}`);
    const win = window as Window & { dataLayer?: Record<string, unknown>[] };
    win.dataLayer = win.dataLayer || []; win.dataLayer.push({ event: "view_tool", tool: slug, category: tool.category });
  }, [slug, tool]);
  return <>{header}<main className="extra-tool-page"><nav className="breadcrumbs"><a href="/">Inicio</a><span>/</span><a href="/#herramientas">Herramientas</a><span>/</span><span>{tool.title}</span></nav><header className={`extra-tool-hero ${tool.color}`}><span>{tool.category}</span><h1>{tool.title}</h1><p>{tool.short}</p></header><section className="extra-workspace">{children}</section><aside className="ad-space" aria-label="Publicidad"><span>Publicidad</span><div className="ad-placeholder">Espacio publicitario</div></aside><section className="extra-guide"><h2>Cómo utilizar esta herramienta</h2><p>Introduce datos reales, revisa el resultado y guarda o exporta la información cuando sea necesario. Todo se procesa en tu navegador; confirma siempre las reglas particulares de tu institución.</p><h2>Recomendación</h2><p>Usa el resultado como apoyo para planificar y comprender el método, no como sustituto de una evaluación o reglamento oficial.</p></section>{related.length > 0 && <section className="extra-related"><h2>Más herramientas de {tool.category.toLowerCase()}</h2><div>{related.map(item => <a href={`/${item.slug}`} key={item.slug}><strong>{item.title}</strong><span>{item.short}</span><ArrowRight /></a>)}</div></section>}</main>{footer}</>;
}

function Result({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <aside className="extra-result"><span>{label}</span><strong>{value}</strong><p><CheckCircle2 /> {detail}</p></aside>;
}

function ExamGrade() {
  const [total, setTotal] = useState(50); const [correct, setCorrect] = useState(42); const [penalty, setPenalty] = useState(0); const [pass, setPass] = useState(70);
  const score = total ? Math.max(0, (correct - (total - correct) * penalty) / total * 100) : 0;
  const letter = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
  return <><div className="extra-form"><label>Total de preguntas<input type="number" min="1" value={total} onChange={e => setTotal(number(e.target.value))} /></label><label>Respuestas correctas<input type="number" min="0" max={total} value={correct} onChange={e => setCorrect(number(e.target.value))} /></label><label>Penalización por error<select value={penalty} onChange={e => setPenalty(number(e.target.value))}><option value="0">Sin penalización</option><option value=".25">0.25 puntos</option><option value=".5">0.50 puntos</option><option value="1">1 punto</option></select></label><label>Nota mínima<input type="number" value={pass} onChange={e => setPass(number(e.target.value))} /></label></div><Result label="Calificación" value={`${score.toFixed(1)}% · ${letter}`} detail={score >= pass ? "Resultado aprobatorio." : "Resultado por debajo de la meta."} /></>;
}

function SemesterAverage({ cumulative = false }: { cumulative?: boolean }) {
  const [previousGpa, setPreviousGpa] = useState(3.2); const [previousCredits, setPreviousCredits] = useState(45);
  const [rows, setRows] = useState([{ name: "Matemáticas", grade: 90, credits: 3 }, { name: "Lengua", grade: 84, credits: 3 }]);
  const credits = rows.reduce((sum, row) => sum + number(row.credits), 0);
  const average = credits ? rows.reduce((sum, row) => sum + number(row.grade) * number(row.credits), 0) / credits : 0;
  const semesterGpa = Math.min(4, average / 25);
  const final = cumulative && previousCredits + credits ? (previousGpa * previousCredits + semesterGpa * credits) / (previousCredits + credits) : average;
  const update = (index: number, field: string, value: string) => setRows(rows.map((row, i) => i === index ? { ...row, [field]: field === "name" ? value : number(value) } : row));
  return <>{cumulative && <div className="extra-form compact"><label>GPA anterior<input type="number" step=".01" value={previousGpa} onChange={e => setPreviousGpa(number(e.target.value))} /></label><label>Créditos anteriores<input type="number" value={previousCredits} onChange={e => setPreviousCredits(number(e.target.value))} /></label></div>}<div className="extra-list-editor">{rows.map((row, index) => <div key={index}><input aria-label={`Materia ${index + 1}`} value={row.name} onChange={e => update(index, "name", e.target.value)} /><input aria-label={`Nota ${index + 1}`} type="number" value={row.grade} onChange={e => update(index, "grade", e.target.value)} /><input aria-label={`Créditos ${index + 1}`} type="number" value={row.credits} onChange={e => update(index, "credits", e.target.value)} /><button onClick={() => setRows(rows.filter((_, i) => i !== index))}><X /></button></div>)}<button onClick={() => setRows([...rows, { name: "Nueva materia", grade: 0, credits: 3 }])}><Plus /> Añadir materia</button></div><Result label={cumulative ? "GPA acumulado estimado" : "Promedio del semestre"} value={final.toFixed(2)} detail={`${credits} créditos incluidos.`} /></>;
}

function CurveCalculator() {
  const [scores, setScores] = useState("78, 92, 65, 88, 73, 95, 81, 69"); const values = scores.split(/[\s,;]+/).map(number).filter(value => value >= 0);
  const mean = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0; const sorted = [...values].sort((a, b) => a - b); const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
  return <><div className="extra-text-panel"><label>Puntuaciones<textarea value={scores} onChange={e => setScores(e.target.value)} placeholder="78, 92, 65…" /></label></div><div className="metric-grid"><div><strong>{mean.toFixed(1)}</strong><span>Media</span></div><div><strong>{median}</strong><span>Mediana</span></div><div><strong>{values.length ? Math.min(...values) : 0}</strong><span>Mínima</span></div><div><strong>{values.length ? Math.max(...values) : 0}</strong><span>Máxima</span></div></div><div className="distribution">{[["A", 90], ["B", 80], ["C", 70], ["D", 60], ["F", 0]].map(([letter, minimum]) => <div key={letter}><strong>{letter}</strong><span>{values.filter(value => value >= Number(minimum) && (letter === "A" || value < Number(minimum) + 10)).length} estudiantes</span></div>)}</div></>;
}

function RubricBuilder() {
  const [title, setTitle] = useState("Rúbrica de exposición"); const [criteria, setCriteria] = useStored("uo-rubric", [{ name: "Contenido", weight: 40 }, { name: "Claridad", weight: 30 }, { name: "Presentación", weight: 30 }]);
  return <><div className="extra-form compact"><label>Título<input value={title} onChange={e => setTitle(e.target.value)} /></label></div><div className="rubric-table"><h2>{title}</h2><div><strong>Criterio</strong><strong>Excelente</strong><strong>Competente</strong><strong>En proceso</strong><strong>Peso</strong></div>{criteria.map((criterion, index) => <div key={index}><input value={criterion.name} onChange={e => setCriteria(criteria.map((item, i) => i === index ? { ...item, name: e.target.value } : item))} /><span>4</span><span>3</span><span>1–2</span><input type="number" value={criterion.weight} onChange={e => setCriteria(criteria.map((item, i) => i === index ? { ...item, weight: number(e.target.value) } : item))} /></div>)}</div><div className="extra-actions"><button onClick={() => setCriteria([...criteria, { name: "Nuevo criterio", weight: 0 }])}><Plus /> Criterio</button><button onClick={() => window.print()}><Download /> Guardar PDF</button></div></>;
}

function GroupGenerator({ selector = false }: { selector?: boolean }) {
  const [text, setText] = useState("Ana\nCarlos\nMaría\nLuis\nSofía\nJosé"); const [size, setSize] = useState(3); const [groups, setGroups] = useState<string[][]>([]); const [remaining, setRemaining] = useState<string[]>([]);
  const names = text.split(/\r?\n/).map(name => name.trim()).filter(Boolean);
  const randomize = () => {
    const shuffled = [...names].sort(() => Math.random() - .5);
    if (selector) { const pool = remaining.length ? [...remaining] : shuffled; setGroups([[pool.shift() || ""]]); setRemaining(pool); }
    else setGroups(Array.from({ length: Math.ceil(shuffled.length / size) }, (_, i) => shuffled.filter((_, index) => index % Math.ceil(shuffled.length / size) === i)));
  };
  return <><div className="extra-text-panel"><label>Una persona por línea<textarea value={text} onChange={e => { setText(e.target.value); setRemaining([]); }} /></label>{!selector && <label>Personas por grupo<input type="number" min="1" value={size} onChange={e => setSize(number(e.target.value))} /></label>}<button className="primary-action" onClick={randomize}>{selector ? "Elegir estudiante" : "Crear grupos"}</button></div><div className="group-grid">{groups.map((group, index) => <article key={index}><strong>{selector ? "Seleccionado" : `Grupo ${index + 1}`}</strong>{group.map(name => <span key={name}>{name}</span>)}</article>)}</div>{selector && <p>{remaining.length} estudiantes pendientes antes de reiniciar la ronda.</p>}</>;
}

function StudyPlanner({ timeOnly = false }: { timeOnly?: boolean }) {
  const [topics, setTopics] = useState("Tema 1\nTema 2\nTema 3\nTema 4"); const [date, setDate] = useState(() => new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)); const [hours, setHours] = useState(2);
  const days = Math.max(1, Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)); const list = topics.split(/\r?\n/).filter(Boolean); const totalHours = days * hours; const perTopic = list.length ? totalHours / list.length : 0;
  return <><div className="extra-form"><label>Fecha del examen<input type="date" value={date} onChange={e => setDate(e.target.value)} /></label><label>Horas disponibles por día<input type="number" step=".5" min=".5" value={hours} onChange={e => setHours(number(e.target.value))} /></label>{!timeOnly && <label className="wide">Temas, uno por línea<textarea value={topics} onChange={e => setTopics(e.target.value)} /></label>}</div><Result label="Tiempo disponible" value={`${totalHours.toFixed(1)} horas`} detail={`${days} días · ${perTopic.toFixed(1)} horas por tema.`} />{!timeOnly && <div className="study-plan">{Array.from({ length: days }, (_, index) => <article key={index}><strong>Día {index + 1}</strong><span>{list[index % Math.max(1, list.length)] || "Repaso general"}</span><small>{hours} h · {index % 3 === 2 ? "Repaso y práctica" : "Estudio activo"}</small></article>)}</div>}</>;
}

function Flashcards({ spaced = false }: { spaced?: boolean }) {
  const [cards, setCards] = useStored("uo-flashcards", [{ question: "¿Qué es la fotosíntesis?", answer: "Proceso por el cual las plantas convierten luz en energía.", level: 0, due: new Date().toISOString().slice(0, 10) }]);
  const [question, setQuestion] = useState(""); const [answer, setAnswer] = useState(""); const [index, setIndex] = useState(0); const [revealed, setRevealed] = useState(false);
  const dueCards = spaced ? cards.filter(card => card.due <= new Date().toISOString().slice(0, 10)) : cards; const card = dueCards[index % Math.max(1, dueCards.length)];
  const rate = (remembered: boolean) => {
    if (!card) return; const intervals = remembered ? [1, 3, 7, 14, 30] : [0, 1, 2, 4, 7]; const level = remembered ? Math.min(4, card.level + 1) : Math.max(0, card.level - 1); const due = new Date(Date.now() + intervals[level] * 86400000).toISOString().slice(0, 10);
    setCards(cards.map(item => item === card ? { ...item, level, due } : item)); setIndex(index + 1); setRevealed(false);
  };
  return <><div className="flashcard-form"><input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Pregunta" /><input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Respuesta" /><button onClick={() => { if (question && answer) { setCards([...cards, { question, answer, level: 0, due: new Date().toISOString().slice(0, 10) }]); setQuestion(""); setAnswer(""); } }}><Plus /> Añadir</button></div>{card ? <article className="flashcard" onClick={() => setRevealed(!revealed)}><span>{spaced ? `Repaso programado · ${card.due}` : `Tarjeta ${index % dueCards.length + 1} de ${dueCards.length}`}</span><h2>{revealed ? card.answer : card.question}</h2><p>{revealed ? "Evalúa cuánto recordaste." : "Pulsa para mostrar la respuesta."}</p>{revealed && <div><button onClick={event => { event.stopPropagation(); rate(false); }}>Debo repasar</button><button onClick={event => { event.stopPropagation(); rate(true); }}>Lo recordé</button></div>}</article> : <p>No hay tarjetas pendientes para hoy.</p>}<div className="extra-actions"><button onClick={() => setIndex(index + 1)}><ArrowRight /> Siguiente</button><button onClick={() => setCards([])}><Trash2 /> Vaciar</button></div></>;
}

function TextAnalyzer({ mode }: { mode: "readability" | "sort" | "compare" | "questions" }) {
  const [first, setFirst] = useState(""); const [second, setSecond] = useState("");
  const words = first.trim() ? first.trim().split(/\s+/) : []; const sentences = first.match(/[.!?]+/g)?.length || (first ? 1 : 0); const paragraphs = first.split(/\n\s*\n/).filter(Boolean).length;
  const sorted = Array.from(new Set(first.split(/\r?\n/).map(line => line.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, "es")).join("\n");
  const firstLines = first.split(/\r?\n/); const secondLines = second.split(/\r?\n/); const added = secondLines.filter(line => !firstLines.includes(line)); const removed = firstLines.filter(line => !secondLines.includes(line));
  const concepts = first.split(/[,;\n]+/).map(item => item.trim()).filter(Boolean);
  return <><div className={`text-comparison ${mode === "compare" ? "" : "single"}`}><textarea value={first} onChange={e => setFirst(e.target.value)} placeholder={mode === "questions" ? "Escribe conceptos separados por comas o líneas…" : "Escribe o pega el texto…"} />{mode === "compare" && <textarea value={second} onChange={e => setSecond(e.target.value)} placeholder="Segunda versión…" />}</div>{mode === "readability" && <><div className="metric-grid"><div><strong>{words.length}</strong><span>Palabras</span></div><div><strong>{sentences}</strong><span>Oraciones</span></div><div><strong>{paragraphs}</strong><span>Párrafos</span></div><div><strong>{sentences ? (words.length / sentences).toFixed(1) : 0}</strong><span>Palabras/oración</span></div></div><Result label="Dificultad aproximada" value={sentences && words.length / sentences > 24 ? "Alta" : sentences && words.length / sentences > 16 ? "Media" : "Clara"} detail="Una oración más corta suele ser más fácil de comprender." /></>}{mode === "sort" && <div className="output-box"><h2>Referencias ordenadas</h2><pre>{sorted || "El resultado aparecerá aquí."}</pre><button onClick={() => navigator.clipboard.writeText(sorted)}>Copiar</button></div>}{mode === "compare" && <div className="diff-grid"><article><h3>Añadido</h3>{added.map(line => <p key={line}>+ {line}</p>)}</article><article><h3>Eliminado</h3>{removed.map(line => <p key={line}>− {line}</p>)}</article></div>}{mode === "questions" && <div className="question-list">{concepts.flatMap(concept => [`¿Qué es ${concept}?`, `¿Cómo se aplica ${concept}?`, `¿Cuál es un ejemplo de ${concept}?`]).map(question => <p key={question}>{question}</p>)}</div>}</>;
}

function SimpleCalculator({ mode }: { mode: "graduation" | "gpa" | "fraction" | "equation" | "percentage" | "convert" }) {
  const [a, setA] = useState(mode === "graduation" ? new Date().getFullYear() : 3); const [b, setB] = useState(4); const [c, setC] = useState(12); const [operation, setOperation] = useState("+");
  let value = ""; let detail = "";
  if (mode === "graduation") { value = String(a + b); detail = `Graduación estimada tras ${b} años de programa desde ${a}.`; }
  if (mode === "gpa") { value = `${Math.min(100, a / b * 100).toFixed(1)}%`; detail = `Conversión proporcional desde una escala máxima de ${b}.`; }
  if (mode === "equation") { value = a ? ((c - b) / a).toString() : "No definido"; detail = `${a}x + ${b} = ${c}; se resta ${b} y se divide entre ${a}.`; }
  if (mode === "percentage") { value = `${(a / 100 * b).toFixed(2)}`; detail = `${a}% de ${b}. Variación frente a ${b}: ${((c - b) / (b || 1) * 100).toFixed(1)}%.`; }
  if (mode === "convert") { const divisor = Math.pow(10, String(a).split(".")[1]?.length || 0); const numerator = Math.round(a * divisor); const common = gcd(numerator, divisor); value = `${numerator / common}/${divisor / common}`; detail = `${a} equivale a ${(a * 100).toFixed(2)}%.`; }
  if (mode === "fraction") { const [n1, d1, n2, d2] = [a, b || 1, c, 5]; const denominator = d1 * d2; const numerator = operation === "+" ? n1 * d2 + n2 * d1 : operation === "-" ? n1 * d2 - n2 * d1 : operation === "×" ? n1 * n2 : n1 * d2; const finalDenominator = operation === "÷" ? d1 * n2 : denominator; const common = gcd(numerator, finalDenominator); value = `${numerator / common}/${finalDenominator / common}`; detail = `${n1}/${d1} ${operation} ${n2}/${d2}.`; }
  return <><div className="extra-form">{mode === "graduation" ? <><label>Año de inicio<input type="number" value={a} onChange={e => setA(number(e.target.value))} /></label><label>Duración en años<input type="number" value={b} onChange={e => setB(number(e.target.value))} /></label></> : <><label>{mode === "equation" ? "Coeficiente a" : "Valor A"}<input type="number" step=".01" value={a} onChange={e => setA(number(e.target.value))} /></label><label>{mode === "equation" ? "Constante b" : "Valor B"}<input type="number" step=".01" value={b} onChange={e => setB(number(e.target.value))} /></label>{["equation", "percentage", "fraction"].includes(mode) && <label>Valor C<input type="number" step=".01" value={c} onChange={e => setC(number(e.target.value))} /></label>}{mode === "fraction" && <label>Operación<select value={operation} onChange={e => setOperation(e.target.value)}><option>+</option><option>-</option><option>×</option><option>÷</option></select></label>}</>}</div><Result label="Resultado" value={value} detail={detail} /></>;
}

function PeriodicTable() {
  const elements = [
    ["H", "Hidrógeno", 1, "1.008", "No metal"], ["He", "Helio", 2, "4.003", "Gas noble"], ["Li", "Litio", 3, "6.94", "Alcalino"], ["C", "Carbono", 6, "12.011", "No metal"], ["N", "Nitrógeno", 7, "14.007", "No metal"], ["O", "Oxígeno", 8, "15.999", "No metal"], ["Na", "Sodio", 11, "22.990", "Alcalino"], ["Mg", "Magnesio", 12, "24.305", "Alcalinotérreo"], ["Al", "Aluminio", 13, "26.982", "Metal"], ["Si", "Silicio", 14, "28.085", "Metaloide"], ["Cl", "Cloro", 17, "35.45", "Halógeno"], ["K", "Potasio", 19, "39.098", "Alcalino"], ["Ca", "Calcio", 20, "40.078", "Alcalinotérreo"], ["Fe", "Hierro", 26, "55.845", "Metal"], ["Cu", "Cobre", 29, "63.546", "Metal"], ["Zn", "Zinc", 30, "65.38", "Metal"], ["Ag", "Plata", 47, "107.868", "Metal"], ["Au", "Oro", 79, "196.967", "Metal"]
  ] as const;
  const [query, setQuery] = useState(""); const filtered = elements.filter(item => `${item[0]} ${item[1]} ${item[2]}`.toLowerCase().includes(query.toLowerCase()));
  return <><label className="element-search"><Search /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nombre, símbolo o número…" /></label><div className="element-grid">{filtered.map(([symbol, name, atomic, mass, category]) => <article key={symbol}><small>{atomic}</small><strong>{symbol}</strong><span>{name}</span><em>{mass} · {category}</em></article>)}</div></>;
}

type BasicItem = { title: string; detail: string; date: string; done: boolean; quadrant?: string };
function LocalOrganizer({ slug }: { slug: string }) {
  const tool = findTool(slug); const [items, setItems] = useStored<BasicItem[]>(`uo-${slug}`, []); const [title, setTitle] = useState(""); const [detail, setDetail] = useState(""); const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); const [quadrant, setQuadrant] = useState("importante-urgente");
  const labels: Record<string, [string, string]> = {
    "calendario-academico": ["Evento o entrega", "Materia o ubicación"], "organizador-bibliografia": ["Autor y título", "URL o nota"], "organizador-investigacion": ["Fuente o idea", "Cita, enlace o comentario"], "planificador-proyectos-academicos": ["Etapa o tarea", "Descripción"], "organizador-de-materias": ["Materia", "Docente, aula u objetivo"], "registro-de-errores": ["Ejercicio o tema", "Error y procedimiento correcto"], "mapa-conceptual": ["Concepto", "Relación o explicación"]
  };
  const [titleLabel, detailLabel] = labels[slug] || ["Tarea", "Descripción"];
  const add = () => { if (title.trim()) { setItems([...items, { title: title.trim(), detail: detail.trim(), date, done: false, quadrant }]); setTitle(""); setDetail(""); } };
  return <><div className="organizer-form"><input value={title} onChange={e => setTitle(e.target.value)} placeholder={titleLabel} /><input value={detail} onChange={e => setDetail(e.target.value)} placeholder={detailLabel} /><input type="date" value={date} onChange={e => setDate(e.target.value)} />{slug === "matriz-prioridades-academicas" && <select value={quadrant} onChange={e => setQuadrant(e.target.value)}><option value="importante-urgente">Importante y urgente</option><option value="importante">Importante</option><option value="urgente">Urgente</option><option value="puede-esperar">Puede esperar</option></select>}<button onClick={add}><Plus /> Añadir</button></div><div className={`organizer-board ${slug === "mapa-conceptual" ? "concept-map" : ""}`}>{items.length === 0 && <p>Aún no hay elementos guardados.</p>}{items.map((item, index) => <article key={`${item.title}-${index}`} className={item.done ? "done" : ""}><button onClick={() => setItems(items.map((current, i) => i === index ? { ...current, done: !current.done } : current))}><CheckCircle2 /></button><div><strong>{item.title}</strong><span>{item.detail}</span><small>{item.quadrant || item.date}</small></div><button onClick={() => setItems(items.filter((_, i) => i !== index))}><Trash2 /></button></article>)}</div><div className="extra-actions"><button onClick={() => download(`${slug}.csv`, `Título,Detalle,Fecha\n${items.map(item => `"${item.title}","${item.detail}",${item.date}`).join("\n")}`)}><Download /> Exportar</button></div></>;
}

function AttendanceRegister() {
  const [students, setStudents] = useStored("uo-attendance-register", [{ name: "Ana", present: true }, { name: "Carlos", present: false }]); const [name, setName] = useState("");
  const present = students.filter(student => student.present).length;
  return <><div className="inline-add"><input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del estudiante" /><button onClick={() => { if (name.trim()) { setStudents([...students, { name: name.trim(), present: true }]); setName(""); } }}><Plus /> Añadir</button></div><div className="attendance-list">{students.map((student, index) => <label key={`${student.name}-${index}`}><input type="checkbox" checked={student.present} onChange={e => setStudents(students.map((item, i) => i === index ? { ...item, present: e.target.checked } : item))} /><span>{student.name}</span><button onClick={event => { event.preventDefault(); setStudents(students.filter((_, i) => i !== index)); }}><X /></button></label>)}</div><Result label="Asistencia registrada" value={`${present}/${students.length}`} detail={`${students.length ? present / students.length * 100 : 0}% presentes.`} /></>;
}

function WorksheetGenerator() {
  const [count, setCount] = useState(12); const [maximum, setMaximum] = useState(20); const [operation, setOperation] = useState("+"); const [seed, setSeed] = useState(1);
  const exercises = useMemo(() => Array.from({ length: count }, (_, index) => { const a = (index * 7 + seed * 3) % maximum + 1; const b = (index * 5 + seed * 2) % maximum + 1; const answer = operation === "+" ? a + b : operation === "-" ? a - b : operation === "×" ? a * b : Number((a / b).toFixed(2)); return { a, b, answer }; }), [count, maximum, operation, seed]);
  return <><div className="extra-form compact"><label>Cantidad<input type="number" min="4" max="40" value={count} onChange={e => setCount(number(e.target.value))} /></label><label>Número máximo<input type="number" min="5" value={maximum} onChange={e => setMaximum(number(e.target.value))} /></label><label>Operación<select value={operation} onChange={e => setOperation(e.target.value)}><option>+</option><option>-</option><option>×</option><option>÷</option></select></label></div><div className="worksheet">{exercises.map((exercise, index) => <div key={index}><strong>{index + 1}. {exercise.a} {operation} {exercise.b} = _____</strong><small>Respuesta: {exercise.answer}</small></div>)}</div><div className="extra-actions"><button onClick={() => setSeed(seed + 1)}><RotateCcw /> Nueva hoja</button><button onClick={() => window.print()}><Download /> Imprimir</button></div></>;
}

function PresentationTimer() {
  const [minutes, setMinutes] = useState(10); const [seconds, setSeconds] = useState(10 * 60); const [running, setRunning] = useState(false); const [sections, setSections] = useState(4);
  useEffect(() => { if (!running) return; const timer = setInterval(() => setSeconds(value => Math.max(0, value - 1)), 1000); return () => clearInterval(timer); }, [running]);
  const reset = () => { setRunning(false); setSeconds(minutes * 60); };
  return <><div className="extra-form compact"><label>Duración total<input type="number" value={minutes} onChange={e => { setMinutes(number(e.target.value)); setSeconds(number(e.target.value) * 60); }} /></label><label>Secciones<input type="number" min="1" value={sections} onChange={e => setSections(number(e.target.value))} /></label></div><div className="presentation-timer"><strong>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</strong><p>{(minutes / sections).toFixed(1)} minutos recomendados por sección.</p><div><button onClick={() => setRunning(!running)}>{running ? "Pausar" : "Comenzar"}</button><button onClick={reset}>Reiniciar</button></div></div></>;
}

function ExamSimulator() {
  const [questions, setQuestions] = useStored("uo-exam-questions", [{ prompt: "¿Cuál es la capital de República Dominicana?", answer: "Santo Domingo" }]); const [prompt, setPrompt] = useState(""); const [answer, setAnswer] = useState(""); const [responses, setResponses] = useState<Record<number, string>>({}); const [finished, setFinished] = useState(false);
  const score = questions.filter((question, index) => responses[index]?.trim().toLowerCase() === question.answer.trim().toLowerCase()).length;
  return <><div className="flashcard-form"><input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Pregunta" /><input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Respuesta correcta" /><button onClick={() => { if (prompt && answer) { setQuestions([...questions, { prompt, answer }]); setPrompt(""); setAnswer(""); } }}><Plus /> Añadir</button></div><div className="exam-sheet">{questions.map((question, index) => <label key={index}><strong>{index + 1}. {question.prompt}</strong><input value={responses[index] || ""} disabled={finished} onChange={e => setResponses({ ...responses, [index]: e.target.value })} />{finished && <small>{responses[index]?.trim().toLowerCase() === question.answer.toLowerCase() ? "Correcto" : `Respuesta: ${question.answer}`}</small>}</label>)}</div><button className="primary-action" onClick={() => setFinished(!finished)}>{finished ? "Volver a intentar" : "Finalizar examen"}</button>{finished && <Result label="Resultado" value={`${score}/${questions.length}`} detail={`${questions.length ? score / questions.length * 100 : 0}% correcto.`} />}</>;
}

function ActiveRecall() {
  const [topic, setTopic] = useState(""); const [memory, setMemory] = useState(""); const [source, setSource] = useState(""); const [revealed, setRevealed] = useState(false); const [rating, setRating] = useState("");
  return <><div className="recall-layout"><label>Tema<input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Tema que deseas recordar" /></label><label>Escribe todo lo que recuerdes<textarea value={memory} onChange={e => setMemory(e.target.value)} /></label><label>Contenido original<textarea value={source} onChange={e => setSource(e.target.value)} /></label><button onClick={() => setRevealed(true)}>Comparar respuestas</button></div>{revealed && <div className="recall-review"><div><h3>Lo que recordaste</h3><p>{memory}</p></div><div><h3>Contenido original</h3><p>{source}</p></div><label>¿Cómo fue tu dominio?<select value={rating} onChange={e => setRating(e.target.value)}><option value="">Selecciona</option><option>Lo recordé</option><option>Parcialmente</option><option>Debo repasarlo</option><option>No lo entendí</option></select></label></div>}</>;
}

function HabitTracker() {
  const [sessions, setSessions] = useStored<{ date: string; subject: string; minutes: number }[]>("uo-study-habits", []); const [subject, setSubject] = useState(""); const [minutes, setMinutes] = useState(25);
  const today = new Date().toISOString().slice(0, 10); const total = sessions.reduce((sum, session) => sum + session.minutes, 0); const days = new Set(sessions.map(session => session.date)).size;
  return <><div className="inline-add"><input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Materia o actividad" /><input type="number" value={minutes} onChange={e => setMinutes(number(e.target.value))} /><button onClick={() => { if (subject.trim()) { setSessions([...sessions, { date: today, subject: subject.trim(), minutes }]); setSubject(""); } }}><Plus /> Registrar</button></div><div className="metric-grid"><div><strong>{sessions.length}</strong><span>Sesiones</span></div><div><strong>{total}</strong><span>Minutos</span></div><div><strong>{days}</strong><span>Días activos</span></div><div><strong>{Math.round(total / 25)}</strong><span>Pomodoros</span></div></div><div className="habit-list">{sessions.slice().reverse().map((session, index) => <p key={index}><strong>{session.subject}</strong><span>{session.date} · {session.minutes} min</span></p>)}</div></>;
}

function CornellNotes() {
  const [notes, setNotes] = useStored("uo-cornell-notes", { title: "", cues: "", body: "", summary: "" });
  return <div className="cornell"><input value={notes.title} onChange={e => setNotes({ ...notes, title: e.target.value })} placeholder="Tema de los apuntes" /><div><textarea value={notes.cues} onChange={e => setNotes({ ...notes, cues: e.target.value })} placeholder="Preguntas y palabras clave" /><textarea value={notes.body} onChange={e => setNotes({ ...notes, body: e.target.value })} placeholder="Notas principales" /></div><textarea value={notes.summary} onChange={e => setNotes({ ...notes, summary: e.target.value })} placeholder="Resumen en tus propias palabras" /><button onClick={() => window.print()}><Download /> Imprimir o guardar PDF</button></div>;
}

function AcademicDashboard() {
  const tasks: BasicItem[] = JSON.parse(localStorage.getItem("uo-planificador-proyectos-academicos") || "[]"); const subjects: BasicItem[] = JSON.parse(localStorage.getItem("uo-organizador-de-materias") || "[]"); const sessions: { minutes: number }[] = JSON.parse(localStorage.getItem("uo-study-habits") || "[]"); const events: BasicItem[] = JSON.parse(localStorage.getItem("uo-calendario-academico") || "[]");
  const pending = tasks.filter(task => !task.done); const minutes = sessions.reduce((sum, session) => sum + session.minutes, 0);
  return <><div className="dashboard-grid"><article><span>Materias</span><strong>{subjects.length}</strong><a href="/organizador-de-materias">Administrar <ArrowRight /></a></article><article><span>Tareas pendientes</span><strong>{pending.length}</strong><a href="/planificador-proyectos-academicos">Ver proyectos <ArrowRight /></a></article><article><span>Minutos estudiados</span><strong>{minutes}</strong><a href="/rastreador-habitos-estudio">Ver hábitos <ArrowRight /></a></article><article><span>Próximos eventos</span><strong>{events.filter(event => event.date >= new Date().toISOString().slice(0, 10)).length}</strong><a href="/calendario-academico">Ver calendario <ArrowRight /></a></article></div><section className="dashboard-next"><h2>Próximas tareas</h2>{pending.slice(0, 5).map(task => <p key={task.title}><strong>{task.title}</strong><span>{task.date}</span></p>)}{!pending.length && <p>No tienes tareas pendientes registradas.</p>}</section></>;
}

function ResearchNotes({ bibliography = false }: { bibliography?: boolean }) {
  return <LocalOrganizer slug={bibliography ? "organizador-bibliografia" : "organizador-investigacion"} />;
}

export function StudyToolPage({ slug, header, footer }: { slug: string; header: ReactNode; footer: ReactNode }) {
  let content: ReactNode;
  if (slug === "calculadora-calificacion-examen") content = <ExamGrade />;
  else if (slug === "calculadora-promedio-semestral") content = <SemesterAverage />;
  else if (slug === "calculadora-gpa-acumulado") content = <SemesterAverage cumulative />;
  else if (slug === "calculadora-curva-notas") content = <CurveCalculator />;
  else if (slug === "creador-de-rubricas") content = <RubricBuilder />;
  else if (slug === "generador-de-grupos") content = <GroupGenerator />;
  else if (slug === "selector-estudiantes") content = <GroupGenerator selector />;
  else if (slug === "planificador-estudio-examenes") content = <StudyPlanner />;
  else if (slug === "calculadora-tiempo-estudio") content = <StudyPlanner timeOnly />;
  else if (slug === "tarjetas-de-estudio") content = <Flashcards />;
  else if (slug === "repaso-espaciado") content = <Flashcards spaced />;
  else if (slug === "verificador-legibilidad") content = <TextAnalyzer mode="readability" />;
  else if (slug === "ordenar-referencias") content = <TextAnalyzer mode="sort" />;
  else if (slug === "comparador-de-textos") content = <TextAnalyzer mode="compare" />;
  else if (slug === "generador-preguntas-repaso") content = <TextAnalyzer mode="questions" />;
  else if (slug === "edad-academica-graduacion") content = <SimpleCalculator mode="graduation" />;
  else if (slug === "conversor-gpa-porcentaje") content = <SimpleCalculator mode="gpa" />;
  else if (slug === "calculadora-fracciones") content = <SimpleCalculator mode="fraction" />;
  else if (slug === "ecuaciones-lineales") content = <SimpleCalculator mode="equation" />;
  else if (slug === "calculadora-porcentajes") content = <SimpleCalculator mode="percentage" />;
  else if (slug === "decimal-fraccion-porcentaje") content = <SimpleCalculator mode="convert" />;
  else if (slug === "tabla-periodica-interactiva") content = <PeriodicTable />;
  else if (["calendario-academico", "planificador-proyectos-academicos", "organizador-de-materias", "matriz-prioridades-academicas", "mapa-conceptual", "registro-de-errores"].includes(slug)) content = <LocalOrganizer slug={slug} />;
  else if (slug === "organizador-bibliografia") content = <ResearchNotes bibliography />;
  else if (slug === "organizador-investigacion") content = <ResearchNotes />;
  else if (slug === "registro-asistencia-docentes") content = <AttendanceRegister />;
  else if (slug === "generador-hojas-ejercicios") content = <WorksheetGenerator />;
  else if (slug === "preparador-exposiciones") content = <PresentationTimer />;
  else if (slug === "simulador-de-examenes") content = <ExamSimulator />;
  else if (slug === "recuperacion-activa") content = <ActiveRecall />;
  else if (slug === "rastreador-habitos-estudio") content = <HabitTracker />;
  else if (slug === "apuntes-cornell") content = <CornellNotes />;
  else if (slug === "panel-academico") content = <AcademicDashboard />;
  else content = <p>Herramienta no disponible.</p>;
  return <Shell slug={slug} header={header} footer={footer}>{content}</Shell>;
}
