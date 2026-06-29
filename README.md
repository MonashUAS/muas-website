# MUAS Website

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 with your browser to see the result.

## Contact Form / Resend Setup

The Contact Us form sends messages through [Resend](https://resend.com/) using the `/api/contact` route.

The form does **not** open the user’s native email app. When a visitor submits the form, the website sends the message directly to the configured contact email address.

### Required environment variables

Create a `.env.local` file in the project root:

```env
RESEND_API_KEY=
CONTACT_TO_EMAIL=contact@monashuas.org
CONTACT_FROM_EMAIL=onboarding@resend.dev
```

`RESEND_API_KEY` should be replaced with the real Resend API key.

Do **not** commit `.env.local` to GitHub.

### Current test setup

At the moment, the contact form is configured to send using Resend’s test sender:

```env
CONTACT_FROM_EMAIL=onboarding@resend.dev
```

This is suitable for testing only.

For production, the sending domain should be verified in Resend and the sender should be changed to something like:

```env
CONTACT_FROM_EMAIL="MUAS Website <website@monashuas.org>"
```

### Domain verification

To send from `website@monashuas.org`, the `monashuas.org` domain must be verified in Resend.

In Resend:

1. Add the domain `monashuas.org`.
2. Copy the DNS records Resend provides.
3. Add those records in the domain’s DNS provider.
4. Wait for Resend to verify the domain.
5. Once verified, update `CONTACT_FROM_EMAIL` to use the MUAS domain.

Until the domain is verified, keep using:

```env
CONTACT_FROM_EMAIL=onboarding@resend.dev
```

### Production deployment

When deploying, add the same environment variables to the hosting provider, such as Vercel:

```env
RESEND_API_KEY=
CONTACT_TO_EMAIL=contact@monashuas.org
CONTACT_FROM_EMAIL=
```

After updating environment variables in production, redeploy the site.




