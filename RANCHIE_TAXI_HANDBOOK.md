# 🚕 Ranchie Taxi — Project Handbook

> **Purpose:** Single source of truth for the Ranchie Taxi PWA. Prime a new chat by sharing this file. Keep it updated as the project evolves.
>
> **Last updated:** 18 October 2026 — invoice void support deployed; live Firestore rules recorded in §4. Phone verification is next.

---

## 1. What Ranchie Taxi Is

A custom Next.js Progressive Web App (PWA) for a taxi/airport-transfer service in St. Vincent and the Grenadines. Customers submit bookings through a public form; the driver (Ranchie) manages them through a PIN-protected dashboard. WhatsApp-first communication, EC-dollar context, multilingual support.

- **Live site:** https://www.ranchietaxisvg.com
- **Driver dashboard:** https://www.ranchietaxisvg.com/driver
- **Built & maintained by:** HighMark Business Systems (LJ — Founder & Lead Developer)

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript + React |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| Database | Firebase Firestore |
| Push notifications | Firebase Cloud Messaging (FCM) + Cloud Functions (Gen 2) |
| SMS notifications | Twilio (driver alerts, customer booking-received confirmation, 6PM AST daily digest) |
| Hosting | Vercel (auto-deploy on push to `main`) |
| Version control | GitHub |
| Maps / autocomplete | Google Maps Places API (country-restricted to SVG) |
| Flight tracking | AviationStack API (free tier, 100 calls/month) |
| Translation | Google Translate (free public endpoint) for booking translation |

---

## 3. File Locations

> **CRITICAL:** This project uses App Router with `app/` at the **root** — NOT `src/app/`.

| What | Path |
|---|---|
| Project root | `C:\Users\ictcl\Projects\ranchie-taxi-web` |
| Driver dashboard | `app/driver/page.tsx` |
| Cloud Function (DEPLOYED) | `functions/index.js` |
| Cloud Function (zombie — unused TS, exports `onNewBooking`) | `functions/src/index.ts` |
| Cloud Function (stale compiled — unused) | `functions/lib/index.js` |
| FCM service worker | `public/firebase-messaging-sw.js` |
| Translations | `lib/translations/index.ts` |
| Invoice numbering + types | `lib/invoices.ts` |
| Invoice form modal | `components/InvoiceFormModal.tsx` |
| Invoice printable view | `app/driver/invoice/[id]/page.tsx` |
| Invoice assets (logo, QR, signature) | `public/images/rts-logo.png`, `public/images/ranchie-qr.png`, `public/images/signature.png` |

> ⚠️ **Functions folder quirk:** `functions/package.json` has `"main": "index.js"`, so only `functions/index.js` is deployed. The `src/index.ts` and `lib/index.js` files are leftover zombies from an aborted TypeScript migration — ignore them. Cleanup is optional, not urgent.

---

## 4. Firebase / Google Cloud Details

| Item | Value |
|---|---|
| Firebase project ID | `ranchie-taxi-1e166` |
| Cloud Functions | `sendBookingNotification` (Gen 2, Node.js 24, us-central1, 256MB) · `sendDailyDigest` (Gen 2, Cloud Scheduler) |
| Triggers | `sendBookingNotification`: Firestore `bookings/{bookingId}` document.create · `sendDailyDigest`: cron `0 18 * * *`, `America/St_Vincent` |
| Twilio secrets | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` — Firebase Secret Manager (`defineSecret`), never in code |
| Firestore collections | `bookings`, `fcmTokens`, `invoices`, `counters` (`counters/invoices` holds the next invoice number) |
| Billing account | `0162FD-5CB0DC-1D6739` ("My Billing Account") — **shared** across Ranchie Taxi, Cell World St Vincent, and ranchie-taxi-1e166 |
| Firebase CLI login | `ictcleslie@gmail.com` |
| Driver PIN | stored in env var `NEXT_PUBLIC_DRIVER_PIN` |

**Keys (LJ's private reference — keep secure):**
- Firebase client config (`apiKey`, `messagingSenderId: 878235673378`, `appId: 1:878235673378:web:...`) — these are client-side public keys, safe in browser code
- Google Maps API key — stored in code/env
- AviationStack API key — stored in code/env (free tier: 100 calls/month)

**Live Firestore rules (published 18 October 2026 — verbatim, so future sessions do not need to probe):**

Edit at https://console.firebase.google.com/project/ranchie-taxi-1e166/firestore/rules. Rules are per-collection: a new collection needs its own `match` block (see §10).

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /bookings/{bookingId} {
      allow read, write: if true;
    }

    match /fcmTokens/{tokenId} {
      allow read, write: if true;
    }

    match /invoices/{invoiceId} {
      allow read, create: if true;
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status'])
                    && request.resource.data.status == 'void';
      allow delete: if false;
    }

    match /counters/{counterId} {
      allow read, write: if true;
    }
  }
}
```

> Google Ads is a **completely separate billing system** from Google Cloud. A Google Cloud billing problem does NOT affect ad campaigns (unless the same card is declined there too).

---

## 5. Firestore Booking Schema

```
booking {
  id, name, phone, flightNumber?,
  pickup, destination, date, time, passengers, notes,
  status, createdAt,
  createdBy?    ('driver' — quick-add bookings; suppresses notifications),
  cancelledBy?  ('driver' | 'customer'),
  cancelledAt?
}
```

**Status values:** `pending` → `accepted` / `confirmed` → `scheduled` → `completed`, plus `declined` (rejected before accepting) and `cancelled` (accepted but not done). Scheduled and completed cards can be returned to `accepted` for recovery.

**Invoice schema (`invoices` collection):**

```
invoice {
  invoiceNumber ("00055" — zero-padded, 5 digits),
  invoiceDate (YYYY-MM-DD), billToName, billToLocation,
  passengerName, route, serviceDate,
  lineItems [{ description, price, jobs, subtotal }],
  total, currency ('EC$' | 'US$'),
  bookingId?  (set when generated from a completed booking),
  createdAt
}
```

Numbering: `counters/invoices { next }` is read and incremented inside the same Firestore transaction that writes the invoice, so two saves can never share a number. Seeds at 55 if the counter does not exist (continues Ranchie's paper sequence after 00054).

---

## 6. Deployment

**Frontend (Vercel):**
- DNS: **GoDaddy → Vercel directly** (A record `76.76.21.21`, CNAME `cname.vercel-dns.com`). **No Cloudflare.**
- Auto-deploys on `git push origin main`.
- Dashboards: GoDaddy https://dcc.godaddy.com/ · Vercel https://vercel.com/dashboard

**Cloud Function (Firebase):**
```powershell
firebase deploy --only functions:sendBookingNotification
firebase deploy --only functions:sendDailyDigest
```
> ⚠️ Before deploying functions, if `package-lock.json` is out of sync, Cloud Build's `npm ci` fails. Fix: `cd functions` → delete `node_modules` + `package-lock.json` → `npm install` → redeploy. Commit the regenerated lock file.

---

## 7. How LJ and Claude Work Together

### Workflow rules
- **ONE step at a time.** Never bundle multiple steps or too much info in one message — it risks important details being missed. Wait for confirmation before the next step. Keep responses tightly focused on the immediate next action.
- **File-open command first.** Always give the PowerShell/bash command to open a file (e.g. `code app\driver\page.tsx`) *before* any edit instructions.
- **Exact find-and-replace only.** Never vague placement ("find the section tag and add after"). Give the precise lines to find and the precise replacement. Surgical edits — never rewrite whole files/functions unless replacing that entire block.
- **PowerShell does NOT support `&&`.** Give commands one per line.
- **Direct weblinks** for any external site (GoDaddy, Vercel, Firebase, GCP) — never just "log into X".
- **Coding mode:** no explanations of why something was done unless asked. Just the change.
- **`.ps1` scripts:** always delivered as a downloadable file (never inline). Include timestamped backup, LF line endings, UTF-8 no-BOM, post-write verification, rollback command.

### Design/engineering standards
- Consider all edge cases first; choose the most efficient, effective, reliable solution. Never shortcut critical features (notifications especially).
- Proactively flag improvements, optimizations, and potential issues — don't wait to be asked.
- If a request would make the app inefficient or adds no value, explain why before proceeding.
- Only recommend changes that measurably improve efficiency/effectiveness.
- Animations should be aggressive/noticeable (slam-in, rise, pulse-glow).
- Each section should have a deliberately different layout — avoid repeating patterns.

### Communication style
- Customer-facing messages: **first-person singular ("I"/"me"), no contractions, formal English.**
- Keep each project in its own conversation. New project = new chat.

---

## 8. Current Position (as of 18 October 2026)

### ✅ Completed & verified in production
1. **Twilio token swap** — exposed auth token invalidated and replaced; secrets live only in Firebase Secret Manager.
2. **Driver-created booking notification suppression** — quick-add bookings (`createdBy: 'driver'`) do not trigger FCM/SMS alerts.
3. **Scheduled status + flow** — Schedule / Mark Complete / Return to Accepted on booking cards, purple pill + tab + count, customer-facing scheduled view.
4. **Needs Attention strip** — upcoming (3-day window) and overdue scheduled bookings surfaced with tab badges.
5. **6PM AST daily SMS digest** — `sendDailyDigest` Cloud Function on Cloud Scheduler: tomorrow's pickups + scheduled bookings needing review.
6. **Customer booking-received SMS** — sent on submission with a tracking link; phone numbers normalized to E.164 (SVG local, 784-prefixed, 1-prefixed, international).
7. **Phone guidance on booking form** — amber attention glow until the number is verified, international placeholder, country-code helper, tinted status cards.
8. **Quick-add booking + amber FAB** — driver modal form, FAB with ping + slam-in entrance, sentinel-safe fields.
9. **Premium dashboard header + greeting ticker** — Ranchie photo, gradient, curves; time-aware amber greeting banner with rise-in entrance, capped pulse-glow, seamless subtitle marquee (pause on hover/focus, reduced-motion fallback).
10. **Invoice generation** — numbered sequentially from 00055 via a Firestore transaction counter (`counters/invoices`); branded printable view at `/driver/invoice/[id]` (logo, QR, signature assets in `public/images/`, Print / Save as PDF); **New Invoice** button + prefill-from-completed-booking entry points; amber UI; invoice history list on the dashboard. Invoices are **create-only from the client** (no update/delete) to protect numbering — a mistaken invoice can only be deleted from the Firebase console.
11. **Invoice WhatsApp share + post-complete offer** — A4 PNG capture via `html2canvas-pro` (**NOT** vanilla `html2canvas` — Tailwind 4 emits oklch colors that vanilla throws on); Web Share API (`navigator.share` with files) with desktop download fallback ("Image downloaded - attach it in WhatsApp."); the invoice sheet is a fixed 794px A4 document scaled to fit on phones, so screen / print / shared image all match; post-Mark-Complete invoice offer card ("Job complete. Generate an invoice for this job?") is non-blocking — the status write never waits on it. **Void support** — invoices are never deleted; a narrow Firestore rule allows updating ONLY `status` to `'void'` (amounts/number/parties immutable, no un-void from client). Voided invoices show a diagonal VOID watermark on view/print/shared PNG and a muted VOID row in history. Deletion remains Firebase-console-only.

### 🔄 Next up (resume here)
**Phone verification at booking form** — see To-Do #1.

---

## 9. Remaining To-Do Queue

| # | Item | Approach |
|---|---|---|
| 1 | **Phone verification at booking form** (NEXT) | Customer enters phone → app sends a code → customer confirms before booking submits. Eliminates fake/unreachable bookings at the source. (Root cause: two fake bookings had numbers not registered on WhatsApp — auto-replies bounced with "not on WhatsApp".) |
| 2 | **Reports + fare capture** | Capture fare on bookings; reporting view for the driver. |
| 3 | **Google reviews page** | Dedicated reviews page. |
| 4 | **Events archive / Previous Events** | Archive past events into a Previous Events section. |
| 5 | **Housekeeping list** | Stray files (untracked images in `public/images/`, `HIGHMARK-BUILD-HANDBOOK-v2.md`), `firebase-functions` upgrade (needs its own pass), small bugs. |
| 6 | **Section 14 compliance (HighMark studio standard)** | Verify Ranchie Taxi has a Privacy Policy page, Terms page, and the current HighMark footer credit; add whatever is missing. |
| 7 | **Activity log / audit trail** (parked / later) | Soft delete + `statusHistory` per booking, dashboard history view. |
| 8 | **Dedupe notifications** (parked / later) | In-page listener + FCM SW can both fire. |

### Confirmed NOT needed
- Mobile 5-card count row layout — confirmed fine on Ranchie's phone, no fix required.

---

## 10. Known Quirks & Gotchas

- **`functions/` has 3 index files** — only `index.js` is deployed (see §3).
- **`package-lock.json` sync** — regenerate cleanly before function deploys (see §6).
- **Notification doubles** — in-page listener + FCM service worker can both fire. Known, low priority — extra notifications better than none.
- **Billing is shared** across multiple projects — a lapse affects Ranchie Taxi AND Cell World.
- **Google Cloud APIs** (Maps, etc.) share the same billing — a billing lapse can break Places Autocomplete on the booking form.
- **Firestore rules are per-collection, NOT global.** Any NEW collection (e.g. `invoices`, `counters`) is permission-denied until its own `match` block is added at https://console.firebase.google.com/project/ranchie-taxi-1e166/firestore/rules and published (no expiration). Symptom: listeners silently rejected, saves fail, views may show misleading empty states. This cost a full debugging session on 2026-10-17.
- **Stale webpack chunk in dev:** `Cannot read properties of undefined (reading 'call')` whenever a build adds new files or dependencies while `npm run dev` is running. Fix: stop the server, `Remove-Item -Recurse -Force .next`, `npm run dev`. Recurred 3x Oct 17-18. **Habit:** restart the dev server after any build that creates files or installs packages, before testing.

---

## 11. Related Projects (separate chats, shared context)

LJ (HighMark Business Systems) also maintains: **Cell World SVG**, **Pirates Pub SVG**, and does **FSA (Financial Services Authority)** regulatory database work. Each lives in its own conversation. Cell World shares the same Google Cloud billing account.

---

*End of handbook. Update this file as the project evolves.*
