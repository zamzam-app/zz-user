'use client';

import { useState, useCallback, useRef } from 'react';
import { useImageUpload } from '@/lib/hooks/useImageUpload';
import { buildWhatsAppUrl, openWhatsAppUrl } from '@/lib/utils/whatsapp';
import {
  DECORATIONS_LIST,
  CustomCakeHeader,
  UploadReferenceTab,
  ShapeSelection,
  LayersSection,
  DecorationsSection,
  TextTopperSection,
  CakePreview3D,
  CustomCakeActions,
  Layer,
  Flavor,
} from '@/components/custom-cake';

export default function CreateCakePage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedShape, setSelectedShape] = useState('round');
  const [captureImage, setCaptureImage] = useState<null | (() => string)>(null);

  // Helper to safely store a function in state
  const handleSetCaptureImage = useCallback((fn: () => string) => {
    setCaptureImage(() => fn);
  }, []);

  const [layers, setLayers] = useState<Layer[]>([
    { id: 'base-layer', color: '#4b2c20', name: 'Rich Chocolate' },
  ]);

  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Upload tab: reference image and notes
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadNotes, setUploadNotes] = useState('');
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const {
    upload,
    loading: uploadLoading,
    error: uploadError,
  } = useImageUpload('custom-cake');

  const toggleDecoration = (id: string) => {
    setSelectedDecorations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addLayer = () => {
    if (layers.length < 8) {
      setLayers([
        ...layers,
        { id: `layer-${Date.now()}`, color: '#f9f5e7', name: 'Vanilla Cream' },
      ]);
    }
  };

  const removeLayer = (id: string) => {
    setLayers(layers.filter((l) => l.id !== id));
  };

  const updateLayerColor = (id: string, flavor: Flavor) => {
    setLayers(
      layers.map((l) =>
        l.id === id ? { ...l, color: flavor.color, name: flavor.name } : l
      )
    );
  };

  const handleOrderNow = () => {
    let message = '';

    if (activeTab === 'custom') {
      const layerDetails = layers
        .map((l, i) => `  - Layer ${i + 1}: ${l.name}`)
        .join('\n');
      const decoNames = selectedDecorations
        .map((id) => DECORATIONS_LIST.find((d) => d.id === id)?.name)
        .filter(Boolean)
        .join(', ');

      message =
        `*Cake Details:*\n` +
        `• Shape: ${selectedShape.charAt(0).toUpperCase() + selectedShape.slice(1)}\n` +
        `• Layers (${layers.length}):\n${layerDetails}\n` +
        `• Decorations: ${decoNames || 'None'}\n` +
        `• Text on Cake: ${inputValue.trim() || 'None'}\n\n`;
    } else {
      message = `without changing any changes in the existing image(especially preserve ZamZam's branding chips on top of the cake) except the customers request generate a product ready photo`;
    }

    const whatsappUrl = buildWhatsAppUrl('917204094741', message);
    openWhatsAppUrl(whatsappUrl);
  };

  const handleGetQuote = () => {
    let message = 'Hi! I would like to request a quote for a custom cake.\n\n';
    if (uploadNotes.trim()) {
      message += `*My requests:* ${uploadNotes.trim()}\n\n`;
    }
    if (uploadedImageUrl) {
      message += `*Reference image:* ${uploadedImageUrl}`;
    }
    const whatsappUrl = buildWhatsAppUrl('917204094741', message);
    openWhatsAppUrl(whatsappUrl);
  };

  const handleUploadClick = () => uploadInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload(file);
      setUploadedImageUrl(url);
    } catch {
      // error state is set in the hook
    }
    e.target.value = '';
  };

  const handleDownload = () => {
    if (!captureImage) return;

    const url = captureImage();

    const link = document.createElement('a');
    link.href = url;
    link.download = `custom-cake-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className='min-h-screen '>
      <CustomCakeHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className='bg-white shadow-xl overflow-hidden border border-[#D4AF37]/10'>
        {activeTab === 'upload' && (
          <UploadReferenceTab
            uploadedImageUrl={uploadedImageUrl}
            onUploadedImageChange={setUploadedImageUrl}
            uploadNotes={uploadNotes}
            onUploadNotesChange={setUploadNotes}
            uploadInputRef={uploadInputRef}
            uploadLoading={uploadLoading}
            uploadError={uploadError}
            onUploadClick={handleUploadClick}
            onFileChange={handleFileChange}
            onGetQuote={handleGetQuote}
          />
        )}

        {activeTab === 'custom' && (
          <div className='flex flex-col gap-6 p-4 md:p-8 bg-[#FAFAFA]'>
            <ShapeSelection
              selectedShape={selectedShape}
              onShapeChange={setSelectedShape}
            />

            <LayersSection
              layers={layers}
              onAddLayer={addLayer}
              onRemoveLayer={removeLayer}
              onUpdateLayerFlavor={updateLayerColor}
            />

            <DecorationsSection
              selectedDecorationIds={selectedDecorations}
              onToggleDecoration={toggleDecoration}
            />

            <TextTopperSection value={inputValue} onChange={setInputValue} />

            <CakePreview3D
              layers={layers}
              selectedShape={selectedShape}
              selectedDecorationIds={selectedDecorations}
              textTopper={inputValue}
              onCaptureReady={handleSetCaptureImage}
            />

            <CustomCakeActions
              onDownload={handleDownload}
              onOrderNow={handleOrderNow}
            />
          </div>
        )}
      </div>
    </div>
  );
}
