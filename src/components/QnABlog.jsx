import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PageBanner from './PageBanner.jsx';
import { QA_LIST, QA_CATEGORIES } from '../data/blog.js';

const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
const POS_KEY = 'brsp-blog-pos2';
const SAVED_KEY = 'brsp-blog-saved';
const READ_KEY = 'brsp-blog-read';
const SIZE_KEY = 'brsp-blog-size';
const SIZES = ['text-base', 'sm:text-lg text-base', 'text-lg sm:text-xl', 'text-xl sm:text-2xl'];
const btn = 'rounded-xl px-4 py-2.5 text-sm sm:text-base font-semibold whitespace-nowrap press disabled:opacity-40 disabled:cursor-not-allowed';
// "ক." "খ।" "১।" "(১)" "-" দিয়ে শুরু হওয়া লাইন তালিকার আইটেম হিসেবে দেখানো হয়
const LIST_LINE = /^(\(?[ক-ঞ]\s*[.।)]|[০-৯]+\s*[.।)]|\([০-৯]+\)|[-•])\s*/;

const ITEMS = QA_LIST.map((x, gid) => ({ ...x, gid, mins: Math.max(1, Math.ceil(x.a.join(' ').split(/\s+/).length / 110)) }));
const CAT_LABEL = Object.fromEntries(QA_CATEGORIES.map((c) => [c.id, c.label]));

function load(key, fallback) {
  try {
    const v = JSON.parse(window.localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key, v) {
  try {
    window.localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function hl(text, q) {
  const t = q.trim();
  if (!t) return text;
  const parts = text.split(new RegExp(`(${esc(t)})`, 'i'));
  return parts.map((p, i) => (i % 2 ? <mark key={i} className="hl">{p}</mark> : p));
}

const Ic = ({ d, cls = 'w-5 h-5', fill = 'none' }) => (
  <svg className={cls} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const STAR = 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5z';

function IconBtn({ label, on, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} aria-pressed={on} className={`press grid place-items-center w-10 h-10 rounded-full border transition-colors ${on ? 'bg-amber-50 border-amber-300 text-amber-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-brsp-green'}`}>
      {children}
    </button>
  );
}

// ব্লগ-স্টাইল প্রশ্নোত্তর: সার্চ, বিভাগ, বুকমার্ক, মুখস্থ মোড, সাইডবার তালিকা ও আগের/পরের বাটন
export default function QnABlog() {
  const start = useMemo(() => load(POS_KEY, {}), []);
  const [cat, setCat] = useState(start.cat || 'all');
  const [gid, setGid] = useState(Number.isInteger(start.gid) ? start.gid : 0);
  const [q, setQ] = useState('');
  const [onlySaved, setOnlySaved] = useState(false);
  const [saved, setSaved] = useState(() => load(SAVED_KEY, []));
  const [read, setRead] = useState(() => load(READ_KEY, []));
  const [size, setSize] = useState(() => Math.min(3, Math.max(0, load(SIZE_KEY, 1))));
  const [recall, setRecall] = useState(false); // মুখস্থ মোড: উত্তর ঢাকা থাকে
  const [shown, setShown] = useState(false);
  const [dir, setDir] = useState('next');
  const [listOpen, setListOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [progress, setProgress] = useState(0);
  const artRef = useRef(null);
  const sideRef = useRef(null);
  const touch = useRef(null);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return ITEMS.filter((x) => (cat === 'all' || x.cat === cat) && (!onlySaved || saved.includes(x.gid)) && (!t || `${x.q} ${x.a.join(' ')}`.toLowerCase().includes(t)));
  }, [cat, q, onlySaved, saved]);

  const pos = list.findIndex((x) => x.gid === gid);
  const safePos = pos < 0 ? 0 : pos;
  const item = list[safePos];
  const total = list.length;

  useEffect(() => save(POS_KEY, { cat, gid: item ? item.gid : gid }), [cat, gid, item]);
  useEffect(() => save(SIZE_KEY, size), [size]);

  // খোলা প্রশ্ন "পড়া হয়েছে" হিসেবে জমা
  useEffect(() => {
    if (!item) return;
    setShown(false);
    setRead((r) => {
      if (r.includes(item.gid)) return r;
      const n = [...r, item.gid];
      save(READ_KEY, n);
      return n;
    });
  }, [item?.gid]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(''), 1800);
    return () => clearTimeout(id);
  }, [toast]);

  // পড়ার অগ্রগতি বার
  useEffect(() => {
    const onScroll = () => {
      const el = artRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight * 0.6;
      setProgress(span <= 0 ? (r.top < 0 ? 1 : 0) : Math.min(1, Math.max(0, -r.top / span)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [item?.gid, size, recall]);

  // সাইডবারে বর্তমান প্রশ্ন দৃশ্যমান রাখা
  useEffect(() => {
    const cur = sideRef.current?.querySelector('[aria-current="true"]');
    if (cur && sideRef.current) sideRef.current.scrollTo({ top: cur.offsetTop - 80, behavior: 'smooth' });
  }, [item?.gid, cat, onlySaved]);

  const go = useCallback(
    (i) => {
      const n = Math.min(Math.max(i, 0), total - 1);
      if (!list[n]) return;
      setDir(n >= safePos ? 'next' : 'prev');
      setGid(list[n].gid);
      setListOpen(false);
      const el = artRef.current;
      if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [list, total, safePos]
  );

  // কিবোর্ডের ← → তীর
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight') go(safePos + 1);
      if (e.key === 'ArrowLeft') go(safePos - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, safePos]);

  const toggleSave = (id) =>
    setSaved((s) => {
      const n = s.includes(id) ? s.filter((x) => x !== id) : [...s, id];
      save(SAVED_KEY, n);
      setToast(s.includes(id) ? 'বুকমার্ক সরানো হয়েছে' : 'বুকমার্ক করা হয়েছে');
      return n;
    });

  const copy = async () => {
    const text = `${item.q}\n\n${item.a.join('\n')}`;
    try {
      await navigator.clipboard.writeText(text);
      setToast('প্রশ্নোত্তর কপি হয়েছে');
    } catch {
      setToast('কপি করা যায়নি');
    }
  };

  const random = () => {
    if (total < 2) return;
    let n = safePos;
    while (n === safePos) n = Math.floor(Math.random() * total);
    go(n);
  };

  const count = (id) => (id === 'all' ? ITEMS.length : ITEMS.filter((x) => x.cat === id).length);
  const catIdx = Math.max(0, QA_CATEGORIES.findIndex((c) => c.id === cat));
  const covered = answerHidden(recall, shown);
  const readInView = list.filter((x) => read.includes(x.gid)).length;

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const s = touch.current;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    if (Math.abs(dx) > 70 && Math.abs(t.clientY - s.y) < 50) go(safePos + (dx < 0 ? 1 : -1));
    touch.current = null;
  };

  const QList = (
    <ol ref={sideRef} className="max-h-[calc(100vh-11rem)] overflow-y-auto thin-scroll divide-y divide-slate-100">
      {list.map((x, i) => {
        const cur = x.gid === item?.gid;
        return (
          <li key={x.gid}>
            <button type="button" onClick={() => go(i)} aria-current={cur ? 'true' : undefined} className={`w-full flex items-start gap-3 text-left px-3.5 py-3 transition-colors ${cur ? 'bg-emerald-50 border-l-4 border-brsp-green' : 'border-l-4 border-transparent hover:bg-slate-50'}`}>
              <span className={`mt-0.5 grid place-items-center min-w-7 h-7 px-1 rounded-full text-xs font-bold shrink-0 ${cur ? 'bg-brsp-green text-white' : read.includes(x.gid) ? 'bg-emerald-100 text-brsp-green' : 'bg-slate-100 text-slate-500'}`}>
                {read.includes(x.gid) && !cur ? <Ic d="M5 12.5l4.5 4.5L19 7.5" cls="w-3.5 h-3.5" /> : bn(i + 1)}
              </span>
              <span className={`flex-1 text-sm leading-snug line-clamp-2 ${cur ? 'font-bold text-slate-800' : 'text-slate-700'}`}>{hl(x.q, q)}</span>
              {saved.includes(x.gid) && <Ic d={STAR} cls="w-4 h-4 mt-1 shrink-0 text-amber-500" fill="currentColor" />}
            </button>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <PageBanner
        title="প্রশ্নোত্তর ব্লগ"
        subtitle="ড্রাইভিং লাইসেন্স পরীক্ষার প্রশ্ন ও উত্তর — খুঁজুন, পড়ুন, মুখস্থ যাচাই করুন"
        chips={[`${bn(ITEMS.length)}টি প্রশ্নোত্তর`, `${bn(read.length)}টি পড়া হয়েছে`]}
      />

      <div className="fixed left-0 right-0 top-[67px] z-30 h-1 bg-transparent pointer-events-none" aria-hidden="true">
        <div className="h-full bg-brsp-green transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="px-4 sm:px-8 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto">
          {/* সার্চ + টুলস */}
          <div className="flex flex-col md:flex-row gap-3">
            <label className="relative flex-1">
              <span className="sr-only">প্রশ্নোত্তর খুঁজুন</span>
              <Ic d="M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-3.5-3.5" cls="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="প্রশ্ন বা উত্তরের শব্দ খুঁজুন" className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 py-3 outline-none focus:border-brsp-green focus:ring-2 focus:ring-brsp-green/20 transition" />
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <button type="button" onClick={() => setRecall((r) => !r)} aria-pressed={recall} className={`${btn} border ${recall ? 'bg-brsp-green text-white border-brsp-ink' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>মুখস্থ মোড</button>
              <button type="button" onClick={() => setOnlySaved((v) => !v)} aria-pressed={onlySaved} className={`${btn} border ${onlySaved ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>
                ★ সংরক্ষিত ({bn(saved.length)})
              </button>
              <div className="inline-flex rounded-xl border border-slate-300 bg-white overflow-hidden" role="group" aria-label="লেখার আকার">
                <button type="button" onClick={() => setSize((s) => Math.max(0, s - 1))} disabled={size === 0} aria-label="লেখা ছোট করুন" className="px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 press">অ−</button>
                <button type="button" onClick={() => setSize((s) => Math.min(3, s + 1))} disabled={size === 3} aria-label="লেখা বড় করুন" className="px-3 py-2.5 text-base font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 border-l border-slate-300 press">অ+</button>
              </div>
            </div>
          </div>

          {/* বিভাগ ট্যাব */}
          <div className="mt-4 overflow-x-auto no-scrollbar">
            <div role="tablist" aria-label="বিভাগ" className="relative grid min-w-[34rem] sm:min-w-0 rounded-full bg-white border border-slate-200 p-1" style={{ gridTemplateColumns: `repeat(${QA_CATEGORIES.length}, 1fr)` }}>
              <span aria-hidden="true" className="seg-indicator absolute top-1 bottom-1 left-1 rounded-full bg-brsp-green" style={{ width: `calc((100% - 0.5rem) / ${QA_CATEGORIES.length})`, transform: `translateX(${catIdx * 100}%)` }} />
              {QA_CATEGORIES.map((c) => (
                <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} onClick={() => { setCat(c.id); const f = ITEMS.find((x) => c.id === 'all' || x.cat === c.id); if (f) setGid(f.gid); }} className={`relative z-10 rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-300 ${cat === c.id ? 'text-white' : 'text-slate-700 hover:text-brsp-green'}`}>
                  {c.label} ({bn(count(c.id))})
                </button>
              ))}
            </div>
          </div>

          {total === 0 ? (
            <div className="anim-pop mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-bold text-slate-700">কোনো প্রশ্নোত্তর পাওয়া যায়নি</p>
              <p className="mt-1 text-sm text-slate-500">{onlySaved && saved.length === 0 ? 'প্রশ্নের পাশের ★ চেপে বুকমার্ক করুন।' : 'অন্য শব্দ দিয়ে খুঁজুন বা বিভাগ বদলান।'}</p>
              {(q || onlySaved) && <button type="button" onClick={() => { setQ(''); setOnlySaved(false); }} className={`${btn} mt-4 bg-brsp-green text-white hover:bg-emerald-800`}>ফিল্টার মুছুন</button>}
            </div>
          ) : (
            <div className="mt-5 grid gap-6 lg:grid-cols-[19rem_1fr] items-start">
              {/* মোবাইলে ভাঁজ-করা তালিকা */}
              <div className="lg:hidden rounded-2xl bg-white border border-slate-200 overflow-hidden">
                <button type="button" onClick={() => setListOpen((v) => !v)} aria-expanded={listOpen} className="w-full flex items-center justify-between gap-3 px-4 py-3 font-semibold text-slate-800">
                  <span className="whitespace-nowrap">সব প্রশ্নের তালিকা ({bn(total)})</span>
                  <Ic d="M6 9l6 6 6-6" cls={`w-5 h-5 text-slate-400 transition-transform duration-300 ${listOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className="acc-body" data-open={listOpen}><div className="border-t border-slate-100">{listOpen && QList}</div></div>
              </div>
              {/* ডেস্কটপ সাইডবার */}
              <aside className="hidden lg:block sticky top-24 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden" aria-label="প্রশ্নের তালিকা">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <p className="font-bold text-slate-800">প্রশ্নের তালিকা</p>
                  <p className="text-xs font-semibold text-slate-500 whitespace-nowrap">{bn(readInView)}/{bn(total)} পড়া</p>
                </div>
                {QList}
              </aside>

              <div className="min-w-0">
                <article ref={artRef} key={item.gid} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className={`scroll-mt-24 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden ${dir === 'next' ? 'anim-slide-next' : 'anim-slide-prev'}`}>
                  <header className="px-5 sm:px-8 pt-5 sm:pt-6 pb-4 border-b border-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                        <span className="rounded-full bg-brsp-green/10 text-brsp-green px-3 py-0.5 whitespace-nowrap">প্রশ্ন {bn(safePos + 1)} / {bn(total)}</span>
                        <span className="text-slate-500 whitespace-nowrap">{CAT_LABEL[item.cat]}</span>
                        <span className="text-slate-400 whitespace-nowrap">প্রায় {bn(item.mins)} মিনিট</span>
                      </div>
                      <div className="flex gap-2">
                        <IconBtn label={saved.includes(item.gid) ? 'বুকমার্ক সরান' : 'বুকমার্ক করুন'} on={saved.includes(item.gid)} onClick={() => toggleSave(item.gid)}>
                          <Ic d={STAR} fill={saved.includes(item.gid) ? 'currentColor' : 'none'} />
                        </IconBtn>
                        <IconBtn label="কপি করুন" onClick={copy}><Ic d="M9 9h10v11H9zM5 15V4h10" /></IconBtn>
                        <IconBtn label="যেকোনো একটি প্রশ্ন" onClick={random}><Ic d="M4 7h3c4 0 6 10 10 10h3M4 17h3c1.5 0 2.7-1 3.7-2.3M14 8.3C14.8 7.5 15.8 7 17 7h3M17 4l3 3-3 3M17 14l3 3-3 3" /></IconBtn>
                      </div>
                    </div>
                    <h2 className="mt-3 text-xl sm:text-2xl font-bold text-slate-800 leading-snug">{hl(item.q, q)}</h2>
                  </header>

                  <div className="relative px-5 sm:px-8 py-5 sm:py-6">
                    <p className="text-sm font-bold text-slate-500">উত্তর</p>
                    <div className={`mt-2 space-y-2.5 text-slate-700 leading-relaxed transition-[filter,opacity] duration-500 ${SIZES[size]} ${covered ? 'blur-md select-none opacity-60' : ''}`} aria-hidden={covered}>
                      {item.a.map((line, i) => (
                        <p key={i} style={{ '--i': i }} className={`anim-stagger ${LIST_LINE.test(line) ? 'pl-4 -indent-4 sm:pl-5 sm:-indent-5' : ''}`}>{hl(line, q)}</p>
                      ))}
                    </div>
                    {covered && (
                      <div className="absolute inset-0 grid place-items-center">
                        <button type="button" onClick={() => setShown(true)} className={`${btn} bg-brsp-green text-white hover:bg-emerald-800 shadow-lg anim-pop`}>আগে ভাবুন, তারপর উত্তর দেখুন</button>
                      </div>
                    )}
                  </div>
                </article>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => go(safePos - 1)} disabled={safePos === 0} className="lift press text-left rounded-xl border border-slate-300 bg-white px-4 py-3 disabled:opacity-40 disabled:pointer-events-none">
                    <span className="block text-xs font-semibold text-slate-500">← আগের</span>
                    <span className="block text-sm font-semibold text-slate-800 line-clamp-1">{list[safePos - 1]?.q || '—'}</span>
                  </button>
                  <button type="button" onClick={() => go(safePos + 1)} disabled={safePos === total - 1} className="lift press text-right rounded-xl bg-brsp-green text-white px-4 py-3 disabled:opacity-40 disabled:pointer-events-none">
                    <span className="block text-xs font-semibold text-emerald-100">পরের →</span>
                    <span className="block text-sm font-semibold line-clamp-1">{list[safePos + 1]?.q || '—'}</span>
                  </button>
                </div>

                <div className="mt-4 h-1.5 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
                  <div className="h-full bg-brsp-green transition-all duration-500" style={{ width: `${((safePos + 1) / total) * 100}%` }} />
                </div>
                <p className="mt-2 text-center text-xs text-slate-500">কিবোর্ডের ← → তীর বা মোবাইলে ডানে-বামে সোয়াইপ করেও প্রশ্ন বদলানো যায়।</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        {toast && <span className="anim-pop rounded-full bg-brsp-ink text-white px-5 py-2 text-sm font-semibold shadow-lg whitespace-nowrap">{toast}</span>}
      </div>
    </>
  );
}

function answerHidden(recall, shown) {
  return recall && !shown;
}
