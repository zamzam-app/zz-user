import { DECORATIONS_LIST } from './constants';

interface DecorationsSectionProps {
  selectedDecorationIds: string[];
  onToggleDecoration: (id: string) => void;
}

export const DecorationsSection = ({
  selectedDecorationIds,
  onToggleDecoration,
}: DecorationsSectionProps) => {
  return (
    <section className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
      <h2 className='text-xl font-bold text-[#5D4037] mb-6'>3. Decorations</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        {DECORATIONS_LIST.map((deco) => (
          <button
            key={deco.id}
            onClick={() => onToggleDecoration(deco.id)}
            className={`flex justify-between items-center p-4 rounded-xl border-2 transition-all ${selectedDecorationIds.includes(deco.id) ? 'border-[#C9A3A1] bg-[#F5E9E8] text-[#7A2D2A]' : 'bg-gray-50 border-transparent'}`}
          >
            <span className='font-bold text-sm'>{deco.name}</span>
            <span
              className={`font-bold ${selectedDecorationIds.includes(deco.id) ? 'text-[#7A2D2A]' : 'text-gray-400'}`}
            >
              +${deco.price}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
