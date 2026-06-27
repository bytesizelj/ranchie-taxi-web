# 🚕 Ranchie Taxi — Project Handbook

> **Purpose:** Single source of truth for the Ranchie Taxi PWA. Prime a new chat by sharing this file. Keep it updated as the project evolves.
>
> **Last updated:** Session ending with FCM restoration + Cancel buttons deployed. Greeting + location-message upgrades in progress.

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

> ⚠️ **Functions folder quirk:** `functions/package.json` has `"main": "index.js"`, so only `functions/index.js` is deployed. The `src/index.ts` and `lib/index.js` files are leftover zombies from an aborted TypeScript migration — ignore them. Cleanup is optional, not urgent.

---

## 4. Firebase / Google Cloud Details

| Item | Value |
|---|---|
| Firebase project ID | `ranchie-taxi-1e166` |
| Cloud Function name | `sendBookingNotification` (Gen 2, Node.js 24, us-central1, 256MB) |
| Trigger | Firestore `bookings/{bookingId}` document.create |
| Firestore collections | `bookings`, `fcmTokens` |
| Billing account | `0162FD-5CB0DC-1D6739` ("My Billing Account") — **shared** across Ranchie Taxi, Cell World St Vincent, and ranchie-taxi-1e166 |
| Firebase CLI login | `ictcleslie@gmail.com` |
| Driver PIN | stored in env var `NEXT_PUBLIC_DRIVER_PIN` |

**Keys (LJ's private reference — keep secure):**
- Firebase client config (`apiKey`, `messagingSenderId: 878235673378`, `appId: 1:878235673378:web:...`) — these are client-side public keys, safe in browser code
- Google Maps API key — stored in code/env
- AviationStack API key — stored in code/env (free tier: 100 calls/month)

> Google Ads is a **completely separate billing system** from Google Cloud. A Google Cloud billing problem does NOT affect ad campaigns (unless the same card is declined there too).

---

## 5. Firestore Booking Schema

```
booking {
  id, name, phone, flightNumber?,
  pickup, destination, date, time, passengers, notes,
  status, createdAt,
  cancelledBy?  ('driver' | 'customer'),
  cancelledAt?
}
```

**Status values:** `pending` → `accepted` / `confirmed` → `completed`, plus `declined` (rejected before accepting) and `cancelled` (accepted but not done).

---

## 6. Deployment

**Frontend (Vercel):**
- DNS: **GoDaddy → Vercel directly** (A record `76.76.21.21`, CNAME `cname.vercel-dns.com`). **No Cloudflare.**
- Auto-deploys on `git push origin main`.
- Dashboards: GoDaddy https://dcc.godaddy.com/ · Vercel https://vercel.com/dashboard

**Cloud Function (Firebase):**
```powershell
firebase deploy --only functions:sendBookingNotification
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

## 8. Current Position (as of latest session)

### ✅ Completed & deployed this session
1. **Notification listener self-healing** — driver dashboard `onSnapshot` listener now auto-reconnects on tab visibility change + network restore (fixed stale WebChannel that required manual refresh).
2. **Cancel + Customer Cancelled buttons** — on accepted bookings, with distinct WhatsApp messages. Both set `status: 'cancelled'` + `cancelledBy` field.
3. **Cancelled filter tab + count card** — split from Declined.
4. **Billing crisis resolved** — expired card replaced, closed billing account reopened.
5. **FCM Cloud Function redeployed** — `sendBookingNotification` live and verified end-to-end (chime + browser notification + phone push all working).

### 🔄 In progress (resume here)
**Greeting + location-message upgrades** — file open, code prepared:
- **Step 1 (READY, not yet applied):** Add live-location request to the Accept message (find-and-replace prepared — customer-facing text guides them to share location via WhatsApp attachment → Location). Doubles as a fake-booking verification signal.
- **Step 2 (designed, not built):** Time-aware greeting banner below dashboard header. Permanent banner. Greetings: Morning ☀️ / Afternoon 🚕 / Evening 🌙 / Night 🌃, each with a supportive subtitle. Soft teal/green to match theme.

---

## 9. Remaining To-Do Queue

| # | Item | Approach |
|---|---|---|
| 1 | **Activity log / audit trail dashboard** | Soft delete (`isDeleted` flag) + `statusHistory` array on each booking; new dashboard view showing full history including deleted. Independent of Cloud Functions. |
| 2 | **WhatsApp notification redundancy** | Cloud Function sends WhatsApp alongside FCM. **Blocked:** Meta face verification (LJ unable/unwilling). Workaround: **Twilio WhatsApp API** (~$0.005-0.015/msg) or third-party (Wati, AiSensy, MSG91) that handle Meta verification on their side. |
| 3 | **Phone verification at booking form** | Customer enters phone → app sends WhatsApp code → customer confirms before booking submits. Eliminates fake/unreachable bookings at the source. (Root cause: two fake bookings had numbers not registered on WhatsApp — auto-replies bounced with "not on WhatsApp".) |
| 4 | **(Optional) Dedupe notifications** | Currently in-page listener + FCM service worker can both fire = duplicate notifications. Add dedup logic. Low priority — extra notifications better than none. |

### Confirmed NOT needed
- Mobile 5-card count row layout — confirmed fine on Ranchie's phone, no fix required.

---

## 10. Known Quirks & Gotchas

- **`functions/` has 3 index files** — only `index.js` is deployed (see §3).
- **`package-lock.json` sync** — regenerate cleanly before function deploys (see §6).
- **Notification doubles** — known, see To-Do #4.
- **Billing is shared** across multiple projects — a lapse affects Ranchie Taxi AND Cell World.
- **Google Cloud APIs** (Maps, etc.) share the same billing — a billing lapse can break Places Autocomplete on the booking form.

---

## 11. Related Projects (separate chats, shared context)

LJ (HighMark Business Systems) also maintains: **Cell World SVG**, **Pirates Pub SVG**, and does **FSA (Financial Services Authority)** regulatory database work. Each lives in its own conversation. Cell World shares the same Google Cloud billing account.

---

*End of handbook. Update this file as the project evolves.*
