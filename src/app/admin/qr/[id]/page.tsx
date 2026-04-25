"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import QRCode from "react-qr-code";

export default function QRPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [origin, setOrigin] = useState("https://thebusinessclock.com");

  useEffect(() => {
    setOrigin(window.location.origin);
    supabase.from("projects").select("title").eq("id", id).single()
      .then(({ data }) => { if (data) setProject(data); });
  }, [id]);

  const url = `${origin}/evaluate/${id}`;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <p className="text-gray-400 text-sm mb-1">تقييم مشروع</p>
        <h1 className="text-3xl font-bold text-gray-900">{project?.title || "..."}</h1>
      </div>

      <div className="p-6 bg-white rounded-3xl border-4 border-black shadow-2xl">
        <QRCode value={url} size={300} />
      </div>

      <p className="text-gray-400 text-sm" dir="ltr">{url}</p>

      <button
        onClick={() => window.print()}
        className="mt-2 px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition print:hidden"
      >
        طباعة
      </button>
    </div>
  );
}
