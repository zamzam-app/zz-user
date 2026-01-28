/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Tag } from 'antd';
import {
  Cake,
  Wand2,
  Camera,
  Palette,
  Rotate3D,
  Star,
  Menu,
  X,
  CheckCircle2,
  Instagram,
  Facebook,
  MessageSquare,
  Edit2Icon,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Theme Colors ---
  // Using Tailwind arbitrary values mostly, but defining key hex codes for reference
  // Cream: #FFF8F0
  // Pink: #FFC0CB (subtle)
  // Chocolate: #5D4037
  // Gold: #D4AF37

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className='min-h-screen bg-[#FFF8F0] font-sans selection:bg-[#D4AF37] selection:text-white overflow-x-hidden'>
      {/* --- Header --- */}
      <header className='fixed top-0 w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-[#D4AF37]/10'>
        <div className='container mx-auto px-4 md:px-6 h-20 flex items-center justify-between'>
          {/* Logo */}
          <div
            className='flex items-center gap-2 cursor-pointer'
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className='w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#8a6e16] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100'>
              <Cake size={24} />
            </div>
            <span className='text-2xl font-bold tracking-tight text-[#5D4037] font-serif'>
              ZAM ZAM
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className='hidden md:flex items-center gap-8'>
            <button
              onClick={() => scrollToSection('features')}
              className='text-[#5D4037]/80 hover:text-[#D4AF37] font-medium transition-colors'
            >
              Design Cake
            </button>
            <button
              onClick={() => scrollToSection('ai-designer')}
              className='text-[#5D4037]/80 hover:text-[#D4AF37] font-medium transition-colors'
            >
              AI Designer
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className='text-[#5D4037]/80 hover:text-[#D4AF37] font-medium transition-colors'
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className='text-[#5D4037]/80 hover:text-[#D4AF37] font-medium transition-colors'
            >
              Pricing
            </button>
          </nav>

          {/* Actions */}
          <div className='hidden md:flex items-center gap-4'>
            <Button type='text' className='font-medium text-[#5D4037]'>
              Login
            </Button>
            <Link href='/create-cake'>
              <Button
                type='primary'
                size='large'
                className='bg-[#5D4037] hover:bg-[#4a322c] border-none shadow-xl shadow-[#5D4037]/20 flex items-center gap-2'
              >
                <Edit2Icon size={16} /> Create Cake
              </Button>
            </Link>
            <Link href='/qrform/1'>
              <Button
                type='default'
                size='large'
                className='bg-[#5D4037] hover:bg-[#4a322c] border-none shadow-xl shadow-[#5D4037]/20 flex items-center gap-2'
              >
                <MessageSquare size={16} /> Write Review
              </Button>
            </Link>
<<<<<<< HEAD
            <Link href='/LandingPage'>
=======
            <Link href='/Home'>
>>>>>>> 0c939bd (feature: created zam-zam-app ui)
              <Button
                type='default'
                size='large'
                className='bg-[#5D4037] hover:bg-[#4a322c] border-none shadow-xl shadow-[#5D4037]/20 flex items-center gap-2'
<<<<<<< HEAD
              >
                {' '}
                Zam Zam App
              </Button>
            </Link>
=======
              > Zam Zam App
              </Button>
              </Link>

>>>>>>> 0c939bd (feature: created zam-zam-app ui)
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className='md:hidden p-2 text-[#5D4037]'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className='md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-5'>
            <button
              onClick={() => scrollToSection('features')}
              className='text-left text-lg font-medium text-[#5D4037]'
            >
              Design Cake
            </button>
            <button
              onClick={() => scrollToSection('ai-designer')}
              className='text-left text-lg font-medium text-[#5D4037]'
            >
              AI Designer
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className='text-left text-lg font-medium text-[#5D4037]'
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className='text-left text-lg font-medium text-[#5D4037]'
            >
              Pricing
            </button>
            <div className='h-px bg-gray-100 my-2'></div>
            <Link href='/create-cake' className='w-full'>
              <Button
                type='primary'
                block
                size='large'
                className='bg-[#5D4037] hover:bg-[#4a322c]'
              >
                Create Cake
              </Button>
            </Link>
            <Link href='/qrform/1' className='w-full'>
              <Button
                type='primary'
                block
                size='large'
                className='bg-[#5D4037] hover:bg-[#4a322c]'
              >
                Write Review
              </Button>
            </Link>
<<<<<<< HEAD
            <Link href='/LandingPage'>
              <Button
                type='primary'
                block
                size='large'
                className='bg-[#5D4037] hover:bg-[#4a322c]'
              >
                {' '}
                Zam Zam App
              </Button>
            </Link>
=======
            <Link href='/Home'>
              <Button
                type='default'
                size='large'
                className='bg-[#5D4037] hover:bg-[#4a322c] border-none shadow-xl shadow-[#5D4037]/20 flex items-center gap-2'
              > Zam Zam App
              </Button>
              </Link>
>>>>>>> 0c939bd (feature: created zam-zam-app ui)
          </div>
        )}
      </header>

      {/* --- Hero Section --- */}
      <section className='relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden'>
        {/* Background Blobs */}
        <div className='absolute top-0 right-0 w-[800px] h-[800px] bg-linear-to-bl from-pink-100/50 to-transparent rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2'></div>
        <div className='absolute bottom-0 left-0 w-[600px] h-[600px] bg-linear-to-tr from-amber-50 to-transparent rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2'></div>

        <div className='container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center'>
          <div className='space-y-8 animate-in slide-in-from-left-10 duration-700 fade-in'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#D4AF37]/30 shadow-sm text-[#D4AF37] font-semibold text-sm uppercase tracking-wider'>
              <Wand2 size={16} /> AI-Powered Cake Design
            </div>
            <h1 className='text-5xl md:text-7xl font-bold text-[#5D4037] leading-[1.1] font-serif'>
              Design Your{' '}
              <span className='bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] bg-clip-text text-transparent'>
                Dream Cake
              </span>{' '}
              <br /> in Minutes
            </h1>
            <p className='text-xl text-[#8D6E63] leading-relaxed max-w-lg'>
              Upload an image, customize flavors, and visualize in 3D. From
              imagination to celebration with the power of bakery AI.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button
                size='large'
                className='h-14 px-8 text-lg bg-[#5D4037] hover:bg-[#4a322c] border-none text-white rounded-2xl shadow-lg shadow-[#5D4037]/20 flex items-center gap-2'
              >
                <Camera size={20} /> Upload Image
              </Button>
              <Button
                size='large'
                className='h-14 px-8 text-lg bg-white hover:bg-gray-50 text-[#5D4037] border border-[#D4AF37]/30 rounded-2xl flex items-center gap-2'
              >
                <Palette size={20} /> Start Designing
              </Button>
            </div>

            <div className='flex items-center gap-4 text-sm font-medium text-[#8D6E63]'>
              <div className='flex -space-x-2'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='w-8 h-8 rounded-full border-2 border-white bg-gray-200'
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt='user'
                      className='w-full h-full rounded-full'
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className='flex text-amber-400'>
                  <Star size={14} fill='currentColor' />
                  <Star size={14} fill='currentColor' />
                  <Star size={14} fill='currentColor' />
                  <Star size={14} fill='currentColor' />
                  <Star size={14} fill='currentColor' />
                </div>
                10,000+ Happy Customers
              </div>
            </div>
          </div>

          <div className='relative animate-in slide-in-from-right-10 duration-1000 fade-in'>
            <div className='relative z-10 bg-white/40 backdrop-blur-xl rounded-[40px] p-6 border border-white/50 shadow-2xl'>
              <img
                src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop'
                alt='Realistic 3D Cake Preview'
                className='rounded-3xl w-full h-auto shadow-lg transform hover:scale-[1.02] transition-transform duration-500'
              />

              {/* Floating Card: AI Analyzed */}
              <div className='absolute top-10 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce shadow-pink-100'>
                <div className='w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600'>
                  <Wand2 size={20} />
                </div>
                <div>
                  <p className='text-xs text-gray-400 font-semibold uppercase'>
                    AI Analysis
                  </p>
                  <p className='text-sm font-bold text-gray-800'>
                    Wedding Theme Detected
                  </p>
                </div>
              </div>

              {/* Floating Card: 3D Preview */}
              <div className='absolute bottom-10 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse shadow-orange-100'>
                <div className='w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600'>
                  <Rotate3D size={20} />
                </div>
                <div>
                  <p className='text-xs text-gray-400 font-semibold uppercase'>
                    View Mode
                  </p>
                  <p className='text-sm font-bold text-gray-800'>
                    360° Rotatable
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Feature: Photo to Cake --- */}
      <section id='features' className='py-20 bg-white'>
        <div className='container mx-auto px-4 md:px-6 text-center mb-16'>
          <h2 className='text-4xl font-bold text-[#5D4037] mb-4 font-serif'>
            Turn Photos into Edible Art
          </h2>
          <p className='text-xl text-[#8D6E63] max-w-2xl mx-auto'>
            Upload any image and watch our AI transform it into a stunning,
            bakery-ready cake design.
          </p>
        </div>

        <div className='container mx-auto px-4 md:px-6'>
          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                title: 'Upload Photo',
                desc: 'Face, Logo, or Sketch',
                icon: <Camera size={32} className='text-pink-500' />,
                img: 'https://images.unsplash.com/photo-1544131750-2985d621da30?w=500&auto=format&fit=crop&q=60',
              },
              {
                title: 'AI Transformation',
                desc: 'Auto-generates 3D Model',
                icon: <Wand2 size={32} className='text-purple-500' />,
                img: 'https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?w=500&auto=format&fit=crop&q=60',
              },
              {
                title: 'Real Cake',
                desc: 'Baked by Experts',
                icon: <Cake size={32} className='text-orange-500' />,
                img: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=500&auto=format&fit=crop&q=60',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className='group relative rounded-3xl overflow-hidden cursor-pointer'
              >
                <div className='absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10'></div>
                <img
                  src={step.img}
                  alt={step.title}
                  className='w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700'
                />
                <div className='absolute bottom-0 left-0 p-6 z-20 text-white'>
                  <div className='w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 text-white border border-white/30'>
                    {step.icon}
                  </div>
                  <h3 className='text-2xl font-bold mb-1'>{step.title}</h3>
                  <p className='text-white/80'>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Feature: AI Designer --- */}
      <section
        id='ai-designer'
        className='py-24 bg-[#FFF0F5] relative overflow-hidden'
      >
        <div className='container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-16 items-center'>
          <div className='order-2 md:order-1'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-[50px] rotate-3 opacity-20 blur-2xl'></div>
              <div className='bg-white rounded-[40px] p-8 shadow-xl relative z-10 border border-white/50'>
                <div className='space-y-6'>
                  <div className='flex items-center gap-4 border-b border-gray-100 pb-4'>
                    <div className='w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center'>
                      <Wand2 className='text-pink-600' />
                    </div>
                    <div>
                      <h3 className='font-bold text-gray-800'>
                        AI Cake Designer
                      </h3>
                      <p className='text-xs text-gray-400'>
                        Powered by ZamGum Models
                      </p>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex gap-2'>
                      <span className='px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600'>
                        Theme: Safari
                      </span>
                      <span className='px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600'>
                        Tiers: 2
                      </span>
                      <span className='px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600'>
                        Flavor: Vanilla
                      </span>
                    </div>
                    <div className='aspect-video bg-gray-50 rounded-2xl overflow-hidden relative group'>
                      <img
                        src='https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800'
                        alt='Generated Cake'
                        className='w-full h-full object-cover'
                      />
                      <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <Button
                          type='primary'
                          shape='round'
                          icon={<Rotate3D size={16} />}
                        >
                          3D View
                        </Button>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        block
                        type='primary'
                        className='bg-pink-600 hover:bg-pink-700'
                      >
                        Refine Design
                      </Button>
                      <Button block>Download</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='order-1 md:order-2'>
            <Tag
              color='purple'
              className='px-3 py-1 text-sm font-semibold rounded-full mb-4 border-none bg-purple-100 text-purple-700'
            >
              BETA FEATURE
            </Tag>
            <h2 className='text-4xl md:text-5xl font-bold text-[#5D4037] mb-6 font-serif'>
              Smart Design Assistant
            </h2>
            <div className='space-y-6 text-[#8D6E63] text-lg'>
              <p>
                Don&apos;t have an image? No problem. Describe your dream cake,
                and our AI will build it layer by layer.
              </p>

              <ul className='space-y-4'>
                {[
                  'Smart Color & Theme Detection',
                  'Automatic structural validation (ensure it won&apos;t collapse)',
                  'Flavor pairing recommendations',
                  'Instant price estimation from partner bakeries',
                ].map((item, i) => (
                  <li key={i} className='flex items-start gap-3'>
                    <CheckCircle2
                      className='text-green-500 mt-1 shrink-0'
                      size={20}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                size='large'
                className='bg-[#5D4037] text-white hover:bg-[#4a322c] h-12 px-8 mt-4 rounded-xl'
              >
                Try AI Designer Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Feature: Customization --- */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4 md:px-6'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-[#5D4037] font-serif mb-4'>
              Complete Customization Control
            </h2>
            <p className='text-[#8D6E63]'>
              Every detail is up to you. Customize until it&apos;s perfect.
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {[
              {
                label: 'Shapes',
                icon: '🟥',
                items: 'Round, Square, Heart, Custom',
              },
              {
                label: 'Layers',
                icon: '🍰',
                items: 'Single, Tiered, Cupcake Tower',
              },
              {
                label: 'Flavors',
                icon: '🍫',
                items: 'Chocolate, Vanilla, Red Velvet...',
              },
              {
                label: 'Toppers',
                icon: '🕯️',
                items: 'Candles, Figurines, Photos',
              },
            ].map((item, i) => (
              <div
                key={i}
                className='p-6 bg-orange-50/50 rounded-3xl border border-orange-100 hover:shadow-lg transition-all hover:-translate-y-1'
              >
                <div className='text-4xl mb-4'>{item.icon}</div>
                <h3 className='font-bold text-lg text-[#5D4037] mb-2'>
                  {item.label}
                </h3>
                <p className='text-sm text-[#8D6E63]'>{item.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Trust & Social Proof --- */}
      <section className='py-20 bg-[#Fdfbf7] border-y border-[#D4AF37]/10'>
        <div className='container mx-auto px-4 md:px-6'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-[#5D4037] font-serif'>
              Trusted by 500+ Top Bakeries
            </h2>
          </div>

          <div className='flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500'>
            {[
              'Bakery One',
              'Sweet Delights',
              'Cake Boss',
              'Oven Fresh',
              'The Cake Factory',
            ].map((name, i) => (
              <div
                key={i}
                className='text-2xl font-bold font-serif text-[#5D4037] flex items-center gap-2'
              >
                <Cake size={24} /> {name}
              </div>
            ))}
          </div>

          <div className='mt-20 grid md:grid-cols-3 gap-8'>
            {[
              {
                name: 'Sarah J.',
                role: 'Event Planner',
                text: 'This tool saved my life! The 3D preview is exactly what my client wanted.',
              },
              {
                name: 'Michael R.',
                role: 'Dad',
                text: 'Designed my son’s superhero cake in 5 minutes. The bakery delivered it perfectly.',
              },
              {
                name: 'Emma W.',
                role: 'Bakery Owner',
                text: 'We receive higher quality orders with clear specs. Less back and forth!',
              },
            ].map((review, i) => (
              <div
                key={i}
                className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'
              >
                <div className='flex text-amber-400 mb-4'>
                  <Star fill='currentColor' size={16} />
                  <Star fill='currentColor' size={16} />
                  <Star fill='currentColor' size={16} />
                  <Star fill='currentColor' size={16} />
                  <Star fill='currentColor' size={16} />
                </div>
                <p className='text-[#5D4037] mb-6 italic'>
                  &quot;{review.text}&quot;
                </p>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gray-200 rounded-full overflow-hidden'>
                    <img
                      src={`https://i.pravatar.cc/100?u=${i}`}
                      alt={review.name}
                    />
                  </div>
                  <div>
                    <p className='font-bold text-sm text-[#5D4037]'>
                      {review.name}
                    </p>
                    <p className='text-xs text-gray-500'>{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='text-center mt-12'>
            <Link href='/qrform/1'>
              <Button
                type='default'
                size='large'
                className='border-gray-300 text-gray-600 hover:text-[#5D4037] hover:border-[#5D4037]'
              >
                Read All Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- Pricing --- */}
      <section id='pricing' className='py-20 bg-white'>
        <div className='container mx-auto px-4 md:px-6'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-[#5D4037] font-serif mb-4'>
              Simple, Transparent Pricing
            </h2>
            <p className='text-[#8D6E63]'>
              Design for free, pay only for premium features or when you order.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
            <div className='border border-gray-100 p-8 rounded-3xl hover:shadow-xl transition-all'>
              <h3 className='text-xl font-bold text-[#5D4037]'>Starter</h3>
              <div className='text-4xl font-bold text-[#5D4037] my-4'>Free</div>
              <p className='text-sm text-gray-500 mb-6'>
                Perfect for trying out ideas.
              </p>
              <ul className='space-y-3 mb-8 text-sm text-gray-600'>
                <li className='flex gap-2'>
                  <CheckCircle2 size={16} className='text-green-500' /> Basic
                  Customization
                </li>
                <li className='flex gap-2'>
                  <CheckCircle2 size={16} className='text-green-500' /> 2D
                  Preview
                </li>
                <li className='flex gap-2'>
                  <CheckCircle2 size={16} className='text-green-500' /> Find
                  Bakeries
                </li>
              </ul>
              <Button block size='large'>
                Start Designing
              </Button>
            </div>

            <div className='border-2 border-[#D4AF37] relative bg-[#fffcf5] p-8 rounded-3xl shadow-2xl scale-105'>
              <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide'>
                Most Popular
              </div>
              <h3 className='text-xl font-bold text-[#5D4037]'>Pro Designer</h3>
              <div className='text-4xl font-bold text-[#5D4037] my-4'>
                $9<span className='text-lg font-normal text-gray-500'>/mo</span>
              </div>
              <p className='text-sm text-gray-500 mb-6'>
                For serious planners & fun.
              </p>
              <ul className='space-y-3 mb-8 text-sm text-gray-600'>
                <li className='flex gap-2'>
                  <CheckCircle2 size={16} className='text-green-500' />{' '}
                  Everything in Free
                </li>
                <li className='flex gap-2'>
                  <CheckCircle2 size={16} className='text-green-500' /> AI
                  Auto-Design (Unlim.)
                </li>
                <li className='flex gap-2'>
                  <CheckCircle2 size={16} className='text-green-500' /> HD 3D
                  Renders
                </li>
                <li className='flex gap-2'>
                  <CheckCircle2 size={16} className='text-green-500' /> Download
                  Print-Ready Files
                </li>
              </ul>
              <Button
                block
                type='primary'
                size='large'
                className='bg-[#5D4037] hover:bg-[#4a322c]'
              >
                Get Pro
              </Button>
            </div>

            <div className='border border-gray-100 p-8 rounded-3xl hover:shadow-xl transition-all'>
              <h3 className='text-xl font-bold text-[#5D4037]'>
                Bakery Partner
              </h3>
              <div className='text-4xl font-bold text-[#5D4037] my-4'>
                $49
                <span className='text-lg font-normal text-gray-500'>/mo</span>
              </div>
              <p className='text-sm text-gray-500 mb-6'>
                Grow your cake business.
              </p>
              <ul className='space-y-3 mb-8 text-sm text-gray-600'>
                <li className='flex gap-2'>
                  <CheckCircle2 size={16} className='text-green-500' /> Receive
                  Detailed Orders
                </li>
                <li className='flex gap-2'>
                  <CheckCircle2 size={16} className='text-green-500' /> Admin
                  Dashboard
                </li>
                <li className='flex gap-2'>
                  <CheckCircle2 size={16} className='text-green-500' /> Customer
                  Chat
                </li>
              </ul>
              <Button block size='large'>
                Join as Partner
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Mobile App CTA --- */}
      <section className='py-20'>
        <div className='container mx-auto px-4 md:px-6'>
          <div className='bg-[#5D4037] rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12'>
            <div className='flex-1 relative z-10 space-y-6 text-center md:text-left'>
              <h2 className='text-3xl md:text-5xl font-bold font-serif'>
                Design on the Go
              </h2>
              <p className='text-orange-100 text-lg max-w-md'>
                Download the ZAM ZAM app to design, visualize, and order cakes
                directly from your phone.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center md:justify-start'>
                <Button
                  size='large'
                  className='h-14 bg-black border-none text-white hover:bg-gray-900 rounded-xl flex items-center gap-3 px-6'
                >
                  <div className='text- left'>
                    <div className='text-[10px] uppercase text-gray-400 leading-none'>
                      Download on the
                    </div>
                    <div className='text-sm font-bold leading-none mt-1'>
                      App Store
                    </div>
                  </div>
                </Button>
                <Button
                  size='large'
                  className='h-14 bg-black border-none text-white hover:bg-gray-900 rounded-xl flex items-center gap-3 px-6'
                >
                  <div className='text-left'>
                    <div className='text-[10px] uppercase text-gray-400 leading-none'>
                      Get it on
                    </div>
                    <div className='text-sm font-bold leading-none mt-1'>
                      Google Play
                    </div>
                  </div>
                </Button>
              </div>
            </div>
            <div className='flex-1 relative z-10 flex justify-center'>
              <div className='w-64 h-[500px] border-[8px] border-black rounded-[40px] bg-white overflow-hidden shadow-2xl rotate-6'>
                <img
                  src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
                  className='w-full h-full object-cover'
                  alt='App Preview'
                />
              </div>
            </div>

            {/* Decorative Circles */}
            <div className='absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none'>
              <div className='absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2'></div>
              <div className='absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2'></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className='bg-white pt-20 pb-10 border-t border-gray-100'>
        <div className='container mx-auto px-4 md:px-6'>
          <div className='grid md:grid-cols-4 gap-12 mb-16'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center text-white'>
                  <Cake size={18} />
                </div>
                <span className='text-xl font-bold text-[#5D4037] font-serif'>
                  ZAM ZAM
                </span>
              </div>
              <p className='text-gray-500 text-sm leading-relaxed'>
                Making your dream celebrations come true, one slice at a time.
              </p>
              <div className='flex gap-4'>
                <Button
                  type='text'
                  shape='circle'
                  icon={<Instagram size={18} />}
                />
                <Button
                  type='text'
                  shape='circle'
                  icon={<Facebook size={18} />}
                />
                <Button
                  type='text'
                  shape='circle'
                  icon={<MessageSquare size={18} />}
                />
              </div>
            </div>

            <div>
              <h4 className='font-bold text-[#5D4037] mb-6'>Product</h4>
              <ul className='space-y-3 text-sm text-gray-500'>
                <li>
                  <a href='#' className='hover:text-[#D4AF37]'>
                    Design Cake
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#D4AF37]'>
                    AI Generator
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#D4AF37]'>
                    Pricing
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#D4AF37]'>
                    For Bakeries
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='font-bold text-[#5D4037] mb-6'>Company</h4>
              <ul className='space-y-3 text-sm text-gray-500'>
                <li>
                  <a href='#' className='hover:text-[#D4AF37]'>
                    About Us
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#D4AF37]'>
                    Careers
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#D4AF37]'>
                    Contact
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#D4AF37]'>
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='font-bold text-[#5D4037] mb-6'>Newsletter</h4>
              <p className='text-xs text-gray-400 mb-4'>
                Get sweet offers in your inbox.
              </p>
              <div className='flex gap-2'>
                <input
                  type='email'
                  placeholder='Email address'
                  className='bg-gray-50 px-4 py-2 rounded-lg text-sm outline-none border border-transparent focus:border-[#D4AF37] w-full'
                />
                <Button type='primary' className='bg-[#5D4037]'>
                  Go
                </Button>
              </div>
            </div>
          </div>

          <div className='border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400'>
            <p>&copy; 2024 ZAM ZAM Inc. All rights reserved.</p>
            <div className='flex gap-6 mt-4 md:mt-0'>
              <a href='#'>Terms</a>
              <a href='#'>Privacy</a>
              <a href='#'>Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
