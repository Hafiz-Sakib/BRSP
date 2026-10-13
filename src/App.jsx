import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import NoticeBanner from './components/NoticeBanner.jsx';
import SearchBar from './components/SearchBar.jsx';
import RosterGrid from './components/RosterGrid.jsx';
import Footer from './components/Footer.jsx';
import { ROSTER } from './data/roster.js';

export default function App() {
  const [query, setQuery] = useState('');

  // আগের HTML ভার্সনের মতোই: পুরো সারির টেক্সটে (নং, তারিখ, বার, আইডি, নাম) সার্চ হবে
  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ROSTER;
    return ROSTER.filter((row) => {
      const text = [
        row.no,
        row.date,
        row.day,
        ...row.members.map((m) => `${m.id} — ${m.name}`),
      ]
        .join(' ')
        .toLowerCase();
      return text.includes(q);
    });
  }, [query]);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 min-h-screen text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden print-shadow border border-slate-100">
        <Header />
        <NoticeBanner onPrint={() => window.print()} />
        <SearchBar value={query} onChange={setQuery} />
        <RosterGrid rows={filteredRows} />
        <Footer />
      </div>
    </div>
  );
}
