import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { formatCedi } from '../../utils/format'; // Adjust this relative path based on where your utils folder sits

export default function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-blush/20 flex flex-col justify-between studio-shadow group hover:border-rosegold/30 transition-all duration-300">
      <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
        <img 
          src={service.img} 
          alt={service.name} 
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" 
          loading="lazy" 
        />
        {/* Dynamic Ghana Cedi Currency Display Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-black text-rosegold border border-blush">
          {formatCedi(service.price)}
        </div>
      </div>
      
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between text-left">
        <div className="space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-rosegold font-black block">
            {service.category}
          </span>
          <h4 className="font-serif text-base font-bold text-studio-dark leading-snug">
            {service.name}
          </h4>
          <p className="text-xs text-studio-gray leading-relaxed">
            {service.desc}
          </p>
        </div>
        
        <div className="pt-2 flex items-center justify-between border-t border-blush-light">
          <span className="flex items-center gap-1 text-[11px] font-mono text-studio-gray font-bold">
            <Clock size={12} className="text-rosegold" /> {service.duration}
          </span>
          <Link 
            to="/booking" 
            className="text-xs font-bold uppercase tracking-wider text-rosegold hover:text-studio-dark transition-colors"
          >
            Book Appt →
          </Link>
        </div>
      </div>
    </div>
  );
}