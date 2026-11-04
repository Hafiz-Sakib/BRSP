// সাপ্তাহিক রুটিন — স্যারের নির্দেশ অনুযায়ী প্রতি সপ্তাহে একই নিয়মে (শুধু প্রাইভেট অ্যাপে)
// পরিবর্তন করতে নিচের PLAN তালিকা এডিট করুন
const PLAN = [
  { day: 'রবিবার', icon: 'drive', tone: 'emerald', title: 'ড্রাইভিং অনুশীলন', from: 'সার্জিনাজ হাসপাতালের সামনে', to: 'বায়েজিদ লিংক রোড' },
  { day: 'সোমবার', icon: 'zigzag', tone: 'amber', title: 'জিগজ্যাগ অনুশীলন', place: 'চট্টগ্রাম বাস ডিপো' },
  { day: 'মঙ্গলবার', icon: 'book', tone: 'rose', title: 'থিউরি ক্লাস', note: 'কুদরত স্যারের ক্লাস' },
  { day: 'বুধবার', icon: 'drive', tone: 'blue', title: 'ড্রাইভিং অনুশীলন', from: 'সার্জিনাজ হাসপাতালের সামনে', to: 'বায়েজিদ লিংক রোড' },
  { day: 'বৃহস্পতিবার', icon: 'zigzag', tone: 'purple', title: 'জিগজ্যাগ অনুশীলন', place: 'চট্টগ্রাম বাস ডিপো' },
];

const TONES = {
  emerald: { card: 'border-emerald-200 bg-emerald-50', badge: 'bg-emerald-100 text-emerald-800', icon: 'bg-emerald-500', ring: 'ring-emerald-400' },
  amber: { card: 'border-amber-200 bg-amber-50', badge: 'bg-amber-100 text-amber-800', icon: 'bg-amber-500', ring: 'ring-amber-400' },
  rose: { card: 'border-rose-200 bg-rose-50', badge: 'bg-rose-100 text-rose-800', icon: 'bg-rose-500', ring: 'ring-rose-400' },
  blue: { card: 'border-blue-200 bg-blue-50', badge: 'bg-blue-100 text-blue-800', icon: 'bg-blue-500', ring: 'ring-blue-400' },
  purple: { card: 'border-purple-200 bg-purple-50', badge: 'bg-purple-100 text-purple-800', icon: 'bg-purple-500', ring: 'ring-purple-400' },
};

const DAY_NAMES = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

const PATHS = {
  drive: 'M5 17h14M6 17l1.5-6h9L18 17M7.5 11l1-3h7l1 3M7 17v2m10-2v2',
  zigzag: 'M3 18l4-12 5 12 5-12 4 12',
  book: 'M12 6.25v13m0-13C10.83 5.48 9.25 5 7.5 5S4.17 5.48 3 6.25v13C4.17 18.48 5.75 18 7.5 18s3.33.48 4.5 1.25m0-13C13.17 5.48 14.75 5 16.5 5c1.75 0 3.33.48 4.5 1.25v13C19.83 18.48 18.25 18 16.5 18c-1.75 0-3.33.48-4.5 1.25',
};

export default function WeeklyPlan() {
  const today = DAY_NAMES[new Date().getDay()];

  return (
    <section aria-labelledby="weekly-plan-title" className="px-4 pt-5 sm:px-8 lg:px-10">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 id="weekly-plan-title" className="text-base font-bold text-brsp-ink sm:text-lg">
            📌 এখন থেকে প্রতি সপ্তাহের রুটিন
          </h3>
          <span className="rounded-full bg-brsp-green/10 px-2.5 py-0.5 text-xs font-semibold text-brsp-green">স্যারের নির্দেশ</span>
        </div>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">প্রতি সপ্তাহে একই নিয়মে — কোন দিন কোথায় থাকতে হবে।</p>

        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {PLAN.map((p) => {
            const t = TONES[p.tone];
            const isToday = p.day === today;
            return (
              <li key={p.day} className={`flex min-w-0 flex-col rounded-2xl border p-4 shadow-sm ${t.card} ${isToday ? `ring-2 ${t.ring}` : ''}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white ${t.icon}`} aria-hidden="true">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={PATHS[p.icon]} />
                    </svg>
                  </span>
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                    {isToday && <span className="rounded-full bg-brsp-green px-2 py-0.5 text-xs font-bold text-white">আজ</span>}
                    <span className={`rounded-full px-3 py-1 text-xs font-bold sm:text-sm ${t.badge}`}>{p.day}</span>
                  </div>
                </div>

                <h4 className="mt-3 text-base font-bold leading-snug text-slate-800">{p.title}</h4>

                {p.from && (
                  <dl className="mt-2 space-y-1.5 text-sm leading-snug text-slate-700">
                    <div>
                      <dt className="text-xs font-semibold text-slate-500">শুরু</dt>
                      <dd className="font-semibold break-words">{p.from}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-slate-500">গন্তব্য (ড্রাইভিং)</dt>
                      <dd className="font-semibold break-words">{p.to}</dd>
                    </div>
                  </dl>
                )}
                {p.place && (
                  <dl className="mt-2 text-sm leading-snug text-slate-700">
                    <dt className="text-xs font-semibold text-slate-500">স্থান</dt>
                    <dd className="font-semibold break-words">{p.place}</dd>
                  </dl>
                )}
                {p.note && <p className="mt-2 text-sm font-semibold leading-snug text-slate-700 break-words">{p.note}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
