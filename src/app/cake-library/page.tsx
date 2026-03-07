'use client';

import { useEffect, useState } from 'react';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/common/Button';

import { productApi } from '../../lib/services/api/product.api';
import { Product } from '../../types/product';

const cakeCategories = ['Anniversary', 'Birthday', 'Wedding'];

export default function LibraryPage() {
  const categories = ['All', ...cakeCategories];

  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getAll();
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredCakes =
    activeCategory === 'All'
      ? products
      : products.filter((cake) => cake.category === activeCategory);

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
                isActive ? 'bg-[#923a3a] text-white!' : 'bg-[#F0F2F5]'
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
          <Link href={`/cake/${cake._id}`} key={cake._id}>
            <CakeItem
              image={cake.images?.[0]}
              name={cake.name}
              price={`₹${cake.price}`}
            />
          </Link>
        ))}
      </div>

      {/* Bottom Fixed Button */}
      <div className='fixed bottom-0 left-0 right-0 p-6 z-50'>
        <Button href='/custom-cake' fullWidth>
          Upload your design
        </Button>
      </div>
    </div>
  );
}

function CakeItem({
  image,
  name,
  price,
}: {
  image: string | undefined;
  name: string;
  price: string;
}) {
  return (
    <div className='flex flex-col gap-2 cursor-pointer'>
      <div className='relative aspect-4/5 rounded-4xl overflow-hidden'>
        {image && (
          <Image src={image} alt={name} fill className='object-cover' />
        )}
      </div>

      <h3 className="font-['Epilogue'] font-bold text-sm">{name}</h3>

      <p className="font-['Epilogue'] text-[#923a3a] font-semibold text-sm">
        {price}
      </p>
    </div>
  );
}
