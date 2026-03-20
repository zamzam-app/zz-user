interface TextTopperSectionProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export const TextTopperSection = ({
  value,
  onChange,
  maxLength = 20,
}: TextTopperSectionProps) => {
  return (
    <section className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
      <h2 className='text-xl font-bold text-[#5D4037] mb-6'>4. Text Topper</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className='w-full p-5 rounded-xl bg-[#FFF9F0] text-base text-gray-900 border-2 border-gray-300'
        placeholder='E.g., "Happy Birthday Sarah!"'
        rows={2}
      />
    </section>
  );
};
