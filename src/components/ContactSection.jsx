// হোম পেজের একদম শেষে (ফুটারের ঠিক আগে) — যোগাযোগ ও ঠিকানা; কোনো কার্ড নেই, সাদামাটা লেখা
export default function ContactSection() {
  return (
    <section aria-labelledby="contact-title" className="mx-auto w-full max-w-6xl px-4 pb-10 pt-10 sm:px-8">
      <h2 id="contact-title" className="text-2xl font-bold text-brsp-ink">যোগাযোগ ও ঠিকানা</h2>
      <p className="mt-4 text-base font-bold text-slate-900">বাংলাদেশ সড়ক পরিবহণ কর্পোরেশন (বিআরটিসি)</p>
      <p className="mt-1 text-sm text-slate-700">বিআরটিসি ভবন, ২১ রাজউক এভিনিউ, ঢাকা-১০০০</p>
      <p className="mt-1 text-sm text-slate-700">
        ওয়েবসাইট:{' '}
        <a href="https://www.brtc.gov.bd" target="_blank" rel="noopener noreferrer" className="font-bold text-brsp-green hover:underline">www.brtc.gov.bd</a>
      </p>
      <p className="mt-1 text-sm text-slate-500">প্রশিক্ষণ কেন্দ্র: বিআরটিসি চট্টগ্রাম বাস ডিপো ও প্রশিক্ষণ কেন্দ্র, নতুনপাড়া, হাটহাজারী-৪৩৩০</p>
    </section>
  );
}
