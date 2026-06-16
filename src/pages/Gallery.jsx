import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/studioDb';
import { X, ZoomIn } from 'lucide-react';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);

  const filters = ['All', 'Lashes', 'Brows'];

  const filteredItems = activeFilter === 'All' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.tag === activeFilter);

  return (
    <div className="space-y-10 py-8 animate-fadeIn text-left">
      <div className="border-b border-blush pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl font-black text-studio-dark uppercase tracking-wide">Studio Lookbook</h2>
          <p className="text-xs text-studio-gray mt-0.5">Real-world retention checks and raw client output previews.</p>
        </div>
        
        {/* Category Filtration Array */}
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${activeFilter === f ? 'bg-rosegold text-white shadow-xs' : 'bg-white border border-blush/40 text-studio-gray hover:bg-blush-light/40'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Masonry Matrix Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredItems.map(item => (
          <div 
            key={item.id} onClick={() => setLightboxImg(item.img)}
            className="break-inside-avoid bg-white rounded-2xl overflow-hidden border border-blush/20 p-2 studio-shadow group cursor-pointer hover:border-rosegold/40 transition-all duration-300"
          >
            <div className="relative overflow-hidden rounded-xl bg-neutral-50 aspect-auto">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-studio-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                  <ZoomIn size={18} />
                </div>
              </div>
            </div>
            <div className="pt-3 px-2 pb-1 flex justify-between items-center">
              <h5 className="text-xs font-bold text-studio-dark font-serif">{item.title}</h5>
              <span className="text-[8px] uppercase tracking-wider font-mono font-bold bg-blush-light text-rosegold px-2 py-0.5 rounded-sm">{item.tag}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal Element Layer */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-studio-dark/95 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setLightboxImg(null)}>
          <button className="absolute top-6 right-6 p-2 text-white/80 hover:text-white cursor-pointer focus:outline-none">
            <X size={28} />
          </button>
          <img src={lightboxImg} alt="High-Res Portfolio Detail Window" className="max-w-full max-h-[85vh] rounded-lg object-contain shadow-2xl border border-white/10" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}