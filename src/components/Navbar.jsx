import { useEffect, useRef, useState } from 'react';
import govtLogo from '../assets/logos/govt-bd.png';
import brtaLogo from '../assets/logos/brta.png';
import brtcLogo from '../assets/logos/brtc.png';
import worldBankLogo from '../assets/logos/world-bank.png';

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

const LOGOS = [
  { src: govtLogo, alt: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', w: 438, h: 443, cls: 'h-9 sm:h-10 xl:h-12' },
  { src: brtaLogo, alt: 'বাংলাদেশ সড়ক পরিবহণ কর্তৃপক্ষ (বিআরটিএ)', w: 480, h: 480, cls: 'h-9 sm:h-10 xl:h-12' },
  { src: brtcLogo, alt: 'বাংলাদেশ সড়ক পরিবহণ কর্পোরেশন (বিআরটিসি)', w: 300, h: 276, cls: 'h-9 sm:h-10 xl:h-12' },
  { src: worldBankLogo, alt: 'বিশ্বব্যাংক (The World Bank)', w: 480, h: 243, cls: 'h-6 sm:h-8 xl:h-10' },
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
    <nav ref={ref} aria-label="প্রধান মেনু" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-[3px] border-brsp-red shadow-sm print:static print:shadow-none">
      <div className="max-w-[90rem] mx-auto px-3 sm:px-6 h-16 flex items-center gap-3">
        {/* বাম পাশে লোগো */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
          {LOGOS.map((l, i) => (
            <div key={l.src} className="flex items-center gap-2 sm:gap-4">
              {i > 0 && <span className="w-px h-6 sm:h-8 bg-slate-200" aria-hidden="true" />}
              <img src={l.src} width={l.w} height={l.h} alt={l.alt} className={`${l.cls} w-auto select-none`} draggable="false" decoding="async" />
            </div>
          ))}
        </div>

        {/* মাঝে মেনু (ডেস্কটপ) */}
        <div className="hidden lg:flex mx-auto print:hidden items-center h-12 rounded-full bg-emerald-50/70 border border-brsp-green/40 ring-1 ring-brsp-green/10 px-1.5">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((it) => (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={() => select(it.id)}
                  aria-current={tab === it.id ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold border transition ${
                    tab === it.id
                      ? 'bg-brsp-green text-white border-brsp-ink shadow-sm'
                      : 'border-transparent text-slate-700 hover:text-brsp-green hover:bg-brsp-green/10'
                  }`}
                >
                  <Icon name={it.id} />
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ডান পাশে লেখা (বড় স্ক্রিনে) */}
        <p className="hidden xl:block shrink-0 max-w-[15rem] text-right text-xs font-semibold text-slate-500 leading-snug">
          গণপ্রজাতন্ত্রী বাংলাদেশ সরকার ও বিশ্বব্যাংকের যৌথ অর্থায়নে
        </p>

        {/* মোবাইল/ট্যাবলেটে হ্যামবার্গার */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
          className="lg:hidden print:hidden ml-auto shrink-0 grid place-items-center w-11 h-11 rounded-full bg-white text-brsp-ink border border-brsp-green/40 shadow-sm hover:bg-brsp-green/10 transition"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <ul id="mobile-menu" className="anim-page lg:hidden absolute right-3 top-full mt-2 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl bg-white text-slate-700 border border-brsp-green/40 shadow-xl shadow-black/15 p-2">
          {NAV_ITEMS.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => select(it.id)}
                aria-current={tab === it.id ? 'page' : undefined}
                className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl font-semibold border transition ${
                  tab === it.id
                    ? 'bg-brsp-green text-white border-brsp-ink'
                    : 'border-transparent hover:bg-brsp-green/10'
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
