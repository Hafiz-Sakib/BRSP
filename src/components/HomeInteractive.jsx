import { useEffect, useMemo, useRef, useState } from 'react';

// হোম পেজের দুটি ইন্টারঅ্যাক্টিভ সেকশন: ১) পার্কিং অ্যানিমেশন  ২) পার্কিং কুইজ
// সব তথ্য "ড্রাইভিং প্র্যাকটিক্যাল: খুঁটি বসানোর নকশা" PDF থেকে নেওয়া (public/study/Parking_Khuti_Design.pdf)

const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

/* ------------------------------------------------------------------ */
/*  ছোট ড্রয়িং অংশ                                                      */
/* ------------------------------------------------------------------ */

// গাড়ি আঁকা হয় সামনে উপরের দিকে (heading 0) ধরে; h = ডিগ্রি (0=উত্তর, 90=পূর্ব, 180=দক্ষিণ, 270=পশ্চিম)
function Car({ x, y, h, s = 1, kind = 'me', brake = false, ghost = false }) {
  const palette = kind === 'parked' ? { body: '#f28b8b', stroke: '#c0392b', glass: '#fbd0d0' } : { body: '#7db4f5', stroke: '#1d5fbf', glass: '#d9ebff' };
  return (
    <g transform={`translate(${x} ${y}) rotate(${h}) scale(${s})`}>
      <rect
        x="-14.5"
        y="-34.5"
        width="29"
        height="69"
        rx="9"
        fill={ghost ? 'rgba(59,130,246,0.06)' : palette.body}
        stroke={ghost ? '#3b82f6' : palette.stroke}
        strokeWidth={ghost ? 1.8 : 2}
        strokeDasharray={ghost ? '5 4' : undefined}
      />
      {!ghost && (
        <>
          <rect x="-11" y="-17" width="22" height="10" rx="3" fill={palette.glass} />
          <rect x="-10" y="12" width="20" height="8" rx="3" fill={palette.glass} />
          <rect x="-12" y="-34" width="6" height="3" rx="1.5" fill="#fde68a" />
          <rect x="6" y="-34" width="6" height="3" rx="1.5" fill="#fde68a" />
          <rect x="-13" y="31" width="7" height="3.5" rx="1.5" fill={brake ? '#ef0000' : '#b91c1c'} />
          <rect x="6" y="31" width="7" height="3.5" rx="1.5" fill={brake ? '#ef0000' : '#b91c1c'} />
          {brake && <rect x="-16" y="35" width="32" height="5" rx="2.5" fill="#ef4444" opacity="0.35" />}
        </>
      )}
    </g>
  );
}

function Cone({ x, y, l }) {
  return (
    <g>
      <circle cx={x} cy={y} r="9" fill="#d9622b" stroke="#fff" strokeWidth="2" />
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="700" fill="#fff">
        {l}
      </text>
    </g>
  );
}

const T = ({ x, y, children, size = 11, anchor = 'middle', fill = '#475569', weight = 600 }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={fill}>
    {children}
  </text>
);

const ROAD = '#dcdcd2';
const GROUND = '#f3f3ec';
const EDGE = '#8a8a80';
const bayStyle = { fill: 'rgba(255,255,255,0.55)', stroke: '#9ca3af', strokeWidth: 1.5, strokeDasharray: '5 4' };

/* ------------------------------------------------------------------ */
/*  সিন তৈরির হেল্পার                                                    */
/* ------------------------------------------------------------------ */

// K = কীফ্রেম: x,y = গাড়ির কেন্দ্র; h = দিক; s = যে ধাপ চলাকালীন (এই কীফ্রেম থেকে পরের কীফ্রেম পর্যন্ত);
// hold = ms থামা; hs = থেমে থাকার সময়ের ধাপ; b = ব্রেক লাইট
const K = (x, y, h, o = {}) => ({ x, y, h, ...o });

// পারপেন্ডিকুলার পার্কিংয়ের বাঁক (ছোট ছোট কীফ্রেমে)
const perpArc = (() => {
  const R = 70;
  const cx = 170;
  const cy = 148;
  const pts = [];
  for (let a = 0; a <= 90; a += 15) {
    const r = (a * Math.PI) / 180;
    pts.push(K(cx + R * Math.sin(r), cy + R * Math.cos(r), 90 - a, { s: a < 60 ? 1 : 2 }));
  }
  return pts;
})();

const SCENES = [
  /* 1 ─ প্যারালাল ─────────────────────────────────────────────── */
  {
    id: 'parallel',
    n: 1,
    bn: 'সমান্তরাল পার্কিং',
    en: 'Parallel Parking',
    intro: 'রাস্তার পাশে দুটি গাড়ির মাঝখানে রিভার্স করে গাড়ি পার্ক করা।',
    steps: [
      'গাড়ি বে-র সামনে B খুঁটির পাশে ০.৫–১ মি ফাঁক রেখে সমান্তরালে থামান।',
      'রিভার্স গিয়ারে দিন। স্টিয়ারিং কার্বের দিকে পুরো ঘুরিয়ে ধীরে পেছনে যান।',
      'গাড়ি প্রায় ৪৫° কোণে ঢুকলে স্টিয়ারিং সোজা করুন।',
      'পেছনের অংশ ঢুকলে স্টিয়ারিং উল্টো দিকে ঘুরিয়ে গাড়ি সোজা করুন।',
      'কার্ব থেকে ২০–৩০ সেমি দূরে, A–B ও C–D লাইনের মাঝে থামুন।',
    ],
    measure: ['বে: ৬.৫ মি লম্বা × ২.৫ মি চওড়া', '(গাড়ির দৈর্ঘ্যের ১.৫ গুণ)'],
    cones: [['A, B', 'বে-র রাস্তার দিকের দুই কোণ'], ['C, D', 'কার্বের পাশের দুই কোণ']],
    avoid: ['খুঁটি ছুঁয়ে ফেলা বা ফেলে দেওয়া', 'কার্বে চাকা লাগানো বা বেশি দূরে থামা', 'সামনে-পেছনের লাল (পার্ক করা) গাড়িতে লাগা'],
    parked: [[161.5, 200, 270], [334.5, 200, 270]],
    cone: [['A', 196, 180], ['B', 300, 180], ['C', 196, 220], ['D', 300, 220]],
    ghosts: [[248, 202, 270]],
    kfs: [
      K(530, 150, 270, { s: 0 }),
      K(161.5, 150, 270, { s: 1, hs: 0, hold: 900, b: 1 }),
      K(188, 156, 290, { s: 1 }),
      K(244, 172, 312, { s: 2, hs: 2, hold: 700 }),
      K(240, 194, 295, { s: 3 }),
      K(248, 202, 270, { s: 4, hs: 4, hold: 1200, b: 1 }),
    ],
    bg: () => (
      <>
        <rect width="480" height="300" fill={GROUND} />
        <rect y="20" width="480" height="200" fill={ROAD} />
        <rect x="196" y="180" width="104" height="40" {...bayStyle} />
        <line x1="0" y1="220" x2="480" y2="220" stroke={EDGE} strokeWidth="3" />
        <T x="440" y="52" size="13" anchor="end">রাস্তা</T>
        <T x="248" y="168">৬.৫ মি</T>
        <T x="248" y="244">২.৫ মি</T>
        <T x="440" y="262" size="13" anchor="end">কার্ব / ফুটপাত</T>
      </>
    ),
  },
  /* 2 ─ রিভার্স / বে ───────────────────────────────────────────── */
  {
    id: 'bay',
    n: 2,
    bn: 'রিভার্স / বে পার্কিং',
    en: 'Reverse / Bay Parking',
    intro: 'নির্দিষ্ট দাগের মধ্যে পেছন দিক দিয়ে গাড়ি ঢুকিয়ে পার্ক করা।',
    steps: [
      'রাস্তা ঘেঁষে বে-র পাশ দিয়ে এগিয়ে গাড়ি থামান।',
      'রিভার্স গিয়ারে দিন। দুই মিরর ও পেছনের কাচে খুঁটি দেখে ধীরে চলুন।',
      'C বা D খুঁটি পাশ বরাবর এলে স্টিয়ারিং বে-র দিকে পুরো ঘোরান।',
      'গাড়ি বে-র সোজাসুজি হলে স্টিয়ারিং সোজা করুন।',
      'দুই পাশে সমান ফাঁক রেখে A–B লাইনের ১ মি আগে থামুন।',
    ],
    measure: ['বে: ৩ মি চওড়া × ৫.৫ মি গভীর', 'রাস্তা ও বে-র মাঝে ঘোরার জায়গা থাকতে হবে'],
    cones: [['A, B', 'বে-র পেছনের দুই কোণ'], ['C, D', 'বে-র প্রবেশমুখের দুই কোণ']],
    avoid: ['এক পাশে বেশি ঘেঁষে যাওয়া', 'স্টিয়ারিং সোজা করতে দেরি করা', 'দুই পাশের লাল (পার্ক করা) গাড়িতে লাগা'],
    parked: [[192, 114, 0], [288, 114, 0]],
    cone: [['A', 216, 70], ['B', 264, 70], ['C', 216, 158], ['D', 264, 158]],
    ghosts: [[240, 120, 180]],
    kfs: [
      K(-50, 200, 90, { s: 0 }),
      K(352, 200, 90, { s: 1, hs: 0, hold: 900, b: 1 }),
      K(298, 200, 90, { s: 2 }),
      K(278, 200, 118, { s: 2 }),
      K(262, 188, 146, { s: 2 }),
      K(250, 168, 164, { s: 3 }),
      K(243, 146, 175, { s: 3 }),
      K(240, 120, 180, { s: 4, hs: 4, hold: 1200, b: 1 }),
    ],
    bg: () => (
      <>
        <rect width="480" height="300" fill={GROUND} />
        <rect y="158" width="480" height="112" fill={ROAD} />
        <rect x="216" y="70" width="48" height="88" {...bayStyle} />
        <rect x="168" y="70" width="48" height="88" {...bayStyle} />
        <rect x="264" y="70" width="48" height="88" {...bayStyle} />
        <line x1="0" y1="158" x2="480" y2="158" stroke={EDGE} strokeWidth="2" />
        <T x="240" y="54">৩ মি</T>
        <T x="132" y="118">৫.৫ মি</T>
        <T x="440" y="250" size="13" anchor="end">রাস্তা</T>
      </>
    ),
  },
  /* 3 ─ ৯০° পারপেন্ডিকুলার ────────────────────────────────────── */
  {
    id: 'perpendicular',
    n: 3,
    bn: '৯০° পারপেন্ডিকুলার পার্কিং',
    en: 'Perpendicular Parking',
    intro: 'পার্কিংয়ের ঘরে গাড়ি সোজা করে ঢোকানো এবং সঠিকভাবে বের করা।',
    steps: [
      'বে থেকে দূরের পাশ ধরে ধীরে এগোন।',
      'E খুঁটি আপনার পাশ বরাবর এলে স্টিয়ারিং বে-র দিকে ঘোরানো শুরু করুন।',
      'C ও D-এর ঠিক মাঝ দিয়ে সামনের অংশ ঢোকান।',
      'গাড়ি সোজা হলে স্টিয়ারিং সোজা করে A–B লাইনের ১ মি আগে থামুন।',
      'বের হওয়ার সময় চারপাশ দেখে রিভার্স করে ধীরে বেরোন।',
    ],
    measure: ['বে: ৩ মি চওড়া × ৫.৫ মি গভীর', 'E খুঁটি: প্রবেশমুখের লাইনের বাইরে ≈ ২ মি দূরে'],
    cones: [['A, B', 'বে-র পেছনের দুই কোণ'], ['C, D', 'বে-র প্রবেশমুখের দুই কোণ'], ['E', 'টার্ন শুরুর রেফারেন্স খুঁটি']],
    avoid: ['খুব তাড়াতাড়ি বা দেরিতে ঘোরানো', 'C বা D খুঁটিতে লাগা', 'পাশের লাল (পার্ক করা) গাড়িতে লাগা'],
    parked: [[192, 114, 0], [288, 114, 0]],
    cone: [['A', 216, 70], ['B', 264, 70], ['C', 216, 158], ['D', 264, 158], ['E', 166, 190]],
    ghosts: [[240, 120, 0]],
    kfs: [
      K(-50, 218, 90, { s: 0 }),
      K(170, 218, 90, { s: 1, hs: 1, hold: 700, b: 0 }),
      ...perpArc.slice(1),
      K(240, 120, 0, { s: 3, hs: 3, hold: 1300, b: 1 }),
      K(240, 148, 0, { s: 4 }),
      ...[...perpArc].reverse().slice(1).map((k) => ({ ...k, s: 4 })),
      K(120, 218, 90, { s: 4, hs: 4, hold: 700 }),
    ],
    bg: () => (
      <>
        <rect width="480" height="300" fill={GROUND} />
        <rect y="158" width="480" height="112" fill={ROAD} />
        <rect x="216" y="70" width="48" height="88" {...bayStyle} />
        <rect x="168" y="70" width="48" height="88" {...bayStyle} />
        <rect x="264" y="70" width="48" height="88" {...bayStyle} />
        <line x1="0" y1="158" x2="480" y2="158" stroke={EDGE} strokeWidth="2" />
        <T x="240" y="54">৩ মি</T>
        <T x="132" y="118">৫.৫ মি</T>
        <T x="166" y="210" size="10">টার্ন শুরু</T>
        <T x="440" y="256" size="13" anchor="end">রাস্তা</T>
      </>
    ),
  },
  /* 4 ─ কোণাকুণি ──────────────────────────────────────────────── */
  {
    id: 'angle',
    n: 4,
    bn: 'কোণাকুণি পার্কিং',
    en: 'Angle Parking',
    intro: 'তির্যক (৪৫°) দাগের মধ্যে গাড়ি ঢোকানো ও বের করা। শপিং মল ও পার্কিং এলাকায় কাজে লাগে।',
    steps: [
      'রাস্তা ঘেঁষে ধীরে এগোন। A খুঁটি পাশ বরাবর এলে থামার জন্য তৈরি হোন।',
      'স্টিয়ারিং দাগের দিকে ঘুরিয়ে সামনের অংশ A–B-এর মাঝ দিয়ে ঢোকান।',
      'গাড়ি দাগের সমান্তরাল হলে স্টিয়ারিং সোজা করুন।',
      'C–D লাইনের ১ মি আগে থামুন, দুই পাশে সমান ফাঁক রাখুন।',
    ],
    measure: ['দাগ: ৩ মি চওড়া × ৫.৫ মি লম্বা', 'কোণ: রাস্তার সাথে ৪৫°'],
    cones: [['A, B', 'প্রবেশমুখের দুই কোণ (রাস্তার লাইনে)'], ['C, D', 'পেছনের দুই কোণ']],
    avoid: ['বেশি তীক্ষ্ণ কোণে ঢোকা', 'গাড়ি দাগের এক পাশে হেলে থাকা', 'পাশের লাল (পার্ক করা) গাড়িতে লাগা'],
    parked: [[192.3, 143.7, 45], [328.3, 143.7, 45]],
    cone: [['A', 200, 170], ['B', 268, 170], ['D', 262, 108], ['C', 330, 108]],
    ghosts: [[260.3, 143.7, 45]],
    kfs: [
      K(-50, 214, 90, { s: 0 }),
      K(176, 214, 90, { s: 1, hs: 0, hold: 800, b: 1 }),
      K(200, 210, 82, { s: 1 }),
      K(214, 195, 62, { s: 1 }),
      K(233, 173, 50, { s: 2, hs: 2, hold: 500 }),
      K(260.3, 143.7, 45, { s: 3, hs: 3, hold: 1300, b: 1 }),
    ],
    bg: () => (
      <>
        <rect width="480" height="300" fill={GROUND} />
        <rect y="170" width="480" height="100" fill={ROAD} />
        {[132, 200, 268].map((x) => (
          <polygon key={x} points={`${x},170 ${x + 68},170 ${x + 130},108 ${x + 62},108`} {...bayStyle} />
        ))}
        <line x1="0" y1="170" x2="480" y2="170" stroke={EDGE} strokeWidth="2" />
        <T x="300" y="94">৫.৫ মি</T>
        <T x="292" y="196">৪৫°</T>
        <T x="440" y="256" size="13" anchor="end">রাস্তা</T>
      </>
    ),
  },
  /* 5 ─ সোজা রিভার্স ───────────────────────────────────────────── */
  {
    id: 'straight',
    n: 5,
    bn: 'সোজা রিভার্স',
    en: 'Straight Reverse',
    intro: 'স্টিয়ারিং নিয়ন্ত্রণ করে গাড়িকে সোজা পেছনে নেওয়া এবং নির্দিষ্ট জায়গায় থামানো।',
    steps: [
      'গাড়ি দুই সারির ঠিক মাঝখানে সোজা করে রাখুন।',
      'রিভার্স গিয়ারে দিন। মিররে দুই পাশের খুঁটি সমান দূরে রাখুন।',
      'গাড়ি এক পাশে সরলে স্টিয়ারিং সামান্য সেই পাশে ঘুরিয়ে ঠিক করুন।',
      'পেছনের বাম্পার স্টপ লাইনে পৌঁছালে ব্রেক করুন।',
    ],
    measure: ['ট্র্যাকের প্রস্থ: ≈ ৩ মি', 'দুই সারির দূরত্ব: গাড়ির প্রস্থ + দুই পাশে ৩০ সেমি', 'লম্বা: ≈ ৮ মি, শেষে স্টপ লাইন'],
    cones: [['A, B, C', 'বাম সারির খুঁটি'], ['D, E, F', 'ডান সারির খুঁটি'], ['A–D', 'স্টপ লাইনের খুঁটি']],
    avoid: ['স্টিয়ারিং বেশি ঘোরানো (আঁকাবাঁকা পথ)', 'খুঁটি ছোঁয়া বা স্টপ লাইন পার হওয়া'],
    parked: [],
    cone: [['A', 216, 60], ['B', 216, 124], ['C', 216, 188], ['D', 264, 60], ['E', 264, 124], ['F', 264, 188]],
    ghosts: [[240, 94.5, 180]],
    kfs: [
      K(240, 236, 180, { s: 0, hs: 0, hold: 900 }),
      K(240, 190, 180, { s: 1 }),
      K(242, 152, 183, { s: 2 }),
      K(241, 124, 177, { s: 2 }),
      K(240, 106, 180, { s: 3 }),
      K(240, 94.5, 180, { s: 3, hs: 3, hold: 1300, b: 1 }),
    ],
    bg: () => (
      <>
        <rect width="480" height="300" fill={GROUND} />
        <rect x="204" y="40" width="72" height="230" fill={ROAD} />
        <line x1="204" y1="60" x2="276" y2="60" stroke="#dc2626" strokeWidth="3" strokeDasharray="6 4" />
        <T x="284" y="64" anchor="start" fill="#dc2626" size="12" weight={700}>স্টপ লাইন</T>
        <T x="284" y="128" anchor="start">প্রস্থ ≈ ৩ মি</T>
        <T x="196" y="128" anchor="end">লম্বা ≈ ৮ মি</T>
      </>
    ),
  },
  /* 6 ─ থ্রি-পয়েন্ট টার্ন ───────────────────────────────────────── */
  {
    id: 'threepoint',
    n: 6,
    bn: 'থ্রি-পয়েন্ট টার্ন',
    en: 'Three-Point Turn',
    intro: 'সরু রাস্তায় সামনে-পেছনে কয়েক ধাপে গাড়ির দিক উল্টে ফেলা।',
    steps: [
      'প্রথমে সামনে এগিয়ে স্টিয়ারিং ডানে পুরো ঘুরিয়ে রাস্তার ডান কিনারার কাছে থামুন।',
      'রিভার্স গিয়ারে দিয়ে স্টিয়ারিং বামে পুরো ঘুরিয়ে পেছনে যান, বাম কিনারার কাছে থামুন।',
      'এবার সামনের গিয়ারে স্টিয়ারিং সোজা করে উল্টো দিকে বেরিয়ে যান।',
      'প্রতি ধাপে চারপাশ দেখুন।',
    ],
    measure: ['রাস্তা: ≈ ৬ মি চওড়া', 'রাস্তার দৈর্ঘ্য: ≈ ১৪ মি'],
    cones: [['৪টি খুঁটি', 'রাস্তার দুই পাশের চার কোণে (দুই প্রান্তে দুটি করে)']],
    avoid: ['খুঁটি ছোঁয়া বা রাস্তার বাইরে যাওয়া', 'ধাপ বেশি নেওয়া (তিনের বেশি)'],
    carScale: 0.82,
    parked: [],
    cone: [['', 192, 40], ['', 288, 40], ['', 192, 264], ['', 288, 264]],
    ghosts: [[258, 164, 50], [214, 160, 128]],
    kfs: [
      K(216, 250, 0, { s: 0, hs: 0, hold: 800 }),
      K(216, 232, 0, { s: 0 }),
      K(222, 205, 15, { s: 0 }),
      K(240, 182, 35, { s: 0 }),
      K(258, 164, 50, { s: 1, hs: 3, hold: 900, b: 1 }),
      K(246, 170, 70, { s: 1 }),
      K(232, 172, 90, { s: 1 }),
      K(220, 168, 112, { s: 1 }),
      K(214, 160, 128, { s: 2, hs: 3, hold: 900, b: 1 }),
      K(230, 180, 148, { s: 2 }),
      K(246, 205, 165, { s: 2 }),
      K(258, 236, 176, { s: 2 }),
      K(262, 272, 180, { s: 2, hs: 2, hold: 800 }),
    ],
    bg: () => (
      <>
        <rect width="480" height="300" fill={GROUND} />
        <rect x="192" y="30" width="96" height="244" fill={ROAD} />
        <line x1="192" y1="30" x2="192" y2="274" stroke={EDGE} strokeWidth="2" />
        <line x1="288" y1="30" x2="288" y2="274" stroke={EDGE} strokeWidth="2" />
        <T x="300" y="156" anchor="start">রাস্তা ≈ ৬ মি চওড়া</T>
        <T x="184" y="156" anchor="end">দৈর্ঘ্য ≈ ১৪ মি</T>
      </>
    ),
  },
  /* 7 ─ হুইল ট্র্যাক ───────────────────────────────────────────── */
  {
    id: 'wheel',
    n: 7,
    bn: 'হুইল ট্র্যাক ও স্টপ টার্গেট',
    en: 'Wheel Track with Stop Target',
    intro: 'চাকা ট্র্যাকের ভেতর রেখে সোজা এগিয়ে নির্দিষ্ট লাইনের সামনে থামা। বিআরটিএ পরীক্ষায় কাজে লাগে।',
    steps: [
      'দুই সারির মাঝখানে গাড়ি সোজা করে দাঁড়ান।',
      'ধীরে চলুন। দুই চাকা কোনের মাঝখানে রাখুন।',
      'স্টপ লাইন দেখে আগে থেকে ব্রেক শুরু করুন।',
      'গাড়ির সামনের বাম্পার লাইনের ঠিক সামনে থামান।',
    ],
    measure: ['ট্র্যাকের প্রস্থ: ≈ ৩ মি', 'লম্বা: ≈ ৮ মি, শেষে স্টপ লাইন'],
    cones: [['A, C, E', 'বাম সারির খুঁটি'], ['B, D, F', 'ডান সারির খুঁটি'], ['A, B', 'স্টপ লাইনের খুঁটি']],
    avoid: ['এক পাশের খুঁটির দিকে সরে যাওয়া', 'লাইনের আগে বা পরে থামা'],
    parked: [],
    cone: [['A', 216, 60], ['C', 216, 124], ['E', 216, 188], ['B', 264, 60], ['D', 264, 124], ['F', 264, 188]],
    ghosts: [[240, 102, 0]],
    kfs: [
      K(240, 270, 0, { s: 0, hs: 0, hold: 900 }),
      K(240, 226, 0, { s: 1 }),
      K(242, 186, 0, { s: 1 }),
      K(239, 150, 0, { s: 1 }),
      K(240, 126, 0, { s: 2 }),
      K(240, 102, 0, { s: 3, hs: 3, hold: 1300, b: 1 }),
    ],
    bg: () => (
      <>
        <rect width="480" height="300" fill={GROUND} />
        <rect x="204" y="40" width="72" height="260" fill={ROAD} />
        <line x1="204" y1="60" x2="276" y2="60" stroke="#dc2626" strokeWidth="3" strokeDasharray="6 4" />
        <T x="284" y="64" anchor="start" fill="#dc2626" size="12" weight={700}>স্টপ লাইন</T>
        <T x="284" y="128" anchor="start">প্রস্থ ≈ ৩ মি</T>
        <T x="196" y="128" anchor="end">লম্বা ≈ ৮ মি</T>
      </>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  টাইমলাইন                                                            */
/* ------------------------------------------------------------------ */

const SPEED = 0.085; // পিক্সেল/মিলিসেকেন্ড

function buildTimeline(kfs) {
  const segs = [];
  let t = 0;
  kfs.forEach((k, i) => {
    if (k.hold) {
      segs.push({ t0: t, t1: t + k.hold, from: k, to: k, step: k.hs ?? k.s ?? 0, hold: true });
      t += k.hold;
    }
    const n = kfs[i + 1];
    if (n) {
      const d = Math.hypot(n.x - k.x, n.y - k.y) + Math.abs(n.h - k.h) * 0.45;
      const dur = Math.max(d / SPEED, 80);
      segs.push({ t0: t, t1: t + dur, from: k, to: n, step: k.s ?? 0 });
      t += dur;
    }
  });
  return { segs, total: t };
}

function sample(tl, t) {
  const segs = tl.segs;
  let seg = segs[segs.length - 1];
  for (const s of segs) {
    if (t <= s.t1) {
      seg = s;
      break;
    }
  }
  const span = seg.t1 - seg.t0 || 1;
  let p = Math.min(1, Math.max(0, (t - seg.t0) / span));
  if (seg.to.b && !seg.hold) p = 1 - (1 - p) * (1 - p); // থামার আগে ধীর হওয়া
  const { from, to } = seg;
  return {
    x: from.x + (to.x - from.x) * p,
    y: from.y + (to.y - from.y) * p,
    h: from.h + (to.h - from.h) * p,
    step: seg.step,
    brake: seg.hold ? !!from.b : !!to.b && p > 0.65,
  };
}

/* ------------------------------------------------------------------ */
/*  সেকশন ১: পার্কিং অ্যানিমেশন                                         */
/* ------------------------------------------------------------------ */

function Icon({ d, className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const I_PLAY = 'M8 5v14l11-7z';
const I_PAUSE = 'M6 5h4v14H6zm8 0h4v14h-4z';
const I_REPLAY = 'M12 5V1L7 6l5 5V7a6 6 0 11-6 6H4a8 8 0 108-8z';

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ParkingAnimator() {
  const [id, setId] = useState('parallel');
  const scene = SCENES.find((s) => s.id === id);
  const tl = useMemo(() => buildTimeline(scene.kfs), [scene]);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const tRef = useRef(0);
  const raf = useRef(0);

  // ধরন বদলালে শুরু থেকে চালু (রিডিউসড মোশন হলে শেষ ফ্রেম দেখাবে)
  useEffect(() => {
    const reduced = prefersReduced();
    tRef.current = reduced ? tl.total : 0;
    setT(tRef.current);
    setPlaying(!reduced);
  }, [tl]);

  useEffect(() => {
    if (!playing) return undefined;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(now - last, 64);
      last = now;
      tRef.current = Math.min(tRef.current + dt * speed, tl.total);
      setT(tRef.current);
      if (tRef.current >= tl.total) {
        setPlaying(false);
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, speed, tl]);

  const done = t >= tl.total;
  const pose = sample(tl, t);
  const cs = scene.carScale || 1;

  const toggle = () => {
    if (done) {
      tRef.current = 0;
      setT(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };
  const replay = () => {
    tRef.current = 0;
    setT(0);
    setPlaying(true);
  };
  const scrub = (e) => {
    const v = (Number(e.target.value) / 1000) * tl.total;
    tRef.current = v;
    setT(v);
    setPlaying(false);
  };

  return (
    <section aria-labelledby="parking-anim-title" className="px-4 pt-6 sm:px-8 lg:px-10">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 id="parking-anim-title" className="text-base font-bold text-brsp-ink sm:text-lg">
            🅿️ পার্কিং অ্যানিমেশন
          </h3>
          <span className="rounded-full bg-brsp-green/10 px-2.5 py-0.5 text-xs font-semibold text-brsp-green">ড্রাইভিং প্র্যাকটিক্যাল</span>
        </div>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">পার্কিংয়ের ধরন বেছে নিন — গাড়ি কীভাবে ঢুকবে ধাপে ধাপে দেখুন।</p>

        {/* ধরন নির্বাচন */}
        <div role="group" aria-label="পার্কিংয়ের ধরন" className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible">
          {SCENES.map((s) => {
            const on = s.id === id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => setId(s.id)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition sm:text-sm ${
                  on ? 'border-brsp-green bg-brsp-green text-white shadow' : 'border-slate-200 bg-white text-slate-700 hover:border-brsp-green/50 hover:bg-slate-50'
                }`}
              >
                <span className={`mr-1.5 inline-grid h-5 w-5 place-items-center rounded-full text-[11px] ${on ? 'bg-white/25' : 'bg-slate-100'}`}>{bn(s.n)}</span>
                {s.bn}
              </button>
            );
          })}
        </div>

        <div className="mt-2 grid gap-4 lg:grid-cols-5">
          {/* অ্যানিমেশন */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#f3f3ec]">
              <svg viewBox="0 0 480 300" className="block h-auto w-full" role="img" aria-label={`${scene.bn} — অ্যানিমেশন`}>
                <defs>
                  <clipPath id="park-clip">
                    <rect width="480" height="300" />
                  </clipPath>
                </defs>
                <g clipPath="url(#park-clip)">
                  {scene.bg()}
                  {scene.ghosts.map((g, i) => (
                    <Car key={i} x={g[0]} y={g[1]} h={g[2]} s={cs} ghost />
                  ))}
                  {scene.parked.map((c, i) => (
                    <Car key={i} x={c[0]} y={c[1]} h={c[2]} s={cs} kind="parked" />
                  ))}
                  {scene.cone.map(([l, x, y]) => (
                    <Cone key={`${l}${x}${y}`} x={x} y={y} l={l} />
                  ))}
                  <Car x={pose.x} y={pose.y} h={pose.h} s={cs} brake={pose.brake} />
                </g>
              </svg>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-200 bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full bg-[#d9622b]" />খুঁটি</span>
                <span className="inline-flex items-center gap-1"><i className="inline-block h-2.5 w-3.5 rounded-sm border border-[#1d5fbf] bg-[#7db4f5]" />আপনার গাড়ি</span>
                <span className="inline-flex items-center gap-1"><i className="inline-block h-2.5 w-3.5 rounded-sm border border-dashed border-blue-500" />শেষ অবস্থান</span>
                {scene.parked.length > 0 && <span className="inline-flex items-center gap-1"><i className="inline-block h-2.5 w-3.5 rounded-sm border border-[#c0392b] bg-[#f28b8b]" />পার্ক করা গাড়ি</span>}
              </div>
            </div>

            {/* কন্ট্রোল */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={toggle} className="inline-flex items-center gap-1.5 rounded-full bg-brsp-green px-4 py-1.5 text-sm font-bold text-white shadow-sm hover:opacity-90">
                <Icon d={done ? I_REPLAY : playing ? I_PAUSE : I_PLAY} />
                {done ? 'আবার দেখুন' : playing ? 'থামান' : 'চালু করুন'}
              </button>
              <button type="button" onClick={replay} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <Icon d={I_REPLAY} /> শুরু থেকে
              </button>
              <div className="ml-auto inline-flex overflow-hidden rounded-full border border-slate-200 bg-white text-xs font-bold" role="group" aria-label="গতি">
                {[[0.5, '০.৫x'], [1, '১x'], [2, '২x']].map(([v, label]) => (
                  <button key={v} type="button" aria-pressed={speed === v} onClick={() => setSpeed(v)} className={`px-3 py-1.5 ${speed === v ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={Math.round((t / tl.total) * 1000)}
              onChange={scrub}
              aria-label="অ্যানিমেশনের অগ্রগতি"
              className="mt-3 w-full accent-brsp-green"
            />
          </div>

          {/* ধাপ ও তথ্য */}
          <div className="min-w-0 lg:col-span-2">
            <h4 className="text-base font-bold leading-snug text-slate-800">
              {scene.bn} <span className="text-xs font-semibold text-slate-500">({scene.en})</span>
            </h4>
            <p className="mt-1 text-sm leading-snug text-slate-600">{scene.intro}</p>

            <ol className="mt-3 space-y-1.5" aria-label="ধাপে ধাপে">
              {scene.steps.map((txt, i) => {
                const active = i === pose.step;
                const past = i < pose.step || (done && i <= pose.step);
                return (
                  <li
                    key={i}
                    className={`flex gap-2.5 rounded-xl border px-2.5 py-2 text-sm leading-snug transition-colors ${
                      active ? 'border-brsp-green bg-brsp-green/10 font-semibold text-slate-900' : past ? 'border-slate-200 bg-white text-slate-500' : 'border-slate-200 bg-white/70 text-slate-700'
                    }`}
                    aria-current={active ? 'step' : undefined}
                  >
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold ${active ? 'bg-brsp-green text-white' : past ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {past && !active ? '✓' : bn(i + 1)}
                    </span>
                    <span className="min-w-0 break-words">{txt}</span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-xl bg-slate-100/80 p-3">
                <p className="text-xs font-bold text-slate-500">মাপ</p>
                {scene.measure.map((m) => (
                  <p key={m} className="text-sm font-semibold leading-snug text-slate-800">{m}</p>
                ))}
                <p className="mt-2 text-xs font-bold text-slate-500">খুঁটির অবস্থান</p>
                <ul className="space-y-0.5">
                  {scene.cones.map(([k, v]) => (
                    <li key={k} className="flex gap-2 text-sm leading-snug text-slate-700">
                      <span className="shrink-0 rounded bg-[#d9622b] px-1.5 text-xs font-bold leading-5 text-white">{k}</span>
                      <span className="min-w-0 break-words">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                <p className="text-xs font-bold text-rose-700">যা এড়াবেন</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm leading-snug text-rose-900">
                  {scene.avoid.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          সূত্র: “ড্রাইভিং প্র্যাকটিক্যাল: খুঁটি বসানোর নকশা” (স্টাডি ম্যাটেরিয়ালসে পুরো PDF আছে)। অ্যানিমেশন বোঝার সুবিধার জন্য সরল করা — বাস্তব গাড়ির বাঁক ভিন্ন হতে পারে।
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  সেকশন ২: পার্কিং কুইজ                                               */
/* ------------------------------------------------------------------ */

// প্রতিটি প্রশ্নে প্রথম অপশনটিই সঠিক (দেখানোর সময় এলোমেলো করা হয়)
const BANK = [
  { q: 'সমান্তরাল (প্যারালাল) পার্কিংয়ে বে-র মাপ কত?', o: ['৬.৫ মি লম্বা × ২.৫ মি চওড়া', '৫.৫ মি লম্বা × ৩ মি চওড়া', '৮ মি লম্বা × ৩ মি চওড়া', '৪ মি লম্বা × ২ মি চওড়া'], e: 'বে গাড়ির দৈর্ঘ্যের প্রায় ১.৫ গুণ — ৬.৫ মি × ২.৫ মি।' },
  { q: 'প্যারালাল পার্কিং শেষে গাড়ি কার্ব থেকে কতটুকু দূরে থামবে?', o: ['২০–৩০ সেমি', '১ মি', 'কার্বে ঠেকিয়ে', '২ মি'], e: 'কার্বে চাকা লাগানো বা বেশি দূরে থামা — দুটোই ভুল। ২০–৩০ সেমি ঠিক।' },
  { q: 'প্যারালাল পার্কিং শুরুতে B খুঁটির পাশে কত ফাঁক রেখে থামবেন?', o: ['০.৫–১ মি', '৩ মি', 'একদম ঠেকিয়ে', '২–৩ মি'], e: 'বে-র সামনে B খুঁটির পাশে ০.৫–১ মি ফাঁক রেখে সমান্তরালে থামুন।' },
  { q: 'প্যারালাল পার্কিংয়ে গাড়ি প্রায় কত ডিগ্রি কোণে ঢুকলে স্টিয়ারিং সোজা করতে হয়?', o: ['৪৫°', '৯০°', '১৫°', '১৮০°'], e: 'রিভার্সে প্রায় ৪৫° কোণে ঢুকলে স্টিয়ারিং সোজা করুন, তারপর পেছনের অংশ ঢুকলে উল্টো দিকে ঘোরান।' },
  { q: 'রিভার্স / বে পার্কিংয়ে বে-র মাপ কত?', o: ['৩ মি চওড়া × ৫.৫ মি গভীর', '২.৫ মি চওড়া × ৬.৫ মি গভীর', '৫ মি চওড়া × ৩ মি গভীর', '৪ মি চওড়া × ৪ মি গভীর'], e: 'বে এবং ৯০° পারপেন্ডিকুলার — দুটোতেই ৩ মি × ৫.৫ মি।' },
  { q: 'বে পার্কিংয়ে শেষে A–B লাইনের কতটুকু আগে থামবেন?', o: ['১ মি', '৫ সেমি', '৩ মি', 'লাইনের ওপরে'], e: 'দুই পাশে সমান ফাঁক রেখে A–B লাইনের ১ মি আগে থামুন।' },
  { q: 'বে পার্কিংয়ে স্টিয়ারিং বে-র দিকে পুরো ঘোরাতে হয় কখন?', o: ['C বা D খুঁটি পাশ বরাবর এলে', 'বে-র পাশ দিয়ে যাওয়ার আগেই', 'A–B লাইনে পৌঁছালে', 'গাড়ি থামার পর'], e: 'C বা D খুঁটি (প্রবেশমুখের কোণ) পাশ বরাবর এলে স্টিয়ারিং বে-র দিকে পুরো ঘোরান।' },
  { q: '৯০° পারপেন্ডিকুলার পার্কিংয়ে E খুঁটির কাজ কী?', o: ['টার্ন শুরুর রেফারেন্স', 'থামার লাইন', 'বে-র পেছনের কোণ', 'পার্ক করা গাড়ি বোঝানো'], e: 'E খুঁটি আপনার পাশ বরাবর এলে স্টিয়ারিং বে-র দিকে ঘোরানো শুরু করুন।' },
  { q: '৯০° পারপেন্ডিকুলার পার্কিং থেকে বের হওয়ার সঠিক নিয়ম কোনটি?', o: ['চারপাশ দেখে রিভার্স করে ধীরে বেরোন', 'দ্রুত সামনে এগিয়ে বেরোন', 'হর্ন বাজিয়ে সোজা রিভার্স', 'চারপাশ না দেখে বেরোন'], e: 'বের হওয়ার সময় চারপাশ দেখে রিভার্স করে ধীরে বেরোতে হয়।' },
  { q: 'কোণাকুণি পার্কিংয়ে দাগ রাস্তার সাথে কত ডিগ্রি কোণে থাকে?', o: ['৪৫°', '৯০°', '৩০°', '০° (সমান্তরাল)'], e: 'তির্যক (৪৫°) দাগ — তাই নাম কোণাকুণি পার্কিং।' },
  { q: 'কোণাকুণি পার্কিংয়ে শেষে C–D লাইনের কতটুকু আগে থামবেন?', o: ['১ মি', '৫ মি', 'লাইন পার করে', '২০ সেমি'], e: 'C–D লাইনের ১ মি আগে থামুন এবং দুই পাশে সমান ফাঁক রাখুন।' },
  { q: 'সোজা রিভার্সে পেছনের কোন অংশ স্টপ লাইনে পৌঁছালে ব্রেক করবেন?', o: ['পেছনের বাম্পার', 'সামনের বাম্পার', 'ডান আয়না', 'সামনের চাকা'], e: 'পেছনের বাম্পার স্টপ লাইনে পৌঁছালে ব্রেক করুন।' },
  { q: 'সোজা রিভার্সে গাড়ি এক পাশে সরে গেলে কী করবেন?', o: ['স্টিয়ারিং সামান্য সেই পাশে ঘুরিয়ে ঠিক করব', 'স্টিয়ারিং পুরো উল্টো দিকে ঘোরাব', 'থেমে সামনে চলে যাব', 'ব্রেক চেপে ধরে রাখব'], e: 'স্টিয়ারিং বেশি ঘোরালে পথ আঁকাবাঁকা হয়ে যায় — সামান্য ঘুরিয়ে ঠিক করুন।' },
  { q: 'থ্রি-পয়েন্ট টার্নের রাস্তা প্রায় কত চওড়া ও কত লম্বা?', o: ['≈ ৬ মি চওড়া, ≈ ১৪ মি লম্বা', '≈ ৩ মি চওড়া, ≈ ৮ মি লম্বা', '≈ ১০ মি চওড়া, ≈ ২০ মি লম্বা', '≈ ২ মি চওড়া, ≈ ১০ মি লম্বা'], e: 'থ্রি-পয়েন্ট টার্নের ট্র্যাক ≈ ৬ মি × ≈ ১৪ মি; চার কোণে চারটি খুঁটি।' },
  { q: 'থ্রি-পয়েন্ট টার্নে কোনটি এড়াতে হবে?', o: ['তিনের বেশি ধাপ নেওয়া', 'প্রতি ধাপে চারপাশ দেখা', 'রিভার্স গিয়ার ব্যবহার', 'কিনারার কাছে থামা'], e: 'ধাপ বেশি নেওয়া (তিনের বেশি) এবং খুঁটি ছোঁয়া বা রাস্তার বাইরে যাওয়া এড়াতে হবে।' },
  { q: 'হুইল ট্র্যাক ও সোজা রিভার্সের ট্র্যাকের প্রস্থ ও দৈর্ঘ্য কত?', o: ['≈ ৩ মি প্রস্থ, ≈ ৮ মি লম্বা', '≈ ৬ মি প্রস্থ, ≈ ১৪ মি লম্বা', '≈ ১ মি প্রস্থ, ≈ ৫ মি লম্বা', '≈ ৫.৫ মি প্রস্থ, ≈ ৩ মি লম্বা'], e: 'দুটো ট্র্যাকই ≈ ৩ মি চওড়া ও ≈ ৮ মি লম্বা, শেষে স্টপ লাইন।' },
  { q: 'হুইল ট্র্যাকে স্টপ লাইনের জন্য কখন ব্রেক শুরু করবেন?', o: ['স্টপ লাইন দেখে আগে থেকেই', 'বাম্পার লাইন ছুঁলে', 'লাইন পার হওয়ার পর', 'একদম শেষ মুহূর্তে জোরে'], e: 'আগে থেকে ব্রেক শুরু করলে গাড়ি লাইনের ঠিক সামনে থামানো যায়।' },
];

const ROUND = 5;

function shuffle(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function newRound() {
  return shuffle(BANK)
    .slice(0, ROUND)
    .map((b) => ({ q: b.q, e: b.e, opts: shuffle(b.o.map((text, i) => ({ text, ok: i === 0 }))) }));
}

export function ParkingQuiz() {
  const [qs, setQs] = useState(newRound);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const cur = qs[i];
  const answer = (k) => {
    if (picked !== null) return;
    setPicked(k);
    if (cur.opts[k].ok) setScore((s) => s + 1);
  };
  const next = () => {
    if (i + 1 >= qs.length) {
      setDone(true);
    } else {
      setI(i + 1);
      setPicked(null);
    }
  };
  const restart = () => {
    setQs(newRound());
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  const verdict = score === ROUND ? 'দারুণ! সবগুলো ঠিক 🎉' : score >= 3 ? 'ভালো হয়েছে — আরেকবার চেষ্টা করুন' : 'আরেকবার অ্যানিমেশনটা দেখে নিন';

  return (
    <section aria-labelledby="parking-quiz-title" className="px-4 pb-8 pt-6 sm:px-8 lg:px-10">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 id="parking-quiz-title" className="text-base font-bold text-brsp-ink sm:text-lg">
            🧠 পার্কিং কুইজ
          </h3>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">{bn(ROUND)}টি প্রশ্ন · প্রতিবার নতুন</span>
        </div>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">মাপ, খুঁটি ও ধাপ মনে আছে কিনা যাচাই করুন।</p>

        {done ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
            <p className="text-3xl font-extrabold text-emerald-700">
              {bn(score)} / {bn(ROUND)}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{verdict}</p>
            <button type="button" onClick={restart} className="mt-4 rounded-full bg-brsp-green px-5 py-2 text-sm font-bold text-white shadow-sm hover:opacity-90">
              নতুন প্রশ্ন নিয়ে আবার খেলুন
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>
                প্রশ্ন {bn(i + 1)} / {bn(ROUND)}
              </span>
              <span>স্কোর: {bn(score)}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
              <div className="h-full rounded-full bg-brsp-green transition-all" style={{ width: `${(i / ROUND) * 100}%` }} />
            </div>

            <p className="mt-4 text-base font-bold leading-snug text-slate-800">{cur.q}</p>

            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {cur.opts.map((o, k) => {
                const chosen = picked === k;
                const reveal = picked !== null;
                const cls = !reveal
                  ? 'border-slate-200 bg-white text-slate-800 hover:border-brsp-green/60 hover:bg-slate-50'
                  : o.ok
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                    : chosen
                      ? 'border-rose-400 bg-rose-50 text-rose-900'
                      : 'border-slate-200 bg-white/60 text-slate-400';
                return (
                  <li key={o.text}>
                    <button type="button" disabled={reveal} onClick={() => answer(k)} className={`flex w-full items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold leading-snug transition ${cls}`}>
                      <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">{'কখগঘ'[k]}</span>
                      <span className="min-w-0 break-words">{o.text}</span>
                      {reveal && o.ok && <span className="ml-auto shrink-0">✓</span>}
                      {reveal && chosen && !o.ok && <span className="ml-auto shrink-0">✗</span>}
                    </button>
                  </li>
                );
              })}
            </ul>

            {picked !== null && (
              <div className="mt-3 rounded-xl bg-slate-100/80 p-3 text-sm leading-snug text-slate-700" role="status">
                <span className="font-bold">{cur.opts[picked].ok ? 'ঠিক! ' : 'ভুল। '}</span>
                {cur.e}
                <div className="mt-3">
                  <button type="button" onClick={next} className="rounded-full bg-slate-800 px-4 py-1.5 text-sm font-bold text-white hover:opacity-90">
                    {i + 1 >= qs.length ? 'ফলাফল দেখুন' : 'পরের প্রশ্ন →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function HomeInteractive() {
  return (
    <>
      <ParkingAnimator />
      <ParkingQuiz />
    </>
  );
}
