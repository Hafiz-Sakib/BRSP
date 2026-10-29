<div align="center">

<img src="src/assets/logos/brta.png" alt="BRTA logo" width="96" />

# BRSP Car Wash Duty Roster

**A fast, installable, mobile-first duty roster for BRSP Batch 2 (Morning) at BRTC Chattogram — with one-tap WhatsApp reminders, student list, donation tracker and CU shuttle-train schedule.**

[![Live Site](https://img.shields.io/badge/Live-brsp--car--wash.vercel.app-00694d?style=for-the-badge&logo=vercel&logoColor=white)](https://brsp-car-wash.vercel.app/)

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
6. [Layout & Navigation](#-layout--navigation)
7. [Branding: Logos & App Icon](#-branding-logos--app-icon)
8. [Managing the Data](#-managing-the-data)
9. [How the WhatsApp Reminder Works](#-how-the-whatsapp-reminder-works)
10. [Search](#-search)
11. [Progressive Web App (PWA)](#-progressive-web-app-pwa)
12. [Animations](#-animations)
13. [Printing & PDF Export](#-printing--pdf-export)
14. [Deployment](#-deployment)
15. [Customization Guide](#-customization-guide)
16. [Troubleshooting](#-troubleshooting)

---

## 🌟 Overview

**BRSP Car Wash Duty Roster** is a single-page web app for the **Bangladesh Road Safety Project (BRSP)** "Motor Vehicle Driving & Basic Maintenance Training" course at the **BRTC Chattogram Bus Depot & Training Centre**. It tells every student of **BRSP Batch 2 – Morning** *when* they have car-washing duty, *who* they are paired with, and lets the instructor remind them on WhatsApp in a single tap.

It replaces a printed paper list with something that:

- works on **any device** (phone, tablet, desktop),
- can be **installed like a native app** and used **offline**,
- is **searchable** in both Bangla and English,
- is driven by **a few small data files**, so updating takes minutes.

| | |
|---|---|
| **Project** | Bangladesh Road Safety Project (BRSP) — Govt. of Bangladesh & World Bank |
| **Centre** | BRTC Chattogram Bus Depot & Training Centre |
| **Batch** | BRSP Batch 2 – Morning |
| **Instructor** | Rezaul Sir (রেজাউল স্যার) |
| **Roster effective from** | 26 October 2026 |
| **Duty time** | Be present by 7:00 AM |
| **Live URL** | <https://brsp-car-wash.vercel.app/> |

> **Weekly holidays:** Friday, Saturday and Tuesday are off (no car washing), as are government holidays.

---

## ✨ Features

### 🏛 Official header
- White **logo strip** with the logos of the **Government of Bangladesh, BRTA, BRTC and The World Bank**.
- Dark-green hero with project name, course, centre, **batch**, **start date** and **duty time**, finished with a road-marking dash line.
- **Forms card** — view or download the **BRTC–BRSP admission form** and the **Medical Certificate (Form-2) for driving licence** (PDFs) straight from the header.

### 🧭 Navbar
- Sticky **navbar** with *Roster · Student List · Donation · Shuttle Train*.
- **Desktop:** horizontal links. **Phones/tablets (< 768 px):** a **hamburger menu** that opens a dropdown and closes on selection, outside tap or `Esc`.
- The search bar sits right under the navbar and stays visible while scrolling.

### 📅 Roster
- Duty **cards** with a colour-coded top bar and day badge (Sunday, Monday, Wednesday, Thursday each have their own colour).
- **Responsive grid:** 3 columns on desktop · 2 on tablet · 1 on mobile.
- Each member row shows the **registration ID chip**, **full Bangla name** and a **WhatsApp button**.
- Members matching your search are **highlighted**.
- **Instructor contact card** (name + tap-to-call number) appears **once, at the bottom of the roster page** — not repeated on every page.

### 🎓 Student List
- Full class directory: serial no., registration no., name, **BSP number**, father's name, **bKash number**, **WhatsApp number**.
- **Table view** on large screens and in print; **card view** on tablets and phones.
- Tapping any phone number opens the dialer (`tel:` link).

### 🪭 Donation
- Tracks the **fan-purchase donation** (৳50 per student): paid / unpaid lists, collected and due amounts, and a **progress bar**.
- Searchable by registration number or name.

### 🚆 Shuttle Train
- Chittagong University shuttle-train schedule with a **live clock**, **next train** cards and countdowns.
- Full timetable (regular days and Fri/Sat), route with station-wise times (Botoli → Sholoshahar → Cantonment → Chowdhuryhat → Campus), downloadable official schedule image and contact numbers.

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
- Installs with the **BRTA logo** as the app icon.
- "Install App" button appears when the browser supports installation.
- **Works offline** after first load; auto-updates on every new deploy.
- Home-screen **shortcuts** to *Roster*, *Student List* and *Shuttle Train*.

### 🎨 Polish
- Subtle **entrance animations** and hover effects (respects *reduced-motion*, disabled in print).
- Safe-area padding for notched phones, visible keyboard focus.
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
│   ├── BRTC_BRSP_Admission_Form.pdf   # Admission form (linked from the header)
│   ├── BRTC_Medical_Certificate_Form-2.pdf  # Medical certificate form (linked from the header)
│   ├── BRSP_Batch2_Hajira_*.pdf       # Attendance sheets
│   ├── train-schedule.png             # Official shuttle schedule image
│   ├── favicon.ico, favicon-16/32/48.png   # BRTA logo favicons
│   └── icons/                         # PWA icons from the BRTA logo (192, 512, maskable, Apple touch)
├── src/
│   ├── assets/
│   │   └── logos/                     # govt-bd, brta, brtc, world-bank (transparent PNG)
│   ├── components/
│   │   ├── Header.jsx                 # Logo strip, project hero, forms download card
│   │   ├── NoticeBanner.jsx           # Holiday notice + Install button
│   │   ├── Navbar.jsx                 # Sticky navbar + hamburger menu
│   │   ├── SearchBar.jsx              # Live search (under the navbar)
│   │   ├── RosterGrid.jsx             # Responsive grid of duty cards
│   │   ├── DutyCard.jsx               # One duty day (date, day, members)
│   │   ├── DutyTable.jsx              # Table layout (legacy / print-oriented, currently unused)
│   │   ├── InstructorCard.jsx         # Instructor contact — bottom of roster page only
│   │   ├── StudentList.jsx            # Student table (desktop) + cards (mobile)
│   │   ├── DonationList.jsx           # Fan-donation tracker
│   │   ├── TrainSchedule.jsx          # CU shuttle-train schedule
│   │   ├── WhatsAppButton.jsx         # Green one-tap WhatsApp button
│   │   ├── InstallButton.jsx          # PWA install prompt button
│   │   ├── DayStyle.js                # Colour theme per weekday
│   │   └── Footer.jsx                 # Project credit + “Made with ❤️ by” link
│   ├── data/
│   │   ├── roster.js                  # ⭐ Members, duties, batch & project text
│   │   ├── donation.js                # Paid / unpaid donation lists
│   │   └── train.js                   # Shuttle times, route, contacts
│   ├── utils/
│   │   ├── search.js                  # Bangla/English-aware search & normalisation
│   │   └── whatsapp.js                # Message builder + wa.me link helper
│   ├── App.jsx                        # Navbar, tab state, search, layout
│   ├── main.jsx                       # Entry point, fonts, service worker
│   └── index.css                      # Tailwind layers, animations, print rules
├── index.html                         # Meta tags, favicons, PWA tags
├── vite.config.js                     # Vite + PWA manifest & Workbox config
├── tailwind.config.js                 # Fonts + brand colours (brsp.ink / green / red)
├── postcss.config.js
├── vercel.json                        # Headers & WhatsApp no-preview rule
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

## 🧭 Layout & Navigation

Page order, top to bottom:

1. **Header** — logo strip + hero + forms card
2. **Notice banner** — weekly holidays, Install button
3. **Sticky bar** — `Navbar` + `SearchBar` (search is hidden on the Shuttle Train tab)
4. **Main content** — the selected tab
5. **Footer**

Navigation items live in `NAV_ITEMS` at the top of `src/components/Navbar.jsx`:

```js
export const NAV_ITEMS = [
  { id: 'roster',   label: 'রোস্টার' },
  { id: 'students', label: 'শিক্ষার্থী তালিকা' },
  { id: 'donation', label: 'অনুদান' },
  { id: 'train',    label: '🚆 শাটল ট্রেন' },
];
```

- Below the `md` breakpoint (768 px) the links collapse into a **hamburger** button (`aria-expanded` / `aria-controls` set; closes on `Esc`, outside tap or after choosing an item).
- Choosing a tab while scrolled down jumps back to the top of the content, just under the sticky bar.
- Deep links: `/?tab=students`, `/?tab=donation`, `/?tab=train` open a tab directly (used by the PWA shortcuts).

---

## 🖼 Branding: Logos & App Icon

### Header logos
Logo files are in `src/assets/logos/` (transparent PNG). The list rendered in the header strip is `LOGOS` at the top of `src/components/Header.jsx` — add, remove or reorder logos there.

| File | Logo |
|---|---|
| `govt-bd.png` | Government of the People's Republic of Bangladesh |
| `brta.png` | Bangladesh Road Transport Authority (BRTA) — also used in the navbar |
| `brtc.png` | Bangladesh Road Transport Corporation (BRTC) |
| `world-bank.png` | The World Bank |

### PWA icon & favicon (BRTA logo)
Generated from the BRTA logo (a 960 × 960 transparent PNG):

| File | Size | Notes |
|---|---|---|
| `public/icons/icon-192.png` | 192 × 192 | `purpose: any`, white background |
| `public/icons/icon-512.png` | 512 × 512 | `purpose: any`, white background |
| `public/icons/maskable-512.png` | 512 × 512 | `purpose: maskable` — logo kept inside the safe zone (≈ 68 % of the canvas) |
| `public/icons/apple-touch-icon.png` | 180 × 180 | iOS home screen |
| `public/favicon-16/32/48.png`, `favicon.ico` | 16 / 32 / 48 | Browser tab icon |

To change the app icon later, replace these files (same names and sizes). The manifest `background_color` is white to match the icons.
> After changing icons, uninstall and re-install the PWA — operating systems cache installed app icons.

---

## 🗃 Managing the Data

### 1. Roster — `src/data/roster.js`

#### Global settings

```js
export const BATCH              = "BRSP Batch 2 – Morning";
export const INSTRUCTOR         = "রেজাউল স্যার";
export const INSTRUCTOR_PHONE   = "01711901564";
export const INSTRUCTOR_PHONE_DISPLAY = "০১৭১১-৯০১৫৬৪";
export const SITE_URL           = "https://brsp-car-wash.vercel.app/";
export const SITE_LINK_TEXT     = "brsp-car-wash.vercel.app";   // used in WhatsApp messages
export const EFFECTIVE_FROM     = "২৬ অক্টোবর ২০২৬";

// Header / footer text
export const PROJECT_NAME       = "বাংলাদেশ সড়ক নিরাপত্তা প্রকল্প (BRSP)";
export const COURSE_NAME        = "মোটরযান ড্রাইভিং ও বেসিক রক্ষণাবেক্ষণ প্রশিক্ষণ কোর্স";
export const CENTER_NAME        = "বিআরটিসি চট্টগ্রাম বাস ডিপো ও প্রশিক্ষণ কেন্দ্র";
export const ADMISSION_FORM_URL = "/BRTC_BRSP_Admission_Form.pdf";
export const MEDICAL_FORM_URL   = "/BRTC_Medical_Certificate_Form-2.pdf";

// Forms shown in the header card (view + download buttons for each)
export const FORMS = [
  { title: "ভর্তি আবেদন ফরম", desc: "...", url: ADMISSION_FORM_URL, filename: "BRTC_BRSP_Admission_Form.pdf" },
  { title: "মেডিকেল সার্টিফিকেট (ফরম-২)", desc: "...", url: MEDICAL_FORM_URL, filename: "BRTC_Medical_Certificate_Form-2.pdf" },
];
```

To add another downloadable form, drop the PDF into `public/` and add one more entry to `FORMS`.

#### Members

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

#### Duties

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

### 2. Donation — `src/data/donation.js`

```js
export const DONATION_TITLE  = "ফ্যান কেনার জন্য ৫০ টাকা অনুদান";
export const DONATION_AMOUNT = 50;

export const PAID   = [["মোঃ মশিউর রহমান", 111], /* ... */];   // [name, reg]
export const UNPAID = [["মোহাম্মদ ইয়াছবীর আহমদ", 87], /* ... */];
```

When someone pays, **move their `[name, reg]` line from `UNPAID` to `PAID`** — counts, amounts and the progress bar update automatically.

### 3. Shuttle train — `src/data/train.js`

- `TRAIN_SCHEDULE` — departure times as `[hour (24h), minute, sholoshahar?]` for `regular` (Sun–Thu) and `weekend` (Fri/Sat). A third value of `true` marks trains that start from / end at Sholoshahar instead of Botoli.
- `TRAIN_ROUTE` — stations and the minutes between them.
- `TRAIN_CONTACTS` — people to call for shuttle problems.
- Replace `public/train-schedule.png` to update the official image.

---

## 💬 How the WhatsApp Reminder Works

Click the green **মেসেজ** button next to any member and WhatsApp opens with a ready-made message to that person:

```text
আসসালামু আলাইকুম, সাইদুল ইসলাম 👋

🚗 *গাড়ি ধোয়ার ডিউটি – রিমাইন্ডার*

📅 *তারিখ:* ২৫ অক্টোবর ২০২৬ (রবিবার)
⏰ *সময়:* সকাল ৭:০০ টার মধ্যে উপস্থিত থাকুন
🏫 *ব্যাচ:* BRSP Batch 2 – Morning

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

> The instructor's name appears in the message signature even though it is no longer shown on every page.

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

The search bar sits under the navbar and filters the Roster, Student List and Donation tabs live.

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
- **Offline support** — Workbox precaches JS, CSS, HTML, fonts, icons and logos. PDFs and the large train-schedule image are not precached.
- **Manifest** — name, short name, theme colour `#0a3631`, white background, standalone display, BRTA-logo icons (any + maskable).
- **Shortcuts** — long-press the app icon for *রোস্টার*, *শিক্ষার্থী তালিকা* and *শাটল ট্রেন*.
- **Install button** — shown in the notice banner only when the browser fires `beforeinstallprompt` (Chrome, Edge, Android). On iOS, use **Share → Add to Home Screen**.

---

## 🎞 Animations

Defined in `src/index.css` — lightweight, CSS-only, no extra library.

| Class | Effect |
|---|---|
| `.anim-header` | Header slides down on load |
| `.anim-banner` | Notice banner fades in |
| `.anim-page` | Smooth fade when switching tabs (also used by the mobile menu) |
| `.anim-card` | Cards fade up with a **staggered delay**; lift slightly on hover |
| `.road-dash` | Static road-marking dash line under the hero |

Accessibility & print:
- `@media (prefers-reduced-motion: reduce)` disables all animation.
- `@media print` removes animation and transforms so printouts are crisp.

---

## 🖨 Printing & PDF Export

Press `Ctrl/Cmd + P`:

- Layout switches to **A4 landscape** with 10 mm margins.
- Navbar, search bar, notice-banner buttons, forms card and WhatsApp buttons are hidden (`.no-print`).
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
| Change project / course / centre text | `PROJECT_NAME`, `COURSE_NAME`, `CENTER_NAME` in `roster.js` |
| Replace the admission / medical form PDFs | `public/BRTC_BRSP_Admission_Form.pdf`, `public/BRTC_Medical_Certificate_Form-2.pdf` (keep the same names) |
| Add another downloadable form | PDF in `public/` + a new entry in `FORMS` (`roster.js`) |
| Change the footer credit / link | `src/components/Footer.jsx` |
| Add / remove / reorder header logos | `LOGOS` in `Header.jsx` + files in `src/assets/logos/` |
| Add or rename a navbar item | `NAV_ITEMS` in `Navbar.jsx` (and render the tab in `App.jsx`) |
| Move or remove the instructor card | `InstructorCard` usage in `App.jsx` |
| Change the holiday notice | `src/components/NoticeBanner.jsx` |
| Change the reminder message | `dutyMessage()` in `src/utils/whatsapp.js` |
| Update donations | `PAID` / `UNPAID` in `src/data/donation.js` |
| Update shuttle times / contacts | `src/data/train.js` |
| Change weekday colours | `src/components/DayStyle.js` |
| Change brand colours | `colors.brsp` in `tailwind.config.js` |
| Tweak or disable animations | `src/index.css` (`.anim-*` classes) |
| Replace app icons / favicon | `public/icons/` and `public/favicon*` |
| Change theme colour / app name | `manifest` block in `vite.config.js` and `<meta name="theme-color">` in `index.html` |

---

## 🩺 Troubleshooting

**The old version still shows after deploying.**
The PWA caches aggressively. Close and reopen the app (or hard-refresh); `autoUpdate` swaps in the new version on the next load.

**The installed app still shows the old icon.**
Installed PWAs keep their icon. Uninstall the app and install it again.

**"আজ / আগামীকাল" isn't showing in the message.**
Check the date format in `DUTIES` — it must use Bangla digits and Bangla month names (e.g. `২৫ অক্টোবর ২০২৬`).

**WhatsApp opens but the number is wrong.**
Numbers are converted to international format automatically (`01…` → `8801…`). Make sure the stored number has 11 digits starting with `01`.

**A name is missing in the roster.**
The ID used in `DUTIES` must exist in `MEMBERS`.

**The hamburger menu doesn't show on desktop.**
By design — it appears only below 768 px width; wider screens show the horizontal navbar.

**Install button doesn't appear.**
It only shows where the browser supports `beforeinstallprompt`, and only if the app isn't already installed. On iOS use *Share → Add to Home Screen*.

**Link preview still appears in WhatsApp.**
Redeploy so `vercel.json` takes effect, then dismiss any cached preview with ✕ before sending.

---

<div align="center">

Made with ❤️ for **BRSP Batch 2 – Morning** · BRTC Chattogram Bus Depot & Training Centre<br/>
Built by [Mohammad Hafizur Rahman Sakib](https://github.com/hafiz-sakib)

</div>
