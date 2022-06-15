import { createTheme } from '@mui/material/styles';
import { Fade } from '@mui/material';
import React from 'react';

const palette = {
  type: 'dark',
  background: {
    default: '#000000',
    paper: '#FFFFFF',
    dark: '#f9f9f9',
  },
  text: {
    secondary: '#D8D8D8',
    primary: '#000000',
    disabled: '#CCCCCC',
  },
  primary: {
    main: '#000000',
  },
  secondary: {
    main: '#FFFFFF',
  },
  info: {
    main: '#FFFFFF',
    dark: '#7C7C7C',
  },
};

export const SwTheme = () =>
  createTheme({
    components: {
      // MuiCssBaseline: {
      //   styleOverrides: `
      //     .Mui-disabled {
      //       color: ${palette.text.disabled};
      //     }
      //   `,
      // },
      // MuiButtonBase: {
      //   defaultProps: {
      //     // The props to apply
      //     disableRipple: true, // No more ripple, on the whole application 💣!
      //   },
      // },
      // MuiTooltip: {
      //   defaultProps: {
      //     TransitionComponent: Fade,
      //   },
      //   styleOverrides: {
      //     tooltip: {
      //       border: '3px solid',
      //       borderColor: palette.text.primary,
      //       borderRadius: '4px',
      //       backgroundColor: palette.background.default,
      //       boxSizing: 'border-box',
      //     },
      //   },
      // },
      // MuiUseMediaQuery: {
      //   defaultProps: {
      //     noSsr: true,
      //   },
      // },
      // MuiPaper: {
      //   styleOverrides: {
      //     root: {
      //       minWidth: '480px',
      //       borderStyle: 'solid',
      //       borderWidth: '1px',
      //       borderColor: palette.secondary.main,
      //       backgroundColor: palette.primary.main,
      //     },
      //   },
      // },
      // MuiSlider: {
      //   styleOverrides: {
      //     root: {
      //       borderStyle: 'solid',
      //       borderRadius: 0,
      //       border: 2,
      //       borderColor: '#000000',
      //     },
      //     rail: {
      //       height: '26px',
      //       borderRadius: 0,
      //       color: '#FFFFFF',
      //     },
      //     track: {
      //       height: '25px',
      //       borderRadius: 0,
      //     },
      //     thumb: {
      //       display: 'none',
      //     },
      //   },
      // },
      // // MuiInput: {
      // //   styleOverrides: {
      // //     underline: {
      // //       // Remove the ripple effect on input
      // //       ':after': {
      // //         borderBottom: '2px solid var(--border)',
      // //       },
      // //       ':before': {
      // //         borderBottom: '2px solid var(--border)',
      // //         transition: 'none',
      // //       },
      // //       ':hover': { borderBottom: `2px solid var(--border)` },
      // //     },
      // //   },
      // // },
      // MuiInputBase: {
      //   styleOverrides: {
      //     // underline: {
      //     //   // Remove the ripple effect on input
      //     //   ':after': {
      //     //     borderBottom: 'initial',
      //     //   },
      //     // },
      //   },
      // },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    palette,
    shape: {
      borderRadius: 0,
    },
    typography: {
      fontSize: 16,
      button: {
        fontSize: '20px', // 1.25rem
      },
      body1: {
        fontSize: '14px', // 0.875rem
      },
      body2: {
        fontSize: '12px', // 0.75rem
      },
      subtitle1: {
        fontSize: '16px', // 1rem
      },
      subtitle2: {
        fontSize: '14px', // 0.875rem
      },
      h1: {
        fontSize: '30px', // 1.875rem
      },
      h2: {
        fontSize: '20px', // 1.25rem
      },
      h3: {
        fontSize: '18px', // 1.125rem
      },
      h4: {
        fontSize: '14px', // 0.875rem
      },
      h5: {
        fontSize: '12px', // 0.75rem
      },
      h6: {
        fontSize: '10px', // 0.625rem
      },
      xl: {
        fontSize: '50px',
      },
      xxl: {
        fontSize: '60px',
      },
      fontFamily: ['Josefin Sans', ' sans-serif'].join(','),
    },
  });

declare module '@mui/material/styles/createTypography' {
  interface Typography {
    xl: React.CSSProperties;
    xxl: React.CSSProperties;
  }

  interface TypographyOptions {
    xl?: React.CSSProperties;
    xxl: React.CSSProperties;
  }
}

declare module '@mui/material/Typography/Typography' {
  interface TypographyPropsVariantOverrides {
    xl: true;
    xxl: true;
  }
}
