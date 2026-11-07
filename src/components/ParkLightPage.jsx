import PageBanner from './PageBanner.jsx';
import { ParkingAnimator, LightsAnimator } from './HomeInteractive.jsx';

// "পার্কিং ও লাইট" ডেডিকেটেড পেজ — অ্যানিমেশনের সাথে পূর্ণ ব্যাখ্যা (দুই পাশে বাড়তি মার্জিনসহ)
export default function ParkLightPage() {
  return (
    <>
      <PageBanner
        title="পার্কিং ও লাইট"
        subtitle="পার্কিংয়ের ধাপ ও গাড়ির লাইটের ব্যবহার — অ্যানিমেশনসহ"
        chips={['পার্কিং অ্যানিমেশন', 'গাড়ির লাইট']}
      />
      <ParkingAnimator />
      <LightsAnimator />
    </>
  );
}
