'use client';

import { useEffect, useState, useRef } from 'react';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/common/Button';

import { productApi } from '../../lib/services/api/product.api';
import { categoryApi } from '../../lib/services/api/category.api';
import { Product } from '../../types/product';
import { Category } from '../../types/category';

export default function LibraryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          productApi.getAll(),
          categoryApi.getAll(),
        ]);
        setProducts(productRes.data ?? []);
        setCategories(categoryRes.data ?? []);
      } catch (error) {
        console.error('Failed to fetch library data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  const filteredCakes = products
    .filter((cake) => {
      if (activeCategory === 'All') return true;
      if (cake.categoryList && cake.categoryList.length > 0) {
        return cake.categoryList.includes(activeCategory);
      }
      return cake.category === activeCategory;
    })
    .filter((cake) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        cake.name.toLowerCase().includes(q) ||
        (cake.description?.toLowerCase().includes(q) ?? false)
      );
    });

  const shouldShowEmptyState =
    !isLoading &&
    filteredCakes.length === 0 &&
    (searchQuery.trim() || activeCategory !== 'All');

  return (
    <div className='bg-white min-h-screen pb-28'>
      {/* Header */}
      <header className='relative flex items-center justify-center px-6 pt-12 pb-4'>
        <Link
          href='/'
          className='absolute left-6 z-10 text-black! hover:text-[#751414]!'
        >
          <ArrowLeftOutlined className='text-xl' />
        </Link>

        {isSearchOpen ? (
          <div className='absolute inset-x-0 mx-14 flex items-center gap-2'>
            <div className='relative flex flex-1 items-center rounded-xl bg-[#F0F2F5] focus-within:ring-2 focus-within:ring-[#923a3a]/30'>
              <SearchOutlined className='absolute left-4 text-lg text-gray-400 pointer-events-none' />
              <input
                ref={searchInputRef}
                type='search'
                placeholder='Search cakes by name or description...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full flex-1 py-2.5 pl-11 pr-10 rounded-xl bg-transparent font-["Epilogue"] text-base placeholder:text-gray-500 focus:outline-none'
                aria-label='Search cakes'
              />
              <button
                type='button'
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className='absolute right-3 p-1.5 rounded-full hover:bg-gray-200 text-gray-500 font-medium'
                aria-label='Close search'
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <h1 className="font-['Epilogue'] font-extrabold tracking-tight text-gray-900 text-base sm:text-xl md:text-2xl lg:text-3xl truncate max-w-[70%] text-center translate-y-1 md:translate-y-2">
            ZamZam Bun Studio
          </h1>
        )}

        {!isSearchOpen && (
          <button
            type='button'
            onClick={() => setIsSearchOpen(true)}
            className='absolute right-6 p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-[#751414]'
            aria-label='Open search'
          >
            <SearchOutlined className='text-xl' />
          </button>
        )}
      </header>

      {/* Categories */}
      {isLoading ? (
        <div className='flex gap-3 px-6 py-4 overflow-x-auto no-scrollbar'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='h-9 w-20 rounded-xl shimmer' />
          ))}
        </div>
      ) : (
        <div className='flex gap-3 px-6 py-4 overflow-x-auto no-scrollbar'>
          {['All', ...categories].map((cat) => {
            const catId = typeof cat === 'string' ? 'All' : cat._id;
            const label = typeof cat === 'string' ? cat : cat.name;
            const isActive = activeCategory === catId;

            return (
              <button
                key={catId}
                onClick={() => setActiveCategory(catId)}
                className={`px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                  isActive ? 'bg-[#923a3a] text-white!' : 'bg-[#F0F2F5]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Cake Grid */}
      <div className='grid grid-cols-2 gap-4 px-6 mt-4'>
        {isLoading || (!shouldShowEmptyState && filteredCakes.length === 0) ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='flex flex-col gap-2'>
              <div className='aspect-4/5 rounded-4xl shimmer' />
              <div className='h-4 w-3/4 rounded shimmer' />
              <div className='h-4 w-1/2 rounded shimmer' />
            </div>
          ))
        ) : shouldShowEmptyState ? (
          <p className='col-span-2 py-8 text-center font-["Epilogue"] text-gray-500'>
            {searchQuery.trim() || activeCategory !== 'All'
              ? 'No cakes match your search.'
              : 'No cakes yet.'}
          </p>
        ) : (
          filteredCakes.map((cake) => (
            <Link
              href={`/cake/${cake._id}`}
              key={cake._id}
              className='text-black! no-underline hover:text-black!'
            >
              <CakeItem
                image={cake.images?.[0]}
                name={cake.name}
                price={`₹${cake.price}`}
              />
            </Link>
          ))
        )}
      </div>

      {/* Bottom Fixed Button */}
      <div className='fixed bottom-0 left-0 right-0 p-6 z-50'>
        {isLoading ? (
          <div className='h-12 w-full rounded-2xl shimmer' />
        ) : (
          <Button href='/custom-cake' fullWidth>
            Upload your design
          </Button>
        )}
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
          <Image
            src={image}
            alt={name}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 50vw, 33vw'
            loading='eager'
          />
        )}
      </div>

      <h3 className="font-['Epilogue'] font-bold text-sm text-black!">
        {name}
      </h3>

      <p className="font-['Epilogue'] text-[#923a3a] font-semibold text-sm">
        {price}
      </p>
    </div>
  );
}
