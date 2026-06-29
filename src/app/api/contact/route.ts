import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

const requiredEnvVars = [
  "RESEND_API_KEY",
  "CONTACT_TO_EMAIL",
  "CONTACT_FROM_EMAIL",
] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, success: false, error: "Invalid request payload." },
      { status: 400 },
    );
  }

  const name = normalizeField(payload.name);
  const email = normalizeField(payload.email);
  const subject = normalizeField(payload.subject);
  const message = normalizeField(payload.message);

  if (!name || !emailPattern.test(email) || !subject || !message) {
    return NextResponse.json(
      { ok: false, success: false, error: "Please provide all required fields." },
      { status: 400 },
    );
  }

  if (message.length > 5000) {
    return NextResponse.json(
      { ok: false, success: false, error: "Message is too long." },
      { status: 400 },
    );
  }

  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingEnvVars.length > 0) {
    console.error(
      `Contact form Resend configuration missing: ${missingEnvVars.join(", ")}`,
    );

    return NextResponse.json(
      { ok: false, success: false, error: "Contact form is not configured." },
      { status: 500 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL as string,
      to: [process.env.CONTACT_TO_EMAIL as string],
      replyTo: email,
      subject: `MUAS Contact Form: ${subject}`,
      text: [
        "New MUAS website contact form submission",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New MUAS website contact form submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr />
          <p style="white-space: pre-wrap;">${safeMessage}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend contact form email failed:", error);

      return NextResponse.json(
        { ok: false, success: false, error: "Message failed to send." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, success: true, id: data?.id });
  } catch (error) {
    console.error("Contact form email failed to send:", error);

    return NextResponse.json(
      { ok: false, success: false, error: "Message failed to send." },
      { status: 500 },
    );
  }
}

function normalizeField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
