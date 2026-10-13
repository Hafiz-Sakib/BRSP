// বার অনুযায়ী রঙ
const DAY_STYLE = {
  রবিবার: { badge: 'bg-emerald-100 text-emerald-800', bar: 'from-emerald-400 to-emerald-600', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  সোমবার: { badge: 'bg-amber-100 text-amber-800', bar: 'from-amber-400 to-amber-600', chip: 'bg-amber-50 text-amber-700 ring-amber-200' },
  বুধবার: { badge: 'bg-blue-100 text-blue-800', bar: 'from-blue-400 to-blue-600', chip: 'bg-blue-50 text-blue-700 ring-blue-200' },
  বৃহস্পতিবার: { badge: 'bg-purple-100 text-purple-800', bar: 'from-purple-400 to-purple-600', chip: 'bg-purple-50 text-purple-700 ring-purple-200' },
};

const FALLBACK = {
  badge: 'bg-slate-100 text-slate-800',
  bar: 'from-slate-400 to-slate-600',
  chip: 'bg-slate-50 text-slate-700 ring-slate-200',
};

export default function DutyCard({ row }) {
  const style = DAY_STYLE[row.day] ?? FALLBACK;

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition duration-200 overflow-hidden break-inside-avoid">
      {/* উপরের রঙিন বার */}
      <div className={`h-1.5 bg-gradient-to-r ${style.bar}`} />

      <div className="p-4 sm:p-5 flex flex-col gap-4 flex-1">
        {/* তারিখ + বার */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">{row.date}</p>
            <span className={`inline-block mt-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ${style.badge}`}>
              {row.day}
            </span>
          </div>
          <span
            className="shrink-0 w-9 h-9 rounded-full bg-slate-100 text-slate-500 text-sm font-semibold flex items-center justify-center"
            title="ক্রমিক নং"
          >
            {row.no}
          </span>
        </div>

        <div className="border-t border-dashed border-slate-200" />

        {/* দায়িত্বে যারা */}
        <div>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
            দায়িত্বে থাকবে
          </p>
          <ul className="space-y-2">
            {row.members.map((m) => (
              <li key={`${m.id}-${m.name}`} className="flex items-center gap-2.5 text-sm text-slate-700">
                <span
                  className={`shrink-0 min-w-[2.5rem] text-center px-2 py-0.5 rounded-md text-xs font-bold ring-1 ${style.chip}`}
                >
                  {m.id}
                </span>
                <span className="font-medium break-words min-w-0">{m.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
