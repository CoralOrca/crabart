import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary-accent': 'var(--primary-accent)',
        'deep-background': 'var(--deep-background)',
        'surface': 'var(--surface)',
        'highlight': 'var(--highlight)',
        
        // Secondary Colors
        'warm-gray': 'var(--warm-gray)',
        'soft-white': 'var(--soft-white)',
        'warning': 'var(--warning)',
        'error': 'var(--error)',
        'success': 'var(--success)',
        
        // Legacy mappings
        'background': 'var(--deep-background)',
        'foreground': 'var(--soft-white)',
      },
      fontFamily: {
        'primary': ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        'secondary': ['Geist Mono', 'monospace'],
        'sans': ['var(--font-primary)'],
        'mono': ['var(--font-secondary)'],
      },
      fontSize: {
        'h1': ['var(--text-h1)', { 
          lineHeight: 'var(--line-h1)',
          letterSpacing: 'var(--letter-h1)',
          fontWeight: '700'
        }],
        'h2': ['var(--text-h2)', { 
          lineHeight: 'var(--line-h2)',
          letterSpacing: 'var(--letter-h2)',
          fontWeight: '700'
        }],
        'h3': ['var(--text-h3)', { 
          lineHeight: 'var(--line-h3)',
          letterSpacing: 'var(--letter-h3)',
          fontWeight: '600'
        }],
        'h4': ['var(--text-h4)', { 
          lineHeight: 'var(--line-h4)',
          letterSpacing: 'var(--letter-h4)',
          fontWeight: '600'
        }],
        'body': ['var(--text-body)', { 
          lineHeight: 'var(--line-body)',
          letterSpacing: 'var(--letter-body)'
        }],
        'caption': ['var(--text-caption)', { 
          lineHeight: 'var(--line-caption)',
          letterSpacing: 'var(--letter-caption)'
        }],
        'mono-data': ['var(--text-mono-data)', { 
          lineHeight: 'var(--line-mono-data)',
          letterSpacing: 'var(--letter-mono-data)',
          fontWeight: '500'
        }],
      },
      spacing: {
        'micro': 'var(--space-micro)',
        'tight': 'var(--space-tight)',
        'standard': 'var(--space-standard)',
        'section': 'var(--space-section)',
        'card': 'var(--space-card)',
        'major': 'var(--space-major)',
      },
      borderRadius: {
        'default': 'var(--radius)',
      },
      boxShadow: {
        'default': '0 0 var(--shadow-blur) rgba(0, 0, 0, var(--shadow-opacity))',
      },
      transitionDuration: {
        'default': 'var(--transition-duration)',
      },
      opacity: {
        'disabled': 'var(--disabled-opacity)',
      },
      borderWidth: {
        'default': 'var(--border-width)',
      },
      ringWidth: {
        'focus': 'var(--focus-ring-width)',
      },
    },
  },
  plugins: [],
} satisfies Config;