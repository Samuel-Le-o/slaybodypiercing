import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-studio-dark text-white pt-16 pb-8 px-4 border-t border-blush/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left mb-12">
        <div className="space-y-4">
          <h4 className="font-serif text-lg tracking-widest uppercase text-blush">@SLAYBODY PIERCING</h4>
          <p className="text-xs text-white/60 leading-relaxed max-w-sm">
            Discover exceptional piercing services that combine style, safety and luxury at Slay Body Piercing Studio!
          </p>
        </div>
        <div className="space-y-4">
          <h5 className="text-xs uppercase tracking-widest text-blush font-black">Studio Hours</h5>
          <ul className="text-xs text-white/60 space-y-2 font-mono">
            <li>Monday - Friday: 09:00 AM - 10:00 PM</li>
            <li>Saturday: 10:00 AM - 05:00 PM</li>
            <li>Sunday: Closed / VIP Priority Outcalls Only</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h5 className="text-xs uppercase tracking-widest text-blush font-black">Quick Navigation</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link to="/services" className="text-white/60 hover:text-blush transition-colors">Services </Link>
            <Link to="/gallery" className="text-white/60 hover:text-blush transition-colors">Visual Portfolio</Link>
            <Link to="/aftercare" className="text-white/60 hover:text-blush transition-colors">AfterCare</Link>
            <Link to="/booking" className="text-white/60 hover:text-blush transition-colors">Secure an Appiontment</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase font-mono tracking-widest text-white/40 gap-4">
        <span>© 2026 SLAYBODYPIERCING. ALL RIGHTS RESERVED.</span>
        <span className="flex items-center gap-1">Architected with <Heart size={10} className="text-rosegold fill-current" /> in Accra, Ghana</span>
      </div>
    </footer>
  );
}