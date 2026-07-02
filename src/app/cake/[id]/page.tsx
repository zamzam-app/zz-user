'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftOutlined, StarOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { productApi } from '@/lib/services/api/product.api';
import { Product } from '@/types/product';
import { CakeVisualiserModal } from '@/components/custom-cake/CakeVisualiserModal';
import { CakeUserDetailsModal } from '@/components/cake/CakeUserDetailsModal';
import { customizationApi } from '@/lib/services/api/customization.api';
import { CakeCustomizationOption } from '@/types/customization';
import {
  buildWhatsAppUrl,
  getWhatsAppPhoneNumber,
  openWhatsAppUrl,
} from '@/lib/utils/whatsapp';

export default function CustomizeCakePage() {
  const { id } = useParams<{ id: string }>();
  const [cake, setCake] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [optionsData, setOptionsData] = useState<{
    shapes: CakeCustomizationOption[];
    flavors: CakeCustomizationOption[];
    decorations: CakeCustomizationOption[];
  }>({ shapes: [], flavors: [], decorations: [] });

  const [selectedShape, setSelectedShape] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
  const [cakeText, setCakeText] = useState('');
  const [additionalRequests, setAdditionalRequests] = useState('');
  const [isVisualiserOpen, setIsVisualiserOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const [res, optionsRes] = await Promise.all([
          productApi.getById(id as string),
          customizationApi.getAll(['shape', 'flavor', 'decoration']).catch(() => null)
        ]);

        let product: Product | null = null;
        if (res) {
          if (Array.isArray(res.data) && res.data.length > 0) {
            product = res.data[0];
          } else if (typeof res === 'object' && '_id' in res && 'name' in res) {
            product = res as unknown as Product;
          }
        }

        if (product?._id && product.name) {
          setCake(product);
        } else {
          setError(true);
        }

        if (optionsRes?.data) {
          setOptionsData({
            shapes: optionsRes.data.filter((o) => o.type === 'shape'),
            flavors: optionsRes.data.filter((o) => o.type === 'flavor'),
            decorations: optionsRes.data.filter((o) => o.type === 'decoration'),
          });
        }
      } catch {
        setError(true);
        setCake(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleDecoration = (item: string) => {
    setSelectedDecorations((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleGetQuote = () => {
    if (!cake) return;

    const message =
      `Hi! I would like to order a Cake.\n\n` +
      `*Cake Details:*\n` +
      `• Name: ${cake.name}\n` +
      `• Cake Text: ${cakeText.trim() || 'None'}\n` +
      `• Shape: ${selectedShape ? selectedShape.charAt(0).toUpperCase() + selectedShape.slice(1) : 'None'}\n` +
      `• Flavour: ${selectedFlavor.trim() || 'None'}\n` +
      `• Decorations: ${selectedDecorations.join(', ') || 'None'}\n` +
      `• Additional requests: ${additionalRequests.trim() || 'None'}\n`;
    const imageUrl = cake.images?.[0];
    const finalMessage = imageUrl
      ? `${message}\nReference image: ${imageUrl}`
      : message;

    const whatsappUrl = buildWhatsAppUrl(
      getWhatsAppPhoneNumber(),
      finalMessage
    );
    openWhatsAppUrl(whatsappUrl);
  };

  if (loading) {
    return (
      <div className='bg-white min-h-screen flex items-center justify-center'>
        <div className='text-gray-500 font-[Epilogue]'>Loading...</div>
      </div>
    );
  }

  if (error || !cake) {
    return (
      <div className='bg-white min-h-screen flex items-center justify-center'>
        <div className='p-10 text-center'>Cake not found</div>
      </div>
    );
  }

  const imageUrl = cake.images?.[0];

  // Base price calculation
  const basePrice = cake?.price || (cake?.pricing?.[0]?.amount ?? 0);
  const selectedShapeOption = optionsData.shapes.find(s => s.name === selectedShape);
  const shapePrice = selectedShapeOption?.price || 0;
  
  const selectedFlavorOption = optionsData.flavors.find(f => f.name === selectedFlavor);
  const flavorPrice = selectedFlavorOption?.price || 0;
  
  const decorationsPrice = selectedDecorations.reduce((total, decName) => {
    const decOption = optionsData.decorations.find(d => d.name === decName);
    return total + (decOption?.price || 0);
  }, 0);
  
  const totalPrice = basePrice + shapePrice + flavorPrice + decorationsPrice;

  const hasCustomizations =
    selectedShape !== '' ||
    selectedFlavor !== '' ||
    selectedDecorations.length > 0 ||
    cakeText.trim() !== '' ||
    additionalRequests.trim() !== '';

  return (
    <div className='bg-white min-h-screen pb-32'>
      {/* Header */}
      <header className='relative flex items-center px-6 py-4'>
        <Link href='/cake-library'>
          <ArrowLeftOutlined className='text-xl text-black!' />
        </Link>

        <h1 className="flex-1 font-['Epilogue'] font-extrabold tracking-tight text-gray-900 sm:text-xl md:text-2xl lg:text-3xl text-center translate-y-1 md:translate-y-2">
          Customize Cake
        </h1>
      </header>

      <main className='px-6 space-y-6'>
        {/* Product Image */}
        {imageUrl && (
          <div className='relative w-full aspect-16/10 rounded-2xl overflow-hidden shadow-sm'>
            <Image
              src={imageUrl}
              alt={cake.name}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          </div>
        )}

        {/* Product name and description */}
        <div>
          <h2 className="font-['Epilogue'] font-bold text-lg text-[#0D141C]">
            {cake.name}
          </h2>
          {cake.description && <p className='text-sm'>{cake.description}</p>}
        </div>

        {/* Cake Text */}
        <div className='space-y-2'>
          <label className="block font-['Epilogue'] font-bold text-[#0D141C]">
            Cake Text
          </label>
          <input
            type='text'
            placeholder='Add text for your cake'
            value={cakeText}
            onChange={(e) => setCakeText(e.target.value)}
            className='w-full p-4 rounded-xl bg-[#FDFCFB] border border-[#E8EDF2] text-base focus:outline-none resize-none'
          />
        </div>

        {/* Shape */}
        <div className='space-y-2'>
          <label className="block font-['Epilogue'] font-bold text-[#0D141C]">
            Shape
          </label>
          <div className='flex flex-wrap gap-4'>
            {optionsData.shapes.map((shapeOpt) => (
              <div key={shapeOpt._id || shapeOpt.name} className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedShape(shapeOpt.name)}
                  className={`px-5 py-2 rounded-xl font-['Epilogue'] text-sm font-medium border transition-all ${
                    selectedShape === shapeOpt.name
                      ? 'bg-[#923a3a] text-white! border-[#751414]'
                      : 'bg-[#FDFCFB] text-black border-[#E8EDF2]'
                  }`}
                >
                  {shapeOpt.name}
                </button>
                {shapeOpt.price > 0 && (
                  <span className="text-sm text-gray-500 font-['Epilogue'] font-medium">
                    + ₹{shapeOpt.price}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Flavor */}
        <div className='space-y-2'>
          <label className="block font-['Epilogue'] font-bold text-[#0D141C]">
            Flavor
          </label>
          <div className='flex flex-wrap gap-4'>
            {optionsData.flavors.map((flavorOpt) => (
              <div key={flavorOpt._id || flavorOpt.name} className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFlavor(flavorOpt.name)}
                  className={`px-5 py-2 rounded-xl font-['Epilogue'] text-sm font-medium border transition-all ${
                    selectedFlavor === flavorOpt.name
                      ? 'bg-[#923a3a] text-white! border-[#751414]'
                      : 'bg-[#FDFCFB] text-black border-[#E8EDF2]'
                  }`}
                >
                  {flavorOpt.name}
                </button>
                {flavorOpt.price > 0 && (
                  <span className="text-sm text-gray-500 font-['Epilogue'] font-medium">
                    + ₹{flavorOpt.price}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Decoration */}
        <div className='space-y-3'>
          <label className="block font-['Epilogue'] font-bold text-[#0D141C]">
            Decoration
          </label>

          <div className='space-y-3'>
            {optionsData.decorations.map((decorationOpt) => (
              <label
                key={decorationOpt._id || decorationOpt.name}
                className='flex items-center justify-between cursor-pointer group'
              >
                <div className='flex items-center gap-3'>
                  <input
                    type='checkbox'
                    checked={selectedDecorations.includes(decorationOpt.name)}
                    onChange={() => toggleDecoration(decorationOpt.name)}
                    className='w-5 h-5 accent-[#923a3a] rounded border-gray-300'
                  />
                  <span className="font-['Epilogue'] text-sm font-medium text-[#0D141C]">
                    {decorationOpt.name}
                  </span>
                </div>
                {decorationOpt.price > 0 && (
                  <span className="font-['Epilogue'] text-sm text-gray-500">
                    + ₹{decorationOpt.price}
                  </span>
                )}
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
            value={additionalRequests}
            onChange={(e) => setAdditionalRequests(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#FDFCFB] border border-[#E8EDF2] font-['Epilogue'] text-base focus:outline-none resize-none"
          />
        </div>
      </main>

      {/* Bottom Button */}
      <div className='fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur border-t border-gray-100 z-40 flex flex-col md:flex-row gap-4'>
        <button
          onClick={handleGetQuote}
          className="w-full md:w-1/3 bg-[#fdfcfb] text-[#923a3a] border border-[#923a3a] py-4 rounded-2xl font-['Epilogue'] font-bold text-lg active:scale-[0.98] transition-transform shadow-sm flex items-center justify-center"
        >
          <span className='ml-4'>Order on</span>
          <Image
            src='/zz-logo.png'
            alt='Zam Zam Logo'
            width={60}
            height={60}
            className='-ml-3 object-contain'
          />
          {totalPrice > 0 && <span className="ml-1">• ₹{totalPrice}</span>}
        </button>
        <button
          onClick={() => setIsUserDetailsOpen(true)}
          disabled={!hasCustomizations}
          className={`flex-1 py-4 rounded-2xl font-['Epilogue'] font-bold text-lg transition-transform shadow-md flex items-center justify-center gap-2 ${
            hasCustomizations
              ? 'bg-[linear-gradient(135deg,#923a3a_0%,#6d2020_100%)] text-white! active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          <StarOutlined />
          Visualise
        </button>
      </div>

      {/* User details gate modal */}
      <CakeUserDetailsModal
        isOpen={isUserDetailsOpen}
        onClose={() => setIsUserDetailsOpen(false)}
        onConfirm={() => {
          setIsUserDetailsOpen(false);
          setIsVisualiserOpen(true);
        }}
      />
      {/* Visualiser Modal */}
      <CakeVisualiserModal
        isOpen={isVisualiserOpen}
        onClose={() => setIsVisualiserOpen(false)}
        cakeName={cake.name}
        shape={selectedShape}
        flavor={selectedFlavor}
        decorations={selectedDecorations}
        additionalRequests={additionalRequests}
        cakeText={cakeText}
        baseImageUrl={imageUrl}
      />
    </div>
  );
}
