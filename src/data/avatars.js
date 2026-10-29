// শিক্ষার্থীর ছবি — src/assets/students/<রেজি নং>.jpg নামে ফাইল রাখলেই অটো যুক্ত হবে।
// নতুন ছবি যোগ: ফাইলের নাম = রেজি নম্বর (ইংরেজি অঙ্কে), যেমন 72.jpg — আর কোনো কোড বদলাতে হবে না।
const files = import.meta.glob('../assets/students/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const toEn = (v) => String(v).replace(/[০-৯]/g, (d) => BN_DIGITS.indexOf(d));

const AVATARS = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split('/').pop().replace(/\.\w+$/, ''), url])
);

// রেজি (বাংলা বা ইংরেজি অঙ্কে) → ছবির URL, না থাকলে null
export const avatarFor = (reg) => AVATARS[toEn(reg)] ?? null;
