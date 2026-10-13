const BN_DIGITS = '০১২৩৪৫৬৭৮৯';

// বাংলা অঙ্ক (০-৯) → ইংরেজি অঙ্ক (0-9), lowercase, বাড়তি স্পেস ও জিরো-উইডথ ক্যারেক্টার বাদ
export function normalize(text = '') {
  return String(text)
    .replace(/[\u200c\u200d]/g, '')
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const isNumeric = (q) => /^\d+$/.test(q);

// আইডি বাংলা (৮৮) বা ইংরেজি (88) — যেকোনোটা দিলেই মিলবে
export function memberMatches(member, query) {
  const q = normalize(query);
  if (!q) return false;
  const id = normalize(member.id);
  if (isNumeric(q)) return id.startsWith(q);
  return normalize(`${member.name} ${member.alias ?? ''}`).includes(q);
}

export function matchesQuery(row, query) {
  const q = normalize(query);
  if (!q) return true;

  if (isNumeric(q)) {
    // সংখ্যা হলে: আইডি (শুরু মিললেই) অথবা তারিখের দিন / ক্রমিক নং হুবহু মিললে
    const day = normalize(row.date).split(' ')[0];
    return (
      row.members.some((m) => normalize(m.id).startsWith(q)) ||
      day === q ||
      normalize(row.no) === q
    );
  }

  // লেখা হলে: নাম (বাংলা/ইংরেজি), বার, মাস
  const text = normalize(
    [row.date, row.day, ...row.members.map((m) => `${m.name} ${m.alias ?? ''}`)].join(' ')
  );
  return text.includes(q);
}

// শিক্ষার্থী তালিকার সার্চ: নাম (বাংলা/ইংরেজি), রেজি, পিতার নাম, ফোন নম্বর
export function studentMatches(s, query) {
  const q = normalize(query);
  if (!q) return true;
  if (isNumeric(q)) {
    return (
      normalize(s.reg).startsWith(q) ||
      normalize(s.no) === q ||
      [s.bsp, s.bkash, s.whatsapp].some((p) => p.includes(q))
    );
  }
  return normalize(`${s.name} ${s.alias ?? ''} ${s.father}`).includes(q);
}
