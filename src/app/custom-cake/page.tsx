'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Stage,
  Center,
  Sphere,
  TorusKnot,
  Text,
  Extrude,
} from '@react-three/drei';
import { Tabs, Input, ConfigProvider } from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { Download } from 'lucide-react';
import Button from '@/components/common/Button';
export type SugarRoseProps = {
  position: [number, number, number];
  scale?: number;
};

const FLAVORS = [
  { name: 'Vanilla Cream', color: '#f9f5e7' },
  { name: 'Rich Chocolate', color: '#4b2c20' },
  { name: 'Fresh Strawberry', color: '#ffb7b7' },
  { name: 'Red Velvet', color: '#a70000' },
  { name: 'Lemon Zest', color: '#ffeb3b' },
  { name: 'Salted Caramel', color: '#e3c08d' },
];

const DECORATIONS_LIST = [
  { id: 'roses', name: 'Sugar Roses', price: 30 },
  { id: 'pearls', name: 'Edible Pearls', price: 15 },
  { id: 'gold', name: 'Gold Leaf', price: 45 },
  { id: 'berries', name: 'Fresh Berries', price: 20 },
  { id: 'macarons', name: 'Mini Macarons', price: 35 },
  { id: 'drip', name: 'Chocolate Drip', price: 25 },
];

const SugarRose = ({ position, scale = 1 }: SugarRoseProps) => (
  <group position={position} scale={scale}>
    <TorusKnot args={[0.1, 0.05, 128, 16, 2, 3]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color='#ffacc5' roughness={0.7} />
    </TorusKnot>
    <Sphere
      args={[0.12, 16, 16]}
      scale={[1.2, 0.5, 1.2]}
      position={[0, -0.05, 0]}
    >
      <meshStandardMaterial color='#ff92b1' roughness={0.8} />
    </Sphere>
  </group>
);

function ScreenshotBridge({
  onReady,
}: {
  onReady: (fn: () => string) => void;
}) {
  const { gl } = useThree();

  useEffect(() => {
    onReady(() => {
      // Just extract the buffer. gl.render here interrupts R3F's loop causing flickering.
      return gl.domElement.toDataURL('image/png');
    });
  }, [gl, onReady]);

  return null;
}

export default function CreateCakePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedShape, setSelectedShape] = useState('round');
  const [captureImage, setCaptureImage] = useState<null | (() => string)>(null);

  // Helper to safely store a function in state
  const handleSetCaptureImage = useCallback((fn: () => string) => {
    setCaptureImage(() => fn);
  }, []);

  const [layers, setLayers] = useState([
    { id: 'base-layer', color: '#4b2c20', name: 'Rich Chocolate' },
  ]);

  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

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

  const updateLayerColor = (
    id: string,
    flavor: { name: string; color: string }
  ) => {
    setLayers(
      layers.map((l) =>
        l.id === id ? { ...l, color: flavor.color, name: flavor.name } : l
      )
    );
  };

  const heartShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.4);
    s.bezierCurveTo(0.1, -0.45, 0.8, -0.1, 0.8, 0.4);
    s.bezierCurveTo(0.8, 0.9, 0.1, 1, 0, 0.5);
    s.bezierCurveTo(-0.1, 1, -0.8, 0.9, -0.8, 0.4);
    s.bezierCurveTo(-0.8, -0.1, -0.1, -0.45, 0, -0.4);
    return s;
  }, []);

  const totalPrice = useMemo(() => {
    const basePrice = 43;
    const layersPrice = (layers.length - 1) * 20;
    const decoPrice = selectedDecorations.reduce((sum, id) => {
      const deco = DECORATIONS_LIST.find((d) => d.id === id);
      return sum + (deco ? deco.price : 0);
    }, 0);
    return (
      basePrice +
      layersPrice +
      decoPrice +
      (inputValue.trim().length > 0 ? 10 : 0)
    );
  }, [layers, selectedDecorations, inputValue]);

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
        `Hi! I would like to order a Custom Cake.\n\n` +
        `*Cake Details:*\n` +
        `• Shape: ${selectedShape.charAt(0).toUpperCase() + selectedShape.slice(1)}\n` +
        `• Layers (${layers.length}):\n${layerDetails}\n` +
        `• Decorations: ${decoNames || 'None'}\n` +
        `• Text on Cake: ${inputValue.trim() || 'None'}\n\n` +
        `*Estimated Price:* $${totalPrice}`;
    } else {
      message = `Hi! I would like to order a custom cake. I have a reference image to share for a quote.`;
    }

    // 91 added for country code (India), assuming 10-digit number
    const whatsappUrl = `https://wa.me/917204094741?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
      {/* Header */}
      <header className='relative flex items-center justify-center px-6 py-4 bg-white border-b border-gray-100'>
        {/* Back Button */}
        <button
          onClick={() => router.push('/cake-library')}
          className='absolute left-4 z-50 p-2 rounded-full hover:bg-gray-100 transition'
        >
          <ArrowLeftOutlined className='text-xl hover:text-[#751414]' />
        </button>

        {/* Tabs */}
        <div className='w-full max-w-md pointer-events-auto'>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#7A2D2A',
                fontWeightStrong: 600,
              },
              components: {
                Tabs: {
                  itemActiveColor: '#7A2D2A',
                  itemHoverColor: '#923a3a',
                  itemSelectedColor: '#7A2D2A',
                  inkBarColor: '#7A2D2A',
                  titleFontSize: 16,
                },
              },
            }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              centered
              type='card'
              size='middle'
              tabBarStyle={{ marginBottom: 0 }}
              items={[
                {
                  key: 'upload',
                  label: (
                    <span style={{ fontWeight: 'bold' }}>Upload Reference</span>
                  ),
                },
                {
                  key: 'custom',
                  label: (
                    <span style={{ fontWeight: 'bold' }}>Build Custom</span>
                  ),
                },
              ]}
            />
          </ConfigProvider>
        </div>
      </header>

      <div className='bg-white shadow-xl overflow-hidden border border-[#D4AF37]/10'>
        {activeTab === 'upload' && (
          <div className='min-h-screen bg-[#FAFAFA] px-4 pt-6 '>
            {/* Description */}
            <p className='text-sm text-center text-gray-600 mb-6 leading-relaxed'>
              Upload a photo of your dream cake and tell us about your
              customization requests. We’ll get back to you with a quote.
            </p>

            {/* Upload box */}
            <div className='border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-white mb-5'>
              <p className='font-semibold text-gray-900 mb-2'>Upload Image</p>

              <p className='text-sm text-gray-500 mb-4'>
                Tap to upload an image of your cake design
              </p>

              <Button>Upload</Button>
            </div>

            {/* Textarea */}
            <textarea
              placeholder=' Tell us how you want this to be'
              className='w-full p-8 rounded-xl bg-[#FFF9F0] text-sm text-gray-900 border-2 border-gray-300'
              rows={4}
            />
            {/* Bottom fixed button */}
            <div className='fixed bottom-0 left-0 right-0 p-6 z-50'>
              <Button fullWidth>Get Quote</Button>
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div className='flex flex-col gap-6 p-4 md:p-8 bg-[#FAFAFA]'>
            {/* 1. Shape Selection */}
            <section className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
              <h2 className='text-xl font-bold mb-6 text-[#5D4037]'>
                1. Choose Shape
              </h2>
              <div className='grid grid-cols-3 gap-4'>
                {['round', 'square', 'heart'].map((shape) => (
                  <button
                    key={shape}
                    onClick={() => setSelectedShape(shape)}
                    className={`p-4 border-2 rounded-2xl capitalize font-bold transition-all flex flex-col items-center gap-3 ${selectedShape === shape ? 'border-[#C9A3A1] bg-[#F5E9E8] text-[#7A2D2A] shadow-md scale-105' : 'bg-white border-gray-100'}`}
                  >
                    <div
                      className={`w-6 h-6 ${selectedShape === shape ? 'bg-[#7A2D2A]' : 'bg-gray-200'} ${shape === 'round' ? 'rounded-full' : shape === 'heart' ? 'clip-heart' : 'rounded-sm'}`}
                    />
                    {shape}
                  </button>
                ))}
              </div>
            </section>

            {/* 2. Layers */}
            <section className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-[#5D4037]'>
                  2. Layers ({layers.length}/8)
                </h2>
                <Button onClick={addLayer} disabled={layers.length >= 8}>
                  + Add Layer
                </Button>
              </div>
              <div className='space-y-4'>
                {layers.map((layer, index) => (
                  <div
                    key={layer.id}
                    className='bg-gray-50 p-4 rounded-xl border border-gray-100'
                  >
                    <div className='flex justify-between mb-3'>
                      <span className='text-xs font-black text-gray-400 uppercase'>
                        Layer {index + 1}
                      </span>
                      {layers.length > 1 && (
                        <button
                          onClick={() =>
                            setLayers(layers.filter((l) => l.id !== layer.id))
                          }
                          className='text-red-400 text-[10px] font-bold uppercase cursor-pointer hover:text-red-600'
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className='grid grid-cols-3 md:grid-cols-6 gap-2'>
                      {FLAVORS.map((f) => (
                        <button
                          key={f.name}
                          onClick={() => updateLayerColor(layer.id, f)}
                          className={`flex flex-col items-center p-2 rounded-lg border-2 bg-white ${layer.color === f.color ? 'border-[#C9A3A1] bg-[#F5E9E8]' : 'border-transparent'}`}
                        >
                          <div
                            className='w-4 h-4 rounded-full mb-1 shadow-sm'
                            style={{ backgroundColor: f.color }}
                          />
                          <span className='text-[8px] font-bold uppercase'>
                            {f.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Decorations */}
            <section className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
              <h2 className='text-xl font-bold text-[#5D4037] mb-6'>
                3. Decorations
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {DECORATIONS_LIST.map((deco) => (
                  <button
                    key={deco.id}
                    onClick={() => toggleDecoration(deco.id)}
                    className={`flex justify-between items-center p-4 rounded-xl border-2 transition-all ${selectedDecorations.includes(deco.id) ? 'border-[#C9A3A1] bg-[#F5E9E8] text-[#7A2D2A]' : 'bg-gray-50 border-transparent'}`}
                  >
                    <span className='font-bold text-sm'>{deco.name}</span>
                    <span
                      className={`font-bold ${selectedDecorations.includes(deco.id) ? 'text-[#7A2D2A]' : 'text-gray-400'}`}
                    >
                      +${deco.price}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* 4. Text Topper */}
            <section className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
              <h2 className='text-xl font-bold text-[#5D4037] mb-6'>
                4. Text Topper
              </h2>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={20}
                className='w-full p-5 rounded-xl bg-[#FFF9F0] text-sm text-gray-900 border-2 border-gray-300'
                placeholder='E.g., "Happy Birthday Sarah!"'
                rows={2}
              />
            </section>

            {/* 5. PREVIEW SECTION */}
            <section className='bg-white p-6 rounded-3xl shadow-xl border border-gray-100'>
              <h2 className='text-xl font-bold text-[#5D4037] mb-6'>
                5. Your Cake
              </h2>
              <div className='h-125 w-full bg-[#fdfbf9] rounded-2xl overflow-hidden relative border border-orange-50'>
                <Canvas
                  shadows
                  camera={{ position: [8, 8, 8], fov: 35 }}
                  gl={{ preserveDrawingBuffer: true }}
                >
                  <ScreenshotBridge onReady={handleSetCaptureImage} />
                  <color attach='background' args={['#fdfbf9']} />
                  <Stage environment='city' intensity={0.5}>
                    <group position={[0, -1, 0]}>
                      {layers.map((layer, index) => {
                        const tierHeight = 0.5;
                        const yPos = index * tierHeight;
                        const scale = 1 - index * 0.12;
                        const isTopLayer = index === layers.length - 1;

                        return (
                          <group key={layer.id} position={[0, yPos, 0]}>
                            <mesh castShadow receiveShadow>
                              {selectedShape === 'round' && (
                                <cylinderGeometry
                                  args={[
                                    2.5 * scale,
                                    2.5 * scale,
                                    tierHeight,
                                    64,
                                  ]}
                                />
                              )}
                              {selectedShape === 'square' && (
                                <boxGeometry
                                  args={[4 * scale, tierHeight, 4 * scale]}
                                />
                              )}
                              {selectedShape === 'heart' && (
                                <Center top>
                                  <Extrude
                                    args={[
                                      heartShape,
                                      {
                                        depth: tierHeight,
                                        bevelEnabled: true,
                                        bevelThickness: 0.05,
                                        bevelSize: 0.02,
                                      },
                                    ]}
                                    rotation={[-Math.PI / 2, 0, 0]}
                                    scale={2.5 * scale}
                                  >
                                    <meshStandardMaterial
                                      color={layer.color}
                                      roughness={0.4}
                                    />
                                  </Extrude>
                                </Center>
                              )}
                              <meshStandardMaterial
                                color={layer.color}
                                roughness={0.5}
                              />
                            </mesh>

                            {isTopLayer && (
                              <group position={[0, tierHeight / 2 + 0.01, 0]}>
                                {selectedDecorations.includes('roses') && (
                                  <>
                                    <SugarRose
                                      position={[0, 0.1, 0]}
                                      scale={1.8}
                                    />
                                    <SugarRose
                                      position={[0.4, 0.05, 0.3]}
                                      scale={1.2}
                                    />
                                    <SugarRose
                                      position={[-0.4, 0.05, -0.3]}
                                      scale={1.2}
                                    />
                                  </>
                                )}
                                <Text
                                  fontSize={0.3 * scale}
                                  color='#f472b6'
                                  rotation={[-Math.PI / 2, 0, 0]}
                                  textAlign='center'
                                  maxWidth={4 * scale}
                                >
                                  {inputValue}
                                </Text>
                              </group>
                            )}

                            {selectedDecorations.includes('pearls') &&
                              Array.from({ length: 16 }).map((_, i) => (
                                <Sphere
                                  key={i}
                                  args={[0.06]}
                                  position={[
                                    Math.cos((i / 16) * Math.PI * 2) *
                                      (2.5 * scale),
                                    tierHeight / 2,
                                    Math.sin((i / 16) * Math.PI * 2) *
                                      (2.5 * scale),
                                  ]}
                                >
                                  <meshStandardMaterial
                                    color='white'
                                    metalness={0.9}
                                    roughness={0.1}
                                  />
                                </Sphere>
                              ))}
                          </group>
                        );
                      })}
                    </group>
                  </Stage>
                  <OrbitControls makeDefault />
                </Canvas>
              </div>
            </section>

            {/* ACTION BUTTONS */}
            <section className='py-12'>
              <div className='container mx-auto max-w-4xl flex justify-center items-center gap-4'>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#7A2D2A',
                      fontWeightStrong: 600,
                    },
                  }}
                >
                  <Button
                    size='large'
                    icon={<Download size={18} />}
                    onClick={handleDownload}
                  >
                    Download Design
                  </Button>
                </ConfigProvider>

                <div className='flex-1 md:flex-none flex gap-4 w-full md:w-auto'>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: '#25D366',
                        fontWeightStrong: 600,
                      },
                    }}
                  >
                    <Button onClick={handleOrderNow}>
                      <WhatsAppOutlined size={20} /> Order Now
                    </Button>
                  </ConfigProvider>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
