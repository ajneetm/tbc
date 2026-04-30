import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("project_evaluations")
    .select("project_id, purpose_rating, return_rating, obtainability_rating, design_rating, users_rating, competition_rating, timeline_rating");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ evals: data });
}
