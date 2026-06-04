const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "local";
  return ip.slice(0, 80);
}

export function rateLimit(key: string, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  return { allowed: true, remaining: limit - current.count };
}

export function assertFileSize(file: File, maxMb: number) {
  const maxBytes = maxMb * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`El archivo supera el límite de ${maxMb} MB.`);
  }
}

export function assertMime(file: File, allowed: string[], extensions: string[] = []) {
  const normalizedName = file.name.toLowerCase();
  const hasAllowedExtension = extensions.some((extension) => normalizedName.endsWith(extension));
  const hasAllowedMime = allowed.includes(file.type);
  const browserDidNotKnowMime = !file.type || file.type === "application/octet-stream";

  if (!hasAllowedMime && !(browserDidNotKnowMime && hasAllowedExtension)) {
    throw new Error("Tipo de archivo no permitido.");
  }
}

export function safeFilename(name: string, fallback = "resultado") {
  return (
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || fallback
  );
}
