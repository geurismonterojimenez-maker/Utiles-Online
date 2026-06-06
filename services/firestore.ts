import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let db: admin.firestore.Firestore | null = null;
let useLocalFallback = false;

try {
  // Try initializing Firebase Admin SDK with default credentials (Application Default Credentials).
  // This works seamlessly in Google Cloud environments (like Cloud Run).
  admin.initializeApp();
  db = admin.firestore();
  console.log('[FIREBASE ADMIN] Inicializado exitosamente con credenciales del entorno.');
} catch (error: any) {
  console.warn('[FIREBASE ADMIN] No se pudo inicializar con credenciales por defecto. Intentando configuración por Project ID...');
  
  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      // Initialize with just the Project ID. For local offline development, 
      // if FIRESTORE_EMULATOR_HOST is set, this works. Otherwise, operations will fall back.
      admin.initializeApp({
        projectId: config.projectId
      });
      db = admin.firestore();
      console.log(`[FIREBASE ADMIN] Inicializado con Project ID del archivo config: ${config.projectId}`);
    } else {
      throw new Error('Archivo firebase-applet-config.json no encontrado.');
    }
  } catch (err: any) {
    console.error('[FIREBASE ADMIN] Error crítico al inicializar Firebase Admin SDK:', err.message);
    console.warn('[SISTEMA] Activando modo Fallback Local (persistencia en archivos JSON en disco).');
    useLocalFallback = true;
  }
}

// In case the SDK was initialized but no credentials exist and we are not in emulator mode,
// a network request will fail. We keep a flag to dynamically trigger fallback if operations fail.
export { db, useLocalFallback };
