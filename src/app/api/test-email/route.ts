import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });

  const resend = new Resend(key);
  const { data, error } = await resend.emails.send({
    from: "The Business Clock <noreply@thebusinessclock.com>",
    to: "ajnee.ca@gmail.com",
    subject: "Test email",
    html: "<p>Test</p>",
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
