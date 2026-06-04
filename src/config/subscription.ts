export type SubscriptionStatus =
  | 'FREE'
  | 'PRO_ACTIVE'
  | 'PRO_TRIAL'
  | 'PRO_PENDING'
  | 'PRO_EXPIRED'
  | 'PRO_CANCELED';

export type SubscriptionPlan = 'FREE' | 'PRO';
export type BillingCycle = 'mensual' | 'anual' | 'trial';

export interface SubscriptionState {
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  startedAt: string | null;
  endsAt: string | null;
  trialEndsAt: string | null;
  paymentMethod: string | null;
  autoRenew: boolean;
  lastAction: string | null;
  lastUpdatedAt: string | null;
}

export const SUBSCRIPTION_STORAGE_KEY = 'negociord_subscription_state';
export const LEGACY_TIER_STORAGE_KEY = 'negociord_user_tier';
export const DEFAULT_TRIAL_DAYS = 7;
export const DEFAULT_MONTHLY_DAYS = 30;
export const DEFAULT_ANNUAL_DAYS = 365;

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  FREE: 'Gratis',
  PRO_ACTIVE: 'PRO activa',
  PRO_TRIAL: 'PRO en prueba',
  PRO_PENDING: 'PRO pendiente de pago',
  PRO_EXPIRED: 'PRO vencida',
  PRO_CANCELED: 'PRO cancelada',
};

export const SUBSCRIPTION_STATUS_TONE: Record<SubscriptionStatus, 'gray' | 'emerald' | 'amber' | 'rose'> = {
  FREE: 'gray',
  PRO_ACTIVE: 'emerald',
  PRO_TRIAL: 'amber',
  PRO_PENDING: 'amber',
  PRO_EXPIRED: 'rose',
  PRO_CANCELED: 'gray',
};

const nowIso = () => new Date().toISOString();
const addDaysIso = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export function isSubscriptionActive(status?: SubscriptionStatus | null): boolean {
  return status === 'PRO_ACTIVE' || status === 'PRO_TRIAL';
}

export function getTierFromSubscription(status?: SubscriptionStatus | null): SubscriptionPlan {
  return isSubscriptionActive(status) ? 'PRO' : 'FREE';
}

export function createDefaultSubscriptionState(): SubscriptionState {
  return {
    status: 'FREE',
    plan: 'FREE',
    billingCycle: 'mensual',
    startedAt: null,
    endsAt: null,
    trialEndsAt: null,
    paymentMethod: null,
    autoRenew: false,
    lastAction: 'initialized',
    lastUpdatedAt: nowIso(),
  };
}

export function createActiveSubscriptionState(
  billingCycle: Exclude<BillingCycle, 'trial'> = 'mensual',
  paymentMethod: string = 'demo-card'
): SubscriptionState {
  const durationDays = billingCycle === 'anual' ? DEFAULT_ANNUAL_DAYS : DEFAULT_MONTHLY_DAYS;
  const startedAt = nowIso();
  return {
    status: 'PRO_ACTIVE',
    plan: 'PRO',
    billingCycle,
    startedAt,
    endsAt: addDaysIso(durationDays),
    trialEndsAt: null,
    paymentMethod,
    autoRenew: true,
    lastAction: 'activated',
    lastUpdatedAt: startedAt,
  };
}

export function createTrialSubscriptionState(): SubscriptionState {
  const startedAt = nowIso();
  return {
    status: 'PRO_TRIAL',
    plan: 'PRO',
    billingCycle: 'trial',
    startedAt,
    endsAt: addDaysIso(DEFAULT_TRIAL_DAYS),
    trialEndsAt: addDaysIso(DEFAULT_TRIAL_DAYS),
    paymentMethod: 'trial',
    autoRenew: false,
    lastAction: 'trial-started',
    lastUpdatedAt: startedAt,
  };
}

export function createPendingSubscriptionState(billingCycle: Exclude<BillingCycle, 'trial'> = 'mensual'): SubscriptionState {
  const startedAt = nowIso();
  return {
    status: 'PRO_PENDING',
    plan: 'PRO',
    billingCycle,
    startedAt,
    endsAt: addDaysIso(billingCycle === 'anual' ? DEFAULT_ANNUAL_DAYS : DEFAULT_MONTHLY_DAYS),
    trialEndsAt: null,
    paymentMethod: 'pending-payment',
    autoRenew: false,
    lastAction: 'payment-pending',
    lastUpdatedAt: startedAt,
  };
}

export function expireSubscriptionState(state: SubscriptionState): SubscriptionState {
  return {
    ...state,
    status: 'PRO_EXPIRED',
    plan: 'FREE',
    autoRenew: false,
    lastAction: 'expired',
    lastUpdatedAt: nowIso(),
  };
}

export function cancelSubscriptionState(state: SubscriptionState): SubscriptionState {
  return {
    ...state,
    status: 'PRO_CANCELED',
    plan: 'FREE',
    autoRenew: false,
    lastAction: 'canceled',
    lastUpdatedAt: nowIso(),
  };
}

export function normalizeSubscriptionState(input: Partial<SubscriptionState> & { role?: string } | null | undefined): SubscriptionState {
  if (!input) return createDefaultSubscriptionState();

  const status = input.status && input.status in SUBSCRIPTION_STATUS_LABELS
    ? input.status
    : (input.role === 'PRO' ? 'PRO_ACTIVE' : 'FREE');

  const base = createDefaultSubscriptionState();
  const normalized: SubscriptionState = {
    ...base,
    ...input,
    status: status as SubscriptionStatus,
    plan: isSubscriptionActive(status as SubscriptionStatus) ? 'PRO' : 'FREE',
    billingCycle: input.billingCycle || base.billingCycle,
    lastUpdatedAt: input.lastUpdatedAt || nowIso(),
  };

  if (normalized.status === 'FREE') {
    normalized.plan = 'FREE';
    normalized.autoRenew = false;
  }

  return normalized;
}

export function parseStoredSubscriptionState(raw: string | null): SubscriptionState {
  if (!raw) return createDefaultSubscriptionState();
  try {
    const parsed = JSON.parse(raw);
    return normalizeSubscriptionState(parsed);
  } catch {
    return createDefaultSubscriptionState();
  }
}

export function serializeSubscriptionState(state: SubscriptionState): string {
  return JSON.stringify(state);
}

export function subscriptionNeedsRefresh(state: SubscriptionState): boolean {
  const reference = state.endsAt || state.trialEndsAt;
  if (!reference) return false;
  return new Date(reference).getTime() < Date.now() && isSubscriptionActive(state.status);
}

export function subscriptionStateForFirestore(state: SubscriptionState) {
  return {
    role: state.plan,
    subscriptionStatus: state.status,
    subscriptionPlan: state.plan,
    subscriptionBillingCycle: state.billingCycle,
    subscriptionStartedAt: state.startedAt,
    subscriptionEndsAt: state.endsAt,
    subscriptionTrialEndsAt: state.trialEndsAt,
    subscriptionPaymentMethod: state.paymentMethod,
    subscriptionAutoRenew: state.autoRenew,
    subscriptionLastAction: state.lastAction,
    subscriptionUpdatedAt: state.lastUpdatedAt,
    updatedAt: state.lastUpdatedAt || nowIso(),
  };
}
