/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', // or 'media' for media-query based dark mode
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          blue: '#1C64F2',
          indigo: '#4F46E5',
          light: '#EBF5FF',
          dark: '#1E293B',
        },
        // Authentication state colors
        auth: {
          success: '#10B981', // success actions
          error: '#EF4444',   // error states
          warning: '#F59E0B',  // warnings
          info: '#3B82F6',    // info messages
        },
        // Form colors
        form: {
          input: '#F9FAFB',
          border: '#D1D5DB',
          focus: '#3B82F6',
          error: '#FEE2E2',
          placeholder: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        '128': '32rem',
      },
      fontSize: {
        'xxs': '0.625rem', // 10px
      },
      borderRadius: {
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'form': '0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'none': 'none',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms',
        '3000': '3000ms',
      },
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '100': '100',
        'auto': 'auto',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled', 'hover', 'focus', 'active'],
      cursor: ['disabled', 'hover'],
      backgroundColor: ['disabled', 'active', 'checked'],
      borderColor: ['disabled', 'active', 'checked', 'focus'],
      textColor: ['disabled', 'active', 'visited'],
      scale: ['active', 'group-hover'],
      transform: ['hover', 'focus'],
    },
  },
  plugins: [
    // Add forms plugin (requires installation: npm install -D @tailwindcss/forms)
    // require('@tailwindcss/forms'),
    
    // Add custom form styles
    function ({ addBase, theme }) {
      addBase({
        'h1': { fontSize: theme('fontSize.2xl'), fontWeight: theme('fontWeight.bold') },
        'h2': { fontSize: theme('fontSize.xl'), fontWeight: theme('fontWeight.bold') },
        'h3': { fontSize: theme('fontSize.lg'), fontWeight: theme('fontWeight.medium') },
      });
    },
  ],
};

