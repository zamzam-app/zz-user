import Navbar from '@/components/LandingPage/Navbar';
import HeroSection from '@/components/LandingPage/HeroSection';
import Testimonials from '@/components/LandingPage/Testimonials';
const page = () => {
  return (
    <div className="font-['Epilogue']">
      <Navbar />
      <HeroSection />
      <Testimonials />
    </div>
  );
};

export default page;
