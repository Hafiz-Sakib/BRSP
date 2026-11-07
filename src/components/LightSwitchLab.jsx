import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const Stalk3D = lazy(() => import('./Stalk3D.jsx'));

// WebGL চালু না থাকলে (বা লোড হতে দেরি হলে) আগের SVG নিয়ন্ত্রণই দেখানো হয়
const hasGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) {
    return false;
  }
};

function Ctl3D({ fallback, ...props }) {
  const [ok, setOk] = useState(() => hasGL());
  if (!ok) return fallback;
  return (
    <Suspense fallback={fallback}>
      <Stalk3D {...props} onFail={() => setOk(false)} />
    </Suspense>
  );
}

// ইন্টারেক্টিভ: গাড়ির লাইট সুইচ (স্টক টাইপ) — রিং ঘোরালে কোন লাইট জ্বলে, কোন চিহ্নে কী হয়
const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const POSITIONS = [
  { id: 'off', angle: -46, label: 'অফ', short: 'OFF' },
  { id: 'park', angle: 0, label: 'পজিশন / পার্কিং', short: '☼' },
  { id: 'low', angle: 46, label: 'হেডলাইট (লো বিম)', short: '≣D' },
];

const INFO = {
  off: {
    title: 'অফ (সব লাইট বন্ধ)',
    sym: 'OFF',
    body: 'রিং “OFF”-এ থাকলে হেডলাইট ও পজিশন লাইট — কোনোটিই জ্বলে না।',
    use: ['দিনের আলোয়, পরিষ্কার আবহাওয়ায় চালানোর সময়', 'গাড়ি বন্ধ করে নামার সময়'],
    avoid: ['সন্ধ্যা, বৃষ্টি বা কুয়াশায় অফ রেখে চালানো — অন্যরা আপনাকে দেখতে পাবে না'],
  },
  park: {
    title: 'পজিশন / পার্কিং লাইট (☼)',
    sym: '☼',
    body: 'সামনের ও পেছনের ছোট বাতি, নম্বর প্লেটের বাতি এবং ড্যাশবোর্ডের লাইট জ্বলে। সামনের রাস্তা আলোকিত হয় না।',
    use: ['সন্ধ্যা বা রাতে রাস্তার পাশে গাড়ি রাখলে', 'গোধূলিতে গাড়ি অন্যের চোখে পড়ানোর জন্য'],
    avoid: ['এই অবস্থানে রাতে চালানো — সামনের রাস্তা ঠিকমতো দেখা যায় না'],
  },
  low: {
    title: 'হেডলাইট — লো বিম (≣D)',
    sym: '≣D',
    body: 'মূল হেডলাইট জ্বলে — রাতে স্বাভাবিক চালানোর আলো। সাথে পজিশন লাইট, নম্বর প্লেট ও ড্যাশবোর্ডের লাইটও জ্বলে।',
    use: ['রাতে শহর ও আবাসিক এলাকায়', 'সামনে থেকে গাড়ি এলে বা সামনের গাড়ির কাছাকাছি থাকলে', 'বৃষ্টি, কুয়াশা বা সন্ধ্যায় দৃশ্যমানতা কমলে'],
    avoid: ['হেডলাইট ঠিকমতো অ্যাডজাস্ট না রাখা — উল্টো দিকের চালকের চোখে লাগে'],
  },
  high: {
    title: 'হাই বিম (স্টক সামনে ঠেলুন)',
    sym: '≣D',
    body: 'লো বিমের সাথে আরও উঁচু ও দূরের আলো জ্বলে। ড্যাশবোর্ডে নীল চিহ্ন জ্বলে। স্টক নিজের দিকে টেনে আনলে আবার লো বিমে ফেরে।',
    use: ['ফাঁকা রাস্তায়, সামনে বা পেছনে কোনো গাড়ি না থাকলে', 'অন্ধকার হাইওয়েতে দূরের রাস্তা দেখার জন্য'],
    avoid: ['সামনে থেকে গাড়ি এলে বা সামনের গাড়ির খুব কাছে থাকলে — চোখ ধাঁধিয়ে যায়'],
  },
};

const TIPS = [
  'শেষের রিং ঘোরান: OFF → পজিশন (☼) → হেডলাইট (≣D)।',
  'রাতে গাড়ি চালানোর সময় লো বিম (হেডলাইট) ব্যবহার করুন।',
  'হাই বিমের জন্য স্টক সামনে ঠেলুন — শুধু ফাঁকা রাস্তায়, কাছাকাছি গাড়ি থাকলে নয়।',
  'ইন্ডিকেটর: স্টক উপরে তুললে ডান (R), নিচে নামালে বাঁ (L)।',
];

/* ---------------- ছোট আইকন ---------------- */
const SUN_P = (
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
  </>
);
const beamP = (down) => (
  <>
    <path d="M13 5h2a7 7 0 010 14h-2z" />
    {down ? <path d="M9 7L3 9M9 11l-6 2M9 15l-6 2" /> : <path d="M9 7H3M9 11H3M9 15H3M9 19H3" />}
  </>
);
const ARROWS_P = <path d="M3 12l5-5v3h4v4H8v3zM21 12l-5-5v3h-1v4h1v3z" />;

function Ico({ children, className = 'h-6 w-6', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
const SunIcon = (props) => <Ico {...props}>{SUN_P}</Ico>;
const BeamIcon = ({ down = true, ...props }) => <Ico {...props}>{beamP(down)}</Ico>;
const ArrowsIcon = (props) => <Ico {...props}>{ARROWS_P}</Ico>;

/* ---------------- সামনে থেকে গাড়ি ---------------- */
function FrontView({ ring, high, turn, blink }) {
  const park = ring !== 'off';
  const low = ring === 'low';
  const bulb = high ? '#e0f2fe' : low ? '#fff7d6' : '#4b5563';
  const R = turn === 'R' && blink;
  const L = turn === 'L' && blink;
  return (
    <svg viewBox="0 0 360 230" className="block h-auto w-full" role="img" aria-label="সামনে থেকে গাড়ির লাইট">
      <defs>
        <filter id="lsl-b1" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="9" /></filter>
        <filter id="lsl-b2" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" /></filter>
        <linearGradient id="lsl-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#060b16" /><stop offset="1" stopColor="#0f1a2e" /></linearGradient>
        <linearGradient id="lsl-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#334155" /><stop offset="1" stopColor="#1e293b" /></linearGradient>
      </defs>
      <rect width="360" height="230" fill="url(#lsl-sky)" />
      <path d="M0 230L110 168H250L360 230Z" fill="#101827" />
      {/* গাড়ির শরীর */}
      <path d="M92 112L118 62H242L268 112Z" fill="#0f172a" />
      <path d="M104 108L124 70H236L256 108Z" fill="#1b2638" />
      <rect x="48" y="108" width="264" height="84" rx="24" fill="url(#lsl-body)" />
      <rect x="132" y="138" width="96" height="30" rx="8" fill="#0b1220" />
      <path d="M140 146h80M140 153h80M140 160h80" stroke="#334155" strokeWidth="2" />
      <rect x="86" y="172" width="188" height="14" rx="7" fill="#0b1220" opacity=".7" />
      {/* হেডলাইট ইউনিট */}
      <rect x="58" y="120" width="76" height="40" rx="16" fill="#273244" />
      <rect x="226" y="120" width="76" height="40" rx="16" fill="#273244" />
      <ellipse cx="96" cy="140" rx="24" ry="12" fill={bulb} stroke="#475569" strokeWidth="1.5" />
      <ellipse cx="264" cy="140" rx="24" ry="12" fill={bulb} stroke="#475569" strokeWidth="1.5" />
      {/* পজিশন বাতি (ছোট, হলদেটে) */}
      <circle cx="124" cy="152" r="4.5" fill={park ? '#fcd34d' : '#3b4556'} />
      <circle cx="236" cy="152" r="4.5" fill={park ? '#fcd34d' : '#3b4556'} />
      {/* ইন্ডিকেটর — সামনে থেকে দেখলে গাড়ির ডান দিক আপনার বাঁ পাশে */}
      <rect x="54" y="164" width="26" height="9" rx="4" fill={R ? '#fb923c' : '#3b4556'} />
      <rect x="280" y="164" width="26" height="9" rx="4" fill={L ? '#fb923c' : '#3b4556'} />
      {/* নম্বর প্লেট */}
      <rect x="156" y="172" width="48" height="14" rx="3" fill={park ? '#fef3c7' : '#9ca3af'} />
      {park && <rect x="150" y="170" width="60" height="18" rx="6" fill="#fde68a" opacity=".35" filter="url(#lsl-b2)" />}
      {/* আলোর আভা */}
      {park && !low && (
        <>
          <circle cx="124" cy="152" r="16" fill="#fbbf24" opacity=".6" filter="url(#lsl-b2)" />
          <circle cx="236" cy="152" r="16" fill="#fbbf24" opacity=".6" filter="url(#lsl-b2)" />
        </>
      )}
      {low && !high && (
        <>
          <circle cx="96" cy="140" r="44" fill="#fff7d6" opacity=".55" filter="url(#lsl-b1)" />
          <circle cx="264" cy="140" r="44" fill="#fff7d6" opacity=".55" filter="url(#lsl-b1)" />
        </>
      )}
      {high && (
        <>
          <circle cx="96" cy="140" r="78" fill="#bae6fd" opacity=".7" filter="url(#lsl-b1)" />
          <circle cx="264" cy="140" r="78" fill="#bae6fd" opacity=".7" filter="url(#lsl-b1)" />
          <g stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" opacity=".8">
            <path d="M96 140L40 96M96 140L30 140M96 140L44 188M264 140L320 96M264 140L330 140M264 140L316 188" />
          </g>
        </>
      )}
      {R && <circle cx="67" cy="168" r="18" fill="#fb923c" opacity=".7" filter="url(#lsl-b2)" />}
      {L && <circle cx="293" cy="168" r="18" fill="#fb923c" opacity=".7" filter="url(#lsl-b2)" />}
      <text x="67" y="215" textAnchor="middle" fontSize="10" fill="#94a3b8">ডান (R)</text>
      <text x="293" y="215" textAnchor="middle" fontSize="10" fill="#94a3b8">বাঁ (L)</text>
    </svg>
  );
}

/* ---------------- উপর থেকে — আলো কতদূর যায় ---------------- */
function TopView({ ring, high, turn, blink }) {
  const park = ring !== 'off';
  const low = ring === 'low';
  const R = turn === 'R' && blink;
  const L = turn === 'L' && blink;
  return (
    <svg viewBox="0 0 360 240" className="block h-auto w-full" role="img" aria-label="উপর থেকে আলোর দূরত্ব">
      <defs>
        <linearGradient id="lsl-lo" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fff7d6" stopOpacity=".85" /><stop offset="1" stopColor="#fff7d6" stopOpacity="0" /></linearGradient>
        <linearGradient id="lsl-hi" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#bae6fd" stopOpacity=".9" /><stop offset="1" stopColor="#bae6fd" stopOpacity="0" /></linearGradient>
        <filter id="lsl-b3" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <rect width="360" height="240" fill="#0b1220" />
      <rect x="110" y="0" width="140" height="240" fill="#111827" />
      <path d="M180 0v240" stroke="#374151" strokeWidth="2" strokeDasharray="12 10" />
      {/* আলোর পরিসর */}
      <g style={{ transition: 'opacity .35s' }} opacity={high ? 1 : 0}>
        <path d="M166 182L150 14H182Z" fill="url(#lsl-hi)" />
        <path d="M194 182L178 14H210Z" fill="url(#lsl-hi)" />
      </g>
      <g style={{ transition: 'opacity .35s' }} opacity={low ? 1 : 0}>
        <path d="M164 182L112 112H176Z" fill="url(#lsl-lo)" />
        <path d="M196 182L184 112H248Z" fill="url(#lsl-lo)" />
      </g>
      {park && !low && (
        <>
          <circle cx="164" cy="182" r="10" fill="#fbbf24" opacity=".6" filter="url(#lsl-b3)" />
          <circle cx="196" cy="182" r="10" fill="#fbbf24" opacity=".6" filter="url(#lsl-b3)" />
        </>
      )}
      {/* গাড়ি (উপর থেকে, সামনে উপরের দিকে) */}
      <rect x="152" y="180" width="56" height="52" rx="12" fill="#334155" />
      <rect x="160" y="190" width="40" height="16" rx="4" fill="#0f172a" />
      <circle cx="162" cy="183" r="3.5" fill={low ? '#fff7d6' : park ? '#fcd34d' : '#64748b'} />
      <circle cx="198" cy="183" r="3.5" fill={low ? '#fff7d6' : park ? '#fcd34d' : '#64748b'} />
      <circle cx="160" cy="229" r="3.5" fill={park ? '#ef4444' : '#64748b'} />
      <circle cx="200" cy="229" r="3.5" fill={park ? '#ef4444' : '#64748b'} />
      {park && (
        <>
          <circle cx="160" cy="229" r="9" fill="#ef4444" opacity=".5" filter="url(#lsl-b3)" />
          <circle cx="200" cy="229" r="9" fill="#ef4444" opacity=".5" filter="url(#lsl-b3)" />
        </>
      )}
      {/* ইন্ডিকেটর */}
      {L && (<><circle cx="152" cy="186" r="6" fill="#fb923c" /><circle cx="152" cy="228" r="6" fill="#fb923c" /></>)}
      {R && (<><circle cx="208" cy="186" r="6" fill="#fb923c" /><circle cx="208" cy="228" r="6" fill="#fb923c" /></>)}
      {/* দূরত্বের দাগ */}
      <g fontSize="10" fill="#94a3b8">
        <path d="M252 112h100M252 14h100" stroke="#475569" strokeDasharray="3 3" />
        <text x="256" y="106">লো বিম ≈ ৩০–৪০ মি</text>
        <text x="256" y="30">হাই বিম ≈ ১০০ মি+</text>
      </g>
    </svg>
  );
}

/* ---------------- ড্যাশবোর্ড সূচক ---------------- */
function Dash({ ring, high, turn, blink }) {
  const park = ring !== 'off';
  const low = ring === 'low';
  const item = (on, color, children, label) => (
    <div className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-center transition ${on ? 'border-white/20 bg-white/10' : 'border-white/5 bg-white/[0.03] opacity-50'}`}>
      <span style={{ color: on ? color : '#64748b', filter: on ? `drop-shadow(0 0 6px ${color})` : 'none' }}>{children}</span>
      <span className="text-[11px] font-semibold leading-tight text-slate-300">{label}</span>
    </div>
  );
  return (
    <div className="grid grid-cols-4 gap-2" aria-label="ড্যাশবোর্ড সূচক">
      {item(park, '#4ade80', <SunIcon />, 'পজিশন')}
      {item(low, '#4ade80', <BeamIcon />, 'লো বিম')}
      {item(high, '#60a5fa', <BeamIcon down={false} />, 'হাই বিম')}
      {item(!!turn && blink, '#4ade80', <ArrowsIcon />, turn === 'R' ? 'ডান (R)' : turn === 'L' ? 'বাঁ (L)' : 'ইন্ডিকেটর')}
    </div>
  );
}

/* ---------------- ঘোরানো রিং ---------------- */
function Knob({ ring, setRing }) {
  const ref = useRef(null);
  const drag = useRef({ on: false, moved: false, x: 0, y: 0 });
  const CX = 110;
  const CY = 118;
  const cur = POSITIONS.find((p) => p.id === ring);

  const pick = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 220 - CX;
    const y = ((e.clientY - r.top) / r.height) * 200 - CY;
    let a = (Math.atan2(x, -y) * 180) / Math.PI;
    a = Math.max(-70, Math.min(70, a));
    const n = POSITIONS.reduce((b, p) => (Math.abs(p.angle - a) < Math.abs(b.angle - a) ? p : b));
    setRing(n.id);
  };
  const down = (e) => {
    drag.current = { on: true, moved: false, x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const move = (e) => {
    if (!drag.current.on) return;
    if (Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) > 4) drag.current.moved = true;
    if (drag.current.moved) pick(e);
  };
  const up = () => {
    if (drag.current.on && !drag.current.moved) {
      const i = POSITIONS.findIndex((p) => p.id === ring);
      setRing(POSITIONS[(i + 1) % POSITIONS.length].id);
    }
    drag.current.on = false;
  };
  const onKey = (e) => {
    const i = POSITIONS.findIndex((p) => p.id === ring);
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setRing(POSITIONS[Math.min(2, i + 1)].id); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setRing(POSITIONS[Math.max(0, i - 1)].id); }
  };

  return (
    <svg ref={ref} viewBox="0 0 220 200" className="mx-auto block h-auto w-full max-w-[21rem] touch-none select-none" role="slider" tabIndex={0} aria-label="লাইট কন্ট্রোল রিং" aria-valuemin={0} aria-valuemax={2} aria-valuenow={POSITIONS.findIndex((p) => p.id === ring)} aria-valuetext={cur.label} onKeyDown={onKey}>
      {/* স্কেলের চিহ্ন */}
      <g onClick={() => setRing('off')} style={{ cursor: 'pointer' }}>
        <circle cx="38" cy="58" r="25" fill={ring === 'off' ? '#fde68a' : '#f1f5f9'} stroke={ring === 'off' ? '#f59e0b' : '#cbd5e1'} />
        <text x="38" y="63" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a">OFF</text>
      </g>
      <g onClick={() => setRing('park')} style={{ cursor: 'pointer' }}>
        <circle cx="110" cy="26" r="23" fill={ring === 'park' ? '#fde68a' : '#f1f5f9'} stroke={ring === 'park' ? '#f59e0b' : '#cbd5e1'} />
        <g transform="translate(93.2 9.2) scale(1.4)" fill="none" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{SUN_P}</g>
      </g>
      <g onClick={() => setRing('low')} style={{ cursor: 'pointer' }}>
        <circle cx="182" cy="58" r="25" fill={ring === 'low' ? '#fde68a' : '#f1f5f9'} stroke={ring === 'low' ? '#f59e0b' : '#cbd5e1'} />
        <g transform="translate(165.2 41.2) scale(1.4)" fill="none" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{beamP(true)}</g>
      </g>
      {/* নব */}
      <circle cx={CX} cy={CY} r="62" fill="#1f2937" stroke="#475569" strokeWidth="3" />
      <g
        style={{ transform: `rotate(${cur.angle}deg)`, transformOrigin: `${CX}px ${CY}px`, transition: 'transform .3s cubic-bezier(.22,1,.36,1)', cursor: 'grab' }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <circle cx={CX} cy={CY} r="52" fill="#111827" stroke="#64748b" strokeWidth="2" />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i * 360) / 16;
          return <line key={i} x1={CX} y1={CY - 52} x2={CX} y2={CY - 44} stroke="#374151" strokeWidth="3" strokeLinecap="round" transform={`rotate(${a} ${CX} ${CY})`} />;
        })}
        <rect x={CX - 5} y={CY - 50} width="10" height="22" rx="5" fill="#facc15" />
        <circle cx={CX} cy={CY} r="20" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        <text x={CX} y={CY + 5} textAnchor="middle" fontSize="12" fontWeight="700" fill="#cbd5e1">ঘোরান</text>
      </g>
    </svg>
  );
}

/* ---------------- স্টক (লিভার): উপরে / নিউট্রাল / নিচে + সামনে ঠেলা ---------------- */
const LEVER = [
  { id: 'R', angle: -24, label: 'উপরে তুললে → ডান (R)', act: 'উপরে তুলুন', mark: 'ডান ইন্ডিকেটর (R)' },
  { id: 'N', angle: 0, label: 'মাঝে (নিউট্রাল) → ইন্ডিকেটর অফ', act: 'মাঝে নামান', mark: 'নিউট্রাল / অফ' },
  { id: 'L', angle: 24, label: 'নিচে নামালে → বাঁ (L)', act: 'নিচে নামান', mark: 'বাঁ ইন্ডিকেটর (L)' },
];

function Lever({ turn, setTurn, high, blink }) {
  const ref = useRef(null);
  const drag = useRef(false);
  const PX = 40;
  const PY = 88;
  const cur = LEVER.find((l) => l.id === (turn || 'N'));
  const set = (id) => setTurn(id === 'N' ? null : id);

  const pick = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 320 - PX;
    const y = ((e.clientY - r.top) / r.height) * 176 - PY;
    const a = (Math.atan2(y, Math.max(x, 8)) * 180) / Math.PI; // নিচে = ধনাত্মক
    const n = LEVER.reduce((b, l) => (Math.abs(l.angle - a) < Math.abs(b.angle - a) ? l : b));
    set(n.id);
  };
  const down = (e) => {
    drag.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pick(e);
  };
  const move = (e) => drag.current && pick(e);
  const up = () => { drag.current = false; };
  const onKey = (e) => {
    const i = LEVER.findIndex((l) => l.id === (turn || 'N'));
    if (e.key === 'ArrowUp') { e.preventDefault(); set(LEVER[Math.max(0, i - 1)].id); }
    if (e.key === 'ArrowDown') { e.preventDefault(); set(LEVER[Math.min(2, i + 1)].id); }
  };
  const lit = !!turn && blink;

  return (
    <svg ref={ref} viewBox="0 0 320 176" className="mx-auto block h-auto w-full max-w-[22rem] touch-none select-none" role="slider" tabIndex={0} aria-label="স্টক (লিভার)" aria-valuemin={0} aria-valuemax={2} aria-valuenow={LEVER.findIndex((l) => l.id === (turn || 'N'))} aria-valuetext={cur.label} onKeyDown={onKey}>
      <defs>
        <linearGradient id="lsl-stalk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#475569" /><stop offset="0.5" stopColor="#1f2937" /><stop offset="1" stopColor="#0f172a" /></linearGradient>
        <filter id="lsl-lg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      {/* পথ (আর্ক) ও মার্কার */}
      <path d={`M ${PX + 156 * Math.cos((-24 * Math.PI) / 180)} ${PY + 156 * Math.sin((-24 * Math.PI) / 180)} A 156 156 0 0 1 ${PX + 156 * Math.cos((24 * Math.PI) / 180)} ${PY + 156 * Math.sin((24 * Math.PI) / 180)}`} fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 5" />
      {LEVER.map((l) => {
        const rad = (l.angle * Math.PI) / 180;
        const x = PX + 156 * Math.cos(rad);
        const y = PY + 156 * Math.sin(rad);
        const on = (turn || 'N') === l.id;
        return (
          <g key={l.id} onClick={() => set(l.id)} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r="9" fill={on ? '#fbbf24' : '#f1f5f9'} stroke={on ? '#f59e0b' : '#94a3b8'} strokeWidth="2" />
            <text x={x + 16} y={y - 1} fontSize="11" fontWeight={on ? 700 : 600} fill={on ? '#0f172a' : '#475569'}>{l.act}</text>
            <text x={x + 16} y={y + 11} fontSize="9.5" fill={on ? '#334155' : '#64748b'}>{l.mark}</text>
          </g>
        );
      })}
      {/* স্টিয়ারিং কলাম */}
      <rect x="0" y="40" width="46" height="96" rx="14" fill="#1e293b" />
      <circle cx={PX} cy={PY} r="22" fill="#334155" stroke="#64748b" strokeWidth="2" />
      {/* স্টক — পিভটে ঘোরে */}
      <g
        style={{ transform: `rotate(${cur.angle}deg)`, transformOrigin: `${PX}px ${PY}px`, transition: 'transform .3s cubic-bezier(.22,1,.36,1)', cursor: 'grab' }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <g>
          <rect x={PX} y={PY - 11} width="140" height="22" rx="11" fill="url(#lsl-stalk)" stroke="#475569" />
          {/* রিংয়ের খাঁজ */}
          <g stroke="#334155" strokeWidth="2.5" strokeLinecap="round">
            <path d={`M${PX + 84} ${PY - 8}v16M${PX + 92} ${PY - 8}v16M${PX + 100} ${PY - 8}v16M${PX + 108} ${PY - 8}v16`} />
          </g>
          <rect x={PX + 118} y={PY - 9} width="22" height="18" rx="9" fill="#0f172a" />
          <circle cx={PX + 129} cy={PY} r="4" fill={high ? '#60a5fa' : '#475569'} />
          {high && <circle cx={PX + 129} cy={PY} r="14" fill="#60a5fa" opacity=".6" filter="url(#lsl-lg)" />}
          {/* স্টকের গায়ে ইন্ডিকেটর তীর */}
          <g transform={`translate(${PX + 36} ${PY - 6}) scale(.5)`} fill="none" stroke={lit ? '#fb923c' : '#94a3b8'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12l5-5v3h4v4H8v3zM21 12l-5-5v3h-1v4h1v3z" />
          </g>
        </g>
      </g>
    </svg>
  );
}

/* ---------------- স্টক সামনে ঠেলা / পেছনে টানা (উপর থেকে দেখা): হাই বিম ↔ লো বিম ---------------- */
function PushLever({ high, onSet, nudge }) {
  const ref = useRef(null);
  const drag = useRef(false);
  const PX = 40;
  const PY = 112;
  const R = 165; // মার্কারের দূরত্ব
  const ang = high ? 14 : nudge ? 7 : 0; // ধনাত্মক = মাথা সামনে (উপরে)

  const pick = (e) => {
    const r = ref.current.getBoundingClientRect();
    const y = ((e.clientY - r.top) / r.height) * 190 - PY;
    onSet(y < -22); // নিউট্রালের চেয়ে অনেকটা সামনে টানলে = হাই বিম
  };
  const down = (e) => {
    drag.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pick(e);
  };
  const move = (e) => drag.current && pick(e);
  const up = () => { drag.current = false; };
  const onKey = (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); onSet(true); }
    if (e.key === 'ArrowDown') { e.preventDefault(); onSet(false); }
  };
  const rad = (14 * Math.PI) / 180;
  const mx = PX + R * Math.cos(rad);
  const my = PY - R * Math.sin(rad);

  return (
    <svg ref={ref} viewBox="0 0 320 190" className="mx-auto block h-auto w-full max-w-[22rem] touch-none select-none" role="slider" tabIndex={0} aria-label="স্টক সামনে-পেছনে" aria-valuemin={0} aria-valuemax={1} aria-valuenow={high ? 1 : 0} aria-valuetext={high ? 'সামনে ঠেলা — হাই বিম' : 'পেছনে — লো বিম'} onKeyDown={onKey}>
      <defs>
        <linearGradient id="lsl-stalk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#475569" /><stop offset=".5" stopColor="#1f2937" /><stop offset="1" stopColor="#0f172a" /></linearGradient>
        <filter id="lsl-lg2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      {/* দিক নির্দেশ: উপরে = সামনে (উইন্ডশিল্ড), নিচে = পেছনে (চালক) */}
      <rect x="6" y="6" width="308" height="22" rx="8" fill="#bae6fd" stroke="#7dd3fc" />
      <path d="M40 6l-14 22M70 6l-14 22M100 6l-14 22" stroke="#e0f2fe" strokeWidth="3" opacity=".7" />
      <text x="160" y="21" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0369a1">▲ সামনে — উইন্ডশিল্ডের দিকে</text>
      <rect x="6" y="162" width="308" height="22" rx="8" fill="#e2e8f0" stroke="#cbd5e1" />
      <circle cx="26" cy="173" r="5" fill="#64748b" />
      <rect x="18" y="177" width="16" height="6" rx="3" fill="#64748b" />
      <text x="160" y="177" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">▼ পেছনে — চালকের (আপনার) দিকে</text>
      {/* সামনে-পেছনে চলার পথ */}
      <path d={`M ${PX + 150} ${PY} A 150 150 0 0 0 ${PX + 150 * Math.cos(rad)} ${PY - 150 * Math.sin(rad)}`} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 4" />
      {/* মার্কার (লিভারের ডানে লেখা) */}
      <g onClick={() => onSet(true)} style={{ cursor: 'pointer' }}>
        <circle cx={mx} cy={my} r="9" fill={high ? '#60a5fa' : '#f1f5f9'} stroke={high ? '#2563eb' : '#94a3b8'} strokeWidth="2" />
        <text x={mx + 14} y={my - 2} fontSize="11" fontWeight={high ? 700 : 500} fill={high ? '#1d4ed8' : '#64748b'}>হাই বিম</text>
        <text x={mx + 14} y={my + 11} fontSize="10" fill="#64748b">সামনে ঠেলুন</text>
      </g>
      <g onClick={() => onSet(false)} style={{ cursor: 'pointer' }}>
        <circle cx={PX + R} cy={PY} r="9" fill={!high ? '#fbbf24' : '#f1f5f9'} stroke={!high ? '#f59e0b' : '#94a3b8'} strokeWidth="2" />
        <text x={PX + R + 14} y={PY + 2} fontSize="11" fontWeight={!high ? 700 : 500} fill={!high ? '#0f172a' : '#64748b'}>লো বিম</text>
        <text x={PX + R + 14} y={PY + 15} fontSize="10" fill="#64748b">টেনে নিজের দিকে</text>
      </g>
      {/* স্টিয়ারিং কলাম (বাঁ পাশে) */}
      <rect x={PX - 40} y="44" width="48" height="136" rx="16" fill="#1e293b" />
      <circle cx={PX} cy={PY} r="22" fill="#334155" stroke="#64748b" strokeWidth="2" />
      {/* স্টক — পিভটে সামনে-পেছনে দোলে */}
      <g
        style={{ transform: `rotate(${-ang}deg)`, transformOrigin: `${PX}px ${PY}px`, transition: 'transform .3s cubic-bezier(.22,1,.36,1)', cursor: 'grab' }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <rect x={PX} y={PY - 11} width="140" height="22" rx="11" fill="url(#lsl-stalk2)" stroke="#475569" />
        <g stroke="#334155" strokeWidth="2.5" strokeLinecap="round">
          <path d={`M${PX + 90} ${PY - 8}v16M${PX + 98} ${PY - 8}v16M${PX + 106} ${PY - 8}v16M${PX + 114} ${PY - 8}v16`} />
        </g>
        <rect x={PX + 118} y={PY - 9} width="22" height="18" rx="9" fill="#0f172a" />
        <circle cx={PX + 129} cy={PY} r="4" fill={high ? '#60a5fa' : '#475569'} />
        {high && <circle cx={PX + 129} cy={PY} r="15" fill="#60a5fa" opacity=".65" filter="url(#lsl-lg2)" />}
      </g>
      {/* গতির তীর: সামনে ঠেললে ↑ সামনে, টেনে আনলে ↓ পেছনে */}
      <g fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" stroke={high ? '#2563eb' : '#f59e0b'}>
        {high ? <path d="M302 126v-46m0 0l-9 11m9-11l9 11" /> : <path d="M302 80v46m0 0l-9-11m9 11l9-11" />}
      </g>
      <text x="302" y={high ? 140 : 72} textAnchor="middle" fontSize="11" fontWeight="700" fill={high ? '#1d4ed8' : '#b45309'}>{high ? 'সামনে' : 'পেছনে'}</text>
    </svg>
  );
}

const ROWS = [
  { id: 'off', name: 'অফ', sym: <span className="text-sm font-bold">OFF</span>, does: 'সব লাইট বন্ধ।' },
  { id: 'park', name: 'পজিশন / পার্কিং লাইট', sym: <SunIcon />, does: 'সামনের-পেছনের ছোট বাতি, নম্বর প্লেট ও ড্যাশবোর্ডের লাইট জ্বলে।' },
  { id: 'low', name: 'হেডলাইট (লো বিম)', sym: <BeamIcon />, does: 'মূল হেডলাইট জ্বলে — স্বাভাবিক রাতের চালানোর জন্য।' },
  { id: 'turn', name: 'ইন্ডিকেটর', sym: <ArrowsIcon />, does: 'স্টক উপরে তুললে ডান (R), নিচে নামালে বাঁ (L)।' },
  { id: 'high', name: 'হাই বিম', sym: <BeamIcon down={false} color="#60a5fa" />, does: 'স্টক সামনে ঠেলুন। পেছনে টানলে লো বিমে ফেরে।' },
];

export default function LightSwitchLab({ compact = false }) {
  const [ring, setRingState] = useState('off');
  const [high, setHigh] = useState(false);
  const [turn, setTurn] = useState(null); // null | 'L' | 'R'
  const [blink, setBlink] = useState(true);
  const [hint, setHint] = useState('');
  const [nudge, setNudge] = useState(false);

  const setRing = (r) => {
    setRingState(r);
    if (r !== 'low') setHigh(false);
    setHint('');
  };
  const setHighTo = (v) => {
    if (v && ring !== 'low') {
      setHint('হাই বিম জ্বালাতে আগে রিং ঘুরিয়ে হেডলাইট (লো বিম) চালু করুন।');
      setNudge(true); // স্টক একটু এগিয়ে আবার ফিরে আসে — কাজ করল না
      setTimeout(() => setNudge(false), 350);
      return;
    }
    setHint('');
    setHigh(v);
  };
  const toggleHigh = () => setHighTo(!high);

  useEffect(() => {
    if (!turn) { setBlink(true); return undefined; }
    if (reduced()) { setBlink(true); return undefined; }
    const id = setInterval(() => setBlink((b) => !b), 480);
    return () => clearInterval(id);
  }, [turn]);

  const key = high ? 'high' : ring;
  const info = INFO[key];
  const btn = (on, extra = '') => `rounded-xl border px-3 py-2 text-sm font-bold transition ${on ? 'border-amber-500 bg-amber-400 text-slate-900 shadow' : 'border-slate-200 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50'} ${extra}`;

  const rowOn = (id) => (id === 'turn' ? !!turn : id === 'high' ? high : id === ring && !high);
  const clickRow = (id) => {
    if (id === 'turn') setTurn((t) => (t ? null : 'R'));
    else if (id === 'high') toggleHigh();
    else setRing(id);
  };

  return (
    <section aria-labelledby="lsl-title" className={compact ? 'px-4 pt-6 sm:px-8 lg:px-10' : 'px-6 pt-6 sm:px-14 lg:px-24 xl:px-32'}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-4 text-slate-800 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 id="lsl-title" className="text-base font-bold text-brsp-ink sm:text-base">🎛️ লাইট সুইচ — নিজে ঘুরিয়ে দেখুন</h3>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[13px] font-semibold text-amber-800">স্টক টাইপ সুইচ</span>
        </div>
        <p className="mt-1 text-[13px] text-slate-500 sm:text-sm">রিং ঘোরান বা টেনে সরান, স্টক উপরে-নিচে-সামনে সরান — কোন লাইট জ্বলে আর কোন চিহ্নের কাজ কী, সরাসরি দেখুন।</p>

        <div className="mt-3.5 grid gap-4 lg:grid-cols-2">
          {/* দৃশ্য */}
          <div className="min-w-0 space-y-2 rounded-xl bg-slate-900 p-1">
            <div className="w-full overflow-hidden rounded-xl border border-slate-700">
              <FrontView ring={ring} high={high} turn={turn} blink={blink} />
            </div>
            <div className="w-full overflow-hidden rounded-xl border border-slate-700">
              <TopView ring={ring} high={high} turn={turn} blink={blink} />
            </div>
            <Dash ring={ring} high={high} turn={turn} blink={blink} />
          </div>

          {/* নিয়ন্ত্রণ */}
          <div className="min-w-0">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-bold text-slate-800">১) স্টক (লিভার) — উপরে / নিচে (ইন্ডিকেটর)</p>
              <p className="mt-0.5 text-[13px] leading-snug text-slate-500">স্টকের মাথা ধরে উপরে বা নিচে টানুন, অথবা পাশের বিন্দুতে চাপ দিন। নিউট্রাল = ইন্ডিকেটর বন্ধ।</p>
              <div className="mx-auto w-full max-w-[24rem]"><Ctl3D view="lever" ring={ring} turn={turn} high={high} nudge={nudge} onRing={setRing} onTurn={setTurn} onHigh={setHighTo} fallback={<Lever turn={turn} setTurn={setTurn} high={high} blink={blink} />} /></div>
              <p className="mt-4 text-sm font-bold text-slate-800">২) লাইট কন্ট্রোল রিং (স্টকের মাথা)</p>
              <div className="mx-auto w-full max-w-[20rem]"><Ctl3D view="ring" ring={ring} turn={turn} high={high} nudge={nudge} onRing={setRing} onTurn={setTurn} onHigh={setHighTo} fallback={<Knob ring={ring} setRing={setRing} />} /></div>
              <div role="radiogroup" aria-label="রিংয়ের অবস্থান" className="mt-2.5 grid grid-cols-3 gap-2">
                {POSITIONS.map((p) => (
                  <button key={p.id} type="button" role="radio" aria-checked={ring === p.id} onClick={() => setRing(p.id)} className={btn(ring === p.id, 'leading-tight')}>
                    {p.id === 'off' ? 'অফ' : p.id === 'park' ? 'পজিশন' : 'হেডলাইট'}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-sm font-bold text-slate-800">৩) স্টক সামনে ঠেলুন / পেছনে টানুন (উপর থেকে দেখা)</p>
              <p className="mt-0.5 text-[13px] leading-snug text-slate-500">সামনে ঠেললে হাই বিম, নিজের দিকে টেনে আনলে লো বিমে ফেরে। (হাই বিমের জন্য আগে হেডলাইট চালু থাকতে হবে।)</p>
              <div className="mx-auto w-full max-w-[24rem]"><Ctl3D view="push" ring={ring} turn={turn} high={high} nudge={nudge} onRing={setRing} onTurn={setTurn} onHigh={setHighTo} fallback={<PushLever high={high} onSet={setHighTo} nudge={nudge} />} /></div>
              <button type="button" aria-pressed={high} onClick={toggleHigh} className={btn(high, 'mt-3 w-full leading-tight')}>
                {high ? '↙ টেনে নিজের দিকে আনুন — লো বিমে ফিরুন' : '↗ স্টক সামনে ঠেলুন — হাই বিম'}
              </button>
              {hint && <p role="status" className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-900">{hint}</p>}
            </div>

            {/* কী হচ্ছে */}
            <div className="mt-3.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4" aria-live="polite">
              <p className="text-xs font-bold text-emerald-700">এখন কী জ্বলছে</p>
              <h4 className="mt-0.5 text-base font-bold text-slate-800">{info.title}</h4>
              <p className="mt-1 text-sm leading-snug text-slate-700">{info.body}</p>
              {turn && (
                <p className="mt-2 rounded-lg bg-white px-3.5 py-2.5 text-sm text-slate-800">
                  ইন্ডিকেটর চালু: <b>{turn === 'R' ? 'ডান (R)' : 'বাঁ (L)'}</b> — মোড় নেওয়ার বা লেন বদলের আগে দিন, কাজ শেষে বন্ধ করুন।
                </p>
              )}
              <p className="mt-3 text-[13px] font-bold text-emerald-700">কখন ব্যবহার করবেন</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm leading-snug text-slate-800">
                {info.use.map((u) => <li key={u}>{u}</li>)}
              </ul>
              <p className="mt-3 text-[13px] font-bold text-rose-700">যা এড়াবেন</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm leading-snug text-rose-900">
                {info.avoid.map((u) => <li key={u}>{u}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* চিহ্ন ও কাজ */}
        <div className="mt-5">
          <h4 className="text-base font-bold text-slate-800">চিহ্ন ও তাদের কাজ <span className="text-xs font-semibold text-slate-500">(সারিতে চাপ দিয়ে চালু করুন)</span></h4>
          <div className="mt-2 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
            {ROWS.map((r) => {
              const on = rowOn(r.id);
              return (
                <button key={r.id} type="button" onClick={() => clickRow(r.id)} aria-pressed={on} className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition ${on ? 'bg-amber-50' : 'bg-white hover:bg-slate-50'}`}>
                  <span className={`grid h-10 w-12 shrink-0 place-items-center rounded-lg ${on ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-700'}`}>{r.sym}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-slate-800">{r.name}</span>
                    <span className="block text-[13px] leading-snug text-slate-600">{r.does}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* টিপস */}
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h4 className="text-base font-bold text-amber-800">💡 দ্রুত টিপস</h4>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-snug text-slate-800">
            {TIPS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
        <p className="mt-3 text-[13px] text-slate-500">সাধারণ নির্দেশনা — গাড়ির মডেলভেদে সুইচের ডিজাইন কিছুটা আলাদা হতে পারে। নিজের গাড়ির ম্যানুয়াল ও প্রশিক্ষকের কথা অনুসরণ করুন।</p>
      </div>
    </section>
  );
}
