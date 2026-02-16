import React from 'react';

interface CalculatorInputProps {
  label: string;
  value: number | '';
  onChange: (val: number | '') => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  id: string;
}

export const CalculatorInput: React.FC<CalculatorInputProps> = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  id
}) => {
  return (
    <div className="relative group">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-4 text-slate-400 font-medium select-none pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
          placeholder={placeholder}
          className={`w-full bg-white text-slate-900 font-semibold text-lg py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${prefix ? 'pl-9' : 'pl-4'} ${suffix ? 'pr-9' : 'pr-4'}`}
          onWheel={(e) => e.currentTarget.blur()} // Prevent scroll value change
        />
        {suffix && (
          <span className="absolute right-4 text-slate-400 font-medium select-none pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};