import BakeryImg from '../../../public/__mocks__/BakeryImage.png';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className='relative h-150 md:h-187.5 w-full overflow-hidden flex flex-col items-center justify-center'>
      {/* 1. Background Image Container */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out'
        style={{
          backgroundImage: ` url(${BakeryImg.src})`,
          backgroundColor: '#4a3728',
        }}
      />

      {/* 2. Content Container */}
      <div className='relative z-20 flex h-full flex-col items-center justify-center px-6 text-center'>
        <p className="max-w-70 md:max-w-2xl font-['Epilogue'] text-xl md:text-4xl font-semibold leading-tight text-white mt-2">
          Join the
        </p>

        <h2 className="my-2 font-['Epilogue'] text-7xl md:text-9xl font-extrabold text-white tracking-tighter leading-none">
          1,234
        </h2>

        <p className="max-w-70 md:max-w-2xl font-['Epilogue'] text-xl md:text-4xl font-semibold leading-tight text-white mt-2">
          happy customers we've served
        </p>

        {/* 3. Action Button  */}
        <Link href='cake-library'>
          <button className="mt-16 md:mt-24 rounded-full  bg-[#923a3a] px-10 py-4 font-['Epilogue'] text-lg font-bold text-[#FDF5E6]! shadow-2xl transition-all duration-300 ease-in-out  hover:bg-white hover:text-[#923a3a] hover:-translate-y-2 active:scale-95">
            Explore Cake Studio
          </button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
