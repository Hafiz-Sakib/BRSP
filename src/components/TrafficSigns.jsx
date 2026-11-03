import PageBanner from './PageBanner.jsx';
import signsPreview from '../assets/traffic-signs.jpg';
import { SIGNS_PDF_URL, SIGNS_PDF_FILENAME, SIGN_TYPES, TIPS } from '../data/signs.js';

const btn = 'text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition';

// ট্রাফিক চিহ্নাবলীর PDF (দেখা ও ডাউনলোড) + নিরাপদ ড্রাইভিং টিপস
export default function TrafficSigns() {
  return (
    <>
      <PageBanner title="ট্রাফিক চিহ্ন ও নিরাপদ ড্রাইভিং টিপস" subtitle="সূত্র: বিআরটিএ ট্রাফিক চিহ্নাবলী চার্ট" />

      <div className="px-4 sm:px-8 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* চিহ্নের ধরন */}
          <section aria-label="ট্রাফিক চিহ্নের ধরন">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">ট্রাফিক চিহ্ন মূলত তিন প্রকার</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {SIGN_TYPES.map((s) => (
                <div key={s.title} className={`rounded-2xl border p-4 ${s.cls}`}>
                  <p className="text-xs font-bold opacity-80">{s.shape} চিহ্ন</p>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PDF */}
          <section id="sign-chart" className="scroll-mt-20" aria-label="ট্রাফিক চিহ্নাবলী চার্ট">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">ট্রাফিক চিহ্নাবলী চার্ট</h2>
                <p className="mt-1 text-sm sm:text-base text-slate-600">ছবিতে চাপ দিলে পুরো PDF খুলবে। ফোনে রেখে দিতে ডাউনলোড করুন।</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:w-72 shrink-0">
                <a href={SIGNS_PDF_URL} target="_blank" rel="noopener noreferrer" className={`${btn} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`}>PDF দেখুন</a>
                <a href={SIGNS_PDF_URL} download={SIGNS_PDF_FILENAME} className={`${btn} bg-brsp-green text-white hover:bg-emerald-800`}>ডাউনলোড</a>
              </div>
            </div>
            <a href={SIGNS_PDF_URL} target="_blank" rel="noopener noreferrer" className="mt-5 block max-w-xl mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <img
                src={signsPreview}
                width={1275}
                height={1650}
                alt="বিআরটিএ ট্রাফিক চিহ্নাবলী চার্ট — বাধ্যতামূলক, সতর্কতামূলক ও তথ্যমূলক চিহ্ন"
                loading="lazy"
                decoding="async"
                className="w-full h-auto"
              />
            </a>
          </section>

          {/* টিপস */}
          <section id="safe-tips" className="scroll-mt-20" aria-label="নিরাপদ ড্রাইভিং টিপস">
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
      </div>
    </>
  );
}
