import React, { useState, useEffect } from 'react';
import { 
  Search, BookOpen, MapPin, GraduationCap, 
  Calendar, ChevronRight, Copy, Check, CheckSquare, 
  Square, ShoppingBag, ExternalLink, RefreshCw, Bookmark
} from 'lucide-react';
import { SchoolList, SchoolItem } from '../types';

interface NationalLibraryProps {
  onSelectSchoolList?: (list: SchoolList) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function NationalLibrary({ onSelectSchoolList, showToast }: NationalLibraryProps) {
  const [lists, setLists] = useState<SchoolList[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search Filters State
  const [schoolQuery, setSchoolQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('2026-2027');

  // Selected List for Quick Detail Checkbox view
  const [activeDetailList, setActiveDetailList] = useState<SchoolList | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const fetchLists = async () => {
    setLoading(true);
    try {
      // Fetch dynamic search or general GET
      const url = `/api/lists/search?schoolQuery=${encodeURIComponent(schoolQuery)}&city=${encodeURIComponent(cityFilter)}&grade=${encodeURIComponent(levelFilter)}&academicYear=${encodeURIComponent(yearFilter)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLists(data.lists || []);
      }
    } catch (err) {
      console.error('Error fetching school lists:', err);
      showToast('No se pudieron cargar las listas escolares.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolsMetadata = async () => {
    try {
      const res = await fetch('/api/lists');
      if (res.ok) {
        const data = await res.json();
        setSchools(data.schools || []);
      }
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  };

  useEffect(() => {
    fetchSchoolsMetadata();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLists();
    }, 300); // Debounce search changes
    return () => clearTimeout(timer);
  }, [schoolQuery, cityFilter, levelFilter, yearFilter]);

  const toggleItemCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleCopyLink = (schoolSlug: string, gradeSlug: string) => {
    const fullUrl = `${window.location.origin}/lista-utiles/${schoolSlug}/${gradeSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(`${schoolSlug}-${gradeSlug}`);
    showToast('¡Enlace SEO copiado al portapapeles!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const renderDetailChecklist = (list: SchoolList) => {
    const schoolSlug = toSlug(list.schoolName);
    const gradeSlug = toSlug(list.grade) + "-2026";
    const seoPath = `/lista-utiles/${schoolSlug}/${gradeSlug}`;
    
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col gap-4 animate-fadeIn">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-105 font-black px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              Vista Rápida de Utilería
            </span>
            <h4 className="text-sm font-black text-slate-850 mt-1 select-text">
              {list.schoolName} - <span className="text-slate-500 font-bold">{list.grade}</span>
            </h4>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleCopyLink(schoolSlug, gradeSlug)}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copiedId === `${schoolSlug}-${gradeSlug}` ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar Enlace SEO
                </>
              )}
            </button>
            <a
              href={seoPath}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-3.5 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver Página SEO
            </a>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-200 select-none">
                <th className="py-2.5 px-4 w-12 text-center">Hecho</th>
                <th className="py-2.5 px-2 w-16 text-center font-mono">Cant</th>
                <th className="py-2.5 px-3">Artículo / Producto Recomendado</th>
                <th className="py-2.5 px-3">Estado de Enlace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 select-text">
              {list.items.map((item, idx) => {
                const uniqueKey = `${list.id}-${idx}`;
                const isChecked = checkedItems[uniqueKey] || false;
                const isSuggested = (item as any).isSuggested === true;
                
                return (
                  <tr 
                    key={idx}
                    className={`hover:bg-slate-50/50 transition-colors ${isChecked ? 'bg-slate-50/80 line-through text-slate-400' : ''}`}
                  >
                    <td className="py-3 px-4 text-center">
                      <button 
                        type="button"
                        onClick={() => toggleItemCheck(uniqueKey)}
                        className="text-slate-400 hover:text-blue-600 transition-colors focus:outline-none cursor-pointer"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-blue-605 fill-blue-50" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className={`py-3 px-2 text-center font-mono text-xs font-black ${isChecked ? 'text-slate-350' : 'text-slate-900'}`}>
                      {item.quantity}x
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-xs font-bold leading-tight block ${isChecked ? 'text-slate-350 font-medium' : 'text-slate-800'}`}>
                        {item.name}
                      </span>
                      {item.notes && (
                        <p className={`text-[10px] mt-0.5 select-text ${isChecked ? 'text-slate-300' : 'text-slate-400'}`}>
                          💡 Nota: {item.notes}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {isSuggested ? (
                        <span className="bg-amber-50 border border-amber-200 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-md font-sans uppercase">
                          Sugerencia
                        </span>
                      ) : (
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-md font-sans uppercase">
                          Enlazado
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center bg-slate-100 p-3 rounded-xl border border-slate-200">
          <p className="text-[10.5px] text-slate-500 leading-relaxed">
            * Haz check en cada artículo para control escolar. Te recomendamos abrir la <strong>Página SEO</strong> para ver la comparativa completa de subtotales por supermercado (Jumbo, Sirena, Nacional, Bravo) en tiempo real.
          </p>
          <button
            onClick={() => {
              if (onSelectSchoolList) {
                onSelectSchoolList(list);
              }
            }}
            className="bg-blue-50 hover:bg-blue-105 border border-blue-200 text-blue-700 text-xs font-extrabold px-3 py-1.5 rounded-xl shrink-0 cursor-pointer"
          >
            Comprar Lista Escolar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6" id="national-library-module">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-blue-600 fill-blue-100" />
              Biblioteca Nacional de Listas Escolares RD
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Explora, busca y filtra entre miles de listas de útiles y libros pre-cargadas y digitalizadas por la comunidad dominicana. Cada lista cuenta con una <strong>página SEO dedicada optimizada</strong> con esquemas estructurados para Google.
            </p>
          </div>
          <button
            onClick={fetchLists}
            className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sincronizar Biblioteca
          </button>
        </div>

        {/* SEARCH AND FILTERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Colegio o Institución</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={schoolQuery}
                onChange={(e) => setSchoolQuery(e.target.value)}
                placeholder="Ej. Loyola, Carol Morgan, La Salle..."
                className="bg-white border border-slate-250 w-full pl-9 pr-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Ciudad Dominicana</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-white border border-slate-250 w-full pl-9 pr-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Todas las ciudades</option>
                <option value="Santo Domingo">Gran Santo Domingo / D.N.</option>
                <option value="Santiago">Santiago de los Caballeros</option>
                <option value="La Vega">La Vega</option>
                <option value="San Francisco">San Francisco de Macorís</option>
                <option value="Puerto Plata">Puerto Plata</option>
                <option value="San Pedro">San Pedro de Macorís</option>
                <option value="Higuey">Higüey / Bávaro</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Grado o Nivel</label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="bg-white border border-slate-250 w-full pl-9 pr-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Cualquier Grado</option>
                <option value="kinder">Preescolar / Kínder</option>
                <option value="primaria">Primaria (1ro - 6to)</option>
                <option value="secundaria">Secundaria / Bachillerato</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Año Académico</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="bg-white border border-slate-250 w-full pl-9 pr-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="2026-2027">Año Escolar 2026-2027</option>
                <option value="2025-2026">Año Escolar 2025-2026</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-xs font-bold text-slate-500">Filtrando listas en la Biblioteca Dominicana...</span>
        </div>
      ) : lists.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-200 text-center flex flex-col items-center justify-center gap-2">
          <BookOpen className="w-10 h-10 text-slate-300" />
          <h4 className="text-sm font-black text-slate-700">No se encontraron listas</h4>
          <p className="text-xs text-slate-400 max-w-sm">No hallamos ninguna lista que coincida con tus filtros de búsqueda. ¡Ve a la pestaña de <strong>Escáner de IA</strong> para añadirla!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((list) => {
              const schoolSlug = toSlug(list.schoolName);
              const gradeSlug = toSlug(list.grade) + "-2026";
              const isActive = activeDetailList?.id === list.id;
              
              return (
                <div 
                  key={list.id}
                  onClick={() => {
                    setActiveDetailList(isActive ? null : list);
                  }}
                  className={`bg-white rounded-xl p-4 border transition-all cursor-pointer select-none flex flex-col justify-between h-40 hover:shadow-sm ${isActive ? 'ring-2 ring-blue-600 border-transparent shadow-md' : 'border-slate-200/80 hover:border-slate-300'}`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[9px] text-blue-800 bg-blue-50/80 font-black px-1.5 py-0.5 rounded select-none">
                        {list.academicYear}
                      </span>
                      <span className="text-[9.5px] text-slate-400 font-extrabold flex items-center gap-1 font-sans">
                        <MapPin className="w-3 h-3 text-slate-350" />
                        {list.city || 'Santo Domingo'}
                      </span>
                    </div>
                    <strong className="text-xs font-black text-slate-800 leading-tight mt-1 truncate block">
                      {list.schoolName}
                    </strong>
                    <span className="text-[11px] text-slate-500 font-bold block">
                      {list.grade}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-2.5 mt-2">
                    <span className="text-[10px] text-slate-400 font-extrabold font-mono">
                      📚 {list.items.length} Útiles escolares
                    </span>
                    <button className="text-slate-400 hover:text-blue-600 text-xs font-bold flex items-center gap-0.5 select-none transition-colors">
                      {isActive ? 'Cerrar' : 'Revisar'}
                      <ChevronRight className="w-3.5 h-3.5 font-black" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {activeDetailList && renderDetailChecklist(activeDetailList)}
        </div>
      )}
    </div>
  );
}
