import { db, useLocalFallback } from './firestore';
import fs from 'fs';
import path from 'path';

const SCHOOL_LISTS_CACHE_PATH = path.join(process.cwd(), 'school-lists-cache.json');
const PRODUCTS_CACHE_PATH = path.join(process.cwd(), 'products-cache.json');

// --- DISK FALLBACK HELPER FUNCTIONS ---

function loadSchoolCacheFromDisk(): any {
  try {
    if (fs.existsSync(SCHOOL_LISTS_CACHE_PATH)) {
      const content = fs.readFileSync(SCHOOL_LISTS_CACHE_PATH, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('[LIST FALLBACK] Error al leer caché de listas de disco:', err);
  }
  return { schoolLists: [], schoolProfiles: {}, pendingSchools: [], pendingProductSuggestions: [] };
}

function saveSchoolCacheToDisk(cache: any) {
  try {
    fs.writeFileSync(SCHOOL_LISTS_CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
    console.log('[LIST FALLBACK] Caché de listas guardado en disco local.');
  } catch (err) {
    console.error('[LIST FALLBACK] Error al escribir caché de listas en disco:', err);
  }
}

function loadMatchReviewsFromDisk(): any[] {
  try {
    if (fs.existsSync(PRODUCTS_CACHE_PATH)) {
      const content = fs.readFileSync(PRODUCTS_CACHE_PATH, 'utf8');
      const parsed = JSON.parse(content);
      return parsed.pendingMatchReviews || [];
    }
  } catch (err) {
    console.error('[REVIEW FALLBACK] Error al leer revisiones de disco:', err);
  }
  return [];
}

function saveMatchReviewsToDisk(reviews: any[]) {
  try {
    let currentCache: any = {};
    if (fs.existsSync(PRODUCTS_CACHE_PATH)) {
      currentCache = JSON.parse(fs.readFileSync(PRODUCTS_CACHE_PATH, 'utf8'));
    }
    currentCache.pendingMatchReviews = reviews;
    fs.writeFileSync(PRODUCTS_CACHE_PATH, JSON.stringify(currentCache, null, 2), 'utf8');
    console.log('[REVIEW FALLBACK] Revisiones de coincidencia guardadas en disco local.');
  } catch (err) {
    console.error('[REVIEW FALLBACK] Error al escribir revisiones en disco:', err);
  }
}

// --- PUBLIC API EXPORTS ---

// 1. Get all school lists
export async function getSchoolLists(defaultBaseline: any[] = []): Promise<any[]> {
  if (useLocalFallback || !db) {
    const cache = loadSchoolCacheFromDisk();
    return cache.schoolLists && cache.schoolLists.length > 0 ? cache.schoolLists : defaultBaseline;
  }
  try {
    const snapshot = await db.collection('communityLists').get();
    const lists: any[] = [];
    snapshot.forEach(doc => {
      lists.push({ id: doc.id, ...doc.data() });
    });
    
    // Merge with static default baseline if DB returns empty (first boot)
    if (lists.length === 0) {
      console.log('[FIREBASE] Base de datos de listas vacía. Cargando baseline inicial...');
      for (const list of defaultBaseline) {
        await saveSchoolList(list);
      }
      return defaultBaseline;
    }
    return lists;
  } catch (error: any) {
    console.error('[FIREBASE] Error al leer listas de útiles de Firestore. Usando fallback de disco:', error.message);
    const cache = loadSchoolCacheFromDisk();
    return cache.schoolLists && cache.schoolLists.length > 0 ? cache.schoolLists : defaultBaseline;
  }
}

// 2. Save single school list
export async function saveSchoolList(list: any): Promise<boolean> {
  if (useLocalFallback || !db) {
    const cache = loadSchoolCacheFromDisk();
    const existingIndex = cache.schoolLists.findIndex((l: any) => l.id === list.id);
    if (existingIndex !== -1) {
      cache.schoolLists[existingIndex] = list;
    } else {
      cache.schoolLists.push(list);
    }
    saveSchoolCacheToDisk(cache);
    return true;
  }
  try {
    // Save to Firestore 'communityLists' collection
    await db.collection('communityLists').doc(list.id).set(list);
    console.log(`[FIREBASE] Lista de útiles guardada en Firestore: ${list.schoolName} - ${list.grade}`);
    return true;
  } catch (error: any) {
    console.error('[FIREBASE] Error al guardar lista en Firestore. Usando fallback local:', error.message);
    const cache = loadSchoolCacheFromDisk();
    const existingIndex = cache.schoolLists.findIndex((l: any) => l.id === list.id);
    if (existingIndex !== -1) {
      cache.schoolLists[existingIndex] = list;
    } else {
      cache.schoolLists.push(list);
    }
    saveSchoolCacheToDisk(cache);
    return true;
  }
}

// 3. School profiles (dynamic profiles database)
export async function getSchoolProfiles(staticProfiles: any): Promise<any> {
  if (useLocalFallback || !db) {
    const cache = loadSchoolCacheFromDisk();
    return { ...staticProfiles, ...(cache.schoolProfiles || {}) };
  }
  try {
    const snapshot = await db.collection('schoolProfiles').get();
    const dynamicProfiles: any = {};
    snapshot.forEach(doc => {
      dynamicProfiles[doc.id] = doc.data();
    });
    return { ...staticProfiles, ...dynamicProfiles };
  } catch (error: any) {
    console.error('[FIREBASE] Error al leer perfiles de Firestore. Usando fallback:', error.message);
    const cache = loadSchoolCacheFromDisk();
    return { ...staticProfiles, ...(cache.schoolProfiles || {}) };
  }
}

export async function saveSchoolProfile(slug: string, profile: any): Promise<boolean> {
  if (useLocalFallback || !db) {
    const cache = loadSchoolCacheFromDisk();
    cache.schoolProfiles = cache.schoolProfiles || {};
    cache.schoolProfiles[slug] = profile;
    saveSchoolCacheToDisk(cache);
    return true;
  }
  try {
    await db.collection('schoolProfiles').doc(slug).set(profile);
    console.log(`[FIREBASE] Perfil de colegio guardado en Firestore: ${slug}`);
    return true;
  } catch (error: any) {
    console.error('[FIREBASE] Error al guardar perfil en Firestore. Usando fallback local:', error.message);
    const cache = loadSchoolCacheFromDisk();
    cache.schoolProfiles = cache.schoolProfiles || {};
    cache.schoolProfiles[slug] = profile;
    saveSchoolCacheToDisk(cache);
    return true;
  }
}

export async function deleteSchoolProfile(slug: string): Promise<boolean> {
  if (useLocalFallback || !db) {
    const cache = loadSchoolCacheFromDisk();
    if (cache.schoolProfiles && cache.schoolProfiles[slug]) {
      delete cache.schoolProfiles[slug];
      saveSchoolCacheToDisk(cache);
      return true;
    }
    return false;
  }
  try {
    await db.collection('schoolProfiles').doc(slug).delete();
    console.log(`[FIREBASE] Perfil de colegio eliminado de Firestore: ${slug}`);
    return true;
  } catch (error: any) {
    console.error('[FIREBASE] Error al eliminar perfil de Firestore:', error.message);
    return false;
  }
}

// 4. Pending ingestions queues (schools and product suggestions)
export async function getPendingIngestions(): Promise<{ pendingSchools: any[]; pendingProducts: any[] }> {
  if (useLocalFallback || !db) {
    const cache = loadSchoolCacheFromDisk();
    return {
      pendingSchools: cache.pendingSchools || [],
      pendingProducts: cache.pendingProductSuggestions || []
    };
  }
  try {
    const schoolsSnap = await db.collection('pendingSchools').get();
    const productsSnap = await db.collection('pendingProductSuggestions').get();
    
    const pendingSchools: any[] = [];
    schoolsSnap.forEach(doc => {
      pendingSchools.push({ id: doc.id, ...doc.data() });
    });
    
    const pendingProducts: any[] = [];
    productsSnap.forEach(doc => {
      pendingProducts.push({ id: doc.id, ...doc.data() });
    });
    
    return { pendingSchools, pendingProducts };
  } catch (error: any) {
    console.error('[FIREBASE] Error al obtener colas pendientes de Firestore. Usando fallback:', error.message);
    const cache = loadSchoolCacheFromDisk();
    return {
      pendingSchools: cache.pendingSchools || [],
      pendingProducts: cache.pendingProductSuggestions || []
    };
  }
}

export async function savePendingSchool(school: any): Promise<boolean> {
  if (useLocalFallback || !db) {
    const cache = loadSchoolCacheFromDisk();
    cache.pendingSchools = cache.pendingSchools || [];
    cache.pendingSchools.push(school);
    saveSchoolCacheToDisk(cache);
    return true;
  }
  try {
    await db.collection('pendingSchools').doc(school.id).set(school);
    return true;
  } catch (error: any) {
    console.error('[FIREBASE] Error al guardar colegio pendiente en Firestore:', error.message);
    const cache = loadSchoolCacheFromDisk();
    cache.pendingSchools = cache.pendingSchools || [];
    cache.pendingSchools.push(school);
    saveSchoolCacheToDisk(cache);
    return true;
  }
}

export async function savePendingProduct(product: any): Promise<boolean> {
  if (useLocalFallback || !db) {
    const cache = loadSchoolCacheFromDisk();
    cache.pendingProductSuggestions = cache.pendingProductSuggestions || [];
    cache.pendingProductSuggestions.push(product);
    saveSchoolCacheToDisk(cache);
    return true;
  }
  try {
    await db.collection('pendingProductSuggestions').doc(product.id).set(product);
    return true;
  } catch (error: any) {
    console.error('[FIREBASE] Error al guardar producto sugerido en Firestore:', error.message);
    const cache = loadSchoolCacheFromDisk();
    cache.pendingProductSuggestions = cache.pendingProductSuggestions || [];
    cache.pendingProductSuggestions.push(product);
    saveSchoolCacheToDisk(cache);
    return true;
  }
}

export async function updatePendingQueueStatus(type: 'SCHOOL' | 'PRODUCT', id: string, status: string): Promise<boolean> {
  if (useLocalFallback || !db) {
    const cache = loadSchoolCacheFromDisk();
    if (type === 'SCHOOL') {
      const idx = cache.pendingSchools.findIndex((s: any) => s.id === id);
      if (idx !== -1) {
        if (status === 'REJECTED') {
          cache.pendingSchools = cache.pendingSchools.filter((s: any) => s.id !== id);
        } else {
          cache.pendingSchools[idx].status = status;
        }
        saveSchoolCacheToDisk(cache);
        return true;
      }
    } else {
      const idx = cache.pendingProductSuggestions.findIndex((p: any) => p.id === id);
      if (idx !== -1) {
        if (status === 'REJECTED') {
          cache.pendingProductSuggestions = cache.pendingProductSuggestions.filter((p: any) => p.id !== id);
        } else {
          cache.pendingProductSuggestions[idx].status = status;
        }
        saveSchoolCacheToDisk(cache);
        return true;
      }
    }
    return false;
  }
  try {
    const collectionName = type === 'SCHOOL' ? 'pendingSchools' : 'pendingProductSuggestions';
    if (status === 'REJECTED') {
      await db.collection(collectionName).doc(id).delete();
    } else {
      await db.collection(collectionName).doc(id).update({ status });
    }
    return true;
  } catch (error: any) {
    console.error('[FIREBASE] Error al actualizar estado de cola en Firestore:', error.message);
    return false;
  }
}

// 5. Match Reviews (Levenshtein moderate confidence review queues)
export async function getMatchReviews(): Promise<any[]> {
  if (useLocalFallback || !db) {
    return loadMatchReviewsFromDisk();
  }
  try {
    const snapshot = await db.collection('pendingMatchReviews').get();
    const reviews: any[] = [];
    snapshot.forEach(doc => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    return reviews;
  } catch (error: any) {
    console.error('[FIREBASE] Error al obtener revisiones de Firestore:', error.message);
    return loadMatchReviewsFromDisk();
  }
}

export async function saveMatchReview(review: any): Promise<boolean> {
  if (useLocalFallback || !db) {
    const reviews = loadMatchReviewsFromDisk();
    if (!reviews.some(r => r.searchedName === review.searchedName)) {
      reviews.push(review);
      saveMatchReviewsToDisk(reviews);
    }
    return true;
  }
  try {
    // Avoid duplicates by checking searchedName
    const query = await db.collection('pendingMatchReviews').where('searchedName', '==', review.searchedName).get();
    if (query.empty) {
      await db.collection('pendingMatchReviews').doc(review.id).set(review);
    }
    return true;
  } catch (error: any) {
    console.error('[FIREBASE] Error al guardar revisión en Firestore:', error.message);
    const reviews = loadMatchReviewsFromDisk();
    if (!reviews.some(r => r.searchedName === review.searchedName)) {
      reviews.push(review);
      saveMatchReviewsToDisk(reviews);
    }
    return true;
  }
}

export async function updateMatchReviewStatus(id: string, action: string, correctedProductId?: string): Promise<any[]> {
  const localUpdate = () => {
    let reviews = loadMatchReviewsFromDisk();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx !== -1) {
      if (action === 'APPROVE') {
        reviews[idx].status = 'APPROVED';
      } else if (action === 'REJECT') {
        reviews[idx].status = 'REJECTED';
      } else if (action === 'UPDATE' && correctedProductId) {
        reviews[idx].status = 'APPROVED_CORRECTED';
        reviews[idx].suggestedProductId = correctedProductId;
      }
      // Keep only pending ones in queue
      reviews = reviews.filter(r => r.status === 'PENDING');
      saveMatchReviewsToDisk(reviews);
    }
    return reviews;
  };

  if (useLocalFallback || !db) {
    return localUpdate();
  }
  try {
    if (action === 'APPROVE') {
      await db.collection('pendingMatchReviews').doc(id).update({ status: 'APPROVED' });
    } else if (action === 'REJECT') {
      await db.collection('pendingMatchReviews').doc(id).delete(); // or update
    } else if (action === 'UPDATE' && correctedProductId) {
      await db.collection('pendingMatchReviews').doc(id).update({
        status: 'APPROVED_CORRECTED',
        suggestedProductId: correctedProductId
      });
    }
    // Delete approved ones from collection to thin down queue, or just query active PENDING ones
    if (action === 'APPROVE' || action === 'UPDATE') {
      await db.collection('pendingMatchReviews').doc(id).delete();
    }
    return getMatchReviews();
  } catch (error: any) {
    console.error('[FIREBASE] Error al actualizar revisión en Firestore:', error.message);
    return localUpdate();
  }
}
