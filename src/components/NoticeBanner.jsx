import InstallButton from './InstallButton.jsx';

export default function NoticeBanner() {
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
            শুক্রবার, শনিবার ও মঙ্গলবার এবং সরকারি ছুটির দিনে গাড়ি ধোয়া বন্ধ থাকবে (ছুটি)।
          </p>
        </div>
      </div>
      <div className="w-full sm:w-auto no-print flex flex-col sm:flex-row gap-2">
        <InstallButton />
      </div>
    </div>
  );
}
