"use client";

interface PricingSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}

export default function PricingSlider({
  label,
  value,
  min,
  max,
  step,
  suffix = "",
  onChange,
}: PricingSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        <span className="text-lg font-bold text-white tabular-nums">
          {value.toLocaleString("es-ES")}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #2563eb ${percentage}%, #3f3f46 ${percentage}%)`,
        }}
      />
      <div className="flex justify-between text-xs text-zinc-500">
        <span>
          {min.toLocaleString("es-ES")}
          {suffix}
        </span>
        <span>
          {max.toLocaleString("es-ES")}
          {suffix}
        </span>
      </div>
    </div>
  );
}
