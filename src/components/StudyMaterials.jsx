import PageBanner from './PageBanner.jsx';
import { STUDY_GROUPS, STUDY_ITEMS } from '../data/study.js';

const btn = 'text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition';
const bnNum = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

function PdfIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v5h5M9 14h6M9 17h4" />
    </svg>
  );
}

// রেগুলার ড্রাইভিং লাইসেন্স পরীক্ষার স্টাডি ম্যাটেরিয়ালস — দেখা ও ডাউনলোড
export default function StudyMaterials() {
  return (
    <>
      <PageBanner
        title="স্টাডি ম্যাটেরিয়ালস"
        subtitle="রেগুলার ড্রাইভিং লাইসেন্স পরীক্ষার প্রস্তুতি"
        chips={[`${bnNum(STUDY_ITEMS.length)}টি ফাইল`, 'দেখুন ও ডাউনলোড করুন']}
      />

      <div className="px-4 sm:px-8 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            ফোনে রেখে অফলাইনে পড়তে চাইলে ‘ডাউনলোড’ চাপুন। ‘দেখুন’ চাপলে নতুন ট্যাবে ফাইল খুলবে।
          </p>

          {STUDY_GROUPS.map((g) => (
            <section key={g.id} id={g.id} className="scroll-mt-20" aria-label={g.title}>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{g.title}</h2>
              <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">{g.lead}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {g.items.map((f) => (
                  <div key={f.file} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col">
                    <div className="flex gap-3">
                      <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-brsp-green/10 text-brsp-green">
                        <PdfIcon />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg text-slate-800 leading-snug">
                          {f.title}
                          {f.tag && <span className="ml-2 align-middle rounded-full bg-brsp-red/10 text-brsp-red px-2 py-0.5 text-xs font-bold">{f.tag}</span>}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                        <p className="mt-1.5 text-xs text-slate-500">{f.pages ? `PDF · ${bnNum(f.pages)} পৃষ্ঠা` : f.kind} · {f.size}</p>
                      </div>
                    </div>
                    {f.previewUrl && (
                      <a href={f.url} target="_blank" rel="noopener noreferrer" className="mt-4 block max-w-xs mx-auto rounded-xl overflow-hidden border border-slate-200 bg-white">
                        <img src={f.previewUrl} width={512} height={768} alt={f.title} loading="lazy" decoding="async" className="w-full h-auto" />
                      </a>
                    )}
                    <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
                      <a href={f.url} target="_blank" rel="noopener noreferrer" className={`${btn} border border-slate-300 text-slate-700 hover:bg-slate-50`}>দেখুন</a>
                      <a href={f.url} download={f.file} className={`${btn} bg-brsp-green text-white hover:bg-emerald-800`}>ডাউনলোড</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
