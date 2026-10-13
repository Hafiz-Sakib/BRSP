import DutyCard from './DutyCard.jsx';

export default function RosterGrid({ rows }) {
  if (rows.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="py-14 text-center text-slate-400 font-medium">কোনো ফলাফল পাওয়া যায়নি</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {rows.map((row) => (
          <DutyCard key={row.no} row={row} />
        ))}
      </div>
    </div>
  );
}
