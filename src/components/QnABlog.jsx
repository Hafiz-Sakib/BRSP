import { useCallback, useEffect, useMemo, useState } from 'react';
import PageBanner from './PageBanner.jsx';
import { QA_LIST, QA_CATEGORIES } from '../data/blog.js';

const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
const POS_KEY = 'brsp-blog-pos';
const btn = 'rounded-lg px-5 py-2.5 text-sm sm:text-base font-semibold transition';
// "ক." "খ।" "১।" "(১)" "-" দিয়ে শুরু হওয়া লাইন তালিকার আইটেম হিসেবে দেখানো হয়
const LIST_LINE = /^(\(?[ক-ঞ]\s*[.।)]|[০-৯]+\s*[.।)]|\([০-৯]+\)|[-•])\s*/;

function readPos() {
  try {
    return JSON.parse(window.localStorage.getItem(POS_KEY)) || {};
  } catch {
    return {};
  }
}
function savePos(v) {
  try {
    window.localStorage.setItem(POS_KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

// ব্লগ-স্টাইল প্রশ্নোত্তর: একটি করে প্রশ্ন, নিচে আগের/পরের বাটন
export default function QnABlog() {
  const [cat, setCat] = useState(() => readPos().cat || 'all');
  const [idx, setIdx] = useState(() => readPos().idx || 0);

  const list = useMemo(() => (cat === 'all' ? QA_LIST : QA_LIST.filter((x) => x.cat === cat)), [cat]);
  const total = list.length;
  const safeIdx = Math.min(Math.max(idx, 0), total - 1);
  const item = list[safeIdx];

  useEffect(() => {
    savePos({ cat, idx: safeIdx });
  }, [cat, safeIdx]);

  const go = useCallback(
    (i) => {
      setIdx(Math.min(Math.max(i, 0), total - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [total]
  );

  // কিবোর্ডের ← → তীর
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight') go(safeIdx + 1);
      if (e.key === 'ArrowLeft') go(safeIdx - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, safeIdx]);

  const count = (id) => (id === 'all' ? QA_LIST.length : QA_LIST.filter((x) => x.cat === id).length);

  return (
    <>
      <PageBanner
        title="প্রশ্নোত্তর ব্লগ"
        subtitle="ড্রাইভিং লাইসেন্স পরীক্ষার প্রশ্ন ও উত্তর — এক এক করে পড়ুন"
        chips={[`${bn(QA_LIST.length)}টি প্রশ্নোত্তর`, 'আগের / পরের বাটনে পড়ুন']}
      />

      <div className="px-4 sm:px-8 py-8 sm:py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="বিভাগ">
            {QA_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={cat === c.id}
                onClick={() => {
                  setCat(c.id);
                  setIdx(0);
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition ${
                  cat === c.id ? 'bg-brsp-green text-white border-brsp-ink' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {c.label} ({bn(count(c.id))})
              </button>
            ))}
          </div>

          <article key={`${cat}-${safeIdx}`} className="anim-page mt-5 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <header className="px-5 sm:px-8 pt-5 sm:pt-6 pb-4 border-b border-slate-100">
              <p className="text-sm font-semibold text-brsp-green">
                প্রশ্ন {bn(safeIdx + 1)} / {bn(total)}
              </p>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-800 leading-snug">{item.q}</h2>
            </header>
            <div className="px-5 sm:px-8 py-5 sm:py-6">
              <p className="text-xs font-bold tracking-wide text-slate-500">উত্তর</p>
              <div className="mt-2 space-y-2.5 text-slate-700 leading-relaxed sm:text-lg">
                {item.a.map((line, i) =>
                  LIST_LINE.test(line) ? (
                    <p key={i} className="pl-4 -indent-4 sm:pl-5 sm:-indent-5">
                      {line}
                    </p>
                  ) : (
                    <p key={i}>{line}</p>
                  )
                )}
              </div>
            </div>
          </article>

          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <button
              type="button"
              onClick={() => go(safeIdx - 1)}
              disabled={safeIdx === 0}
              className={`${btn} justify-self-start border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white`}
            >
              ← আগের
            </button>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="sr-only sm:not-sr-only">প্রশ্ন নং</span>
              <select
                value={safeIdx}
                onChange={(e) => go(Number(e.target.value))}
                aria-label="প্রশ্ন নম্বরে যান"
                className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm font-semibold text-slate-700 max-w-[6.5rem]"
              >
                {list.map((_, i) => (
                  <option key={i} value={i}>
                    {bn(i + 1)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => go(safeIdx + 1)}
              disabled={safeIdx === total - 1}
              className={`${btn} justify-self-end bg-brsp-green text-white hover:bg-emerald-800 disabled:opacity-40 disabled:hover:bg-brsp-green`}
            >
              পরের →
            </button>
          </div>

          <div className="mt-4 h-1.5 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
            <div className="h-full bg-brsp-green transition-all" style={{ width: `${((safeIdx + 1) / total) * 100}%` }} />
          </div>
          <p className="mt-2 text-center text-xs text-slate-500">কিবোর্ডের ← → তীর চেপেও প্রশ্ন বদলানো যায়।</p>
        </div>
      </div>
    </>
  );
}
