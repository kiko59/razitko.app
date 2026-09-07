import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getApiTranslator } from "@/lib/i18n-server";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const t = await getApiTranslator();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: t("errors.notLoggedIn") }, { status: 401 });
  }

  const { data: record, error } = await supabase
    .from("transport_documents")
    .select("id, created_at, file_name, mime_type, data")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !record) {
    return NextResponse.json(
      { error: t("errors.documentNotFound") },
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
