import InstallButton from './InstallButton.jsx';

export default function NoticeBanner({ onPrint }) {
  return (
    <div className="anim-banner bg-amber-50 border-b border-amber-200 px-4 py-4 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-900">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-sm sm:text-base">সাপ্তাহিক ছুটির দিনসমূহ:</h3>
          <p className="text-xs sm:text-sm text-amber-800 font-medium">
            শুক্রবার, শনিবার ও মঙ্গলবার গাড়ি ধোয়া বন্ধ থাকবে (ছুটি)। এছাড়া দুর্গাপূজা উপলক্ষে ১৯–২২ অক্টোবর ছুটি।
          </p>
        </div>
      </div>
      <div className="w-full sm:w-auto no-print flex flex-col sm:flex-row gap-2">
        <InstallButton />
        <button
          type="button"
          onClick={onPrint}
          className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition duration-200 flex items-center justify-center space-x-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          <span>প্রিন্ট বা ডাউনলোড করুন</span>
        </button>
      </div>
    </div>
  );
}
