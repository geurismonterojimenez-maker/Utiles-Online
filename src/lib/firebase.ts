import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Log usage of a calculator/tool to Firestore
export async function logUsage(calculatorId: string, description: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return; // Silent return if anonymous/not logged in

  const logId = 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  try {
    await setDoc(doc(db, 'usageLogs', logId), {
      id: logId,
      uid: currentUser.uid,
      email: currentUser.email || 'anonimo@tunegociord.com',
      calculatorId,
      description,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging usage to Firestore:', error);
  }
}

// Log subscription transactions for audit trails
export async function logSubscription(
  previousTier: 'FREE' | 'PRO',
  newTier: 'FREE' | 'PRO',
  reason: string,
  details: Record<string, unknown> = {}
): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const logId = 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  try {
    await setDoc(doc(db, 'subscriptionLogs', logId), {
      id: logId,
      uid: currentUser.uid,
      email: currentUser.email || 'anonimo@tunegociord.com',
      previousTier,
      newTier,
      reason,
      ...details,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging subscription adjustment:', error);
  }
}

// Google Sign-In pop-up configurations
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
