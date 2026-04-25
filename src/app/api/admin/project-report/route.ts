import { sendEmail } from "@/app/libs/email";
import { NextRequest, NextResponse } from "next/server";

const CRITERIA: Record<string, string> = {
  purpose: "الغرض", return: "العائد", obtainability: "التمكن",
  design: "التصميم", users: "المستخدمون", competition: "المنافسون", timeline: "الخط الزمني",
};

export async function POST(req: NextRequest) {
  try {
    const { to, projectName, personName, averages, overall, notes } = await req.json();
    if (!to || !projectName) return NextResponse.json({ error: "missing fields" }, { status: 400 });

    const rows = Object.entries(CRITERIA).map(([key, label]) => {
      const val = averages[key] ?? "—";
      const keyNotes: string[] = notes?.[key] ?? [];
      const notesHtml = keyNotes.length
        ? `<ul style="margin:6px 0 0;padding:0 16px;list-style:disc;">${keyNotes.map((n) => `<li style="font-size:11px;color:#888;margin-bottom:3px;">${n}</li>`).join("")}</ul>`
        : "";
      return `<tr><td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;color:#555;vertical-align:top;">${label}${notesHtml}</td><td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-weight:bold;text-align:center;vertical-align:top;">${val}/10</td></tr>`;
    }).join("");

    const html = `
      <div style="font-family:Arial,sans-serif;direction:rtl;max-width:520px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
        <div style="background:#000;padding:28px 32px;">
          <p style="color:#aaa;font-size:12px;margin:0 0 4px;">تقرير تقييم مشروع</p>
          <h1 style="color:#fff;font-size:22px;margin:0;">${projectName}</h1>
          ${personName ? `<p style="color:#aaa;font-size:13px;margin:8px 0 0;">${personName}</p>` : ""}
        </div>
        <div style="padding:24px 32px;">
          <div style="background:#f9fafb;border-radius:12px;padding:16px 24px;text-align:center;margin-bottom:20px;">
            <p style="color:#666;font-size:13px;margin:0 0 4px;">المتوسط الكلي</p>
            <p style="font-size:36px;font-weight:900;margin:0;">${overall}/10</p>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <thead><tr>
              <th style="padding:8px 16px;background:#f3f4f6;text-align:right;font-size:12px;color:#888;">المعيار</th>
              <th style="padding:8px 16px;background:#f3f4f6;text-align:center;font-size:12px;color:#888;">المتوسط</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #f0f0f0;text-align:center;">
          <p style="color:#ccc;font-size:11px;margin:0;">The Business Clock — تقييم المشاريع</p>
        </div>
      </div>`;

    await sendEmail({ to, subject: `تقرير تقييم مشروع: ${projectName}`, html });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
