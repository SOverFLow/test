"use client";
import {
  blue,
  purple,
  red,
  green,
  cyan,
  yellow,
  orange,
} from "@mui/material/colors";
import {
  PaletteColor,
  PaletteColorOptions,
  createTheme,
} from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    card?: PaletteColor;
    priority?: {
      high: string;
      medium: string;
      low: string;
    };
  }
  interface PaletteOptions {
    card?: PaletteColorOptions;
    priority?: {
      high: string;
      medium: string;
      low: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: cyan[100],
      main: cyan[600],
      dark: cyan[800],
    },
    secondary: {
      main: blue[500],
    },
    success: {
      light: green["A200"],
      main: green[400],
      dark: green[800],
    },
    warning: {
      light: yellow[100],
      main: orange[400],
      dark: yellow[900],
    },
    error: {
      light: red[100],
      main: red[400],
      dark: red[800],
    },
    text: {
      primary: "#424240",
      secondary: "#666564",
    },
    card: {
      main: cyan[50],
      light: '#fff',
      dark: cyan[800],
      contrastText: "#242105",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
    body2: {
      fontWeight: 400,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 760,
      lg: 1180,
      xl: 1420,
    },
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === "info" && {
            backgroundColor: "#60a5fa",
          }),
        }),
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        margin: "normal",
        required: true,
        fullWidth: true,
        autoFocus: true,
        color: "primary",
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          background: "	#F5F5F5",
          color: "text.primary",
        },
        input: {
          padding: "12px 14px", // Adjust padding to make the TextField look smaller
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          // This transform moves the label to the center of the input when not shrunk
          transform: "translate(14px, 50%) scale(1)",
          // This transition ensures the transform is animated smoothly
          transition: "transform 200ms",
          "&.MuiInputLabel-shrink": {
            // When the label is shrunk, it should be moved to the appropriate position
            transform: "translate(14px, -6px) scale(0.75)",
          },
        },
      },
    },
  },
});

export default theme;
