import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-20 space-y-4 animate-fadeIn">
      <h1 className="font-serif text-4xl font-black text-studio-dark font-mono">404</h1>
      <h3 className="font-serif text-lg font-bold text-studio-gray uppercase tracking-wider">Invalid Layout Vector Address</h3>
      <p className="text-xs text-studio-gray max-w-xs mx-auto leading-normal">
        The application router layer was unable to compile or resolve this routing path string.
      </p>
      <div className="pt-2">
        <Link to="/" className="px-6 py-2.5 bg-rosegold text-white text-[11px] uppercase tracking-widest font-bold rounded-xs shadow-md">
          Return To Studio Home Base
        </Link>
      </div>
    </div>
  );
}