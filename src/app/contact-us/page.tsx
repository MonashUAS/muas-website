"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import {
  LuArrowUpRight,
  LuFacebook,
  LuInstagram,
  LuLinkedin,
  LuMail,
  LuYoutube,
} from "react-icons/lu";

type SubmissionState = "idle" | "loading" | "success" | "error";

const socialCards = [
  {
    label: "Facebook",
    action: "Follow us",
    href: "https://www.facebook.com/MonashUAS/",
    icon: LuFacebook,
    external: true,
  },
  {
    label: "Instagram",
    action: "Follow us",
    href: "https://www.instagram.com/monash.uas/",
    icon: LuInstagram,
    external: true,
  },
  {
    label: "LinkedIn",
    action: "Connect with us",
    href: "https://au.linkedin.com/company/monashuas",
    icon: LuLinkedin,
    external: true,
  },
  {
    label: "YouTube",
    action: "Subscribe",
    href: "https://www.youtube.com/@MonashUAS",
    icon: LuYoutube,
    external: true,
  },
  {
    label: "Email",
    action: "contact@monashuas.org",
    href: "mailto:contact@monashuas.org",
    icon: LuMail,
    external: false,
  },
];

export default function ContactUsPage() {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmissionState("loading");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Contact request failed.");
      }

      event.currentTarget.reset();
      setSubmissionState("success");
    } catch {
      setSubmissionState("error");
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#02040a_0%,#001f49_44%,#02040a_100%)] text-white">
      <section className="relative overflow-hidden px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-28 lg:px-12 lg:pb-24 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(84,134,200,0.24),transparent_34%)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="max-w-4xl">
            <h1 className="text-[clamp(4rem,10vw,9rem)] font-medium leading-[0.86] tracking-[-0.06em] text-white">
              Get in Touch
            </h1>
          </div>
        </div>
      </section>

      <section className="px-5 pb-32 sm:px-8 sm:pb-40 lg:px-12 lg:pb-52">
        <div className="mx-auto grid max-w-[1500px] gap-8 lg:min-h-[720px] lg:grid-cols-2 lg:items-stretch">
          <form
            onSubmit={handleSubmit}
            className="flex min-h-[680px] flex-col rounded-[1.75rem] border border-white/18 bg-white/[0.13] p-6 shadow-2xl shadow-black/28 backdrop-blur-xl sm:p-8 lg:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <ContactField
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                required
              />

              <ContactField
                id="email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>

            <div className="mt-5">
              <ContactField
                id="subject"
                label="Subject"
                name="subject"
                required
              />
            </div>

            <label className="mt-5 block flex-1" htmlFor="message">
              <span className="text-b2 font-medium uppercase tracking-[0.18em] text-blue-50/62">
                Message
              </span>

              <textarea
                id="message"
                name="message"
                required
                rows={11}
                className="mt-2 min-h-[300px] w-full resize-y rounded-xl border border-white/18 bg-black/20 px-4 py-3 text-b1 text-white outline-none transition-colors placeholder:text-blue-50/32 focus:border-blue-200/70 focus:bg-black/28 focus:ring-1 focus:ring-blue-200/50"
              />
            </label>

            <button
              type="submit"
              disabled={submissionState === "loading"}
              className="mt-7 inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-white px-7 text-b1 font-medium text-blue-950 transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 disabled:cursor-not-allowed disabled:bg-white/60 disabled:text-blue-950/70 motion-reduce:transition-none"
            >
              {submissionState === "loading" ? "Sending..." : "Send Message"}
            </button>

            <div className="mt-4 min-h-6" aria-live="polite">
              {submissionState === "success" ? (
                <p className="text-b1 text-blue-50">
                  Message sent successfully.
                </p>
              ) : null}

              {submissionState === "error" ? (
                <p className="text-b1 text-red-100">
                  Something went wrong. Please try again.
                </p>
              ) : null}
            </div>
          </form>

          <div className="min-h-[680px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/20 backdrop-blur-md">
            <iframe
              src="https://www.google.com/maps?q=Monash+Makerspace,+G.37A+23+College+Walk,+Monash+University+Clayton+Campus+3800&output=embed"
              title="Google Maps location of Monash Makerspace"
              className="h-[560px] w-full rounded-[1.25rem] border-0 lg:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 sm:pb-28 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-[clamp(2.6rem,6vw,5.4rem)] font-medium leading-[0.9] tracking-[-0.05em]">
                Find Us Online
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {socialCards.map((card) => {
              const Icon = card.icon;

              return (
                <a
                  key={card.label}
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                  className="group flex min-h-48 flex-col justify-between rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-5 text-white outline-none transition-[transform,background-color,border-color] duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.085] focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none"
                  aria-label={`${card.label}: ${card.action}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon
                      className="text-3xl text-blue-50/86"
                      aria-hidden="true"
                    />

                    <LuArrowUpRight
                      className="text-xl text-blue-50/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h3 className="text-h6 font-medium tracking-[-0.03em]">
                      {card.label}
                    </h3>

                    <p className="mt-2 text-b1 text-blue-50/64">
                      {card.action}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

type ContactFieldProps = {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
};

function ContactField({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  required = false,
}: ContactFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-b2 font-medium uppercase tracking-[0.18em] text-blue-50/62">
        {label}
      </span>

      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="mt-2 h-12 w-full rounded-xl border border-white/18 bg-black/20 px-4 text-b1 text-white outline-none transition-colors placeholder:text-blue-50/32 focus:border-blue-200/70 focus:bg-black/28 focus:ring-1 focus:ring-blue-200/50"
      />
    </label>
  );
}