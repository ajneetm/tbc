import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, user_name, trainer_rating, interaction_rating, content_rating, facilities_rating, benefit_rating, comments } = body;

  if (!user_id || !trainer_rating || !interaction_rating || !content_rating || !facilities_rating || !benefit_rating) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("workshop_evaluations").insert({
    user_id,
    user_name: user_name || null,
    trainer_rating,
    interaction_rating,
    content_rating,
    facilities_rating,
    benefit_rating,
    comments: comments?.trim() || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
