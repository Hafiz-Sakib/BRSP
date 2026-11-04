import { useMemo, useState } from 'react';
import NoticeBanner from './components/NoticeBanner.jsx';
import WeeklyPlan from './components/WeeklyPlan.jsx';
import Navbar from './components/Navbar.jsx';
import HomePage from './components/HomePage.jsx';
import PageBanner from './components/PageBanner.jsx';
import SearchBar from './components/SearchBar.jsx';
import RosterGrid from './components/RosterGrid.jsx';
import StudentList from './components/StudentList.jsx';
import TrainSchedule from './components/TrainSchedule.jsx';
import LearnHub from './components/LearnHub.jsx';
import QuizPage from './components/QuizPage.jsx';
import QnABlog from './components/QnABlog.jsx';
import InstructorCard from './components/InstructorCard.jsx';
import Footer from './components/Footer.jsx';
import { ROSTER, STUDENTS, BATCH, EFFECTIVE_FROM } from './data/roster.js';
import { matchesQuery, studentMatches } from './utils/search.js';

export default function App() {
  const [query, setQuery] = useState('');
  // PWA শর্টকাট: ?tab=roster / students / train / learn / quiz / blog দিয়ে সরাসরি ট্যাব খোলা যায়
  // ট্রাফিক চিহ্ন ও স্টাডি ম্যাটেরিয়ালস এখন একটি 'learn' ট্যাব (?tab=signs ও ?tab=study আগের মতোই কাজ করে)
  const initialTab = () => new URLSearchParams(window.location.search).get('tab');
  const [tab, setTab] = useState(() => {
    const t = initialTab();
    if (['signs', 'tips', 'study', 'learn'].includes(t)) return 'learn';
    return ['roster', 'students', 'train', 'quiz', 'blog'].includes(t) ? t : 'home';
  });
  const [learnSub, setLearnSub] = useState(() => {
    const t = initialTab();
    return ['signs', 'tips', 'study'].includes(t) ? t : 'signs';
  });

  // বাংলা বা ইংরেজি — যেকোনো অঙ্কে আইডি/তারিখ, নাম দিয়ে সার্চ
  const filteredRows = useMemo(
    () => ROSTER.filter((row) => matchesQuery(row, query)),
    [query]
  );
  const filteredStudents = useMemo(
    () => STUDENTS.filter((s) => studentMatches(s, query)),
    [query]
  );

  // ট্যাব বদলালে পেজের শুরুতে নিয়ে যাওয়া
  const selectTab = (t) => {
    if (['signs', 'tips', 'study'].includes(t)) {
      setLearnSub(t);
      setTab('learn');
    } else {
      setTab(t);
    }
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-slate-800">
      <Navbar tab={tab} onChange={selectTab} />
      <main id="main-content" key={tab} className="anim-page flex-1">
        {tab === 'home' ? (
          <HomePage onNavigate={selectTab} />
        ) : tab === 'roster' ? (
          <>
            <PageBanner title="গাড়ি ধোয়ার রোস্টার" subtitle={BATCH} chips={[`কার্যকর শুরু: ${EFFECTIVE_FROM}`, 'সকাল ৭:০০ টার মধ্যে উপস্থিত']} />
            <NoticeBanner />
            <WeeklyPlan />
            <SearchBar value={query} onChange={setQuery} />
            <RosterGrid rows={filteredRows} query={query} />
            <InstructorCard />
          </>
        ) : tab === 'students' ? (
          <>
            <PageBanner title="শিক্ষার্থী তালিকা" subtitle={BATCH} />
            <SearchBar value={query} onChange={setQuery} />
            <StudentList rows={filteredStudents} />
          </>
        ) : tab === 'quiz' ? (
          <QuizPage onNavigate={selectTab} />
        ) : tab === 'blog' ? (
          <QnABlog />
        ) : tab === 'learn' ? (
          <LearnHub initial={learnSub} />
        ) : (
          <TrainSchedule />
        )}
      </main>
      <Footer showBatch={tab === 'roster'} />
    </div>
  );
}
