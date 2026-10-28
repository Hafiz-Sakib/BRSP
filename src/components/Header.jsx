import { EFFECTIVE_FROM, BATCH, INSTRUCTOR, INSTRUCTOR_PHONE, INSTRUCTOR_PHONE_DISPLAY } from '../data/roster.js';
import carWash from '../assets/car-wash.gif';

export default function Header() {
  return (
    <header className="anim-header bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-600 text-white px-4 py-7 sm:px-8 sm:py-10 lg:py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
        {/* GIF — মোবাইলে উপরে, পিসিতে ডানে */}
        <div className="order-1 lg:order-2 w-full max-w-[17rem] min-[400px]:max-w-xs sm:max-w-sm lg:max-w-md shrink-0 print:hidden">
          <div className="rounded-3xl p-1.5 bg-white/25 backdrop-blur-sm shadow-2xl shadow-blue-950/30 ring-1 ring-white/40">
            <img
              src={carWash}
              width={480}
              height={360}
              alt="গাড়ি ধোয়ার অ্যানিমেশন"
              className="block w-full h-auto rounded-[1.25rem] bg-[#109ada] select-none"
              draggable="false"
              decoding="async"
            />
          </div>
        </div>

        <div className="order-2 lg:order-1 flex-1 text-center lg:text-left">
          <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 text-emerald-100 border border-white/20">
            {BATCH}
          </span>
          <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 leading-tight">
            BRSP – গাড়ি ধোয়ার রোস্টার
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base font-semibold mb-1 whitespace-nowrap">
            ইনস্ট্রাক্টর: {INSTRUCTOR}
          </p>
          <p className="mb-2 whitespace-nowrap">
            <a
              href={`tel:${INSTRUCTOR_PHONE}`}
              className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/25 rounded-full px-3 py-1 text-sm font-bold text-white tabular-nums transition"
            >
              <span aria-hidden="true">📞</span>
              {INSTRUCTOR_PHONE_DISPLAY}
            </a>
          </p>
          <p className="text-blue-100 text-sm sm:text-base font-medium">
            কার্যকর শুরু:{' '}
            <span className="text-white font-bold underline decoration-emerald-400">
              {EFFECTIVE_FROM}
            </span>
          </p>
        </div>
      </div>
    </header>
  );
}
