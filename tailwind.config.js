/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
            DEFAULT: 'var(--color-primary)',
            hover: 'var(--color-primary-hover)',
            '25': 'var(--color-primary-25)',
            '50': 'var(--color-primary-50)',
            '75': 'var(--color-primary-75)',
        },
        secondary: {
            DEFAULT: 'var(--color-secondary)',
            hover: 'var(--color-secondary-hover)',
            '25': 'var(--color-secondary-25)',
            '50': 'var(--color-secondary-50)',
            '75': 'var(--color-secondary-75)',
        },
        background: {
            DEFAULT: 'var(--color-bg)',
            '25': 'var(--color-bg-25)',
            '50': 'var(--color-bg-50)',
            '75': 'var(--color-bg-75)',
        },
        panel: {
            DEFAULT: 'var(--color-panel)',
            muted: 'var(--color-panel-muted)',
            '25': 'var(--color-panel-25)',
            '50': 'var(--color-panel-50)',
            '75': 'var(--color-panel-75)',
        },
        card: {
            DEFAULT: 'var(--color-card)',
            hover: 'var(--color-card-hover)',
            '25': 'var(--color-card-25)',
            '50': 'var(--color-card-50)',
            '75': 'var(--color-card-75)',
        },
        border: {
            DEFAULT: 'var(--color-border)',
            '25': 'var(--color-border-25)',
            '50': 'var(--color-border-50)',
            '75': 'var(--color-border-75)',
        },
        overlay: {
            DEFAULT: 'var(--color-overlay)',
            '25': 'var(--color-overlay-25)',
            '50': 'var(--color-overlay-50)',
            '75': 'var(--color-overlay-75)',
        },
        // Text 顏色系列
        textDefaultColor: 'var(--color-text-default)',
        muted: 'var(--color-text-muted)',
        sub: 'var(--color-text-sub)',
        test: 'var(--color-test)',
        test2: 'var(--color-test2)',
        placeholder: 'var(--color-placeholder)',

        admin: {
          background: {
            DEFAULT: 'var(--color-admin-bg)',
            '75': 'var(--color-admin-bg-75)',
            '50': 'var(--color-admin-bg-50)',
            '25': 'var(--color-admin-bg-25)',
          },
          card: {
            DEFAULT: 'var(--color-admin-card)',
            hover: 'var(--color-admin-card-hover)',
            '75': 'var(--color-admin-card-75)',
            '50': 'var(--color-admin-card-50)',
            '25': 'var(--color-admin-card-25)',
            focus: 'var(--color-admin-card-focus)',
            edit: 'var(--color-admin-card-edit)',
          }
        },
      },
      textColor: {
        default: 'var(--color-text-default)',
        invert: 'var(--color-text-invert)',
        emphasized: 'var(--color-text-emphasized)',
        placeholder: 'var(--color-text-placeholder)',
        error: 'var(--color-text-error)',
        admin: {
          text: {
            DEFAULT: 'var(--color-admin-text)',
            hover: 'var(--color-admin-text-hover)',
            invert: 'var(--color-admin-text-invert)',
            muted: 'var(--color-admin-text-muted)',
            sub: 'var(--color-admin-text-sub)',
            emphasized: 'var(--color-admin-text-emphasized)',
            placeholder: 'var(--color-admin-text-placeholder)',
          }
        }
      },
      borderColor: {
        DEFAULT: 'var(--color-border)',
        '25': 'var(--color-border-25)',
        '50': 'var(--color-border-50)',
        '75': 'var(--color-border-75)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.725rem',
        xs: '0.875rem',
        sm: '1rem',
        md: ['1.25rem', { lineHeight: '1.5' }],
        lg: ['1.5rem', { lineHeight: '1.5' }],
        xl: ['2rem', { lineHeight: '1.5' }],
        '2xl': ['2.5rem', { lineHeight: '1.5' }],
        '3xl': ['3rem', { lineHeight: '1.5' }],
        '4xl': ['4rem', { lineHeight: '1.5' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      screens: {
        mobile: { max: '768px' },
      },
    },
  },
  plugins: [],
}

