import { INSTRUCTOR_PHONE, INSTRUCTOR_PHONE_DISPLAY } from '../data/roster.js';

export default function Footer() {
  return (
    <div className="bg-white/70 border-t border-slate-200 px-4 py-6 text-center text-xs text-slate-500">
      <p>BRSP Batch 2 (Morning) • গাড়ি ধোয়ার ডিউটি রোস্টার • ইনস্ট্রাক্টর রেজাউল স্যার</p>
      <p className="mt-1">
        যোগাযোগ:{' '}
        <a href={`tel:${INSTRUCTOR_PHONE}`} className="font-semibold text-emerald-700 tabular-nums">
          {INSTRUCTOR_PHONE_DISPLAY}
        </a>
      </p>
    </div>
  );
}
