import { waLink } from '../utils/whatsapp.js';

const Icon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.1.89.9-3.02-.2-.31A8.2 8.2 0 1 1 12.04 20.1Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.12-.56.12-.17.25-.64.8-.78.96-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.75.59.25 1.06.4 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.1-.23-.17-.48-.29Z" />
  </svg>
);

// এক ক্লিকে হোয়াটসঅ্যাপে ডিফল্ট বার্তা পাঠানো
export default function WhatsAppButton({ number, message, label, className = '' }) {
  return (
    <a
      href={waLink(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
      aria-label={label ? `${label} — হোয়াটসঅ্যাপে মেসেজ পাঠান` : 'হোয়াটসঅ্যাপে মেসেজ পাঠান'}
      className={`no-print inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366] hover:bg-[#1fb857] active:scale-95 text-white font-semibold transition ${className}`}
    >
      <Icon />
      {label && <span>{label}</span>}
    </a>
  );
}
