/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: {
          dark: '#2E073F',
          main: '#7A1CAC',
          light: '#AD49E1',
        },
        accent: {
          main: '#EBD3F8',
        },
        // Semantic colors
        success: {
          main: '#10B981',
          light: '#D1FAE5',
          dark: '#059669',
        },
        warning: {
          main: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
        },
        error: {
          main: '#EF4444',
          light: '#FEE2E2',
          dark: '#DC2626',
        },
        // Background colors
        background: {
          primary: '#EBD3F8',
          secondary: '#FFFFFF',
          accent: '#AD49E1',
        },
        // Text colors
        text: {
          primary: '#2E073F',
          secondary: '#7A1CAC',
          muted: '#6B7280',
          light: '#FFFFFF',
        },
        // Border colors
        border: {
          light: '#E5E7EB',
          medium: '#D1D5DB',
          dark: '#9CA3AF',
        },
        // Dark mode colors
        dark: {
          background: {
            primary: '#1F1F1F',
            secondary: '#2D2D2D',
            accent: '#3D3D3D',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#E5E7EB',
            muted: '#9CA3AF',
            light: '#FFFFFF',
          },
          border: {
            light: '#404040',
            medium: '#525252',
            dark: '#6B7280',
          },
        },
      },
      boxShadow: {
        'custom': '0 4px 12px rgba(46, 7, 63, 0.15)',
        'custom-lg': '0 8px 25px rgba(46, 7, 63, 0.2)',
        'custom-dark': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'custom-lg-dark': '0 8px 25px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
} 