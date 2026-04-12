import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

const port = parseInt(process.env.EMAIL_SERVER_PORT || "587");

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return await transporter.sendMail({
    from: data.from ?? process.env.EMAIL_FROM,
    to: data.to,
    subject: data.subject,
    html: data.html,
  });
};
