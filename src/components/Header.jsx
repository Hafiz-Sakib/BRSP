import {
  EFFECTIVE_FROM,
  BATCH,
  PROJECT_NAME,
  COURSE_NAME,
  CENTER_NAME,
  ADMISSION_FORM_URL,
} from '../data/roster.js';
import govtLogo from '../assets/logos/govt-bd.png';
import brtcLogo from '../assets/logos/brtc.png';
import worldBankLogo from '../assets/logos/world-bank.png';

const LOGOS = [
  { src: govtLogo, alt: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', w: 438, h: 443, cls: 'h-12 sm:h-[4.5rem]' },
  { src: brtcLogo, alt: 'বাংলাদেশ সড়ক পরিবহণ কর্পোরেশন (বিআরটিসি)', w: 314, h: 292, cls: 'h-12 sm:h-[4.5rem]' },
  { src: worldBankLogo, alt: 'বিশ্বব্যাংক (The World Bank)', w: 480, h: 243, cls: 'h-9 sm:h-14' },
];

function PdfIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="anim-header">
      {/* অফিসিয়াল লোগো স্ট্রিপ */}
      <div className="bg-white border-b-[3px] border-brsp-red px-4 sm:px-8">
        <div className="max-w-6xl mx-auto py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            {LOGOS.map((l, i) => (
              <div key={l.src} className="flex items-center gap-3 sm:gap-6">
                {i > 0 && <span className="w-px h-8 sm:h-10 bg-slate-200" aria-hidden="true" />}
                <img
                  src={l.src}
                  width={l.w}
                  height={l.h}
                  alt={l.alt}
                  className={`${l.cls} w-auto select-none`}
                  draggable="false"
                  decoding="async"
                />
              </div>
            ))}
          </div>
          <p className="hidden md:block text-right text-xs font-semibold text-slate-500 leading-snug">
            গণপ্রজাতন্ত্রী বাংলাদেশ সরকার ও বিশ্বব্যাংকের যৌথ অর্থায়নে
          </p>
        </div>
      </div>

      {/* হিরো */}
      <div className="relative overflow-hidden bg-brsp-ink text-white px-4 sm:px-8">
        <div className="relative z-10 max-w-6xl mx-auto py-8 sm:py-10 lg:py-12 pb-12 sm:pb-14 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-emerald-200 text-sm sm:text-base font-semibold">{PROJECT_NAME}</p>
            <h1 className="mt-1 text-3xl min-[400px]:text-4xl sm:text-5xl font-bold leading-snug tracking-tight">
              গাড়ি ধোয়ার রোস্টার
            </h1>
            <p className="mt-2 text-white/90 text-base sm:text-lg font-medium">{COURSE_NAME}</p>
            <p className="text-white/70 text-sm sm:text-base">{CENTER_NAME}</p>

            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-white text-brsp-ink font-bold px-4 py-1.5">{BATCH}</span>
              <span className="rounded-full border border-white/30 px-4 py-1.5 font-medium">
                কার্যকর শুরু: <span className="font-bold">{EFFECTIVE_FROM}</span>
              </span>
              <span className="rounded-full border border-white/30 px-4 py-1.5 font-medium">
                সকাল ৭:০০ টার মধ্যে উপস্থিত
              </span>
            </div>
          </div>

          {/* ভর্তি ফরম */}
          <div className="no-print w-full lg:w-80 rounded-2xl bg-white text-slate-800 p-4 shadow-xl shadow-black/20">
            <div className="flex items-start gap-3">
              <span className="shrink-0 grid place-items-center w-11 h-11 rounded-xl bg-red-50 text-brsp-red">
                <PdfIcon />
              </span>
              <div>
                <h2 className="font-bold leading-snug">ভর্তি আবেদন ফরম</h2>
                <p className="text-xs text-slate-500 mt-0.5">বিআরটিসি–বিআরএসপি প্রশিক্ষণ কোর্সে ভর্তির ফরম (PDF)</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={ADMISSION_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                দেখুন
              </a>
              <a
                href={ADMISSION_FORM_URL}
                download="BRTC_BRSP_Admission_Form.pdf"
                className="text-center rounded-lg bg-brsp-green px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition"
              >
                ডাউনলোড
              </a>
            </div>
          </div>
        </div>
        <div className="road-dash absolute inset-x-0 bottom-4 h-[3px]" aria-hidden="true" />
      </div>
    </header>
  );
}
