/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#2563EB', 50: '#EFF6FF', 100: '#DBEAFE', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
        secondary: { DEFAULT: '#4F46E5', 50: '#EEF2FF', 100: '#E0E7FF', 600: '#4F46E5', 700: '#4338CA' },
        accent:    { DEFAULT: '#14B8A6', 50: '#F0FDFA', 100: '#CCFBF1', 500: '#14B8A6', 600: '#0D9488' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'] },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'card-lg': '0 12px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)',
        'glow':    '0 0 40px rgba(37,99,235,0.18), 0 0 80px rgba(79,70,229,0.08)',
        'glow-sm': '0 0 20px rgba(37,99,235,0.15)',
      },
      animation: {
        'float':    'float 6s ease-in-out infinite',
        'gradient': 'gradientShift 4s ease infinite',
        'shimmer':  'shimmer 1.5s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient':   'linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)',
        'card-gradient':   'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
      },
    },
  },
  plugins: [],
};
