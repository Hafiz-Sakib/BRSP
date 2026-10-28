// চবি শাটল ট্রেনের সময়সূচি (সূত্র: চাকসু) — সময় বদলালে শুধু এই ফাইল এডিট করুন
// ফরম্যাট: [ঘণ্টা (২৪-ঘণ্টা), মিনিট, "ষোলশহর" হলে true]
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

export function durationText(mins) {
  if (mins < 1) return 'এখনই';
  if (mins < 60) return `আর ${bn(mins)} মিনিট`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `আর ${bn(h)} ঘণ্টা ${bn(m)} মিনিট` : `আর ${bn(h)} ঘণ্টা`;
}
