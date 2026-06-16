import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Accordion({ title, category, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-blush/30 studio-shadow overflow-hidden transition-all duration-200">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer hover:bg-blush-light/30">
        <div className="space-y-0.5">
          <span className="text-[8px] uppercase tracking-widest font-mono text-rosegold font-black block">{category}</span>
          <h4 className="font-serif text-sm font-bold text-studio-dark">{title}</h4>
        </div>
        <div className="text-rosegold shrink-0 pl-4">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 pt-1 text-xs text-studio-gray border-t border-blush-light leading-relaxed animate-fadeIn text-left">
          {children}
        </div>
      )}
    </div>
  );
}