import { ROSTER, BATCH, INSTRUCTOR, SITE_LINK_TEXT } from "../data/roster.js";
import { normalize } from "./search.js";

const MONTHS = {
  জানুয়ারি: 0,
  ফেব্রুয়ারি: 1,
  মার্চ: 2,
  এপ্রিল: 3,
  মে: 4,
  জুন: 5,
  জুলাই: 6,
  আগস্ট: 7,
  সেপ্টেম্বর: 8,
  অক্টোবর: 9,
  নভেম্বর: 10,
  ডিসেম্বর: 11,
};

// "১৪ অক্টোবর ২০২৬" → UTC-মিডনাইট টাইমস্ট্যাম্প (শুধু তারিখ তুলনার জন্য)
function dateKey(bnDate) {
  const [d, m, y] = normalize(bnDate).split(" ");
  return Date.UTC(Number(y), MONTHS[m], Number(d));
}

// আজকের তারিখ (বাংলাদেশ সময়, UTC+6) — একই পদ্ধতিতে
function todayKey() {
  const t = new Date(Date.now() + 6 * 3600 * 1000);
  return Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
}

const DAY_MS = 24 * 3600 * 1000;

// ০১৭১২৩৪৫৬৭৮ → 8801712345678 (wa.me ফরম্যাট)
export function waNumber(n) {
  const digits = String(n).replace(/\D/g, "");
  if (digits.startsWith("880")) return digits;
  return "880" + digits.replace(/^0/, "");
}

export function waLink(number, message) {
  return `https://wa.me/${waNumber(number)}?text=${encodeURIComponent(message)}`;
}

function when(row) {
  const diff = Math.round((dateKey(row.date) - todayKey()) / DAY_MS);
  if (diff === 1) return "আগামীকাল";
  if (diff === 0) return "আজ";
  return null;
}

// রোস্টারের কার্ড থেকে: ওই কার্ডের তারিখই বার্তায় যাবে (WhatsApp ফরম্যাটিং: *বোল্ড*)
export function dutyMessage(name, row, selfId) {
  const w = when(row);
  const dateLine = w ? `${w}, ${row.date} (${row.day})` : `${row.date} (${row.day})`;
  const mates = row.members.filter((m) => m.id !== selfId);
  const teamBlock = mates.length
    ? `\n👥 *আপনার সাথে থাকছেন:*\n${mates.map((m) => `• ${m.id} – ${m.name}\n   📱 ${m.whatsapp}`).join("\n")}\n`
    : "";

  return (
    `আসসালামু আলাইকুম, ${name} 👋\n\n` +
    `🚗 *গাড়ি ধোয়ার ডিউটি – রিমাইন্ডার*\n\n` +
    `📅 *তারিখ:* ${dateLine}\n` +
    `⏰ *সময়:* সকাল ৭:০০ টার মধ্যে উপস্থিত থাকুন\n` +
    `🏫 *ব্যাচ:* ${BATCH}\n` +
    teamBlock +
    `\n📋 পূর্ণ রোস্টার দেখুন:\n${SITE_LINK_TEXT}\n\n` +
    `ধন্যবাদ 🙏\n` +
    `— ইনস্ট্রাক্টর ${INSTRUCTOR}`
  );
}

// শিক্ষার্থী তালিকা থেকে: তার পরবর্তী (আজ বা আগামীকাল সহ) ডিউটির তারিখ
export function studentMessage(student) {
  const today = todayKey();
  const next = ROSTER.filter(
    (r) =>
      r.members.some((m) => m.id === student.reg) && dateKey(r.date) >= today,
  ).sort((a, b) => dateKey(a.date) - dateKey(b.date))[0];

  if (!next) {
    return (
      `আসসালামু আলাইকুম, ${student.name} 👋\n\n` +
      `🚗 *গাড়ি ধোয়ার রোস্টার*\n` +
      `🏫 ${BATCH}\n\n` +
      `📋 পূর্ণ রোস্টার দেখুন:\n${SITE_LINK_TEXT}\n\n` +
      `ধন্যবাদ 🙏\n` +
      `— ইনস্ট্রাক্টর ${INSTRUCTOR}`
    );
  }
  return dutyMessage(student.name, next, student.reg);
}
