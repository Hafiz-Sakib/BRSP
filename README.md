<div align="center">

# 🚗 BRSP Car Wash Duty Roster

**A fast, installable, mobile-first duty roster for BSP Batch 2 (Morning) — with one-tap WhatsApp reminders.**

[![Live Site](https://img.shields.io/badge/Live-brsp--car--wash.vercel.app-1d4ed8?style=for-the-badge&logo=vercel&logoColor=white)](https://brsp-car-wash.vercel.app/)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)

</div>

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Getting Started](#-getting-started)
6. [Managing the Roster Data](#-managing-the-roster-data)
7. [How the WhatsApp Reminder Works](#-how-the-whatsapp-reminder-works)
8. [Search](#-search)
9. [Progressive Web App (PWA)](#-progressive-web-app-pwa)
10. [Animations](#-animations)
11. [Printing & PDF Export](#-printing--pdf-export)
12. [Deployment](#-deployment)
13. [Customization Guide](#-customization-guide)
14. [Troubleshooting](#-troubleshooting)

---

## 🌟 Overview

**BRSP Car Wash Duty Roster** is a single-page web app that tells every student of **BSP Batch 2 – Morning** *when* they have car-washing duty, *who* they are paired with, and lets the instructor remind them on WhatsApp in a single tap.

It replaces a printed paper list with something that:

- works on **any device** (phone, tablet, desktop),
- can be **installed like a native app** and used **offline**,
- is **searchable** in both Bangla and English,
- is driven by **one small data file**, so updating the roster takes minutes.

| | |
|---|---|
| **Batch** | BSP Batch 2 – Morning |
| **Instructor** | Rezaul Sir (রেজাউল স্যার) |
| **Roster effective from** | 26 October 2026 |
| **Duty time** | Be present by 7:00 AM |
| **Live URL** | <https://brsp-car-wash.vercel.app/> |

> **Weekly holidays:** Friday, Saturday and Tuesday are off (no car washing), as are government holidays.

---

## ✨ Features

### 📅 Roster
- Duty **cards** with a colour-coded top bar and day badge (Sunday, Monday, Wednesday, Thursday each have their own colour).
- **Responsive grid:** 3 columns on desktop · 2 on tablet · 1 on mobile.
- Each member row shows their **registration ID chip**, **full Bangla name** and a **WhatsApp button**.
- Members matching your search are **highlighted** in yellow.

### 🎓 Student List
- Full class directory: serial no., registration no., name, **BSP number**, father's name, **bKash number**, **WhatsApp number**.
- **Table view** on large screens and in print; **card view** on tablets and phones.
- Tapping any phone number opens the dialer (`tel:` link).

### 💬 WhatsApp Reminders
- One-tap pre-filled message in Bangla, per member, from both the roster and the student list.
- Includes the **date**, **day**, **time**, **batch**, and the **teammates' names and WhatsApp numbers**.
- Smart wording: shows **"আজ" (today)** or **"আগামীকাল" (tomorrow)** automatically, using Bangladesh time (UTC+6).
- Link is sent as plain text with **no preview card**.

### 🔍 Search
- Search by **ID, name, date, day or month** — in **Bangla or English**.
- Bangla digits and English digits are interchangeable (`৮৮` = `88`).
- English spellings of Bangla names work through hidden **aliases** (e.g. typing `osman` finds ওসমান গনি).

### 📲 Installable PWA
- "Install App" button appears when the browser supports installation.
- **Works offline** after first load; auto-updates on every new deploy.
- Home-screen **shortcuts** to *Roster* and *Student List*.

### 🎨 Polish
- Subtle **entrance animations** and hover effects (respects *reduced-motion* and is disabled in print).
- Animated **car-wash GIF** in the header.
- Sticky search bar, safe-area padding for notched phones.
- **Print / Save as PDF** in A4 landscape with controls auto-hidden.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| UI library | [React 18](https://react.dev/) |
| Build tool | [Vite 5](https://vitejs.dev/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS / Autoprefixer |
| Typography | [Hind Siliguri](https://fontsource.org/fonts/hind-siliguri) via `@fontsource` (self-hosted, Bangla-optimised) |
| PWA | [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) (Workbox `generateSW`) |
| Hosting | [Vercel](https://vercel.com/) |

No backend, no database, no API keys — everything is static and ships in the bundle.

---

## 🗂 Project Structure

```text
BRSP-main/
├── public/
│   ├── favicon.ico, favicon-16/32/48.png
│   └── icons/                     # PWA icons (192, 512, maskable, Apple touch)
├── src/
│   ├── assets/
│   │   └── car-wash.gif           # Header animation
│   ├── components/
│   │   ├── Header.jsx             # Hero banner with GIF, batch & instructor
│   │   ├── NoticeBanner.jsx       # Holiday notice + Install button
│   │   ├── SearchBar.jsx          # Sticky live search
│   │   ├── RosterGrid.jsx         # Responsive grid of duty cards
│   │   ├── DutyCard.jsx           # One duty day (date, day, members)
│   │   ├── DutyTable.jsx          # Table layout (legacy / print-oriented)
│   │   ├── StudentList.jsx        # Student table (desktop) + cards (mobile)
│   │   ├── WhatsAppButton.jsx     # Green one-tap WhatsApp button
│   │   ├── InstallButton.jsx      # PWA install prompt button
│   │   ├── DayStyle.js            # Colour theme per weekday
│   │   └── Footer.jsx
│   ├── data/
│   │   └── roster.js              # ⭐ THE data file — members & duties
│   ├── utils/
│   │   ├── search.js              # Bangla/English-aware search & normalisation
│   │   └── whatsapp.js            # Message builder + wa.me link helper
│   ├── App.jsx                    # Tabs, search state, layout
│   ├── main.jsx                   # Entry point, fonts, service worker
│   └── index.css                  # Tailwind layers, animations, print rules
├── index.html                     # Meta tags, favicons, PWA tags
├── vite.config.js                 # Vite + PWA manifest & Workbox config
├── tailwind.config.js
├── postcss.config.js
├── vercel.json                    # Headers & WhatsApp no-preview rule
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and **npm**

### Install & run

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server  →  http://localhost:5173
npm run dev

# 3. Create a production build  →  dist/
npm run build

# 4. Preview the production build locally
npm run preview
```

| Script | What it does |
|---|---|
| `npm run dev` | Hot-reloading development server |
| `npm run build` | Optimised production build + service worker |
| `npm run preview` | Serves the built `dist/` folder locally |

> 💡 The service worker only runs in production builds. To test offline mode and installability, use `npm run build && npm run preview`.

---

## 🗃 Managing the Roster Data

Everything lives in **`src/data/roster.js`**. Edit this one file and the entire app updates.

### 1. Global settings

```js
export const BATCH          = 'BSP Batch 2 – Morning';
export const INSTRUCTOR     = 'রেজাউল স্যার';
export const SITE_URL       = 'https://brsp-car-wash.vercel.app/';
export const SITE_LINK_TEXT = 'brsp-car-wash.vercel.app';   // used in WhatsApp messages
export const EFFECTIVE_FROM = '২৬ অক্টোবর ২০২৬';
```

### 2. Members

Each student is one object in `MEMBERS`:

```js
{
  id: 88,                               // registration number
  name: 'মোঃ ওসমান গনি',                 // full Bangla name (shown on screen)
  alias: 'Osman Usman Gani Ghani',      // English spellings — search only, never displayed
  father: 'মোঃ আবু তাহের',
  bsp: '01895651785',                   // BSP number
  bkash: '01895651785',                 // bKash number
  whatsapp: '01318874557'               // WhatsApp number (used for reminders)
}
```

> If a student's WhatsApp number is also their bKash number, simply put the same number in both fields.

### 3. Duties

Each line in `DUTIES` is one duty day — **date, weekday, and member IDs only**. Names fill in automatically.

```js
const DUTIES = [
  ['১৫ অক্টোবর ২০২৬', 'বৃহস্পতিবার', [167, 108, 111]],
  ['১৮ অক্টোবর ২০২৬', 'রবিবার',     [123, 177, 98]],
  // ...
];
```

⚠️ **Format rules**
- Dates must be written in **Bangla digits and Bangla month names**: `১৪ অক্টোবর ২০২৬` — the reminder logic parses this exact format to work out "today / tomorrow".
- The weekday must match one of: `রবিবার`, `সোমবার`, `বুধবার`, `বৃহস্পতিবার` (these have colour themes; any other day falls back to grey).
- Only IDs that exist in `MEMBERS` are allowed.

---

## 💬 How the WhatsApp Reminder Works

Click the green **মেসেজ** button next to any member and WhatsApp opens with a ready-made message to that person:

```text
আসসালামু আলাইকুম, সাইদুল ইসলাম 👋

🚗 *গাড়ি ধোয়ার ডিউটি – রিমাইন্ডার*

📅 *তারিখ:* ২৫ অক্টোবর ২০২৬ (রবিবার)
⏰ *সময়:* সকাল ৭:০০ টার মধ্যে উপস্থিত থাকুন
🏫 *ব্যাচ:* BSP Batch 2 – Morning

👥 *আপনার সাথে থাকছেন:*
• ৭২ – মোহাম্মদ তারিকুল ইসলাম
   📱 01577152448
• ৫৮১ – মোহাম্মদ আনিসুর রহমান
   📱 01606111153

📋 পূর্ণ রোস্টার দেখুন:
brsp-car-wash.vercel.app

ধন্যবাদ 🙏
— ইনস্ট্রাক্টর রেজাউল স্যার
```

**Behind the scenes** (`src/utils/whatsapp.js`)

| Function | Purpose |
|---|---|
| `waNumber(n)` | Converts `017…` → `88017…` (international format required by `wa.me`) |
| `waLink(number, message)` | Builds `https://wa.me/<number>?text=<encoded message>` |
| `dutyMessage(name, row, selfId)` | Message for a specific duty card; lists teammates (excluding the recipient) |
| `studentMessage(student)` | From the Student List: finds that student's **next upcoming duty** and builds the message; falls back to a generic roster message if none remain |

### 🔕 Link preview suppression
The site link is sent **without `https://`** so WhatsApp still makes it tappable but doesn't expand it into a large preview card. Additionally:

- Open Graph (`og:`) tags are **removed** from `index.html`.
- `vercel.json` rewrites requests from WhatsApp's crawler (`user-agent` containing "whatsapp") to a non-existent path, so it receives nothing to build a preview from.

> ℹ️ Previews are generated on the *sender's* phone and can be cached by WhatsApp. If an old preview still appears, tap the ✕ on it before sending. After changing this behaviour, **redeploy** for the `vercel.json` rule to take effect.

---

## 🔍 Search

The search bar is sticky at the top and filters both tabs live.

| You type | What it matches |
|---|---|
| `88` or `৮৮` | Member IDs starting with 88; also duty day *88*, or serial no. 88 |
| `osman` / `ওসমান` | Member name or English alias |
| `রবিবার` | Duties on Sundays |
| `নভেম্বর` | Duties in November |
| `0188…` *(student tab)* | BSP / bKash / WhatsApp numbers |
| Father's name *(student tab)* | Father's name |

How it works (`src/utils/search.js`): input is **normalised** — Bangla digits → English digits, lower-cased, extra whitespace and zero-width characters removed — then compared with the same normalisation on the data.

---

## 📲 Progressive Web App (PWA)

Configured in `vite.config.js` via `vite-plugin-pwa`:

- **Auto-update** (`registerType: 'autoUpdate'`) — new deploys activate without user action.
- **Offline support** — Workbox precaches JS, CSS, HTML, fonts, icons and the header GIF.
- **Manifest** — name, short name, theme colour `#1d4ed8`, standalone display, maskable icon.
- **Shortcuts** — long-press the app icon for *রোস্টার* and *শিক্ষার্থী তালিকা*. You can also open the student list directly with `/?tab=students`.
- **Install button** — shown in the notice banner only when the browser fires `beforeinstallprompt` (Chrome, Edge, Android). On iOS, use **Share → Add to Home Screen**.

---

## 🎞 Animations

Defined in `src/index.css` — lightweight, CSS-only, no extra library.

| Class | Effect |
|---|---|
| `.anim-header` | Header slides down on load |
| `.anim-banner` | Notice banner fades in |
| `.anim-tabs` | Tab switcher pops in |
| `.anim-page` | Smooth fade when switching tabs |
| `.anim-card` | Cards fade up with a **staggered delay**; lift slightly on hover |

Accessibility & print:
- `@media (prefers-reduced-motion: reduce)` disables all of the above.
- `@media print` removes animation and transforms so printouts are crisp.

---

## 🖨 Printing & PDF Export

Click **"প্রিন্ট বা ডাউনলোড করুন"** (or press `Ctrl/Cmd + P`):

- Layout switches to **A4 landscape** with 10 mm margins.
- Search bar, buttons, GIF and WhatsApp buttons are hidden (`.no-print`).
- Cards never split across pages (`break-inside: avoid`).
- Colours are preserved (`print-color-adjust: exact`).
- Choose **"Save as PDF"** as the destination to download a PDF.

---

## 🌐 Deployment

The project is deployed on **Vercel**.

1. Push the repository to GitHub.
2. Import it in Vercel — framework preset **Vite**, build command `npm run build`, output `dist`.
3. Every push to the main branch auto-builds and deploys.

`vercel.json` also sets:
- `no-cache` on `/sw.js` so users always get the newest service worker.
- the correct `Content-Type` for `/manifest.webmanifest`.
- the WhatsApp crawler rewrite (see [Link preview suppression](#-link-preview-suppression)).

If you change the domain, update `SITE_URL` and `SITE_LINK_TEXT` in `src/data/roster.js`.

---

## 🛠 Customization Guide

| I want to… | Edit |
|---|---|
| Add / remove a student | `MEMBERS` in `src/data/roster.js` |
| Add / change a duty day | `DUTIES` in `src/data/roster.js` |
| Change batch, instructor, start date | Constants at the top of `roster.js` |
| Change the holiday notice | `src/components/NoticeBanner.jsx` |
| Change the reminder message | `dutyMessage()` in `src/utils/whatsapp.js` |
| Change weekday colours | `src/components/DayStyle.js` |
| Tweak or disable animations | `src/index.css` (`.anim-*` classes) |
| Replace the header GIF | `src/assets/car-wash.gif` |
| Replace app icons | `public/icons/` and `public/favicon*` |
| Change theme colour / app name | `manifest` block in `vite.config.js` and `<meta name="theme-color">` in `index.html` |

---

## 🩺 Troubleshooting

**The old version still shows after deploying.**
The PWA caches aggressively. Close and reopen the app (or hard-refresh); `autoUpdate` swaps in the new version on the next load.

**"আজ / আগামীকাল" isn't showing in the message.**
Check the date format in `DUTIES` — it must use Bangla digits and Bangla month names (e.g. `২৫ অক্টোবর ২০২৬`).

**WhatsApp opens but the number is wrong.**
Numbers are converted to international format automatically (`01…` → `8801…`). Make sure the stored number has 11 digits starting with `01`.

**A name is missing in the roster.**
The ID used in `DUTIES` must exist in `MEMBERS`.

**Install button doesn't appear.**
It only shows where the browser supports `beforeinstallprompt`, and only if the app isn't already installed. On iOS use *Share → Add to Home Screen*.

**Link preview still appears in WhatsApp.**
Redeploy so `vercel.json` takes effect, then dismiss any cached preview with ✕ before sending.

---

<div align="center">

Made with ❤️ for **BSP Batch 2 – Morning** · Instructor: Rezaul Sir

</div>
