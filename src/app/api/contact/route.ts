import { sendEmail } from "@/app/libs/email";
import { contactMessageTemplate } from "@/app/libs/emailTemplates";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
    if (!adminEmail) {
      return NextResponse.json({ error: "Admin email not configured" }, { status: 500 });
    }

    const htmlContent = contactMessageTemplate({ name, company, email, phone, message });

    await sendEmail({
      to: adminEmail,
      subject: `[Business Clock] رسالة تواصل جديدة - ${name}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
