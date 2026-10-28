// চবি শাটল ট্রেনের সময়সূচি (সূত্র: চাকসু) — সময় বদলালে শুধু এই ফাইল এডিট করুন
// ফরম্যাট: [ঘণ্টা (২৪-ঘণ্টা), মিনিট, "ষোলশহর" হলে true]
// ষোলশহর চিহ্নের অর্থ:
//   toCampus (বটতলী স্টেশন → ক্যাম্পাস): ট্রেনটি বটতলী/নিউমার্কেট থেকে ছাড়বে না, ষোলশহর থেকে ছাড়বে
//   toCity (ক্যাম্পাস → বটতলী স্টেশন): ট্রেনটি বটতলী/নিউমার্কেট পর্যন্ত যাবে না, ষোলশহর পর্যন্ত যাবে
export const TRAIN_TITLE = 'চট্টগ্রাম বিশ্ববিদ্যালয় শাটল ট্রেনের সময়সূচি';
export const TRAIN_JOURNEY_NOTE =
  'প্রতিটি ট্রেন বিশ্ববিদ্যালয় থেকে চট্টগ্রাম রেলস্টেশন (বটতলী) এবং রেলস্টেশন থেকে বিশ্ববিদ্যালয়ে পৌঁছাতে আনুমানিক ১ (এক) ঘণ্টা সময় লাগে।';

export const TRAIN_SCHEDULE = {
  // রবি – বৃহস্পতিবার (সাধারণ দিন)
  regular: {
    label: 'সাধারণ দিন',
    toCampus: [
      [7, 15], [7, 40], [9, 30, true], [10, 15, true], [11, 30, true],
      [14, 30], [15, 30], [17, 0], [20, 30],
    ],
    toCity: [
      [8, 40, true], [9, 5, true], [10, 30, true], [13, 0], [14, 0],
      [15, 35], [16, 40], [18, 20], [21, 45],
    ],
  },
  // শুক্রবার ও শনিবার
  weekend: {
    label: 'শুক্র ও শনিবার',
    toCampus: [[7, 40], [15, 30], [20, 30]],
    toCity: [[9, 5], [16, 40], [21, 45]],
  },
};

export const TRAIN_IMAGE = '/train-schedule.png';
export const TRAIN_IMAGE_FILENAME = 'CU-Shuttle-Train-Schedule.png';

export const TRAIN_CONTACTS = [
  {
    name: 'ড. মো. কামরুল হোসেন',
    role: 'সহকারী প্রক্টর, চবি',
    phone: '01817713814',
    display: '০১৮১৭-৭১৩৮১৪',
  },
  {
    name: 'ওবাইদুল সালমান',
    role: 'সহ যোগাযোগ ও আবাসন বিষয়ক সম্পাদক, চাকসু',
    phone: '01822157296',
    display: '০১৮২২-১৫৭২৯৬',
  },
];

// ---- হেল্পার ----
const BN = '০১২৩৪৫৬৭৮৯';
export const bn = (n) => String(n).replace(/\d/g, (d) => BN[d]);

export function periodOf(h) {
  if (h < 12) return 'সকাল';
  if (h < 16) return 'দুপুর';
  if (h < 18) return 'বিকাল';
  if (h < 19) return 'সন্ধ্যা';
  return 'রাত';
}

export function formatTime(h, m) {
  const h12 = h % 12 || 12;
  return `${bn(String(h12).padStart(2, '0'))}:${bn(String(m).padStart(2, '0'))}`;
}

// আজ শুক্র(5) বা শনি(6) হলে weekend
export const todayKey = (d = new Date()) => ([5, 6].includes(d.getDay()) ? 'weekend' : 'regular');

// সেকেন্ডসহ কাউন্টডাউন — যেমন "আর ২ ঘণ্টা ১৬ মিনিট ৩০ সেকেন্ড"
export function durationText(totalSec) {
  if (totalSec < 1) return 'এখনই';
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts = [];
  if (h > 0) parts.push(`${bn(h)} ঘণ্টা`);
  if (h > 0 || m > 0) parts.push(`${bn(m)} মিনিট`);
  parts.push(`${bn(s)} সেকেন্ড`);
  return `আর ${parts.join(' ')}`;
}

// ষোলশহর চিহ্নিত ট্রেনের ছোট লেবেল (দিক অনুযায়ী)
export const SHOLOSHAHAR_LABEL = {
  toCampus: 'ষোলশহর থেকে ছাড়বে', // বটতলী/নিউমার্কেট থেকে ছাড়বে না
  toCity: 'ষোলশহর পর্যন্ত যাবে', // বটতলী/নিউমার্কেট পর্যন্ত যাবে না
};

// বর্তমান সময়ের জন্য (রাত/ভোর সহ) সময়ের অংশ
export function clockPeriod(h) {
  if (h < 4) return 'রাত';
  if (h < 6) return 'ভোর';
  if (h < 12) return 'সকাল';
  if (h < 16) return 'দুপুর';
  if (h < 18) return 'বিকাল';
  if (h < 19) return 'সন্ধ্যা';
  return 'রাত';
}

// "০৮:২৯:৩৫"
export function formatClock(d) {
  const h12 = d.getHours() % 12 || 12;
  const two = (n) => bn(String(n).padStart(2, '0'));
  return `${two(h12)}:${two(d.getMinutes())}:${two(d.getSeconds())}`;
}

export const WEEKDAYS_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];


// ---- ট্রেনের বিস্তারিত (রুট ও স্টেশনভিত্তিক সময়) ----
// gap = আগের স্টেশন থেকে এই স্টেশনে পৌঁছাতে সময় (মিনিট)। সময় বদলালে শুধু এখানে এডিট করুন।
// বটতলী → ষোলশহর ২০ + ষোলশহর → ক্যান্টনমেন্ট ১৫ + ক্যান্টনমেন্ট → চৌধুরীহাট ১০ + চৌধুরীহাট → ক্যাম্পাস ১৫ = ৬০ মিনিট (১ ঘণ্টা)
// ফেরার পথে (ক্যাম্পাস → নিউমার্কেট) একই সময়, উল্টো ক্রমে।
export const STATION_TERMINAL = 'বটতলী (নিউমার্কেট)';
export const TRAIN_ROUTE = {
  toCampus: [
    { name: STATION_TERMINAL, gap: 0 },
    { name: 'ষোলশহর', gap: 20 },
    { name: 'ক্যান্টনমেন্ট', gap: 15 },
    { name: 'চৌধুরীহাট', gap: 10 },
    { name: 'ক্যাম্পাস', gap: 15 },
  ],
  toCity: [
    { name: 'ক্যাম্পাস', gap: 0 },
    { name: 'চৌধুরীহাট', gap: 15 },
    { name: 'ক্যান্টনমেন্ট', gap: 10 },
    { name: 'ষোলশহর', gap: 15 },
    { name: STATION_TERMINAL, gap: 20 },
  ],
};

// ষোলশহর চিহ্নিত ট্রেন:
//   toCampus → ষোলশহর (২য় স্টেশন) থেকে ছাড়ে, বটতলী যায় না
//   toCity   → ষোলশহর (৪র্থ স্টেশন) পর্যন্ত যায়, বটতলী/নিউমার্কেট যায় না
// t = [ঘণ্টা, মিনিট, ষোলশহর?] — t-এর সময় হলো ট্রেনের প্রথম স্টেশন থেকে ছাড়ার সময়
export function buildStops(dir, t) {
  const route = TRAIN_ROUTE[dir];
  const from = dir === 'toCampus' && t[2] ? 1 : 0;
  const to = dir === 'toCity' && t[2] ? 3 : route.length - 1;
  let clock = t[0] * 60 + t[1];
  const stops = [];
  for (let i = from; i <= to; i++) {
    if (i > from) clock += route[i].gap;
    stops.push({
      name: route[i].name,
      h: Math.floor(clock / 60),
      m: clock % 60,
      gap: i > from ? route[i].gap : 0,
    });
  }
  return { stops, total: clock - (t[0] * 60 + t[1]) };
}

// মিনিট → "২০ মিনিট" / "১ ঘণ্টা" / "১ ঘণ্টা ১০ মিনিট"
export function minutesText(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const parts = [];
  if (h > 0) parts.push(`${bn(h)} ঘণ্টা`);
  if (m > 0) parts.push(`${bn(m)} মিনিট`);
  return parts.join(' ');
}
