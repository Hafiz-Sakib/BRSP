import { styleFor } from './DayStyle.js';
import { memberMatches } from '../utils/search.js';

// পিসি (বড় স্ক্রিন) ও প্রিন্টের জন্য: পুরো পেজ জুড়ে একটা টেবিল, আলাদা আলাদা বক্স নেই
export default function DutyTable({ rows, query }) {
  return (
    <div className="w-full bg-white border-y border-slate-200 print:border-slate-400">
      {/* হেডার সারি */}
      <div className="grid grid-cols-[3.5rem_13rem_1fr] xl:grid-cols-[4rem_15rem_1fr] bg-slate-800 text-white text-sm font-semibold print:bg-slate-800">
        <div className="px-3 py-3 text-center">ক্রঃ</div>
        <div className="px-4 py-3">তারিখ ও বার</div>
        <div className="px-4 py-3">দায়িত্বে যারা থাকবে (আইডি ও নাম)</div>
      </div>

      {rows.map((row, i) => {
        const style = styleFor(row.day);
        return (
          <div
            key={row.no}
            className={`grid grid-cols-[3.5rem_13rem_1fr] xl:grid-cols-[4rem_15rem_1fr] items-center border-b border-slate-200 break-inside-avoid hover:bg-indigo-50/60 transition-colors ${
              i % 2 ? 'bg-slate-50/80' : 'bg-white'
            }`}
          >
            <div className="px-3 py-3 text-center">
              <span className="inline-flex w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold items-center justify-center">
                {row.no}
              </span>
            </div>

            <div className="px-4 py-3 flex items-center gap-3">
              <span className={`w-1.5 self-stretch rounded-full ${style.dot}`} />
              <div>
                <p className="text-base xl:text-lg font-bold text-slate-800 leading-tight">{row.date}</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-md ${style.badge}`}>
                  {row.day}
                </span>
              </div>
            </div>

            <ul className="px-4 py-3 flex flex-wrap gap-x-6 gap-y-2">
              {row.members.map((m) => {
                const hit = memberMatches(m, query);
                return (
                  <li
                    key={m.id}
                    className={`flex items-center gap-2.5 flex-1 min-w-[13rem] rounded-lg px-2 py-1 ${
                      hit ? 'bg-yellow-100 ring-1 ring-yellow-300' : ''
                    }`}
                  >
                    <span
                      className={`shrink-0 min-w-[2.75rem] text-center px-2 py-0.5 rounded-md text-xs font-bold ring-1 ${style.chip}`}
                    >
                      {m.id}
                    </span>
                    <span className="font-medium text-slate-800 text-sm xl:text-base leading-snug">{m.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
