import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient, STORAGE_BUCKET } from "@/lib/supabase/server";
import { TransportDocumentSchema } from "@/lib/extraction-schema";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nie si prihlásený." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const rawData = formData.get("data");

  if (!(file instanceof File) || typeof rawData !== "string") {
    return NextResponse.json(
      { error: "Chýba súbor alebo dáta dokumentu." },
      { status: 400 },
    );
  }

  const parsed = TransportDocumentSchema.safeParse(JSON.parse(rawData));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Neplatné dáta dokumentu.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const id = randomUUID();
  const extension = file.name.split(".").pop() || "bin";
  // Prefix so path so Storage RLS can scope access to the owner's folder.
  const filePath = `${user.id}/${id}/${file.name || `document.${extension}`}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("Storage upload failed:", uploadError);
    return NextResponse.json(
      { error: "Nahratie súboru do úložiska zlyhalo." },
      { status: 502 },
    );
  }

  const { error: insertError } = await supabase
    .from("transport_documents")
    .insert({
      id,
      user_id: user.id,
      file_name: file.name,
      file_path: filePath,
      mime_type: file.type,
      data: parsed.data,
    });

  if (insertError) {
    console.error("Insert failed:", insertError);
    return NextResponse.json(
      { error: "Uloženie záznamu do databázy zlyhalo." },
      { status: 502 },
    );
  }

  return NextResponse.json({ id }, { status: 201 });
}

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nie si prihlásený." }, { status: 401 });
  }

  // RLS already scopes this to the caller's own rows — the explicit filter
  // just makes that intent visible in the code.
  const { data, error } = await supabase
    .from("transport_documents")
    .select("id, created_at, file_name, mime_type, data")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("List failed:", error);
    return NextResponse.json(
      { error: "Načítanie dokumentov zlyhalo." },
      { status: 502 },
    );
  }

  return NextResponse.json({ documents: data });
}
