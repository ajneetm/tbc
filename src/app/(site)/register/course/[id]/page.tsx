"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CourseRegisterPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Load course
      const { data: courseData } = await supabase.from("workshops").select("*").eq("id", id).single();
      if (!courseData) { setNotFound(true); setLoading(false); return; }
      setCourse(courseData);

      // Check auth
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const email = session.user.email?.toLowerCase() || "";
        const { data: enrollment } = await supabase.from("workshop_enrollments")
          .select("id").eq("workshop_id", id).ilike("user_email", email).single();
        if (enrollment) setAlreadyEnrolled(true);
      }
      setLoading(false);
    };
    init();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) { router.push(`/auth/signin?redirect=/register/course/${id}`); return; }
    setEnrolling(true);
    const email = user.email?.toLowerCase() || "";
    const { error } = await supabase.from("workshop_enrollments").insert({ workshop_id: id, user_email: email });
    if (!error) setDone(true);
    setEnrolling(false);
  };

  if (loading) return (
    <section className="pt-[160px] min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </section>
  );

  if (notFound) return (
    <section className="pt-[160px] min-h-screen bg-gray-50">
      <div className="px-4 xl:container max-w-2xl mx-auto text-center py-20">
        <p className="text-5xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold mb-2">الدورة غير موجودة</h1>
        <p className="text-gray-500 text-sm">تحقق من الرابط أو تواصل مع الإدارة</p>
      </div>
    </section>
  );

  if (done || alreadyEnrolled) return (
    <section className="pt-[160px] min-h-screen bg-gray-50">
      <div className="px-4 xl:container max-w-2xl mx-auto py-20">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
          <p className="text-5xl mb-4">{done ? "🎉" : "✅"}</p>
          <h2 className="text-xl font-bold mb-2">
            {done ? "تم تسجيلك بنجاح!" : "أنت مسجّل بالفعل"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {done ? `تم تسجيلك في دورة "${course.name}"` : `أنت مسجّل مسبقاً في هذه الدورة`}
          </p>
          <button onClick={() => router.push("/user")}
            className="bg-black text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-gray-800 transition">
            الذهاب للوحة التحكم
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <section className="pt-[160px] min-h-screen bg-gray-50">
      <div className="px-4 xl:container max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="bg-black px-8 py-8 text-white">
            <div className="text-3xl mb-3">🎓</div>
            <h1 className="text-2xl font-bold mb-1">{course.name}</h1>
            {course.description && <p className="text-gray-300 text-sm">{course.description}</p>}
            <div className="flex gap-3 mt-3 flex-wrap">
              {course.category && <span className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-full">{course.category}</span>}
              {course.duration && <span className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-full">⏱ {course.duration}</span>}
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {user ? (
              <div>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
                    <p className="text-xs text-gray-400" dir="ltr">{user.email}</p>
                  </div>
                </div>
                <button onClick={handleEnroll} disabled={enrolling}
                  className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition text-sm">
                  {enrolling ? "جاري التسجيل..." : `التسجيل في "${course.name}"`}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-5">سجّل دخولك للتسجيل في هذه الدورة</p>
                <button onClick={() => router.push(`/auth/signin?redirect=/register/course/${id}`)}
                  className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition text-sm">
                  تسجيل الدخول والتسجيل في الدورة
                </button>
                <button onClick={() => router.push(`/auth/signup?redirect=/register/course/${id}`)}
                  className="w-full mt-3 border border-gray-300 text-gray-700 font-medium py-3.5 rounded-xl hover:bg-gray-50 transition text-sm">
                  إنشاء حساب جديد
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
