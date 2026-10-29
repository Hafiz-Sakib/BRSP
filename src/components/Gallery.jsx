import { useCallback, useEffect, useRef, useState } from 'react';

// ছবি: src/assets/gallery/g01.jpg … (ক্রমানুযায়ী), ছোট থাম্বনেইল: gallery/thumbs/t01.jpg …
const fullMods = import.meta.glob('../assets/gallery/g[0-9][0-9].jpg', { eager: true, import: 'default' });
const thumbMods = import.meta.glob('../assets/gallery/thumbs/t[0-9][0-9].jpg', { eager: true, import: 'default' });
const sortedValues = (mods) => Object.keys(mods).sort().map((k) => mods[k]);
const FULL = sortedValues(fullMods);
const THUMBS = sortedValues(thumbMods);

const AUTOPLAY_MS = 4500;
const bnNum = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Arrow({ dir, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'আগের ছবি' : 'পরের ছবি'}
      className={`absolute top-1/2 -translate-y-1/2 ${dir === 'prev' ? 'left-2 sm:left-3' : 'right-2 sm:right-3'} z-10 grid place-items-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  );
}

export default function Gallery() {
  const total = FULL.length;
  const trackRef = useRef(null);
  const thumbsRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(0);

  const goTo = useCallback((i, smooth = true) => {
    const el = trackRef.current;
    if (!el || !total) return;
    const next = (i + total) % total;
    el.scrollTo({ left: next * el.clientWidth, behavior: smooth && !reduceMotion() ? 'smooth' : 'auto' });
  }, [total]);

  // স্ক্রল/সোয়াইপ করলে বর্তমান স্লাইড ট্র্যাক করা
  const onScroll = () => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== indexRef.current) {
      indexRef.current = i;
      setIndex(i);
    }
  };

  // সিলেক্টেড থাম্বনেইল দৃশ্যমান রাখা (শুধু থাম্ব-স্ট্রিপ স্ক্রল হয়, পুরো পেজ নয়)
  useEffect(() => {
    const strip = thumbsRef.current;
    const btn = strip?.children[index];
    if (!strip || !btn) return;
    const target = btn.offsetLeft - (strip.clientWidth - btn.clientWidth) / 2;
    strip.scrollTo({ left: target, behavior: reduceMotion() ? 'auto' : 'smooth' });
  }, [index]);

  // অটোপ্লে: হোভার/ফোকাস/স্ক্রিনের বাইরে/ট্যাব হিডেন হলে থামে
  useEffect(() => {
    if (paused || total < 2 || reduceMotion()) return undefined;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.4 });
    if (trackRef.current) io.observe(trackRef.current);
    const id = setInterval(() => {
      if (visible && !document.hidden) goTo(indexRef.current + 1);
    }, AUTOPLAY_MS);
    return () => { clearInterval(id); io.disconnect(); };
  }, [paused, total, goTo]);

  // উইন্ডো রিসাইজ হলে একই স্লাইডে থাকা
  useEffect(() => {
    const onResize = () => goTo(indexRef.current, false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [goTo]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(indexRef.current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(indexRef.current + 1); }
  };

  if (!total) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="ব্যাচ ২-এর ছবির গ্যালারি"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setTimeout(() => setPaused(false), 6000)}
      className="rounded-2xl bg-brsp-ink overflow-hidden shadow-lg shadow-black/10"
    >
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          tabIndex={0}
          className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden aspect-[4/5] sm:aspect-[4/3] lg:aspect-[16/9] max-h-[85vh] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-300"
        >
          {FULL.map((src, i) => (
            <figure
              key={src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${bnNum(i + 1)} / ${bnNum(total)}`}
              className="relative flex-none w-full h-full snap-center snap-always overflow-hidden"
            >
              {/* ঝাপসা ব্যাকগ্রাউন্ড: পোর্ট্রেট/ল্যান্ডস্কেপ দুই ধরনের ছবিই ক্রপ ছাড়া সুন্দর দেখায় */}
              <img src={THUMBS[i] || src} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60" />
              <img
                src={src}
                alt={`ব্যাচ ২-এর মুহূর্ত — ছবি ${bnNum(i + 1)}`}
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                draggable="false"
                className="relative w-full h-full object-contain select-none"
              />
            </figure>
          ))}
        </div>

        <Arrow dir="prev" onClick={() => goTo(index - 1)} />
        <Arrow dir="next" onClick={() => goTo(index + 1)} />

        <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs sm:text-sm font-semibold text-white tabular-nums backdrop-blur" aria-live="off">
          {bnNum(index + 1)} / {bnNum(total)}
        </span>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15" aria-hidden="true">
          <div className="h-full bg-emerald-300 transition-[width] duration-300" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>

      {/* থাম্বনেইল স্ট্রিপ */}
      <div ref={thumbsRef} className="flex gap-2 overflow-x-auto p-3 [scrollbar-width:thin]" role="tablist" aria-label="ছবি বাছাই করুন">
        {THUMBS.map((t, i) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`ছবি ${bnNum(i + 1)}`}
            onClick={() => goTo(i)}
            className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition ${i === index ? 'border-emerald-300 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
          >
            <img src={t} alt="" width="64" height="64" loading="lazy" decoding="async" draggable="false" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
