/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary-dark': '#1b4332',
        'primary': '#2d6a4f',
        'primary-light': '#40916c',
        
        // Accent Colors
        'accent-dark': '#52b788',
        'accent': '#74c69d',
        'accent-light': '#95d5b2',
        
        // Background Colors
        'bg-dark': '#081c15',
        'bg-light': '#d8f3dc',
        'bg-offwhite': '#b7e4c7',
        
        // Text Colors
        'text-primary': '#081c15',
        'text-on-dark': '#d8f3dc',
        
        // Named Colors from Palette
        'vista-blue': '#95d5b2',
        'fringy-flower': '#b7e4c7',
        'green-pea': '#2d6a4f',
        'everglade': '#1b4332',
        'granny-apple': '#d8f3dc',
        'ocean-green': '#52b788',
        'black-bean': '#081c15',
        'eucalyptus': '#40916c',
        'silver-tree': '#74c69d',
      },
    },
  },
  plugins: [],
}
