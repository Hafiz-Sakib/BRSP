import batchPhoto from '../assets/batch-photo.jpg';
import InstallButton from './InstallButton.jsx';
import { BATCH, PROJECT_NAME, COURSE_NAME, CENTER_NAME, FORMS } from '../data/roster.js';
import {
  COURSE_INTRO,
  GLANCE,
  ELIGIBILITY,
  FORM_FIELDS,
  STEPS,
  PLEDGE,
  MEDICAL_NOTE,
  ADDRESS,
} from '../data/course.js';

const bnNum = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

function Section({ id, title, lead, children, flush }) {
  return (
    <section id={id} className={`scroll-mt-20 py-8 sm:py-10 ${flush ? '' : 'px-4 sm:px-8'}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h2>
        {lead && <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">{lead}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

function Tick() {
  return (
    <svg className="w-5 h-5 shrink-0 mt-0.5 text-brsp-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
      <path d="M8 12.5l2.7 2.7L16 9.5" />
    </svg>
  );
}

const btn = 'text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition';

export default function HomePage({ onNavigate }) {
  const admission = FORMS[0];
  return (
    <div className="anim-page">
      {/* হিরো */}
      <div className="relative overflow-hidden bg-brsp-ink text-white px-4 sm:px-8">
        <div className="relative z-10 max-w-6xl mx-auto py-9 sm:py-12 lg:py-14 pb-14 sm:pb-16 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-center">
          <div>
            <p className="text-emerald-200 text-sm sm:text-base font-semibold">{PROJECT_NAME}</p>
            <h1 className="mt-2 text-3xl min-[400px]:text-4xl sm:text-5xl font-bold leading-snug tracking-tight">{COURSE_NAME.replace(' কোর্স', '')}</h1>
            <p className="mt-3 text-white/90 text-base sm:text-lg font-medium">পেশাদার চালকদের জন্য ০৪ (চার) মাস মেয়াদী প্রশিক্ষণ কোর্স</p>
            <p className="text-white/70 text-sm sm:text-base">{CENTER_NAME}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a href={admission.url} download={admission.filename} className={`${btn} bg-white text-brsp-ink hover:bg-emerald-50`}>
                ভর্তি ফরম ডাউনলোড
              </a>
              <a href="#eligibility" className={`${btn} border border-white/40 text-white hover:bg-white/10`}>ভর্তির যোগ্যতা</a>
              <InstallButton />
            </div>
          </div>

          <aside className="rounded-2xl bg-white text-slate-800 p-5 shadow-xl shadow-black/20" aria-label="কোর্স এক নজরে">
            <h2 className="font-bold text-lg">কোর্স এক নজরে</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              {GLANCE.map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-2">
                  <dt className="shrink-0 text-slate-500">{k}</dt>
                  <span className="flex-1 min-w-3 border-b border-dotted border-slate-300" aria-hidden="true" />
                  <dd className="font-bold text-right">{v}</dd>
                </div>
              ))}
              <div className="flex items-baseline gap-2">
                <dt className="shrink-0 text-slate-500">আমাদের ব্যাচ</dt>
                <span className="flex-1 min-w-3 border-b border-dotted border-slate-300" aria-hidden="true" />
                <dd className="font-bold text-right">{BATCH}</dd>
              </div>
            </dl>
          </aside>
        </div>
        <div className="road-dash absolute inset-x-0 bottom-4 h-[3px]" aria-hidden="true" />
      </div>

      <Section id="intro" title="কোর্স পরিচিতি" lead={COURSE_INTRO} />

      <div className="px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid gap-x-10 lg:grid-cols-2">
          <Section id="eligibility" title="ভর্তির যোগ্যতা" flush>
            <ul className="space-y-3">
              {ELIGIBILITY.map((t) => (
                <li key={t} className="flex gap-3 text-slate-700 leading-relaxed"><Tick />{t}</li>
              ))}
            </ul>
          </Section>
          <Section id="fields" flush title="আবেদন ফরমে যে তথ্য লাগবে" lead="ফরমের ‘ক’ অংশে নিচের তথ্যগুলো সঠিকভাবে পূরণ করতে হবে।">
            <ul className="flex flex-wrap gap-2">
              {FORM_FIELDS.map((t) => (
                <li key={t} className="rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-700">{t}</li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <Section id="steps" title="ভর্তির ধাপ">
        <ol className="max-w-3xl">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="relative pl-12 pb-6 last:pb-0">
              {i < STEPS.length - 1 && <span className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-300" aria-hidden="true" />}
              <span className="absolute left-0 top-0 grid place-items-center w-8 h-8 rounded-full bg-brsp-green text-white text-sm font-bold">{bnNum(i + 1)}</span>
              <h3 className="font-bold text-slate-800">{t}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="forms" title="ফরম ডাউনলোড" lead="দেখে নিন অথবা সরাসরি ডাউনলোড করে প্রিন্ট করুন।">
        <div className="grid gap-4 md:grid-cols-2">
          {FORMS.map((f) => (
            <div key={f.url} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col">
              <h3 className="font-bold text-lg text-slate-800">{f.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{f.desc}</p>
              {f.note === 'medical' && <p className="mt-3 text-sm text-slate-700 leading-relaxed">{MEDICAL_NOTE}</p>}
              <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
                <a href={f.url} target="_blank" rel="noopener noreferrer" className={`${btn} border border-slate-300 text-slate-700 hover:bg-slate-50`}>দেখুন</a>
                <a href={f.url} download={f.filename} className={`${btn} bg-brsp-green text-white hover:bg-emerald-800`}>ডাউনলোড</a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="pledge" title="অঙ্গীকারনামার মূল শর্ত" lead="ভর্তি ফরমের অঙ্গীকারনামায় আবেদনকারী ও অভিভাবক স্বাক্ষর করেন। এতে যা মেনে চলার কথা বলা আছে:">
        <ul className="max-w-3xl border-l-4 border-brsp-red bg-white rounded-r-xl p-4 sm:p-5 space-y-2 text-slate-700 leading-relaxed list-disc list-inside">
          {PLEDGE.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </Section>

      <div className="px-4 sm:px-8 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto rounded-2xl bg-brsp-ink text-white overflow-hidden">
          <figure className="relative">
            <img
              src={batchPhoto}
              width={1600}
              height={1200}
              alt={`${BATCH} — ব্যাচের গ্রুপ ছবি`}
              loading="lazy"
              decoding="async"
              className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] object-cover object-[50%_72%]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 sm:px-8 pt-12 pb-4 text-sm sm:text-base font-semibold">
              {BATCH}
            </figcaption>
          </figure>
          <div className="p-5 sm:p-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">আমাদের ব্যাচ: {BATCH}</h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button type="button" onClick={() => onNavigate('roster')} className={`${btn} bg-white text-brsp-ink hover:bg-emerald-50`}>রোস্টার দেখুন</button>
              <button type="button" onClick={() => onNavigate('students')} className={`${btn} border border-white/40 hover:bg-white/10`}>শিক্ষার্থী তালিকা</button>
            </div>
          </div>
        </div>
      </div>

      <Section id="contact" title="যোগাযোগ ও ঠিকানা">
        <address className="not-italic text-slate-700 leading-relaxed">
          <p className="font-bold text-slate-800">{ADDRESS.org}</p>
          <p>{ADDRESS.line}</p>
          <p>
            ওয়েবসাইট:{' '}
            <a href={ADDRESS.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brsp-green hover:underline">{ADDRESS.web}</a>
          </p>
          <p className="mt-2 text-sm text-slate-500">প্রশিক্ষণ কেন্দ্র: {CENTER_NAME}</p>
        </address>
      </Section>
    </div>
  );
}
