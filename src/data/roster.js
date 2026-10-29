// ডিউটি রোস্টার ডেটা — এখানে এডিট করলেই পুরো অ্যাপে আপডেট হবে
// MEMBERS: সবার আইডি + পূর্ণ বাংলা নাম (১৮/১০/২৬ এর হাজিরা তালিকার ছবি অনুযায়ী — ১০০% যাচাইকৃত)
// alias: শুধু সার্চের জন্য (ইংরেজি বানানে নাম খুঁজলেও পাওয়া যাবে), স্ক্রিনে দেখানো হয় না
// DUTIES: প্রতিটি ডিউটিতে শুধু আইডি দিলেই হবে — নাম অটো বসে যাবে
// ব্যাচ ও ইনস্ট্রাক্টর
export const BATCH = "BRSP Batch 2 – Morning";
export const INSTRUCTOR = "রেজাউল স্যার";
export const INSTRUCTOR_PHONE = "01711901564";
export const INSTRUCTOR_PHONE_DISPLAY = "০১৭১১-৯০১৫৬৪";
export const SITE_URL = "https://brsp-car-wash.vercel.app/";
// মেসেজে স্কিম ছাড়া শুধু ডোমেইন যায় — WhatsApp এ লিংক ট্যাপ করা যায়, কিন্তু প্রিভিউ কার্ড আসে না
export const SITE_LINK_TEXT = "brsp-car-wash.vercel.app";
export const EFFECTIVE_FROM = "২৬ অক্টোবর ২০২৬";
// প্রকল্প পরিচিতি (হেডার ও ফুটারে দেখানো হয়)
export const PROJECT_NAME = "বাংলাদেশ সড়ক নিরাপত্তা প্রকল্প (BRSP)";
export const COURSE_NAME = "মোটরযান ড্রাইভিং ও বেসিক রক্ষণাবেক্ষণ প্রশিক্ষণ কোর্স";
export const CENTER_NAME = "বিআরটিসি চট্টগ্রাম বাস ডিপো ও প্রশিক্ষণ কেন্দ্র";
export const ADMISSION_FORM_URL = "/BRTC_BRSP_Admission_Form.pdf";
export const MEDICAL_FORM_URL = "/BRTC_Medical_Certificate_Form-2.pdf";
// হেডারের ফরম কার্ডে দেখানো ফরমের তালিকা — নতুন ফরম যোগ করতে এখানে একটি লাইন যোগ করুন
export const FORMS = [
  {
    title: "ভর্তি আবেদন ফরম",
    desc: "বিআরটিসি–বিআরএসপি প্রশিক্ষণ কোর্সে ভর্তির ফরম (PDF)",
    url: ADMISSION_FORM_URL,
    filename: "BRTC_BRSP_Admission_Form.pdf",
  },
  {
    title: "মেডিকেল সার্টিফিকেট (ফরম-২)",
    desc: "ড্রাইভিং লাইসেন্সের জন্য রেজিস্টার্ড ডাক্তারের মেডিকেল সার্টিফিকেট (PDF)",
    url: MEDICAL_FORM_URL,
    filename: "BRTC_Medical_Certificate_Form-2.pdf",
    note: "medical",
  },
];

export const MEMBERS = [
  {
    id: 72,
    name: "মোঃ তারিকুল ইসলাম",
    alias: "Tarikul Tariqul Islam Mohammad Md",
    father: "মোঃ নুরুল ইসলাম",
    bsp: "01577152448",
    bkash: "01577152448",
    whatsapp: "01577152448",
  },
  {
    id: 87,
    name: "মোহাম্মদ ইয়াছবীর আহমদ",
    alias: "Yasbir Yasbin Yasir Ahmed Ahmad",
    father: "মোঃ ইলিয়াছ",
    bsp: "01581921299",
    bkash: "01581921299",
    whatsapp: "01631058120",
  },
  {
    id: 88,
    name: "মোঃ ওসমান গনি",
    alias: "Osman Usman Gani Ghani",
    father: "মোঃ আবু তাহের",
    bsp: "01895651785",
    bkash: "01895651785",
    whatsapp: "01318874557",
  },
  {
    id: 92,
    name: "মোঃ আব্বাস উদ্দীন",
    alias: "Abbas Abbas Uddin",
    father: "মোঃ আবু",
    bsp: "01895651649",
    bkash: "01811534171",
    whatsapp: "01811534171",
  },
  {
    id: 93,
    name: "সোহেল ছাকিব",
    alias: "Sohel Shohel Sakib Shakib",
    father: "জি. এম. মনজুর মোর্শেদ",
    bsp: "01577221906",
    bkash: "01577221906",
    whatsapp: "01626965507",
  },
  {
    id: 98,
    name: "মোহাম্মদ মিশকাতুল ইসলাম",
    alias: "Mishkatul Mishkat Islam",
    father: "মোহাম্মদ রফিক আহমদ",
    bsp: "01771777355",
    bkash: "01771777355",
    whatsapp: "01771777355",
  },
  {
    id: 102,
    name: "তানজিলুল ইসলাম",
    alias: "Tanjil Tanzil Tanjilul Islam",
    father: "মনিরুল ইসলাম",
    bsp: "01791629339",
    bkash: "01791629339",
    whatsapp: "01815198037",
  },
  {
    id: 103,
    name: "শুভ্র রায়",
    alias: "Shuvro Ray Roy Subro Shubro Shuvra",
    father: "শংকর রায়",
    bsp: "01581921263",
    bkash: "01815670312",
    whatsapp: "01815670312",
  },
  {
    id: 104,
    name: "মোঃ হাফিজুর রহমান সাকিব",
    alias: "Hafiz Hafij Hafizur Hafijur Rahman সাকিব sakib Sakib",
    father: "আহমদ নুর",
    bsp: "01944601181",
    bkash: "01944601181",
    whatsapp: "01516195904",
  },
  {
    id: 108,
    name: "সাজিদুর রহমান",
    alias: "Sajidur Sajid Rahman",
    father: "কবির আহম্মদ",
    bsp: "01577831876",
    bkash: "01883261432",
    whatsapp: "01883261432",
  },
  {
    id: 111,
    name: "মোঃ মশিউর রহমান",
    alias: "Moshiur Mashiur Moshiur Rahman",
    father: "মোঃ মজিবর",
    bsp: "01975922891",
    bkash: "01975922891",
    whatsapp: "01975922891",
  },
  {
    id: 117,
    name: "নাজমুল আলম ইজবা",
    alias: "Nazmul Alam Ijba Ezba Ejba",
    father: "মোঃ ইব্রাহীম",
    bsp: "01577723403",
    bkash: "01577723403",
    whatsapp: "01745293213",
  },
  {
    id: 119,
    name: "আবু সাইদ মোঃ শাহেদ",
    alias: "Abu Saeed Said Sayed Shahed Shahid",
    father: "আবু তাহের",
    bsp: "01521921315",
    bkash: "01817794675",
    whatsapp: "01896316591",
  },
  {
    id: 120,
    name: "সাইদুল ইসলাম",
    alias: "Saidul Saiful Islam",
    father: "মোহাম্মদ সোলায়মান",
    bsp: "01742215601",
    bkash: "01742215601",
    whatsapp: "01742215601",
  },
  {
    id: 123,
    name: "মোঃ সাকিব আলম",
    alias: "Sakib Shakib Alam",
    father: "মোঃ শাহ আলম",
    bsp: "01878379623",
    bkash: "01878379623",
    whatsapp: "01878379623",
  },
  {
    id: 124,
    name: "মোঃ আসাদুল ইসলাম",
    alias: "Asadul Asaduzzaman Islam",
    father: "মোঃ সিরাজুল ইসলাম",
    bsp: "01837718513",
    bkash: "01837718513",
    whatsapp: "01837718513",
  },
  {
    id: 130,
    name: "জিহাদ হোসেন",
    alias: "Jihad Zihad Hossain Hosen Hussain",
    father: "নুর নবি",
    bsp: "01623184922",
    bkash: "01623184922",
    whatsapp: "01623184922",
  },
  {
    id: 140,
    name: "ওমর ফারুক তাফহীম",
    alias: "Omar Umar Faruk Faruque Tafhim Tahfim",
    father: "নুরুল আক্তার",
    bsp: "01577831781",
    bkash: "01886692394",
    whatsapp: "01610965833",
  },
  {
    id: 153,
    name: "রাজি আল হাবিব",
    alias: "Razi Raji Al Habib",
    father: "হাবিবুল আনোয়ার",
    bsp: "01894985926",
    bkash: "01606704797",
    whatsapp: "01814195751",
  },
  {
    id: 155,
    name: "মোঃ দিদারুল আলম",
    alias: "Didarul Didar Alam",
    father: "মোঃ খলিলুর রহমান",
    bsp: "01813950510",
    bkash: "01813950510",
    whatsapp: "01813950510",
  },
  {
    id: 167,
    name: "মোঃ আরিফুল ইসলাম",
    alias: "Ariful Arif Islam",
    father: "নুর মোহাম্মদ",
    bsp: "01581921319",
    bkash: "01960382642",
    whatsapp: "01322260295",
  },
  {
    id: 173,
    name: "প্রান্ত কুমার নাথ",
    alias: "Prantha Pranta Prantho Kumar Nath",
    father: "সমীর কুমার নাথ",
    bsp: "01516529839",
    bkash: "01516529839",
    whatsapp: "01312355764",
  },
  {
    id: 177,
    name: "মোঃ শামছুদ্দিন ইসলাম অপু",
    alias: "Shamsuddin Shamsuddin Shamsud-din Islam Opu Apu",
    father: "মোঃ সহীদুল ইসলাম",
    bsp: "01704351221",
    bkash: "01704351221",
    whatsapp: "01704351221",
  },
  {
    id: 180,
    name: "মোহাম্মদ আজিজুল হাকিম মেহেরাজ",
    alias: "Azizul Aziz Hakim Mehraz Mehraj Meheraj",
    father: "আবদুল হাসিম",
    bsp: "01581921262",
    bkash: "01581921262",
    whatsapp: "01752414237",
  },
  {
    id: 581,
    name: "মোঃ আনিছুর রহমান",
    alias: "Anisur Anis Rahman Mohammad Md",
    father: "মোঃ আনোয়ার পাশা",
    bsp: "01606111153",
    bkash: "01408810499",
    whatsapp: "01606111153",
  },
];

const BN = (n) => String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

// প্রতিটি লাইন = একটি ডিউটি দিন: [তারিখ, বার, সদস্যদের আইডি]
const DUTIES = [
  ["২৬ অক্টোবর ২০২৬", "সোমবার", [120, 108, 111]],
  ["২৮ অক্টোবর ২০২৬", "বুধবার", [88, 124, 173]],
  ["২৯ অক্টোবর ২০২৬", "বৃহস্পতিবার", [117, 153, 180]],
  ["১ নভেম্বর ২০২৬", "রবিবার", [123, 93, 130, 167]],
  ["২ নভেম্বর ২০২৬", "সোমবার", [98, 140, 119]],
  ["৪ নভেম্বর ২০২৬", "বুধবার", [102, 103, 104]],
  ["৫ নভেম্বর ২০২৬", "বৃহস্পতিবার", [72, 88, 177]],
  ["৮ নভেম্বর ২০২৬", "রবিবার", [102, 103, 104]],
  ["৯ নভেম্বর ২০২৬", "সোমবার", [153, 173, 581]],
  ["১১ নভেম্বর ২০২৬", "বুধবার", [93, 180, 140]],
  ["১২ নভেম্বর ২০২৬", "বৃহস্পতিবার", [124, 130, 119, 117]],
  ["১৫ নভেম্বর ২০২৬", "রবিবার", [87, 92, 155]],
];

const BY_ID = Object.fromEntries(MEMBERS.map((m) => [m.id, m]));

// শিক্ষার্থী তালিকা (ছবির তালিকা অনুযায়ী)
export const STUDENTS = MEMBERS.map((m, i) => ({
  no: BN(i + 1),
  reg: BN(m.id),
  name: m.name,
  alias: m.alias,
  father: m.father,
  bsp: m.bsp,
  bkash: m.bkash,
  whatsapp: m.whatsapp,
}));

export const ROSTER = DUTIES.map(([date, day, ids], i) => ({
  no: BN(i + 1),
  date,
  day,
  members: ids.map((id) => ({
    id: BN(id),
    name: BY_ID[id].name,
    alias: BY_ID[id].alias,
    whatsapp: BY_ID[id].whatsapp,
  })),
}));
