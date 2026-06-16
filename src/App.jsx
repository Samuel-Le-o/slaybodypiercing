import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StudioProvider } from './context/StudioContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Secure View Allocations
import Home, { About, Services } from './pages/Home';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import Aftercare from './pages/Aftercare';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <StudioProvider>
      <ScrollToTop />
      <Navbar />
      
      {/* Central Content Routing Grid Slot */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 min-h-[75vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/aftercare" element={<Aftercare />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </StudioProvider>
  );
}