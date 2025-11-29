/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors (Botanical Garden Palette)
        // primary   -> #047857 (Emerald-700)
        // secondary -> #BE123C (Rose-700)
        'primary-dark': '#064E3B',  // Emerald-900
        'primary': '#047857',       // Emerald-700
        'primary-light': '#34D399', // Emerald-400
        
        // Accent Colors
        // accent -> #BE123C (Rose-700)
        'accent-dark': '#881337',   // Rose-900
        'accent': '#BE123C',        // Rose-700
        'accent-light': '#FDA4AF',  // Rose-300
        
        // Background Colors
        // bg      -> #FAFAF9 (Stone-50)
        // default -> #FFFFFF (White)
        'bg-dark': '#1C1917',       // Stone-900
        'bg-light': '#FAFAF9',      // Stone-50
        'bg-offwhite': '#FFFFFF',   // White
        
        // Text Colors
        // text -> #1C1917 (Stone-900)
        'text-primary': '#1C1917',  // Stone-900
        'text-secondary': '#57534E',// Stone-600
        'text-on-dark': '#FAFAF9',  // Stone-50
        
        // Named Colors from Palette (aliases mapped to new theme)
        'vista-blue': '#047857',    // primary (Emerald-700)
        'fringy-flower': '#BE123C', // accent (Rose-700)
        'green-pea': '#064E3B',     // primary-dark (Emerald-900)
        'everglade': '#1C1917',     // text (Stone-900)
        'granny-apple': '#FAFAF9',  // bg (Stone-50)
        'ocean-green': '#BE123C',   // accent alias
        'black-bean': '#1C1917',    // text alias
        'eucalyptus': '#34D399',    // primary-light alias
        'silver-tree': '#FFFFFF',   // default/offwhite
      },
    },
  },
  plugins: [],
}
