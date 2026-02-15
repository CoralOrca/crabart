import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const offset = Number(request.nextUrl.searchParams.get("offset") ?? "0");
  const limit = Math.min(
    Number(request.nextUrl.searchParams.get("limit") ?? PAGE_SIZE),
    50
  );

  const { data, error } = await supabase
    .from("generations")
    .select("id, created_at, expression, outfit, accessory, image_url")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ generations: data ?? [], hasMore: (data?.length ?? 0) === limit });
}
