import { NextRequest, NextResponse } from "next/server";
import { extractTransportDocument } from "@/lib/anthropic";
import {
  resolveApiCaller,
  enforceMonthlyLimit,
  incrementDocumentUsage,
} from "@/lib/subscription";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
]);
const MAX_SIZE_BYTES = 15 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const caller = await resolveApiCaller(req);
  if ("error" in caller) return caller.error;
  const { userId, plan } = caller;

  const limitError = await enforceMonthlyLimit(userId, plan);
  if (limitError) return limitError;

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Chýba súbor v poli 'file'." },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Nepodporovaný typ súboru." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Súbor je príliš veľký (max 15 MB)." },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await extractTransportDocument({
      base64Data: buffer.toString("base64"),
      mimeType: file.type,
    });

    await incrementDocumentUsage(userId);

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Extraction failed:", err);
    return NextResponse.json(
      { error: "Extrakcia dát cez Claude zlyhala. Skús to znova." },
      { status: 502 },
    );
  }
}
