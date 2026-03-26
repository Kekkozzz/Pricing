import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  generateImage,
  GeminiTimeoutError,
  GeminiRateLimitError,
  GeminiNoImageError,
} from "@/app/lib/gemini";
import { buildImagePrompt, type PreviewInput } from "@/app/data/preview-prompts";

export const maxDuration = 120;

// In-memory rate limit store (per-instance; sufficient for single-server deploy)
const ipCounts = new Map<string, { count: number; resetAt: number }>();

function checkIPLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + 3600_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

function checkSessionLimit(sessionCount: number): boolean {
  return sessionCount < 3;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting — IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (!checkIPLimit(ip)) {
      return Response.json(
        { error: "Hai raggiunto il limite di preview. Contattaci per vedere di più!" },
        { status: 429 }
      );
    }

    // Rate limiting — Session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("preview_count");
    const sessionCount = sessionCookie ? parseInt(sessionCookie.value, 10) : 0;

    if (!checkSessionLimit(sessionCount)) {
      return Response.json(
        { error: "Hai raggiunto il limite di preview per questa sessione." },
        { status: 429 }
      );
    }

    // Validate input
    const body = await request.json();
    const { businessName, sector, style, colorPalette, description, referenceUrls,
            serviceName, serviceId, tierName, features, addOns } = body;

    if (!businessName || !sector || !style || !serviceName || !tierName) {
      return Response.json(
        { error: "Campi obbligatori mancanti" },
        { status: 400 }
      );
    }

    const input: PreviewInput = {
      businessName: String(businessName).slice(0, 100),
      sector: String(sector).slice(0, 50),
      style: String(style).slice(0, 30),
      colorPalette: Array.isArray(colorPalette) ? colorPalette.slice(0, 5).map((c: string) => String(c).slice(0, 10)) : [],
      description: String(description ?? "").slice(0, 500),
      referenceUrls: referenceUrls ? String(referenceUrls).slice(0, 200) : undefined,
      serviceName: String(serviceName).slice(0, 50),
      serviceId: String(serviceId).slice(0, 30),
      tierName: String(tierName).slice(0, 20),
      features: Array.isArray(features) ? features.slice(0, 15).map((f: string) => String(f).slice(0, 50)) : [],
      addOns: Array.isArray(addOns) ? addOns.slice(0, 10).map((a: string) => String(a).slice(0, 50)) : [],
    };

    const prompt = buildImagePrompt(input);
    const imageBase64 = await generateImage(prompt);

    // Update session cookie
    const response = Response.json({ imageBase64 });
    response.headers.set(
      "Set-Cookie",
      `preview_count=${sessionCount + 1}; Path=/; Max-Age=86400; SameSite=Strict`
    );

    return response;
  } catch (err) {
    console.error("Image generation error:", err);

    if (err instanceof GeminiTimeoutError) {
      return Response.json(
        { error: "La generazione sta impiegando troppo tempo. Riprova tra qualche istante." },
        { status: 504 }
      );
    }

    if (err instanceof GeminiRateLimitError) {
      return Response.json(
        { error: "Servizio temporaneamente sovraccarico. Riprova tra un minuto." },
        { status: 429 }
      );
    }

    if (err instanceof GeminiNoImageError) {
      return Response.json(
        { error: "Il modello non ha generato un'immagine. Riprova con una descrizione diversa." },
        { status: 502 }
      );
    }

    return Response.json(
      { error: "Errore nella generazione dell'immagine. Riprova." },
      { status: 500 }
    );
  }
}
