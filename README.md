# BRSP – Car Washing Duty Roster

A fast, mobile-first web app for managing the **car washing duty roster** of **BSP Batch 2 (Morning)**. Students can look up their duty dates, see who they are paired with, browse the full student list, print the roster, and the instructor can send a ready-made, nicely formatted WhatsApp reminder to any student with one tap.

The app is a **Progressive Web App (PWA)**: it can be installed on a phone or desktop, works offline after the first visit, and updates itself when a new version is deployed.

**Live site:** https://brsp-car-wash.vercel.app/

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Editing the Roster](#editing-the-roster)
6. [Roster Rules](#roster-rules)
7. [WhatsApp Messages](#whatsapp-messages)
8. [Search](#search)
9. [Printing and PDF](#printing-and-pdf)
10. [PWA Details](#pwa-details)
11. [Deployment (Vercel)](#deployment-vercel)
12. [Current Roster Snapshot](#current-roster-snapshot)
13. [Troubleshooting](#troubleshooting)
14. [Maintenance Checklist](#maintenance-checklist)

---

## Features

### Roster
- Duty cards showing date, weekday, serial number, and everyone on duty that day.
- Each weekday has its own colour accent so the schedule is easy to scan.
- Responsive grid: **3 columns** on desktop, **2** on tablet, **1** on mobile.
- Matching students are highlighted while searching.
- A one-tap **WhatsApp message button** next to every student.

### Student List
- Table on desktop and print; cards on tablet and mobile.
- Shows serial number, registration number, name, BSP number, father's name, bKash number, and WhatsApp number.
- Phone numbers are tappable (`tel:` links).
- Missing numbers are shown as an em dash (`—`) instead of a broken link.
- A WhatsApp button that sends the student's **next upcoming duty** message.

### Search
- Search by registration ID, name, weekday, month, date, serial number, father's name, or phone number.
- Works with **Bangla and English digits** interchangeably (`৮৮` = `88`).
- Works with **Bangla and English spellings** of names (`ওসমান` / `osman`).

### Messaging
- Rich WhatsApp reminder with date, time, batch, teammates, and the site link.
- Automatically says **"আজ"** (today) or **"আগামীকাল"** (tomorrow) when relevant, using Bangladesh time (UTC+6).

### Design and Experience
- Hero header with an optimised car wash animation (GIF).
- Bangla-first interface using the self-hosted **Hind Siliguri** font.
- Yellow notice bar for weekly off days and special holidays.
- Print-friendly layout (A4 landscape) that hides buttons and the search bar.

### PWA
- Installable on Android, iOS (Add to Home Screen), and desktop.
- Offline support through a Workbox service worker.
- Automatic updates when a new version is deployed.
- Favicons, Apple touch icon, and maskable app icons.
- App shortcuts for **Roster** and **Student List**.
- In-app **Install App** button on browsers that support it.

---

## Tech Stack

| Area | Technology |
|---|---|
| UI | React 18 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3.4 |
| PWA | `vite-plugin-pwa` (Workbox, `generateSW`) |
| Font | `@fontsource/hind-siliguri` (self-hosted, Bangla and Latin subsets) |
| Hosting | Vercel |

There is no backend and no database. All data lives in a single file, `src/data/roster.js`.

---

## Project Structure

```
BRSP/
├── index.html                 # App entry, PWA meta tags, favicon links, share-preview tags
├── package.json
├── vite.config.js             # Vite + React + PWA manifest and Workbox settings
├── tailwind.config.js
├── postcss.config.js
├── vercel.json                # Cache headers for service worker and manifest
├── README.md
├── public/
│   ├── favicon.ico
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── favicon-48.png
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       ├── maskable-512.png
│       └── apple-touch-icon.png
└── src/
    ├── main.jsx               # Entry point: fonts, CSS, service worker registration
    ├── App.jsx                # Tabs (Roster / Student List), search state
    ├── index.css              # Tailwind layers, safe-area padding, print styles
    ├── assets/
    │   └── car-wash.gif       # Header animation
    ├── data/
    │   └── roster.js          # ★ Members, duties, batch info, site URL (edit this file)
    ├── utils/
    │   ├── search.js          # Bangla/English normalisation and matching
    │   └── whatsapp.js        # WhatsApp link and message builders
    └── components/
        ├── Header.jsx         # Hero banner with the GIF
        ├── NoticeBanner.jsx   # Off-day notice, Install and Print buttons
        ├── InstallButton.jsx  # Shows only when the browser offers PWA install
        ├── SearchBar.jsx
        ├── RosterGrid.jsx     # Responsive grid of duty cards
        ├── DutyCard.jsx       # One duty day
        ├── DayStyle.js        # Colour styles per weekday
        ├── StudentList.jsx    # Table (desktop) and cards (mobile)
        ├── WhatsAppButton.jsx
        ├── Footer.jsx
        └── DutyTable.jsx      # Legacy table layout (currently unused)
```

---

## Getting Started

### Requirements
- Node.js 18 or newer
- npm

### Install and run

```bash
npm install
npm run dev       # development server at http://localhost:5173
```

### Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the built version locally
```

> **Note:** `index.html` must sit in the project root, next to `package.json`. If it is missing, `npm run dev` shows a 404 and `npm run build` fails with `Could not resolve entry module "index.html"`.

---

## Editing the Roster

Everything is controlled from **`src/data/roster.js`**. Change it, save, and the whole app updates.

### 1. Batch information

```js
export const BATCH = 'BSP Batch 2 – Morning';
export const INSTRUCTOR = 'রেজাউল স্যার';
export const SITE_URL = 'https://brsp-car-wash.vercel.app/';
export const EFFECTIVE_FROM = '১৫ অক্টোবর ২০২৬';
```

These values appear in the header, footer, and WhatsApp messages. Update `EFFECTIVE_FROM` whenever the roster is regenerated.

### 2. Members

Each student is one object in the `MEMBERS` array. Keep the array **sorted by registration number**: the serial number (`ক্রমিঃ`) is generated automatically from the order.

```js
{
  id: 153,                         // registration number
  name: 'রাজি আল হাবিব',            // full name in Bangla (shown on screen)
  alias: 'Razi Raji Al Habib',     // English spellings, used only for search
  father: 'হাবিবুল আনোয়ার',
  bsp: '01894985926',
  bkash: '01606704797',            // use '' if unknown (shows an em dash)
  whatsapp: '01814195751'
}
```

**Common changes**

| Task | What to do |
|---|---|
| Change a registration number | Edit `id`, and update that number everywhere it appears in `DUTIES`. |
| Add a student | Add an object in the correct sorted position. Serial numbers shift automatically. |
| Remove a student | Delete the object **and** remove the ID from every `DUTIES` row. |
| Unknown bKash number | Set `bkash: ''`. |

### 3. Duties

Each row is `[date, weekday, [registration IDs]]`. Names are filled in automatically from `MEMBERS`.

```js
const DUTIES = [
  ['১৫ অক্টোবর ২০২৬', 'বৃহস্পতিবার', [167, 108, 111]],
  ['১৮ অক্টোবর ২০২৬', 'রবিবার',      [123, 177, 98]],
  // ...
];
```

- Dates are written in **Bangla digits and month names**, for example `১৫ অক্টোবর ২০২৬`.
- The weekday must be written in Bangla and match the real date.
- Use only IDs that exist in `MEMBERS`. An unknown ID will break the page.

### 4. Off days notice

The yellow banner text lives in `src/components/NoticeBanner.jsx`. Update it when holidays change, for example the Durga Puja break of 19–22 October 2026.

### After any change

```bash
npm run build      # confirm it compiles
git add -A
git commit -m "Update roster"
git push           # Vercel redeploys automatically
```

---

## Roster Rules

These are the rules the current roster was built with. Follow them when regenerating.

1. **Weekly off days:** Friday, Saturday, and Tuesday. Duties fall only on Sunday, Monday, Wednesday, and Thursday.
2. **Public and special holidays are skipped.** Currently: **19–22 October 2026** (Durga Puja break). The only other official Bangladesh holidays in this period, 20 and 21 October, fall inside that break. 7 November is a Saturday, so it changes nothing.
3. **Every student serves exactly 2 duties**, except students who already completed one round earlier.
4. **Exceptions with 1 duty:** `87`, `92`, and `155`. They always serve together on one shared day.
5. **Fixed groups that always stay together:**
   - `102` + `103` + `104`: always one group.
   - `108` + `111`: always together on both of their duties.
   - `87` + `92` + `155`: one shared duty.
6. **No repeated pairing:** apart from the fixed groups, two students are not rostered together more than once.
7. **Fair spacing:** a student's two duties are kept well apart (at least 5 duty days between them).
8. **Group size:** 3 students per day, with a few days of 4 so the totals work out.
9. The roster starts on the date set in `EFFECTIVE_FROM`.

Totals: 25 students, 47 duty slots (22 students x 2 + 3 students x 1), 15 duty days.

---

## WhatsApp Messages

Tapping the green WhatsApp button opens `https://wa.me/<number>?text=<message>` with a prepared message. Numbers are converted automatically to international format (`01XXXXXXXXX` becomes `8801XXXXXXXXX`).

### Message from a duty card

```
আসসালামু আলাইকুম, [Name] 👋

🚗 *গাড়ি ধোয়ার ডিউটি – রিমাইন্ডার*

📅 *তারিখ:* আগামীকাল, ১৫ অক্টোবর ২০২৬ (বৃহস্পতিবার)
⏰ *সময়:* সকাল ৭:০০ টার মধ্যে উপস্থিত থাকুন
🏫 *ব্যাচ:* BSP Batch 2 – Morning

👥 *আপনার সাথে থাকছেন:*
• ১০৮ – [Teammate name]
• ১১১ – [Teammate name]

📋 পূর্ণ রোস্টার দেখুন:
https://brsp-car-wash.vercel.app/

ধন্যবাদ 🙏
— ইনস্ট্রাক্টর রেজাউল স্যার
```

- The date line says **আজ** or **আগামীকাল** when the duty is today or tomorrow (Bangladesh time); otherwise it shows the plain date.
- The teammates block lists everyone else on that day.
- `*text*` is WhatsApp bold formatting.

### Message from the Student List

Uses the student's **next upcoming duty** (today or later). If the student has no upcoming duty, a shorter message with only the roster link is sent.

To change the wording, time, or signature, edit `src/utils/whatsapp.js` (`dutyMessage` and `studentMessage`).

---

## Search

The search bar is shared by both tabs.

| You type | What matches |
|---|---|
| A number such as `88` or `৮৮` | Registration IDs starting with that number; day of month; serial number; phone numbers (student list) |
| Name in Bangla or English | Full name and English aliases |
| `রবিবার`, `নভেম্বর` | Weekday or month |
| Father's name | Student list only |

All input is normalised: Bangla digits become English digits, text is lower-cased, and extra spaces and zero-width characters are removed. Add English spellings to a member's `alias` to make them searchable.

---

## Printing and PDF

Use the **Print or Download** button, then choose **Save as PDF** in the browser's print dialog.

- Page size is **A4 landscape** with 10 mm margins.
- The search bar, buttons, WhatsApp buttons, and the header GIF are hidden in print.
- Cards avoid splitting across pages and colours are preserved.
- The student list prints as a full table.

---

## PWA Details

| Item | Value |
|---|---|
| App name | BRSP – গাড়ি ধোয়ার রোস্টার |
| Short name | BRSP রোস্টার |
| Display mode | `standalone` |
| Theme colour | `#1d4ed8` |
| Background colour | `#109ada` (matches the GIF) |
| Language | `bn` |
| Update strategy | `autoUpdate`: the new version activates automatically |
| Offline | The whole app shell, fonts, icons, and GIF are precached |

**Icons** were generated from the final frame of the car wash GIF:

- `icons/icon-192.png` and `icons/icon-512.png`: standard icons
- `icons/maskable-512.png`: padded for Android adaptive icons
- `icons/apple-touch-icon.png`: iOS home screen icon
- `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-48.png`: browser tab icons

**App shortcuts** (long-press the installed icon): *Roster* (`/`) and *Student List* (`/?tab=students`).

**Installing**
- **Android / Chrome / Edge:** tap **Install App** in the yellow bar, or use the browser menu.
- **iPhone / iPad (Safari):** Share, then **Add to Home Screen**.
- **Desktop Chrome / Edge:** use the install icon in the address bar.

**Header animation:** the original GIF was 3.1 MB. The shipped `src/assets/car-wash.gif` is about 1 MB (480 px wide, 15 fps, reduced palette) so it loads quickly on mobile data.

---

## Deployment (Vercel)

1. Push the project to GitHub (the repository root must contain `package.json` and `index.html`).
2. Import the repository in Vercel. The framework is detected as **Vite**.
3. Use the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Root directory: empty (the repo root)
4. Every push to `main` triggers a new deployment.

`vercel.json` sets:
- `/sw.js`: `no-cache`, so the service worker always updates promptly.
- `/manifest.webmanifest`: correct `application/manifest+json` content type.

After a deploy, users who open the site online get the new version automatically. If someone still sees old data, closing and reopening the app once fixes it.

---

## Current Roster Snapshot

Registration IDs only, as of 14 October 2026. The source of truth is always `src/data/roster.js`.

| # | Date | Day | IDs |
|---|---|---|---|
| 1 | 15 Oct 2026 | Thursday | 167, 108, 111 |
| 2 | 18 Oct 2026 | Sunday | 123, 177, 98 |
| 3 | 25 Oct 2026 | Sunday | 120, 72, 581 |
| 4 | 26 Oct 2026 | Monday | 102, 103, 104 |
| 5 | 28 Oct 2026 | Wednesday | 88, 124, 173 |
| 6 | 29 Oct 2026 | Thursday | 117, 153, 180 |
| 7 | 1 Nov 2026 | Sunday | 123, 93, 130, 167 |
| 8 | 2 Nov 2026 | Monday | 98, 140, 119 |
| 9 | 4 Nov 2026 | Wednesday | 120, 108, 111 |
| 10 | 5 Nov 2026 | Thursday | 72, 88, 177 |
| 11 | 8 Nov 2026 | Sunday | 102, 103, 104 |
| 12 | 9 Nov 2026 | Monday | 153, 173, 581 |
| 13 | 11 Nov 2026 | Wednesday | 93, 180, 140 |
| 14 | 12 Nov 2026 | Thursday | 124, 130, 119, 117 |
| 15 | 15 Nov 2026 | Sunday | 87, 92, 155 |

---

## Troubleshooting

| Problem | Cause and fix |
|---|---|
| `localhost:5173` shows **404** | `index.html` is missing from the project root. Put it next to `package.json` and restart `npm run dev`. |
| Vercel: `Could not resolve entry module "index.html"` | Same cause: `index.html` was not committed. Add it, commit, and push. |
| Page is blank after editing `roster.js` | An ID in `DUTIES` does not exist in `MEMBERS`, or a bracket or quote is broken. Check the browser console. |
| A bKash number shows `—` | The value is empty (`''`). Fill it in `MEMBERS`. |
| Old roster still visible after deploy | The service worker is serving a cached copy. Reload once while online, or close and reopen the installed app. |
| Install button does not appear | The browser has not offered installation (common on iOS Safari). Use **Add to Home Screen** instead. |
| WhatsApp opens with the wrong number | Check the student's `whatsapp` field. Numbers should be in local format (`01XXXXXXXXX`). |
| Weekday does not match the date | `DUTIES` weekday text is typed by hand. Correct it to match the real date. |

---

## Maintenance Checklist

When the roster changes (new students, removals, registration changes, holidays):

- [ ] Update `MEMBERS` (sorted by registration number).
- [ ] Rebuild `DUTIES`, following the [Roster Rules](#roster-rules).
- [ ] Confirm every student has exactly 2 duties (or 1 for the exceptions).
- [ ] Update `EFFECTIVE_FROM`.
- [ ] Update the holiday text in `NoticeBanner.jsx` if needed.
- [ ] Run `npm run build` to confirm it compiles.
- [ ] Commit and push, then wait for the Vercel deployment.
- [ ] Open the live site and send the new duty messages.
