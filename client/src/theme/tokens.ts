/**
 * 디자인 토큰 - MUI 테마에서 사용
 */
export const designTokens = {
  colors: {
    primary: {
      main: '#18181b',
      light: '#3f3f46',
      dark: '#09090b',
      50: '#fafafa',
      100: '#f4f4f5',
    },
    secondary: {
      main: '#71717a',
      light: '#a1a1aa',
      dark: '#52525b',
    },
    background: {
      default: '#ffffff',
      paper: '#fafafa',
    },
    text: {
      primary: '#18181b',
      secondary: '#71717a',
      disabled: '#a1a1aa',
    },
  },
  typography: {
    fontFamily: '"Pretendard", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { size: '2.5rem', weight: 700, lineHeight: 1.2 },
    h2: { size: '2rem', weight: 600, lineHeight: 1.3 },
    h3: { size: '1.5rem', weight: 600, lineHeight: 1.4 },
    body1: { size: '1rem', weight: 400, lineHeight: 1.5 },
    body2: { size: '0.875rem', weight: 400, lineHeight: 1.5 },
    caption: { size: '0.75rem', weight: 400, lineHeight: 1.4 },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
  },
  shape: {
    borderRadius: 8,
  },
};
