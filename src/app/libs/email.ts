import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachments?: { filename: string; content: string; encoding: "base64" }[];
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendEmail = async (data: EmailPayload) => {
  const from = data.from ?? (process.env.EMAIL_FROM || `"The Business Clock" <noreply@thebusinessclock.com>`);

  const attachments = data.attachments?.length
    ? data.attachments.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.content, "base64"),
      }))
    : undefined;

  await transporter.sendMail({
    from,
    to: data.to,
    subject: data.subject,
    html: data.html,
    attachments,
  });
};
