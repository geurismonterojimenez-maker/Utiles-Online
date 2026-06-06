import { rateLimit } from 'express-rate-limit';

// 1. IA Scanner and List Ingestion Limiter (max 20 requests per hour per IP)
export const scanRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    success: false,
    error: 'Has excedido el límite de escaneo de listas por hora. Por favor, intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429
});

// 2. Search and Product Discovery Limiter (max 100 requests per 15 minutes per IP)
export const searchRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: 'Demasiadas solicitudes de búsqueda en poco tiempo. Por favor, disminuye la frecuencia.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429
});

// 3. Price Alerts registration Limiter (max 10 registrations per hour per IP)
export const alertRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: 'Límite de creación de alertas de precio superado por esta hora. Intenta más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429
});

// 4. Live grounded pricing checking Limiter (max 30 requests per hour per IP)
export const livePriceRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  message: {
    success: false,
    error: 'Límite de verificación de precios en vivo excedido. Por favor, intenta en una hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429
});
