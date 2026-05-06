'use client';

import { useState } from 'react';
import Image from 'next/image';
import { StarFilled } from '@ant-design/icons';

import zamzam1 from '../../../public/__mocks__/reviews/r1.webp';
import zamzam3 from '../../../public/__mocks__/reviews/r2.webp';
import zamzamCustomerFood from '../../../public/__mocks__/reviews/r3.webp';

type TestimonialCard = {
  name: string;
  date: string;
  rating: number;
  text: string;
  image: typeof zamzam1;
  imageAlt: string;
};

const TRUNCATE_LIMIT = 150;
const GOOGLE_REVIEWS_SUMMARY = {
  averageRating: 4.7,
  totalReviews: 469,
  maxRating: 5,
  ratingBreakdown: [
    { rating: 5, count: 379, percentage: 81 },
    { rating: 4, count: 75, percentage: 16 },
    { rating: 3, count: 5, percentage: 1 },
    { rating: 2, count: 5, percentage: 1 },
    { rating: 1, count: 5, percentage: 1 },
  ],
} as const;

const RatingStars = ({
  rating,
  maxRating,
  sizeClassName,
}: {
  rating: number;
  maxRating: number;
  sizeClassName: string;
}) => {
  const filledStars = Math.floor(Math.max(0, Math.min(rating, maxRating)));

  return (
    <div className={`flex gap-1 text-[#923a3a] ${sizeClassName}`}>
      {Array.from({ length: maxRating }, (_, i) => (
        <StarFilled
          key={i}
          className={i < filledStars ? 'text-[#923a3a]' : 'text-[#E1C7C7]'}
        />
      ))}
    </div>
  );
};

const TestimonialCard = ({ item }: { item: TestimonialCard }) => {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = item.text.length > TRUNCATE_LIMIT;
  const displayText =
    shouldTruncate && !expanded
      ? item.text.slice(0, TRUNCATE_LIMIT).trimEnd() + '...'
      : item.text;

  return (
    <div className='min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm'>
      <div className='relative w-full h-56'>
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 320px, 320px'
        />
      </div>

      <div className='p-5'>
        <div className='flex gap-1 text-[#923a3a] text-sm mb-3'>
          {[...Array(item.rating)].map((_, i) => (
            <StarFilled key={i} />
          ))}
        </div>

        <p className='text-sm text-[#0D141C] mb-2 whitespace-pre-line'>
          {displayText}
        </p>

        {shouldTruncate && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className='text-xs text-[#923a3a] font-semibold mb-2 hover:underline'
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        <p className='text-sm font-semibold text-[#923a3a]'>
          {item.name}
          <span className='text-[#4F7396] font-normal'> – {item.date}</span>
        </p>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const ratingsSummary = GOOGLE_REVIEWS_SUMMARY;
  const maxRating = ratingsSummary.maxRating;
  const averageRatingLabel = ratingsSummary.averageRating.toFixed(1);
  const totalReviewsLabel = `${ratingsSummary.totalReviews.toLocaleString('en-IN')} reviews`;

  const ratings = [...ratingsSummary.ratingBreakdown]
    .sort((a, b) => b.rating - a.rating)
    .map((item) => ({
      stars: item.rating,
      percentage: item.percentage,
      countLabel: item.count.toLocaleString('en-IN'),
    }));

  const testimonials: TestimonialCard[] = [
    {
      name: 'Anoop Kumar',
      date: '3 months ago',
      rating: 5,
      image: zamzam1,
      imageAlt: 'Zam Zam Bun Cafe food and table setup',
      text: 'They serve excellent food, and both the dining area and kitchen are clean and well maintained. This place is a good choice if you have sufficient time and budget, as there can be a wait during peak hours due to heavy rush. However, the food is definitely worth both the wait and the price. The washrooms are neat and hygienic as well. The only drawback is the limited parking space.',
    },
    {
      name: 'Steffy Sunyy',
      date: '3 months ago',
      rating: 4,
      image: zamzamCustomerFood,
      imageAlt:
        'Customer photo of fresh buns and snack display at Zam Zam Bun Cafe',
      text: `Such a lovely and cozy café with amazing food and vibes 😍
Perfect for chilling, working, catching up with friends, or a cute date 💕💻☕
🍩 The buns are the real highlight!
The Nutella cookie bun 🤎 and pistachio bun 💚 are super soft, fresh, and absolutely delicious 🤤✨
🥤🍔🥪 It's not just about desserts — they also have fresh juices & smoothies, salads 🥗, burgers & sandwiches 🍔🥪, and a nice range of bakery items 🥐, so there's something for every craving 💯
🌿 The ambience is warm, calm, and welcoming, and the customer service is polite, friendly, and attentive, which makes the whole experience even better 😊
💸 Prices are medium-costly — slightly on the higher side, but totally worth it for the quality and overall experience 👍
✨ Great food
✨ Cozy atmosphere
✨ Work-friendly & date-friendly
🌟 Highly recommend Zam Zam Bun Café. Will definitely visit again! 🌟💖`,
    },
    {
      name: 'Aswathy G',
      date: '3 months ago',
      rating: 5,
      image: zamzam3,
      imageAlt: 'Cozy ambience inside Zam Zam Bun Cafe',
      text: `This place has always been a favorite—no debates, no doubts. And the strawberry-blueberry smoothie? A loyal constant, ordered every single time`,
    },
  ];

  return (
    <section className='bg-[#FDFCFB] py-12 px-6 sm:px-8 lg:py-24'>
      <div className='max-w-6xl mx-auto'>
        {/* Title */}
        <h2 className="font-['Epilogue'] text-2xl sm:text-3xl lg:text-5xl font-extrabold text-[#0D141C] mb-12">
          Latest Customer Testimonials & Ratings
        </h2>

        {/* Ratings */}
        <div className='flex items-center gap-4 w-full mb-16'>
          <div className='flex flex-col gap-2 w-[40%] shrink-0'>
            <span className='text-6xl lg:text-8xl font-bold text-[#0D141C] leading-none'>
              {averageRatingLabel}
            </span>

            <RatingStars
              rating={ratingsSummary?.averageRating ?? 0}
              maxRating={maxRating}
              sizeClassName='text-2xl'
            />

            <p className='text-sm text-[#4F7396] font-medium'>
              {totalReviewsLabel}
            </p>
          </div>

          <div className='flex flex-col gap-3 w-[60%]'>
            {ratings.map((item) => (
              <div key={item.stars} className='flex items-center gap-2'>
                <span className='text-sm font-bold w-4'>{item.stars}</span>

                <div className='flex-1 h-2 bg-[#E8EDF2] rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-[#923a3a]'
                    style={{
                      width: `${Math.max(0, Math.min(item.percentage, 100))}%`,
                    }}
                  />
                </div>

                <span className='text-xs text-[#4F7396] w-24 text-right'>
                  {item.percentage}% ({item.countLabel})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Scroll */}
        <div
          className='flex gap-6 overflow-x-auto pb-4'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {testimonials.map((item) => (
            <TestimonialCard key={`${item.name}-${item.date}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
