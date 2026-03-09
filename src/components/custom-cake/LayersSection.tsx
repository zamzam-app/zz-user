import Button from '@/components/common/Button';
import { Layer, Flavor } from './types';
import { FLAVORS } from './constants';

interface LayersSectionProps {
  layers: Layer[];
  onAddLayer: () => void;
  onRemoveLayer: (id: string) => void;
  onUpdateLayerFlavor: (id: string, flavor: Flavor) => void;
  maxLayers?: number;
}

export const LayersSection = ({
  layers,
  onAddLayer,
  onRemoveLayer,
  onUpdateLayerFlavor,
  maxLayers = 8,
}: LayersSectionProps) => {
  return (
    <section className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-bold text-[#5D4037]'>
          2. Layers ({layers.length}/{maxLayers})
        </h2>
        <Button onClick={onAddLayer} disabled={layers.length >= maxLayers}>
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
                  onClick={() => onRemoveLayer(layer.id)}
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
                  onClick={() => onUpdateLayerFlavor(layer.id, f)}
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
  );
};
