import { useEffect, useState } from 'react';
import PageBanner from './PageBanner.jsx';
import { ParkingAnimator, LightsAnimator } from './HomeInteractive.jsx';
import LightSwitchLab from './LightSwitchLab.jsx';

// "পার্কিং ও লাইট" — শিক্ষা কেন্দ্রের মতোই আলাদা আলাদা ট্যাব: পার্কিং | লাইট
const TABS = [
  { id: 'parking', label: '🚗 পার্কিং', short: '🚗 পার্কিং' },
  { id: 'lights', label: '💡 গাড়ির লাইট', short: '💡 লাইট' },
];

export default function ParkLightHub({ initial = 'parking' }) {
  const start = TABS.some((t) => t.id === initial) ? initial : 'parking';
  const [tab, setTab] = useState(start);
  const [dir, setDir] = useState('next');
  const idx = Math.max(0, TABS.findIndex((t) => t.id === tab));

  useEffect(() => setTab(start), [start]);

  const pick = (id) => {
    if (id === tab) return;
    setDir(TABS.findIndex((t) => t.id === id) > idx ? 'next' : 'prev');
    setTab(id);
    window.scrollTo({ top: 0 });
  };
  const onKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = (idx + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length;
    pick(TABS[n].id);
    e.currentTarget.querySelectorAll('[role=tab]')[n]?.focus();
  };

  return (
    <>
      <div style={{ top: 'calc(67px + env(safe-area-inset-top))' }} className="sticky z-30 border-b border-slate-200 bg-white/90 px-3 py-2.5 backdrop-blur sm:px-8">
        <div role="tablist" aria-label="পার্কিং ও লাইট" onKeyDown={onKey} className="relative mx-auto grid max-w-md grid-cols-2 rounded-full border border-brsp-green/30 bg-white p-1 shadow-md shadow-black/5">
          <span aria-hidden="true" className="seg-indicator absolute bottom-1 left-1 top-1 w-[calc((100%-0.5rem)/2)] rounded-full bg-brsp-green" style={{ transform: `translateX(${idx * 100}%)` }} />
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} tabIndex={tab === t.id ? 0 : -1} onClick={() => pick(t.id)} className={`relative z-10 whitespace-nowrap rounded-full px-2 py-2.5 text-sm font-semibold transition-colors duration-300 sm:text-base ${tab === t.id ? 'text-white' : 'text-slate-700 hover:text-brsp-green'}`}>
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div key={tab} role="tabpanel" className={`overflow-x-clip ${dir === 'next' ? 'anim-slide-next' : 'anim-slide-prev'}`}>
        {tab === 'parking' ? (
          <>
            <PageBanner title="পার্কিং" subtitle="ড্রাইভিং প্র্যাকটিক্যাল" chips={['পার্কিং অ্যানিমেশন', '৭ ধরনের পার্কিং']} />
            <ParkingAnimator />
            <div className="h-8" />
          </>
        ) : (
          <>
            <PageBanner title="গাড়ির লাইট" subtitle="কোন লাইট কখন ব্যবহার করবেন" chips={['লাইট সুইচ ইন্টারেক্টিভ', 'হেডলাইট · ফগ · ইন্ডিকেটর']} />
            <LightsAnimator />
            <LightSwitchLab />
            <div className="h-10" />
          </>
        )}
      </div>
    </>
  );
}
