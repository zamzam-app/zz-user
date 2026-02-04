'use client';

import Image from 'next/image';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import LogoImg from '../../../public/__mocks__/bun cafe logo.jpg';

const Navbar = () => {
  return (
    <nav className='relative flex items-center justify-between px-4 md:px-12 bg-white h-20 md:h-28 w-full shadow-sm'>
      {/* LEFT SECTION: Logo*/}
      <div className='z-20 flex items-center'>
        <div className='relative w-16 h-16 md:w-22 md:h-22 rounded-full overflow-hidden'>
          <Image
            src={LogoImg}
            alt='ZamZam Logo'
            fill
            priority
            className='object-cover'
          />
        </div>
      </div>

      {/* CENTER SECTION: Brand Name */}
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
        <h1 className="font-['Epilogue'] font-extrabold tracking-tight text-center pointer-events-auto text-gray-900 text-lg sm:text-2xl md:text-4xl translate-y-1 md:translate-y-2">
          ZamZam Bun Studio
        </h1>
      </div>

      {/* RIGHT SECTION: Cart */}
      <div className='z-20'>
        <Badge count={0} showZero offset={[4, 0]} color='#923a3a'>
          <ShoppingCartOutlined className='text-2xl md:text-4xl cursor-pointer' />
        </Badge>
      </div>
    </nav>
  );
};

export default Navbar;
