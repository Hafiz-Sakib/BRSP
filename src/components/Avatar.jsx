import { avatarFor } from '../data/avatars.js';

const SIZES = {
  sm: 'w-9 h-9',
  md: 'w-11 h-11',
  lg: 'w-16 h-16',
};

// গোল প্রোফাইল ছবি; ছবি না থাকলে নিরপেক্ষ আইকন দেখায়
export default function Avatar({ reg, name, size = 'md', ring = 'ring-white', className = '' }) {
  const src = avatarFor(reg);
  const box = `${SIZES[size]} shrink-0 rounded-full overflow-hidden ring-2 ${ring} shadow-sm bg-slate-100 ${className}`;
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width="320"
        height="320"
        loading="lazy"
        decoding="async"
        draggable="false"
        className={`${box} object-cover select-none`}
      />
    );
  }
  return (
    <span className={`${box} grid place-items-center text-slate-400`} role="img" aria-label={`${name} (ছবি নেই)`}>
      <svg className="w-3/5 h-3/5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
      </svg>
    </span>
  );
}
