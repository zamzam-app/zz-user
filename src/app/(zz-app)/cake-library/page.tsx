'use client';

import type { StaticImageData } from 'next/image';
import { useState } from 'react';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';

import {
  cakes,
  cakeCategories,
  CakeCategory,
} from '../../../../public/__mocks__/cakes';

export default function LibraryPage() {
  const categories: Array<'All' | CakeCategory> = [
    'All',
    ...cakeCategories,
  ];

  const [activeCategory, setActiveCategory] =
    useState<'All' | CakeCategory>('All');

  const filteredCakes =
    activeCategory === 'All'
      ? cakes
      : cakes.filter((cake) => cake.category === activeCategory);

  return (
    <div className='bg-white min-h-screen pb-28'>
      {/* Header */}
      <header className='relative flex items-center justify-center px-6 py-4'>
        <Link href='/' className='absolute left-6'>
        <ArrowLeftOutlined className='text-xl hover:text-[#751414]' />
        </Link>

        <h1 className="font-['Epilogue'] font-extrabold tracking-tight text-gray-900 text-base sm:text-xl md:text-2xl lg:text-3xl truncate max-w-[70%] text-center translate-y-1 md:translate-y-2">
          ZamZam Bun Studio
        </h1>

        <div className='absolute right-6'>
          <SearchOutlined className='text-xl hover:text-[#751414]' />
        </div>
      </header>

      {/* Categories */}
      <div className='flex gap-3 px-6 py-4 overflow-x-auto no-scrollbar'>
        {categories.map((cat) => {
          const isActive = activeCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#923a3a] text-white!'
                  : 'bg-[#F0F2F5]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Cake Grid */}
      <div className='grid grid-cols-2 gap-4 px-6 mt-4'>
        {filteredCakes.map((cake) => (
          <Link href={`/customize-cake/${cake.id}`} key={cake.id}>
            <CakeItem
              image={cake.image}
              name={cake.name}
              price={`$${cake.basePrice}`}
            />
          </Link>
        ))}
      </div>

      {/* Bottom Fixed Button */}
      <div className='fixed bottom-0 left-0 right-0 px-6 py-4 z-5'>
        <Link href='/custom-cake'>
          <button className='w-full bg-[#923a3a] text-white! py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98]'>
            Upload your design
          </button>
        </Link>
      </div>
    </div>
  );
}

function CakeItem({
  image,
  name,
  price,
}: {
  image: StaticImageData;
  name: string;
  price: string;
}) {
  return (
    <div className='flex flex-col gap-2 cursor-pointer'>
      <div className='relative aspect-4/5 rounded-4xl overflow-hidden'>
        <Image src={image} alt={name} fill className='object-cover' />
      </div>

      <h3 className="font-['Epilogue'] font-bold text-sm">{name}</h3>

      <p className="font-['Epilogue'] text-[#923a3a] font-semibold text-sm">
        {price}
      </p>
    </div>
  );
}
