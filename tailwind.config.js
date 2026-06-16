// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. Text & Structural Anchors
        'studio-dark': '#2D2526',     // Soft, warm off-black/charcoal for premium readable text
        
        // 2. The New Soft Light Pink Palette
        'rosegold': '#F3CFCF',        // Your new primary brand pink — very soft, muted, and elegant
        'blush': '#F9EBEB',           // Even lighter pastel pink for delicate borders and active tabs
        'blush-light': '#FAF5F5',     // Micro-tinted pinkish-white canvas for soft page section backdrops
        
        // 3. Global Canvas Structural Settings
        'studio-bg': '#FFFFFF',       // Clean, crisp pure white backdrop
        'studio-gray': '#71717A',     // Soft neutral gray for subtitles and paragraph details
      },
      borderRadius: {
        'xs': '12px',                 // Softens component edges to match the gentle color palette
      }
    },
  },
  plugins: [],
}