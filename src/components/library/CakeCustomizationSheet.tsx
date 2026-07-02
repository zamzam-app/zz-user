import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CloseOutlined, StarOutlined } from '@ant-design/icons';
import { Product } from '@/types/product';
import { CakeCustomizationOption } from '@/types/customization';
import { customizationApi } from '@/lib/services/api/customization.api';
import { CakeUserDetailsModal } from '@/components/cake/CakeUserDetailsModal';
import { CakeVisualiserModal } from '@/components/custom-cake/CakeVisualiserModal';
import {
  buildWhatsAppUrl,
  getWhatsAppPhoneNumber,
  openWhatsAppUrl,
} from '@/lib/utils/whatsapp';

interface CakeCustomizationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cake: Product | null;
}

export function CakeCustomizationSheet({
  isOpen,
  onClose,
  cake,
}: CakeCustomizationSheetProps) {
  const [optionsData, setOptionsData] = useState<{
    shapes: CakeCustomizationOption[];
    flavors: CakeCustomizationOption[];
    decorations: CakeCustomizationOption[];
  }>({ shapes: [], flavors: [], decorations: [] });
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // State
  const [selectedWeightIndex, setSelectedWeightIndex] = useState<number>(0);
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
  const [cakeText, setCakeText] = useState('');
  const [additionalRequests, setAdditionalRequests] = useState('');

  // Modals
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isVisualiserOpen, setIsVisualiserOpen] = useState(false);

  // Reset when a new cake opens
  useEffect(() => {
    if (isOpen && cake) {
      setSelectedWeightIndex(0);
      setSelectedShape('');
      setSelectedFlavor('');
      setSelectedDecorations([]);
      setCakeText('');
      setAdditionalRequests('');
    }
  }, [isOpen, cake]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const res = await customizationApi.getAll([
          'shape',
          'flavor',
          'decoration',
        ]);
        if (res?.data) {
          setOptionsData({
            shapes: res.data.filter((o) => o.type === 'shape'),
            flavors: res.data.filter((o) => o.type === 'flavor'),
            decorations: res.data.filter((o) => o.type === 'decoration'),
          });
        }
      } catch (err) {
        console.error('Failed to fetch customization options:', err);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [isOpen]);

  if (!isOpen || !cake) return null;

  const imageUrl = cake.images?.[0];

  // Pricing calculations
  const weightRow = cake.pricing?.[selectedWeightIndex];
  const basePrice = weightRow?.amount || cake.price || 0;

  const selectedShapeOption = optionsData.shapes.find(
    (s) => s.name === selectedShape
  );
  const shapePrice = selectedShapeOption?.price || 0;

  const selectedFlavorOption = optionsData.flavors.find(
    (f) => f.name === selectedFlavor
  );
  const flavorPrice = selectedFlavorOption?.price || 0;

  const decorationsPrice = selectedDecorations.reduce((total, decName) => {
    const decOption = optionsData.decorations.find((d) => d.name === decName);
    return total + (decOption?.price || 0);
  }, 0);

  const totalPrice = basePrice + shapePrice + flavorPrice + decorationsPrice;

  const handleOrder = () => {
    const weightLabel = weightRow
      ? `${weightRow.quantityValue} ${weightRow.quantityUnit}`
      : 'Default';
    const message =
      `Hi! I would like to order a Cake.\n\n` +
      `*Cake Details:*\n` +
      `• Name: ${cake.name}\n` +
      `• Weight: ${weightLabel}\n` +
      `• Flavour: ${selectedFlavor.trim() || 'None'}\n` +
      `• Shape: ${selectedShape ? selectedShape.charAt(0).toUpperCase() + selectedShape.slice(1) : 'None'}\n` +
      `• Decorations: ${selectedDecorations.join(', ') || 'None'}\n` +
      `• Cake Text: ${cakeText.trim() || 'None'}\n` +
      `• Additional requests: ${additionalRequests.trim() || 'None'}\n` +
      `• Total Price: ₹${totalPrice}\n`;

    const finalMessage = imageUrl
      ? `${message}\nReference image: ${imageUrl}`
      : message;
    const whatsappUrl = buildWhatsAppUrl(
      getWhatsAppPhoneNumber(),
      finalMessage
    );
    openWhatsAppUrl(whatsappUrl);
  };

  const toggleDecoration = (item: string) => {
    setSelectedDecorations((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  // Check if required fields are filled (assuming weight and flavor are required as per prompt)
  const hasPricing = cake.pricing && cake.pricing.length > 0;
  const isWeightSelected = hasPricing ? selectedWeightIndex >= 0 : true;
  const isFlavorSelected = selectedFlavor !== '';
  const isFormValid = isWeightSelected && isFlavorSelected;

  return (
    <>
      <div
        className='fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-all duration-300'
        role='dialog'
        aria-modal='true'
        onClick={onClose}
      >
        <div
          className='relative w-full bg-white rounded-t-3xl overflow-hidden shadow-2xl h-[92vh] flex flex-col'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='shrink-0 flex items-center justify-between p-4 border-b border-gray-100 bg-white'>
            <div className='flex items-center gap-3'>
              {imageUrl && (
                <div className='relative w-12 h-12 rounded-full overflow-hidden border border-gray-200'>
                  <Image
                    src={imageUrl}
                    alt={cake.name}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <h3 className="font-['Epilogue'] font-bold text-gray-900 text-lg truncate max-w-[200px]">
                {cake.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className='p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors'
            >
              <CloseOutlined />
            </button>
          </div>

          {/* Content */}
          <div className='p-6 overflow-y-auto flex-1 min-h-0 space-y-8 bg-gray-50/50 pb-32'>
            {/* Section 1: Choose Weight */}
            {cake.pricing && cake.pricing.length > 0 && (
              <div className='space-y-4'>
                <h4 className="font-['Epilogue'] font-bold text-[#0D141C] text-lg flex justify-between">
                  <span>
                    Choose Weight{' '}
                    <span className='text-red-500 text-sm'>*</span>
                  </span>
                  <span className='text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                    REQUIRED
                  </span>
                </h4>
                <div className='space-y-0 bg-white rounded-2xl border border-gray-200 overflow-hidden'>
                  {cake.pricing.map((row, index) => {
                    const isSelected = selectedWeightIndex === index;
                    return (
                      <label
                        key={index}
                        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${index !== cake.pricing.length - 1 ? 'border-b border-gray-100' : ''} ${isSelected ? 'bg-red-50/30' : 'hover:bg-gray-50'}`}
                      >
                        <div className='flex items-center gap-3'>
                          <input
                            type='radio'
                            name='cake-weight'
                            checked={isSelected}
                            onChange={() => setSelectedWeightIndex(index)}
                            className='w-5 h-5 accent-[#923a3a]'
                          />
                          <span
                            className={`font-['Epilogue'] text-base ${isSelected ? 'font-semibold text-gray-900' : 'text-gray-700'}`}
                          >
                            {row.quantityValue} {row.quantityUnit}
                          </span>
                        </div>
                        <span className="font-['Epilogue'] text-base font-medium text-gray-900">
                          ₹{row.amount}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Loading State for options */}
            {isLoadingOptions && (
              <div className='py-8 flex justify-center'>
                <div className='w-8 h-8 border-4 border-[#923a3a]/20 border-t-[#923a3a] rounded-full animate-spin' />
              </div>
            )}

            {/* Section 2: Choose Flavour */}
            {!isLoadingOptions && optionsData.flavors.length > 0 && (
              <div className='space-y-4'>
                <h4 className="font-['Epilogue'] font-bold text-[#0D141C] text-lg flex justify-between">
                  <span>
                    Choose Flavour{' '}
                    <span className='text-red-500 text-sm'>*</span>
                  </span>
                  <span className='text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                    REQUIRED
                  </span>
                </h4>
                <div className='space-y-0 bg-white rounded-2xl border border-gray-200 overflow-hidden'>
                  {optionsData.flavors.map((flavorOpt, index) => {
                    const isSelected = selectedFlavor === flavorOpt.name;
                    return (
                      <label
                        key={flavorOpt._id || flavorOpt.name}
                        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${index !== optionsData.flavors.length - 1 ? 'border-b border-gray-100' : ''} ${isSelected ? 'bg-red-50/30' : 'hover:bg-gray-50'}`}
                      >
                        <div className='flex items-center gap-3'>
                          <input
                            type='radio'
                            name='cake-flavor'
                            checked={isSelected}
                            onChange={() => setSelectedFlavor(flavorOpt.name)}
                            className='w-5 h-5 accent-[#923a3a]'
                          />
                          <span
                            className={`font-['Epilogue'] text-base ${isSelected ? 'font-semibold text-gray-900' : 'text-gray-700'}`}
                          >
                            {flavorOpt.name}
                          </span>
                        </div>
                        {flavorOpt.price > 0 && (
                          <span className="font-['Epilogue'] text-sm text-gray-500">
                            + ₹{flavorOpt.price}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 3: Cake Shape */}
            {!isLoadingOptions && optionsData.shapes.length > 0 && (
              <div className='space-y-4'>
                <h4 className="font-['Epilogue'] font-bold text-[#0D141C] text-lg flex justify-between">
                  <span>Cake Shape</span>
                  <span className='text-xs font-normal text-gray-400'>
                    OPTIONAL
                  </span>
                </h4>
                <div className='space-y-0 bg-white rounded-2xl border border-gray-200 overflow-hidden'>
                  {optionsData.shapes.map((shapeOpt, index) => {
                    const isSelected = selectedShape === shapeOpt.name;
                    return (
                      <label
                        key={shapeOpt._id || shapeOpt.name}
                        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${index !== optionsData.shapes.length - 1 ? 'border-b border-gray-100' : ''} ${isSelected ? 'bg-red-50/30' : 'hover:bg-gray-50'}`}
                      >
                        <div className='flex items-center gap-3'>
                          <input
                            type='radio'
                            name='cake-shape'
                            checked={isSelected}
                            onChange={() => setSelectedShape(shapeOpt.name)}
                            onClick={(e) => {
                              // Allow deselection for optional fields
                              if (isSelected) {
                                e.preventDefault();
                                setSelectedShape('');
                              }
                            }}
                            className='w-5 h-5 accent-[#923a3a]'
                          />
                          <span
                            className={`font-['Epilogue'] text-base ${isSelected ? 'font-semibold text-gray-900' : 'text-gray-700'}`}
                          >
                            {shapeOpt.name}
                          </span>
                        </div>
                        {shapeOpt.price > 0 && (
                          <span className="font-['Epilogue'] text-sm text-gray-500">
                            + ₹{shapeOpt.price}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 4: Decorations */}
            {!isLoadingOptions && optionsData.decorations.length > 0 && (
              <div className='space-y-4'>
                <h4 className="font-['Epilogue'] font-bold text-[#0D141C] text-lg flex justify-between">
                  <span>Decorations</span>
                  <span className='text-xs font-normal text-gray-400'>
                    OPTIONAL
                  </span>
                </h4>
                <div className='space-y-0 bg-white rounded-2xl border border-gray-200 overflow-hidden'>
                  {optionsData.decorations.map((decorationOpt, index) => {
                    const isSelected = selectedDecorations.includes(
                      decorationOpt.name
                    );
                    return (
                      <label
                        key={decorationOpt._id || decorationOpt.name}
                        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${index !== optionsData.decorations.length - 1 ? 'border-b border-gray-100' : ''} ${isSelected ? 'bg-red-50/30' : 'hover:bg-gray-50'}`}
                      >
                        <div className='flex items-center gap-3'>
                          <input
                            type='checkbox'
                            checked={isSelected}
                            onChange={() =>
                              toggleDecoration(decorationOpt.name)
                            }
                            className='w-5 h-5 accent-[#923a3a] rounded border-gray-300'
                          />
                          <span
                            className={`font-['Epilogue'] text-base ${isSelected ? 'font-semibold text-gray-900' : 'text-gray-700'}`}
                          >
                            {decorationOpt.name}
                          </span>
                        </div>
                        {decorationOpt.price > 0 && (
                          <span className="font-['Epilogue'] text-sm text-gray-500">
                            + ₹{decorationOpt.price}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className='space-y-4 pt-4 border-t border-gray-200'>
              <div className='space-y-2'>
                <label className="block font-['Epilogue'] font-bold text-[#0D141C]">
                  Cake Text
                </label>
                <input
                  type='text'
                  placeholder='Happy Birthday John!'
                  value={cakeText}
                  onChange={(e) => setCakeText(e.target.value)}
                  className='w-full p-4 rounded-xl bg-white border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-[#923a3a]/20'
                />
              </div>
              <div className='space-y-2'>
                <label className="block font-['Epilogue'] font-bold text-[#0D141C]">
                  Additional Requests
                </label>
                <textarea
                  rows={3}
                  placeholder='e.g., less sugar, specific color palette...'
                  value={additionalRequests}
                  onChange={(e) => setAdditionalRequests(e.target.value)}
                  className='w-full p-4 rounded-xl bg-white border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-[#923a3a]/20 resize-none'
                />
              </div>
            </div>
          </div>

          {/* Sticky Footer CTA */}
          <div className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-[calc(1rem+env(safe-area-inset-bottom))]'>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => setIsUserDetailsOpen(true)}
                disabled={!isFormValid}
                className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl border border-[#923a3a] transition-all ${
                  isFormValid
                    ? 'bg-[#fdfcfb] text-[#923a3a] active:scale-[0.98]'
                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="font-['Epilogue'] font-bold flex items-center gap-2">
                  <StarOutlined /> Visualise
                </span>
              </button>

              <button
                onClick={handleOrder}
                disabled={!isFormValid}
                className={`flex-[2] flex items-center justify-between px-5 py-3 rounded-2xl transition-transform shadow-md ${
                  isFormValid
                    ? 'bg-[linear-gradient(135deg,#923a3a_0%,#6d2020_100%)] text-white! active:scale-[0.98]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <div className='flex flex-col items-start'>
                  <span className='text-xs opacity-80 uppercase tracking-wider font-semibold'>
                    Total
                  </span>
                  <span className="font-['Epilogue'] font-bold text-lg">
                    ₹{totalPrice}
                  </span>
                </div>
                <div className="flex items-center font-['Epilogue'] font-bold text-base">
                  Order on
                  <Image
                    src='/zz-logo.png'
                    alt='Zam Zam Logo'
                    width={60}
                    height={60}
                    className='object-contain rounded'
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CakeUserDetailsModal
        isOpen={isUserDetailsOpen}
        onClose={() => setIsUserDetailsOpen(false)}
        onConfirm={() => {
          setIsUserDetailsOpen(false);
          setIsVisualiserOpen(true);
        }}
      />

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
        basePrice={basePrice}
        shapePrice={shapePrice}
        flavorPrice={flavorPrice}
        decorationsPrice={decorationsPrice}
        totalPrice={totalPrice}
      />
    </>
  );
}
