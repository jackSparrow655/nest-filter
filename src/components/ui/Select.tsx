
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, options, placeholder = "Select...", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={containerRef} style={{ zIndex: isOpen ? 60 : 1 }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:border-slate-300"
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 min-w-[8rem] w-full max-h-[200px] overflow-y-auto rounded-md border border-slate-200 bg-white text-slate-950 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-custom">
          <div className="p-1">
            {options.length > 0 ? options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onValueChange(opt.value);
                  setIsOpen(false);
                }}
                className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 transition-colors ${opt.value === value ? 'bg-slate-100 font-medium' : ''}`}
              >
                {opt.value === value && (
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4 text-slate-900" />
                  </span>
                )}
                <span className="truncate">{opt.label}</span>
              </button>
            )) : (
              <div className="py-2 px-2 text-xs text-slate-400 italic text-center">No options</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
