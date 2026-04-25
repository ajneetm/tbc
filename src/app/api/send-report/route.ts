import { sendEmail } from "@/app/libs/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, totalScore, percentage, language, aiContent } = await req.json();

    if (!to) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const isAr = language === "ar";
    const subject = isAr
      ? `تقريرك من ساعة العمل — ${totalScore}/360 (${percentage}%)`
      : `Your Business Clock Report — ${totalScore}/360 (${percentage}%)`;

    const html = `<!DOCTYPE html>
<html dir="${isAr ? "rtl" : "ltr"}" lang="${isAr ? "ar" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; background:#f4f4f5; margin:0; padding:32px 16px; }
    .wrap { max-width:600px; margin:0 auto; }
    .header { background:#000; border-radius:16px 16px 0 0; padding:28px 32px; text-align:center; }
    .header h1 { color:#fff; font-size:20px; margin:0 0 4px; }
    .header p { color:#9ca3af; font-size:13px; margin:0; }
    .body { background:#fff; padding:32px; border:1px solid #e5e7eb; border-top:none; }
    .score-box { background:#111; color:#fff; border-radius:12px; padding:20px; text-align:center; margin-bottom:24px; }
    .score-box .num { font-size:40px; font-weight:700; }
    .score-box .sub { font-size:13px; color:#9ca3af; margin-top:4px; }
    .report { font-size:14px; line-height:1.8; color:#374151; }
    .report h2 { font-size:15px; font-weight:700; margin:20px 0 6px; color:#111827; }
    .footer { background:#f9fafb; border:1px solid #e5e7eb; border-top:none; border-radius:0 0 16px 16px; padding:20px 32px; text-align:center; font-size:12px; color:#9ca3af; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>The Business Clock</h1>
      <p>ساعة العمل</p>
    </div>
    <div class="body">
      <div class="score-box">
        <div class="num">${totalScore} / 360</div>
        <div class="sub">${percentage}% — ${isAr ? "النسبة الإجمالية" : "Overall Percentage"}</div>
      </div>
      ${aiContent
        ? `<div class="report">${aiContent}</div>`
        : `<p style="color:#9ca3af;text-align:center;">${isAr ? "لم يتم إنشاء التقرير" : "Report not available"}</p>`
      }
    </div>
    <div class="footer">
      The Business Clock &copy; ${new Date().getFullYear()}
    </div>
  </div>
</body>
</html>`;

    await sendEmail({ to, subject, html });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("send-report error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
