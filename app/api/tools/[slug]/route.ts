import { NextResponse } from "next/server";
import { getClientKey, rateLimit } from "@/lib/security";
import { getTool } from "@/lib/tools";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const request = _request;
  const limit = rateLimit(getClientKey(request));
  if (!limit.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." }, { status: 429 });
  }

  const { slug } = await context.params;
  const tool = getTool(slug);

  if (!tool) {
    return NextResponse.json({ error: "Herramienta no encontrada" }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const { processToolFile } = await import("@/lib/processors");
    const result = await processToolFile(tool, formData);
    return new NextResponse(Buffer.from(result.buffer), {
      headers: {
        "Content-Type": result.contentType,
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Cache-Control": "no-store",
        "X-RateLimit-Remaining": String(limit.remaining)
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No se pudo procesar el archivo.",
        tool: tool.slug
      },
      { status: 400 }
    );
  }
}
