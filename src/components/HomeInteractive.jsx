import { useEffect, useMemo, useRef, useState } from 'react';

// হোম পেজের দুটি ইন্টারঅ্যাক্টিভ সেকশন: ১) পার্কিং অ্যানিমেশন  ২) গাড়ির লাইট অ্যানিমেশন
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
    bn: 'প্যারালাল পার্কিং',
    en: 'Parallel Parking',
    intro: 'রাস্তার পাশে দুটি গাড়ির মাঝখানে রিভার্স করে গাড়ি পার্ক করা।',
    steps: [
      'গাড়ি পার্কিং দাগের সামনে B খুঁটির পাশে ০.৫–১ মি ফাঁক রেখে প্যারালালে থামান।',
      'রিভার্স গিয়ারে দিন। স্টিয়ারিং কার্বের দিকে পুরো ঘুরিয়ে ধীরে পেছনে যান।',
      'গাড়ি প্রায় ৪৫° কোণে ঢুকলে স্টিয়ারিং সোজা করুন।',
      'পেছনের অংশ ঢুকলে স্টিয়ারিং উল্টো দিকে ঘুরিয়ে গাড়ি সোজা করুন।',
      'কার্ব থেকে ২০–৩০ সেমি দূরে, A–B ও C–D লাইনের মাঝে থামুন।',
    ],
    measure: ['পার্কিং দাগ: ৬.৫ মি লম্বা × ২.৫ মি চওড়া', '(গাড়ির দৈর্ঘ্যের ১.৫ গুণ)'],
    cones: [['A, B', 'পার্কিং দাগের রাস্তার দিকের দুই কোণ'], ['C, D', 'কার্বের পাশের দুই কোণ']],
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
  /* 2 ─ রিভার্স / দাগে ───────────────────────────────────────────── */
  {
    id: 'bay',
    n: 2,
    bn: 'রিভার্স / পার্কিং দাগ',
    en: 'Reverse Parking',
    intro: 'নির্দিষ্ট দাগের মধ্যে পেছন দিক দিয়ে গাড়ি ঢুকিয়ে পার্ক করা।',
    steps: [
      'রাস্তা ঘেঁষে পার্কিং দাগের পাশ দিয়ে এগিয়ে গাড়ি থামান।',
      'রিভার্স গিয়ারে দিন। দুই মিরর ও পেছনের কাচে খুঁটি দেখে ধীরে চলুন।',
      'C বা D খুঁটি পাশ বরাবর এলে স্টিয়ারিং পার্কিং দাগের দিকে পুরো ঘোরান।',
      'গাড়ি পার্কিং দাগের সোজাসুজি হলে স্টিয়ারিং সোজা করুন।',
      'দুই পাশে সমান ফাঁক রেখে A–B লাইনের ১ মি আগে থামুন।',
    ],
    measure: ['পার্কিং দাগ: ৩ মি চওড়া × ৫.৫ মি গভীর', 'রাস্তা ও পার্কিং দাগের মাঝে ঘোরার জায়গা থাকতে হবে'],
    cones: [['A, B', 'পার্কিং দাগের পেছনের দুই কোণ'], ['C, D', 'পার্কিং দাগের প্রবেশমুখের দুই কোণ']],
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
      'পার্কিং দাগ থেকে দূরের পাশ ধরে ধীরে এগোন।',
      'E খুঁটি আপনার পাশ বরাবর এলে স্টিয়ারিং পার্কিং দাগের দিকে ঘোরানো শুরু করুন।',
      'C ও D-এর ঠিক মাঝ দিয়ে সামনের অংশ ঢোকান।',
      'গাড়ি সোজা হলে স্টিয়ারিং সোজা করে A–B লাইনের ১ মি আগে থামুন।',
      'বের হওয়ার সময় চারপাশ দেখে রিভার্স করে ধীরে বেরোন।',
    ],
    measure: ['পার্কিং দাগ: ৩ মি চওড়া × ৫.৫ মি গভীর', 'E খুঁটি: প্রবেশমুখের লাইনের বাইরে ≈ ২ মি দূরে'],
    cones: [['A, B', 'পার্কিং দাগের পেছনের দুই কোণ'], ['C, D', 'পার্কিং দাগের প্রবেশমুখের দুই কোণ'], ['E', 'টার্ন শুরুর রেফারেন্স খুঁটি']],
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
      'গাড়ি দাগের প্যারালাল হলে স্টিয়ারিং সোজা করুন।',
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

export function ParkingAnimator({ compact = false }) {
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
    <section aria-labelledby="parking-anim-title" className={compact ? 'px-4 pt-6 sm:px-8 lg:px-10' : 'px-6 pt-6 sm:px-14 lg:px-24 xl:px-32'}>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 id="parking-anim-title" className="text-base font-bold text-brsp-ink sm:text-lg">
            🚗 পার্কিং অ্যানিমেশন
          </h3>
          <span className="rounded-full bg-brsp-green/10 px-2.5 py-0.5 text-xs font-semibold text-brsp-green">ড্রাইভিং প্র্যাকটিক্যাল</span>
        </div>
        {!compact && <p className="mt-1 text-xs text-slate-500 sm:text-sm">পার্কিংয়ের ধরন বেছে নিন — গাড়ি কীভাবে ঢুকবে ধাপে ধাপে দেখুন।</p>}

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

        <div className={`mt-2 grid gap-4 ${compact ? '' : 'lg:grid-cols-5'}`}>
          {/* অ্যানিমেশন */}
          <div className={compact ? 'mx-auto w-full max-w-3xl' : 'lg:col-span-3'}>
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

          {/* ধাপ ও তথ্য — শুধু ডেডিকেটেড পেজে */}
          {!compact && (
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
          )}
        </div>

        {!compact && (
        <p className="mt-3 text-xs text-slate-500">
          সূত্র: “ড্রাইভিং প্র্যাকটিক্যাল: খুঁটি বসানোর নকশা” (স্টাডি ম্যাটেরিয়ালসে পুরো PDF আছে)। অ্যানিমেশন বোঝার সুবিধার জন্য সরল করা — বাস্তব গাড়ির বাঁক ভিন্ন হতে পারে।
        </p>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  সেকশন ২: গাড়ির লাইট অ্যানিমেশন                                      */
/* ------------------------------------------------------------------ */

const LIGHTS = [
  {
    id: 'low',
    bn: 'লো বিম (ডিপার)',
    en: 'Low Beam',
    intro: 'সামনে নিচের দিকে আলো ফেলে — অন্য চালকের চোখে লাগে না।',
    use: ['রাতে শহর ও আবাসিক এলাকায়', 'সামনে থেকে গাড়ি এলে বা সামনের গাড়ির কাছাকাছি থাকলে', 'সন্ধ্যা, কুয়াশা বা বৃষ্টিতে দৃশ্যমানতা কমলে'],
    avoid: ['হেডলাইট ঠিকমতো অ্যাডজাস্ট না রাখা'],
  },
  {
    id: 'high',
    bn: 'হাই বিম',
    en: 'High Beam',
    intro: 'সবচেয়ে দূর পর্যন্ত আলো ফেলে — ফাঁকা অন্ধকার রাস্তার জন্য। উল্টো দিক থেকে গাড়ি এলে অ্যানিমেশনে দেখুন কীভাবে লো বিমে নামে।',
    use: ['রাতে ফাঁকা, অন্ধকার রাস্তায়', 'সামনে বা পেছনে কোনো গাড়ি না থাকলে'],
    avoid: ['সামনে থেকে গাড়ি এলে হাই বিম জ্বালিয়ে রাখা — আগেই লো বিমে নিন', 'সামনের গাড়ির খুব কাছে পেছনে থেকে হাই বিমে চালানো', 'ঘন কুয়াশায় হাই বিম (আলো ফিরে এসে চোখে লাগে)'],
  },
  {
    id: 'fog',
    bn: 'ফগ লাইট',
    en: 'Fog Light',
    intro: 'নিচু ও চওড়া আলো — কুয়াশায় সামনের রাস্তা ও দুই পাশ দেখতে সাহায্য করে।',
    use: ['ঘন কুয়াশা, ভারী বৃষ্টি বা ধুলোয় দৃশ্যমানতা কমলে', 'কুয়াশায় হাই বিম এড়িয়ে লো বিমের সাথে ব্যবহার করুন'],
    avoid: ['পরিষ্কার আবহাওয়ায় জ্বালিয়ে রাখা — অন্যের চোখে লাগে'],
  },
  {
    id: 'parking',
    bn: 'পার্কিং লাইট',
    en: 'Parking / Side Light',
    intro: 'অল্প আলোর ছোট বাতি — গাড়ি আছে বোঝাতে, রাস্তা আলোকিত করতে নয়।',
    use: ['অন্ধকারে রাস্তার পাশে গাড়ি দাঁড় করালে', 'অল্প আলোয় থেমে থাকা গাড়ির উপস্থিতি অন্য চালককে জানাতে'],
    avoid: ['চলার সময় শুধু পার্কিং লাইট জ্বালিয়ে চালানো', 'ইঞ্জিন বন্ধ রেখে বেশিক্ষণ জ্বালিয়ে রাখা — ব্যাটারি শেষ হতে পারে'],
  },
  {
    id: 'left',
    bn: 'বাম ইন্ডিকেটর',
    en: 'Left Indicator',
    intro: 'বামে মোড় নেওয়া বা লেন বদলের আগে অন্যদের জানায়।',
    use: ['বামে ঘোরার আগেই (মোড়ের একটু আগে) দিন', 'বাম দিকে সরার বা রাস্তার বাম পাশে থামার আগে'],
    avoid: ['মোড় শেষ হলে বন্ধ করতে ভুলে যাওয়া', 'ইন্ডিকেটর না দিয়ে হঠাৎ ঘোরা'],
  },
  {
    id: 'right',
    bn: 'ডান ইন্ডিকেটর',
    en: 'Right Indicator',
    intro: 'ডানে মোড় নেওয়া, ওভারটেক বা লেন বদলের আগে অন্যদের জানায়।',
    use: ['ডানে ঘোরার আগেই (মোড়ের একটু আগে) দিন', 'ওভারটেক শুরুর আগে ও ডান লেনে সরার আগে'],
    avoid: ['মোড় শেষ হলে বন্ধ করতে ভুলে যাওয়া', 'ইন্ডিকেটর না দিয়ে হঠাৎ ঘোরা'],
  },
  {
    id: 'hazard',
    bn: 'হ্যাজার্ড লাইট',
    en: 'Hazard Lights',
    intro: 'চারটি ইন্ডিকেটর একসাথে জ্বলে — বিপদ বা জরুরি অবস্থার সংকেত।',
    use: ['গাড়ি বিকল হয়ে রাস্তায় দাঁড়িয়ে গেলে', 'দুর্ঘটনা বা জরুরি থামার সময় অন্যদের সতর্ক করতে'],
    avoid: ['স্বাভাবিক চলা বা পার্কিংয়ে বিনা কারণে ব্যবহার করা'],
  },
  {
    id: 'brake',
    bn: 'ব্রেক লাইট',
    en: 'Brake Light',
    intro: 'ব্রেক চাপলে নিজে নিজে জ্বলে — পেছনের চালককে গতি কমানোর সংকেত।',
    use: ['ব্রেক প্যাডেল চাপলে স্বয়ংক্রিয়ভাবে জ্বলে', 'জ্বলছে কিনা মাঝে মাঝে কাউকে দিয়ে দেখে নিন'],
    avoid: ['ব্রেক লাইট নষ্ট রেখে চালানো — পেছনের গাড়ি ধাক্কা দিতে পারে'],
  },
  {
    id: 'reverse',
    bn: 'রিভার্স লাইট',
    en: 'Reverse Light',
    intro: 'রিভার্স গিয়ারে দিলে সাদা আলো জ্বলে — পেছনে যাচ্ছেন জানায় ও পেছনটা আলোকিত করে।',
    use: ['রিভার্স গিয়ার দিলে নিজে নিজে জ্বলে', 'রাতে পার্কিং বা সোজা রিভার্সের সময় পেছনের জায়গা দেখতে'],
    avoid: ['শুধু আলোর ওপর ভরসা না করে মিরর ও পেছনে দেখে নেওয়া'],
  },
  {
    id: 'tail',
    bn: 'টেইল লাইট',
    en: 'Tail Light',
    intro: 'পেছনে লাল হালকা আলো — হেডলাইটের সাথে জ্বলে, রাতে পেছন থেকে গাড়ি চেনায়।',
    use: ['হেডলাইট জ্বালালে সাথে সাথে জ্বলে', 'রাতে ও কম আলোয় পেছনের গাড়িকে আপনার অবস্থান জানাতে'],
    avoid: ['টেইল লাইট নষ্ট থাকলে রাতে চালানো'],
  },
];

// গাড়ির স্থানীয় স্থানাঙ্ক: সামনে = উপরে (y নেগেটিভ)। গ্রুপ স্কেল 1.4 — গাড়ি বাম লেনে (x=190)
function LightScene({ id, reduced }) {
  const moving = ['low', 'high', 'fog', 'left', 'right', 'tail'].includes(id);
  const roll = moving || id === 'reverse' || id === 'brake';
  const rollDur = id === 'brake' ? '2.6s' : '0.7s';
  const rollTo = id === 'reverse' ? '0 -40' : '0 40';
  const anim = !reduced;
  const lowOn = ['low', 'tail'].includes(id) || id === 'fog';
  const blinkL = id === 'left' || id === 'hazard';
  const blinkR = id === 'right' || id === 'hazard';

  const Blink = ({ children, dur = '0.9s' }) => (
    <g>
      {children}
      {anim && <animate attributeName="opacity" values="1;0.08;1" keyTimes="0;0.5;1" dur={dur} repeatCount="indefinite" />}
    </g>
  );
  const Lamp = ({ x, y, color, r = 3.2, glow = 8, o = 0.85 }) => (
    <g>
      <circle cx={x} cy={y} r={glow} fill={color} opacity={o} filter="url(#lt-blur)" />
      <circle cx={x} cy={y} r={r} fill="#fff" stroke={color} strokeWidth="1.5" />
    </g>
  );
  const dashY = [-80, -40, 0, 40, 80, 120, 160, 200, 240, 280, 320];

  return (
    <svg viewBox="0 0 480 300" className="block h-auto w-full" role="img" aria-label={`গাড়ির ${id} লাইট অ্যানিমেশন`}>
      <defs>
        <filter id="lt-blur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="lt-blur2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <linearGradient id="g-low" gradientUnits="userSpaceOnUse" x1="0" y1="-34" x2="0" y2="-115">
          <stop offset="0" stopColor="#fff7c2" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff7c2" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="g-high" gradientUnits="userSpaceOnUse" x1="0" y1="-34" x2="0" y2="-210">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="g-fog" gradientUnits="userSpaceOnUse" x1="0" y1="-34" x2="0" y2="-95">
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="g-brake" gradientUnits="userSpaceOnUse" x1="0" y1="36" x2="0" y2="100">
          <stop offset="0" stopColor="#ef4444" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="g-rev" gradientUnits="userSpaceOnUse" x1="0" y1="36" x2="0" y2="110">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="g-tail" gradientUnits="userSpaceOnUse" x1="0" y1="36" x2="0" y2="75">
          <stop offset="0" stopColor="#ef4444" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
        <clipPath id="lt-clip">
          <rect width="480" height="300" />
        </clipPath>
      </defs>

      <g clipPath="url(#lt-clip)">
        {/* রাত ও রাস্তা */}
        <rect width="480" height="300" fill="#0b1220" />
        <rect x="90" width="300" height="300" fill="#1c2638" />
        <line x1="90" y1="0" x2="90" y2="300" stroke="#cbd5e1" strokeWidth="2" opacity="0.6" />
        <line x1="390" y1="0" x2="390" y2="300" stroke="#cbd5e1" strokeWidth="2" opacity="0.6" />
        <g>
          {dashY.map((y) => (
            <rect key={y} x="238" y={y} width="4" height="22" rx="2" fill="#e2e8f0" opacity="0.75" />
          ))}
          {roll && anim && <animateTransform attributeName="transform" type="translate" from="0 0" to={rollTo} dur={rollDur} repeatCount="indefinite" />}
        </g>

        {/* উল্টো দিক থেকে আসা গাড়ি (লো ও হাই বিমের দৃশ্যে) */}
        {(id === 'low' || id === 'high') && (
          <g>
            <g transform="translate(290 0) rotate(180) scale(1.4)">
              <polygon points="-14,-34 14,-34 40,-100 -40,-100" fill="#fff7c2" opacity="0.4" filter="url(#lt-blur)" />
              <rect x="-14.5" y="-34.5" width="29" height="69" rx="9" fill="#6b7280" stroke="#374151" strokeWidth="2" />
              <rect x="-11" y="-17" width="22" height="10" rx="3" fill="#9ca3af" />
              <circle cx="-10" cy="-33" r="3" fill="#fff" />
              <circle cx="10" cy="-33" r="3" fill="#fff" />
            </g>
            {anim && <animateTransform attributeName="transform" type="translate" values="0 -110; 0 400" dur="6s" repeatCount="indefinite" />}
          </g>
        )}

        {/* আলোর রশ্মি */}
        <g transform="translate(190 200) scale(1.4)">
          {id === 'low' && <polygon points="-14,-34 14,-34 52,-115 -52,-115" fill="url(#g-low)" />}
          {id === 'high' && (
            <>
              <g>
                <polygon points="-14,-34 14,-34 42,-210 -42,-210" fill="url(#g-high)" />
                {anim && <animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0;0.16;0.22;0.8;0.88;1" dur="6s" repeatCount="indefinite" />}
              </g>
              {anim && (
                <g opacity="0">
                  <polygon points="-14,-34 14,-34 52,-115 -52,-115" fill="url(#g-low)" />
                  <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.16;0.22;0.8;0.88;1" dur="6s" repeatCount="indefinite" />
                </g>
              )}
            </>
          )}
          {id === 'fog' && (
            <>
              <polygon points="-14,-34 14,-34 52,-115 -52,-115" fill="url(#g-low)" opacity="0.45" />
              <polygon points="-16,-32 16,-32 95,-95 -95,-95" fill="url(#g-fog)" />
            </>
          )}
          {id === 'tail' && <polygon points="-14,-34 14,-34 52,-115 -52,-115" fill="url(#g-low)" opacity="0.5" />}
          {id === 'brake' && <polygon points="-14,36 14,36 34,100 -34,100" fill="url(#g-brake)" />}
          {id === 'reverse' && <polygon points="-12,36 12,36 36,110 -36,110" fill="url(#g-rev)" />}
          {(id === 'tail' || id === 'parking') && <polygon points="-14,36 14,36 24,75 -24,75" fill="url(#g-tail)" opacity={id === 'parking' ? 0.5 : 1} />}
        </g>

        {/* গাড়ি */}
        <g transform="translate(190 200) scale(1.4)">
          <rect x="-14.5" y="-34.5" width="29" height="69" rx="9" fill="#4b83c9" stroke="#1e3a8a" strokeWidth="2" />
          <rect x="-11" y="-17" width="22" height="10" rx="3" fill="#bcd8f5" />
          <rect x="-10" y="12" width="20" height="8" rx="3" fill="#bcd8f5" />
          {/* সামনের বাতি */}
          {(id === 'low' || id === 'high' || id === 'tail' || id === 'fog') && (
            <>
              <Lamp x={-10} y={-33} color="#fff7c2" />
              <Lamp x={10} y={-33} color="#fff7c2" />
            </>
          )}
          {id === 'fog' && (
            <>
              <Lamp x={-12} y={-29} color="#fbbf24" r={2.2} glow={6} />
              <Lamp x={12} y={-29} color="#fbbf24" r={2.2} glow={6} />
            </>
          )}
          {id === 'parking' && (
            <>
              <circle cx="-11" cy="-33" r="2.6" fill="#fef3c7" />
              <circle cx="11" cy="-33" r="2.6" fill="#fef3c7" />
              <circle cx="-11" cy="-33" r="6" fill="#fef3c7" opacity="0.5" filter="url(#lt-blur)" />
              <circle cx="11" cy="-33" r="6" fill="#fef3c7" opacity="0.5" filter="url(#lt-blur)" />
              <circle cx="-11" cy="33" r="2.6" fill="#ef4444" />
              <circle cx="11" cy="33" r="2.6" fill="#ef4444" />
              <circle cx="-11" cy="33" r="6" fill="#ef4444" opacity="0.5" filter="url(#lt-blur)" />
              <circle cx="11" cy="33" r="6" fill="#ef4444" opacity="0.5" filter="url(#lt-blur)" />
            </>
          )}
          {/* ইন্ডিকেটর */}
          {blinkL && (
            <>
              <Blink><Lamp x={-14} y={-30} color="#f59e0b" r={3.4} glow={13} /></Blink>
              <Blink><Lamp x={-14} y={31} color="#f59e0b" r={3.4} glow={13} /></Blink>
            </>
          )}
          {blinkR && (
            <>
              <Blink><Lamp x={14} y={-30} color="#f59e0b" r={3.4} glow={13} /></Blink>
              <Blink><Lamp x={14} y={31} color="#f59e0b" r={3.4} glow={13} /></Blink>
            </>
          )}
          {/* পেছনের বাতি */}
          {(id === 'tail' || id === 'low' || id === 'high' || id === 'fog') && (
            <>
              <circle cx="-11" cy="33" r="2.6" fill="#ef4444" opacity={id === 'tail' ? 1 : 0.8} />
              <circle cx="11" cy="33" r="2.6" fill="#ef4444" opacity={id === 'tail' ? 1 : 0.8} />
              {id === 'tail' && (
                <>
                  <circle cx="-11" cy="33" r="6" fill="#ef4444" opacity="0.5" filter="url(#lt-blur)" />
                  <circle cx="11" cy="33" r="6" fill="#ef4444" opacity="0.5" filter="url(#lt-blur)" />
                </>
              )}
            </>
          )}
          {id === 'brake' && (
            <>
              <Lamp x={-11} y={33} color="#ef0000" r={3.4} glow={10} o={1} />
              <Lamp x={11} y={33} color="#ef0000" r={3.4} glow={10} o={1} />
              <rect x="-6" y="19" width="12" height="2.4" rx="1.2" fill="#ff2a2a" />
            </>
          )}
          {id === 'reverse' && (
            <>
              <circle cx="-11" cy="33" r="2.6" fill="#7f1d1d" />
              <circle cx="11" cy="33" r="2.6" fill="#7f1d1d" />
              <Lamp x={-5} y={34} color="#ffffff" r={2.4} glow={8} o={1} />
              <Lamp x={5} y={34} color="#ffffff" r={2.4} glow={8} o={1} />
            </>
          )}
          {(blinkL || blinkR) && id !== 'tail' && (
            <>
              <circle cx="-11" cy="33" r="2.6" fill="#7f1d1d" />
              <circle cx="11" cy="33" r="2.6" fill="#7f1d1d" />
            </>
          )}
        </g>

        {/* কুয়াশা */}
        {id === 'fog' && (
          <g>
            <rect width="480" height="300" fill="#e2e8f0" opacity="0.16" />
            {[[120, 70, 70], [260, 40, 90], [340, 120, 80], [160, 150, 60], [400, 40, 60]].map(([x, y, r], i) => (
              <ellipse key={i} cx={x} cy={y} rx={r * 1.6} ry={r * 0.5} fill="#e2e8f0" opacity="0.22" filter="url(#lt-blur2)">
                {anim && <animate attributeName="cx" values={`${x - 25};${x + 25};${x - 25}`} dur={`${6 + i}s`} repeatCount="indefinite" />}
              </ellipse>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}

export function LightsAnimator({ compact = false }) {
  const [id, setId] = useState('low');
  const [reduced] = useState(prefersReduced);
  const L = LIGHTS.find((x) => x.id === id);

  return (
    <section aria-labelledby="lights-title" className={compact ? 'px-4 pb-8 pt-6 sm:px-8 lg:px-10' : 'px-6 pb-10 pt-6 sm:px-14 lg:px-24 xl:px-32'}>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 id="lights-title" className="text-base font-bold text-brsp-ink sm:text-lg">
            💡 গাড়ির লাইট অ্যানিমেশন
          </h3>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">হেডলাইট · ফগ · পার্কিং · ইন্ডিকেটর</span>
        </div>
        {!compact && <p className="mt-1 text-xs text-slate-500 sm:text-sm">লাইটের ধরন বেছে নিন — কোন লাইট কখন জ্বলে ও কেন ব্যবহার করবেন দেখুন।</p>}

        <div role="group" aria-label="লাইটের ধরন" className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible">
          {LIGHTS.map((l) => {
            const on = l.id === id;
            return (
              <button
                key={l.id}
                type="button"
                aria-pressed={on}
                onClick={() => setId(l.id)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition sm:text-sm ${
                  on ? 'border-amber-500 bg-amber-500 text-white shadow' : 'border-slate-200 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50'
                }`}
              >
                {l.bn}
              </button>
            );
          })}
        </div>

        <div className={`mt-2 grid gap-4 ${compact ? '' : 'lg:grid-cols-5'}`}>
          <div className={compact ? 'mx-auto w-full max-w-3xl' : 'lg:col-span-3'}>
            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
              <LightScene key={id} id={id} reduced={reduced} />
            </div>
          </div>
          {!compact && (
          <div className="min-w-0 lg:col-span-2">
            <h4 className="text-base font-bold leading-snug text-slate-800">
              {L.bn} <span className="text-xs font-semibold text-slate-500">({L.en})</span>
            </h4>
            <p className="mt-1 text-sm leading-snug text-slate-600">{L.intro}</p>

            <div className="mt-3 rounded-xl bg-amber-50 p-3">
              <p className="text-xs font-bold text-amber-800">কখন ব্যবহার করবেন</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm leading-snug text-slate-800">
                {L.use.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>
            <div className="mt-2 rounded-xl border border-rose-200 bg-rose-50 p-3">
              <p className="text-xs font-bold text-rose-700">যা এড়াবেন</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm leading-snug text-rose-900">
                {L.avoid.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
          )}
        </div>
        {!compact && <p className="mt-3 text-xs text-slate-500">সাধারণ নির্দেশনা — নির্দিষ্ট নিয়ম ও জরিমানার জন্য প্রশিক্ষকের কথা ও সড়ক পরিবহন আইন, ২০১৮ দেখুন।</p>}
      </div>
    </section>
  );
}

// হোম পেজে শুধু অ্যানিমেশন (কোনো ব্যাখ্যা নেই); ব্যাখ্যাসহ পূর্ণ সংস্করণ "পার্কিং ও লাইট" পেজে
export default function HomeInteractive() {
  return (
    <>
      <ParkingAnimator compact />
      <LightsAnimator compact />
    </>
  );
}
