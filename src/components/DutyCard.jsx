import { styleFor } from './DayStyle.js';
import { memberMatches } from '../utils/search.js';
import WhatsAppButton from './WhatsAppButton.jsx';
import { dutyMessage } from '../utils/whatsapp.js';

// ট্যাবলেট ও মোবাইলের জন্য কার্ড
export default function DutyCard({ row, query }) {
  const style = styleFor(row.day);

  return (
    <article className="relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden break-inside-avoid">
      <div className={`h-1.5 bg-gradient-to-r ${style.bar}`} />

      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
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

        <ul className="space-y-2">
          {row.members.map((m) => {
            const hit = memberMatches(m, query);
            return (
              <li
                key={m.id}
                className={`flex items-center gap-2.5 text-sm rounded-lg px-1.5 py-1 -mx-1.5 ${
                  hit ? 'bg-yellow-100 ring-1 ring-yellow-300' : ''
                }`}
              >
                <span
                  className={`shrink-0 min-w-[2.75rem] text-center px-2 py-0.5 rounded-md text-xs font-bold ring-1 ${style.chip}`}
                >
                  {m.id}
                </span>
                <span className="font-medium text-slate-700 break-words min-w-0 leading-snug flex-1">{m.name}</span>
                <WhatsAppButton
                  number={m.whatsapp}
                  message={dutyMessage(m.name, row, m.id)}
                  label="মেসেজ"
                  className="shrink-0 px-2.5 py-1 text-xs"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
