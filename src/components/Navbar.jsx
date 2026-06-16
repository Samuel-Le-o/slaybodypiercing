import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import logo from '../assets/images/logo/logo.jpg';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer upon router mutation tracking
  useEffect(() => setIsOpen(false), [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/aftercare', label: 'Aftercare' }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-blush' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Core Identity Marker */}
        <Link to="/" className="flex items-center gap-2 group text-left">
          {/* <div className="w-9 h-9 rounded-full bg-blush flex items-center justify-center text-rosegold group-hover:rotate-12 transition-transform">
            <Sparkles size={18} />
          </div> */}
          <div>
            <img src={logo} alt="" className="w-20 h-20 object-contain"/>
          </div>
        </Link>

        {/* Desktop Router Links Grid */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `transition-colors relative py-1 ${isActive ? 'text-rosegold font-black' : 'text-studio-dark hover:text-rosegold'}`}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/booking" className="px-5 py-2.5 bg-rosegold text-white rounded-xs text-[10px] uppercase font-bold tracking-widest shadow-md hover:bg-studio-dark transition-all duration-300">
            Book Appt
          </Link>
        </nav>

        {/* Mobile Hamburger Trigger Node */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-studio-dark hover:text-rosegold focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Slide Envelope */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-white border-b border-blush animate-slideDown p-6 space-y-4 shadow-xl">
          <nav className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-left">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="p-2 hover:bg-blush-light rounded-sm">
                {link.label}
              </Link>
            ))}
            <Link to="/booking" className="w-full text-center py-3 bg-rosegold text-white text-[11px] font-bold uppercase tracking-widest rounded-xs shadow-md">
              Secure Direct Booking Slot
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}