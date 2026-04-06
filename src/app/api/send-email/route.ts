import { sendEmail } from "@/app/libs/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      surveyType,
      language,
      age,
      businessType,
      capital,
      projectAge,
      staffCount,
      totalScore,
      percentage,
    } = body;

    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
    if (!adminEmail) {
      return NextResponse.json({ error: "Admin email not configured" }, { status: 500 });
    }

    const surveyTypeLabel: Record<string, string> = {
      explorers: "Explorers (مستكشف)",
      entrepreneurs: "Entrepreneurs (رائد أعمال)",
      companies: "Companies (شركة)",
    };

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background-color: #F04438; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">The Business Clock</h1>
          <p style="color: #fecaca; margin: 8px 0 0;">نتيجة تقييم جديد / New Assessment Result</p>
        </div>

        <div style="padding: 24px; background: #f9fafb;">
          <h2 style="color: #111827; border-bottom: 2px solid #F04438; padding-bottom: 8px;">معلومات المشارك / Participant Info</h2>

          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr style="background: white;">
              <td style="padding: 10px 12px; font-weight: bold; color: #374151; width: 40%; border: 1px solid #e5e7eb;">الاسم / Name</td>
              <td style="padding: 10px 12px; color: #111827; border: 1px solid #e5e7eb;">${name}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 10px 12px; font-weight: bold; color: #374151; border: 1px solid #e5e7eb;">البريد الإلكتروني / Email</td>
              <td style="padding: 10px 12px; color: #111827; border: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 10px 12px; font-weight: bold; color: #374151; border: 1px solid #e5e7eb;">رقم الهاتف / Phone</td>
              <td style="padding: 10px 12px; color: #111827; border: 1px solid #e5e7eb;">${phone}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 10px 12px; font-weight: bold; color: #374151; border: 1px solid #e5e7eb;">نوع التقييم / Survey Type</td>
              <td style="padding: 10px 12px; color: #111827; border: 1px solid #e5e7eb;">${surveyTypeLabel[surveyType] || surveyType}</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 10px 12px; font-weight: bold; color: #374151; border: 1px solid #e5e7eb;">اللغة / Language</td>
              <td style="padding: 10px 12px; color: #111827; border: 1px solid #e5e7eb;">${language === "ar" ? "عربي" : "English"}</td>
            </tr>
            ${age ? `<tr style="background: #f9fafb;"><td style="padding: 10px 12px; font-weight: bold; color: #374151; border: 1px solid #e5e7eb;">العمر / Age</td><td style="padding: 10px 12px; color: #111827; border: 1px solid #e5e7eb;">${age}</td></tr>` : ""}
            ${businessType ? `<tr style="background: white;"><td style="padding: 10px 12px; font-weight: bold; color: #374151; border: 1px solid #e5e7eb;">نوع العمل / Business Type</td><td style="padding: 10px 12px; color: #111827; border: 1px solid #e5e7eb;">${businessType}</td></tr>` : ""}
            ${capital ? `<tr style="background: #f9fafb;"><td style="padding: 10px 12px; font-weight: bold; color: #374151; border: 1px solid #e5e7eb;">رأس المال / Capital</td><td style="padding: 10px 12px; color: #111827; border: 1px solid #e5e7eb;">${capital}</td></tr>` : ""}
            ${projectAge ? `<tr style="background: white;"><td style="padding: 10px 12px; font-weight: bold; color: #374151; border: 1px solid #e5e7eb;">عمر المشروع / Project Age</td><td style="padding: 10px 12px; color: #111827; border: 1px solid #e5e7eb;">${projectAge} years</td></tr>` : ""}
            ${staffCount ? `<tr style="background: #f9fafb;"><td style="padding: 10px 12px; font-weight: bold; color: #374151; border: 1px solid #e5e7eb;">عدد الموظفين / Staff Count</td><td style="padding: 10px 12px; color: #111827; border: 1px solid #e5e7eb;">${staffCount}</td></tr>` : ""}
          </table>
        </div>

        <div style="padding: 20px 24px; background: white; border-top: 1px solid #e5e7eb;">
          <h2 style="color: #111827; border-bottom: 2px solid #F04438; padding-bottom: 8px;">النتيجة / Result</h2>
          <div style="display: flex; gap: 16px; margin-top: 12px;">
            <div style="flex: 1; background: #F04438; color: white; padding: 16px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">المجموع / Total Score</p>
              <p style="margin: 8px 0 0; font-size: 28px; font-weight: bold;">${totalScore} / 360</p>
            </div>
            <div style="flex: 1; background: #111827; color: white; padding: 16px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">النسبة / Percentage</p>
              <p style="margin: 8px 0 0; font-size: 28px; font-weight: bold;">${percentage}%</p>
            </div>
          </div>
        </div>

        <div style="padding: 16px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">The Business Clock - Ajnee Business Hub</p>
          <p style="color: #6b7280; font-size: 12px; margin: 4px 0 0;">${new Date().toLocaleString("en-GB")}</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `[Business Clock] تقييم جديد - ${name} (${percentage}%)`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
