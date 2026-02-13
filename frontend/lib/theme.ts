export const theme = {
  colors: {
    primary: {
      DEFAULT: '#D4A574',
      light: '#E8C9A0',
      dark: '#C8956E',
    },
    background: {
      DEFAULT: '#1A1410',
      secondary: '#2D2520',
      card: '#3A3230',
    },
    accent: {
      cream: '#F5E6D3',
      tan: '#D4A574',
      brown: '#8B6F47',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E8C9A0',
      muted: '#A89B8F',
    },
  },
  fonts: {
    heading: 'var(--font-playfair)',
    body: 'var(--font-inter)',
  },
  spacing: {
    section: '5rem',
    card: '1.5rem',
  },
  borderRadius: {
    card: '1.5rem',
    button: '0.75rem',
  },
  shadows: {
    card: '0 8px 32px rgba(0, 0, 0, 0.3)',
    hover: '0 12px 48px rgba(212, 165, 116, 0.2)',
  },
} as const;

export type Theme = typeof theme;
