import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import NoticeBanner from './components/NoticeBanner.jsx';
import SearchBar from './components/SearchBar.jsx';
import RosterGrid from './components/RosterGrid.jsx';
import StudentList from './components/StudentList.jsx';
import Footer from './components/Footer.jsx';
import { ROSTER, STUDENTS } from './data/roster.js';
import { matchesQuery, studentMatches } from './utils/search.js';

export default function App() {
  const [query, setQuery] = useState('');
  // PWA শর্টকাট: ?tab=students দিয়ে সরাসরি শিক্ষার্থী তালিকা খোলা যায়
  const [tab, setTab] = useState(() =>
    new URLSearchParams(window.location.search).get('tab') === 'students' ? 'students' : 'roster'
  );

  // বাংলা বা ইংরেজি — যেকোনো অঙ্কে আইডি/তারিখ, নাম দিয়ে সার্চ
  const filteredRows = useMemo(
    () => ROSTER.filter((row) => matchesQuery(row, query)),
    [query]
  );
  const filteredStudents = useMemo(
    () => STUDENTS.filter((s) => studentMatches(s, query)),
    [query]
  );

  const tabCls = (t) =>
    `flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition ${
      tab === t ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-slate-800">
      <Header />
      <NoticeBanner onPrint={() => window.print()} />
      <SearchBar value={query} onChange={setQuery} />
      <div className="no-print flex justify-center px-4 pt-4">
        <div className="anim-tabs flex w-full sm:w-auto p-1 bg-white border border-slate-200 rounded-xl shadow-sm gap-1">
          <button type="button" onClick={() => setTab('roster')} className={tabCls('roster')}>রোস্টার</button>
          <button type="button" onClick={() => setTab('students')} className={tabCls('students')}>শিক্ষার্থী তালিকা</button>
        </div>
      </div>
      <main key={tab} className="anim-page flex-1">
        {tab === 'roster' ? (
          <RosterGrid rows={filteredRows} query={query} />
        ) : (
          <StudentList rows={filteredStudents} />
        )}
      </main>
      <Footer />
    </div>
  );
}
