'use client';

import React, { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cakes } from '../../../../../public/__mocks__/cakes';

export default function CustomizeCakePage() {
  const { id } = useParams<{ id: string }>();
  const cake = cakes.find((c) => c.id === id);

  const [selectedShape, setSelectedShape] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);

  if (!cake) return <div className='p-10 text-center'>Cake not found</div>;

  const toggleDecoration = (item: string) => {
    setSelectedDecorations((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  return (
    <div className='bg-white min-h-screen pb-32'>
      {/* Header */}
      <header className='relative flex items-center px-6 py-4'>
        <Link href='/cake-library'>
          <ArrowLeftOutlined className='text-xl text-black' />
        </Link>

        <h1 className="flex-1 font-['Epilogue'] font-extrabold tracking-tight text-gray-900 sm:text-xl md:text-2xl lg:text-3xl text-center translate-y-1 md:translate-y-2">
          Customize Cake
        </h1>
      </header>

      <main className='px-6 space-y-6'>
        {/* Product Image */}
        <div className='relative w-full aspect-16/10 rounded-2xl overflow-hidden shadow-sm'>
          <Image
            src={cake.image}
            alt={cake.name}
            fill
            className='object-cover'
          />
        </div>

        {/* Cake Text */}
        <div className='space-y-2'>
          <label className="block font-['Epilogue'] font-bold text-[#0D141C]">
            Cake Text
          </label>
          <input
            type='text'
            placeholder='Add text for your cake'
            className='w-full p-4 rounded-xl bg-[#FDFCFB] border border-[#E8EDF2] ext-sm focus:outline-none resize-none'
          />
        </div>

        {/* Shape */}
        <div className='space-y-2'>
          <label className="block font-['Epilogue'] font-bold text-[#0D141C]">
            Shape
          </label>
          <div className='flex gap-2'>
            {cake.options.shapes.map((shape) => (
              <button
                key={shape}
                onClick={() => setSelectedShape(shape)}
                className={`px-5 py-2 rounded-xl font-['Epilogue'] text-sm font-medium border transition-all ${
                  selectedShape === shape
                    ? 'bg-[#923a3a] text-white! border-[#751414]'
                    : 'bg-[#FDFCFB] text-black border-[#E8EDF2]'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        {/* Flavor */}
        <div className='space-y-2'>
          <label className="block font-['Epilogue'] font-bold text-[#0D141C]">
            Flavor
          </label>
          <div className='flex gap-2'>
            {cake.options.flavors.map((flavor) => (
              <button
                key={flavor}
                onClick={() => setSelectedFlavor(flavor)}
                className={`px-5 py-2 rounded-xl font-['Epilogue'] text-sm font-medium border transition-all ${
                  selectedFlavor === flavor
                    ? 'bg-[#923a3a] text-white! border-[#751414]'
                    : 'bg-[#FDFCFB] text-black border-[#E8EDF2]'
                }`}
              >
                {flavor}
              </button>
            ))}
          </div>
        </div>

        {/* Decoration */}
        <div className='space-y-3'>
          <label className="block font-['Epilogue'] font-bold text-[#0D141C]">
            Decoration
          </label>

          <div className='space-y-3'>
            {cake.options.decorations.map((decoration) => (
              <label
                key={decoration}
                className='flex items-center gap-3 cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={selectedDecorations.includes(decoration)}
                  onChange={() => toggleDecoration(decoration)}
                  className='w-5 h-5 accent-[#923a3a] rounded border-gray-300'
                />
                <span className="font-['Epilogue'] text-sm font-medium text-[#0D141C]">
                  {decoration}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Requests */}
        <div className='space-y-2'>
          <label className="block font-['Epilogue'] font-bold text-[#0D141C]">
            Additional Requests
          </label>
          <textarea
            rows={4}
            placeholder='e.g., specific color palette, allergy notes, etc.'
            className="w-full p-4 rounded-xl bg-[#FDFCFB] border border-[#E8EDF2] font-['Epilogue'] text-sm focus:outline-none resize-none"
          />
        </div>
      </main>

      {/* Bottom Button */}
      <div className='fixed bottom-0 left-0 right-0 p-6 '>
        <button className="w-full bg-[#923a3a] text-white! py-4 rounded-2xl font-['Epilogue'] font-bold text-lg active:scale-[0.98] transition-transform shadow-md">
          Get Quote
        </button>
      </div>
    </div>
  );
}
