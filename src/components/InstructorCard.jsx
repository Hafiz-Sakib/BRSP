import { INSTRUCTOR, INSTRUCTOR_PHONE, INSTRUCTOR_PHONE_DISPLAY } from '../data/roster.js';

// শুধু রোস্টার পেজের একদম শেষে একবার দেখানো হয়
export default function InstructorCard() {
  return (
    <section className="px-3 pb-8 sm:px-6 lg:px-10 max-w-[96rem] mx-auto">
      <div className="max-w-xl mx-auto sm:mx-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">ডিউটি বা রোস্টার সংক্রান্ত যোগাযোগ</p>
          <p className="mt-0.5 text-lg font-bold text-slate-800">ইনস্ট্রাক্টর {INSTRUCTOR}</p>
        </div>
        <a
          href={`tel:${INSTRUCTOR_PHONE}`}
          className="no-print inline-flex items-center gap-2 rounded-full bg-brsp-green px-4 py-2 text-sm font-bold text-white tabular-nums hover:bg-emerald-800 transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.3a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.5 1.2l-1.6.8a11 11 0 005.3 5.3l.8-1.6a1 1 0 011.2-.5l3.3 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.7 21 3 14.3 3 6V5z" />
          </svg>
          {INSTRUCTOR_PHONE_DISPLAY}
        </a>
        <p className="hidden print:block text-base font-bold tabular-nums">{INSTRUCTOR_PHONE_DISPLAY}</p>
      </div>
    </section>
  );
}
