import { db, useLocalFallback } from './firestore';
import fs from 'fs';
import path from 'path';

const PRODUCTS_CACHE_PATH = path.join(process.cwd(), 'products-cache.json');

// Memory cache helper to avoid constant disk reads if fallback is active
let localMemoryAlerts: any[] | null = null;

function loadAlertsFromDisk(): any[] {
  try {
    if (fs.existsSync(PRODUCTS_CACHE_PATH)) {
      const content = fs.readFileSync(PRODUCTS_CACHE_PATH, 'utf8');
      const parsed = JSON.parse(content);
      return parsed.localPriceAlerts || [];
    }
  } catch (err) {
    console.error('[ALERT FALLBACK] Error al leer alertas desde disco:', err);
  }
  return [];
}

function saveAlertsToDisk(alerts: any[]) {
  try {
    let currentCache: any = {};
    if (fs.existsSync(PRODUCTS_CACHE_PATH)) {
      currentCache = JSON.parse(fs.readFileSync(PRODUCTS_CACHE_PATH, 'utf8'));
    }
    currentCache.localPriceAlerts = alerts;
    fs.writeFileSync(PRODUCTS_CACHE_PATH, JSON.stringify(currentCache, null, 2), 'utf8');
    console.log('[ALERT FALLBACK] Alertas de precios guardadas en disco local.');
  } catch (err) {
    console.error('[ALERT FALLBACK] Error al escribir alertas en disco:', err);
  }
}

export async function getPriceAlerts(): Promise<any[]> {
  if (useLocalFallback || !db) {
    return loadAlertsFromDisk();
  }
  try {
    const snapshot = await db.collection('priceAlerts').get();
    const alerts: any[] = [];
    snapshot.forEach(doc => {
      alerts.push({ id: doc.id, ...doc.data() });
    });
    return alerts;
  } catch (error: any) {
    console.error('[FIREBASE] Error al obtener alertas de Firestore. Activando fallback de disco:', error.message);
    return loadAlertsFromDisk();
  }
}

export async function savePriceAlert(alert: any): Promise<boolean> {
  if (useLocalFallback || !db) {
    const alerts = loadAlertsFromDisk();
    alerts.push(alert);
    saveAlertsToDisk(alerts);
    return true;
  }
  try {
    await db.collection('priceAlerts').doc(alert.id).set(alert);
    console.log(`[FIREBASE] Alerta de precio guardada en Firestore para: ${alert.email}`);
    return true;
  } catch (error: any) {
    console.error('[FIREBASE] Error al guardar alerta en Firestore. Guardando en disco local:', error.message);
    const alerts = loadAlertsFromDisk();
    alerts.push(alert);
    saveAlertsToDisk(alerts);
    return true;
  }
}

export async function updatePriceAlertStatus(alertId: string, status: string, additionalFields: any = {}): Promise<boolean> {
  if (useLocalFallback || !db) {
    const alerts = loadAlertsFromDisk();
    const idx = alerts.findIndex(a => a.id === alertId);
    if (idx !== -1) {
      alerts[idx] = { ...alerts[idx], status, ...additionalFields };
      saveAlertsToDisk(alerts);
      return true;
    }
    return false;
  }
  try {
    await db.collection('priceAlerts').doc(alertId).update({
      status,
      ...additionalFields
    });
    console.log(`[FIREBASE] Alerta ${alertId} actualizada a estado ${status} en Firestore.`);
    return true;
  } catch (error: any) {
    console.error('[FIREBASE] Error al actualizar alerta en Firestore. Modificando en disco local:', error.message);
    const alerts = loadAlertsFromDisk();
    const idx = alerts.findIndex(a => a.id === alertId);
    if (idx !== -1) {
      alerts[idx] = { ...alerts[idx], status, ...additionalFields };
      saveAlertsToDisk(alerts);
      return true;
    }
    return false;
  }
}
