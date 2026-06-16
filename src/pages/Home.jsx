import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Star, ShieldCheck } from 'lucide-react';
import { STUDIO_SERVICES } from '../data/studioDb';
import ServiceCard from '../components/UI/ServiceCard';
import pic8 from "../assets/images/pic8.jpeg"

export default function Home() {
  return (
    <div className="space-y-24 pt-8 text-left animate-fadeIn bg-white">
      {/* Premium Hero Frame — Transformed to a luxurious soft light pink & white theme */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-[#FAF5F5] via-white to-[#FFF9F9] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 min-h-[520px] border border-[#F9EBEB] shadow-xs">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF5F5] border border-[#F3CFCF]/40 rounded-full text-[9px] font-bold uppercase tracking-widest text-studio-dark/80">
            <Sparkles size={10} className="text-[#F3CFCF]" /> Certified Body Piercing Specialists
          </div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-studio-dark leading-tight font-black uppercase tracking-wide">
            @SLAY BODY PIERCING.<br />WHERE BODY MEETS ART, <span className="text-studio-gray italic font-medium lowercase font-serif capitalize">dare to be different.</span>
          </h2>
          <p className="text-xs md:text-sm text-studio-gray max-w-md leading-relaxed">
            Slay Body Piercing offers convenient, professional body piercing services at your doorstep within Accra and Central Regions of Ghana. To ensure an appointment, a 50% deposit is required upon booking, ensuring us to prepare adequately for your session. Payment of services will be settled upon completion of the piercing procedure.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {/* Soft pink luxury CTA button with dark crisp text */}
            <Link to="/booking" className="px-8 py-3.5 bg-[#F3CFCF] text-studio-dark text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-studio-dark hover:text-white transition-all duration-300 shadow-xs font-black">
              Book Appointment
            </Link>
            <Link to="/services" className="px-8 py-3.5 border border-[#F3CFCF]/50 text-studio-dark/80 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#FAF5F5] transition-all duration-300">
              Services
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full aspect-video lg:aspect-square max-w-[420px]">
          <img src={pic8} alt="Slay Body Piercing Feature Layout" className="w-full h-full object-cover rounded-3xl shadow-md border border-[#F9EBEB]" />
        </div>
      </section>

      {/* Featured Menu Highlights */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-widest font-mono text-studio-gray font-bold block">Exquisite Artistry</span>
          <h3 className="font-serif text-2xl md:text-3xl font-black uppercase tracking-wide text-studio-dark">Our Services</h3>
          <div className="w-12 h-[2px] bg-[#F3CFCF] mx-auto rounded-full mt-2"></div>
          <p className="text-xs text-studio-gray max-w-xl mx-auto pt-2">
            At Slay Body Piercing, we believe every piercing is a statement of confidence. From subtle earlobe studs to bold body piercings, we provide safe, hygienic, and professional services tailored to your unique look. Explore our categories below and find the piercing that matches your vibe.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STUDIO_SERVICES.filter(srv => srv.featured === true).map(srv => (
            <ServiceCard key={srv.id} service={srv} />
          ))}
        </div>
      </section>
    </div>
  );
}





/* B. STUDIO OVERVIEW VIEW */
export function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 text-left animate-fadeIn bg-white">
      <div className="border-b border-[#F9EBEB] pb-4">
        <h2 className="font-serif text-3xl font-black text-studio-dark uppercase tracking-wide">The Brand Philosophy</h2>
        <p className="text-xs text-studio-gray font-medium mt-1">Where artistry meets precision, and every piercing tells a story of self-expression and confidence. We bring Accra's premier professional body piercing services directly to your home for ultimate comfort and convenience.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 text-xs text-studio-gray leading-relaxed">
          <p className="font-bold text-studio-dark text-sm font-serif">What Sets Us Apart</p>
          <p>Founded in 2021, SLAY BodyPiercing emerged from a passion for transforming body art into a safe, empowering, and luxurious experience. We believe that every piercing is more than just jewelry – it's a statement of individuality, a mark of confidence, and a celebration of personal style.</p>
          <p>Our journey began with a simple vision: to bring professional piercing services directly to our clients' homes, creating the most comfortable and personalized experience possible. Today, we've become Accra's most trusted mobile body piercing service, serving hundreds of satisfied clients in the comfort and privacy of their own spaces.</p>
        </div>
        <div className="aspect-square bg-[#FAF5F5] rounded-3xl overflow-hidden border border-[#F9EBEB] shadow-xs">
          <img src={pic8} alt="Premium setup canvas" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}

/* C. SERVICE DIRECTORY VIEW */
export function Services() {
  return (
    <div className="space-y-12 py-8 text-left animate-fadeIn bg-white">
      <div className="border-b border-[#F9EBEB] pb-4 text-center sm:text-left">
        <h2 className="font-serif text-3xl font-black text-studio-dark uppercase tracking-wide">Our Services</h2>
        <p className="text-xs text-studio-gray font-medium mt-1">Transparent pricing parameters. No hidden environmental overhead charges.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STUDIO_SERVICES.map(srv => <ServiceCard key={srv.id} service={srv} />)}
      </div>
    </div>
  );
}