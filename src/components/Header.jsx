import govtLogo from '../assets/logos/govt-bd.png';
import brtaLogo from '../assets/logos/brta.png';
import brtcLogo from '../assets/logos/brtc.png';
import worldBankLogo from '../assets/logos/world-bank.png';

const LOGOS = [
  { src: govtLogo, alt: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', w: 438, h: 443, cls: 'h-12 sm:h-[4.5rem]' },
  { src: brtaLogo, alt: 'বাংলাদেশ সড়ক পরিবহণ কর্তৃপক্ষ (বিআরটিএ)', w: 480, h: 480, cls: 'h-12 sm:h-[4.5rem]' },
  { src: brtcLogo, alt: 'বাংলাদেশ সড়ক পরিবহণ কর্পোরেশন (বিআরটিসি)', w: 314, h: 292, cls: 'h-12 sm:h-[4.5rem]' },
  { src: worldBankLogo, alt: 'বিশ্বব্যাংক (The World Bank)', w: 480, h: 243, cls: 'h-9 sm:h-14' },
];

// সব পেজে নেভবারের নিচে — অফিসিয়াল লোগো স্ট্রিপ
export default function Header() {
  return (
    <header className="anim-header bg-white border-b-[3px] border-brsp-red px-4 sm:px-8">
      <div className="max-w-6xl mx-auto py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-6">
          {LOGOS.map((l, i) => (
            <div key={l.src} className="flex items-center gap-3 sm:gap-6">
              {i > 0 && <span className="w-px h-8 sm:h-10 bg-slate-200" aria-hidden="true" />}
              <img src={l.src} width={l.w} height={l.h} alt={l.alt} className={`${l.cls} w-auto select-none`} draggable="false" decoding="async" />
            </div>
          ))}
        </div>
        <p className="hidden md:block text-right text-xs font-semibold text-slate-500 leading-snug">
          গণপ্রজাতন্ত্রী বাংলাদেশ সরকার ও বিশ্বব্যাংকের যৌথ অর্থায়নে
        </p>
      </div>
    </header>
  );
}
