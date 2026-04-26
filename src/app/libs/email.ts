import { Resend } from "resend";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (data: EmailPayload) => {
  return resend.emails.send({
    from: data.from ?? process.env.EMAIL_FROM ?? "The Business Clock <noreply@thebusinessclock.com>",
    to: data.to,
    subject: data.subject,
    html: data.html,
  });
};
