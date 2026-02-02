'use client';

import { createTheme } from '@mui/material/styles';
import { designTokens } from './tokens';

export const theme = createTheme({
  palette: {
    primary: {
      main: designTokens.colors.primary.main,
      light: designTokens.colors.primary.light,
      dark: designTokens.colors.primary.dark,
    },
    secondary: {
      main: designTokens.colors.secondary.main,
      light: designTokens.colors.secondary.light,
      dark: designTokens.colors.secondary.dark,
    },
    background: {
      default: designTokens.colors.background.default,
      paper: designTokens.colors.background.paper,
    },
    text: {
      primary: designTokens.colors.text.primary,
      secondary: designTokens.colors.text.secondary,
      disabled: designTokens.colors.text.disabled,
    },
  },
  typography: {
    fontFamily: designTokens.typography.fontFamily,
    h1: {
      fontSize: designTokens.typography.h1.size,
      fontWeight: designTokens.typography.h1.weight,
      lineHeight: designTokens.typography.h1.lineHeight,
    },
    h2: {
      fontSize: designTokens.typography.h2.size,
      fontWeight: designTokens.typography.h2.weight,
      lineHeight: designTokens.typography.h2.lineHeight,
    },
    h3: {
      fontSize: designTokens.typography.h3.size,
      fontWeight: designTokens.typography.h3.weight,
      lineHeight: designTokens.typography.h3.lineHeight,
    },
    body1: {
      fontSize: designTokens.typography.body1.size,
      fontWeight: designTokens.typography.body1.weight,
      lineHeight: designTokens.typography.body1.lineHeight,
    },
    body2: {
      fontSize: designTokens.typography.body2.size,
      fontWeight: designTokens.typography.body2.weight,
      lineHeight: designTokens.typography.body2.lineHeight,
    },
    caption: {
      fontSize: designTokens.typography.caption.size,
      fontWeight: designTokens.typography.caption.weight,
      lineHeight: designTokens.typography.caption.lineHeight,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: designTokens.shape.borderRadius,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: designTokens.breakpoints.mobile,
      md: designTokens.breakpoints.tablet,
      lg: designTokens.breakpoints.desktop,
      xl: designTokens.breakpoints.wide,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 48,
          minWidth: 48,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: designTokens.colors.background.default,
          color: designTokens.colors.text.primary,
        },
      },
    },
  },
});
