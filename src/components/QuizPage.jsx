import { useEffect, useMemo, useRef, useState } from 'react';
import PageBanner from './PageBanner.jsx';
import { QUIZ_BANK } from '../data/quiz.js';

const PER_QUIZ = 10; // প্রতিবার কয়টি প্রশ্ন
const LAST_KEY = 'brsp-quiz-last-ids'; // আগের বারের প্রশ্ন (এবার বাদ দেওয়ার জন্য)
const BEST_KEY = 'brsp-quiz-best';
const LETTERS = ['ক', 'খ', 'গ', 'ঘ'];
// "উপরের সবগুলো সঠিক" ধরনের অপশন থাকলে অপশনের ক্রম বদলানো হয় না
const ALL_ABOVE = /উপরের|ওপরের|সবগুলো|সবগুলি|সব গুলো|সব কয়টি|সবকয়টি|সবগুলোর/;

const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

// localStorage বন্ধ থাকলেও (প্রাইভেট মোড) যেন কুইজ চলে
let memory = {};
const store = {
  get(k, fallback) {
    try {
      const v = window.localStorage.getItem(k);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return k in memory ? memory[k] : fallback;
    }
  },
  set(k, v) {
    memory[k] = v;
    try {
      window.localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// র‍্যান্ডম ১০টি প্রশ্ন — আগের বারের প্রশ্নগুলো বাদ দিয়ে (প্রশ্ন কম পড়লে তবেই আগেরগুলো থেকে নেওয়া হয়)
function buildQuiz() {
  const last = new Set(store.get(LAST_KEY, []));
  const fresh = shuffle(QUIZ_BANK.filter((q) => !last.has(q.id)));
  let picked = fresh.slice(0, PER_QUIZ);
  if (picked.length < PER_QUIZ) {
    const rest = shuffle(QUIZ_BANK.filter((q) => last.has(q.id)));
    picked = [...picked, ...rest.slice(0, PER_QUIZ - picked.length)];
  }
  store.set(LAST_KEY, picked.map((q) => q.id));
  return picked.map((q) => {
    const order = q.o.map((_, i) => i);
    const keepOrder = q.o.some((t) => ALL_ABOVE.test(t));
    const idx = keepOrder ? order : shuffle(order);
    return {
      id: q.id,
      q: q.q,
      options: idx.map((i) => q.o[i]),
      answer: idx.indexOf(q.a),
    };
  });
}

function Check() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
function Cross() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

const btn = 'rounded-lg px-5 py-2.5 text-sm sm:text-base font-semibold transition';

function Intro({ onStart, best }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800">নিজের প্রস্তুতি যাচাই করুন</h2>
      <ul className="mt-4 space-y-2.5 text-slate-700 leading-relaxed">
        {[
          `প্রতিবার ${bn(PER_QUIZ)}টি প্রশ্নের উত্তর দিতে হবে।`,
          `মোট ${bn(QUIZ_BANK.length)}টি প্রশ্নের ভান্ডার থেকে প্রতিবার র‍্যান্ডম প্রশ্ন আসে — আগের বারের প্রশ্নগুলো যথাসম্ভব বাদ যায়।`,
          'প্রতিটি প্রশ্নে ১ নম্বর। উত্তর বেছে ‘পরবর্তী’ চাপুন।',
          'শেষে আপনার প্রাপ্ত নম্বর এবং প্রতিটি প্রশ্নের সঠিক উত্তর দেখানো হবে।',
        ].map((t) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-brsp-green" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>
      {best != null && (
        <p className="mt-5 inline-block rounded-full bg-emerald-50 text-brsp-green px-4 py-1 text-sm font-bold">
          আপনার সেরা ফলাফল: {bn(best)}/{bn(PER_QUIZ)}
        </p>
      )}
      <div className="mt-6">
        <button type="button" onClick={onStart} className={`${btn} bg-brsp-green text-white hover:bg-emerald-800`}>
          কুইজ শুরু করুন
        </button>
      </div>
    </div>
  );
}

function Question({ item, index, total, selected, onSelect, onNext, onPrev }) {
  const headRef = useRef(null);
  useEffect(() => {
    headRef.current?.focus({ preventScroll: true });
  }, [index]);
  const last = index === total - 1;
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-8">
      <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-500">
        <span>
          প্রশ্ন {bn(index + 1)} / {bn(total)}
        </span>
        <span>উত্তর দেওয়া হয়েছে: {bn(selected.filter((s) => s != null).length)}</span>
      </div>
      <div
        className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        aria-label="কুইজের অগ্রগতি"
      >
        <div className="h-full bg-brsp-green transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <h2 ref={headRef} tabIndex={-1} className="mt-6 text-lg sm:text-xl font-bold text-slate-800 leading-snug outline-none">
        {item.q}
        {!/[?।]$/.test(item.q) ? '?' : ''}
      </h2>

      <div role="radiogroup" aria-label="উত্তরের অপশন" className="mt-5 grid gap-3">
        {item.options.map((opt, i) => {
          const on = selected[index] === i;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onSelect(i)}
              className={`flex items-start gap-3 text-left rounded-xl border px-4 py-3 transition ${
                on ? 'border-brsp-green bg-emerald-50 ring-1 ring-brsp-green' : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <span
                className={`grid place-items-center w-8 h-8 shrink-0 rounded-full text-sm font-bold ${
                  on ? 'bg-brsp-green text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {LETTERS[i]}
              </span>
              <span className="pt-0.5 text-slate-800 leading-relaxed">{opt}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          className={`${btn} border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent`}
        >
          ← আগের
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selected[index] == null}
          className={`${btn} bg-brsp-green text-white hover:bg-emerald-800 disabled:opacity-40 disabled:hover:bg-brsp-green`}
        >
          {last ? 'ফলাফল দেখুন' : 'পরবর্তী →'}
        </button>
      </div>
    </div>
  );
}

function Result({ quiz, selected, onAgain, onNavigate }) {
  const score = quiz.reduce((s, q, i) => s + (selected[i] === q.answer ? 1 : 0), 0);
  const pct = Math.round((score / quiz.length) * 100);
  const verdict =
    pct >= 90 ? 'অসাধারণ! আপনি পরীক্ষার জন্য প্রায় প্রস্তুত।' : pct >= 70 ? 'ভালো হয়েছে! আরেকটু অনুশীলন করুন।' : pct >= 50 ? 'চলনসই। প্রশ্নোত্তর ব্লগ পড়ে আবার চেষ্টা করুন।' : 'আরও পড়াশোনা দরকার। প্রশ্নোত্তর ব্লগ পড়ে আবার চেষ্টা করুন।';
  const tone = pct >= 70 ? 'text-brsp-green' : pct >= 50 ? 'text-amber-600' : 'text-brsp-red';

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
        <p className="text-sm font-semibold text-slate-500">আপনার প্রাপ্ত নম্বর</p>
        <p className={`mt-1 text-5xl sm:text-6xl font-bold ${tone}`}>
          {bn(score)}
          <span className="text-2xl sm:text-3xl text-slate-400"> / {bn(quiz.length)}</span>
        </p>
        <p className="mt-1 text-slate-600 font-semibold">{bn(pct)}%</p>
        <p className="mt-3 text-slate-700">{verdict}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={onAgain} className={`${btn} bg-brsp-green text-white hover:bg-emerald-800`}>
            নতুন কুইজ দিন
          </button>
          <button type="button" onClick={() => onNavigate('blog')} className={`${btn} border border-slate-300 text-slate-700 hover:bg-slate-50`}>
            প্রশ্নোত্তর পড়ুন
          </button>
        </div>
      </div>

      <section aria-label="সঠিক উত্তরসহ পর্যালোচনা">
        <h2 className="text-xl font-bold text-slate-800">সঠিক উত্তরসহ পর্যালোচনা</h2>
        <ol className="mt-4 space-y-4">
          {quiz.map((q, i) => {
            const ok = selected[i] === q.answer;
            return (
              <li key={q.id} className={`rounded-2xl border bg-white p-4 sm:p-5 ${ok ? 'border-emerald-300' : 'border-red-300'}`}>
                <div className="flex items-start gap-3">
                  <span className={`grid place-items-center w-8 h-8 shrink-0 rounded-full text-white text-sm font-bold ${ok ? 'bg-brsp-green' : 'bg-brsp-red'}`}>
                    {bn(i + 1)}
                  </span>
                  <h3 className="font-bold text-slate-800 leading-snug pt-0.5">
                    {q.q}
                    {!/[?।]$/.test(q.q) ? '?' : ''}
                  </h3>
                </div>
                <ul className="mt-3 space-y-2 pl-0 sm:pl-11">
                  {q.options.map((opt, oi) => {
                    const isRight = oi === q.answer;
                    const isMine = oi === selected[i];
                    let cls = 'border-slate-200 text-slate-700 bg-white';
                    if (isRight) cls = 'border-brsp-green bg-emerald-50 text-emerald-900 font-semibold';
                    else if (isMine) cls = 'border-brsp-red bg-red-50 text-red-900';
                    return (
                      <li key={opt} className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm sm:text-base ${cls}`}>
                        <span className="font-bold shrink-0">{LETTERS[oi]})</span>
                        <span className="flex-1 leading-relaxed">{opt}</span>
                        {isRight && (
                          <span className="flex items-center gap-1 shrink-0 text-brsp-green text-xs font-bold">
                            <Check /> সঠিক উত্তর
                          </span>
                        )}
                        {!isRight && isMine && (
                          <span className="flex items-center gap-1 shrink-0 text-brsp-red text-xs font-bold">
                            <Cross /> আপনার উত্তর
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {selected[i] == null && <p className="mt-2 text-sm text-slate-500 sm:pl-11">উত্তর দেওয়া হয়নি।</p>}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

export default function QuizPage({ onNavigate }) {
  const [phase, setPhase] = useState('intro'); // intro | quiz | result
  const [quiz, setQuiz] = useState([]);
  const [selected, setSelected] = useState([]);
  const [index, setIndex] = useState(0);
  const [best, setBest] = useState(() => store.get(BEST_KEY, null));

  const start = () => {
    const q = buildQuiz();
    setQuiz(q);
    setSelected(Array(q.length).fill(null));
    setIndex(0);
    setPhase('quiz');
    window.scrollTo({ top: 0 });
  };

  const finish = () => {
    const score = quiz.reduce((s, q, i) => s + (selected[i] === q.answer ? 1 : 0), 0);
    if (best == null || score > best) {
      store.set(BEST_KEY, score);
      setBest(score);
    }
    setPhase('result');
    window.scrollTo({ top: 0 });
  };

  const next = () => (index === quiz.length - 1 ? finish() : setIndex((i) => i + 1));
  const select = (i) => setSelected((s) => s.map((v, k) => (k === index ? i : v)));

  const chips = useMemo(() => [`${bn(QUIZ_BANK.length)}টি প্রশ্নের ভান্ডার`, `প্রতিবার ${bn(PER_QUIZ)}টি র‍্যান্ডম প্রশ্ন`], []);

  return (
    <>
      <PageBanner title="ড্রাইভিং লাইসেন্স কুইজ" subtitle="লিখিত ও মৌখিক পরীক্ষার প্রস্তুতি" chips={chips} />
      <div className="px-4 sm:px-8 py-8 sm:py-10">
        <div className="max-w-3xl mx-auto">
          {phase === 'intro' && <Intro onStart={start} best={best} />}
          {phase === 'quiz' && (
            <Question
              item={quiz[index]}
              index={index}
              total={quiz.length}
              selected={selected}
              onSelect={select}
              onNext={next}
              onPrev={() => setIndex((i) => Math.max(0, i - 1))}
            />
          )}
          {phase === 'result' && <Result quiz={quiz} selected={selected} onAgain={start} onNavigate={onNavigate} />}
        </div>
      </div>
    </>
  );
}
