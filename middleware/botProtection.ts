import { Request, Response, NextFunction } from "express";

/**
 * Middleware to protect sensitive endpoints from bots using Cloudflare Turnstile.
 * Falls back safely if the server lacks configuration or if the validation service is unreachable.
 */
export async function verifyBotToken(req: Request, res: Response, next: NextFunction) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.warn(
      "[BOT PROTECTION] TURNSTILE_SECRET_KEY is not configured. Skipping bot verification (Local dev mode)."
    );
    return next();
  }

  // Token can be sent in request body or header
  const token = req.body.turnstileToken || req.headers["x-turnstile-token"];

  if (!token) {
    return res.status(403).json({
      success: false,
      error: "Verificación de seguridad (CAPTCHA/Turnstile) requerida."
    });
  }

  try {
    const ip = req.ip || req.socket.remoteAddress || "";
    
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: String(token),
        remoteip: ip,
      }).toString(),
    });

    const data = (await response.json()) as { success: boolean; "error-codes"?: string[] };
    
    if (data && data.success) {
      return next();
    }

    console.error("[BOT PROTECTION] Turnstile verification failed. Response:", data);
    return res.status(403).json({
      success: false,
      error: "Verificación de seguridad fallida. Por favor, inténtelo de nuevo."
    });
  } catch (error) {
    console.error("[BOT PROTECTION] Exception during Turnstile verification:", error);
    // Fail open in case of network errors to Cloudflare to avoid locking out users
    console.warn("[BOT PROTECTION] Proceeding via emergency fallback due to service exception.");
    return next();
  }
}
