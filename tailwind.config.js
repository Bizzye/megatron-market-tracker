import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1f7a8c',
          foreground: '#fff',
        },
        accent: '#f4a261',
      },
    },
  },
  plugins: [forms],
};
