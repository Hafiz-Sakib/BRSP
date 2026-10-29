import { useEffect, useRef, useState } from 'react';
import brtaLogo from '../assets/logos/brta.png';

const ICONS = {
  home: 'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10',
  roster: 'M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z',
  students: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21v-1a6 6 0 0112 0v1M17 11a3 3 0 100-6M20 21v-1a5 5 0 00-3-4.6',
  donation: 'M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6c-2.5 4.5-9.5 9-9.5 9z',
  train: 'M7 3h10a3 3 0 013 3v9a3 3 0 01-3 3H7a3 3 0 01-3-3V6a3 3 0 013-3zM4 11h16M8 21l2-3M16 21l-2-3',
};

export const NAV_ITEMS = [
  { id: 'home', label: 'হোম' },
  { id: 'roster', label: 'রোস্টার' },
  { id: 'students', label: 'শিক্ষার্থী তালিকা' },
  { id: 'donation', label: 'অনুদান' },
  { id: 'train', label: 'শাটল ট্রেন' },
];

function Icon({ name }) {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

// পেজের সবার উপরে স্টিকি ভাসমান নেভবার। ছোট স্ক্রিনে হ্যামবার্গার মেনু
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
    <nav ref={ref} aria-label="প্রধান মেনু" className="no-print sticky top-0 z-40 h-16 px-3 flex items-center justify-center">
      <div className="w-full md:w-auto max-w-xl md:max-w-none h-12 flex items-center justify-between gap-1 rounded-full bg-brsp-ink/95 backdrop-blur-md text-white ring-1 ring-white/15 shadow-lg shadow-black/25 pl-2 pr-2">
        <button type="button" onClick={() => select('home')} className="flex items-center gap-2 rounded-full pr-2 md:pr-3" aria-label="হোম পেজে যান">
          <img src={brtaLogo} width={32} height={32} alt="" className="w-8 h-8 rounded-full bg-white p-0.5 select-none" draggable="false" />
          <span className="font-bold text-sm md:hidden">BRSP Batch 2</span>
        </button>

        <ul className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => select(it.id)}
                aria-current={tab === it.id ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition ${
                  tab === it.id ? 'bg-white text-brsp-ink' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon name={it.id} />
                {it.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
          className="md:hidden grid place-items-center w-10 h-10 rounded-full hover:bg-white/10 transition"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <ul id="mobile-menu" className="anim-page md:hidden absolute inset-x-3 top-full -mt-1 rounded-2xl bg-brsp-ink text-white ring-1 ring-white/15 shadow-xl p-2">
          {NAV_ITEMS.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => select(it.id)}
                aria-current={tab === it.id ? 'page' : undefined}
                className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl font-semibold transition ${
                  tab === it.id ? 'bg-white text-brsp-ink' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Icon name={it.id} />
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
