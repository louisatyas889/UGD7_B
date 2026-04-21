import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 1. Integrasi Font Custom (Inter & Space Grotesk)
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        space: ["var(--font-space)", "monospace"],
      },
      // 2. Custom Grid (Bawaan dashboard/tugas)
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      // 3. Palette Warna Biru
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
      },
      // 4. Animasi Shimmer (Untuk loading skeleton)
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  // 5. Plugin Forms (Penting buat input login/admin nanti)
  plugins: [require('@tailwindcss/forms')],
};

export default config;
