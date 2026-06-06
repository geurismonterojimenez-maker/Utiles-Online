/**
 * Distributed Cache Service
 * 
 * Provides a clean abstraction interface for caching expensive operations.
 * Connects to Redis if REDIS_URL is configured, and falls back transparently
 * to local in-memory cache if Redis is unavailable or the client package is missing.
 */

// Local memory store for fallback caching
const memoryCache = new Map<string, { value: string; expiresAt: number | null }>();

let redisClient: any = null;
let isRedisConnected = false;

/**
 * Initializes and retrieves the Redis client instance lazily.
 */
async function getRedisClient() {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.log("[CACHE] REDIS_URL no configurado. Usando caché local en memoria (Modo Dev/Local).");
    return null;
  }

  try {
    // Lazy dynamic import to ensure the server starts up even if the redis client package isn't installed.
    const { default: Redis } = await import("ioredis");
    
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
      retryStrategy(times) {
        if (times > 3) {
          console.warn("[CACHE] Se excedió el límite de reintentos para Redis. Cambiando a caché local en memoria.");
          return null; // Stop retrying
        }
        return Math.min(times * 100, 2000);
      }
    });

    redisClient.on("connect", () => {
      isRedisConnected = true;
      console.log("[CACHE] Conectado exitosamente al servidor de caché distribuido Redis.");
    });

    redisClient.on("error", (err: any) => {
      isRedisConnected = false;
      console.error("[CACHE] Error en la conexión de Redis:", err.message);
    });

    return redisClient;
  } catch (err) {
    console.warn("[CACHE] El paquete 'ioredis' no está instalado o falló la configuración. Usando caché en memoria.");
    return null;
  }
}

// Pre-initialize client connection asynchronously on startup
getRedisClient().catch(() => {});

export const cacheService = {
  /**
   * Retrieves a value from cache
   */
  async get(key: string): Promise<string | null> {
    try {
      const client = await getRedisClient();
      if (client && isRedisConnected) {
        return await client.get(key);
      }
    } catch (err) {
      console.error(`[CACHE] Error al obtener la clave '${key}' de Redis:`, err);
    }

    // Local Memory Fallback
    const cached = memoryCache.get(key);
    if (!cached) return null;

    if (cached.expiresAt && Date.now() > cached.expiresAt) {
      memoryCache.delete(key);
      return null;
    }

    return cached.value;
  },

  /**
   * Sets a value in cache with an optional TTL in seconds
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      const client = await getRedisClient();
      if (client && isRedisConnected) {
        if (ttlSeconds) {
          await client.set(key, value, "EX", ttlSeconds);
        } else {
          await client.set(key, value);
        }
        return;
      }
    } catch (err) {
      console.error(`[CACHE] Error al guardar la clave '${key}' en Redis:`, err);
    }

    // Local Memory Fallback
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    memoryCache.set(key, { value, expiresAt });
  },

  /**
   * Deletes a value from cache
   */
  async del(key: string): Promise<void> {
    try {
      const client = await getRedisClient();
      if (client && isRedisConnected) {
        await client.del(key);
        return;
      }
    } catch (err) {
      console.error(`[CACHE] Error al eliminar la clave '${key}' de Redis:`, err);
    }

    // Local Memory Fallback
    memoryCache.delete(key);
  },

  /**
   * Returns true if distributed Redis cache is connected
   */
  isDistributed(): boolean {
    return redisClient !== null && isRedisConnected;
  }
};
