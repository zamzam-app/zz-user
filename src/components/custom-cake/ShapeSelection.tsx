interface ShapeSelectionProps {
  selectedShape: string;
  onShapeChange: (shape: string) => void;
}

export const ShapeSelection = ({
  selectedShape,
  onShapeChange,
}: ShapeSelectionProps) => {
  return (
    <section className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
      <h2 className='text-xl font-bold mb-6 text-[#5D4037]'>1. Choose Shape</h2>
      <div className='grid grid-cols-3 gap-4'>
        {['round', 'square', 'heart'].map((shape) => (
          <button
            key={shape}
            onClick={() => onShapeChange(shape)}
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
  );
};
