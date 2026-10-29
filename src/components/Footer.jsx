import { BATCH, CENTER_NAME } from '../data/roster.js';

export default function Footer() {
  return (
    <footer className="bg-white/70 border-t border-slate-200 px-4 py-6 text-center text-xs text-slate-500">
      <p className="font-semibold text-slate-600">
        {BATCH} – গাড়ি ধোয়ার ডিউটি রোস্টার
      </p>
      <p className="mt-1">{CENTER_NAME}</p>
      <p className="mt-1 max-w-2xl mx-auto leading-relaxed">
        সড়ক ও জনপথ অধিদপ্তর কর্তৃক বাস্তবায়নাধীন “বাংলাদেশ সড়ক নিরাপত্তা” প্রকল্প — গণপ্রজাতন্ত্রী বাংলাদেশ সরকার ও বিশ্বব্যাংকের যৌথ অর্থায়নে
      </p>
    </footer>
  );
}
