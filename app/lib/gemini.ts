import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

const IMAGE_MODEL = "gemini-3.1-flash-image-preview";
const MAX_RETRIES = 1;
const IMAGE_TIMEOUT = 90_000;

// Custom error classes for differentiated handling
export class GeminiTimeoutError extends Error {
  constructor(ms: number) {
    super(`Timeout after ${ms}ms`);
    this.name = "GeminiTimeoutError";
  }
}

export class GeminiRateLimitError extends Error {
  constructor() {
    super("Rate limit exceeded");
    this.name = "GeminiRateLimitError";
  }
}

export class GeminiNoImageError extends Error {
  constructor() {
    super("No image returned from Gemini");
    this.name = "GeminiNoImageError";
  }
}

function isRateLimitError(err: unknown): boolean {
  if (err instanceof Error) {
    return (
      err.message.includes("429") ||
      err.message.includes("RESOURCE_EXHAUSTED")
    );
  }
  if (typeof err === "object" && err !== null && "status" in err) {
    return (err as { status: number }).status === 429;
  }
  return false;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (isRateLimitError(err)) throw new GeminiRateLimitError();
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error("Unreachable");
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new GeminiTimeoutError(ms)), ms);
    }),
  ]);
}

export async function generateImage(prompt: string): Promise<string> {
  return withRetry(async () => {
    const response = await withTimeout(
      ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: prompt,
        config: {
          responseModalities: [Modality.IMAGE],
        },
      }),
      IMAGE_TIMEOUT
    );

    const parts = response.candidates?.[0]?.content?.parts ?? [];

    for (const part of parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new GeminiNoImageError();
  });
}

