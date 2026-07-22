"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { socialCards } from "./contact-data";

type SubmissionState = "idle" | "loading" | "success" | "error";

export default function ContactUsPage() {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    setSubmissionState("loading");

    const formData = new FormData(form);

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

      const responsePayload = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Contact form submission failed:", responsePayload);
        throw new Error("Contact request failed.");
      }

      form.reset();
      setSubmissionState("success");
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmissionState("error");
    }
  };

  return (
    <main className="min-h-dvh bg-[linear-gradient(180deg,#02040a_0%,#001f49_44%,#02040a_100%)] text-white">
      {/* Initial viewport: heading, form and map */}
      <section
        id="contact-page"
        className="relative isolate flex viewport-fold flex-col scroll-mt-20 overflow-hidden py-8 sm:py-10 lg:py-5"
      >
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_72%_18%,rgba(84,134,200,0.24),transparent_36%),radial-gradient(circle_at_28%_70%,rgba(0,74,173,0.16),transparent_34%)]" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[linear-gradient(0deg,rgba(2,4,10,0.24),transparent)]" />

        <div className="relative mx-auto flex w-full max-w-[1720px] flex-1 flex-col px-5 sm:px-8 lg:px-12">
          <div className="shrink-0">
            <h1 className="text-[clamp(3.35rem,9vw,6.5rem)] font-medium leading-[0.86] tracking-[-0.06em] text-white">
              <span
                data-search-target-id="contact-heading"
                data-search-highlight-mode="text"
              >
                Get in Touch
              </span>
            </h1>
          </div>

          <div className="mt-7 grid gap-5 sm:mt-8 sm:gap-6 lg:mt-5 lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:items-stretch">
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-col rounded-[1.25rem] border border-white/18 bg-white/[0.13] p-4 shadow-2xl shadow-black/28 backdrop-blur-xl sm:rounded-[1.75rem] sm:p-6 lg:h-full lg:p-6"
            >
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
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

              <div className="mt-3 sm:mt-4">
                <ContactField
                  id="subject"
                  label="Subject"
                  name="subject"
                  required
                />
              </div>

              <label
                className="mt-3 flex min-h-0 flex-1 flex-col sm:mt-4"
                htmlFor="message"
              >
                <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-blue-50/62 sm:text-b2">
                  <span
                    data-search-target-id="contact-field-message"
                    data-search-highlight-mode="text"
                  >
                    Message
                  </span>
                </span>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="mt-1.5 min-h-[120px] w-full flex-1 resize-none rounded-lg border border-white/18 bg-black/20 px-3.5 py-3 text-b1 text-white outline-none transition-colors placeholder:text-blue-50/32 focus:border-blue-200/70 focus:bg-black/28 focus:ring-1 focus:ring-blue-200/50 sm:mt-2 sm:rounded-xl sm:px-4"
                />
              </label>

              <button
                type="submit"
                disabled={submissionState === "loading"}
                data-search-target-id="contact-submit"
                data-search-highlight-mode="text"
                className="mt-3 inline-flex min-h-10 w-fit shrink-0 items-center justify-center rounded-full bg-white px-5 text-b1 font-medium text-blue-950 transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 disabled:cursor-not-allowed disabled:bg-white/60 disabled:text-blue-950/70 motion-reduce:transition-none sm:mt-4 sm:px-6"
              >
                {submissionState === "loading"
                  ? "Sending..."
                  : "Send Message"}
              </button>

              <div
                className="mt-2 min-h-5 shrink-0 sm:mt-3"
                aria-live="polite"
              >
                {submissionState === "success" ? (
                  <p className="text-sm text-blue-50 sm:text-b1">
                    Message sent successfully. We&apos;ll get back to you soon.
                  </p>
                ) : null}

                {submissionState === "error" ? (
                  <p className="text-sm text-red-100 sm:text-b1">
                    Something went wrong. Please try again.
                  </p>
                ) : null}
              </div>
            </form>

            <iframe
              src="https://www.google.com/maps?q=Monash+Makerspace,+G.37A+23+College+Walk,+Monash+University+Clayton+Campus+3800&output=embed"
              title="Google Maps location of Monash Makerspace"
              className="h-[320px] w-full rounded-[1.25rem] border border-white/10 shadow-2xl shadow-black/20 sm:h-[440px] sm:rounded-[1.75rem] lg:h-full lg:min-h-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Visible after scrolling beyond the opening viewport */}
      <section className="scroll-mt-20 pb-24 pt-10 sm:pb-28 sm:pt-12 lg:pt-16">
        <div
          id="find-us-online"
          className="mx-auto w-full max-w-[1720px] scroll-mt-20 px-5 sm:px-8 lg:px-12"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-[clamp(2.6rem,6vw,5.4rem)] font-medium leading-[0.9] tracking-[-0.05em]">
              <span
                data-search-target-id="find-us-online-heading"
                data-search-highlight-mode="text"
              >
                Find Us Online
              </span>
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {socialCards.map((card) => {
              const Icon = card.icon;

              return (
                <a
                  key={card.label}
                  href={card.href}
                  data-search-target-id={`contact-${card.label.toLowerCase()}`}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                  className="group flex min-h-28 flex-col justify-between rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-4 text-white outline-none transition-[transform,background-color,border-color] duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.085] focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none sm:min-h-40 sm:p-5 lg:min-h-48"
                  aria-label={`${card.label}: ${card.action}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon
                      className="text-xl text-blue-50/86 sm:text-2xl lg:text-3xl"
                      aria-hidden="true"
                    />

                    <LuArrowUpRight
                      className="text-xl text-blue-50/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h3 className="text-b1 font-medium tracking-[-0.03em] sm:text-subtitle lg:text-h6">
                      <span
                        data-search-target-id={`contact-${card.label.toLowerCase()}-label`}
                        data-search-highlight-mode="text"
                      >
                        {card.label}
                      </span>
                    </h3>

                    <p
                      data-search-target-id={`contact-${card.label.toLowerCase()}-action`}
                      data-search-highlight-mode="text"
                      className="mt-1 text-sm leading-5 text-blue-50/64 sm:mt-1.5 sm:text-b1"
                    >
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
      <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-blue-50/62 sm:text-b2">
        <span
          data-search-target-id={`contact-field-${id}`}
          data-search-highlight-mode="text"
        >
          {label}
        </span>
      </span>

      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="mt-1.5 h-10 w-full rounded-lg border border-white/18 bg-black/20 px-3.5 text-b1 text-white outline-none transition-colors placeholder:text-blue-50/32 focus:border-blue-200/70 focus:bg-black/28 focus:ring-1 focus:ring-blue-200/50 sm:mt-2 sm:h-11 sm:rounded-xl sm:px-4"
      />
    </label>
  );
}
