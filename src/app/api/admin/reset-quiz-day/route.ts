import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  const { progressId, dayIndex } = await req.json();
  if (!progressId || dayIndex == null) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const { data: row, error: fetchErr } = await supabaseAdmin
    .from("quiz_progress")
    .select("submitted, scores")
    .eq("id", progressId)
    .single();

  if (fetchErr || !row) {
    return NextResponse.json({ error: fetchErr?.message || "not found" }, { status: 404 });
  }

  const submitted: boolean[] = [...(row.submitted || [false, false, false, false, false])];
  const scores: (number | null)[] = [...(row.scores || [null, null, null, null, null])];
  submitted[dayIndex] = false;
  scores[dayIndex] = null;

  const { error } = await supabaseAdmin
    .from("quiz_progress")
    .update({ submitted, scores, updated_at: new Date().toISOString() })
    .eq("id", progressId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ submitted, scores });
}
