import React, { useState } from 'react';
import { AFTERCARE_REGIMENS } from '../data/studioDb';
import Accordion from '../components/UI/Accordion';
import { Search, Sparkles } from 'lucide-react';
// 1. Import your physical video asset from your local assets folder
import treatmentvideo from '../assets/images/treatmentvideo.mov';

export default function Aftercare() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRegimens = AFTERCARE_REGIMENS.filter(reg => 
    reg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 animate-fadeIn text-left px-4">
      {/* Header Section */}
      <div>
        <h2 className="font-serif text-xl md:text-2xl font-bold text-studio-dark uppercase tracking-wider">Expert Aftercare Video Guide</h2>
        <p className="text-xs text-studio-gray mt-0.5">Watch our comprehensive video tutorial featuring professional aftercare techniques demonstrated by our experienced piercers. This essential guide covers everything you need to know for proper healing.</p>
      </div>

      {/* 2. Embedded Physical Video Asset Masterclass Block */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border border-blush/30 studio-shadow space-y-4">
        <h3 className="font-serif text-xs font-bold text-studio-dark uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={14} className="text-rosegold animate-pulse" /> Video Care Masterclass
        </h3>
        
        {/* Responsive Aspect Widescreen Shell */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-blush/20 bg-studio-dark relative studio-shadow">
          <video 
            src={treatmentvideo} 
            autoPlay 
            loop 
            muted 
            controls 
            className="w-full h-full object-cover"
            controlsList="nodownload" // Disables standard drop-menu downloading natively
            playsInline // Essential layout flag keeping media inline on mobile screens
          >
            Your system structure does not support native inline video playbacks.
          </video>
        </div>
        <p className="text-[10px] md:text-xs text-studio-gray font-mono italic text-center">
          Press play to watch our visual step-by-step cleaning and lash mapping guide.
        </p>
      </div>

      {/* Real-time Filter Search Node */}
      {/* <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-studio-gray/60 pointer-events-none">
          <Search size={16} />
        </span>
        <input 
          type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by treatment category (e.g. 'Lash', 'Lamination', 'Moisture')..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-blush/40 rounded-xl text-xs text-studio-dark shadow-xs focus:outline-hidden focus:border-rosegold transition-colors duration-200"
        />
      </div> */}

      {/* Interactive Item Accordion Node Mount */}
      {/* <div className="space-y-4">
        {filteredRegimens.length > 0 ? (
          filteredRegimens.map(reg => (
            // <Accordion key={reg.id} title={reg.title} category={reg.category}>
            //   <p className="leading-relaxed text-xs text-studio-gray">{reg.content}</p>
            // </Accordion>
          ))
        ) : (
          <div className="text-center py-12 text-xs text-studio-gray font-mono">
            Zero structural data vectors matched your query string. Try adjusting search criteria terms.
          </div>
        )}
      </div> */}
    </div>
  );
}