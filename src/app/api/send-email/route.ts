import { sendEmail } from "@/app/libs/email";
import { surveyResultTemplate } from "@/app/libs/emailTemplates";
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

    const htmlContent = surveyResultTemplate({
      name, email, phone, surveyType, language,
      totalScore, percentage,
      age, businessType, capital, projectAge, staffCount,
    });

    await sendEmail({
      to: adminEmail,
      subject: `تقييم جديد — ${name} (${percentage}%)`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
