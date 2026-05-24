import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx,json}'
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F3A',
          50: '#F5F7FB',
          100: '#E6ECF3',
          200: '#C5D0DD',
          300: '#94A6BD',
          400: '#5C7799',
          500: '#2A5A94',
          600: '#13345F',
          700: '#0B1F3A',
          800: '#081730',
          900: '#050F22'
        },
        amber: {
          DEFAULT: '#F5A524',
          600: '#D88A13'
        },
        ink: {
          DEFAULT: '#0B1729',
          muted: '#4A5A75',
          subtle: '#7A8AA3'
        },
        line: {
          DEFAULT: '#E6ECF3',
          strong: '#C5D0DD'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        head: ['var(--font-head)', 'Manrope', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace']
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px'
      },
      boxShadow: {
        sm: '0 1px 2px rgba(11,31,58,.06)',
        md: '0 1px 2px rgba(11,31,58,.06), 0 8px 24px rgba(11,31,58,.06)',
        lg: '0 12px 36px rgba(11,31,58,.12)',
        xl: '0 20px 60px rgba(11,31,58,.18)'
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 320ms cubic-bezier(.2,.8,.2,1)'
      }
    }
  },
  plugins: []
};

export default config;
