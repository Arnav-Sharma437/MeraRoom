/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F2E1E',
          green: '#16A34A',
          gold: '#D4AF37',
          black: '#1A1A1A',
          cream: '#F9F6EF',
          white: '#FFFFFF',
          gray: '#6B7280',
          light: '#F0FDF4',
          border: '#D1FAE5',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        display: ['var(--font-dm-serif)', 'serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(15, 46, 30, 0.08)',
        'card-hover': '0 12px 32px rgba(15, 46, 30, 0.15)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseWhatsApp: {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(22, 163, 74, 0.4)',
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 8px rgba(22, 163, 74, 0)',
          },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'pulse-whatsapp': 'pulseWhatsApp 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
