import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PageBanner from './PageBanner.jsx';
import QnABlog from './QnABlog.jsx';
import FileViewer from './FileViewer.jsx';
import signsPreview from '../assets/traffic-signs.jpg';
import { SIGNS_PDF_URL, SIGNS_PDF_FILENAME, SIGN_TYPES, TIPS } from '../data/signs.js';
import { STUDY_GROUPS, STUDY_ITEMS } from '../data/study.js';

const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
const btn = 'text-center rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap press';
const TABS = [
  { id: 'signs', label: 'ট্রাফিক চিহ্ন ও টিপস', short: 'চিহ্ন' },
  { id: 'study', label: 'স্টাডি ম্যাটেরিয়ালস', short: 'স্টাডি' },
  { id: 'blog', label: 'প্রশ্নোত্তর', short: 'প্রশ্নোত্তর' },
];

function Lightbox({ onClose }) {
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  // body-তে রেন্ডার — ট্যাব-প্যানেলের transform অ্যানিমেশন fixed পজিশন আটকে দিত
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="ট্রাফিক চিহ্নাবলী চার্ট" className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-sm" style={{ animation: 'fade-in 0.25s ease-out both', paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center justify-between gap-2 px-4 py-3 text-white">
        <p className="font-semibold truncate">ট্রাফিক চিহ্নাবলী চার্ট</p>
        <div className="flex gap-2 shrink-0">
          <button type="button" onClick={() => setZoom((z) => !z)} className="rounded-full border border-white/40 px-4 py-1.5 text-sm font-semibold whitespace-nowrap hover:bg-white/10 press">
            {zoom ? 'ছোট করুন' : 'বড় করুন'}
          </button>
          <button type="button" onClick={onClose} aria-label="বন্ধ করুন" className="grid place-items-center w-9 h-9 rounded-full bg-white text-brsp-ink press">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto px-3 pb-6 thin-scroll" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <img src={signsPreview} alt="বিআরটিএ ট্রাফিক চিহ্নাবলী চার্ট" className={`mx-auto h-auto rounded-lg bg-white anim-pop transition-[max-width] duration-300 ${zoom ? 'max-w-[1100px] w-[200%] sm:w-full' : 'max-w-xl w-full'}`} />
      </div>
    </div>,
    document.body,
  );
}

function SignsPanel() {
  const [box, setBox] = useState(false);
  const [pdf, setPdf] = useState(false);
  return (
    <div className="space-y-10">
      {/* চিহ্নের ধরন */}
      <section aria-label="ট্রাফিক চিহ্নের ধরন">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">ট্রাফিক চিহ্ন মূলত তিন প্রকার</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {SIGN_TYPES.map((s, i) => (
            <div key={s.title} style={{ '--i': i }} className={`anim-stagger rounded-2xl border p-4 ${s.cls}`}>
              <p className="text-xs font-bold opacity-80">{s.shape} চিহ্ন</p>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* চার্ট */}
      <section id="sign-chart" className="scroll-mt-32" aria-label="ট্রাফিক চিহ্নাবলী চার্ট">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">ট্রাফিক চিহ্নাবলী চার্ট</h2>
            <p className="mt-1 text-sm sm:text-base text-slate-600">ছবিতে চাপ দিলে বড় করে দেখা যাবে। ফোনে রেখে দিতে ডাউনলোড করুন।</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:w-72 shrink-0">
            <button type="button" onClick={() => setPdf(true)} className={`${btn} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`}>PDF দেখুন</button>
            <a href={SIGNS_PDF_URL} download={SIGNS_PDF_FILENAME} className={`${btn} bg-brsp-green text-white hover:bg-emerald-800`}>ডাউনলোড</a>
          </div>
        </div>
        <button type="button" onClick={() => setBox(true)} aria-label="চার্ট বড় করে দেখুন" className="group relative mt-5 block max-w-xl mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm lift">
          <img src={signsPreview} width={1275} height={1650} alt="বিআরটিএ ট্রাফিক চিহ্নাবলী চার্ট — বাধ্যতামূলক, সতর্কতামূলক ও তথ্যমূলক চিহ্ন" loading="lazy" decoding="async" className="w-full h-auto" />
        </button>
        {box && <Lightbox onClose={() => setBox(false)} />}
        {pdf && <FileViewer file={{ url: SIGNS_PDF_URL, title: 'ট্রাফিক চিহ্নাবলী চার্ট', filename: SIGNS_PDF_FILENAME }} onClose={() => setPdf(false)} />}
      </section>

      {/* টিপস */}
      <section id="safe-tips" className="scroll-mt-32" aria-label="নিরাপদ ড্রাইভিং টিপস">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">নিরাপদে ড্রাইভিং করতে যা মেনে চলতে হবে</h2>
        <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">প্রশিক্ষণে শেখা নিয়মগুলো মনে রাখার জন্য সংক্ষেপে দেওয়া হলো।</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {TIPS.map((g) => (
            <div key={g.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <span aria-hidden="true">{g.icon}</span>
                {g.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {g.items.map((t) => (
                  <li key={t} className="flex gap-2.5 text-slate-700 leading-relaxed text-sm sm:text-base">
                    <svg className="w-5 h-5 shrink-0 mt-0.5 text-brsp-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M8 12.5l2.7 2.7L16 9.5" />
                      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PdfIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v5h5M9 14h6M9 17h4" />
    </svg>
  );
}

function StudyPanel() {
  const [q, setQ] = useState('');
  const [grp, setGrp] = useState('all');
  const [prev, setPrev] = useState(null);
  const [view, setView] = useState(null);

  const groups = useMemo(() => {
    const t = q.trim().toLowerCase();
    return STUDY_GROUPS.filter((g) => grp === 'all' || g.id === grp)
      .map((g) => ({ ...g, items: g.items.filter((f) => !t || `${f.title} ${f.desc}`.toLowerCase().includes(t)) }))
      .filter((g) => g.items.length);
  }, [q, grp]);
  const shown = groups.reduce((s, g) => s + g.items.length, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="relative flex-1">
          <span className="sr-only">ফাইল খুঁজুন</span>
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="ফাইলের নাম বা বিষয় খুঁজুন" className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 py-3 outline-none focus:border-brsp-green focus:ring-2 focus:ring-brsp-green/20 transition" />
        </label>
        <p className="self-center text-sm font-semibold text-slate-500 whitespace-nowrap">{bn(shown)}টি ফাইল</p>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1" role="tablist" aria-label="বিভাগ">
        {[{ id: 'all', title: 'সব' }, ...STUDY_GROUPS].map((g) => (
          <button key={g.id} type="button" role="tab" aria-selected={grp === g.id} onClick={() => setGrp(g.id)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold border whitespace-nowrap press ${grp === g.id ? 'bg-brsp-green text-white border-brsp-ink' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>
            {g.title}
          </button>
        ))}
      </div>

      {shown === 0 && (
        <div className="anim-pop mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-bold text-slate-700">কোনো ফাইল পাওয়া যায়নি</p>
          <p className="mt-1 text-sm text-slate-500">অন্য শব্দ দিয়ে খুঁজুন বা বিভাগ ‘সব’ করুন।</p>
        </div>
      )}

      <div className="mt-6 space-y-9">
        {groups.map((g) => (
          <section key={g.id} id={g.id} className="scroll-mt-32" aria-label={g.title}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{g.title}</h2>
            <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">{g.lead}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {g.items.map((f, i) => (
                <div key={f.file} style={{ '--i': i }} className="anim-stagger lift rounded-2xl border border-slate-200 bg-white p-5 flex flex-col">
                  <div className="flex gap-3">
                    <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-brsp-green/10 text-brsp-green"><PdfIcon /></span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg text-slate-800 leading-snug">
                        {f.title}
                        {f.tag && <span className="ml-2 align-middle rounded-full bg-brsp-red/10 text-brsp-red px-2 py-0.5 text-xs font-bold whitespace-nowrap">{f.tag}</span>}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                      <p className="mt-1.5 text-xs text-slate-500">{f.pages ? `PDF · ${bn(f.pages)} পৃষ্ঠা` : f.kind} · {f.size}</p>
                    </div>
                  </div>
                  {f.previewUrl && (
                    <>
                      <button type="button" onClick={() => setPrev(prev === f.file ? null : f.file)} aria-expanded={prev === f.file} className="mt-3 self-start text-sm font-semibold text-brsp-green hover:underline whitespace-nowrap press">
                        {prev === f.file ? 'প্রিভিউ লুকান' : 'প্রিভিউ দেখুন'}
                      </button>
                      <div className="acc-body" data-open={prev === f.file}>
                        <div>
                          <button type="button" onClick={() => setView({ url: f.url, title: f.title, filename: f.file })} className="mt-3 block max-w-xs mx-auto rounded-xl overflow-hidden border border-slate-200 bg-white">
                            <img src={f.previewUrl} width={512} height={768} alt={f.title} loading="lazy" decoding="async" className="w-full h-auto" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setView({ url: f.url, title: f.title, filename: f.file })} className={`${btn} border border-slate-300 text-slate-700 hover:bg-slate-50`}>দেখুন</button>
                    <a href={f.url} download={f.file} className={`${btn} bg-brsp-green text-white hover:bg-emerald-800`}>ডাউনলোড</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      {view && <FileViewer file={view} onClose={() => setView(null)} />}
    </div>
  );
}

// শিক্ষা কেন্দ্র — ট্রাফিক চিহ্ন, স্টাডি ম্যাটেরিয়ালস ও প্রশ্নোত্তর এক জায়গায়, ট্যাব বদলে দেখা যায়
export default function LearnHub({ initial: init = 'signs' }) {
  const initial = init === 'tips' ? 'signs' : TABS.some((t) => t.id === init) ? init : 'signs';
  const [tab, setTab] = useState(initial);
  const [dir, setDir] = useState('next');
  const idx = Math.max(0, TABS.findIndex((t) => t.id === tab));
  const bar = useRef(null);

  useEffect(() => setTab(initial), [initial]);

  const pick = (id) => {
    if (id === tab) return;
    setDir(TABS.findIndex((t) => t.id === id) > idx ? 'next' : 'prev');
    setTab(id);
    window.scrollTo({ top: 0 });
  };

  const onKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = (idx + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length;
    pick(TABS[n].id);
    e.currentTarget.querySelectorAll('[role=tab]')[n]?.focus();
  };

  return (
    <>
      <div ref={bar} style={{ top: 'calc(67px + env(safe-area-inset-top))' }} className="sticky z-30 px-3 sm:px-8 py-2.5 bg-white/90 backdrop-blur border-b border-slate-200">
        <div role="tablist" aria-label="শিক্ষা কেন্দ্র" onKeyDown={onKey} className="relative max-w-3xl mx-auto grid grid-cols-3 rounded-full bg-white border border-brsp-green/30 shadow-md shadow-black/5 p-1">
          <span aria-hidden="true" className="seg-indicator absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-brsp-green" style={{ transform: `translateX(${idx * 100}%)` }} />
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} tabIndex={tab === t.id ? 0 : -1} onClick={() => pick(t.id)} className={`relative z-10 rounded-full px-1 sm:px-2 py-2.5 text-xs sm:text-base font-semibold whitespace-nowrap transition-colors duration-300 ${tab === t.id ? 'text-white' : 'text-slate-700 hover:text-brsp-green'}`}>
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div key={tab} role="tabpanel" className={`overflow-x-clip ${dir === 'next' ? 'anim-slide-next' : 'anim-slide-prev'}`}>
        {tab === 'blog' ? (
          <QnABlog />
        ) : (
          <>
            <PageBanner
              title={tab === 'signs' ? 'ট্রাফিক চিহ্ন ও টিপস' : 'স্টাডি ম্যাটেরিয়ালস'}
              subtitle="রেগুলার ড্রাইভিং লাইসেন্স পরীক্ষার প্রস্তুতি"
              chips={['শিক্ষা কেন্দ্র', `${bn(STUDY_ITEMS.length)}টি স্টাডি ফাইল`]}
            />
            <div className="px-4 sm:px-8 py-8 sm:py-10">
              <div className="max-w-6xl mx-auto">{tab === 'signs' ? <SignsPanel /> : <StudyPanel />}</div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
