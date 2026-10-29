import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import NoticeBanner from './components/NoticeBanner.jsx';
import Navbar from './components/Navbar.jsx';
import HomePage from './components/HomePage.jsx';
import PageBanner from './components/PageBanner.jsx';
import SearchBar from './components/SearchBar.jsx';
import RosterGrid from './components/RosterGrid.jsx';
import StudentList from './components/StudentList.jsx';
import DonationList from './components/DonationList.jsx';
import TrainSchedule from './components/TrainSchedule.jsx';
import InstructorCard from './components/InstructorCard.jsx';
import Footer from './components/Footer.jsx';
import { ROSTER, STUDENTS, BATCH, EFFECTIVE_FROM } from './data/roster.js';
import { matchesQuery, studentMatches } from './utils/search.js';

export default function App() {
  const [query, setQuery] = useState('');
  // PWA শর্টকাট: ?tab=roster / ?tab=students / ?tab=donation / ?tab=train দিয়ে সরাসরি ট্যাব খোলা যায়
  const [tab, setTab] = useState(() => {
    const t = new URLSearchParams(window.location.search).get('tab');
    return ['roster', 'students', 'donation', 'train'].includes(t) ? t : 'home';
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
    setTab(t);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-slate-800">
      <Navbar tab={tab} onChange={selectTab} />
      <Header />
      <main id="main-content" key={tab} className="anim-page flex-1">
        {tab === 'home' ? (
          <HomePage onNavigate={selectTab} />
        ) : tab === 'roster' ? (
          <>
            <PageBanner title="গাড়ি ধোয়ার রোস্টার" subtitle={BATCH} chips={[`কার্যকর শুরু: ${EFFECTIVE_FROM}`, 'সকাল ৭:০০ টার মধ্যে উপস্থিত']} />
            <NoticeBanner />
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
        ) : tab === 'donation' ? (
          <>
            <SearchBar value={query} onChange={setQuery} />
            <DonationList query={query} />
          </>
        ) : (
          <TrainSchedule />
        )}
      </main>
      <Footer />
    </div>
  );
}
