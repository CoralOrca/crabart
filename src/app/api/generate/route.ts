import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { REFERENCE_CONTEXT } from "@/lib/prompt";
import * as fs from "node:fs";
import * as path from "node:path";

export const maxDuration = 60; // Allow up to 60s for image generation

// ---------------------------------------------------------------------------
// Load reference images from disk (cached at module level)
// ---------------------------------------------------------------------------

const REFS_DIR = path.join(process.cwd(), "public", "references");
const EXPRESSIONS_DIR = path.join(REFS_DIR, "expressions");

function loadImage(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  return buffer.toString("base64");
}

let cachedCharacterRef: string | null = null;
let cachedCompositionMask: string | null = null;
const cachedExpressions = new Map<string, string>();

function getCharacterRef(): string {
  if (!cachedCharacterRef) {
    cachedCharacterRef = loadImage(path.join(REFS_DIR, "character-reference.png"));
  }
  return cachedCharacterRef;
}

function getCompositionMask(): string {
  if (!cachedCompositionMask) {
    cachedCompositionMask = loadImage(path.join(REFS_DIR, "composition-mask.png"));
  }
  return cachedCompositionMask;
}

function getExpressionImage(expressionId: string): string | null {
  if (cachedExpressions.has(expressionId)) {
    return cachedExpressions.get(expressionId)!;
  }
  const filePath = path.join(EXPRESSIONS_DIR, `${expressionId}.png`);
  if (!fs.existsSync(filePath)) {
    console.warn(`[generate] Expression image not found: ${filePath}`);
    return null;
  }
  const data = loadImage(filePath);
  cachedExpressions.set(expressionId, data);
  return data;
}

// ---------------------------------------------------------------------------
// API handler
// ---------------------------------------------------------------------------

interface GenerateRequest {
  prompt: string;
  expressionId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_API_KEY is not configured. Add it to .env.local" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as GenerateRequest;
    const { prompt, expressionId } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "A prompt string is required." },
        { status: 400 }
      );
    }

    // Load the single matching expression image (not the full sheet)
    const expressionData = expressionId
      ? getExpressionImage(expressionId)
      : null;

    console.log(
      `[generate] Calling Nano Banana (expression=${expressionId ?? "none"}) with prompt (${prompt.length} chars)...`
    );

    const ai = new GoogleGenAI({ apiKey });

    // Build multimodal contents array
    // Image 1: Character reference (identity + full body)
    // Image 2: Composition mask (silhouette + position — HIGHEST PRIORITY)
    // Image 3: Single expression face (eyes + mouth ONLY — no body/silhouette)
    type ContentPart =
      | string
      | { inlineData: { mimeType: string; data: string } };

    const contents: ContentPart[] = [
      // Image 1: Character reference
      {
        inlineData: {
          mimeType: "image/png",
          data: getCharacterRef(),
        },
      },
      // Image 2: Composition mask (silhouette authority)
      {
        inlineData: {
          mimeType: "image/png",
          data: getCompositionMask(),
        },
      },
    ];

    // Image 3: Single expression face (only if available)
    if (expressionData) {
      contents.push({
        inlineData: {
          mimeType: "image/png",
          data: expressionData,
        },
      });
    }

    // Text prompt with reference context
    contents.push(REFERENCE_CONTEXT + "\n\n" + prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    // Extract image data from response parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts || parts.length === 0) {
      console.error(
        "[generate] No parts in response:",
        JSON.stringify(response, null, 2)
      );
      return NextResponse.json(
        { error: "No content returned from the model." },
        { status: 502 }
      );
    }

    let imageBase64: string | null = null;
    let imageMimeType: string | null = null;
    let textResponse: string | null = null;

    for (const part of parts) {
      if (part.inlineData) {
        imageBase64 = part.inlineData.data ?? null;
        imageMimeType = part.inlineData.mimeType ?? "image/png";
      }
      if (part.text) {
        textResponse = part.text;
      }
    }

    if (!imageBase64) {
      console.error(
        "[generate] No image in response. Text response:",
        textResponse
      );
      return NextResponse.json(
        {
          error:
            textResponse ??
            "The model did not return an image. Try adjusting the prompt.",
        },
        { status: 502 }
      );
    }

    console.log(
      `[generate] Success — received ${imageMimeType} image (${Math.round((imageBase64.length * 3) / 4 / 1024)}KB)`
    );

    return NextResponse.json({
      image: imageBase64,
      mimeType: imageMimeType,
      text: textResponse,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[generate] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
