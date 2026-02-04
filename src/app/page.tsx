import Navbar from '@/components/ZamZamApp//Navbar';
import HeroSection from '@/components/ZamZamApp/HeroSection';
import Testimonials from '@/components/ZamZamApp/Testimonials';
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
