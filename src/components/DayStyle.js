// বার অনুযায়ী রঙ
export const DAY_STYLE = {
  রবিবার: { badge: 'bg-emerald-100 text-emerald-800', bar: 'from-emerald-400 to-emerald-600', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
  সোমবার: { badge: 'bg-amber-100 text-amber-800', bar: 'from-amber-400 to-amber-600', chip: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500' },
  বুধবার: { badge: 'bg-blue-100 text-blue-800', bar: 'from-blue-400 to-blue-600', chip: 'bg-blue-50 text-blue-700 ring-blue-200', dot: 'bg-blue-500' },
  বৃহস্পতিবার: { badge: 'bg-purple-100 text-purple-800', bar: 'from-purple-400 to-purple-600', chip: 'bg-purple-50 text-purple-700 ring-purple-200', dot: 'bg-purple-500' },
};

export const FALLBACK_STYLE = {
  badge: 'bg-slate-100 text-slate-800',
  bar: 'from-slate-400 to-slate-600',
  chip: 'bg-slate-50 text-slate-700 ring-slate-200',
  dot: 'bg-slate-500',
};

export const styleFor = (day) => DAY_STYLE[day] ?? FALLBACK_STYLE;
