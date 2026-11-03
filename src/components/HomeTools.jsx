import { useEffect, useMemo, useState } from 'react';

const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

/* =====================================================================
   ১) গাড়ি চালানোর আগে — ইন্টারেক্টিভ চেকলিস্ট
   (তথ্য: ড্রাইভিং লাইসেন্স প্রশ্নোত্তর — ‘গাড়ি চালনার আগে করণীয় কাজ’)
   ===================================================================== */
const CHECK_GROUPS = [
  {
    id: 'docs',
    title: 'কাগজপত্র',
    icon: '📄',
    items: [
      'ড্রাইভিং লাইসেন্স',
      'রেজিস্ট্রেশন সার্টিফিকেট (ব্লু-বুক / স্মার্ট কার্ড)',
      'ট্যাক্স টোকেন',
      'ফিটনেস সার্টিফিকেট (মোটরসাইকেলের ক্ষেত্রে নয়)',
      'ইনসিওরেন্স (বীমা) সার্টিফিকেট',
      'রুট পারমিট (প্রযোজ্য হলে)',
    ],
  },
  {
    id: 'fluids',
    title: 'জ্বালানি ও তরল',
    icon: '⛽',
    items: [
      'জ্বালানি আছে কি না — না থাকলে পরিমাণমতো নিন',
      'রেডিয়েটর ও ব্যাটারিতে পানি আছে কি না',
      'ব্যাটারি কানেকশন ঠিক আছে কি না',
      'লুব/ইঞ্জিন অয়েলের লেবেল ও ঘনত্ব',
      'মাস্টার সিলিন্ডারে ব্রেক ফ্লুইড / ব্রেক অয়েল',
    ],
  },
  {
    id: 'car',
    title: 'গাড়ির অবস্থা',
    icon: '🚗',
    items: [
      'ইঞ্জিন, লাইটিং সিস্টেম, ব্যাটারি ও স্টিয়ারিং ঠিকভাবে কাজ করছে',
      'নাট-বোল্ট টাইট আছে',
      'ব্রেক ও ক্লাচ ঠিকমতো কাজ করছে',
      'বাইরের ও ভিতরের বাতি ঠিক আছে',
      'চাকা — টায়ার কন্ডিশন, হাওয়া, নাট, স্পেয়ার চাকা',
      'অগ্নিনির্বাপক যন্ত্র ও ফার্স্ট-এইড বক্স গাড়িতে আছে',
    ],
  },
];
const ALL_ITEMS = CHECK_GROUPS.flatMap((g) => g.items.map((t) => `${g.id}:${t}`));

export function PreDriveChecklist() {
  const [done, setDone] = useState(() => new Set());
  const total = ALL_ITEMS.length;
  const count = done.size;
  const pct = Math.round((count / total) * 100);
  const ready = count === total;

  const toggle = (key) =>
    setDone((s) => {
      const n = new Set(s);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  const toggleGroup = (g) =>
    setDone((s) => {
      const keys = g.items.map((t) => `${g.id}:${t}`);
      const all = keys.every((k) => s.has(k));
      const n = new Set(s);
      keys.forEach((k) => (all ? n.delete(k) : n.add(k)));
      return n;
    });

  // প্রগ্রেস রিং
  const R = 38;
  const C = 2 * Math.PI * R;

  return (
    <section id="checklist" className="scroll-mt-20 px-4 sm:px-8 pb-8 sm:pb-10" aria-label="গাড়ি চালানোর আগের চেকলিস্ট">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">গাড়ি চালানোর আগে — চেকলিস্ট</h2>
        <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          নতুন চালকদের জন্য: গাড়িতে ওঠার আগে একে একে টিক দিন। সব টিক পড়লে গাড়ি চালানোর জন্য প্রস্তুত।
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-[16rem_1fr] items-start">
          {/* অগ্রগতি */}
          <aside className="rounded-2xl bg-brsp-ink text-white p-5 text-center lg:sticky lg:top-20">
            <div className="relative w-32 h-32 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90" aria-hidden="true">
                <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke={ready ? '#6ee7b7' : '#fff'}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - count / total)}
                  style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <p className="text-3xl font-bold leading-none">
                  {bn(pct)}
                  <span className="text-base">%</span>
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/80" aria-live="polite">
              {bn(count)} / {bn(total)} টি ঠিক আছে
            </p>
            <p className={`mt-2 font-bold ${ready ? 'text-emerald-300' : 'text-white'}`} aria-live="polite">
              {ready ? '✅ গাড়ি চালানোর জন্য প্রস্তুত!' : 'সবগুলো যাচাই করুন'}
            </p>
            <button
              type="button"
              onClick={() => setDone(new Set())}
              disabled={count === 0}
              className="mt-4 w-full rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition disabled:opacity-40 disabled:hover:bg-transparent"
            >
              আবার শুরু করুন
            </button>
          </aside>

          {/* তালিকা */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-2">
            {CHECK_GROUPS.map((g) => {
              const keys = g.items.map((t) => `${g.id}:${t}`);
              const n = keys.filter((k) => done.has(k)).length;
              return (
                <fieldset key={g.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <legend className="sr-only">{g.title}</legend>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <span aria-hidden="true">{g.icon}</span>
                      {g.title}
                      <span className="text-xs font-semibold text-slate-500">
                        ({bn(n)}/{bn(g.items.length)})
                      </span>
                    </h3>
                    <button type="button" onClick={() => toggleGroup(g)} className="text-xs font-semibold text-brsp-green hover:underline">
                      {n === g.items.length ? 'সব বাদ' : 'সব টিক'}
                    </button>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {g.items.map((t) => {
                      const key = `${g.id}:${t}`;
                      const on = done.has(key);
                      return (
                        <li key={key}>
                          <label
                            className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition select-none ${
                              on ? 'border-brsp-green bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <input type="checkbox" checked={on} onChange={() => toggle(key)} className="peer sr-only" />
                            <span
                              className={`mt-0.5 grid place-items-center w-5 h-5 shrink-0 rounded-md border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-brsp-green peer-focus-visible:ring-offset-1 ${
                                on ? 'bg-brsp-green border-brsp-green text-white' : 'border-slate-300 bg-white'
                              }`}
                              aria-hidden="true"
                            >
                              {on && (
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                                </svg>
                              )}
                            </span>
                            <span className={`text-sm sm:text-base leading-snug ${on ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-700'}`}>{t}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   ২) ট্রাফিক সিগন্যাল ও নিরাপদ দূরত্ব ল্যাব
   তথ্য: লাল-সবুজ-হলুদ ক্রম ও অর্থ; পাকা ও ভালো রাস্তায় ৫০ কিমি/ঘণ্টায় নিরাপদ দূরত্ব ২৫ মিটার
   (অর্থাৎ গতির অর্ধেক মিটার; ৭০ কিমি/ঘণ্টায় ৩৫ মিটার)
   ===================================================================== */
const LIGHTS = [
  { id: 'red', label: 'লাল', color: '#dc2626', glow: 'rgba(220,38,38,.55)', secs: 5, text: 'থামুন! গাড়িকে ‘থামুনলাইন’-এর পেছনে থামিয়ে অপেক্ষা করুন।', icon: '✋' },
  { id: 'green', label: 'সবুজ', color: '#16a34a', glow: 'rgba(22,163,74,.55)', secs: 5, text: 'চলুন! সামনে দেখে-শুনে গাড়ি নিয়ে অগ্রসর হন।', icon: '🚗' },
  { id: 'yellow', label: 'হলুদ', color: '#eab308', glow: 'rgba(234,179,8,.6)', secs: 2, text: 'প্রস্তুত হন! থামার জন্য প্রস্তুতি নিন।', icon: '⚠️' },
];

export function SignalSafetyLab() {
  const [sig, setSig] = useState({ i: 0, left: LIGHTS[0].secs });
  const [auto, setAuto] = useState(true);
  const [speed, setSpeed] = useState(50);
  const active = sig.i;
  const left = sig.left;

  // অটো মোড: লাল → সবুজ → হলুদ → লাল
  useEffect(() => {
    if (!auto) return undefined;
    const t = setInterval(() => {
      setSig((s) => {
        if (s.left > 1) return { i: s.i, left: s.left - 1 };
        const nx = (s.i + 1) % LIGHTS.length;
        return { i: nx, left: LIGHTS[nx].secs };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [auto]);

  const pick = (i) => {
    setAuto(false);
    setSig({ i, left: LIGHTS[i].secs });
  };
  const cur = LIGHTS[active];

  const dist = speed / 2; // মিটার
  const pctGap = Math.min(100, (dist / 60) * 100);
  const risk = useMemo(() => (speed <= 40 ? 'ধীর গতি' : speed <= 70 ? 'মাঝারি গতি' : 'উচ্চ গতি'), [speed]);

  return (
    <section id="signal-lab" className="scroll-mt-20 px-4 sm:px-8 pb-8 sm:pb-10" aria-label="ট্রাফিক সিগন্যাল ও নিরাপদ দূরত্ব ল্যাব">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">ট্রাফিক সিগন্যাল ও নিরাপদ দূরত্ব ল্যাব</h2>
        <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          বাতিতে ক্লিক করে সিগন্যালের অর্থ শিখুন, আর স্লাইডার টেনে দেখুন গতি বাড়লে সামনের গাড়ি থেকে কতটা দূরত্ব রাখতে হয়।
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* সিগন্যাল */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="font-bold text-slate-800">ট্রাফিক লাইট সিগন্যাল</h3>
            <div className="mt-4 flex gap-5 items-center">
              <div className="shrink-0 rounded-2xl bg-slate-800 p-3 flex flex-col gap-3 shadow-inner" role="group" aria-label="ট্রাফিক লাইট">
                {LIGHTS.map((l, i) => {
                  const on = i === active;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => pick(i)}
                      aria-pressed={on}
                      aria-label={`${l.label} বাতি`}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-slate-900 transition-all duration-300"
                      style={{
                        background: on ? l.color : '#334155',
                        boxShadow: on ? `0 0 26px 6px ${l.glow}` : 'none',
                        opacity: on ? 1 : 0.55,
                      }}
                    />
                  );
                })}
              </div>
              <div className="min-w-0" aria-live="polite">
                <p className="text-sm font-semibold text-slate-500">{auto ? 'অটো চলছে' : 'আপনি বেছে নিয়েছেন'}</p>
                <p className="mt-0.5 text-2xl sm:text-3xl font-bold flex items-center gap-2" style={{ color: cur.color }}>
                  <span aria-hidden="true">{cur.icon}</span> {cur.label} বাতি
                </p>
                <p className="mt-2 text-slate-700 leading-relaxed">{cur.text}</p>
                {auto && <p className="mt-2 text-sm text-slate-500">পরের বাতি: {bn(left)} সেকেন্ড পর</p>}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setAuto((a) => !a);
                }}
                className="rounded-lg bg-brsp-green text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-800 transition"
              >
                {auto ? '⏸ অটো বন্ধ করুন' : '▶ অটো চালু করুন'}
              </button>
              <p className="text-sm text-slate-500">ক্রম: লাল → সবুজ → হলুদ → লাল</p>
            </div>
          </div>

          {/* নিরাপদ দূরত্ব */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="font-bold text-slate-800">নিরাপদ দূরত্ব ক্যালকুলেটর</h3>
            <p className="mt-1 text-sm text-slate-500">পাকা ও ভালো রাস্তায়: গতি (কিমি/ঘণ্টা) ÷ ২ = নিরাপদ দূরত্ব (মিটার)</p>

            <div className="mt-4">
              <label htmlFor="speed" className="flex items-baseline justify-between text-sm font-semibold text-slate-700">
                <span>গাড়ির গতি</span>
                <span className="text-lg font-bold text-brsp-ink">{bn(speed)} কিমি/ঘণ্টা</span>
              </label>
              <input
                id="speed"
                type="range"
                min="10"
                max="120"
                step="5"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="mt-2 w-full accent-[#00694d]"
                aria-valuetext={`${bn(speed)} কিলোমিটার প্রতি ঘণ্টা`}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {[30, 50, 70, 100].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSpeed(v)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      speed === v ? 'bg-brsp-green text-white border-brsp-ink' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {bn(v)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-center" aria-live="polite">
              <p className="text-sm text-slate-600">{risk} — সামনের গাড়ি থেকে অন্তত</p>
              <p className="text-3xl sm:text-4xl font-bold text-brsp-green">{bn(dist % 1 ? dist.toFixed(1) : dist)} মিটার</p>
            </div>

            {/* দূরত্বের ছবি */}
            <div className="mt-4" aria-hidden="true">
              <div className="relative h-14 rounded-xl bg-slate-700 overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-white/40" />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-3xl" style={{ transform: 'translateY(-50%) scaleX(-1)' }}>
                  🚙
                </span>
                <div
                  className="absolute top-1/2 h-0.5 bg-emerald-300 transition-all duration-300"
                  style={{ left: '3.2rem', width: `calc(${pctGap}% * 0.62)` }}
                />
                <span
                  className="absolute top-1/2 text-3xl transition-all duration-300"
                  style={{ left: `calc(3.2rem + ${pctGap}% * 0.62)`, transform: 'translateY(-50%) scaleX(-1)' }}
                >
                  🚗
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
