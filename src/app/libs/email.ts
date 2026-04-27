import { Resend } from "resend";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachments?: { filename: string; content: string; encoding: "base64" }[];
};

export const sendEmail = async (data: EmailPayload) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const payload: Parameters<typeof resend.emails.send>[0] = {
    from: data.from ?? "The Business Clock <noreply@thebusinessclock.com>",
    to: data.to,
    subject: data.subject,
    html: data.html,
  };

  if (data.attachments?.length) {
    payload.attachments = data.attachments.map((a) => ({
      filename: a.filename,
      content: Buffer.from(a.content, "base64"),
    }));
  }

  const { error } = await resend.emails.send(payload);
  if (error) throw new Error(JSON.stringify(error));
};
