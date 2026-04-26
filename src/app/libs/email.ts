import { Resend } from "resend";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

export const sendEmail = async (data: EmailPayload) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: data.from ?? process.env.EMAIL_FROM ?? "The Business Clock <noreply@thebusinessclock.com>",
    to: data.to,
    subject: data.subject,
    html: data.html,
  });
  if (error) throw new Error(error.message);
};
