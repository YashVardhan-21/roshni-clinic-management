import forms from '@tailwindcss/forms';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Core System Colors */
        background: 'var(--color-background)', // gray-50
        foreground: 'var(--color-foreground)', // custom-dark-teal-gray
        border: 'var(--color-border)', // custom-muted-teal
        input: 'var(--color-input)', // white
        ring: 'var(--color-ring)', // custom-therapeutic-teal
        
        /* Card Colors */
        card: {
          DEFAULT: 'var(--color-card)', // white
          foreground: 'var(--color-card-foreground)' // custom-dark-teal-gray
        },
        
        /* Popover Colors */
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)' // custom-dark-teal-gray
        },
        
        /* Muted Colors */
        muted: {
          DEFAULT: 'var(--color-muted)', // custom-light-gray
          foreground: 'var(--color-muted-foreground)' // custom-medium-teal-gray
        },
        
        /* Primary Colors */
        primary: {
          DEFAULT: 'var(--color-primary)', // custom-therapeutic-teal
          foreground: 'var(--color-primary-foreground)' // white
        },
        
        /* Secondary Colors */
        secondary: {
          DEFAULT: 'var(--color-secondary)', // custom-sage-green
          foreground: 'var(--color-secondary-foreground)' // white
        },
        
        /* Accent Colors */
        accent: {
          DEFAULT: 'var(--color-accent)', // custom-warm-peach
          foreground: 'var(--color-accent-foreground)' // custom-dark-teal-gray
        },
        
        /* Success Colors */
        success: {
          DEFAULT: 'var(--color-success)', // green-500
          foreground: 'var(--color-success-foreground)' // white
        },
        
        /* Warning Colors */
        warning: {
          DEFAULT: 'var(--color-warning)', // orange-500
          foreground: 'var(--color-warning-foreground)' // white
        },
        
        /* Error/Destructive Colors */
        error: {
          DEFAULT: 'var(--color-error)', // red-300
          foreground: 'var(--color-error-foreground)' // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-300
          foreground: 'var(--color-destructive-foreground)' // white
        }
      },
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'], // Inter for headings
        'body': ['Source Sans Pro', 'system-ui', 'sans-serif'], // Source Sans Pro for body
        'caption': ['Nunito Sans', 'system-ui', 'sans-serif'], // Nunito Sans for captions
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'] // JetBrains Mono for data
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }], // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }], // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
      },
      spacing: {
        '18': '4.5rem', // 72px
        '88': '22rem', // 352px
        '128': '32rem', // 512px
      },
      borderRadius: {
        'therapeutic': '8px',
        'gentle': '4px',
      },
      boxShadow: {
        'therapeutic': '0 2px 8px rgba(45, 125, 125, 0.08)',
        'therapeutic-lg': '0 4px 16px rgba(45, 125, 125, 0.12)',
        'therapeutic-xl': '0 8px 32px rgba(45, 125, 125, 0.16)',
      },
      animation: {
        'gentle-fade': 'gentle-fade 300ms ease-out',
        'slide-in': 'slide-in 300ms ease-out',
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gentle-fade': {
          '0%': {
            opacity: '0',
            transform: 'translateY(4px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-in': {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(0)'
          }
        }
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '800': '800ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        '1000': '1000', // Header
        '1100': '1100', // Mobile drawer
        '1200': '1200', // Notifications
        '1300': '1300', // Modals
      }
    },
  },
  plugins: [
    forms,
    animate,
  ],
}