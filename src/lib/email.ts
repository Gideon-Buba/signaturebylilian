import nodemailer from "nodemailer";

// Sends through Google Workspace's SMTP (smtp.gmail.com), using a Workspace
// mailbox + App Password. Server-only: never import this from client code.
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];
  if (!user || !pass) {
    throw new Error("Email isn't configured on the server yet — SMTP_USER/SMTP_PASS are missing.");
  }

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  await transport.sendMail({
    from: `Signature by Lilian <${user}>`,
    to,
    subject,
    html,
  });
}
