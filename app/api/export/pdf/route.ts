import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, rgb, type PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { createClient } from "@/lib/supabase/server";
import { getApiTranslator } from "@/lib/i18n-server";
import type { TransportDocumentData } from "@/lib/types";

export const runtime = "nodejs";

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  CMR: "CMR",
  BOL: "Bill of Lading (BOL)",
  dodaci_list: "Dodací list",
  iny: "Iný",
};

function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, fontSize) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function GET(req: NextRequest) {
  const t = await getApiTranslator();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: t("errors.missingIdParam") }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: t("errors.notLoggedIn") }, { status: 401 });
  }

  const { data: record, error } = await supabase
    .from("transport_documents")
    .select("id, created_at, file_name, data")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !record) {
    return NextResponse.json({ error: t("errors.documentNotFound") }, { status: 404 });
  }

  const docData = record.data as TransportDocumentData;

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontsDir = path.join(process.cwd(), "assets", "fonts");
  const [regularBytes, boldBytes] = await Promise.all([
    readFile(path.join(fontsDir, "DejaVuSans.ttf")),
    readFile(path.join(fontsDir, "DejaVuSans-Bold.ttf")),
  ]);
  const font = await pdfDoc.embedFont(regularBytes);
  const fontBold = await pdfDoc.embedFont(boldBytes);

  const pageWidth = 595.28; // A4
  const pageHeight = 841.89;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  function ensureSpace(lineHeight: number) {
    if (y - lineHeight < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
  }

  function drawTitle(text: string) {
    ensureSpace(28);
    page.drawText(text, { x: margin, y, size: 18, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    y -= 28;
  }

  function drawSectionHeading(text: string) {
    ensureSpace(22);
    page.drawText(text, { x: margin, y, size: 12, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
    y -= 18;
  }

  function drawField(label: string, value: string | null) {
    const displayValue = value && value.trim() !== "" ? value : "—";
    const labelText = `${label}: `;
    const labelWidth = fontBold.widthOfTextAtSize(labelText, 10);
    const lines = wrapText(displayValue, font, 10, contentWidth - labelWidth);

    ensureSpace(16);
    page.drawText(labelText, { x: margin, y, size: 10, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
    page.drawText(lines[0] ?? "—", {
      x: margin + labelWidth,
      y,
      size: 10,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 15;

    for (const line of lines.slice(1)) {
      ensureSpace(15);
      page.drawText(line, { x: margin + labelWidth, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
      y -= 15;
    }
  }

  drawTitle("Prepravný dokument — zhrnutie");
  page.drawText(
    `Typ dokumentu: ${DOCUMENT_TYPE_LABELS[docData.document_type] ?? docData.document_type}`,
    { x: margin, y, size: 11, font, color: rgb(0.2, 0.2, 0.2) },
  );
  y -= 16;
  page.drawText(`Vygenerované: ${new Date().toLocaleString("sk-SK")}`, {
    x: margin,
    y,
    size: 9,
    font,
    color: rgb(0.45, 0.45, 0.45),
  });
  y -= 26;

  drawSectionHeading("Odosielateľ");
  drawField("Meno / názov", docData.sender.name);
  drawField("Adresa", docData.sender.address);
  y -= 6;

  drawSectionHeading("Príjemca");
  drawField("Meno / názov", docData.recipient.name);
  drawField("Adresa", docData.recipient.address);
  y -= 6;

  drawSectionHeading("Preprava");
  drawField("Referenčné číslo", docData.reference_number);
  drawField("Váha (kg)", docData.weight_kg != null ? String(docData.weight_kg) : null);
  drawField("Dátum nakládky", docData.loading_date);
  drawField("Miesto nakládky", docData.loading_place);
  drawField("Miesto vykládky", docData.unloading_place);

  if (docData.notes) {
    y -= 6;
    drawSectionHeading("Poznámky");
    drawField("Poznámky", docData.notes);
  }

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${record.id}.pdf"`,
    },
  });
}
