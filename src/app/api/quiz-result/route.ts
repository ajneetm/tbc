import { sendEmail } from "@/app/libs/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, name, day, score, total } = await req.json();
    if (!to || !day || score == null || !total) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }

    const pct = Math.round((score / total) * 100);
    const message =
      score === total ? "ممتاز! إجاباتك كلها صحيحة 🎉" :
      pct >= 70      ? "أداء جيد، واصل التحسن 👍" :
                       "استمر في المحاولة، يمكنك التحسن 💪";

    const html = `
      <div style="font-family:Arial,sans-serif;direction:rtl;max-width:480px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
        <div style="background:#000;padding:28px 32px;">
          <p style="color:#aaa;font-size:12px;margin:0 0 4px;">نتيجة اختبار اليوم ${day}</p>
          <h1 style="color:#fff;font-size:20px;margin:0;">نموذج القياس المعرفي</h1>
          ${name ? `<p style="color:#aaa;font-size:13px;margin:8px 0 0;">${name}</p>` : ""}
        </div>
        <div style="padding:32px;">
          <div style="background:#f9fafb;border-radius:12px;padding:20px 24px;text-align:center;margin-bottom:20px;">
            <p style="color:#666;font-size:13px;margin:0 0 6px;">نتيجتك في اليوم ${day}</p>
            <p style="font-size:48px;font-weight:900;margin:0;line-height:1;">${score}<span style="font-size:22px;color:#999;font-weight:500;">/${total}</span></p>
            <p style="color:#888;font-size:13px;margin:8px 0 0;">${pct}%</p>
          </div>
          <p style="color:#555;font-size:14px;text-align:center;margin:0;">${message}</p>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #f0f0f0;text-align:center;">
          <p style="color:#ccc;font-size:11px;margin:0;">The Business Clock — نموذج القياس المعرفي</p>
        </div>
      </div>`;

    await sendEmail({ to, subject: `نتيجة اليوم ${day} — نموذج القياس المعرفي`, html });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
