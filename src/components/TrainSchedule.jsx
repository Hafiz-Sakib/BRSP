import { useEffect, useState } from 'react';
import {
  TRAIN_TITLE,
  TRAIN_JOURNEY_NOTE,
  TRAIN_SCHEDULE,
  TRAIN_CONTACTS,
  TRAIN_IMAGE,
  TRAIN_IMAGE_FILENAME,
  bn,
  periodOf,
  formatTime,
  todayKey,
  durationText,
} from '../data/train.js';

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const toMin = ([h, m]) => h * 60 + m;

function Direction({ title, from, to, tone, trains, nowMin, isToday }) {
  const tones = {
    indigo: { head: 'bg-indigo-600', next: 'bg-indigo-50 ring-indigo-300', time: 'text-indigo-700', dot: 'bg-indigo-500' },
    emerald: { head: 'bg-emerald-600', next: 'bg-emerald-50 ring-emerald-300', time: 'text-emerald-700', dot: 'bg-emerald-500' },
  }[tone];

  const nextIdx = isToday ? trains.findIndex((t) => toMin(t) >= nowMin) : -1;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden break-inside-avoid print:shadow-none">
      <div className={`${tones.head} text-white px-4 py-3`}>
        <h2 className="font-bold text-base sm:text-lg flex items-center gap-2">
          <span>{from}</span>
          <svg className="w-5 h-5 shrink-0 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <span>{to}</span>
        </h2>
        <p className="text-xs text-white/80 font-medium mt-0.5">
          {title} • {bn(trains.length)}টি ট্রেন
        </p>
      </div>

      <ul className="p-2 sm:p-3 space-y-1.5">
        {trains.map((t, i) => {
          const passed = isToday && toMin(t) < nowMin;
          const isNext = i === nextIdx;
          return (
            <li
              key={`${t[0]}-${t[1]}`}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                isNext ? `ring-2 ${tones.next} shadow-sm` : 'hover:bg-slate-50'
              } ${passed ? 'opacity-45' : ''}`}
            >
              <span className={`shrink-0 w-2 h-2 rounded-full ${isNext ? `${tones.dot} animate-pulse` : 'bg-slate-300'}`} />
              <span className="shrink-0 w-14 text-xs font-semibold text-slate-500">{periodOf(t[0])}</span>
              <span className={`text-xl sm:text-2xl font-bold tabular-nums ${isNext ? tones.time : 'text-slate-800'} ${passed ? 'line-through decoration-slate-400' : ''}`}>
                {formatTime(t[0], t[1])}
              </span>
              <span className="flex-1 min-w-0 flex justify-end items-center gap-1.5 flex-wrap">
                {t[2] && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-bold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                    ষোলশহর
                  </span>
                )}
                {isNext && (
                  <span className={`px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-bold text-white ${tones.head}`}>
                    পরের ট্রেন
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}


// ছবির মতো টেবিল ফরম্যাট — পূর্ণ সূচিতে কোনো সারিই ঝাপসা নয়, সব ট্রেন সমান স্পষ্ট
function TableBlock({ heading, trains }) {
  return (
    <div className="break-inside-avoid">
      <div className="bg-emerald-700 text-white font-bold text-sm sm:text-base text-center px-4 py-2 rounded-t-xl">
        {heading}
      </div>
      <table className="w-full border-collapse bg-white text-slate-800 overflow-hidden rounded-b-xl ring-1 ring-slate-300">
        <tbody>
          {trains.map((t) => (
            <tr key={`${t[0]}-${t[1]}`} className="border-t border-slate-300 first:border-t-0 bg-emerald-50/70 font-bold">
              <td className="w-1/3 px-3 py-2 sm:py-2.5 text-sm sm:text-base border-r border-slate-300">
                {periodOf(t[0])}
              </td>
              <td className="px-3 py-2 sm:py-2.5 text-base sm:text-lg tabular-nums text-emerald-800">
                {formatTime(t[0], t[1])}
                {t[2] && <span className="ml-2 text-sm font-bold text-amber-700">(ষোলশহর)</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FullTables({ today }) {
  const groups = [
    { key: 'regular', banner: 'বিশ্ববিদ্যালয় শাটল ট্রেনের সময়সূচি', bannerCls: 'from-sky-500 to-blue-800' },
    { key: 'weekend', banner: 'শুক্রবার ও শনিবার', bannerCls: 'from-orange-500 to-red-700' },
  ];
  return (
    <section className="bg-white/70 rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-5 space-y-5 break-inside-avoid">
      <h2 className="text-lg sm:text-xl font-bold text-slate-800 text-center">📋 পূর্ণ সময়সূচি (একনজরে)</h2>
      {groups.map((g) => {
        const d = TRAIN_SCHEDULE[g.key];
        const isToday = g.key === today;
        return (
          <div key={g.key} className="space-y-3">
            <div className={`bg-gradient-to-r ${g.bannerCls} text-white text-center font-bold text-base sm:text-lg py-2 px-4 rounded-xl shadow flex items-center justify-center gap-2 flex-wrap`}>
              {g.banner}
              {isToday && <span className="text-[11px] font-bold bg-white/25 px-2 py-0.5 rounded-md">আজকের সূচি</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TableBlock heading="শহর থেকে ক্যাম্পাস" trains={d.toCampus} />
              <TableBlock heading="ক্যাম্পাস থেকে শহর" trains={d.toCity} />
            </div>
          </div>
        );
      })}
    </section>
  );
}

function ImageDownload() {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-bold text-sm sm:text-base text-slate-800">🖼️ সময়সূচির অফিসিয়াল ছবি</h2>
          <p className="text-xs text-slate-500 mt-0.5">ডাউনলোড করে ফোনে রেখে দিন বা বন্ধুদের শেয়ার করুন।</p>
        </div>
        <a
          href={TRAIN_IMAGE}
          download={TRAIN_IMAGE_FILENAME}
          className="shrink-0 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
          </svg>
          ছবি ডাউনলোড করুন
        </a>
      </div>
      <a href={TRAIN_IMAGE} target="_blank" rel="noopener noreferrer" className="block max-w-md mx-auto">
        <img
          src={TRAIN_IMAGE}
          alt="চট্টগ্রাম বিশ্ববিদ্যালয় শাটল ট্রেনের সময়সূচি"
          loading="lazy"
          decoding="async"
          className="w-full h-auto rounded-xl border border-slate-200 shadow"
        />
      </a>
    </section>
  );
}

function Contacts() {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 no-print">
      <h2 className="font-bold text-sm sm:text-base text-slate-800 mb-3">
        📞 শাটলের যে কোনো সমস্যায় যোগাযোগ করুন
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TRAIN_CONTACTS.map((c) => (
          <a
            key={c.phone}
            href={`tel:${c.phone}`}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-emerald-50 hover:border-emerald-300 transition"
          >
            <span className="shrink-0 p-2.5 bg-emerald-600 text-white rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.2l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.2-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block font-bold text-slate-800">{c.name}</span>
              <span className="block text-xs text-slate-500">{c.role}</span>
              <span className="block text-sm font-bold text-emerald-700 tabular-nums mt-0.5">{c.display}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Note() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-xs sm:text-sm font-medium space-y-1">
      <p>⏱️ {TRAIN_JOURNEY_NOTE}</p>
      <p>
        <span className="px-1.5 py-0.5 mr-1 rounded-md text-[11px] font-bold bg-white text-amber-700 ring-1 ring-amber-200">ষোলশহর</span>
        চিহ্নিত ট্রেনগুলো ষোলশহর স্টেশন সংশ্লিষ্ট।
      </p>
    </div>
  );
}

export default function TrainSchedule() {
  const now = useNow();
  const today = todayKey(now);
  const [view, setView] = useState('next'); // 'next' = পরের সূচি, 'full' = পূর্ণ সূচি
  const [mode, setMode] = useState(today);
  const data = TRAIN_SCHEDULE[mode];
  const isToday = mode === today;
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // পরের ট্রেন (দুই দিকেরটাই) — শুধু আজকের সূচির জন্য
  const nextOf = (list) => list.find((t) => toMin(t) >= nowMin);
  const nextCampus = isToday ? nextOf(data.toCampus) : null;
  const nextCity = isToday ? nextOf(data.toCity) : null;

  const viewCls = (k) =>
    `flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
      view === k ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
    }`;
  const modeCls = (k) =>
    `flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
      mode === k ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8 max-w-5xl mx-auto space-y-5">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">🚆 {TRAIN_TITLE}</h1>
        <p className="text-sm text-slate-500 mt-1">চট্টগ্রাম বিশ্ববিদ্যালয় কেন্দ্রীয় ছাত্র সংসদ (চাকসু)</p>
      </div>

      {/* মেনু: পরের সূচি / পূর্ণ সূচি */}
      <div className="no-print flex justify-center">
        <div className="flex w-full sm:w-auto p-1 bg-white border border-slate-200 rounded-xl shadow-sm gap-1">
          <button type="button" onClick={() => setView('next')} className={viewCls('next')}>
            ⏭️ পরের সূচি
          </button>
          <button type="button" onClick={() => setView('full')} className={viewCls('full')}>
            📋 পূর্ণ সূচি
          </button>
        </div>
      </div>

      {view === 'next' ? (
        <>
          <div className="no-print flex justify-center">
            <div className="flex w-full sm:w-auto p-1 bg-white border border-slate-200 rounded-xl shadow-sm gap-1">
              <button type="button" onClick={() => setMode('regular')} className={modeCls('regular')}>
                সাধারণ দিন
              </button>
              <button type="button" onClick={() => setMode('weekend')} className={modeCls('weekend')}>
                শুক্র ও শনিবার
              </button>
            </div>
          </div>

          {isToday ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'শহর থেকে ক্যাম্পাস', next: nextCampus, cls: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
                { label: 'ক্যাম্পাস থেকে শহর', next: nextCity, cls: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
              ].map((c) => (
                <div key={c.label} className={`rounded-2xl border p-4 shadow-sm ${c.cls}`}>
                  <p className="text-xs sm:text-sm font-semibold opacity-80">পরের ট্রেন • {c.label}</p>
                  {c.next ? (
                    <div className="flex items-end justify-between gap-3 mt-1">
                      <p className="text-3xl font-bold tabular-nums">
                        {formatTime(c.next[0], c.next[1])}
                        <span className="text-sm font-semibold ml-1.5 opacity-80">{periodOf(c.next[0])}</span>
                      </p>
                      <p className="text-sm font-bold bg-white/70 px-2.5 py-1 rounded-lg">
                        {durationText(toMin(c.next) - nowMin)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg font-bold mt-1">আজকের আর কোনো ট্রেন নেই</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs sm:text-sm text-slate-500 bg-white/70 border border-slate-200 rounded-xl py-2 px-3">
              {mode === 'weekend' ? 'আজ শুক্র/শনিবার নয়' : 'আজ শুক্র/শনিবার'} — এটি আজকের সূচি নয়, তাই লাইভ হাইলাইট বন্ধ।
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            <Direction title={data.label} from="শহর" to="ক্যাম্পাস" tone="indigo" trains={data.toCampus} nowMin={nowMin} isToday={isToday} />
            <Direction title={data.label} from="ক্যাম্পাস" to="শহর" tone="emerald" trains={data.toCity} nowMin={nowMin} isToday={isToday} />
          </div>

          <Note />
          <Contacts />
        </>
      ) : (
        <>
          <FullTables today={today} />
          <Note />
          <ImageDownload />
          <Contacts />
        </>
      )}
    </div>
  );
}
