import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.user_metadata?.full_name || u.user_metadata?.name || "",
    phone: u.user_metadata?.phone || "",
    created_at: u.created_at,
    last_sign_in: u.last_sign_in_at,
    confirmed: !!u.confirmed_at,
  }));

  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const { email, password, name, phone } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "الإيميل وكلمة المرور مطلوبان" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: name || "",
      first_name: name?.split(" ")[0] || "",
      last_name: name?.split(" ").slice(1).join(" ") || "",
      phone: phone || "",
    },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ user: data.user });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "معرّف المستخدم مطلوب" }, { status: 400 });

  // حذف بيانات اليوزر من كل الجداول أولاً
  await Promise.all([
    supabaseAdmin.from("project_evaluations").delete().eq("evaluator_id", id),
    supabaseAdmin.from("survey_results").delete().eq("user_id", id),
    supabaseAdmin.from("quiz_progress").delete().eq("user_id", id),
    supabaseAdmin.from("workshop_enrollments").delete().eq("user_id", id),
    supabaseAdmin.from("workshop_evaluations").delete().eq("user_id", id),
    supabaseAdmin.from("certificates").delete().eq("user_id", id),
    supabaseAdmin.from("consultations").delete().eq("user_id", id),
    supabaseAdmin.from("trainer_trainees").delete().eq("user_id", id),
  ]);

  // حذف مشاريعه (الـ CASCADE يحذف تقييماتها تلقائياً)
  await supabaseAdmin.from("projects").delete().eq("owner_id", id);

  // حذف اليوزر من auth
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
