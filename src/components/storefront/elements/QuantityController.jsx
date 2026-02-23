export default function QuantityController({
  value,
  min = 1,
  max,
  unit,
  onChange,
  onRequestRemove,
  className = '',
}) {
  const atMin = value <= min;
  const atMax = max != null && value >= max;

  const handleDecrease = () => {
    if (atMin) {
      if (onRequestRemove) onRequestRemove();
      return;
    }
    onChange(value - 1);
  };

  const handleIncrease = () => {
    if (atMax) return;
    onChange(value + 1);
  };

  return (
    <div className={`relative ${className}`.trim()}>
      <div className="flex-row-center-center gap-2 bg-background rounded-md overflow-hidden">
        <button
          type="button"
          className="btn-stepper"
          onClick={handleDecrease}
          aria-label="減少數量"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-semibold text-default min-w-[2rem]">
          {value}
        </span>
        <button
          type="button"
          className="btn-stepper"
          onClick={handleIncrease}
          disabled={atMax}
          aria-label="增加數量"
        >
          +
        </button>
      </div>
      <div  className="absolute -bottom-6 left-0 w-full text-xs text-center">
        {atMax && max != null ? (
          <p className="text-error ">已達庫存上限</p> 
        ):(
          <p className="text-muted"> 庫存數 {max} {unit} </p>
        )}
      </div>
    </div>
  );
}
