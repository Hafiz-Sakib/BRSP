import { useEffect, useRef, useState } from 'react';
import brtaLogo from '../assets/logos/brta.png';

export const NAV_ITEMS = [
  { id: 'roster', label: 'রোস্টার' },
  { id: 'students', label: 'শিক্ষার্থী তালিকা' },
  { id: 'donation', label: 'অনুদান' },
  { id: 'train', label: '🚆 শাটল ট্রেন' },
];

// ডেস্কটপে অনুভূমিক নেভবার, মোবাইল/ছোট স্ক্রিনে হ্যামবার্গার মেনু
export default function Navbar({ tab, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onOutside = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
    };
  }, [open]);

  const select = (id) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <nav ref={ref} aria-label="প্রধান মেনু" className="relative bg-white border-b border-slate-200 shadow-sm px-4 sm:px-8 lg:px-10">
      <div className="max-w-[96rem] mx-auto h-14 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => select('roster')}
          className="flex items-center gap-2.5 rounded-lg"
          aria-label="রোস্টার পেজে যান"
        >
          <img src={brtaLogo} width={36} height={36} alt="" className="w-9 h-9 select-none" draggable="false" />
          <span className="font-bold text-slate-800 leading-tight text-left">
            BRSP Batch 2
            <span className="block text-[11px] font-medium text-slate-500">গাড়ি ধোয়ার রোস্টার</span>
          </span>
        </button>

        {/* ডেস্কটপ */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => select(it.id)}
                aria-current={tab === it.id ? 'page' : undefined}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  tab === it.id ? 'bg-brsp-green text-white shadow' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>

        {/* হ্যামবার্গার */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
          className="md:hidden grid place-items-center w-11 h-11 -mr-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <ul id="mobile-menu" className="anim-page md:hidden absolute inset-x-0 top-full z-30 bg-white border-b border-slate-200 shadow-lg p-2">
          {NAV_ITEMS.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => select(it.id)}
                aria-current={tab === it.id ? 'page' : undefined}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
                  tab === it.id ? 'bg-brsp-green text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
