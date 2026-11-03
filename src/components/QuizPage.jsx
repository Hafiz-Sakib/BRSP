import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PageBanner from './PageBanner.jsx';
import { QUIZ_BANK } from '../data/quiz.js';

const COUNTS = [5, 10, 20]; // প্রতিবার কয়টি প্রশ্ন
const LAST_KEY = 'brsp-quiz-last-ids'; // আগের বারের প্রশ্ন (এবার বাদ দেওয়ার জন্য)
const OLD_BEST_KEY = 'brsp-quiz-best'; // পুরনো সংস্করণ: ১০-এর মধ্যে নম্বর
const BEST_KEY = 'brsp-quiz-best-pct'; // এখন: শতকরা হার
const PREF_KEY = 'brsp-quiz-pref';
const LETTERS = ['ক', 'খ', 'গ', 'ঘ'];
// "উপরের সবগুলো সঠিক" ধরনের অপশন থাকলে অপশনের ক্রম বদলানো হয় না
const ALL_ABOVE = /উপরের|ওপরের|সবগুলো|সবগুলি|সব গুলো|সব কয়টি|সবকয়টি|সবগুলোর/;

const KEYMAP = { 1: 0, 2: 1, 3: 2, 4: 3, '১': 0, '২': 1, '৩': 2, '৪': 3 };
const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
const fmtTime = (s) => `${bn(String(Math.floor(s / 60)).padStart(2, '0'))}:${bn(String(s % 60).padStart(2, '0'))}`;
const withQ = (t) => t + (/[?।]$/.test(t) ? '' : '?');

// localStorage বন্ধ থাকলেও (প্রাইভেট মোড) যেন কুইজ চলে
let memory = {};
const store = {
  get(k, fallback) {
    try {
      const v = window.localStorage.getItem(k);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return k in memory ? memory[k] : fallback;
    }
  },
  set(k, v) {
    memory[k] = v;
    try {
      window.localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  },
};

function readBest() {
  const pct = store.get(BEST_KEY, null);
  if (pct != null) return pct;
  const old = store.get(OLD_BEST_KEY, null);
  return old != null ? old * 10 : null;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// র‍্যান্ডম প্রশ্ন — আগের বারের প্রশ্নগুলো বাদ দিয়ে (প্রশ্ন কম পড়লে তবেই আগেরগুলো থেকে নেওয়া হয়)
function buildQuiz(count) {
  const last = new Set(store.get(LAST_KEY, []));
  const fresh = shuffle(QUIZ_BANK.filter((q) => !last.has(q.id)));
  let picked = fresh.slice(0, count);
  if (picked.length < count) {
    const rest = shuffle(QUIZ_BANK.filter((q) => last.has(q.id)));
    picked = [...picked, ...rest.slice(0, count - picked.length)];
  }
  store.set(LAST_KEY, picked.map((q) => q.id));
  return picked.map((q) => {
    const order = q.o.map((_, i) => i);
    const keepOrder = q.o.some((t) => ALL_ABOVE.test(t));
    const idx = keepOrder ? order : shuffle(order);
    return { id: q.id, q: q.q, options: idx.map((i) => q.o[i]), answer: idx.indexOf(q.a) };
  });
}

function useCountUp(target, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setV(target);
      return undefined;
    }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

const Svg = ({ d, cls = 'w-5 h-5 shrink-0', sw = 2.6 }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const CHECK = 'M5 12.5l4.5 4.5L19 7.5';
const CROSS = 'M6 6l12 12M18 6L6 18';

const btn = 'rounded-xl px-5 py-3 text-sm sm:text-base font-semibold whitespace-nowrap press disabled:opacity-40 disabled:cursor-not-allowed';
const primary = `${btn} bg-brsp-green text-white hover:bg-emerald-800 shadow-sm`;
const ghost = `${btn} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;

function Stat({ label, value, i }) {
  return (
    <div style={{ '--i': i }} className="anim-stagger rounded-2xl bg-white border border-slate-200 p-4 text-center">
      <p className="text-2xl sm:text-3xl font-bold text-brsp-ink">{value}</p>
      <p className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-500 whitespace-nowrap">{label}</p>
    </div>
  );
}

function Intro({ onStart, best, pref, setPref }) {
  const modes = [
    { id: 'practice', title: 'অনুশীলন মোড', desc: 'উত্তর দেওয়ার সাথে সাথেই সঠিক-ভুল দেখা যাবে।', icon: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z' },
    { id: 'exam', title: 'পরীক্ষা মোড', desc: 'সময় গোনা হবে, ফলাফল শেষে একসাথে দেখা যাবে।', icon: 'M12 7v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat i={0} label="প্রশ্নের ভান্ডার" value={bn(QUIZ_BANK.length)} />
        <Stat i={1} label="সেরা ফলাফল" value={best != null ? `${bn(best)}%` : '—'} />
        <Stat i={2} label="প্রতিবার" value={`${bn(pref.count)}টি`} />
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-7 anim-stagger" style={{ '--i': 3 }}>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">নিজের প্রস্তুতি যাচাই করুন</h2>
        <p className="mt-1 text-slate-600 leading-relaxed">মোড ও প্রশ্নসংখ্যা বেছে নিন। প্রতিবার র‍্যান্ডম প্রশ্ন আসে, আগের বারের প্রশ্ন যথাসম্ভব বাদ যায়।</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="মোড">
          {modes.map((m) => {
            const on = pref.mode === m.id;
            return (
              <button key={m.id} type="button" role="radio" aria-checked={on} onClick={() => setPref({ ...pref, mode: m.id })} className={`press lift text-left flex gap-3 rounded-xl border p-4 ${on ? 'border-brsp-green bg-emerald-50 ring-1 ring-brsp-green' : 'border-slate-200 bg-white'}`}>
                <span className={`grid place-items-center w-10 h-10 shrink-0 rounded-xl transition-colors ${on ? 'bg-brsp-green text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Svg d={m.icon} sw={2} />
                </span>
                <span>
                  <span className="block font-bold text-slate-800">{m.title}</span>
                  <span className="block text-sm text-slate-600 leading-relaxed">{m.desc}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-slate-600">প্রশ্নসংখ্যা</span>
          <div className="inline-flex rounded-full bg-slate-100 p-1" role="radiogroup" aria-label="প্রশ্নসংখ্যা">
            {COUNTS.map((c) => (
              <button key={c} type="button" role="radio" aria-checked={pref.count === c} onClick={() => setPref({ ...pref, count: c })} className={`rounded-full px-4 py-1.5 text-sm font-bold whitespace-nowrap transition-all duration-300 ${pref.count === c ? 'bg-brsp-green text-white shadow' : 'text-slate-600 hover:text-brsp-green'}`}>
                {bn(c)}টি
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button type="button" onClick={onStart} className={`${primary} anim-pulse px-7`}>কুইজ শুরু করুন</button>
          <span className="hidden sm:inline text-xs text-slate-500">কিবোর্ডে ১–৪ চেপেও উত্তর দেওয়া যায়।</span>
        </div>
      </div>
    </div>
  );
}

function Question({ item, index, total, selected, dir, mode, elapsed, streak, onSelect, onNext, onPrev, onJump, quiz }) {
  const headRef = useRef(null);
  const practice = mode === 'practice';
  const chosen = selected[index];
  const locked = practice && chosen != null;
  const last = index === total - 1;
  const answered = selected.filter((s) => s != null).length;

  useEffect(() => {
    headRef.current?.focus({ preventScroll: true });
  }, [index]);

  // কিবোর্ড: ১–৪ = উত্তর, ← → = আগের/পরের
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const o = KEYMAP[e.key];
      if (o != null && o < item.options.length && !locked) onSelect(o);
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (practice && chosen == null) return;
        e.preventDefault();
        onNext();
      }
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, locked, chosen, practice, onSelect, onNext, onPrev]);

  const state = (i) => {
    if (!practice) return chosen === i ? 'picked' : 'idle';
    if (chosen == null) return 'idle';
    if (i === item.answer) return 'right';
    if (i === chosen) return 'wrong';
    return 'dim';
  };
  const OPT = {
    idle: 'border-slate-200 bg-white hover:bg-slate-50 hover:border-brsp-green/50',
    picked: 'border-brsp-green bg-emerald-50 ring-1 ring-brsp-green',
    right: 'border-brsp-green bg-emerald-50 ring-1 ring-brsp-green',
    wrong: 'border-brsp-red bg-red-50 ring-1 ring-brsp-red anim-shake',
    dim: 'border-slate-200 bg-white opacity-55',
  };
  const BADGE = {
    idle: 'bg-slate-100 text-slate-600',
    picked: 'bg-brsp-green text-white',
    right: 'bg-brsp-green text-white',
    wrong: 'bg-brsp-red text-white',
    dim: 'bg-slate-100 text-slate-500',
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-8">
      <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-500">
        <span className="whitespace-nowrap">প্রশ্ন {bn(index + 1)} / {bn(total)}</span>
        <span className="flex items-center gap-3">
          {practice && streak >= 2 && <span className="anim-pop rounded-full bg-amber-100 text-amber-700 px-2.5 py-0.5 text-xs font-bold whitespace-nowrap">🔥 {bn(streak)}টি টানা সঠিক</span>}
          <span className="rounded-full bg-slate-100 px-3 py-1 tabular-nums text-slate-700 whitespace-nowrap" aria-label="সময়">⏱ {fmtTime(elapsed)}</span>
        </span>
      </div>

      <div className="mt-3 flex gap-1" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answered} aria-label="কুইজের অগ্রগতি">
        {quiz.map((q, i) => {
          const s = selected[i];
          let c = 'bg-slate-200';
          if (s != null) c = practice ? (s === q.answer ? 'bg-brsp-green' : 'bg-brsp-red') : 'bg-brsp-green/70';
          const canJump = !practice || s != null || i === index;
          return (
            <button key={q.id} type="button" disabled={!canJump} onClick={() => onJump(i)} aria-label={`প্রশ্ন ${bn(i + 1)}`} className="group flex-1 h-5 grid items-center disabled:cursor-default">
              <span className={`block h-2 rounded-full transition-all duration-300 ${c} ${i === index ? 'ring-2 ring-offset-1 ring-brsp-ink/40 scale-y-125' : 'group-enabled:group-hover:scale-y-125'}`} />
            </button>
          );
        })}
      </div>

      <div key={index} className={dir === 'next' ? 'anim-slide-next' : 'anim-slide-prev'}>
        <h2 ref={headRef} tabIndex={-1} className="mt-5 text-lg sm:text-xl font-bold text-slate-800 leading-snug outline-none">
          {withQ(item.q)}
        </h2>

        <div role="radiogroup" aria-label="উত্তরের অপশন" className="mt-5 grid gap-3">
          {item.options.map((opt, i) => {
            const st = state(i);
            return (
              <button key={opt} type="button" role="radio" aria-checked={chosen === i} disabled={locked} onClick={() => onSelect(i)} style={{ '--i': i }} className={`anim-stagger press flex items-start gap-3 text-left rounded-xl border px-4 py-3 transition-colors disabled:cursor-default ${OPT[st]}`}>
                <span className={`grid place-items-center w-8 h-8 shrink-0 rounded-full text-sm font-bold transition-colors ${BADGE[st]}`}>{LETTERS[i]}</span>
                <span className="flex-1 pt-0.5 text-slate-800 leading-relaxed">{opt}</span>
                {st === 'right' && <Svg d={CHECK} cls="w-6 h-6 mt-0.5 shrink-0 text-brsp-green anim-pop" />}
                {st === 'wrong' && <Svg d={CROSS} cls="w-6 h-6 mt-0.5 shrink-0 text-brsp-red anim-pop" />}
              </button>
            );
          })}
        </div>

        {practice && chosen != null && (
          <p role="status" className={`anim-pop mt-4 rounded-xl px-4 py-2.5 text-sm font-semibold ${chosen === item.answer ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
            {chosen === item.answer ? 'সঠিক উত্তর! চমৎকার।' : `ভুল হয়েছে। সঠিক উত্তর: ${LETTERS[item.answer]}) ${item.options[item.answer]}`}
          </p>
        )}
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <button type="button" onClick={onPrev} disabled={index === 0} className={ghost}>← আগের</button>
        <button type="button" onClick={onNext} disabled={practice && chosen == null} className={primary}>
          {last ? (practice ? 'ফলাফল দেখুন' : `জমা দিন${answered < total ? ` (${bn(total - answered)}টি বাকি)` : ''}`) : chosen == null ? 'এড়িয়ে যান →' : 'পরবর্তী →'}
        </button>
      </div>
    </div>
  );
}

function Confetti() {
  const bits = useMemo(
    () => Array.from({ length: 36 }, (_, i) => ({
      left: Math.random() * 100,
      dx: Math.round((Math.random() - 0.5) * 160),
      rot: Math.round(Math.random() * 720),
      d: (Math.random() * 0.6).toFixed(2),
      c: ['#00694d', '#c8283a', '#f59e0b', '#0ea5e9', '#a3e635'][i % 5],
    })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden" aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} className="confetti-bit" style={{ left: `${b.left}%`, background: b.c, '--dx': `${b.dx}px`, '--rot': `${b.rot}deg`, '--d': `${b.d}s` }} />
      ))}
    </div>
  );
}

function Result({ quiz, selected, elapsed, isNewBest, onAgain, onRetryWrong, onNavigate, mode }) {
  const [filter, setFilter] = useState('all');
  const score = quiz.reduce((s, q, i) => s + (selected[i] === q.answer ? 1 : 0), 0);
  const skipped = selected.filter((s) => s == null).length;
  const wrong = quiz.length - score - skipped;
  const pct = Math.round((score / quiz.length) * 100);
  const shownScore = useCountUp(score);
  const shownPct = useCountUp(pct);
  const verdict =
    pct >= 90 ? 'অসাধারণ! আপনি পরীক্ষার জন্য প্রায় প্রস্তুত।' : pct >= 70 ? 'ভালো হয়েছে! আরেকটু অনুশীলন করুন।' : pct >= 50 ? 'চলনসই। প্রশ্নোত্তর পড়ে আবার চেষ্টা করুন।' : 'আরও পড়াশোনা দরকার। প্রশ্নোত্তর পড়ে আবার চেষ্টা করুন।';
  const color = pct >= 70 ? '#00694d' : pct >= 50 ? '#d97706' : '#c8283a';
  const R = 52;
  const LEN = 2 * Math.PI * R;
  const OFF = LEN * (1 - pct / 100);

  const rows = quiz.map((q, i) => ({ q, i, ok: selected[i] === q.answer })).filter((r) => filter === 'all' || (filter === 'ok' ? r.ok : !r.ok));
  const FILTERS = [
    { id: 'all', label: `সব (${bn(quiz.length)})` },
    { id: 'bad', label: `ভুল/বাদ (${bn(wrong + skipped)})` },
    { id: 'ok', label: `সঠিক (${bn(score)})` },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
        {pct >= 70 && <Confetti />}
        {isNewBest && <p className="anim-pop relative inline-block mb-3 rounded-full bg-amber-100 text-amber-800 px-4 py-1 text-sm font-bold whitespace-nowrap">🏆 নতুন সেরা ফলাফল!</p>}
        <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={R} fill="none" stroke="#e2e8f0" strokeWidth="10" />
            <circle cx="60" cy="60" r={R} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" className="ring-arc" style={{ '--ring-len': LEN, '--ring-off': OFF, strokeDashoffset: OFF }} />
          </svg>
          <div className="absolute inset-0 grid place-content-center">
            <p className="text-4xl sm:text-5xl font-bold tabular-nums" style={{ color }}>
              {bn(shownScore)}<span className="text-xl sm:text-2xl text-slate-400"> / {bn(quiz.length)}</span>
            </p>
            <p className="text-slate-600 font-semibold tabular-nums">{bn(shownPct)}%</p>
          </div>
        </div>
        <p className="relative mt-4 text-slate-700 font-semibold">{verdict}</p>

        <div className="relative mt-5 grid grid-cols-3 gap-3 max-w-md mx-auto">
          <Stat i={0} label="সঠিক" value={bn(score)} />
          <Stat i={1} label="ভুল/বাদ" value={bn(wrong + skipped)} />
          <Stat i={2} label={mode === 'exam' ? 'সময়' : 'সময় (সেকেন্ড)'} value={mode === 'exam' ? fmtTime(elapsed) : bn(elapsed)} />
        </div>

        <div className="relative mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={onAgain} className={primary}>নতুন কুইজ দিন</button>
          {wrong + skipped > 0 && <button type="button" onClick={onRetryWrong} className={ghost}>ভুলগুলো আবার দিন</button>}
          <button type="button" onClick={() => onNavigate('blog')} className={ghost}>প্রশ্নোত্তর পড়ুন</button>
        </div>
      </div>

      <section aria-label="সঠিক উত্তরসহ পর্যালোচনা">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-800">সঠিক উত্তরসহ পর্যালোচনা</h2>
          <div className="inline-flex rounded-full bg-slate-100 p-1" role="tablist" aria-label="ফিল্টার">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)} className={`rounded-full px-3 py-1 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${filter === f.id ? 'bg-brsp-green text-white shadow' : 'text-slate-600 hover:text-brsp-green'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {rows.length === 0 && <p className="anim-pop mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">এই ফিল্টারে কোনো প্রশ্ন নেই।</p>}
        <ol key={filter} className="mt-4 space-y-4">
          {rows.map(({ q, i, ok }, n) => (
            <li key={q.id} style={{ '--i': Math.min(n, 8) }} className={`anim-stagger rounded-2xl border bg-white p-4 sm:p-5 ${ok ? 'border-emerald-300' : 'border-red-300'}`}>
              <div className="flex items-start gap-3">
                <span className={`grid place-items-center w-8 h-8 shrink-0 rounded-full text-white text-sm font-bold ${ok ? 'bg-brsp-green' : 'bg-brsp-red'}`}>{bn(i + 1)}</span>
                <h3 className="font-bold text-slate-800 leading-snug pt-0.5">{withQ(q.q)}</h3>
              </div>
              <ul className="mt-3 space-y-2 pl-0 sm:pl-11">
                {q.options.map((opt, oi) => {
                  const isRight = oi === q.answer;
                  const isMine = oi === selected[i];
                  let cls = 'border-slate-200 text-slate-700 bg-white';
                  if (isRight) cls = 'border-brsp-green bg-emerald-50 text-emerald-900 font-semibold';
                  else if (isMine) cls = 'border-brsp-red bg-red-50 text-red-900';
                  return (
                    <li key={opt} className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm sm:text-base ${cls}`}>
                      <span className="font-bold shrink-0">{LETTERS[oi]})</span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                      {isRight && <span className="flex items-center gap-1 shrink-0 text-brsp-green text-xs font-bold whitespace-nowrap"><Svg d={CHECK} /> সঠিক উত্তর</span>}
                      {!isRight && isMine && <span className="flex items-center gap-1 shrink-0 text-brsp-red text-xs font-bold whitespace-nowrap"><Svg d={CROSS} /> আপনার উত্তর</span>}
                    </li>
                  );
                })}
              </ul>
              {selected[i] == null && <p className="mt-2 text-sm text-slate-500 sm:pl-11">উত্তর দেওয়া হয়নি।</p>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default function QuizPage({ onNavigate }) {
  const [phase, setPhase] = useState('intro'); // intro | quiz | result
  const [pref, setPrefState] = useState(() => {
    const p = store.get(PREF_KEY, {});
    return { mode: p.mode === 'exam' ? 'exam' : 'practice', count: COUNTS.includes(p.count) ? p.count : 10 };
  });
  const [quiz, setQuiz] = useState([]);
  const [selected, setSelected] = useState([]);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState('next');
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);
  const [retry, setRetry] = useState(false);
  const [streak, setStreak] = useState(0);

  const setPref = (p) => {
    setPrefState(p);
    store.set(PREF_KEY, p);
  };

  // সময় গণনা (কুইজ চলাকালে)
  useEffect(() => {
    if (phase !== 'quiz') return undefined;
    const t0 = Date.now() - elapsed * 1000;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const begin = (q, isRetry) => {
    setQuiz(q);
    setSelected(Array(q.length).fill(null));
    setIndex(0);
    setDir('next');
    setElapsed(0);
    setStreak(0);
    setIsNewBest(false);
    setRetry(isRetry);
    setPhase('quiz');
    window.scrollTo({ top: 0 });
  };
  const start = () => begin(buildQuiz(pref.count), false);
  const retryWrong = () => {
    const wrongOnes = quiz.filter((q, i) => selected[i] !== q.answer);
    begin(shuffle(wrongOnes), true);
  };

  const finish = useCallback(() => {
    const score = quiz.reduce((s, q, i) => s + (selected[i] === q.answer ? 1 : 0), 0);
    const pct = Math.round((score / quiz.length) * 100);
    if (!retry && (best == null || pct > best)) {
      store.set(BEST_KEY, pct);
      setBest(pct);
      setIsNewBest(best != null && pct > 0);
    }
    setPhase('result');
    window.scrollTo({ top: 0 });
  }, [quiz, selected, retry, best]);

  const next = useCallback(() => {
    if (index === quiz.length - 1) return finish();
    setDir('next');
    setIndex((i) => i + 1);
    return undefined;
  }, [index, quiz.length, finish]);
  const prev = useCallback(() => {
    setDir('prev');
    setIndex((i) => Math.max(0, i - 1));
  }, []);
  const jump = (i) => {
    setDir(i > index ? 'next' : 'prev');
    setIndex(i);
  };
  const select = useCallback(
    (o) => {
      setSelected((s) => s.map((v, k) => (k === index ? o : v)));
      if (pref.mode === 'practice') setStreak((st) => (o === quiz[index].answer ? st + 1 : 0));
    },
    [index, pref.mode, quiz]
  );

  const chips = useMemo(() => [`${bn(QUIZ_BANK.length)}টি প্রশ্নের ভান্ডার`, 'অনুশীলন ও পরীক্ষা মোড'], []);

  return (
    <>
      <PageBanner title="ড্রাইভিং লাইসেন্স কুইজ" subtitle="লিখিত ও মৌখিক পরীক্ষার প্রস্তুতি" chips={chips} />
      <div className="px-4 sm:px-8 py-8 sm:py-10">
        <div className="max-w-3xl mx-auto">
          {phase === 'intro' && <Intro onStart={start} best={best} pref={pref} setPref={setPref} />}
          {phase === 'quiz' && quiz[index] && (
            <Question quiz={quiz} item={quiz[index]} index={index} total={quiz.length} selected={selected} dir={dir} mode={pref.mode} elapsed={elapsed} streak={streak} onSelect={select} onNext={next} onPrev={prev} onJump={jump} />
          )}
          {phase === 'result' && <Result quiz={quiz} selected={selected} elapsed={elapsed} isNewBest={isNewBest} mode={pref.mode} onAgain={start} onRetryWrong={retryWrong} onNavigate={onNavigate} />}
        </div>
      </div>
    </>
  );
}
