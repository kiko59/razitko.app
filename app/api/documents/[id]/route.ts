import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = supabaseServer();
  const { data: record, error } = await supabase
    .from("transport_documents")
    .select("id, created_at, file_name, mime_type, data")
    .eq("id", params.id)
    .single();

  if (error || !record) {
    return NextResponse.json(
      { error: "Dokument sa nenašiel." },
      { status: 404 },
    );
  }

  const download = req.nextUrl.searchParams.get("download");
  const headers = new Headers({ "Content-Type": "application/json" });
  if (download) {
    headers.set(
      "Content-Disposition",
      `attachment; filename="${record.id}.json"`,
    );
  }

  return new NextResponse(JSON.stringify(record, null, 2), { headers });
}
