interface QuantitySelectorProps {
  label: string;
  description: string;
  count: number;
  onChange: (value: number) => void;
}

export default function QuantitySelector({
  label,
  description,
  count,
  onChange,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (count > 0) {
      onChange(count - 1);
    }
  };

  const handleIncrement = () => {
    onChange(count + 1);
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col ml-3 py-1">
        <p className="text-md text-primary-900">{label}</p>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
      <div className="flex items-center space-x-2 mr-3">
        <button
          onClick={handleDecrement}
          className="text-lg font-light text-gray-400 hover:text-gray-600 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Decrement ${label}`}
          disabled={count === 0}
        >
          &minus;
        </button>
        <span className="text-lg text-gray-800 text-center">{count}</span>
        <button
          onClick={handleIncrement}
          className="text-lg font-light text-cyan-500 hover:text-cyan-700 focus:outline-none transition-colors"
          aria-label={`Increment ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
