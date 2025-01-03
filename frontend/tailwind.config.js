/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      grayscale: {
        'grayscale-50': 'grayscale(0.5)'
      },
      animation: {
        bounce1: "bounce-up-down 1s infinite 0s",
        bounce2: "bounce-up-down 1s infinite 0.2s",
        bounce3: "bounce-up-down 1s infinite 0.4s",
      },
      keyframes: {
        "bounce-up-down": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
    
    // Desktop-first approach
    screens: {
      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }
    },
  },
  plugins: [],
}