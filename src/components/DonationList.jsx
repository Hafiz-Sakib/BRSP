import { normalize } from '../utils/search.js';
import {
  DONATION_TITLE,
  DONATION_AMOUNT,
  DONATION_PAID,
  DONATION_UNPAID,
  toBn,
} from '../data/donation.js';

const isNumeric = (q) => /^\d+$/.test(q);

function match(row, query) {
  const q = normalize(query);
  if (!q) return true;
  if (isNumeric(q)) return normalize(row.reg).startsWith(q);
  return normalize(row.name).includes(q);
}

function Stat({ label, value, cls }) {
  return (
    <div className={`rounded-2xl border p-4 text-center shadow-sm ${cls}`}>
      <p className="text-xs sm:text-sm font-semibold opacity-80">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function Section({ title, count, amount, tone, rows, icon }) {
  const tones = {
    green: {
      head: 'bg-emerald-600',
      chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      row: 'hover:bg-emerald-50/60',
    },
    red: {
      head: 'bg-rose-600',
      chip: 'bg-rose-50 text-rose-700 ring-rose-200',
      row: 'hover:bg-rose-50/60',
    },
  }[tone];

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden break-inside-avoid print:shadow-none">
      <div className={`${tones.head} text-white px-4 py-3 flex items-center justify-between gap-3`}>
        <h2 className="font-bold text-sm sm:text-base">
          {icon} {title}
        </h2>
        <span className="text-xs sm:text-sm font-semibold bg-white/20 px-2.5 py-1 rounded-lg">
          {toBn(count)} জন • {toBn(amount)} টাকা
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-slate-400 font-medium text-sm">কেউ নেই</p>
      ) : (
        <ul>
          {rows.map((r, i) => (
            <li
              key={r.reg}
              className={`flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 last:border-0 ${tones.row}`}
            >
              <span className="shrink-0 w-6 text-center text-xs text-slate-400">{toBn(i + 1)}</span>
              <span className="flex-1 min-w-0 font-medium text-slate-800 break-words">{r.name}</span>
              <span
                className={`shrink-0 px-2.5 py-0.5 rounded-md text-xs font-bold ring-1 ${tones.chip}`}
              >
                রেজি {r.reg}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function DonationList({ query }) {
  const paidAll = DONATION_PAID.length;
  const unpaidAll = DONATION_UNPAID.length;
  const total = paidAll + unpaidAll;
  const collected = paidAll * DONATION_AMOUNT;
  const due = unpaidAll * DONATION_AMOUNT;
  const percent = Math.round((paidAll / total) * 100);

  const paid = DONATION_PAID.filter((r) => match(r, query));
  const unpaid = DONATION_UNPAID.filter((r) => match(r, query));

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8 max-w-5xl mx-auto space-y-5">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">🪭 {DONATION_TITLE}</h1>
        <p className="text-sm text-slate-500 mt-1">
          জনপ্রতি {toBn(DONATION_AMOUNT)} টাকা • মোট {toBn(total)} জন
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="দিয়েছেন" value={`${toBn(paidAll)} জন`} cls="bg-emerald-50 border-emerald-200 text-emerald-800" />
        <Stat label="মোট সংগ্রহ" value={`${toBn(collected)} ৳`} cls="bg-emerald-50 border-emerald-200 text-emerald-800" />
        <Stat label="বাকি" value={`${toBn(unpaidAll)} জন`} cls="bg-rose-50 border-rose-200 text-rose-800" />
        <Stat label="বাকি সংগ্রহযোগ্য" value={`${toBn(due)} ৳`} cls="bg-rose-50 border-rose-200 text-rose-800" />
      </div>

      <div>
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
          <span>অগ্রগতি</span>
          <span>{toBn(percent)}%</span>
        </div>
        <div className="h-3 rounded-full bg-rose-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {paid.length === 0 && unpaid.length === 0 ? (
        <div className="py-14 text-center text-slate-400 font-medium">কোনো ফলাফল পাওয়া যায়নি</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <Section
            title="টাকা দিয়েছেন যেসব ভাই"
            icon="❤️"
            tone="green"
            rows={paid}
            count={paid.length}
            amount={paid.length * DONATION_AMOUNT}
          />
          <Section
            title="এখনো টাকা দেননি যেসব ভাই"
            icon="❌"
            tone="red"
            rows={unpaid}
            count={unpaid.length}
            amount={unpaid.length * DONATION_AMOUNT}
          />
        </div>
      )}
    </div>
  );
}
