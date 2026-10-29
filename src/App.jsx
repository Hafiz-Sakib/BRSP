import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import NoticeBanner from './components/NoticeBanner.jsx';
import Navbar from './components/Navbar.jsx';
import SearchBar from './components/SearchBar.jsx';
import RosterGrid from './components/RosterGrid.jsx';
import StudentList from './components/StudentList.jsx';
import DonationList from './components/DonationList.jsx';
import TrainSchedule from './components/TrainSchedule.jsx';
import InstructorCard from './components/InstructorCard.jsx';
import Footer from './components/Footer.jsx';
import { ROSTER, STUDENTS } from './data/roster.js';
import { matchesQuery, studentMatches } from './utils/search.js';

export default function App() {
  const [query, setQuery] = useState('');
  // PWA শর্টকাট: ?tab=students / ?tab=donation / ?tab=train দিয়ে সরাসরি ট্যাব খোলা যায়
  const [tab, setTab] = useState(() => {
    const t = new URLSearchParams(window.location.search).get('tab');
    return t === 'students' || t === 'donation' || t === 'train' ? t : 'roster';
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

  // নেভবার থেকে ট্যাব বদলালে, স্টিকি বারের নিচে কনটেন্টের শুরুতে নিয়ে যাওয়া
  const selectTab = (t) => {
    setTab(t);
    const el = document.getElementById('main-content');
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-slate-800">
      <Header />
      <NoticeBanner />
      <div className="no-print sticky top-0 z-30">
        <Navbar tab={tab} onChange={selectTab} />
        {tab !== 'train' && <SearchBar value={query} onChange={setQuery} />}
      </div>
      <main id="main-content" key={tab} className="anim-page flex-1 scroll-mt-32">
        {tab === 'roster' ? (
          <>
            <RosterGrid rows={filteredRows} query={query} />
            <InstructorCard />
          </>
        ) : tab === 'students' ? (
          <StudentList rows={filteredStudents} />
        ) : tab === 'donation' ? (
          <DonationList query={query} />
        ) : (
          <TrainSchedule />
        )}
      </main>
      <Footer />
    </div>
  );
}
