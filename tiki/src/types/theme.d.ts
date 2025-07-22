import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    red: Palette['primary'];
    white: Palette['primary'];
    gray: Palette['primary'];
    grey: Palette['primary'];
    green: Palette['primary'];
    black: Palette['primary'];
  }

  interface PaletteOptions {
    red?: PaletteOptions['primary'];
    white?: PaletteOptions['primary'];
    gray?: PaletteOptions['primary'];
    grey?: PaletteOptions['primary'];
    green?: PaletteOptions['primary'];
    black?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    red: true;
    white: true;
    gray: true;
    grey: true;
    green: true;
    black: true;
  }
}
