import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORIES, PRODUCTS as INITIAL_PRODUCTS, SCHOOLS, GRADES, SCHOOL_LISTS_DATA } from './data';
import { Product, CartItem, SchoolList, SchoolItem, Order } from './types';
import { motion, AnimatePresence } from 'motion/react';
import type { User as FirebaseUser } from 'firebase/auth';

const AdSenseBanner = React.lazy(() => import('./components/AdSenseBanner').then(m => ({ default: m.AdSenseBanner })));
const FaqsView = React.lazy(() => import('./components/FaqsView'));
import {
  Search,
  Sparkles,
  ShoppingCart,
  Trash2,
  Check,
  CheckCircle,
  Star,
  Calendar,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  User,
  Tag,
  HelpCircle,
  Package,
  Send,
  Loader2,
  ArrowRight,
  Printer,
  Info,
  X,
  Plus,
  Minus,
  MessageSquare,
  Truck,
  Heart,
  Briefcase,
  Layers,
  Award,
  BarChart2,
  TrendingDown,
  Bell,
  Percent,
  Sun,
  Moon
} from 'lucide-react';

export default function App() {
  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Mobile Sticky Anchor Ad state
  const [showAnchorAd, setShowAnchorAd] = useState<boolean>(true);

  // Dynamic products list state synced from the Node.js server
  const [productsList, setProductsList] = useState<any[]>(INITIAL_PRODUCTS);
  const [lastSyncDate, setLastSyncDate] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [sysTimeText, setSysTimeText] = useState<string>('Calculando próxima actualización...');

  // Shadow the import so all existing hooks and rendering functions automatically use dynamic prices!
  const PRODUCTS = productsList;

  // Navigation state / Active View ('lists' | 'store' | 'scanner' | 'history' | 'faqs' | 'admin')
  const [activeTab, setActiveTab] = useState<'lists' | 'store' | 'scanner' | 'history' | 'faqs' | 'admin'>('lists');

  // School List Selection State
  const [selectedSchool, setSelectedSchool] = useState<string>('Colegio Dominicano De La Salle');
  const [selectedGrade, setSelectedGrade] = useState<string>('1ro de Primaria');

  // School list loader state
  const [isListLoading, setIsListLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsListLoading(true);
    const timer = setTimeout(() => {
      setIsListLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [selectedSchool, selectedGrade]);

  // Image Upload state for scanner
  const [scannerImageBase64, setScannerImageBase64] = useState<string | null>(null);
  const [scannerImageMimeType, setScannerImageMimeType] = useState<string | null>(null);
  const [scannerMode, setScannerMode] = useState<'text' | 'image'>('text');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Por favor selecciona un archivo de imagen válido (PNG, JPEG, WebP).", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setScannerImageBase64(base64String);
      setScannerImageMimeType(file.type);
      showToast("¡Imagen cargada correctamente! Pulsa el botón de Escaneo Inteligente para analizarla.", "success");
    };
    reader.readAsDataURL(file);
  };

  // Firebase auth user
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  
  // Community Contributed Lists State
  const [communityLists, setCommunityLists] = useState<any[]>([]);

  // States for 'Add Custom List Form'
  const [showAddListModal, setShowAddListModal] = useState<boolean>(false);
  const [formSchoolName, setFormSchoolName] = useState<string>('');
  const [isNewSchoolText, setIsNewSchoolText] = useState<boolean>(false);
  const [formGrade, setFormGrade] = useState<string>('1ro de Primaria');
  const [formAcademicYear, setFormAcademicYear] = useState<string>('2026-2027');
  const [formCreatedBy, setFormCreatedBy] = useState<string>('');
  const [formItemQuantities, setFormItemQuantities] = useState<Record<string, number>>({});
  const [formItemNotes, setFormItemNotes] = useState<Record<string, string>>({});
  const [formItemRequired, setFormItemRequired] = useState<Record<string, boolean>>({});
  const [formCustomItems, setFormCustomItems] = useState<{ name: string; quantity: number; price: number }[]>([]);
  const [customItemInput, setCustomItemInput] = useState<string>('');
  const [customItemQty, setCustomItemQty] = useState<number>(1);
  const [customItemPrice, setCustomItemPrice] = useState<number>(100);
  const [formSearchQuery, setFormSearchQuery] = useState<string>('');
  const [isSubmittingList, setIsSubmittingList] = useState<boolean>(false);

  // Fetch dynamic/cached school products from backend
  const fetchProductsFromServer = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.products) {
          setProductsList(data.products);
          setLastSyncDate(data.lastSyncTimestamp);
        }
      }
    } catch (err) {
      console.error("Error cargando productos sincronizados:", err);
    }
  };

  // Triggers the automated 12:00 AM updates immediately for real-time testing
  const forceMidnightSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/force-midnight-sync', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.products) {
          setProductsList(data.products);
          setLastSyncDate(data.lastSyncTimestamp);
        }
      }
    } catch (err) {
      console.error("Error en sincronización forzada:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchProductsFromServer();

    // Setup second-by-second countdown to the next midnight (12:00 AM AST)
    const interval = setInterval(() => {
      const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
      const ast = new Date(utc + (3600000 * -4)); // GMT-4 AST Dominican Republic Time
      
      const nextMidnight = new Date(ast);
      nextMidnight.setHours(24, 0, 0, 0); // Next automatic daily rollover
      
      const diffMs = nextMidnight.getTime() - ast.getTime();
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffMins = Math.floor((diffMs % 3600000) / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      
      setSysTimeText(
        `Hora AST en RD: ${String(ast.getHours()).padStart(2, '0')}:${String(ast.getMinutes()).padStart(2, '0')}:${String(ast.getSeconds()).padStart(2, '0')} (Próxima actualización en ${diffHrs}h ${diffMins}m ${diffSecs}s)`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Dynamic AdSense Loader to improve TBT and LCP on mobile
  useEffect(() => {
    const loadAdSense = () => {
      const windowWithAds = window as any;
      if (windowWithAds.adsenseLoaded) return;
      windowWithAds.adsenseLoaded = true;

      const client = "ca-pub-9482819857182281";
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    };

    const timer = setTimeout(loadAdSense, 3500);

    const triggerLoad = () => {
      loadAdSense();
      clearTimeout(timer);
      window.removeEventListener('scroll', triggerLoad);
      window.removeEventListener('click', triggerLoad);
      window.removeEventListener('touchstart', triggerLoad);
    };

    window.addEventListener('scroll', triggerLoad, { passive: true });
    window.addEventListener('click', triggerLoad, { passive: true });
    window.addEventListener('touchstart', triggerLoad, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', triggerLoad);
      window.removeEventListener('click', triggerLoad);
      window.removeEventListener('touchstart', triggerLoad);
    };
  }, []);

  // Auth changed listener & Community lists listener
  useEffect(() => {
    let unsubAuth: (() => void) | null = null;
    let unsubSnap: (() => void) | null = null;

    const initFirebase = async () => {
      try {
        const { db, auth, handleFirestoreError, OperationType } = await import('./lib/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');
        const { collection, onSnapshot } = await import('firebase/firestore');

        unsubAuth = onAuthStateChanged(auth, (u) => {
          setAuthUser(u);
          if (u && u.displayName) {
            setFormCreatedBy(u.displayName);
          }
        });

        const path = 'communityLists';
        unsubSnap = onSnapshot(collection(db, path), (snapshot) => {
          try {
            const lists: any[] = [];
            snapshot.forEach(docSnap => {
              lists.push({ id: docSnap.id, ...docSnap.data() });
            });
            setCommunityLists(lists);
          } catch (err) {
            console.error("Error loading snapshots:", err);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, path);
        });
      } catch (err) {
        console.error("Failed to load Firebase dynamically:", err);
      }
    };

    const delayTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => initFirebase());
      } else {
        initFirebase();
      }
    }, 1500);

    return () => {
      clearTimeout(delayTimer);
      if (unsubAuth) unsubAuth();
      if (unsubSnap) unsubSnap();
    };
  }, []);

  // Combined schools list (Static schools + community added schools)
  const schoolsList = useMemo(() => {
    const communitySchools = communityLists.map(l => l.schoolName);
    const combined = Array.from(new Set([...SCHOOLS, ...communitySchools]));
    return combined;
  }, [communityLists]);

  // Interactive pack selection: tracks which merchandise product IDs are checked in school list
  const [checkedProductIds, setCheckedProductIds] = useState<string[]>([]);

  // Search and Category states for Store
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('utiles_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save cart to local storage when changed
  useEffect(() => {
    localStorage.setItem('utiles_cart', JSON.stringify(cart));
  }, [cart]);

  // AI Scanner State
  const [scannerInput, setScannerInput] = useState<string>('• 4 cuadernos de raya Mascot\n• 1 caja de lápices de colores Prismacolor\n• 1 juego de geometría completo\n• 2 envases de pegamento líquido blanco Elmer\n• 1 tijera punta roma para niños');
  const [scannerMatches, setScannerMatches] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResultNotice, setScanResultNotice] = useState<string>('');

  // Selected matches from the AI scan to add to cart
  const [selectedScanProductIds, setSelectedScanProductIds] = useState<string[]>([]);

  // Detailed Product Modal State
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // State to track which product cards have their detailed supermarket prices expanded/deployed
  const [expandedProductPrices, setExpandedProductPrices] = useState<Record<string, boolean>>({});

  // Elegant Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Live Price Verification States
  const [isVerifyingPrices, setIsVerifyingPrices] = useState<boolean>(false);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);
  const [livePricesResult, setLivePricesResult] = useState<any | null>(null);

  // Price Alerts and Admin Dashboard Intelligence Analytics States
  const [alertEmail, setAlertEmail] = useState<string>('');
  const [alertTargetPrice, setAlertTargetPrice] = useState<string>('');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(false);

  // Fetching Analytics data
  const fetchAnalyticsData = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAnalyticsData(data);
        }
      }
    } catch (err) {
      console.error("Error cargando analíticas de precios escaneados:", err);
    }
  };

  // Fetching pending scan reviews
  const fetchPendingReviews = async () => {
    try {
      const res = await fetch('/api/match-reviews');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPendingReviews(data.reviews || []);
        }
      }
    } catch (err) {
      console.error("Error cargando revisiones de coincidencia:", err);
    }
  };

  // Trigger loading reports
  const fetchAdminReports = async () => {
    setIsAdminLoading(true);
    await Promise.all([fetchAnalyticsData(), fetchPendingReviews()]);
    setIsAdminLoading(false);
  };

  // Action helper when approving/rejecting matching
  const handleReviewAction = async (id: string, action: 'APPROVE' | 'REJECT' | 'UPDATE', correctedProductId?: string) => {
    try {
      const res = await fetch('/api/match-review/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, correctedProductId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast("Enlace de clasificación verificado correctamente.", "success");
          fetchAdminReports();
        } else {
          showToast(data.error || "No se pudo realizar la acción.", "error");
        }
      }
    } catch (err) {
      showToast("Error de conexión al guardar cambios de coincidencia.", "error");
    }
  };

  // Creating price alert drops
  const handleCreatePriceAlert = async (productId: string, productName: string, currentPrice: number) => {
    if (!alertEmail || !alertEmail.includes('@')) {
      showToast("Por favor escribe un correo electrónico válido.", "error");
      return;
    }
    const parsedTarget = parseInt(alertTargetPrice, 10);
    if (isNaN(parsedTarget) || parsedTarget <= 0 || parsedTarget >= currentPrice) {
      showToast(`Por favor ingresa un precio de alerta menor que RD$ ${currentPrice}.`, "error");
      return;
    }

    try {
      const res = await fetch('/api/price-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: alertEmail,
          productId,
          productName,
          targetPrice: parsedTarget,
          currentPrice
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast(data.message, "success");
          setAlertEmail('');
          setAlertTargetPrice('');
        } else {
          showToast(data.error || "Inconveniente al registrar alerta.", "error");
        }
      }
    } catch (err) {
      showToast("Error de conexión al registrar alerta.", "error");
    }
  };

  // Log user searches
  const handleLogSearchQuery = async (term: string) => {
    if (!term || term.trim().length < 3) return;
    try {
      await fetch('/api/search-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: term.trim() })
      });
    } catch {}
  };

  useEffect(() => {
    if (activeTab === 'store' || activeTab === 'lists') {
      const timer = setTimeout(() => {
        if (searchQuery) handleLogSearchQuery(searchQuery);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  useEffect(() => {
    const act = activeTab as string;
    if (act === 'admin') {
      fetchAdminReports();
    }
  }, [activeTab]);

  const handleVerifyLivePrices = async (productName: string, originalPrice: number, productId: string) => {
    setIsVerifyingPrices(true);
    setVerificationLogs(["[SISTEMA] Iniciando conexión con el nodo de comparación de Útiles Online..."]);
    setLivePricesResult(null);

    try {
      const response = await fetch('/api/verify-live-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, originalPrice })
      });
      const data = await response.json();
      if (data.success) {
        let logIndex = 0;
        const allLogs = data.logs || [];
        
        const interval = setInterval(() => {
          if (logIndex < allLogs.length) {
            setVerificationLogs(prev => [...prev, allLogs[logIndex]]);
            logIndex++;
          } else {
            clearInterval(interval);
            setLivePricesResult({
              productId,
              prices: data.prices,
              sources: data.sources,
              analysis: data.analysis,
              isDemo: data.isDemo
            });
            setIsVerifyingPrices(false);
          }
        }, 350);
      } else {
        setVerificationLogs(prev => [...prev, `❌ Error del servidor: ${data.errorMsg || 'No se pudieron contactar los portales web'}`]);
        setIsVerifyingPrices(false);
      }
    } catch (err: any) {
      setVerificationLogs(prev => [...prev, `❌ Error de red: ${err.message || 'Error de conexión a internet'}`]);
      setIsVerifyingPrices(false);
    }
  };

  useEffect(() => {
    setLivePricesResult(null);
    setIsVerifyingPrices(false);
    setVerificationLogs([]);
  }, [selectedProductDetail]);

  // Delivery / Checkout State
  const [deliveryName, setDeliveryName] = useState<string>('');
  const [deliveryPhone, setDeliveryPhone] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryCity, setDeliveryCity] = useState<string>('Distrito Nacional');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [checkoutError, setCheckoutError] = useState<string>('');

  // Past Orders History (Persisted in localStorage)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('utiles_orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save orders to local storage when changed
  useEffect(() => {
    localStorage.setItem('utiles_orders', JSON.stringify(orders));
  }, [orders]);

  // Active Order / Latest Success State for receipt modal
  const [latestSuccessOrder, setLatestSuccessOrder] = useState<Order | null>(null);

  // Newsletter cache from API if needed
  const [articles, setArticles] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.articles) {
          setArticles(data.articles);
        }
      })
      .catch(err => console.log('Error fetching articles:', err));
  }, []);

  // -- Dynamic Calculations --

  // Find active school list (official or community-contributed)
  const activeSchoolList = useMemo(() => {
    // 1. Check in official hardcoded lists
    const official = SCHOOL_LISTS_DATA.find(
      list => list.schoolName === selectedSchool && list.grade === selectedGrade
    );
    if (official) {
      return { ...official, isOfficial: true };
    }

    // 2. Check in community lists
    const community = communityLists.find(
      list => list.schoolName === selectedSchool && list.grade === selectedGrade
    );
    if (community) {
      return { ...community, isOfficial: false };
    }

    return null;
  }, [selectedSchool, selectedGrade, communityLists]);

  // Set default checked items when activeSchoolList changes
  useEffect(() => {
    if (activeSchoolList) {
      setCheckedProductIds(activeSchoolList.items.map(item => item.productId));
    } else {
      setCheckedProductIds([]);
    }
  }, [selectedSchool, selectedGrade, activeSchoolList]);

  // Handle checking/unchecking single item in school list
  const handleToggleCheckedProduct = (productId: string) => {
    setCheckedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Toggle all items in school list
  const handleToggleAllSchoolItems = () => {
    if (!activeSchoolList) return;
    const allIds = activeSchoolList.items.map(item => item.productId);
    if (checkedProductIds.length === allIds.length) {
      setCheckedProductIds([]);
    } else {
      setCheckedProductIds(allIds);
    }
  };

  // Calculate customized selected pack price (supporting custom community lists items) across all 8 supermarkets
  const schoolPackFinancials = useMemo(() => {
    if (!activeSchoolList) return { count: 0, total: 0, storeCosts: [] as any[] };
    let total = 0;
    let count = 0;

    let sirenaSub = 0, sirenaTax = 0;
    let jumboSub = 0, jumboTax = 0;
    let nacionalSub = 0, nacionalTax = 0;
    let plazalamaSub = 0, plazalamaTax = 0;
    let bravoSub = 0, bravoTax = 0;
    let garridoSub = 0, garridoTax = 0;
    let oleSub = 0, oleTax = 0;
    let carrefourSub = 0, carrefourTax = 0;

    activeSchoolList.items.forEach(schoolItem => {
      if (checkedProductIds.includes(schoolItem.productId)) {
        const prod = PRODUCTS.find(p => p.id === schoolItem.productId);
        if (prod) {
          const isExempt = prod.exemptITBIS === true;
          const itemPrice = prod.price * schoolItem.quantity;
          total += itemPrice + (isExempt ? 0 : Math.round(itemPrice * 0.18));
          count += schoolItem.quantity;

          const sirenaPrice = (prod.storePrices?.sirena || prod.price) * schoolItem.quantity;
          sirenaSub += sirenaPrice;
          sirenaTax += isExempt ? 0 : Math.round(sirenaPrice * 0.18);

          const jumboPrice = (prod.storePrices?.jumbo || prod.price) * schoolItem.quantity;
          jumboSub += jumboPrice;
          jumboTax += isExempt ? 0 : Math.round(jumboPrice * 0.18);

          const nacionalPrice = (prod.storePrices?.nacional || prod.price) * schoolItem.quantity;
          nacionalSub += nacionalPrice;
          nacionalTax += isExempt ? 0 : Math.round(nacionalPrice * 0.18);

          const plazalamaPrice = (prod.storePrices?.plazalama || prod.price) * schoolItem.quantity;
          plazalamaSub += plazalamaPrice;
          plazalamaTax += isExempt ? 0 : Math.round(plazalamaPrice * 0.18);

          const bravoPrice = (prod.storePrices?.bravo || prod.price) * schoolItem.quantity;
          bravoSub += bravoPrice;
          bravoTax += isExempt ? 0 : Math.round(bravoPrice * 0.18);

          const garridoPrice = (prod.storePrices?.garrido || prod.price) * schoolItem.quantity;
          garridoSub += garridoPrice;
          garridoTax += isExempt ? 0 : Math.round(garridoPrice * 0.18);

          const olePrice = (prod.storePrices?.ole || prod.price) * schoolItem.quantity;
          oleSub += olePrice;
          oleTax += isExempt ? 0 : Math.round(olePrice * 0.18);

          const carrefourPrice = (prod.storePrices?.carrefour || prod.price) * schoolItem.quantity;
          carrefourSub += carrefourPrice;
          carrefourTax += isExempt ? 0 : Math.round(carrefourPrice * 0.18);
        } else {
          // Support community lists custom items (estimated price)
          const estPrice = ((schoolItem as any).estimatedPrice || 150) * schoolItem.quantity;
          total += estPrice + Math.round(estPrice * 0.18);
          count += schoolItem.quantity;

          sirenaSub += estPrice;
          sirenaTax += Math.round(estPrice * 0.18);
          jumboSub += estPrice;
          jumboTax += Math.round(estPrice * 0.18);
          nacionalSub += estPrice;
          nacionalTax += Math.round(estPrice * 0.18);
          plazalamaSub += estPrice;
          plazalamaTax += Math.round(estPrice * 0.18);
          bravoSub += estPrice;
          bravoTax += Math.round(estPrice * 0.18);
          garridoSub += estPrice;
          garridoTax += Math.round(estPrice * 0.18);
          oleSub += estPrice;
          oleTax += Math.round(estPrice * 0.18);
          carrefourSub += estPrice;
          carrefourTax += Math.round(estPrice * 0.18);
        }
      }
    });

    const storeCosts = [
      { id: 'sirena', name: 'La Sirena', logo: '🧜‍♀️', total: sirenaSub + sirenaTax },
      { id: 'jumbo', name: 'Jumbo', logo: '🐘', total: jumboSub + jumboTax },
      { id: 'nacional', name: 'S. Nacional', logo: '🛒', total: nacionalSub + nacionalTax },
      { id: 'plazalama', name: 'Plaza Lama', logo: '🦙', total: plazalamaSub + plazalamaTax },
      { id: 'bravo', name: 'S. Bravo', logo: '🍎', total: bravoSub + bravoTax },
      { id: 'garrido', name: 'A. Garrido', logo: '🛍️', total: garridoSub + garridoTax },
      { id: 'ole', name: 'Superm. Olé', logo: '🥥', total: oleSub + oleTax },
      { id: 'carrefour', name: 'Carrefour RD', logo: '🇨🇵', total: carrefourSub + carrefourTax }
    ].sort((a, b) => a.total - b.total);

    return { count, total, storeCosts };
  }, [activeSchoolList, checkedProductIds]);

  // Support community lists upvoting
  const handleLikeCommunityList = async (listId: string) => {
    try {
      const { db } = await import('./lib/firebase');
      const { doc, updateDoc } = await import('firebase/firestore');

      const listRef = doc(db, 'communityLists', listId);
      const updatedLists = communityLists.map(list => {
        if (list.id === listId) {
          return { ...list, likes: (list.likes || 0) + 1 };
        }
        return list;
      });
      setCommunityLists(updatedLists);

      const targetList = communityLists.find(l => l.id === listId);
      if (targetList) {
        await updateDoc(listRef, {
          likes: (targetList.likes || 0) + 1
        });
      }
    } catch (error) {
      console.error("Error upvoting list:", error);
    }
  };

  // Submit a parent-created custom school list to Firestore
  const handlePublishCommunityList = async () => {
    const finalSchoolName = isNewSchoolText ? formSchoolName.trim() : selectedSchool;
    if (!finalSchoolName) {
      showToast("Por favor, ingresa el nombre de tu colegio.", "error");
      return;
    }

    const items: any[] = [];
    
    // 1. Pack items from the general products catalog
    PRODUCTS.forEach(p => {
      const qty = formItemQuantities[p.id] || 0;
      if (qty > 0) {
        items.push({
          productId: p.id,
          name: p.name,
          quantity: qty,
          isRequired: formItemRequired[p.id] !== false,
          notes: formItemNotes[p.id] || ''
        });
      }
    });

    // 2. Custom items not in catalog
    formCustomItems.forEach((cust, index) => {
      items.push({
        productId: `custom-${index}-${Date.now()}`,
        name: cust.name,
        quantity: cust.quantity,
        isRequired: true,
        notes: 'Artículo sugerido por la comunidad',
        estimatedPrice: cust.price
      });
    });

    if (items.length === 0) {
      showToast("Por favor, añade al menos un artículo escolar a la lista.", "error");
      return;
    }

    setIsSubmittingList(true);
    const listId = "comlist-" + Date.now();
    const newListDoc = {
      id: listId,
      schoolName: finalSchoolName,
      grade: formGrade,
      academicYear: formAcademicYear,
      createdBy: formCreatedBy.trim() || 'Padre Colaborador',
      creatorUid: authUser?.uid || null,
      items: items,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    try {
      const { db } = await import('./lib/firebase');
      const { collection, addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'communityLists'), newListDoc);
      showToast("¡Lista creada con éxito! Gracias por ayudar a la comunidad escolar.", "success");
      
      // Select the new school list immediately
      setSelectedSchool(finalSchoolName);
      setSelectedGrade(formGrade);
      setShowAddListModal(false);
      
      // Reset form fields
      setFormSchoolName('');
      setFormItemQuantities({});
      setFormItemNotes({});
      setFormCustomItems([]);
    } catch (error) {
      console.error("Error saving school list: ", error);
      showToast("Ocurrió un error al guardar la lista escolar. Por favor, intenta de nuevo.", "error");
    } finally {
      setIsSubmittingList(false);
    }
  };

  // Filter products based on search and category tabs
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(prod => {
      const matchesCategory = selectedCategory === 'todos' || prod.category === selectedCategory;
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (prod.tags && prod.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Total items inside the cart
  const totalCartQty = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Financial calculations for comparison across stores
  const cartFinancials = useMemo(() => {
    let subtotal = 0;
    let tax = 0;

    let sirenaSubtotal = 0, sirenaTax = 0;
    let jumboSubtotal = 0, jumboTax = 0;
    let nacionalSubtotal = 0, nacionalTax = 0;
    let plazalamaSubtotal = 0, plazalamaTax = 0;
    let bravoSubtotal = 0, bravoTax = 0;
    let garridoSubtotal = 0, garridoTax = 0;
    let oleSubtotal = 0, oleTax = 0;
    let carrefourSubtotal = 0, carrefourTax = 0;

    cart.forEach(item => {
      const qty = item.quantity;
      const basePrice = item.product.price;
      const isExempt = item.product.exemptITBIS === true;

      // Base (Reference)
      const itemSub = basePrice * qty;
      subtotal += itemSub;
      tax += isExempt ? 0 : Math.round(itemSub * 0.18);

      // Sirena
      const sirenaPrice = (item.product.storePrices?.sirena || basePrice) * qty;
      sirenaSubtotal += sirenaPrice;
      sirenaTax += isExempt ? 0 : Math.round(sirenaPrice * 0.18);

      // Jumbo
      const jumboPrice = (item.product.storePrices?.jumbo || basePrice) * qty;
      jumboSubtotal += jumboPrice;
      jumboTax += isExempt ? 0 : Math.round(jumboPrice * 0.18);

      // Nacional
      const nacionalPrice = (item.product.storePrices?.nacional || basePrice) * qty;
      nacionalSubtotal += nacionalPrice;
      nacionalTax += isExempt ? 0 : Math.round(nacionalPrice * 0.18);

      // Plaza Lama
      const plazalamaPrice = (item.product.storePrices?.plazalama || basePrice) * qty;
      plazalamaSubtotal += plazalamaPrice;
      plazalamaTax += isExempt ? 0 : Math.round(plazalamaPrice * 0.18);

      // Bravo
      const bravoPrice = (item.product.storePrices?.bravo || Math.round(basePrice * 0.95)) * qty;
      bravoSubtotal += bravoPrice;
      bravoTax += isExempt ? 0 : Math.round(bravoPrice * 0.18);

      // Garrido
      const garridoPrice = (item.product.storePrices?.garrido || Math.round(basePrice * 0.90)) * qty;
      garridoSubtotal += garridoPrice;
      garridoTax += isExempt ? 0 : Math.round(garridoPrice * 0.18);

      // Olé
      const olePrice = (item.product.storePrices?.ole || Math.round(basePrice * 0.92)) * qty;
      oleSubtotal += olePrice;
      oleTax += isExempt ? 0 : Math.round(olePrice * 0.18);

      // Carrefour
      const carrefourPrice = (item.product.storePrices?.carrefour || Math.round(basePrice * 1.04)) * qty;
      carrefourSubtotal += carrefourPrice;
      carrefourTax += isExempt ? 0 : Math.round(carrefourPrice * 0.18);
    });

    const total = subtotal + tax;

    // Build the comparative array
    const stores = [
      { id: 'sirena', name: 'La Sirena', subtotal: sirenaSubtotal, tax: sirenaTax, total: sirenaSubtotal + sirenaTax, logo: '🧜‍♀️', color: 'bg-yellow-500', textColor: 'text-amber-800' },
      { id: 'jumbo', name: 'Jumbo', subtotal: jumboSubtotal, tax: jumboTax, total: jumboSubtotal + jumboTax, logo: 'Elephant', logoChar: '🐘', color: 'bg-green-600', textColor: 'text-green-800' },
      { id: 'nacional', name: 'Superm. Nacional', subtotal: nacionalSubtotal, tax: nacionalTax, total: nacionalSubtotal + nacionalTax, logo: 'Cart', logoChar: '🛒', color: 'bg-blue-600', textColor: 'text-blue-800' },
      { id: 'plazalama', name: 'Plaza Lama', subtotal: plazalamaSubtotal, tax: plazalamaTax, total: plazalamaSubtotal + plazalamaTax, logo: 'Llama', logoChar: '🦙', color: 'bg-orange-500', textColor: 'text-orange-850' },
      { id: 'bravo', name: 'Superm. Bravo', subtotal: bravoSubtotal, tax: bravoTax, total: bravoSubtotal + bravoTax, logo: 'Apple', logoChar: '🍎', color: 'bg-red-600', textColor: 'text-red-800' },
      { id: 'garrido', name: 'Almacenes Garrido', subtotal: garridoSubtotal, tax: garridoTax, total: garridoSubtotal + garridoTax, logo: 'Bag', logoChar: '🛍️', color: 'bg-indigo-600', textColor: 'text-indigo-850' },
      { id: 'ole', name: 'Superm. Olé', subtotal: oleSubtotal, tax: oleTax, total: oleSubtotal + oleTax, logo: 'Coconut', logoChar: '🥥', color: 'bg-rose-600', textColor: 'text-rose-800' },
      { id: 'carrefour', name: 'Carrefour RD', subtotal: carrefourSubtotal, tax: carrefourTax, total: carrefourSubtotal + carrefourTax, logo: 'Car', logoChar: '🇫🇷', color: 'bg-cyan-600', textColor: 'text-cyan-800' }
    ];

    // Find cheapest and most expensive
    const validStores = totalCartQty > 0 ? stores : [];
    const sortedStores = [...validStores].sort((a, b) => a.total - b.total);
    const cheapestStore = sortedStores[0] || null;
    const mostExpensiveStore = sortedStores[sortedStores.length - 1] || null;
    const maxSavings = (mostExpensiveStore && cheapestStore) ? (mostExpensiveStore.total - cheapestStore.total) : 0;

    return { 
      subtotal, 
      tax, 
      total,
      stores,
      cheapestStore,
      sortedStores,
      maxSavings
    };
  }, [cart, totalCartQty]);

  // CART OPERATIONS

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
      return;
    }
    const maxStock = PRODUCTS.find(p => p.id === productId)?.stock || 100;
    setCart(prev => prev.map(item =>
      item.product.id === productId
        ? { ...item, quantity: Math.min(quantity, maxStock) }
        : item
    ));
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Add selected checked school list items to the cart (with virtual product support for custom community items)
  const handleAddCheckedSchoolListToCart = () => {
    if (!activeSchoolList || checkedProductIds.length === 0) {
      showToast("Por favor, selecciona por lo menos un artículo de la lista de útiles.", "error");
      return;
    }

    let updatedCart = [...cart];
    let itemsAdded = 0;

    activeSchoolList.items.forEach(schoolItem => {
      if (checkedProductIds.includes(schoolItem.productId)) {
        let matchedProd = PRODUCTS.find(p => p.id === schoolItem.productId);
        
        // Build virtual product in-place for community custom-contributed list items
        if (!matchedProd && schoolItem.productId.startsWith('custom')) {
          matchedProd = {
            id: schoolItem.productId,
            name: schoolItem.name,
            description: 'Artículo sugerido por la comunidad escolar',
            price: (schoolItem as any).estimatedPrice || 150,
            category: 'otros',
            image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=260&auto=format&fit=crop',
            rating: 5,
            reviewsCount: 1,
            stock: 99,
            brand: 'Comunidad',
            storePrices: {
              sirena: (schoolItem as any).estimatedPrice || 150,
              jumbo: (schoolItem as any).estimatedPrice || 150,
              nacional: (schoolItem as any).estimatedPrice || 150,
              plazalama: (schoolItem as any).estimatedPrice || 150,
              bravo: (schoolItem as any).estimatedPrice || 150,
              garrido: (schoolItem as any).estimatedPrice || 150,
              ole: (schoolItem as any).estimatedPrice || 150,
              carrefour: (schoolItem as any).estimatedPrice || 150,
            }
          };
        }

        if (matchedProd) {
          const existingIdx = updatedCart.findIndex(c => c.product.id === matchedProd!.id);
          const quantityToAdd = schoolItem.quantity;

          if (existingIdx !== -1) {
            updatedCart[existingIdx] = {
              ...updatedCart[existingIdx],
              quantity: Math.min(updatedCart[existingIdx].quantity + quantityToAdd, matchedProd!.stock)
            };
          } else {
            updatedCart.push({
              product: matchedProd!,
              quantity: Math.min(quantityToAdd, matchedProd!.stock)
            });
          }
          itemsAdded++;
        }
      }
    });

    setCart(updatedCart);
    showToast(`¡Se han añadido ${itemsAdded} útiles al carrito con éxito!`, "success");
  };

  // AI LIST SCANNER FLOW

  const handleRunAIScan = async () => {
    if (!scannerInput.trim() && !scannerImageBase64) {
      showToast("Por favor escribe una lista o sube una imagen de ella.", "error");
      return;
    }

    setIsScanning(true);
    setScannerMatches([]);
    setScanResultNotice('');

    try {
      // Get raw base64 data from base64Url (remove metadata prefix)
      let rawBase64 = "";
      if (scannerImageBase64) {
        const commaIndex = scannerImageBase64.indexOf(",");
        rawBase64 = commaIndex !== -1 ? scannerImageBase64.substring(commaIndex + 1) : scannerImageBase64;
      }

      const response = await fetch('/api/scan-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          textList: scannerInput,
          image: rawBase64 || undefined,
          mimeType: scannerImageMimeType || undefined
        })
      });

      const data = await response.json();
      if (data.success && data.matches) {
        setScannerMatches(data.matches);
        if (data.isDemo || data.isFallback) {
          setScanResultNotice(data.notice || "Análisis completado mediante simulación.");
        } else {
          setScanResultNotice("¡Análisis completado con éxito con Gemini IA!");
        }

        // Select all matches by default
        const validMatchIds = data.matches
          .filter((m: any) => m.productId && m.matchConfidence >= 0.4)
          .map((m: any) => m.productId);
        setSelectedScanProductIds(validMatchIds);
      } else {
        showToast(data.error || "Ocurrió un inconveniente al analizar la lista.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast("No se pudo conectar con el servidor para escanear la lista.", "error");
    } finally {
      setIsScanning(false);
    }
  };

  const handleToggleScanSelection = (productId: string) => {
    setSelectedScanProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddSelectedAIItemsToCart = () => {
    if (scannerMatches.length === 0) return;

    let itemsAddedCount = 0;
    const updatedCart = [...cart];

    scannerMatches.forEach(match => {
      if (match.productId && selectedScanProductIds.includes(match.productId)) {
        const prod = PRODUCTS.find(p => p.id === match.productId);
        if (prod) {
          const qty = match.extractedQuantity || 1;
          const existingIdx = updatedCart.findIndex(c => c.product.id === prod.id);

          if (existingIdx !== -1) {
            updatedCart[existingIdx] = {
              ...updatedCart[existingIdx],
              quantity: Math.min(updatedCart[existingIdx].quantity + qty, prod.stock)
            };
          } else {
            updatedCart.push({
              product: prod,
              quantity: Math.min(qty, prod.stock)
            });
          }
          itemsAddedCount++;
        }
      }
    });

    setCart(updatedCart);
    showToast(`Se agregaron ${itemsAddedCount} útiles reconocidos al carrito.`, "success");
  };

  // CHECKOUT PROCESS

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (cart.length === 0) {
      setCheckoutError('El carrito se encuentra vacío.');
      return;
    }

    if (!deliveryName.trim() || !deliveryPhone.trim() || !deliveryAddress.trim()) {
      setCheckoutError('Por favor completa todos los datos de contacto y entrega requeridos.');
      return;
    }

    // Build unique school order representation
    const newOrder: Order = {
      id: `UT-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`,
      date: new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      subtotal: cartFinancials.subtotal,
      tax: cartFinancials.tax,
      total: cartFinancials.total,
      status: 'pending',
      shippingDetails: {
        name: deliveryName,
        phone: deliveryPhone,
        address: deliveryAddress,
        city: deliveryCity,
        notes: deliveryNotes
      }
    };

    // Save order
    setOrders(prev => [newOrder, ...prev]);
    setLatestSuccessOrder(newOrder);

    // Empty state
    setCart([]);
    setDeliveryName('');
    setDeliveryPhone('');
    setDeliveryAddress('');
    setDeliveryNotes('');
  };

  // Preset quick lists for testing scanner
  const PRESET_LIST_EXTRACTS = [
    {
      label: "Lista Primaria Básica",
      text: "6 cuadernos de raya Mascot RD\n2 cuadernos de caligrafía vertical Mascot\nCaja de colores de 24 piezas Prismacolor\n1 estuche de tijeras escolares punta roma\n2 envases de pegamento líquido blanco Elmer's"
    },
    {
      label: "Lista Bachillerato Avanzada",
      text: "1 calculadora científica fx-82MS Casio\n8 cuadernos de raya Mascot RD\n1 juego de geometría completo Maped\nCaja de lapiceros azules Bic Cristal\nSet de resaltadores pastel Faber-Castell"
    },
    {
      label: "Lista Inicial / Kinder",
      text: "3 bloques de plastilina de colores Faber-Castell\nTijera roma con resorte de Maped\nTemperas escolares Pelikan más pincel\nPegamento blanco infantil Elmers líquido"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="main-workspace-balance">
      
      {/* SHIPPING CAMPAIGN RIBBON WITH AUTOMATIC PRICES MIDNIGHT AST SYNC PANEL */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 text-white text-xs font-semibold py-2.5 px-4 shadow-inner flex flex-col lg:flex-row items-center justify-between gap-3 text-center lg:text-left">
        <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
          <Sparkles className="w-4 h-4 text-amber-300 stroke-[2.5] animate-pulse" />
          <span>Compara precios en tiempo real en <span className="font-extrabold text-orange-300">La Sirena</span>, <span className="font-extrabold text-yellow-300">Jumbo</span>, <span className="font-extrabold text-sky-200">Nacional</span>, Plaza Lama, Bravo, Garrido, Olé y Carrefour.</span>
        </div>
        <div className="flex items-center gap-3 bg-blue-950/40 px-3 py-1.5 rounded-xl border border-white/10 text-[10.5px] font-mono text-indigo-100 flex-wrap justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Precios Auto-Sincronizados: <span className="text-emerald-300 font-bold">{lastSyncDate ? lastSyncDate.split('-').reverse().join('/') : 'Hoy'}</span></span>
          </div>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="text-amber-300">{sysTimeText}</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <button 
            type="button"
            disabled={isSyncing}
            onClick={forceMidnightSync}
            className={`cursor-pointer font-bold bg-white/10 hover:bg-white/20 active:bg-white/30 text-white px-2 py-0.5 rounded-md transition-all text-[9.5px] uppercase tracking-wider ${isSyncing ? 'animate-pulse text-indigo-300' : ''}`}
            title="Forzar actualización automatizada diaria para comprobar simulación de cambio de precios"
          >
            {isSyncing ? 'Ejecutando...' : 'Sincronizar Ya'}
          </button>
        </div>
      </div>

      {/* HEADER */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs transition-all duration-150">
        <div className="max-w-7xl mx-auto px-4 py-3 xl:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand matching utilesonline.com style with premium touch */}
          <div className="flex items-center gap-3 select-none cursor-pointer group" onClick={() => setActiveTab('lists')} id="header-logo-brand">
            <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all duration-150">
              <Package className="w-5.5 h-5.5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  útiles<span className="text-orange-500 hover:text-orange-600 transition-colors">.online</span>
                </h1>
                <span className="text-[9.5px] bg-blue-50 text-blue-700 font-extrabold border border-blue-100/80 px-2 py-0.5 rounded-lg uppercase tracking-wider">RD</span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold mt-0.5">Comparador de Precios de Útiles RD</p>
            </div>
          </div>

          {/* Search bar inside header for instant accessibility */}
          <div className="w-full md:w-80 relative hidden lg:block">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'store') setActiveTab('store');
              }}
              placeholder="Busca cuadernos, marcas..."
              className="w-full bg-slate-100 border border-slate-200/40 rounded-xl pl-9.5 pr-3.5 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Navigation Controls: Premium pill design with hover scaling */}
          <nav className="flex flex-nowrap items-center gap-1.5 bg-slate-105 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-x-auto max-w-full scrollbar-none">
            <button
              onClick={() => setActiveTab('lists')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-150 flex items-center gap-1.5 ${activeTab === 'lists' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/20' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              Precios por Colegio
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-150 flex items-center gap-1.5 ${activeTab === 'scanner' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/20' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
              Subir Lista / IA
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-150 flex items-center gap-1.5 ${activeTab === 'store' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/20' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Catálogo Completo
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-150 flex items-center gap-1.5 ${activeTab === 'faqs' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/20' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Preguntas Frecuentes
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-150 flex items-center gap-1.5 ${activeTab === 'admin' ? 'bg-white text-violet-700 shadow-sm border border-slate-200/20' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-violet-600" />
              Auditoría & Analítica
            </button>
            {orders.length > 0 && (
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-150 flex items-center gap-1.5 ${activeTab === 'history' ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/20' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                Cotizaciones ({orders.length})
              </button>
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-150 flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-350 dark:hover:text-white dark:hover:bg-slate-800 cursor-pointer"
              title="Alternar Modo Oscuro / Claro"
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                  <span>Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Oscuro</span>
                </>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTAINER LAYOUT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Active Tab View (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* HERO CAMPAIGN / BANNER - Premium interactive banner with deep gradient and glassmorphism */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-955 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute right-0 top-0 -mr-6 -mt-6 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute left-1/4 bottom-0 -mb-10 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="bg-orange-500/25 text-orange-400 text-[10.5px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-orange-500/30 inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-orange-400 fill-orange-400/20" />
                  Comparador Inteligente RD 2026-2027
                </span>
                <h2 className="text-2xl md:text-3.5xl font-black mt-4 tracking-tight leading-tight text-white select-none">
                  Ahorra hasta un <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">25% en Útiles Escolares</span> comparando góndolas en vivo.
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm mt-3 font-medium leading-relaxed max-w-xl">
                  Selecciona el colegio y grado de tu hijo, o simplemente copia y pega tu lista escolar en texto libre. Nuestro motor con <strong className="text-white">Inteligencia Artificial Gemini 3.5</strong> calcula el presupuesto al instante en las principales cadenas dominicanas para sugerirte la combinación más económica.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => setActiveTab('lists')}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 hover:scale-[1.02] active:scale-98 flex items-center gap-1.5 cursor-pointer"
                  >
                    Buscar por Colegio
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-extrabold text-xs px-5 py-3 rounded-xl hover:scale-[1.02] active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-300" />
                    Pegar Lista / Escáner IA
                  </button>
                </div>
              </div>
 
              {/* STATS HIGHLIGHT - Beautiful floating glass panel */}
              <div className="flex-shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4.5 w-full xl:w-64 shadow-lg">
                <p className="text-[10px] text-orange-400 font-extrabold uppercase tracking-widest border-b border-white/10 pb-2 mb-3 flex items-center gap-1">
                  <span>✨</span> Marcas RD Destacadas
                </p>
                <div className="grid grid-cols-2 xl:grid-cols-1 gap-2 pt-0.5 text-xs font-bold text-slate-100">
                  <div className="flex items-center gap-2 hover:text-white transition-colors">
                    <span className="text-blue-400 font-mono">🎒</span> Mascot RD (Cuadernos)
                  </div>
                  <div className="flex items-center gap-2 hover:text-white transition-colors">
                    <span className="text-orange-400 font-mono">✏️</span> Prismacolor
                  </div>
                  <div className="flex items-center gap-2 hover:text-white transition-colors">
                    <span className="text-green-400 font-mono">📐</span> Maped Escolar
                  </div>
                  <div className="flex items-center gap-2 hover:text-white transition-colors">
                    <span className="text-red-400 font-mono">🎨</span> Faber-Castell RD
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AdSense Leaderboard Horizontal Banner */}
          <React.Suspense fallback={<div className="animate-pulse bg-slate-100 h-24 w-full rounded-lg my-4 border border-slate-200"></div>}>
            <AdSenseBanner 
              slot="1928472910" 
              format="horizontal" 
              label="Anuncio Patrocinado - Ofertas de Útiles Escolares RD" 
            />
          </React.Suspense>

          {/* VIEW RENDERERS */}

          {/* TAB 1: LISTS BY SCHOOL */}
          {activeTab === 'lists' && (
            <div className="flex flex-col gap-6">
              
              {/* SELECT CONTROLS BAR */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-end">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Select School */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> Colegio / Centro Educativo (RD)
                    </label>
                    <select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer"
                    >
                      {schoolsList.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                    </select>
                  </div>

                  {/* Select Grade */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" /> Grado del Alumno
                    </label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer"
                    >
                      {GRADES.map(gr => <option key={gr} value={gr}>{gr}</option>)}
                    </select>
                  </div>

                </div>
              </div>

              {/* COLLABORATIVE BANNER CALLOUT */}
              <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-100/80 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600/10 p-2.5 rounded-xl text-blue-700 flex-shrink-0">
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">¿No encuentras la lista de útiles de tu colegio?</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Sube la lista escolar de tus hijos por grados y ayuda a miles de padres o alumnos dominicanos.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // pre-populate inputs if choosing current values
                    setFormSchoolName(selectedSchool);
                    setFormGrade(selectedGrade);
                    setShowAddListModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4.5 py-3 rounded-xl shadow-md shadow-blue-500/15 cursor-pointer hover:shadow-blue-500/25 active:scale-98 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  Añadir Lista de Colegio
                </button>
              </div>

              {/* LIST DETAILS INVOICE-STYLE */}
              {isListLoading ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 flex flex-col gap-4 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-4 bg-slate-200 rounded-md skeleton-shimmer"></div>
                    <div className="h-6 w-64 bg-slate-200 rounded-md skeleton-shimmer"></div>
                  </div>
                  <div className="divide-y divide-slate-100 mt-2">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className="w-6 h-6 bg-slate-200 rounded-lg skeleton-shimmer shrink-0"></div>
                          <div className="w-8 h-8 bg-slate-200 rounded-xl skeleton-shimmer shrink-0"></div>
                          <div className="flex-1 flex flex-col gap-2">
                            <div className="h-3 w-2/3 bg-slate-200 rounded-md skeleton-shimmer"></div>
                            <div className="h-2.5 w-1/3 bg-slate-200 rounded-md skeleton-shimmer"></div>
                          </div>
                        </div>
                        <div className="h-6 w-16 bg-slate-200 rounded-lg skeleton-shimmer"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeSchoolList ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  
                  {/* Header list details */}
                  <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {(activeSchoolList as any).isOfficial ? (
                            <span className="bg-emerald-650 text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[3]" /> Lista Oficial RD
                            </span>
                          ) : (
                            <span className="bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-300" /> Lista Colaborada
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-bold">Año Lectivo {activeSchoolList.academicYear}</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">{activeSchoolList.schoolName}</h3>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">Grado: <span className="text-blue-600">{activeSchoolList.grade}</span></p>
                      </div>

                      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                        <button
                          type="button"
                          onClick={handleToggleAllSchoolItems}
                          className="text-xs font-bold text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white bg-slate-150 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-slate-200/40 dark:border-slate-700/60"
                        >
                          {checkedProductIds.length === activeSchoolList.items.length ? "Desmarcar Todos" : "Marcar Todos"}
                        </button>
                      </div>
                    </div>

                    {/* Progress tracking section */}
                    {(() => {
                      const checkedItemsCount = activeSchoolList.items.filter(item => checkedProductIds.includes(item.productId)).length;
                      const totalItemsCount = activeSchoolList.items.length;
                      const progressPct = totalItemsCount > 0 ? Math.round((checkedItemsCount / totalItemsCount) * 100) : 0;
                      return (
                        <div className="w-full bg-slate-100/50 dark:bg-slate-950/40 rounded-xl p-3 border border-slate-200/65 dark:border-slate-800">
                          <div className="flex justify-between items-center text-[10.5px] font-extrabold text-slate-600 dark:text-slate-350 mb-1.5 uppercase tracking-wide">
                            <span>Progreso de Lista: {checkedItemsCount} de {totalItemsCount} útiles</span>
                            <span className="text-blue-600 dark:text-blue-400">{progressPct}%</span>
                          </div>
                          <div className="w-full bg-slate-200/70 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-350"
                              style={{ width: `${progressPct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Contributor appreciation bar for community lists */}
                  {!(activeSchoolList as any).isOfficial && (
                    <div className="bg-indigo-50/40 border-b border-indigo-100/60 p-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-indigo-600/10 p-2.5 rounded-xl text-indigo-700 mt-0.5 sm:mt-0">
                          <User className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                            Contribución Comunitaria
                          </p>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">
                            Subido amablemente por <span className="font-extrabold text-indigo-600">{(activeSchoolList as any).createdBy || 'Padre Colaborador'}</span> para apoyar a estudiantes de este grado.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
                        <span className="text-xs text-slate-500 font-bold font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs">
                          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                          {(activeSchoolList as any).likes || 0} gracias
                        </span>
                        <button
                          type="button"
                          onClick={() => handleLikeCommunityList(activeSchoolList.id)}
                          className="bg-red-50 hover:bg-red-100 border border-red-100 active:scale-95 text-red-600 font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Heart className="w-4 h-4 text-red-500" />
                          Dar las Gracias
                        </button>
                      </div>
                    </div>
                  )}

                  {/* List of items */}
                  <div className="divide-y divide-slate-100">
                    {activeSchoolList.items.map((schoolItem, idx) => {
                      const matchedProduct = PRODUCTS.find(p => p.id === schoolItem.productId);
                      const isChecked = checkedProductIds.includes(schoolItem.productId);

                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleCheckedProduct(schoolItem.productId)}
                          className={`p-5 flex items-start sm:items-center justify-between gap-4 border-l-4 transition-all duration-200 cursor-pointer ${isChecked ? 'border-blue-650 bg-blue-50/20 h-full' : 'border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50/40'}`}
                        >
                          <div className="flex items-start gap-4 min-w-0">
                            
                            {/* Checkbox item */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleCheckedProduct(schoolItem.productId);
                              }}
                              className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center mt-1 sm:mt-0 flex-shrink-0 transition-all ${isChecked ? 'bg-blue-600 border-blue-650 text-white shadow-md shadow-blue-500/10' : 'border-slate-300 text-transparent hover:border-slate-400 bg-white'}`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                            </button>

                            <div className="bg-blue-50/80 text-blue-850 font-black w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 border border-blue-100">
                              {schoolItem.quantity}x
                            </div>

                            {matchedProduct && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-0.5 border border-slate-200 shrink-0 flex items-center justify-center">
                                <img
                                  src={matchedProduct.image}
                                  alt={matchedProduct.name}
                                  referrerPolicy="no-referrer"
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <h4 className={`text-sm font-extrabold text-slate-800 truncate transition-colors ${isChecked ? 'text-slate-800' : 'text-slate-600'}`}>
                                {schoolItem.name}
                              </h4>
                              <p className="text-[11px] text-slate-400 font-bold mt-1 flex items-center gap-1.5 flex-wrap">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 text-[10px]">Marca: {matchedProduct?.brand || 'Oficial'}</span>
                                {schoolItem.isRequired ? (
                                  <span className="text-[10px] text-red-600 font-extrabold uppercase bg-red-50 px-1.5 py-0.5 rounded border border-red-100/50">Requerido</span>
                                ) : (
                                  <span className="text-[10px] text-slate-500 font-extrabold uppercase bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/50">Opcional</span>
                                )}
                              </p>
                              {schoolItem.notes && (
                                <p className="text-[11px] text-blue-700 bg-blue-50/60 px-3 py-1.5 rounded-xl mt-2 inline-block font-bold border border-blue-100/50">
                                  💡 {schoolItem.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Item price / actions context */}
                          <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            {matchedProduct ? (
                              <div className="text-right flex flex-col items-end">
                                <span className="text-[10.5px] text-slate-400 font-bold">RD$ {matchedProduct.price} c/u</span>
                                <span className="text-sm font-black text-slate-900">RD$ {matchedProduct.price * schoolItem.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedProductDetail(matchedProduct)}
                                  className="text-[10.5px] font-bold text-blue-600 hover:text-blue-800 mt-1 transition-all flex items-center gap-0.5"
                                >
                                  Ver detalle 🔍
                                </button>
                              </div>
                            ) : (
                              <div className="text-right flex flex-col items-end">
                                <span className="text-[10.5px] text-slate-400 font-bold">RD$ {(schoolItem as any).estimatedPrice || 150} c/u*</span>
                                <span className="text-sm font-black text-slate-900">RD$ {((schoolItem as any).estimatedPrice || 150) * schoolItem.quantity}</span>
                                <span className="text-[9px] text-slate-400 font-medium italic mt-1">* Estimado</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Real-time comparison across all 8 supermarkets for this exact school supply list! */}
                  {checkedProductIds.length > 0 && schoolPackFinancials.storeCosts && schoolPackFinancials.storeCosts.length > 0 && (
                    <div className="bg-slate-50/50 border-t border-slate-100 p-5 select-none">
                      <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-3.5 flex items-center gap-1.5 matches-title">
                        <span>📊</span> COMPARATIVA REAL EN SUPERMERCADOS RD (ESTIMADO DE PACK)
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {schoolPackFinancials.storeCosts.map((store, index) => {
                          const isCheapest = index === 0;
                          return (
                            <div
                              key={store.id}
                              className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-150 ${
                                isCheapest
                                  ? 'bg-emerald-50/80 border-emerald-400 shadow-xs ring-1 ring-emerald-400'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 min-w-0">
                                  <span className="shrink-0">{store.logo}</span>
                                  <span className="truncate">{store.name}</span>
                                </span>
                                {isCheapest && (
                                  <span className="bg-emerald-600 text-white text-[7.5px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 shrink-0">
                                    ¡Mejor!
                                  </span>
                                )}
                              </div>
                              <div className="mt-2 text-right">
                                <span className={`text-[10px] block font-bold ${isCheapest ? 'text-emerald-700' : 'text-slate-400'}`}>
                                  Total con ITBIS
                                </span>
                                <span className={`font-black text-xs sm:text-sm block tracking-tight ${isCheapest ? 'text-emerald-800 font-extrabold' : 'text-slate-800'}`}>
                                  RD$ {store.total.toLocaleString('es-DO')}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-3.5 text-center leading-normal">
                        ⚡ Comparativa en base a precios reales de góndola. Incluye el cálculo automático del ITBIS (18%) correspondiente.
                      </p>
                    </div>
                  )}

                  {/* Dynamic Pack Checklist Summary Bar - Gorgeous modern summary panel */}
                  <div className="bg-slate-50 border-t border-slate-200/60 p-6 flex flex-col md:flex-row justify-between items-center gap-5 rounded-b-2xl">
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-1.5">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                        <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Resumen de Pack Personalizado</p>
                      </div>
                      <p className="text-slate-800 font-bold mt-1.5 text-xs sm:text-sm">
                        Seleccionados: <span className="text-blue-700 font-extrabold text-base">{checkedProductIds.length}</span> de <span className="font-extrabold">{activeSchoolList.items.length} útiles</span> • Total estimado: <span className="bg-blue-50 text-blue-750 font-black px-2 py-1 rounded-lg text-base ml-1">RD$ {schoolPackFinancials.total}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        * Desmarca aquellos útiles de la lista que ya poseas en casa antes de agregar al carrito.
                      </p>
                    </div>

                    <button
                      onClick={handleAddCheckedSchoolListToCart}
                      disabled={checkedProductIds.length === 0}
                      className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-300 disabled:to-slate-350 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-orange-500/15 disabled:shadow-none hover:shadow-orange-500/25 hover:scale-[1.02] active:scale-98 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                      Anexar al Carrito ({schoolPackFinancials.count} útiles)
                    </button>
                  </div>

                </div>
              ) : (
                <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center shadow-sm">
                  <div className="bg-orange-50 text-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100">
                    <Info className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">Aún no se ha cargado una lista digital para este grado</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                    Estamos actualizando las listas deútiles oficiales para el "{selectedSchool}". No te preocupes, puedes copiar y pegar el texto de tu lista en nuestro <strong>Asistente de IA</strong> o bien explorar todo el catálogo de productos escolares libremente.
                  </p>
                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={() => setActiveTab('scanner')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                    >
                      Usar Escáner de Listas por IA
                    </button>
                    <button
                      onClick={() => setActiveTab('store')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                    >
                      Explorar Catálogo Tienda
                    </button>
                  </div>
                </div>
              )}

              {/* BRAND AD Ribbon / TRUST METRICS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4.5 rounded-xl border border-slate-200 flex gap-3 items-center">
                  <Truck className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs">Despachos rápidos</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Enviamos en 24-48 horas directamente a tu puerta.</p>
                  </div>
                </div>
                <div className="bg-white p-4.5 rounded-xl border border-slate-200 flex gap-3 items-center">
                  <Award className="w-8 h-8 text-orange-500 flex-shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs">Marcas aprobadas</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Mascot, Maped, Pelikan y Faber-Castell 100% de calidad.</p>
                  </div>
                </div>
                <div className="bg-white p-4.5 rounded-xl border border-slate-200 flex gap-3 items-center">
                  <MessageSquare className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs">Soporte por WhatsApp</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">¿No encuentras tu colegio? Te ayudamos por chat.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SMART AI LIST SCANNER */}
          {activeTab === 'scanner' && (
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-5">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500 fill-orange-500" />
                    Asistente de Listas Escolares Inteligente (Gemini AI)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    ¿Te enviaron la lista de útiles por WhatsApp, la copiaste de un PDF o tienes un borrador de texto? ¡Pégalo abajo! Nuestro motor alimentado por el modelo **Gemini 3.5 Flash** analizará el escrito libre en español Dominicano, extraerá las cantidades estimadas y las emparejará automáticamente con la mercancía de nuestra tienda en tiempo real.
                  </p>
                </div>

                {/* Mode Selector */}
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 max-w-xs self-start">
                  <button
                    type="button"
                    onClick={() => {
                      setScannerMode('text');
                      setScannerImageBase64(null);
                      setScannerImageMimeType(null);
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      scannerMode === 'text'
                        ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white'
                    }`}
                  >
                    <span>✍️ Escribir Texto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScannerMode('image');
                      setScannerInput('');
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      scannerMode === 'image'
                        ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white'
                    }`}
                  >
                    <span>📸 Subir Foto/Imagen</span>
                  </button>
                </div>

                {scannerMode === 'text' ? (
                  <>
                    {/* TEST PRESETS */}
                    <div className="bg-slate-100 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-blue-600" />
                        Prueba rápido seleccionando uno de estos ejemplos dominicanos:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {PRESET_LIST_EXTRACTS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setScannerInput(preset.text)}
                            className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 hover:text-blue-700 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* TEXT AREA */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pega aquí el escrito o texto de tu lista escolar</label>
                      <textarea
                        rows={6}
                        value={scannerInput}
                        onChange={(e) => setScannerInput(e.target.value)}
                        placeholder="Ej: 3 cuadernos Mascot, una caja de lapices de 24 colores, juego de escuadras Maped..."
                        className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 leading-relaxed resize-none"
                      ></textarea>
                    </div>
                  </>
                ) : (
                  /* IMAGE UPLOAD ZONE */
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-slate-505 uppercase tracking-wide">Sube la foto de la lista de útiles</label>
                    
                    {!scannerImageBase64 ? (
                      <label className="border-2 border-dashed border-slate-305 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-all text-center">
                        <div className="bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 p-4 rounded-full">
                          <Sparkles className="w-6 h-6 animate-pulse text-orange-500" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">Haz clic para seleccionar o arrastra la foto de tu lista</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1">Formatos soportados: PNG, JPG, JPEG, WebP. Máximo 10MB.</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="relative max-w-sm mx-auto rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2">
                          <img src={scannerImageBase64} alt="Lista escolar cargada" className="max-h-64 object-contain rounded-lg" />
                          <button
                            type="button"
                            onClick={() => {
                              setScannerImageBase64(null);
                              setScannerImageMimeType(null);
                            }}
                            className="absolute top-2 right-2 bg-slate-900/80 hover:bg-red-600 text-white rounded-full p-1.5 transition-all shadow-md cursor-pointer"
                            title="Quitar imagen"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Foto de lista escolar seleccionada</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Gemini extraerá automáticamente los útiles desde esta imagen.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-400 max-w-sm pl-2">
                    * El asistente interpretará nombres genéricos y los enlazará a marcas reales de nuestra tienda.
                  </p>
                  <button
                    type="button"
                    disabled={isScanning}
                    onClick={handleRunAIScan}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-350 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2 transition-all cursor-pointer inline-shrink-0"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analizando Lista con Gemini...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-orange-400 fill-orange-400" />
                        Comenzar Escaneo Inteligente
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* LIST SCANNED RESULTS */}
              {isScanning ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 flex flex-col gap-4 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-200 skeleton-shimmer"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded-md skeleton-shimmer"></div>
                  </div>
                  <div className="divide-y divide-slate-100 mt-2">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className="w-12 h-12 bg-slate-200 rounded-xl skeleton-shimmer shrink-0"></div>
                          <div className="flex-1 flex flex-col gap-2">
                            <div className="h-3 w-3/4 bg-slate-200 rounded-md skeleton-shimmer"></div>
                            <div className="h-2.5 w-1/2 bg-slate-200 rounded-md skeleton-shimmer"></div>
                          </div>
                        </div>
                        <div className="h-8 w-20 bg-slate-200 rounded-lg skeleton-shimmer"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : scannerMatches.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        Resultados del Análisis de Inteligencia Artificial
                      </h3>
                      {scanResultNotice && <p className="text-xs text-blue-700 font-bold mt-1 bg-blue-50/60 border border-blue-100 px-2.5 py-0.5 rounded-lg inline-block">{scanResultNotice}</p>}
                    </div>

                    <button
                      onClick={handleAddSelectedAIItemsToCart}
                      disabled={selectedScanProductIds.length === 0}
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Añadir seleccionados al carrito ({selectedScanProductIds.length})
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {scannerMatches.map((match, idx) => {
                      const matchedItem = PRODUCTS.find(p => p.id === match.productId);
                      const isChecked = matchedItem ? selectedScanProductIds.includes(match.productId) : false;

                      return (
                        <div key={idx} className={`p-5 flex items-start sm:items-center justify-between gap-4 transition-all ${isChecked ? 'bg-blue-50/10' : 'bg-slate-100/10 opacity-70'}`}>
                          <div className="flex items-start gap-3.5 min-w-0">
                            
                            {/* Checkbox match toggle */}
                            {matchedItem ? (
                              <button
                                onClick={() => handleToggleScanSelection(matchedItem.id)}
                                className={`w-5 h-5 rounded-md border flex items-center justify-center mt-1 sm:mt-0 flex-shrink-0 transition-all ${isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 text-transparent bg-white hover:border-slate-400'}`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </button>
                            ) : (
                              <div className="w-5 h-5 rounded-md bg-yellow-50 border border-yellow-200 flex items-center justify-center text-[10px] text-yellow-700 font-bold flex-shrink-0">
                                !
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] bg-slate-150 text-slate-500 font-extrabold px-1.5 py-0.2 rounded uppercase">Leído:</span>
                                <span className="text-xs font-bold text-slate-800">"{match.searchedName}"</span>
                                <span className="text-xs text-slate-400 font-semibold">• Cantidad solicitada: {match.extractedQuantity}</span>
                              </div>
                              
                              {matchedItem ? (
                                <div className="mt-2 text-left bg-blue-50/30 p-2.5 rounded-lg border border-blue-100/60 max-w-lg flex gap-3">
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white p-1 border border-slate-200 shrink-0 flex items-center justify-center">
                                    <img
                                      src={matchedItem.image}
                                      alt={matchedItem.name}
                                      referrerPolicy="no-referrer"
                                      className="max-w-full max-h-full object-contain"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-extrabold text-blue-800 flex items-center gap-1.5">
                                      <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                                      {matchedItem.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 mt-1 italic">{match.explanation}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-[10px] bg-white text-blue-700 border border-blue-100 px-1.5 py-0.2 rounded-md font-extrabold">Confianza de IA: {Math.round(match.matchConfidence * 100)}%</span>
                                      <span className="text-[10px] text-slate-400 font-medium">Marca: {matchedItem.brand}</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-yellow-700 bg-yellow-50/80 border border-yellow-105 p-2.5 rounded-xl mt-2.5 font-medium leading-relaxed">
                                  ⚠️ No pudimos sincronizar un útil idéntico en stock. {match.explanation}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            {matchedItem ? (
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-extrabold text-slate-800">RD$ {matchedItem.price * (match.extractedQuantity || 1)}</span>
                                <span className="text-[10px] text-slate-400 font-bold">RD$ {matchedItem.price} c/u</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 font-bold">—</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMPLETE STORE / PRODUCTS */}
          {activeTab === 'store' && (
            <div className="flex flex-col gap-6">
              
              {/* SEARCH & FILTERS BAR */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-4">
                
                {/* Search Text Input */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Busca cuadernos cosidos Mascot, mochilas Oxford, témperas, lápices para el colegio..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/50 w-5 h-5 rounded-full flex items-center justify-center font-bold"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Categories Slider */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 whitespace-nowrap rounded-lg text-xs font-bold transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

              </div>

              {/* PRODUCT CARDS LIST */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4.5">
                  {filteredProducts.map((prod, index) => {
                    const storePricesList = [
                      { name: 'La Sirena', logo: '🧜‍♀️', price: prod.storePrices?.sirena || prod.price },
                      { name: 'Jumbo', logo: '🐘', price: prod.storePrices?.jumbo || prod.price },
                      { name: 'S. Nacional', logo: '🛒', price: prod.storePrices?.nacional || prod.price },
                      { name: 'Plaza Lama', logo: '🦙', price: prod.storePrices?.plazalama || prod.price },
                      { name: 'S. Bravo', logo: '🍎', price: prod.storePrices?.bravo || prod.price },
                      { name: 'A. Garrido', logo: '🛍️', price: prod.storePrices?.garrido || prod.price },
                      { name: 'S. Olé', logo: '🥑', price: prod.storePrices?.ole || prod.price },
                      { name: 'Carrefour', logo: '🇨🇵', price: prod.storePrices?.carrefour || prod.price }
                    ];
                    const sortedPrices = [...storePricesList].sort((a, b) => a.price - b.price);
                    const cheapest = sortedPrices[0];
                    const maxPrice = sortedPrices[sortedPrices.length - 1].price;
                    const isExpanded = !!expandedProductPrices[prod.id];

                    return (
                      <React.Fragment key={prod.id}>
                        <div
                          className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-blue-400 hover:scale-[1.005] active:scale-99 transition-all duration-200 cursor-pointer group"
                          onClick={() => setSelectedProductDetail(prod)}
                        >
                        {/* Product Head: Centered e-commerce style product image */}
                        <div className="relative h-24 sm:h-28 w-full bg-white p-2 overflow-hidden border-b border-slate-100 flex items-center justify-center">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-350"
                          />
                          {prod.isFeatured && (
                            <span className="absolute top-2 left-2 bg-orange-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-xs">
                              Más Vendido
                            </span>
                          )}
                          <span className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs text-slate-800 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs border border-slate-200">
                            {prod.brand}
                          </span>
                        </div>

                        {/* Product Details */}
                        <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5 bg-white">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[8.5px] text-blue-600 font-extrabold uppercase tracking-wide">
                              <span>{CATEGORIES.find(c => c.id === prod.category)?.name || prod.category}</span>
                              <span className="text-slate-400 font-medium normal-case">{prod.brand}</span>
                            </div>
                            <h4 className="text-[12px] font-black text-slate-800 leading-snug h-[34px] line-clamp-2">
                              {prod.name}
                            </h4>
                          </div>

                          {/* Star Rating and pricing breakdown - Highly Compact */}
                          <div className="flex items-center justify-between gap-2 border-t border-slate-100/80 pt-2">
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span className="font-extrabold text-slate-800">{prod.rating}</span>
                              <span className="opacity-80">({prod.reviewsCount})</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[13.5px] font-black text-blue-900 font-sans">RD$ {prod.price}</span>
                            </div>
                          </div>

                          {/* Expandable/Collapsible Supermarket List Button - Zero bulky height by default! */}
                          <div className="border border-slate-200 rounded-lg overflow-hidden select-none bg-slate-50/70 hover:bg-slate-50 hover:border-slate-300 transition-all">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedProductPrices(prev => ({ ...prev, [prod.id]: !prev[prod.id] }));
                              }}
                              className="w-full flex items-center justify-between p-1.5 text-left cursor-pointer transition-colors leading-none hover:text-blue-600 group/btn"
                            >
                              <div className="flex items-center gap-1 min-w-0">
                                <span className="text-xs shrink-0">{cheapest.logo}</span>
                                <span className="text-[10px] font-bold text-slate-700 truncate max-w-[125px] sm:max-w-none">
                                  {cheapest.name}: <strong className="text-emerald-700 font-extrabold font-mono text-[9.5px]">RD$ {cheapest.price}</strong>
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 text-[9px] text-slate-400 font-black group-hover/btn:text-blue-600 shrink-0">
                                <span>{isExpanded ? 'Ocultar' : 'Comparar'}</span>
                                <span className={`transform transition-transform duration-150 inline-block ${isExpanded ? 'rotate-180 text-blue-600' : 'rotate-0'}`}>▼</span>
                              </div>
                            </button>

                            {/* COLLAPSIBLE DETAILS (DESPLIEGUE COMPACTO) */}
                            {isExpanded && (
                              <div className="border-t border-slate-200 bg-white p-2 flex flex-col gap-1.5 animate-fadeIn">
                                <div className="flex justify-between items-center text-[8px] font-black text-slate-400 tracking-wider uppercase leading-none pb-1 border-b border-slate-100">
                                  <span>Supermercados RD</span>
                                  <span>Con ITBIS</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-1 text-[9px] font-bold">
                                  {storePricesList.map((st, idx) => {
                                    const isStoreCheapest = st.price === cheapest.price;
                                    return (
                                      <div
                                        key={idx}
                                        className={`flex items-center justify-between p-1 rounded border leading-none ${
                                          isStoreCheapest
                                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-black'
                                            : 'bg-slate-50/30 border-slate-100 text-slate-600'
                                        }`}
                                      >
                                        <span className="flex items-center gap-0.5 truncate max-w-[65px]">
                                          <span className="shrink-0">{st.logo}</span>
                                          <span className="truncate text-[8.5px]">{st.name.replace('Superm. ', 'S. ').replace('La ', '')}</span>
                                        </span>
                                        <span className={`font-mono text-[8.5px] font-black ${isStoreCheapest ? 'text-emerald-700' : 'text-slate-700'}`}>
                                          RD$ {st.price}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="text-[8px] text-slate-400 text-center font-semibold leading-none">
                                  Rango: RD$ {cheapest.price} - {maxPrice}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Card Buttons */}
                          <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-slate-100 mt-0.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProductDetail(prod);
                              }}
                              className="col-span-2 text-center bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-extrabold text-[10.5px] py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              Detalle
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(prod);
                              }}
                              className="col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10.5px] py-1.5 rounded-lg shadow-2xs hover:shadow-xs hover:scale-[1.01] active:scale-99 transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3 stroke-[2.5]" /> Añadir
                            </button>
                          </div>
                        </div>

                      </div>
                      {(index + 1) % 8 === 0 && (
                        <div className="col-span-1 sm:col-span-2 md:col-span-3">
                          <React.Suspense fallback={<div className="animate-pulse bg-slate-100 h-24 w-full rounded-lg my-4 border border-slate-200"></div>}>
                            <AdSenseBanner
                              slot={`infeed-${index}`}
                              format="horizontal"
                              label="Anuncio Patrocinado - Catálogo"
                            />
                          </React.Suspense>
                        </div>
                      )}
                    </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center shadow-sm">
                  <div className="bg-slate-50 text-slate-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No encontramos útiles para esta búsqueda</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                    Intenta buscar con nombres más simples como "mochila", "cuaderno", "tijeras", o prueba cambiando la categoría de arriba.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: HELP & FAQS */}
          {activeTab === 'faqs' && (
            <React.Suspense fallback={<div className="animate-pulse bg-slate-100 h-96 w-full rounded-2xl border border-slate-200"></div>}>
              <FaqsView />
            </React.Suspense>
          )}

          {/* TAB 4.5: ADMIN INTELLIGENCE & AUDIT LANDING */}
          {activeTab === 'admin' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              
              <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-6 text-white border border-indigo-500/30 shadow-md">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-violet-200" />
                  <h3 className="text-base font-black uppercase tracking-wider text-violet-50">
                    Panel de Inteligencia Escolar & Auditoría IA
                  </h3>
                </div>
                <p className="text-xs text-indigo-100 mt-2 leading-relaxed max-w-2xl select-text">
                  Monitorea en tiempo real los hábitos de búsqueda de los padres dominicanos. Regula el motor de concordancia semántica de Gemini AI, verificando o corrigiendo las coincidencias sospechosas antes de empacar.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button 
                    onClick={fetchAdminReports}
                    className="bg-white/15 hover:bg-white/25 active:scale-98 border border-white/20 text-white font-extrabold text-[10.5px] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    🔄 Recargar Datos En Vivo
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/run-sync', { method: 'POST' });
                        if (res.ok) {
                          const data = await res.json();
                          showToast(data.message, "success");
                          fetchAdminReports();
                        }
                      } catch (err) {
                        showToast("No se pudo iniciar el proceso de sincronización.", "error");
                      }
                    }}
                    className="bg-purple-500 hover:bg-purple-600 active:scale-98 border border-purple-400 text-white font-extrabold text-[10.5px] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    ⏰ Forzar Sincronización de Medianoche (30 Días)
                  </button>
                </div>
              </div>

              {isAdminLoading ? (
                <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                  <span className="text-xs font-bold text-slate-500">Compilando informes de góndolas y logs de búsqueda...</span>
                </div>
              ) : (
                <div className="flex flex-col gap-6">

                  {/* Operational Metrics Cards row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest leading-none block">Alertas de Precios Activas</span>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-2xl font-black text-slate-800">
                          {analyticsData?.alertCount || 0}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">Padres suscritos</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest leading-none block">Enlaces por Revisar</span>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-2xl font-black text-slate-800">
                          {pendingReviews.length}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">En cola de Gemini</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest leading-none block">Búsquedas Logueadas</span>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-2xl font-black text-slate-800">
                          {analyticsData?.popularSearches?.reduce((a: number, b: any) => a + b.count, 0) || 0}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">Consultas registradas</span>
                      </div>
                    </div>
                  </div>

                  {/* Search terms Rank and Store prices Average comparative */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Ranked Searches */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block border-b border-slate-100 pb-2 mb-3">
                        🎯 Tendencias de Interés Escolar (Padres de Familia)
                      </span>
                      {analyticsData?.popularSearches && analyticsData.popularSearches.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {analyticsData.popularSearches.slice(0, 5).map((kw: any, idx: number) => {
                            const maxKw = Math.max(...analyticsData.popularSearches.map((k: any) => k.count)) || 1;
                            const percent = (kw.count / maxKw) * 100;
                            return (
                              <div key={idx} className="flex flex-col gap-1 text-xs">
                                <div className="flex justify-between items-center font-bold">
                                  <span className="text-slate-700 capitalize">"{kw.term}"</span>
                                  <span className="text-slate-500 text-[10.5px] font-mono font-black">{kw.count} búsquedas</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-violet-600 h-full rounded-full transition-all duration-350"
                                    style={{ width: `${percent}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-6 font-semibold">
                          No hay logs de búsqueda acumulados todavía. Empieza a buscar en el catálogo superior.
                        </p>
                      )}
                    </div>

                    {/* Competitiveness Index (Average Store Cost) */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block border-b border-slate-100 pb-2 mb-3">
                        🏛️ Índice de Competitividad de Góndolas Dominicana
                      </span>
                      {analyticsData?.averageCosts ? (
                        <div className="flex flex-col gap-2.5">
                          {Object.entries(analyticsData.averageCosts)
                            .sort((a: any, b: any) => a[1] - b[1])
                            .map(([storeId, cost]: any, index: number) => {
                              const storeMap: Record<string, string> = {
                                sirena: "La Sirena",
                                jumbo: "Jumbo",
                                nacional: "S. Nacional",
                                plazalama: "Plaza Lama",
                                bravo: "Superm. Bravo",
                                garrido: "A. Garrido",
                                ole: "Superm. Olé",
                                carrefour: "Carrefour RD"
                              };
                              const isCheapestStore = index === 0;
                              return (
                                <div key={storeId} className="flex justify-between items-center text-xs">
                                  <div className="flex items-center gap-1.5 font-bold">
                                    <span className="bg-slate-100 border border-slate-200 text-slate-600 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-sans">
                                      #{index + 1}
                                    </span>
                                    <span className="text-slate-700 capitalize">{storeMap[storeId] || storeId}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-slate-900 font-mono font-extrabold">RD$ {Math.round(cost)}</span>
                                    {isCheapestStore && (
                                      <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-black px-1.5 py-0.5 rounded leading-none">
                                        RECOMENDADO
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-6 font-semibold">Cargando cálculos de indexación...</p>
                      )}
                    </div>

                  </div>

                  {/* Manual Review Match Management Interface */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3 mb-4 select-text">
                      <div>
                        <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                          🔎 Cola de Validación de Coincidencias de Listas (Gemini Engine)
                        </span>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          Verifica las aproximaciones del extractor inteligente. Filtra y autoriza para mantener el catálogo limpio.
                        </p>
                      </div>
                      <span className="bg-slate-100 text-slate-700 font-black text-[10.5px] px-3 py-1 rounded-full border border-slate-200">
                        {pendingReviews.length} pendientes
                      </span>
                    </div>

                    {pendingReviews.length === 0 ? (
                      <div className="text-center py-10 select-none">
                        <div className="text-[28px] mb-2">🎉</div>
                        <h4 className="text-xs font-extrabold text-slate-700">¡Ninguna coincidencia dudosa pendiente!</h4>
                        <p className="text-[10px] text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                          Gemini AI ha catalogado con alta confianza todos los materiales de las listas cargadas por los padres hasta el momento.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4.5">
                        {pendingReviews.map((rev) => (
                          <div key={rev.id} className="border border-slate-200 rounded-xl p-4 bg-slate-100/40 hover:bg-slate-50 transition-colors flex flex-col gap-3">
                            <div className="flex flex-wrap items-start justify-between gap-2.5">
                              <div className="min-w-0 flex-1">
                                <span className="text-[9px] text-violet-605 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded font-black font-mono">
                                  ID: {rev.id}
                                </span>
                                <h5 className="text-xs font-black text-slate-900 mt-1 select-text">
                                  Texto extraído: <span className="text-slate-500 font-medium">"{rev.searchedName}"</span>
                                </h5>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5 md:mt-1 leading-relaxed">
                                  Asociación IA: <strong className="text-slate-700 font-black">"{rev.suggestedProductName}"</strong>
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[10px] text-slate-500 font-bold">Confianza:</span>
                                <span className={`text-[10.5px] font-black font-sans px-2 py-0.5 rounded ${
                                  rev.confidence >= 0.75 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                                }`}>
                                  {Math.round(rev.confidence * 100)}%
                                </span>
                              </div>
                            </div>

                            {rev.explanation && (
                              <p className="bg-white border border-slate-200 p-2.5 rounded-lg text-[9.5px] font-medium leading-relaxed text-slate-500 select-text">
                                💡 <span className="font-extrabold text-slate-600">Comentario del Motor:</span> {rev.explanation}
                              </p>
                            )}

                            {/* Decision controls */}
                            <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-between border-t border-slate-200/60 pt-2.5 mt-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] text-slate-400 font-extrabold uppercase">Acción:</span>
                                <button
                                  onClick={() => handleReviewAction(rev.id, 'APPROVE')}
                                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-[9.5px] px-3 py-1.5 rounded-lg cursor-pointer"
                                >
                                  ✓ Autorizar
                                </button>
                                <button
                                  onClick={() => handleReviewAction(rev.id, 'REJECT')}
                                  className="bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-extrabold text-[9.5px] px-3 py-1.5 rounded-lg cursor-pointer"
                                >
                                  ✗ Desvincular
                                </button>
                              </div>

                              {/* Manual mapping change choice */}
                              <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                                <span className="text-[9px] text-slate-400 font-extrabold uppercase">Cartografiar a útil:</span>
                                <select
                                  className="bg-white border border-slate-200 rounded-xl text-[9.5px] p-1.5 font-bold outline-none max-w-[200px]"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleReviewAction(rev.id, 'UPDATE', e.target.value);
                                    }
                                  }}
                                  defaultValue=""
                                >
                                  <option value="">-- Corregir Manualmente --</option>
                                  {PRODUCTS.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} (RD$ {p.price})</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 5: PAST ORDERS HISTORY */}
          {activeTab === 'history' && (
            <div className="flex flex-col gap-6">
              
              <div className="bg-white rounded-2xl p-5 border border-slate-200">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Historial de Pedidos de Colegios Confirmados
                </h3>
                <p className="text-xs text-slate-500 mt-1.5">
                  Lleva la contabilidad de tus compras, y vuelve a imprimir las garantías escolares de tus despachos para tus hijos.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-[10px] text-blue-700 font-extrabold uppercase bg-blue-100 px-3 py-1 rounded-full border border-blue-200">PEDIDO: {order.id}</span>
                        <h4 className="text-sm font-extrabold text-slate-800 mt-1.5">{order.date}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500">Monto total:</span>
                        <span className="text-sm font-extrabold text-slate-900">RD$ {order.total}</span>
                        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                          {order.status === 'pending' ? 'Listo para Despacho' : order.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex justify-between text-xs font-semibold text-slate-700">
                          <span>{item.product.name} (x{item.quantity})</span>
                          <span className="font-extrabold text-slate-900">RD$ {item.product.price * item.quantity}</span>
                        </div>
                      ))}

                      {/* Calculations breakdown for the historical invoice */}
                      <div className="pt-4 mt-2 flex flex-col gap-1.5 bg-slate-50 p-4 rounded-xl text-xs text-slate-600 font-medium">
                        <div className="flex justify-between">
                          <span>Subtotal de Artículos</span>
                          <span>RD$ {order.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ITBIS (18.00% Ley Nacional)</span>
                          <span>RD$ {order.tax}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Costo de Despacho</span>
                          <span>RD$ {order.subtotal >= 2500 ? '0 (¡Gratis!)' : '150'}</span>
                        </div>
                        <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t border-slate-200 pt-2 px-1 mt-1">
                          <span>Monto Total de Pago</span>
                          <span className="text-blue-700">RD$ {order.total}</span>
                        </div>
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-sm">
                          👨‍🎓 Padre de familia: <strong>{order.shippingDetails.name}</strong> • Entrega: {order.shippingDetails.address}, {order.shippingDetails.city}
                        </p>
                        <button
                          onClick={() => setLatestSuccessOrder(order)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Printer className="w-4 h-4 text-slate-500" /> Imprimir copia factura
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* DYNAMIC SEASONAL BLOG ARTICLES FETCHED FROM API */}
          {articles.length > 0 && activeTab !== 'history' && (
            <div className="bg-blue-50/40 rounded-2xl p-6 border border-blue-105 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <h3 className="text-xs font-extrabold text-blue-900 uppercase tracking-widest">Guías del Regreso a Clases Dominicano</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map(art => (
                  <div key={art.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between gap-3 shadow-xs hover:shadow-md transition-all">
                    {art.imageUrl && (
                      <div className="relative h-32 w-full overflow-hidden shrink-0 border-b border-slate-100">
                        <img 
                          src={art.imageUrl} 
                          alt={art.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-blue-600 text-white font-extrabold text-[8px] uppercase px-2 py-0.5 rounded-md tracking-wider shadow-xs">
                          Guía Escolar
                        </span>
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                      <div>
                        <h4 className="text-xs sm:text-[13px] font-black text-slate-900 leading-snug">{art.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-3 leading-relaxed">{art.summary}</p>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-2.5 mt-2">
                        <span className="truncate max-w-[120px]">{art.author}</span>
                        <span className="shrink-0">📅 {art.publishDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Interactive Cart & Delivery Details Form (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-28">
            
            <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center select-none">
              <h3 className="font-extrabold text-xs tracking-tight uppercase flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-orange-400 stroke-[2.5]" />
                Lista de Útiles
              </h3>
              {totalCartQty > 0 && (
                <span className="bg-blue-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {totalCartQty} útiles
                </span>
              )}
            </div>

            {/* Cart Body */}
            <div className="p-5 flex flex-col gap-4">
              {cart.length > 0 ? (
                <>
                  <div className="max-h-[180px] overflow-y-auto divide-y divide-slate-100 pr-1 text-slate-700">
                    {cart.map(item => (
                      <div key={item.product.id} className="py-2.5 flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h4>
                          <p className="text-[10px] text-blue-600 font-bold mt-0.5">{item.product.brand}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">
                            Precio de referencia: RD$ {item.product.price}
                          </p>
                        </div>

                        {/* Quantity Incrementor */}
                        <div className="flex flex-col items-end gap-1 px-1 flex-shrink-0">
                          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-lg">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                              aria-label="Disminuir cantidad"
                              className="text-slate-500 hover:text-slate-800 w-4 h-4 font-bold flex items-center justify-center bg-white rounded shadow-2xs transition-colors text-xs"
                            >
                              -
                            </button>
                            <span className="text-[11px] font-extrabold text-slate-800 w-4 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                              aria-label="Aumentar cantidad"
                              className="text-slate-500 hover:text-slate-800 w-4 h-4 font-bold flex items-center justify-center bg-white rounded shadow-2xs transition-colors text-xs"
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.product.id)}
                            aria-label={`Quitar ${item.product.name} del carrito`}
                            className="text-[9px] font-bold text-red-500 hover:text-red-750 flex items-center gap-0.5 select-none mt-1"
                          >
                            <Trash2 className="w-3 h-3" /> Quitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Empty cart button */}
                  <div className="flex justify-between items-center text-[10px] border-t border-slate-100 pt-2 bg-slate-50 p-2 rounded-lg">
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-slate-405 hover:text-slate-605 underline font-bold"
                    >
                      Vaciar toda la lista
                    </button>
                    <span className="text-slate-500 font-extrabold">Comparando precios...</span>
                  </div>

                  {/* SUPERMARKETS COMPARATIVE PANEL */}
                  <div className="mt-2 border-t border-slate-100 pt-4">
                    <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <span>📊</span> COMPARATIVA DE SUPERMERCADOS RD
                    </h4>
                    
                    <div className="flex flex-col gap-2.5">
                      {cartFinancials.stores.map((store) => {
                        const isCheapest = cartFinancials.cheapestStore && cartFinancials.cheapestStore.id === store.id;
                        // Calculate percentage of width relative to the most expensive store total
                        const maxTotal = Math.max(...cartFinancials.stores.map(s => s.total)) || 1;
                        const barWidthPercent = Math.max(45, Math.min(100, (store.total / maxTotal) * 100));

                        return (
                          <div key={store.id} className={`p-2.5 rounded-xl border transition-all ${isCheapest ? 'border-green-500 bg-green-50/40 shadow-xs' : 'border-slate-200 bg-slate-50/50'}`}>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 min-w-0">
                                <span>{store.logo}</span>
                                <span className="truncate">{store.name}</span>
                                {isCheapest && (
                                  <span className="bg-green-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-widest shrink-0 animate-pulse">
                                    🏆 Más Barato
                                  </span>
                                )}
                              </span>
                              <span className="text-xs font-extrabold text-slate-800 font-mono shrink-0">
                                RD$ {store.total.toLocaleString('es-DO')}
                              </span>
                            </div>

                            {/* Custom mini bar representation */}
                            <div className="mt-2 w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${isCheapest ? 'bg-green-500' : 'bg-slate-400'}`}
                                style={{ width: `${barWidthPercent}%` }}
                              ></div>
                            </div>

                            <p className="text-[9.5px] text-slate-400 mt-1 flex justify-between leading-none">
                              <span>Subtotal: RD$ {store.subtotal.toLocaleString('es-DO')}</span>
                              <span>ITBIS (18%): RD$ {store.tax.toLocaleString('es-DO')}</span>
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Savings highlight card */}
                    {cartFinancials.maxSavings > 0 && cartFinancials.cheapestStore && (
                      <div className="mt-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl p-3.5 shadow-md shadow-green-500/10">
                        <h5 className="font-extrabold text-xs flex items-center gap-1">
                          ⚡ ¡Recomendación de Ahorro!
                        </h5>
                        <p className="text-[11px] text-green-50 mt-1 font-medium leading-normal">
                          Comprando en <strong className="underline decoration-yellow-400 decoration-2">{cartFinancials.cheapestStore.name}</strong> te ahorrarías hasta <strong className="text-yellow-300 text-xs font-bold">RD$ {cartFinancials.maxSavings.toLocaleString('es-DO')}</strong> en comparación con el supermercado más caro.
                        </p>
                        <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 text-[9.5px] text-white/90 mt-2 font-semibold">
                          💡 <strong>Consejo Inteligente:</strong> Prefiere marcas locales como Mascot para ahorrar RD$ 150 adicionales por cuaderno.
                        </div>
                      </div>
                    )}
                  </div>

                  <hr className="border-slate-100" />

                  {/* COMPARATIVE ACTION EXPORT FORM */}
                  <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-3.5">
                    <div className="flex items-center gap-1 text-slate-800 uppercase tracking-widest font-extrabold text-[10px]">
                      <span>📋</span>
                      <span>Exportar e Imprimir Comparativa</span>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Nombre para la lista / Alumno</label>
                      <input
                        type="text"
                        required
                        value={deliveryName}
                        onChange={(e) => setDeliveryName(e.target.value)}
                        placeholder="Ej: Lista Primaria Juanito"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Tu Teléfono (WhatsApp para compartir)</label>
                      <input
                        type="tel"
                        required
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value)}
                        placeholder="Ej: 809-555-1200"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase">Supermercado Elegido</label>
                        <select
                          value={deliveryCity}
                          onChange={(e) => setDeliveryCity(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 h-[34px] cursor-pointer"
                        >
                          <option value="Jumbo">Jumbo (Recomendado)</option>
                          <option value="La Sirena">La Sirena</option>
                          <option value="Nacional">Supermer. Nacional</option>
                          <option value="Plaza Lama">Plaza Lama</option>
                          <option value="Bravo">Supermercados Bravo</option>
                          <option value="Garrido">Almacenes Garrido</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase">Anotación / Extra</label>
                        <input
                          type="text"
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="Ej: Comprar el sábado"
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {checkoutError && (
                      <p className="text-[11px] font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">{checkoutError}</p>
                    )}

                    <div className="flex flex-col gap-2 mt-1">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2 transition-all cursor-pointer border border-blue-700"
                      >
                        <FileText className="w-4 h-4 stroke-[2]" />
                        Generar Reporte Imprimible / PDF
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!deliveryName || !deliveryPhone) {
                            showToast("Por favor rellena el nombre y tu teléfono/WhatsApp arriba para compartir.", "error");
                            return;
                          }
                          const listText = cart.map(item => `• ${item.quantity}x ${item.product.name} (Marca: ${item.product.brand})`).join("%0A");
                          const cheapestName = cartFinancials.cheapestStore ? cartFinancials.cheapestStore.name : 'Jumbo';
                          const msg = `🧾 *Cotización Escolar - utiles.online* %0A%0A*Alumno/Lista:* ${deliveryName}%0A*Cantidad:* ${totalCartQty} útiles escolares%0A%0A*💰 Comparativa en Supermercados:*%0A-------------------------------%0A• *Jumbo:* RD$ ${cartFinancials.stores.find(s => s.id === 'jumbo')?.total.toLocaleString('es-DO')}%0A• *La Sirena:* RD$ ${cartFinancials.stores.find(s => s.id === 'sirena')?.total.toLocaleString('es-DO')}%0A• *Superm. Nacional:* RD$ ${cartFinancials.stores.find(s => s.id === 'nacional')?.total.toLocaleString('es-DO')}%0A• *Plaza Lama:* RD$ ${cartFinancials.stores.find(s => s.id === 'plazalama')?.total.toLocaleString('es-DO')}%0A• *S. Bravo:* RD$ ${cartFinancials.stores.find(s => s.id === 'bravo')?.total.toLocaleString('es-DO')}%0A• *A. Garrido:* RD$ ${cartFinancials.stores.find(s => s.id === 'garrido')?.total.toLocaleString('es-DO')}%0A• *Superm. Olé:* RD$ ${cartFinancials.stores.find(s => s.id === 'ole')?.total.toLocaleString('es-DO')}%0A• *Carrefour RD:* RD$ ${cartFinancials.stores.find(s => s.id === 'carrefour')?.total.toLocaleString('es-DO')}%0A-------------------------------%0A🎉 *La opción recomendada es comprar en ${cheapestName}* (Ahorras hasta RD$ ${cartFinancials.maxSavings.toLocaleString('es-DO')})%0A%0A*Útiles:*%0A${listText}%0A%0A(Generado en utiles.online Comparador Escolar RD)`;
                          window.open(`https://api.whatsapp.com/send?phone=${deliveryPhone.replace(/\D/g, "")}&text=${msg}`, "_blank");
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-[11px] py-2 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer border border-green-700"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-100 fill-emerald-100" />
                        Enviar Lista de Cotejo por WhatsApp
                      </button>
                    </div>
                    
                    <p className="text-[10px] text-slate-400 text-center leading-normal">
                      * Al presionar "Generar Reporte" se registrará localmente la cotización para que puedas consultarla o imprimirla cuando vayas al supermercado físico de tu elección.
                    </p>
                  </form>
                </>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <div className="bg-slate-100 text-slate-400 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Layers className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-700">Tu canasta está vacía</h4>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                    Navega por las pestañas de <strong>Listas por Colegio</strong> o pega tu lista en el <strong>Escáner de IA</strong> para cargar útiles al comparador automáticamente.
                  </p>
                </div>
              )}
            </div>
            
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-16 select-text border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          
          <div>
            <h4 className="text-sm font-extrabold text-white mb-3">🎒 Útiles.Online <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase font-mono tracking-widest ml-1">RD</span></h4>
            <p className="leading-relaxed text-slate-400 font-medium select-text">
              Ahorramos tiempo, estrés y dinero a los padres dominicanos en las compras colegiales. El comparador de canastas escolares #1 de República Dominicana con análisis de precios en tiempo real.
            </p>
            <div className="flex flex-col gap-1.5 mt-4 text-[11px]">
              <span className="text-blue-400 font-bold block">💬 Correo: soporte@utilesonline.com</span>
              <span className="text-green-500 font-bold block">💬 WhatsApp: (809) 555-0129</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-white mb-3">🏫 Dirección de Colegios RD</h4>
            <ul className="space-y-2 text-slate-300 font-bold">
              <li><a href="/colegios/colegio-loyola" className="hover:text-white hover:underline transition-all block">🦅 Colegio Loyola</a></li>
              <li><a href="/colegios/carol-morgan" className="hover:text-white hover:underline transition-all block">🏫 Carol Morgan School</a></li>
              <li><a href="/colegios/babeque" className="hover:text-white hover:underline transition-all block">⛵ Colegio Babeque Secundaria</a></li>
              <li><a href="/colegios/la-salle" className="hover:text-white hover:underline transition-all block">⭐ Colegio De La Salle</a></li>
              <li><a href="/colegios/saint-george" className="hover:text-white hover:underline transition-all block">🐉 Saint George School</a></li>
              <li><a href="/colegios/colegio-amador" className="hover:text-white hover:underline transition-all block">🎓 Colegio Amador</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-white mb-3">🧜‍♀️ Comparar Cadenas</h4>
            <ul className="space-y-2 text-slate-300 font-bold">
              <li><a href="/tiendas/la-sirena" className="hover:text-white hover:underline transition-all block">🧜‍♀️ La Sirena</a></li>
              <li><a href="/tiendas/jumbo" className="hover:text-white hover:underline transition-all block">🐘 Jumbo</a></li>
              <li><a href="/tiendas/supermercado-nacional" className="hover:text-white hover:underline transition-all block">🛒 Supermercados Nacional</a></li>
              <li><a href="/tiendas/plaza-lama" className="hover:text-white hover:underline transition-all block">🦙 Plaza Lama</a></li>
              <li><a href="/tiendas/bravo" className="hover:text-white hover:underline transition-all block">🍎 Supermercados Bravo</a></li>
              <li><a href="/tiendas/garrido" className="hover:text-white hover:underline transition-all block">🛍️ Almacenes Garrido</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-white mb-2">📍 Localidades</h4>
            <ul className="space-y-1.5 text-slate-300 font-bold mb-4">
              <li><a href="/localidad/santo-domingo" className="hover:text-white hover:underline transition-all block">📍 Santo Domingo</a></li>
              <li><a href="/localidad/santiago" className="hover:text-white hover:underline transition-all block">📍 Santiago de los Caballeros</a></li>
              <li><a href="/localidad/la-vega" className="hover:text-white hover:underline transition-all block">📍 Concepción de La Vega</a></li>
              <li><a href="/localidad/san-francisco-de-macoris" className="hover:text-white hover:underline transition-all block">📍 San Francisco de Macorís</a></li>
              <li><a href="/localidad/higuey" className="hover:text-white hover:underline transition-all block">📍 Higüey / Punta Cana</a></li>
            </ul>
            <h4 className="text-sm font-extrabold text-white mb-2">📰 Artículos del Blog</h4>
            <ul className="space-y-1.5 text-slate-300 font-bold">
              <li><a href="/blog/guia-regreso-clases-2026-rd" className="hover:text-white hover:underline transition-all block">📖 Guía Regreso Clases 2026</a></li>
              <li><a href="/blog/como-ahorrar-compra-utiles-escolares" className="hover:text-white hover:underline transition-all block">💰 Consejos para Ahorrar</a></li>
              <li><a href="/blog/comparativa-precios-sirena-jumbo-rd" className="hover:text-white hover:underline transition-all block">📊 La Sirena vs. Jumbo</a></li>
              <li><a href="/blog/mejores-cuadernos-primaria-mascot-oxford" className="hover:text-white hover:underline transition-all block">📒 Mejores Cuadernos RD</a></li>
              <li><a href="/blog/mejores-marcas-lapices-rd" className="hover:text-white hover:underline transition-all block">✏️ Mejores Lápices de Grafito</a></li>
              <li><a href="/blog/errores-comunes-al-comprar-la-lista-escolar" className="hover:text-white hover:underline transition-all block">⚠️ Errores al Comprar Lista</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Útiles.Online Dominicana S.R.L. Todos los derechos reservados. Distrito Nacional / Santiago / La Vega, R.D.</p>
          <div className="flex justify-center gap-4 mt-2 font-bold">
            <a href="/robots.txt" className="hover:text-white underline">Robots.txt</a>
            <a href="/sitemap-index.xml" className="hover:text-white underline">Sitemaps XML</a>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Anchor Ad */}
      {showAnchorAd && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-900 border-t border-slate-700 p-2 sm:hidden flex flex-col shadow-lg">
          <div className="flex items-center justify-between px-2 pb-1 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
            <span>📢 Patrocinado - Móvil</span>
            <button
              onClick={() => setShowAnchorAd(false)}
              className="text-slate-400 hover:text-white bg-slate-800 rounded-full p-1"
              title="Cerrar publicidad"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <React.Suspense fallback={<div className="h-[90px] w-full bg-slate-900 border border-slate-200"></div>}>
            <AdSenseBanner
              slot="mobile-anchor-ad"
              format="horizontal"
              className="my-0"
              label="Anuncio Móvil Anclado"
            />
          </React.Suspense>
        </div>
      )}

      {/* DETAIL DIALOG MODAL / POP-UP */}
      <AnimatePresence>
        {selectedProductDetail && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="bg-white rounded-2xl max-w-[420px] w-full overflow-hidden shadow-2xl relative border border-slate-200 p-5 text-slate-800 flex flex-col gap-3.5 select-none"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Product Header Block */}
              <div className="flex gap-4 items-start pb-3 border-b border-slate-100 select-none">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white p-1 border border-slate-200 shrink-0 flex items-center justify-center">
                  <img
                    src={selectedProductDetail.image}
                    alt={selectedProductDetail.name}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain"
                  />
                  {selectedProductDetail.isFeatured && (
                    <span className="absolute bottom-0 inset-x-0 bg-orange-600 text-white text-[7px] font-black py-0.5 text-center uppercase tracking-wider">
                      ★ Top
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1 pr-6">
                  <span className="text-[8.5px] text-blue-600 font-extrabold uppercase tracking-wider block">
                    {CATEGORIES.find(c => c.id === selectedProductDetail.category)?.name}
                  </span>
                  <h3 className="text-xs sm:text-[13px] font-black text-slate-900 leading-snug mt-0.5 select-text">
                    {selectedProductDetail.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-semibold">
                    <span className="text-slate-800 font-black">{selectedProductDetail.brand}</span>
                    <span>•</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-slate-800 font-black">{selectedProductDetail.rating}</span>
                      <span className="text-slate-405 font-medium">({selectedProductDetail.reviewsCount})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-[10.5px] text-slate-500 leading-relaxed max-h-[60px] overflow-y-auto select-text">
                {selectedProductDetail.description}
              </p>

              {/* AI Live Price Scanner Widget */}
              <div className="bg-blue-50/45 border border-blue-100 p-2.5 rounded-xl select-none">
                {!isVerifyingPrices && !livePricesResult && (
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[9.5px] font-black text-slate-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-blue-600 fill-blue-600/15 shrink-0 animate-pulse" />
                        ¿Verificar precios reales en vivo?
                      </p>
                      <p className="text-[8.5px] text-slate-400 mt-0.5 leading-snug">
                        Sincroniza precios con Sirena, Jumbo y Bravo gratis.
                      </p>
                    </div>
                    <button
                      onClick={() => handleVerifyLivePrices(selectedProductDetail.name, selectedProductDetail.price, selectedProductDetail.id)}
                      className="bg-blue-605 hover:bg-blue-700 text-white font-black text-[9px] px-2.5 py-1.5 rounded-lg transition-all shadow-2xs cursor-pointer shrink-0"
                    >
                      Escanear Góndolas
                    </button>
                  </div>
                )}

                {isVerifyingPrices && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
                      <span className="text-[9px] font-bold text-slate-800">IA rastreando góndolas dominicanas...</span>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-1.5 max-h-[44px] overflow-y-auto font-mono text-[7.5px] text-blue-400 leading-normal select-text">
                      {verificationLogs.map((log, i) => (
                        <div key={i} className="mb-0.5">{log}</div>
                      ))}
                    </div>
                  </div>
                )}

                {livePricesResult?.productId === selectedProductDetail.id && (
                  <div className="flex flex-col gap-1.5 select-text">
                    <div className="bg-emerald-50/60 border border-emerald-100 p-2 rounded text-[9px] leading-relaxed text-slate-600">
                      <p className="font-extrabold text-emerald-800 flex items-center gap-1 pb-0.5">
                        <span>✓</span> Precios actualizados en vivo
                      </p>
                      {livePricesResult.analysis}
                    </div>
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-[7.5px] font-bold text-slate-400 uppercase">Enlaces verificados:</span>
                      {livePricesResult.sources.map((src: any, i: number) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded text-[7.5px] font-bold inline-flex items-center gap-0.5 transition-all cursor-pointer"
                        >
                          {src.title.replace("Online", "").replace("Portal", "").trim()} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Sparkline Graphic and price drop Alert setup */}
              {(() => {
                const history = selectedProductDetail.priceHistory || [];
                if (history.length === 0) return null;
                
                // Extract minimum price on each historical date
                const minPrices = history.map(h => 
                  Math.min(h.sirena, h.jumbo, h.nacional, h.plazalama, h.bravo, h.garrido, h.ole, h.carrefour)
                );
                
                const absoluteMax = Math.max(...minPrices, selectedProductDetail.price);
                const absoluteMin = Math.min(...minPrices, selectedProductDetail.price);
                const marginOffset = (absoluteMax - absoluteMin) * 0.1 || 5;
                const maxScaled = absoluteMax + marginOffset;
                const minScaled = Math.max(0, absoluteMin - marginOffset);
                const scaleRange = maxScaled - minScaled || 1;
                
                const width = 360;
                const height = 75;
                
                const svgCoordinates = minPrices.map((price, idx) => {
                  const x = (idx / (minPrices.length - 1)) * width;
                  const y = height - ((price - minScaled) / scaleRange) * height;
                  return `${x},${y}`;
                }).join(' ');

                const closedAreaCoordinates = `${svgCoordinates} ${width},${height} 0,${height}`;
                
                const priceChange = minPrices[minPrices.length - 1] - minPrices[0];
                const priceChangePct = ((priceChange / (minPrices[0] || 1)) * 100).toFixed(1);
                const isPriceDropping = priceChange < 0;

                return (
                  <div className="border border-slate-200 p-2.5 rounded-xl bg-slate-50/50 flex flex-col gap-2">
                    <div className="flex items-center justify-between select-none">
                      <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1 leading-none">
                        <TrendingDown className={`w-3.5 h-3.5 ${isPriceDropping ? 'text-emerald-500' : 'text-slate-400'}`} />
                        Historial 30 Días (Menor Precio de Mercado)
                      </span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded font-mono leading-none ${isPriceDropping ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                        {priceChange > 0 ? '+' : ''}{priceChangePct}% {isPriceDropping ? '¡En Oferta!' : 'Normal'}
                      </span>
                    </div>
                    
                    {/* SVG Canvas drawing */}
                    <div className="relative h-[65px] w-full mt-0.5 bg-white/60 p-1 border border-slate-200/50 rounded-lg flex items-center justify-center overflow-hidden">
                      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Subtle horizontal grid helper lines */}
                        <line x1="0" y1={height * 0.3} x2={width} y2={height * 0.3} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2" />
                        <line x1="0" y1={height * 0.7} x2={width} y2={height * 0.7} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2" />
                        
                        {/* Filled area shadow path */}
                        <polygon points={closedAreaCoordinates} fill="url(#chartGradient)" />
                        {/* Main line path */}
                        <polyline points={svgCoordinates} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        
                        {/* Spark dots for endpoint */}
                        {minPrices.length > 0 && (
                          <circle 
                            cx={width} 
                            cy={height - ((minPrices[minPrices.length - 1] - minScaled) / scaleRange) * height} 
                            r="3" 
                            className="fill-blue-600" 
                          />
                        )}
                      </svg>
                    </div>
                    <div className="flex justify-between items-center text-[7.5px] text-slate-400 font-extrabold font-mono leading-none select-none">
                      <span>INICIO (RD$ {minPrices[0]})</span>
                      <span>ACTUAL (RD$ {minPrices[minPrices.length - 1]})</span>
                    </div>
                  </div>
                );
              })()}

              <div className="bg-amber-50/50 border border-amber-200 p-2.5 rounded-xl flex flex-col gap-1.5">
                <div className="flex items-center gap-1 text-[9.5px] font-black text-amber-800 uppercase tracking-wider leading-none">
                  <Bell className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  Crear alerta de rebaja de precios
                </div>
                <p className="text-[8px] text-slate-500 font-medium leading-tight">
                  Te avisaremos inmediatamente por email dominicano tan pronto este útil escolar baje de tu precio objetivo en cualquier supermercado.
                </p>
                <div className="flex gap-1.5 mt-0.5 items-center">
                  <input 
                    type="email" 
                    placeholder="Tu correo de alertas" 
                    className="bg-white border border-slate-200 text-[9.5px] font-bold rounded-lg px-2.5 py-1.5 flex-1 outline-none focus:ring-1 focus:ring-amber-500"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                  />
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-[9px] font-black text-slate-400">RD$</span>
                    <input 
                      type="number" 
                      placeholder={`${Math.round(selectedProductDetail.price * 0.90)}`}
                      className="bg-white border border-slate-200 text-[9.5px] rounded-lg pl-7 pr-1.5 py-1.5 w-[65px] outline-none font-mono font-black text-slate-700 focus:ring-1 focus:ring-amber-500"
                      value={alertTargetPrice}
                      onChange={(e) => setAlertTargetPrice(e.target.value)}
                    />
                  </div>
                  <button 
                    className="bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-black text-[9.5px] px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-3xs shrink-0"
                    onClick={() => handleCreatePriceAlert(selectedProductDetail.id, selectedProductDetail.name, selectedProductDetail.price)}
                  >
                    Activar
                  </button>
                </div>
              </div>

              {/* Compact Comparison Grid */}
              <div className="border-t border-slate-100/80 pt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Comparativa por Supermercado</h4>
                  {livePricesResult?.productId === selectedProductDetail.id ? (
                    <span className="text-[8px] text-emerald-705 bg-emerald-50 px-1.5 py-0.5 rounded font-black border border-emerald-100 animate-pulse">
                      Sincronizado IA
                    </span>
                  ) : (
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Precios en Góndola R.D.</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {(() => {
                    const storePricesList = [
                      { name: 'Sirena', logo: '🧜‍♀️', price: livePricesResult?.productId === selectedProductDetail.id ? livePricesResult.prices.sirena : selectedProductDetail.storePrices?.sirena },
                      { name: 'Jumbo', logo: '🐘', price: livePricesResult?.productId === selectedProductDetail.id ? livePricesResult.prices.jumbo : selectedProductDetail.storePrices?.jumbo },
                      { name: 'S. Nacional', logo: '🛒', price: livePricesResult?.productId === selectedProductDetail.id ? livePricesResult.prices.nacional : selectedProductDetail.storePrices?.nacional },
                      { name: 'Plaza Lama', logo: '🦙', price: livePricesResult?.productId === selectedProductDetail.id ? livePricesResult.prices.plazalama : selectedProductDetail.storePrices?.plazalama },
                      { name: 'S. Bravo', logo: '🍎', price: livePricesResult?.productId === selectedProductDetail.id ? livePricesResult.prices.bravo : (selectedProductDetail.storePrices?.bravo || Math.round(selectedProductDetail.price * 0.95)) },
                      { name: 'A. Garrido', logo: '🛍️', price: livePricesResult?.productId === selectedProductDetail.id ? livePricesResult.prices.garrido : (selectedProductDetail.storePrices?.garrido || Math.round(selectedProductDetail.price * 0.90)) },
                      { name: 'S. Olé', logo: '🥑', price: livePricesResult?.productId === selectedProductDetail.id ? livePricesResult.prices.ole : (selectedProductDetail.storePrices?.ole || Math.round(selectedProductDetail.price * 0.92)) },
                      { name: 'Carrefour', logo: '🇨🇵', price: livePricesResult?.productId === selectedProductDetail.id ? livePricesResult.prices.carrefour : (selectedProductDetail.storePrices?.carrefour || Math.round(selectedProductDetail.price * 1.04)) }
                    ];

                    const validPrices = storePricesList.filter(s => typeof s.price === 'number' && s.price > 0);
                    const cheapestPrice = validPrices.length > 0 ? Math.min(...validPrices.map(s => s.price as number)) : 0;

                    return storePricesList.map((st, idx) => {
                      const isCheapest = cheapestPrice > 0 && st.price === cheapestPrice;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2 rounded-lg border leading-none transition-all select-none ${
                            isCheapest
                              ? 'bg-emerald-50/80 border-emerald-250 text-emerald-950 font-black shadow-3xs'
                              : 'bg-slate-50/40 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="text-[9.5px] font-bold flex items-center gap-1.5 truncate max-w-[80px]">
                            <span className="shrink-0">{st.logo}</span>
                            <span className="truncate">{st.name}</span>
                          </span>
                          <span className={`font-mono text-[9px] font-black ${isCheapest ? 'text-emerald-700' : 'text-slate-800'}`}>
                            RD$ {st.price}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between gap-3 mt-1 pt-3 border-t border-slate-100 flex-row">
                <div>
                  <span className="text-[8.5px] text-slate-400 font-extrabold uppercase leading-none block font-mono">Precio Único</span>
                  <p className="text-base font-black text-slate-900 mt-1 leading-none font-sans">RD$ {selectedProductDetail.price}</p>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProductDetail);
                      setSelectedProductDetail(null);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-99"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRINTABLE SUCCESS RECEIPT / INVOICE DIALOG SCREEN */}
      <AnimatePresence>
        {latestSuccessOrder && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
              id="print-sheet-segment"
            >
              {/* Close Icon (hidden when printing) */}
              <button
                onClick={() => setLatestSuccessOrder(null)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center transition-all print:hidden select-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Invoice Sheet layout */}
              <div className="text-center pb-6 border-b border-dashed border-slate-200 print:pb-4">
                <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 print:hidden border border-blue-100">
                  <CheckCircle className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider print:border print:border-black">
                  Reserva Escolar Confirmada • útiles.online
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2.5">¡Tu orden se registró con éxito!</h3>
                <p className="text-xs text-slate-400 mt-1">Garantiza el precio de temporada de tus útiles escolares de forma rápida.</p>
              </div>

              {/* Invoice Metadata */}
              <div className="mt-6 flex flex-col gap-5 text-slate-800">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">ID del Pedido</span>
                    <span className="font-mono font-bold text-slate-800 text-sm select-all">{latestSuccessOrder.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Fecha de Emisión</span>
                    <span className="font-bold text-slate-800">{latestSuccessOrder.date}</span>
                  </div>
                  <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-blue-700 font-extrabold uppercase tracking-wider block flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Datos del Envío:
                    </span>
                    <span className="font-bold text-slate-800 block mt-1">
                      {latestSuccessOrder.shippingDetails.name} • {latestSuccessOrder.shippingDetails.phone}
                    </span>
                    <span className="text-slate-500 font-semibold block mt-1">
                      Dirección: {latestSuccessOrder.shippingDetails.address}, {latestSuccessOrder.shippingDetails.city}
                    </span>
                    {latestSuccessOrder.shippingDetails.notes && (
                      <span className="text-slate-400 text-[10px] italic block mt-1">
                        Nota: "{latestSuccessOrder.shippingDetails.notes}"
                      </span>
                    )}
                  </div>
                </div>

                {/* Items Invoice list */}
                <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200 print:bg-white print:border-black">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    Artículos Escolares Solicitados
                  </h4>
                  
                  <div className="divide-y divide-slate-200 text-xs text-slate-705">
                    {latestSuccessOrder.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex justify-between gap-4 font-bold">
                        <span className="min-w-0 truncate text-slate-800">
                          {item.product.name} <span className="text-slate-400 font-medium">x{item.quantity}</span>
                        </span>
                        <span className="text-slate-900 flex-shrink-0">RD$ {item.product.price * item.quantity}</span>
                      </div>
                    ))}

                    {/* Breakdown counts */}
                    <div className="pt-4 mt-2.5 flex flex-col gap-1.5 border-t border-slate-200 text-slate-600 font-semibold">
                      <div className="flex justify-between">
                        <span>Subtotal de utiles:</span>
                        <span>RD$ {latestSuccessOrder.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ITBIS (18.00% Ley IT-1):</span>
                        <span>RD$ {latestSuccessOrder.tax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mensajería / Delivery:</span>
                        <span>
                          {latestSuccessOrder.subtotal >= 2500 ? (
                            <span className="text-green-600 font-extrabold font-sans">¡Gratis!</span>
                          ) : (
                            "RD$ 150"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-extrabold text-sm border-t border-slate-250 pt-2.5 mt-1.5">
                        <span>Total de Facturación:</span>
                        <span className="text-blue-700 font-mono text-base font-bold">RD$ {latestSuccessOrder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print CTA controls */}
                <div className="mt-2 flex flex-col sm:flex-row gap-4 justify-between items-center print:hidden bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-400 leading-normal text-center sm:text-left max-w-xs">
                    * Puedes hacer clic en "Imprimir Factura" para descargar esta reservación en formato PDF o mandarla en papel. Nos comunicaremos contigo por WhatsApp para el envío.
                  </p>
                  
                  <button
                    onClick={() => window.print()}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-400" />
                    Imprimir Recibo / Guardar PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMMUNITY COLLABORATION MODAL DESIGN */}
      <AnimatePresence>
        {showAddListModal && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full flex flex-col md:flex-row shadow-2xl relative my-8 overflow-hidden max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowAddListModal(false)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center transition-all z-20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Sidebar: Form Metadata */}
              <div className="w-full md:w-80 bg-slate-50 p-6 border-r border-slate-200 flex flex-col gap-4.5 overflow-y-auto shrink-0 text-left">
                <div>
                  <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Comunidad Escolar
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-2">Colaborar con Útiles</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">Sube la lista de útiles de tu centro educativo para guiar de forma inteligente a otras familias dominicanas.</p>
                </div>

                {/* Google Auth Status / Sign-In inside form */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  {authUser ? (
                    <div className="flex items-center gap-2.5">
                      {authUser.photoURL ? (
                        <img referrerPolicy="no-referrer" src={authUser.photoURL} alt={authUser.displayName || ''} className="w-8 h-8 rounded-full border border-slate-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {authUser.displayName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{authUser.displayName}</p>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5 inline-block">Padre Verificado</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold leading-normal mb-2.5">Inicia sesión con Google para certificar tu autoría de la lista escolar (Opcional):</p>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const { auth, googleProvider } = await import('./lib/firebase');
                            const { signInWithPopup } = await import('firebase/auth');
                            await signInWithPopup(auth, googleProvider);
                          } catch (e) {
                            console.error("Auth popup error", e);
                          }
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10.5px] py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" /> Conectar con Google
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3.5 mt-2">
                  {/* Select or Type School Name Option */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10.5px] font-bold text-slate-500 uppercase">Colegio / Liceo</label>
                      <button
                        type="button"
                        onClick={() => setIsNewSchoolText(!isNewSchoolText)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold underline"
                      >
                        {isNewSchoolText ? 'Elegir Existente' : 'Escribir Otro'}
                      </button>
                    </div>

                    {isNewSchoolText ? (
                      <input
                        type="text"
                        placeholder="Ej: Colegio San Judas Tadeo"
                        value={formSchoolName}
                        onChange={(e) => setFormSchoolName(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all w-full"
                      />
                    ) : (
                      <select
                        value={formSchoolName}
                        onChange={(e) => setFormSchoolName(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all w-full cursor-pointer"
                      >
                        <option value="">-- Selecciona un colegio --</option>
                        {SCHOOLS.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                      </select>
                    )}
                  </div>

                  {/* Grade dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10.5px] font-bold text-slate-500 uppercase">Grado Correspondiente</label>
                    <select
                      value={formGrade}
                      onChange={(e) => setFormGrade(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all w-full cursor-pointer"
                    >
                      {GRADES.map(gr => <option key={gr} value={gr}>{gr}</option>)}
                    </select>
                  </div>

                  {/* Academic year input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10.5px] font-bold text-slate-500 uppercase">Año Escolar</label>
                    <input
                      type="text"
                      value={formAcademicYear}
                      onChange={(e) => setFormAcademicYear(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all w-full"
                    />
                  </div>

                  {/* Contributor Nickname Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10.5px] font-bold text-slate-500 uppercase">Nombre Colaborador</label>
                    <input
                      type="text"
                      placeholder="Ej: Mamá de Sofía"
                      value={formCreatedBy}
                      onChange={(e) => setFormCreatedBy(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Main Content: Selection Checklist */}
              <div className="flex-1 flex flex-col min-h-0 bg-white text-left">
                
                {/* Search products bar */}
                <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar útiles del catálogo para agregar..."
                      value={formSearchQuery}
                      onChange={(e) => setFormSearchQuery(e.target.value)}
                      className="bg-white border border-slate-250 rounded-xl pl-8.5 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all w-full"
                    />
                  </div>
                  {formSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setFormSearchQuery('')}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-800 cursor-pointer"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {/* Supplies selection checklist */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 divide-y divide-slate-100">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide block pb-1">
                    Catálogo de Útiles para añadir (# de Artículos)
                  </span>

                  {PRODUCTS.filter(p => !formSearchQuery || p.name.toLowerCase().includes(formSearchQuery.toLowerCase())).map((prod) => {
                    const selectedQty = formItemQuantities[prod.id] || 0;
                    const itemNote = formItemNotes[prod.id] || '';
                    const isReq = formItemRequired[prod.id] !== false;

                    return (
                      <div key={prod.id} className="pt-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img referrerPolicy="no-referrer" src={prod.image} alt={prod.name} className="w-9 h-9 rounded-lg object-contain p-0.5 bg-white border border-slate-200 flex-shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{prod.name}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold">{prod.brand} • RD$ {prod.price}</p>
                          </div>
                        </div>

                        {/* Control item quantities and notes */}
                        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
                          
                          {/* Notes field / Required button */}
                          {selectedQty > 0 && (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Nota (Ej: Roja)"
                                value={itemNote}
                                onChange={(e) => {
                                  setFormItemNotes((prev) => ({ ...prev, [prod.id]: e.target.value }));
                                }}
                                className="bg-slate-50 border border-slate-250 py-1 px-2 rounded-lg text-[10.5px] font-medium max-w-[110px]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setFormItemRequired((prev) => ({ ...prev, [prod.id]: !isReq }));
                                }}
                                className={`text-[9.5px] font-bold px-2 py-1 rounded-md transition-all ${isReq ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}
                              >
                                {isReq ? 'Obligatorio' : 'Opcional'}
                              </button>
                            </div>
                          )}

                          {/* Plus minus counter */}
                          <div className="flex items-center border border-slate-250 rounded-lg overflow-hidden bg-white shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setFormItemQuantities((prev) => ({
                                  ...prev,
                                  [prod.id]: Math.max(0, (prev[prod.id] || 0) - 1),
                                }));
                              }}
                              aria-label={`Disminuir cantidad de ${prod.name}`}
                              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-500 border-r border-slate-200 transition-all font-bold"
                            >
                              -
                            </button>
                            <span className="px-3.5 text-xs font-extrabold text-slate-800 font-mono">
                              {selectedQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormItemQuantities((prev) => ({
                                  ...prev,
                                  [prod.id]: (prev[prod.id] || 0) + 1,
                                }));
                              }}
                              aria-label={`Aumentar cantidad de ${prod.name}`}
                              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-500 border-l border-slate-200 transition-all font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* CUSTOM ITEMS SECTION */}
                  <div className="pt-5.5 mt-5 border-t border-slate-200">
                    <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide block mb-3">
                      Artículos extra fuera del catálogo
                    </span>

                    {/* Render current custom items list */}
                    {formCustomItems.length > 0 && (
                      <div className="flex flex-col gap-2 mb-3">
                        {formCustomItems.map((c, i) => (
                          <div key={i} className="flex justify-between items-center text-xs bg-slate-50 border border-slate-200/60 p-2 rounded-xl">
                            <span className="font-semibold text-slate-800">{c.quantity}x {c.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-bold">~ RD$ {c.price * c.quantity}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormCustomItems(prev => prev.filter((_, idx) => idx !== i));
                                }}
                                className="text-red-500 hover:text-red-700 font-bold"
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add extra custom items form row */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <input
                        type="text"
                        placeholder="Ej: Gel antibacterial 4oz"
                        value={customItemInput}
                        onChange={(e) => setCustomItemInput(e.target.value)}
                        className="bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-650 flex-1"
                      />
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-250 rounded-lg overflow-hidden bg-white shrink-0">
                          <button
                            type="button"
                            onClick={() => setCustomItemQty(q => Math.max(1, q - 1))}
                            className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-500 border-r border-slate-200 transition-all text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-extrabold text-slate-800 font-mono">
                            {customItemQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCustomItemQty(q => q + 1)}
                            className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-500 border-l border-slate-200 transition-all text-xs font-bold"
                          >
                            +
                          </button>
                        </div>

                        <div className="relative max-w-[100px]">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10.5px]">RD$</span>
                          <input
                            type="number"
                            value={customItemPrice}
                            onChange={(e) => setCustomItemPrice(Number(e.target.value))}
                            className="bg-white border border-slate-250 rounded-lg pl-8.5 pr-2 py-1.5 text-xs font-semibold text-slate-800 w-full"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!customItemInput.trim()) return;
                            setFormCustomItems(prev => [
                              ...prev,
                              { name: customItemInput.trim(), quantity: customItemQty, price: customItemPrice }
                            ]);
                            setCustomItemInput('');
                            setCustomItemQty(1);
                            setCustomItemPrice(100);
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3 py-2 rounded-lg transition-all shrink-0 cursor-pointer"
                        >
                          + Añadir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky action submit panel */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center z-10">
                  <div className="text-left">
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase block">Recuento de útiles</span>
                    <span className="text-xs font-bold text-slate-700">
                      {Object.values(formItemQuantities).filter(q => q > 0).length + formCustomItems.length} útiles seleccionados
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddListModal(false)}
                      className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={isSubmittingList}
                      onClick={handlePublishCommunityList}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmittingList ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Publicando...
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          Publicar Lista
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full font-sans"
          >
            <div className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-100/20' 
                : toast.type === 'error'
                  ? 'bg-rose-50/95 border-rose-200 text-rose-900 shadow-rose-100/20'
                  : 'bg-indigo-50/95 border-indigo-200 text-indigo-900 shadow-indigo-100/20'
            }`}>
              <div className="flex-1">
                <p className="text-xs font-bold leading-normal">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
