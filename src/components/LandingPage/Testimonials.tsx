'use client';

import React from 'react';
import Image from 'next/image';
import { StarFilled } from '@ant-design/icons';

import cake1 from '../../../public/__mocks__/Cake1.png';
import cake2 from '../../../public/__mocks__/Cake2.png';
import cake3 from '../../../public/__mocks__//Cake3.png';

const Testimonials = () => {
  const ratings = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  return (
    <section className='bg-[#FDFCFB] py-12 px-6 sm:px-8 lg:py-24'>
      <div className='max-w-6xl mx-auto'>
        {/* Title */}
        <h2 className="font-['Epilogue'] text-2xl sm:text-3xl lg:text-5xl font-extrabold text-[#0D141C] mb-12">
          Customer Testimonials & Ratings
        </h2>

        {/* Ratings */}
        <div className='flex items-center gap-4 w-full mb-16'>
          {/* Left */}
          <div className='flex flex-col gap-2 w-[40%] shrink-0'>
            <span className='text-6xl lg:text-8xl font-bold text-[#0D141C] leading-none'>
              4.8
            </span>

            <div className='flex gap-1 text-[#923a3a] text-2xl'>
              {[...Array(5)].map((_, i) => (
                <StarFilled key={i} />
              ))}
            </div>

            <p className='text-sm text-[#4F7396] font-medium'>245 reviews</p>
          </div>

          {/* Right */}
          <div className='flex flex-col gap-3 w-[60%]'>
            {ratings.map((item) => (
              <div key={item.stars} className='flex items-center gap-2'>
                <span className='text-sm font-bold w-4'>{item.stars}</span>

                <div className='flex-1 h-2 bg-[#E8EDF2] rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-[#923a3a]'
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <span className='text-xs text-[#4F7396] w-10 text-right'>
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 Horizontal Scroll (RESTORED) */}
        <div className='flex gap-6 overflow-x-auto scrollbar-hide pb-4'>
          {/* Card 1 */}
          <div className='min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm'>
            <div className='relative w-full h-56'>
              <Image
                src={cake1}
                alt='Chocolate Cake'
                fill
                className='object-cover'
              />
            </div>

            <div className='p-5'>
              <p className='text-sm text-[#0D141C] mb-4'>
                Absolutely stunning cakes! The design was exactly what I
                envisioned, and the taste was divine. Highly recommend!
              </p>

              <p className='text-sm font-semibold text-[#923a3a]'>
                Fatima Ali
                <span className='text-[#4F7396] font-normal'>
                  {' '}
                  – 2 weeks ago
                </span>
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className='min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm'>
            <div className='relative w-full h-56'>
              <Image
                src={cake2}
                alt='Designer Cake'
                fill
                className='object-cover'
              />
            </div>

            <div className='p-5'>
              <p className='text-sm text-[#0D141C] mb-4'>
                The cake was beautiful and delicious, though a bit sweeter than
                expected. Overall, a great experience!
              </p>

              <p className='text-sm font-semibold text-[#751414]'>
                Yusuf Ibrahim
                <span className='text-[#4F7396] font-normal'>
                  {' '}
                  – 1 month ago
                </span>
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className='min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm'>
            <div className='relative w-full h-56'>
              <Image
                src={cake3}
                alt='Designer Cake'
                fill
                className='object-cover'
              />
            </div>

            <div className='p-5'>
              <p className='text-sm text-[#0D141C] mb-4'>
                The cake was beautiful and delicious, though a bit sweeter than
                expected. Overall, a great experience!
              </p>

              <p className='text-sm font-semibold text-[#923a3a]'>
                Yusuf Ibrahim
                <span className='text-[#4F7396] font-normal'>
                  {' '}
                  – 1 month ago
                </span>
              </p>
            </div>
          </div>
          {/* Card 2 */}
          <div className='min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm'>
            <div className='relative w-full h-56'>
              <Image
                src={cake2}
                alt='Designer Cake'
                fill
                className='object-cover'
              />
            </div>

            <div className='p-5'>
              <p className='text-sm text-[#0D141C] mb-4'>
                The cake was beautiful and delicious, though a bit sweeter than
                expected. Overall, a great experience!
              </p>

              <p className='text-sm font-semibold text-[#923a3a]'>
                Yusuf Ibrahim
                <span className='text-[#4F7396] font-normal'>
                  {' '}
                  – 1 month ago
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
