// রোস্টার ও শিক্ষার্থী তালিকা পেজের ছোট শিরোনাম ব্যানার
export default function PageBanner({ title, subtitle, chips = [] }) {
  return (
    <section className="relative overflow-hidden bg-brsp-ink text-white px-4 sm:px-8">
      <div className="max-w-6xl mx-auto py-6 sm:py-8 pb-10 sm:pb-12">
        {subtitle && <p className="text-emerald-200 text-sm font-semibold">{subtitle}</p>}
        <h1 className="mt-1 text-2xl min-[400px]:text-3xl sm:text-4xl font-bold leading-snug tracking-tight">{title}</h1>
        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {chips.map((c, i) => (
              <span key={c} className={`rounded-full px-4 py-1.5 font-medium ${i === 0 ? 'bg-white text-brsp-ink font-bold' : 'border border-white/30'}`}>
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="road-dash absolute inset-x-0 bottom-4 h-[3px]" aria-hidden="true" />
    </section>
  );
}
