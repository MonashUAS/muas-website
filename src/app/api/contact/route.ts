import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

const requiredEnvVars = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM_EMAIL",
  "CONTACT_TO_EMAIL",
] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// SMTP credentials stay server-side. Configure the required env vars above in
// deployment; never expose them through NEXT_PUBLIC variables.
export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 },
    );
  }

  const name = normalizeField(payload.name);
  const email = normalizeField(payload.email);
  const subject = normalizeField(payload.subject);
  const message = normalizeField(payload.message);

  if (!name || !emailPattern.test(email) || !subject || !message) {
    return NextResponse.json(
      { ok: false, error: "Please provide all required fields." },
      { status: 400 },
    );
  }

  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingEnvVars.length > 0) {
    console.error(
      `Contact form SMTP configuration missing: ${missingEnvVars.join(", ")}`,
    );

    return NextResponse.json(
      { ok: false, error: "Contact form is not configured." },
      { status: 500 },
    );
  }

  const smtpPort = Number(process.env.SMTP_PORT);

  if (!Number.isFinite(smtpPort)) {
    console.error("Contact form SMTP_PORT is not a valid number.");

    return NextResponse.json(
      { ok: false, error: "Contact form is not configured." },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `MUAS Contact Form: ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form email failed to send:", error);

    return NextResponse.json(
      { ok: false, error: "Message failed to send." },
      { status: 500 },
    );
  }
}

function normalizeField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
