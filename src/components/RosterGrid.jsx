import DutyCard from './DutyCard.jsx';

// সব ডিভাইসেই কার্ড: পিসি = ৩ কলাম, ট্যাবলেট = ২ কলাম, মোবাইল = ১ কলাম
export default function RosterGrid({ rows, query }) {
  if (rows.length === 0) {
    return (
      <div className="px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <div className="py-14 text-center text-slate-400 font-medium">কোনো ফলাফল পাওয়া যায়নি</div>
      </div>
    );
  }

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8 max-w-[96rem] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
        {rows.map((row) => (
          <DutyCard key={row.no} row={row} query={query} />
        ))}
      </div>
    </div>
  );
}
