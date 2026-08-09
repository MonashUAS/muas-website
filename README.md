# Monash Uncrewed Aerial Systems (MUAS) Website Documentation & Operations Handover

**Repository:** [MonashUAS/muas-website](https://github.com/MonashUAS/muas-website)  
**Current Website Lead:** Claire Zhang 
**Last Updated:** 9 August 2026  

---

## 1. Overview & Purpose

This document consolidates technical handover details and operational procedures for the public Monash Uncrewed Aerial Systems (MUAS) website. It serves as a unified reference for both core web maintainers and Operations team members requesting, reviewing, or applying routine updates.

### Core Objectives
* Provide technical guidelines for local development, architecture, environment setup, and deployment.
* Standardize operational processes for content updates, recruitment management, contact form maintenance, and GitHub workflows.
* Maintain security best practices regarding environment variables, access control, and deployment safety.

---

## 2. Technical Architecture & Stack

The website is structured as a modern, performance-focused Web Application using standard Next.js conventions:

* **Framework:** Next.js 16 (App Router)
* **UI & Component Library:** React 19, Tailwind CSS 4, `lucide-react` icons
* **3D & Graphics / Dynamic Media:** Three.js, React Three Fiber, static assets (images/videos/models) stored in `/public`
* **Email Delivery Service:** Resend API integration via serverless route (`src/app/api/contact/route.ts`)
* **Repository:** `MonashUAS/muas-website`

---

## 3. Ownership, Escalation & Access Control

### Primary Escalation Contact
For queries regarding website access, production deployment errors, domain/DNS routing, secrets management, and Resend account configuration, contact the current Website Lead.

### Account Credentials & MFA Access

| Service / Platform | Access & Login Instructions | Password & MFA Contact Details |
| :--- | :--- | :--- |
| **Vercel** | Access/create `muas-operations@monash.edu` Google profile and use Google Sign-In. | Contact COO or Operations Lead for `muas-operations@monash.edu` profile password. |
| **Resend** | Access/create `muas-operations@monash.edu` Google profile and use Google Sign-In. | Contact COO or Operations Lead for `muas-operations@monash.edu` profile password. |
| **NameCheap** | Access/create `contact@monashuas.org` Google profile. Also ask for NameCheap password. | Contact COO or Operations Lead for `contact@monashuas.org` profile password. Also ask for NameCheap password. MFA is sent to `contact@monashuas.org` email. |
| **GitHub** | Create your own account. | Provide your username/email to the Website Lead or IT Manager so they can add you to the `muas-website` repository. |
| **MUAS GitHub** | Username: contact@monashuas.org | Contact Team Lead for password and MFA |

### GitHub Access Model
Access permissions are strictly governed under the `MonashUAS` GitHub Organization based on the principle of least privilege:

| Persona / Role | Access Level | Description & Responsibilities |
| :--- | :--- | :--- |
| **MUAS Members (Requesters)** | No Write Access | Submit website change requests via MUAS Website Change Requests Google Sheet: https://docs.google.com/spreadsheets/d/1u9fldJoP2_-Tf5VmzKbaTg6rqUDOzmSY4g1cUc-kzrk/edit?usp=sharing |
| **Website Maintainers** | Write Access | Create feature/content branches, make code/data adjustments, submit PRs, and merge approved changes. |
| **Website Lead** | Admin Access | Manage repository settings, secret environment variables, DNS records, deployment integrations, and branch protection rules. |

*To request access updates or onboard new team members, contact the current Website Lead.*

---

## 4. Local Development & Setup

### Package Management Caution
This repository supports both `pnpm` and `npm`, but **`pnpm` is recommended** for consistency with deployment builds and faster installation times.

### Environment Setup

1. **Clone the repository and install dependencies:**
   
   *Using pnpm:*
   ```bash
   pnpm install
   pnpm dev
   ```

   *Using npm:*
   ```bash
   npm install
   npm run dev
   ```

2. Open `http://localhost:3000` in your web browser.

3. **Configuring Local Environment Variables:**
   Create a `.env.local` file in the project root directory:

   ```env
   RESEND_API_KEY=your_resend_api_key_here
   CONTACT_FROM_EMAIL=MUAS Team <noreply@monashuas.org>
   CONTACT_TO_EMAIL=contact@monashuas.org
   ```

   *Note: Never commit `.env.local` or raw API keys to GitHub.*

4. **Testing Production Builds Locally:**

   *Using pnpm:*
   ```bash
   pnpm build
   pnpm start
   ```

   *Using npm:*
   ```bash
   npm run build
   npm run start
   ```

---

## 5. Deployment & Environment Variables

### Vercel Deployment & Hosting Configuration
The site is hosted and deployed as a standard Next.js application via Vercel. Vercel connects directly to the `MonashUAS/muas-website` GitHub repository. Pushing changes to feature branches triggers a preview deployment automatically, while merging into the `main` branch triggers a production build. Deployment configurations and environment variables are managed via the Vercel dashboard.

* **Repository:** `MonashUAS/muas-website`
* **Install Command:** `pnpm install` or `npm install`
* **Build Command:** `pnpm build` or `npm run build`
* **Start Command:** `pnpm start` or `npm run start`

### Required Environment Variables
The following environment variables must be defined in the production Vercel dashboard:

* `RESEND_API_KEY`: Secrets key generated in the Resend dashboard.
* `CONTACT_FROM_EMAIL`: MUAS Team <noreply@monashuas.org>
* `CONTACT_TO_EMAIL`: contact@monashuas.org 

> **CRITICAL:** After updating environment variables in the Vercel dashboard, **redeploy the application** so that the serverless API route receives the updated runtime values.

---

## 6. Domain & DNS Configuration (Namecheap)

To access and manage DNS settings:
1. Sign in to **Namecheap**.
2. Go to **Domain List** in the sidebar.
3. Select **Advanced DNS** for the domain.

### DNS Records Summary

| Section | Record Type | Host / Name | Value / Target | Purpose & Description |
| :--- | :--- | :--- | :--- | :--- |
| **Host Records** | `A Record` | `@` | Vercel configuration IP/target | Points domain traffic to Vercel deployment. |
| **Host Records** | `TXT Record` | `resend._domainkey` | Resend DKIM Key | Resend domain key authentication record. |
| **Host Records** | `TXT Record` | `send` | Resend SPF / Verification | Resend sending domain verification record. |
| **Mail Settings** | `MX Record` | `@` | `smtp.google.com` | Email routing configuration. |

> **CRITICAL:** Do not delete the mail settings configuration, we will not receive emails sent to contact@monashuas.org if this is missing!

---

## 7. Standard Workflow & Change Process

To protect the production environment, all routine and emergency updates must follow this standard workflow:

```
[1. Request & Deadline] ➔ [2. Fetch main Branch] ➔ [3. Create Feature Branch] ➔ [4. Implement Change]
                                                                                       │
                                                                                       ▼
[8. Review Pull Request] ◄── [7. Open Pull Request] ◄── [6. Review Preview Build] ◄── [5. Run Lint, Build & Push]
         │
         ▼
[9. Merge to main] ➔ [10. Verify Live Deployment on Vercel]
```

### Workflow Steps & Guidelines

1. **Request & Deadline:** Receive and triage the update request.
2. **Fetch latest main branch:** Run `git checkout main && git pull origin main` to ensure your local repository is up to date.
3. **Create Feature Branch from main:** Use descriptive branch naming conventions (e.g., `update/recruitment-link`).
4. **Implement Change:** Aim to make the smallest change possible to reduce the chance of introducing bugs.
5. **Run Local Lint & Build & Push to GitHub:** Ensure local quality checks pass (`pnpm run lint` and `pnpm run build`) before pushing your branch (`git push -u origin <branch-name>`).
6. **Review Preview Build on Vercel:** Steps to view the preview build:
   * Go to **Deployments** in the Vercel sidebar.
   * Find the deployment branch you just pushed to.
   * Click **Preview** to inspect the live preview build.
7. **Open Pull Request:** Open a PR on GitHub comparing your feature branch against `main`.
8. **Review Pull Request:** Refer to the **Section 8 Checklist (Pull Request Review Checklist)** to complete all required verifications before approving.
9. **Merge to main:** Merge the PR once approved and CI checks pass.
10. **Verify Live Deployment on Vercel:** Check the live site on Vercel to confirm deployment success.

### Branch Naming Conventions
Use descriptive prefixes for branch names:
* `update/recruitment-link`
* `update/contact-email`
* `fix/contact-form`
* `content/sponsor-update`

### Pull Request (PR) Checklist Summary
When opening a PR, include:
* Clear description of what changed and why.
* Reference to the relevant issue, ticket, or request.
* Mobile and desktop screenshots for visual/UI updates.
* Confirmation that `pnpm run lint` and `pnpm run build` passed locally.
* Verification that changes were previewed on deployment URL on Vercel.

---

## 8. Pull Request (PR) Review Checklist

Before merging any pull request to production, execute the following validation steps:

- [ ] **Linting:** Run `pnpm lint` without errors.
- [ ] **Production Build:** Run `pnpm build` to verify compile-time checks.
- [ ] **Preview Inspection:** Review preview URL on both **Desktop** and **Mobile** screen widths.
- [ ] **Link Verification:** Click all modified and surrounding navigation links.
- [ ] **Recruitment Flows:** Confirm `/recruitment` and homepage quick-panels direct correctly to the application link.
- [ ] **Contact Form Verification:** Submit a test message on `/contact-us` and confirm receipt in `CONTACT_TO_EMAIL`.
- [ ] **In-Site Search:** Test search bar functionality if routes or search documents (`docs/search.md`) were updated.

---

## 9. Common Content & Configuration Updates

### A. Managing Recruitment
Recruitment options, status, and target URLs are controlled in:
`src/app/recruitment/recruitment-data.ts`

```typescript
export const recruitmentConfig = {
  isRecruitmentOpen: true, // Set 'true' to open, 'false' to close
  recruitmentFormUrl: "https://docs.google.com/forms/d/e/.../viewform",
  // ...
};
```

* **Opening Recruitment:** Set `isRecruitmentOpen: true`. This displays active messaging, the "Apply Now" button, and the image configured under `openImage`.
* **Closing Recruitment:** Set `isRecruitmentOpen: false`. This hides the application button, displays closed-state messaging, and shows `closedImage`.
* **Verification:** Check both `/recruitment` and the Homepage Recruitment panel on the preview deployment before merging.

### B. Contact Form & Resend Integration
The contact form submits data to the serverless route at `src/app/api/contact/route.ts`.

#### Modifying Form Recipient Inbox:
1. Update `CONTACT_TO_EMAIL` in the Environment Variables tab on Vercel (and `.env.local`).
2. Trigger a redeploy.
3. Submit a test message at `/contact-us` and confirm delivery.

#### Modifying Form Sender:
1. Log in to the Resend Dashboard.
2. Navigate to **Domains** and add new domain (e.g., `monashuas.org`).
3. Copy the supplied DNS records (TXT/MX/CNAME) and add them to advanced DNS settings on Namecheap.
4. Wait for domain verification in Resend.
5. Update `CONTACT_FROM_EMAIL` in the Environment Variables tab on Vercel
6. Redeploy and test submission.

#### Rotating Resend API Key:
1. Generate a new key in the Resend Dashboard.
2. Update `RESEND_API_KEY` in `.env.local` and the Environment Variables tab on Vercel.
3. Redeploy and send a test contact enquiry.
4. Revoke/delete the old key in Resend once confirmed.

### C. Content File Map
Main site content is organised by route and modular data files:

| Target Area | File Path / Location |
| :--- | :--- |
| **Recruitment Data** | `src/app/recruitment/recruitment-data.ts` |
| **Main Navigation Bar** | `src/global-components/layout/sidebar/navbar-data.ts` |
| **Footer & Social Links** | `src/global-components/layout/footer.tsx` |
| **Homepage Quick-Nav** | `src/app/home/data/explore-panels.ts` |
| **Team Profiles** | `src/app/our-team/data/team-data.ts` |
| **Sponsors Data** | `src/app/our-sponsors/sponsor-page-data.ts` |
| **Drone Fleet Data** | `src/app/our-drones/drone-data.ts` |
| **Section Pages Data** | `src/app/sections/section-data.ts` |
| **SUAS 2026 Timeline** | `src/app/suas-2026-team/timeline-data.ts` |
| **SUAS 2026 Projects** | `src/app/suas-2026-team/projects/project-data.ts` |
| **Static Assets / Media** | `public/` (Images, Videos, Logos, 3D Models) |

*Note: Maintain consistent asset file names in `public/`. If a media filename changes, update all code references accordingly.*

---

## 10. Troubleshooting Guide

| Issue / Error Message | Probable Cause | Corrective Action |
| :--- | :--- | :--- |
| **"Contact Form Is Not Configured"** | Missing environment variables in deployment environment. | Check `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` in Vercel settings; redeploy. |
| **"Message Failed To Send"** | Revoked API key, unverified sender domain, or disallowed sender email. | Verify Resend API key status, verify `monashuas.org` domain status in Resend, and check server logs for `/api/contact`. |
| **Production Did Not Update After Merge** | Failed build, missing production environment variables, or wrong target branch. | Inspect deployment logs in Vercel dashboard to verify if build passed and target branch is correct. |
| **Image/Media Fails to Load** | Missing asset, incorrect file path, or broken reference. | Ensure asset is stored in `public/`, reference path starts with `/`, filename casing matches exactly, and file format is supported. |

---

## 11. Operations Handover Completion Checklist

Ensure all items below are confirmed when handing over website operations:

- [ ] Website Lead confirmed for domain, DNS, and Vercel admin access.
- [ ] Verified Vercel deployment provider and active production branch.
- [ ] Confirmed Resend account administrator and verified domain setup.
- [ ] Verified production environment variables are present and active in Vercel dashboard.
- [ ] Successfully performed test recruitment link update and verified workflow.
- [ ] Update docs with new Website Lead (This README and MUAS Website Change Requests Google Sheet: https://docs.google.com/spreadsheets/d/1u9fldJoP2_-Tf5VmzKbaTg6rqUDOzmSY4g1cUc-kzrk/edit?usp=sharing)
