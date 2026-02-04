'use client';

import { useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Stage,
  Center,
  Sphere,
  TorusKnot,
  Text,
  Extrude,
} from '@react-three/drei';
import { Tabs, Upload, Button, Input } from 'antd';
import {
  Upload as UploadIcon,
  Download,
  ShoppingBag,
  Cake as CakeIcon,
  ChevronLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const { Dragger } = Upload;
const { TextArea } = Input;

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

export default function CreateCakePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedShape, setSelectedShape] = useState('round');

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
    const params = new URLSearchParams();
    if (activeTab === 'custom') {
      params.append('type', 'custom');
      params.append('flavor', layers[0].name);
      params.append('shape', selectedShape);
      params.append('price', totalPrice.toString());
    } else {
      params.append('type', 'upload');
    }
    router.push(`/payment?${params.toString()}`);
  };

  return (
    <div className='min-h-screen bg-[#FFF8F0] pb-20'>
      {/* Header */}
      <header className='bg-white border-b border-gray-100 sticky top-0 z-10'>
        <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => router.back()}
              className='p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600'
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className='text-xl font-bold text-[#5D4037] font-serif'>
              Create Your Cake
            </h1>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        <div className='bg-white rounded-3xl shadow-xl overflow-hidden border border-[#D4AF37]/10'>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type='card'
            size='large'
            className='custom-tabs'
            items={[
              {
                key: 'upload',
                label: (
                  <span className='flex items-center gap-2 px-4 py-2'>
                    <UploadIcon size={18} /> Upload Reference
                  </span>
                ),
                children: (
                  <div className='p-8'>
                    <div className='text-center mb-8'>
                      <h2 className='text-2xl font-bold text-[#5D4037] mb-2'>
                        Have a design in mind?
                      </h2>
                      <p className='text-gray-500'>
                        Upload a picture from Pinterest, Instagram, or your
                        sketches.
                      </p>
                    </div>

                    <div className='max-w-xl mx-auto'>
                      <Dragger
                        name='file'
                        multiple={false}
                        action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                        className='bg-gray-50 border-2 border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-3xl p-10'
                      >
                        <div className='ant-upload-drag-icon flex justify-center mb-4'>
                          <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-[#D4AF37]'>
                            <UploadIcon size={32} />
                          </div>
                        </div>
                        <p className='ant-upload-text text-lg font-medium text-gray-700'>
                          Click or drag file to this area to upload
                        </p>
                        <p className='ant-upload-hint text-gray-400 mt-2'>
                          Support for multiple images for reference.
                        </p>
                      </Dragger>

                      <div className='mt-8'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Additional Notes
                        </label>
                        <TextArea
                          rows={4}
                          placeholder='Any specific instructions about colors, flavors, or dietary restrictions?'
                        />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'custom',
                label: (
                  <span className='flex items-center gap-2 px-4 py-2'>
                    <CakeIcon size={18} /> Build Custom
                  </span>
                ),
                children: (
                  <div className='flex flex-col gap-6 p-4 md:p-8 bg-[#fffcf9]'>
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
                            className={`p-4 border-2 rounded-2xl capitalize font-bold transition-all flex flex-col items-center gap-3 ${selectedShape === shape ? 'border-pink-300 bg-pink-50 text-pink-600 shadow-md scale-105' : 'bg-white border-gray-100'}`}
                          >
                            <div
                              className={`w-6 h-6 ${selectedShape === shape ? 'bg-pink-400' : 'bg-gray-200'} ${shape === 'round' ? 'rounded-full' : shape === 'heart' ? 'clip-heart' : 'rounded-sm'}`}
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
                        <Button
                          type='primary'
                          className='bg-pink-500'
                          onClick={addLayer}
                          disabled={layers.length >= 8}
                        >
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
                                    setLayers(
                                      layers.filter((l) => l.id !== layer.id)
                                    )
                                  }
                                  className='text-red-400 text-[10px] font-bold uppercase'
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
                                  className={`flex flex-col items-center p-2 rounded-lg border-2 bg-white ${layer.color === f.color ? 'border-pink-400 bg-pink-50' : 'border-transparent'}`}
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
                            className={`flex justify-between items-center p-4 rounded-xl border-2 transition-all ${selectedDecorations.includes(deco.id) ? 'border-pink-300 bg-pink-50 text-pink-700' : 'bg-gray-50 border-transparent'}`}
                          >
                            <span className='font-bold text-sm'>
                              {deco.name}
                            </span>
                            <span
                              className={`font-bold ${selectedDecorations.includes(deco.id) ? 'text-pink-600' : 'text-gray-400'}`}
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
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        maxLength={20}
                        className='rounded-xl h-12 bg-gray-50 border-gray-100'
                        placeholder='Happy Birthday'
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
                        >
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
                                          args={[
                                            4 * scale,
                                            tierHeight,
                                            4 * scale,
                                          ]}
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
                                      <group
                                        position={[0, tierHeight / 2 + 0.01, 0]}
                                      >
                                        {selectedDecorations.includes(
                                          'roses'
                                        ) && (
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
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Action Bar */}
        <div className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20'>
          <div className='container mx-auto max-w-4xl flex justify-between items-center gap-4'>
            <Button
              size='large'
              icon={<Download size={18} />}
              className='hidden md:flex'
            >
              Download Design
            </Button>
            <div className='flex-1 md:flex-none flex gap-4 w-full md:w-auto'>
              <Button
                size='large'
                type='primary'
                block
                className='bg-[#5D4037] hover:bg-[#4a322c] h-12 text-lg shadow-lg shadow-orange-900/10 flex items-center justify-center gap-2'
                onClick={handleOrderNow}
              >
                <ShoppingBag size={20} /> Order Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
