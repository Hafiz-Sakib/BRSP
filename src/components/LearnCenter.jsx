import QuizPage from './QuizPage.jsx';
import QnABlog from './QnABlog.jsx';
import LearnHub from './LearnHub.jsx';
import PageBanner from './PageBanner.jsx';

// "শিক্ষা কেন্দ্র" — কুইজ, প্রশ্নোত্তর, স্টাডি ম্যাটেরিয়ালস ও ট্রাফিক চিহ্ন এক নেভবার আইটেমের ভেতরে
export const LEARN_TABS = [
  { id: 'quiz', label: 'কুইজ', icon: '📝' },
  { id: 'blog', label: 'প্রশ্নোত্তর', icon: '💬' },
  { id: 'study', label: 'স্টাডি ম্যাটেরিয়ালস', icon: '📚' },
  { id: 'signs', label: 'ট্রাফিক চিহ্ন', icon: '🚦' },
];

export default function LearnCenter({ sub, onSub, onNavigate }) {
  return (
    <>
      <PageBanner title="শিক্ষা কেন্দ্র" subtitle="কুইজ · প্রশ্নোত্তর · স্টাডি ম্যাটেরিয়ালস · ট্রাফিক চিহ্ন" />
      <div className="px-4 pt-4 sm:px-8 lg:px-10">
        <div role="tablist" aria-label="শিক্ষা কেন্দ্র" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {LEARN_TABS.map((t) => {
            const on = t.id === sub;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => onSub(t.id)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition ${
                  on ? 'border-brsp-green bg-brsp-green text-white shadow' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="mr-1.5" aria-hidden="true">{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      {sub === 'quiz' ? <QuizPage onNavigate={onNavigate} /> : sub === 'blog' ? <QnABlog /> : <LearnHub key={sub} initial={sub} />}
    </>
  );
}
