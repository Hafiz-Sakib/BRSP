export default function SearchBar({ value, onChange }) {
  return (
    <div className="p-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200 no-print">
      <div className="relative max-w-md mx-auto">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="নাম বা আইডি দিয়ে খুঁজুন (যেমন: ওসমান, ৮৮)..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm transition"
        />
      </div>
    </div>
  );
}
