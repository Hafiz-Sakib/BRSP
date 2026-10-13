import { EFFECTIVE_FROM } from '../data/roster.js';

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-600 text-white p-5 sm:p-8 lg:p-10 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="relative z-10">
        <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 text-emerald-100 border border-white/20">
          অফিসিয়াল রোস্টার তালিকা
        </span>
        <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
          BRSP – গাড়ি ধোয়ার রোস্টার
        </h1>
        <p className="text-blue-100 text-sm sm:text-base font-medium max-w-xl mx-auto">
          কার্যকর শুরু:{' '}
          <span className="text-white font-bold underline decoration-emerald-400">
            {EFFECTIVE_FROM}
          </span>
        </p>
      </div>
    </div>
  );
}
