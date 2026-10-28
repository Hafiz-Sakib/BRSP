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
  SHOLOSHAHAR_LABEL,
  clockPeriod,
  formatClock,
  WEEKDAYS_BN,
  TRAIN_ROUTE,
  buildStops,
  minutesText,
} from '../data/train.js';

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    // প্রতি সেকেন্ডে আপডেট (সেকেন্ড বদলালেই কেবল রি-রেন্ডার)
    const id = setInterval(() => {
      setNow((prev) => {
        const d = new Date();
        return Math.floor(d.getTime() / 1000) === Math.floor(prev.getTime() / 1000) ? prev : d;
      });
    }, 250);
    return () => clearInterval(id);
  }, []);
  return now;
}

const toMin = ([h, m]) => h * 60 + m;

function Direction({ title, from, to, tone, trains, nowSec, isToday, dir }) {
  const tones = {
    indigo: { head: 'bg-indigo-600', next: 'bg-indigo-50 ring-indigo-300', time: 'text-indigo-700', dot: 'bg-indigo-500' },
    emerald: { head: 'bg-emerald-600', next: 'bg-emerald-50 ring-emerald-300', time: 'text-emerald-700', dot: 'bg-emerald-500' },
  }[tone];

  const nextIdx = isToday ? trains.findIndex((t) => toMin(t) * 60 > nowSec) : -1;

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
          const passed = isToday && toMin(t) * 60 <= nowSec;
          const isNext = i === nextIdx;
          return (
            <li
              key={`${t[0]}-${t[1]}`}
              className={`flex items-center gap-2 sm:gap-3 rounded-xl px-2.5 sm:px-3 py-2.5 whitespace-nowrap transition ${
                isNext ? `ring-2 ${tones.next} shadow-sm` : 'hover:bg-slate-50'
              } ${passed ? 'opacity-45' : ''}`}
            >
              <span className={`shrink-0 w-2 h-2 rounded-full ${isNext ? `${tones.dot} animate-pulse` : 'bg-slate-300'}`} />
              <span className="shrink-0 w-11 sm:w-14 text-xs font-semibold text-slate-500">{periodOf(t[0])}</span>
              <span className={`text-xl sm:text-2xl font-bold tabular-nums ${isNext ? tones.time : 'text-slate-800'} ${passed ? 'line-through decoration-slate-400' : ''}`}>
                {formatTime(t[0], t[1])}
              </span>
              <span className="flex-1 min-w-0 flex justify-end items-center gap-1.5">
                {t[2] && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-bold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                    {SHOLOSHAHAR_LABEL[dir]}
                  </span>
                )}
                {isNext && (
                  <span className={`hidden min-[420px]:inline-block px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-bold text-white ${tones.head}`}>
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


// পূর্ণ সূচির টেবিল — বটতলী ও ষোলশহর, এই দুই স্টেশনের সময় আলাদা কলামে
// (বেশিরভাগ শিক্ষার্থী এই দুই স্টেশন থেকেই ওঠেন, তাই বাকি স্টেশন এখানে নেই)
const addMin = (t, plus) => {
  const total = t[0] * 60 + t[1] + plus;
  return [Math.floor(total / 60), total % 60];
};
const gapSum = (dir, from, to) => TRAIN_ROUTE[dir].slice(from + 1, to + 1).reduce((a, r) => a + r.gap, 0);

// সময়ের ঘর — সব সময় স্পষ্ট ও সক্রিয় দেখাবে (চলে যাওয়া সময়ও ধূসর/কাটা হবে না)
const PERIOD_COLOR = {}; // একটাই রং — চোখের আরামের জন্য সময়ের অংশে আলাদা রং নেই

function TimeCell({ hm, strong = true, tag }) {
  const period = periodOf(hm[0]);
  return (
    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
      <span className={`font-bold tabular-nums ${strong ? 'text-lg sm:text-xl text-slate-800' : 'text-base sm:text-lg text-slate-600'}`}>
        {formatTime(hm[0], hm[1])}
      </span>
      <span className={`text-[11px] sm:text-xs font-bold text-slate-500`}>{period}</span>
      {tag && <span className="px-1.5 py-px rounded-md text-[10px] sm:text-[11px] font-semibold bg-slate-100 text-slate-600 ring-1 ring-slate-200 whitespace-nowrap">{tag}</span>}
    </div>
  );
}

// বটতলী ও ষোলশহর — এই দুই স্টেশনের সময় পাশাপাশি (বেশিরভাগ শিক্ষার্থী এখান থেকেই ওঠেন)
function TableBlock({ heading, trains, dir, isToday, nowSec }) {
  const toCampus = dir === 'toCampus';
  const bottoliToSholo = TRAIN_ROUTE.toCampus[1].gap; // বটতলী → ষোলশহর
  const campusToSholo = gapSum('toCity', 0, 3); // ক্যাম্পাস → ষোলশহর
  const campusToBottoli = gapSum('toCity', 0, 4); // ক্যাম্পাস → বটতলী
  const sec = (hm) => hm[0] * 3600 + hm[1] * 60;
  
  const cols = toCampus
    ? [
        { st: 'বটতলী', act: 'ছাড়বে', sholo: false },
        { st: 'ষোলশহর', act: 'ছাড়বে', sholo: true },
      ]
    : [
        { st: 'ক্যাম্পাস', act: 'ছাড়বে', sholo: false },
        { st: 'ষোলশহর', act: 'থামবে', sholo: true },
        { st: 'বটতলী', act: 'পৌঁছাবে', sholo: false },
      ];

  const nextIdx = isToday ? trains.findIndex((t) => sec(t) > nowSec) : -1;
  const head = 'bg-emerald-100 text-emerald-900';

  const rowCells = (t) => {
    const partial = !!t[2];
    if (toCampus) {
      return [
        partial ? { note: 'ষোলশহর থেকে শুরু →' } : { hm: t },
        partial ? { hm: t, tag: 'শুরু' } : { hm: addMin(t, bottoliToSholo) },
      ];
    }
    return [
      { hm: t },
      { hm: addMin(t, campusToSholo), tag: partial ? 'শেষ' : null },
      partial ? { note: '← ষোলশহরেই শেষ' } : { hm: addMin(t, campusToBottoli), light: true },
    ];
  };

  return (
    <div className="break-inside-avoid rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200 shadow-sm">
      <div className={`${head} font-bold text-sm sm:text-base text-center px-4 py-2.5`}>{heading}</div>
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="text-slate-800">
            {cols.map((c, i) => (
              <th
                key={c.st}
                className={`px-2 sm:px-3 py-2 text-left align-bottom border-b border-slate-200 ${i === 0 ? 'pl-3 sm:pl-4' : 'border-l border-slate-200'} ${
                  c.sholo ? 'bg-amber-50' : 'bg-slate-50'
                }`}
              >
                <span className="block text-xs sm:text-sm font-bold leading-tight">{c.st}</span>
                <span className="block text-[11px] sm:text-xs font-semibold text-slate-600 leading-tight">{c.act}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trains.map((t, ri) => {
            const cells = rowCells(t);
            const isNext = ri === nextIdx;
            return (
              <tr key={`${t[0]}-${t[1]}`} className={`border-t border-slate-200 ${isNext ? 'bg-emerald-200/70' : ri % 2 === 0 ? 'bg-emerald-50' : 'bg-white'}`}>
                {cells.map((c, ci) => (
                  <td
                    key={ci}
                    className={`px-2 sm:px-3 py-2 align-middle ${ci === 0 ? `pl-2.5 sm:pl-3.5 border-l-4 ${isNext ? 'border-l-emerald-600' : 'border-l-transparent'}` : 'border-l border-slate-200'} ${
                      ''
                    }`}
                  >
                    {c.note ? (
                      <span className="block text-xs sm:text-sm font-bold leading-snug text-[#e5432d]">{c.note}</span>
                    ) : (
                      <TimeCell hm={c.hm} strong={!c.light} tag={c.tag} />
                    )}
                    {isNext && ci === 0 && (
                      <span className="inline-block mt-1 px-1.5 py-px rounded-md text-[10px] sm:text-[11px] font-semibold bg-emerald-600 text-white whitespace-nowrap">পরের ট্রেন</span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function FullTables({ today, nowSec }) {
  const groups = [
    { key: 'regular', banner: 'বিশ্ববিদ্যালয় শাটল ট্রেনের সময়সূচি', bannerCls: 'from-slate-100 to-slate-100 text-slate-800 ring-1 ring-slate-200' },
    { key: 'weekend', banner: 'শুক্রবার ও শনিবার', bannerCls: 'from-slate-100 to-slate-100 text-slate-800 ring-1 ring-slate-200' },
  ];
  return (
    <section className="bg-white/70 rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-5 space-y-5 break-inside-avoid">
      {groups.map((g) => {
        const d = TRAIN_SCHEDULE[g.key];
        const isToday = g.key === today;
        return (
          <div key={g.key} id={`sched-${g.key}`} className="space-y-3 scroll-mt-20">
            <div className={`bg-gradient-to-r ${g.bannerCls} text-center font-bold text-[13px] min-[400px]:text-base sm:text-lg py-2.5 px-3 sm:px-4 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap`}>
              {g.banner}
              {isToday && <span className="text-[11px] font-bold bg-white text-emerald-700 ring-1 ring-emerald-200 px-2 py-0.5 rounded-md whitespace-nowrap">আজকের সূচি</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TableBlock heading="বটতলী স্টেশন → ক্যাম্পাস" trains={d.toCampus} dir="toCampus" isToday={isToday} nowSec={nowSec} />
              <TableBlock heading="ক্যাম্পাস → বটতলী স্টেশন" trains={d.toCity} dir="toCity" isToday={isToday} nowSec={nowSec} />
            </div>
          </div>
        );
      })}
    </section>
  );
}

// রুটের সারসংক্ষেপ — কোন স্টেশন থেকে কোন স্টেশনে কত মিনিট
function RouteLine({ dir, title, tone }) {
  const route = TRAIN_ROUTE[dir];
  const total = route.reduce((a, r) => a + r.gap, 0);
  const cls = tone === 'indigo' ? 'text-indigo-700 bg-indigo-50 ring-indigo-200' : 'text-emerald-700 bg-emerald-50 ring-emerald-200';
  return (
    <div>
      <p className="text-xs font-bold text-slate-500 mb-1.5">{title}</p>
      <div className="flex flex-wrap items-center gap-y-1.5">
        {route.map((r, i) => (
          <span key={r.name} className="flex items-center">
            {i > 0 && (
              <span className="flex flex-col items-center px-1.5 leading-none">
                <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">{bn(r.gap)} মিনিট</span>
                <span className="text-slate-400 text-sm">→</span>
              </span>
            )}
            <span className={`px-2 py-1 rounded-lg text-xs sm:text-sm font-bold ring-1 whitespace-nowrap ${cls}`}>{r.name}</span>
          </span>
        ))}
      </div>
      <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-1.5">মোট সময়: {minutesText(total)}</p>
    </div>
  );
}

function RouteSummary() {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
      <h2 className="font-bold text-sm sm:text-base text-slate-800">🛤️ রুট ও স্টেশনভিত্তিক সময়</h2>
      <RouteLine dir="toCampus" title="বটতলী থেকে ক্যাম্পাস" tone="indigo" />
      <RouteLine dir="toCity" title="ক্যাম্পাস থেকে নিউমার্কেট" tone="emerald" />
    </section>
  );
}

// লাইভ অবস্থা — ট্রেন কোথায় আছে / কখন ছাড়বে
function liveStatus(stops, nowSec) {
  const secs = stops.map((s) => (s.h * 60 + s.m) * 60);
  if (nowSec < secs[0]) return { text: `${stops[0].name} থেকে ছাড়তে ${durationText(secs[0] - nowSec)}`, state: 'wait' };
  if (nowSec >= secs[secs.length - 1]) return { text: `${stops[stops.length - 1].name}-এ পৌঁছে গেছে`, state: 'done' };
  let i = 0;
  while (i < secs.length - 2 && nowSec >= secs[i + 1]) i++;
  return { text: `এখন ${stops[i].name} → ${stops[i + 1].name} পথে • ${stops[i + 1].name}-এ পৌঁছাতে ${durationText(secs[i + 1] - nowSec)}`, state: 'run' };
}

// একটি ট্রেনের স্টেশনভিত্তিক টাইমলাইন
function TrainCard({ t, dir, tone, passed, isNext, active, isToday, nowSec }) {
  const { stops, total } = buildStops(dir, t);
  const first = stops[0];
  const last = stops[stops.length - 1];
  const head = tone === 'indigo' ? 'bg-indigo-600' : 'bg-emerald-600';
  const ring = tone === 'indigo' ? 'ring-indigo-400' : 'ring-emerald-400';
  const dotOn = tone === 'indigo' ? 'bg-indigo-500 ring-indigo-200' : 'bg-emerald-500 ring-emerald-200';
  const banner = tone === 'indigo' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200';
  const partial = t[2];
  const live = active && isToday ? liveStatus(stops, nowSec) : null;

  return (
    <article
      className={`bg-white rounded-2xl border border-slate-200 overflow-hidden break-inside-avoid ${
        active ? `ring-2 ${ring} shadow-lg` : `shadow-sm ${isNext ? `ring-2 ${ring}` : ''} ${passed ? 'opacity-50' : ''}`
      }`}
    >
      <div className={`${head} text-white px-3.5 py-2.5 flex items-center justify-between gap-2`}>
        <p className="font-bold text-sm whitespace-nowrap">
          <span className="tabular-nums text-base">{formatTime(first.h, first.m)}</span>
          <span className="text-xs font-semibold ml-1 opacity-85">{periodOf(first.h)}</span>
          <span className="mx-1.5 opacity-80">→</span>
          <span className="tabular-nums text-base">{formatTime(last.h, last.m)}</span>
          <span className="text-xs font-semibold ml-1 opacity-85">{periodOf(last.h)}</span>
        </p>
        {active ? (
          <span className="shrink-0 text-[11px] font-bold bg-white/25 px-2 py-0.5 rounded-md whitespace-nowrap flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" aria-hidden="true" />
            সক্রিয়
          </span>
        ) : (
          isNext && <span className="shrink-0 text-[11px] font-bold bg-white/25 px-2 py-0.5 rounded-md whitespace-nowrap">পরের ট্রেন</span>
        )}
      </div>

      {active && (
        <div className={`mx-3.5 mt-3 rounded-xl border px-3 py-2 text-xs sm:text-sm font-bold ${banner}`}>
          {live ? live.text : 'এটি আজকের সূচি নয় — লাইভ অবস্থা দেখানো হচ্ছে না'}
        </div>
      )}

      <ol className="px-3.5 pt-3 pb-2">
        {stops.map((s, i) => {
          const isFirst = i === 0;
          const isLast = i === stops.length - 1;
          const reached = live && (s.h * 60 + s.m) * 60 <= nowSec;
          const hot = isFirst || isLast || reached;
          return (
            <li key={s.name} className="relative flex items-stretch gap-3">
              {/* সময় */}
              <div className="w-[4.6rem] shrink-0 text-right pb-3">
                <span className="text-base font-bold tabular-nums text-slate-800">{formatTime(s.h, s.m)}</span>
                <span className="block text-[10px] font-semibold text-slate-400 leading-none">{periodOf(s.h)}</span>
              </div>
              {/* লাইন ও বিন্দু */}
              <div className="relative w-3 shrink-0">
                {!isLast && <span className="absolute left-1/2 -translate-x-1/2 top-2.5 bottom-[-2px] w-0.5 bg-slate-200" aria-hidden="true" />}
                <span className={`absolute left-1/2 -translate-x-1/2 top-1.5 w-3 h-3 rounded-full ring-2 ${hot ? dotOn : 'bg-white ring-slate-300 border-2 border-slate-300'}`} aria-hidden="true" />
              </div>
              {/* স্টেশন */}
              <div className="flex-1 min-w-0 pb-3">
                <p className={`text-sm leading-tight ${isFirst || isLast ? 'font-bold text-slate-800' : 'font-semibold text-slate-700'}`}>{s.name}</p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  {isFirst ? 'এখান থেকে ছাড়বে' : isLast ? `পৌঁছাবে • ${minutesText(s.gap)}` : `থামবে • ${minutesText(s.gap)}`}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="px-3.5 pb-3 flex items-center justify-between gap-2 text-[11px] sm:text-xs font-bold">
        <span className="text-slate-500 whitespace-nowrap">মোট {minutesText(total)}</span>
        {partial && (
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 ring-1 ring-amber-200 whitespace-nowrap">{SHOLOSHAHAR_LABEL[dir]}</span>
        )}
      </div>
    </article>
  );
}

const PICK_DIRS = [
  { key: 'toCampus', label: 'বটতলী স্টেশন → ক্যাম্পাস', tone: 'indigo' },
  { key: 'toCity', label: 'ক্যাম্পাস → বটতলী স্টেশন', tone: 'emerald' },
];

function trainLabel(dir, t, passed, isNext) {
  const { stops } = buildStops(dir, t);
  const f = stops[0];
  const l = stops[stops.length - 1];
  const extra = t[2] ? ` • ${SHOLOSHAHAR_LABEL[dir]}` : '';
  const tag = isNext ? ' • পরের ট্রেন' : passed ? ' • চলে গেছে' : '';
  return `${formatTime(f.h, f.m)} ${periodOf(f.h)} → ${formatTime(l.h, l.m)} ${periodOf(l.h)}${extra}${tag}`;
}

// ড্রপডাউন থেকে দিক ও ট্রেন বেছে Enter দিলে শুধু সেই ট্রেনের কার্ড দেখাবে
function TrainPicker({ data, nowSec, isToday }) {
  const [dir, setDir] = useState('');
  const [idx, setIdx] = useState('');
  const [shown, setShown] = useState(null);

  const trains = dir ? data[dir] : [];
  const nextIdx = isToday && dir ? trains.findIndex((t) => toMin(t) * 60 > nowSec) : -1;
  const ready = dir !== '' && idx !== '';

  const submit = () => {
    if (ready) setShown({ dir, idx: Number(idx) });
  };
  const onKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  const selCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-slate-100 disabled:text-slate-400';

  const cur = shown ? PICK_DIRS.find((d) => d.key === shown.dir) : null;
  const curTrain = shown ? data[shown.dir][shown.idx] : null;

  return (
    <section className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="no-print bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3"
      >
        <div>
          <h2 className="font-bold text-sm sm:text-base text-slate-800">🎯 আপনার ট্রেন বেছে নিন</h2>
          <p className="text-xs text-slate-500 mt-0.5">{data.label} সূচি • দিক ও সময় বেছে Enter চাপুন</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs font-bold text-slate-500 mb-1">কোথা থেকে যাবেন?</span>
            <select
              value={dir}
              onChange={(e) => {
                setDir(e.target.value);
                setIdx('');
                setShown(null);
              }}
              onKeyDown={onKey}
              className={selCls}
            >
              <option value="">— দিক বেছে নিন —</option>
              {PICK_DIRS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.key === 'toCampus' ? 'বটতলী স্টেশন থেকে (ক্যাম্পাসে যাব)' : 'ক্যাম্পাস থেকে (বটতলী যাব)'}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-bold text-slate-500 mb-1">কয়টার ট্রেনে উঠবেন?</span>
            <select
              value={idx}
              disabled={!dir}
              onChange={(e) => {
                setIdx(e.target.value);
                setShown(null);
              }}
              onKeyDown={onKey}
              className={selCls}
            >
              <option value="">{dir ? '— ট্রেন বেছে নিন —' : 'আগে দিক বেছে নিন'}</option>
              {trains.map((t, i) => (
                <option key={`${t[0]}-${t[1]}`} value={i}>
                  {trainLabel(dir, t, isToday && toMin(t) * 60 <= nowSec, i === nextIdx)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={!ready}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold shadow transition"
        >
          দেখুন ⏎
        </button>
      </form>

      {shown && (
        <div className="max-w-md mx-auto">
          <TrainCard
            t={curTrain}
            dir={shown.dir}
            tone={cur.tone}
            active
            isToday={isToday}
            nowSec={nowSec}
          />
        </div>
      )}
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
  const chip = 'px-1.5 py-0.5 mr-1 rounded-md text-[11px] font-bold bg-white text-amber-700 ring-1 ring-amber-200 whitespace-nowrap';
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-xs sm:text-sm font-medium space-y-1.5">
      <p>⏱️ {TRAIN_JOURNEY_NOTE}</p>
      <p>
        <span className={chip}>{SHOLOSHAHAR_LABEL.toCampus}</span>
        (বটতলী স্টেশন → ক্যাম্পাস) ট্রেনটি বটতলী/নিউমার্কেট স্টেশন থেকে ছাড়বে না — ষোলশহর স্টেশন থেকে ছাড়বে।
      </p>
      <p>
        <span className={chip}>{SHOLOSHAHAR_LABEL.toCity}</span>
        (ক্যাম্পাস → বটতলী স্টেশন) ট্রেনটি বটতলী/নিউমার্কেট স্টেশন পর্যন্ত যাবে না — ষোলশহর স্টেশন পর্যন্তই যাবে।
      </p>
    </div>
  );
}

// বর্তমান সময় (সেকেন্ডসহ) — পেজের উপরের ডান কোণে
function LiveClock({ now }) {
  const h = now.getHours();
  return (
    <div className="no-print flex justify-end">
      <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white border border-slate-200 shadow-sm px-3 py-1 text-xs sm:text-sm text-slate-600">
        <span aria-hidden="true">🕐</span>
        <span className="font-semibold">{WEEKDAYS_BN[now.getDay()]}</span>
        <span className="font-bold text-slate-800 tabular-nums">{formatClock(now)}</span>
        <span className="font-semibold">{clockPeriod(h)}</span>
      </div>
    </div>
  );
}

// ক্ষণস্থায়ী কাউন্টডাউন (মিনিট পর্যন্ত)
const untilMin = (sec) => (sec < 60 ? 'আর ১ মিনিটের কম' : `আর ${minutesText(Math.ceil(sec / 60))}`);

// পরের ট্রেনের কার্ড — প্রথম স্টেশনের সময় + ষোলশহরের সময়
function NextCard({ c, trains, nowSec }) {
  const sholoHm = (t) => (c.dir === 'toCampus' ? (t[2] ? [t[0], t[1]] : addMin(t, TRAIN_ROUTE.toCampus[1].gap)) : addMin(t, gapSum('toCity', 0, 3)));
  const sholoNext = trains.find((t) => {
    const hm = sholoHm(t);
    return hm[0] * 3600 + hm[1] * 60 > nowSec;
  });
  const sh = sholoNext ? sholoHm(sholoNext) : null;
  const shSec = sh ? sh[0] * 3600 + sh[1] * 60 : 0;
  const alreadyRunning = sholoNext && sholoNext !== c.next; // ট্রেনটি প্রথম স্টেশন থেকে ছেড়ে এসেছে
  const startsHere = sholoNext && sholoNext[2];

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${c.cls}`}>
      <p className="text-[11px] min-[400px]:text-xs lg:text-sm font-semibold opacity-80 whitespace-nowrap">পরের ট্রেন • {c.label}</p>
      {c.next ? (
        <>
          <div className="flex items-center justify-between gap-2 mt-1 whitespace-nowrap">
            <p className="text-3xl font-bold tabular-nums">
              {formatTime(c.next[0], c.next[1])}
              <span className="text-sm font-semibold ml-1.5 opacity-80">{periodOf(c.next[0])}</span>
            </p>
            {c.next[2] && (
              <span className="px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-bold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                {SHOLOSHAHAR_LABEL[c.dir]}
              </span>
            )}
          </div>
          <p className="mt-2 inline-block whitespace-nowrap text-sm font-bold tabular-nums bg-white/70 px-2.5 py-1 rounded-lg">
            {durationText(toMin(c.next) * 60 - nowSec)}
          </p>
        </>
      ) : (
        <p className="text-lg font-bold mt-1">আজকের আর কোনো ট্রেন নেই</p>
      )}

      {/* ষোলশহর */}
      <div className="mt-3 rounded-xl bg-amber-50 ring-1 ring-amber-200 text-amber-900 px-3 py-2">
        <p className="text-[11px] sm:text-xs font-bold opacity-80">
          🚉 ষোলশহর {c.dir === 'toCampus' ? 'থেকে ছাড়বে' : 'স্টেশনে থামবে'}
          {startsHere && <span className="ml-1.5 px-1.5 py-px rounded-md bg-white text-[10px] ring-1 ring-amber-200">{c.dir === 'toCampus' ? 'এখান থেকেই শুরু' : 'এখানেই শেষ'}</span>}
        </p>
        {sh ? (
          <>
            <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
              <span className="text-xl font-bold tabular-nums">{formatTime(sh[0], sh[1])}</span>
              <span className="text-xs font-semibold opacity-80">{periodOf(sh[0])}</span>
              <span className="text-xs font-bold tabular-nums">• {untilMin(shSec - nowSec)}</span>
            </p>
            {alreadyRunning && <p className="text-[11px] font-semibold opacity-75 mt-0.5">ট্রেনটি ইতিমধ্যে ছেড়েছে, এখন পথে আছে</p>}
          </>
        ) : (
          <p className="text-sm font-bold mt-0.5">আজকের আর ট্রেন নেই</p>
        )}
      </div>
    </div>
  );
}

// সব ভিউতে দেখানো সতর্কতা — সময় শতভাগ নিশ্চিত নয়
function TimeDisclaimer() {
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 text-sky-900 px-3.5 py-2.5 text-xs sm:text-sm font-medium flex gap-2 items-start">
      <span aria-hidden="true">ℹ️</span>
      <p>
        <span className="font-bold">সময় নিয়ে জরুরি কথা:</span> এখানের সব সময় শতভাগ নিশ্চিত নয়। যান্ত্রিক ত্রুটি, রেললাইন ক্রসিং বা সিগন্যালের কারণে
        ট্রেন কয়েক মিনিট আগে-পরে (±) হতে পারে — তাই স্টেশনে অন্তত ৫–১০ মিনিট আগে পৌঁছে যান।
      </p>
    </div>
  );
}

export default function TrainSchedule() {
  const now = useNow();
  const today = todayKey(now);
  const [view, setView] = useState('next'); // 'next' = পরের সূচি, 'full' = পূর্ণ সূচি, 'detail' = বিস্তারিত
  const [mode, setMode] = useState(today);
  const data = TRAIN_SCHEDULE[mode];
  const isToday = mode === today;
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  // পরের ট্রেন (দুই দিকেরটাই) — শুধু আজকের সূচির জন্য
  const nextOf = (list) => list.find((t) => toMin(t) * 60 > nowSec);
  const nextCampus = isToday ? nextOf(data.toCampus) : null;
  const nextCity = isToday ? nextOf(data.toCity) : null;

  const btnBase =
    'flex-1 min-w-0 whitespace-nowrap px-1 min-[380px]:px-1.5 min-[440px]:px-2 min-[560px]:px-3 sm:px-4 py-2 rounded-lg text-[10px] min-[380px]:text-[11px] min-[440px]:text-[12px] min-[560px]:text-[13px] sm:text-sm font-semibold transition';
  const viewCls = (k) =>
    `${btnBase} ${view === k ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`;
  const modeCls = (k) =>
    `${btnBase} ${mode === k ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`;

  // সাধারণ দিন / শুক্র ও শনিবার — পরের সূচিতে সূচি বদলায়, পূর্ণ সূচিতে ওই অংশে স্ক্রল করে
  const pickMode = (k) => {
    setMode(k);
    if (view === 'full') {
      document.getElementById(`sched-${k}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8 max-w-5xl mx-auto space-y-5">
      <LiveClock now={now} />

      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">🚆 {TRAIN_TITLE}</h1>
        <p className="text-sm text-slate-500 mt-1">চট্টগ্রাম বিশ্ববিদ্যালয় কেন্দ্রীয় ছাত্র সংসদ (চাকসু)</p>
      </div>

      {/* মেনু: ৫টি অপশন সবসময় এক লাইনে — পরের সূচি | পূর্ণ সূচি | বিস্তারিত | সাধারণ দিন | শুক্র ও শনিবার */}
      <div className="no-print flex justify-center">
        <div className="flex w-full sm:w-auto items-center p-1 bg-white border border-slate-200 rounded-xl shadow-sm gap-0.5 min-[560px]:gap-1">
          <button type="button" onClick={() => setView('next')} className={viewCls('next')}>
            <span className="hidden min-[560px]:inline">⏭️ </span>পরের সূচি
          </button>
          <button type="button" onClick={() => setView('full')} className={viewCls('full')}>
            <span className="hidden min-[560px]:inline">📋 </span>পূর্ণ সূচি
          </button>
          <button type="button" onClick={() => setView('detail')} className={viewCls('detail')}>
            <span className="hidden min-[560px]:inline">🛤️ </span>বিস্তারিত
          </button>
          <span className="shrink-0 w-px self-stretch bg-slate-200 mx-0.5" aria-hidden="true" />
          <button type="button" onClick={() => pickMode('regular')} className={modeCls('regular')}>
            সাধারণ দিন
          </button>
          <button type="button" onClick={() => pickMode('weekend')} className={modeCls('weekend')}>
            শুক্র ও শনিবার
          </button>
        </div>
      </div>

      <TimeDisclaimer />

      {view === 'next' ? (
        <>
          {isToday ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'বটতলী স্টেশন থেকে ক্যাম্পাস', dir: 'toCampus', next: nextCampus, cls: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
                { label: 'ক্যাম্পাস থেকে বটতলী স্টেশন', dir: 'toCity', next: nextCity, cls: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
              ].map((c) => (
                <NextCard key={c.label} c={c} trains={data[c.dir]} nowSec={nowSec} />
              ))}
            </div>
          ) : (
            <p className="text-center text-xs sm:text-sm text-slate-500 bg-white/70 border border-slate-200 rounded-xl py-2 px-3">
              {mode === 'weekend' ? 'আজ শুক্র/শনিবার নয়' : 'আজ শুক্র/শনিবার'} — এটি আজকের সূচি নয়, তাই লাইভ হাইলাইট বন্ধ।
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            <Direction title={data.label} from="বটতলী স্টেশন" to="ক্যাম্পাস" tone="indigo" trains={data.toCampus} nowSec={nowSec} isToday={isToday} dir="toCampus" />
            <Direction title={data.label} from="ক্যাম্পাস" to="বটতলী স্টেশন" tone="emerald" trains={data.toCity} nowSec={nowSec} isToday={isToday} dir="toCity" />
          </div>

          <Note />
          <Contacts />
        </>
      ) : view === 'detail' ? (
        <>
          {!isToday && (
            <p className="text-center text-xs sm:text-sm text-slate-500 bg-white/70 border border-slate-200 rounded-xl py-2 px-3">
              {mode === 'weekend' ? 'আজ শুক্র/শনিবার নয়' : 'আজ শুক্র/শনিবার'} — এটি আজকের সূচি নয়, তাই লাইভ হাইলাইট বন্ধ।
            </p>
          )}
          <RouteSummary />
          <TrainPicker key={mode} data={data} nowSec={nowSec} isToday={isToday} />
          <Note />
          <Contacts />
        </>
      ) : (
        <>
          <FullTables today={today} nowSec={nowSec} />
          <Note />
          <ImageDownload />
          <Contacts />
        </>
      )}
    </div>
  );
}
