import { Request, Response, NextFunction } from "express";

/**
 * Structured HTTP request logging middleware for observability.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    
    console.log(
      `[OBSERVABILITY] ${new Date().toISOString()} | ${method} | ${originalUrl} | Status: ${statusCode} | ${duration}ms | IP: ${ip}`
    );
  });

  next();
}
