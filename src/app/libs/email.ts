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

  const attachments = data.attachments?.length
    ? data.attachments.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.content, "base64"),
      }))
    : undefined;

  const { error } = await resend.emails.send({
    from: data.from ?? "The Business Clock <noreply@thebusinessclock.com>",
    to: data.to,
    subject: data.subject,
    html: data.html,
    ...(attachments ? { attachments } : {}),
  });

  if (error) throw new Error(JSON.stringify(error));
};
