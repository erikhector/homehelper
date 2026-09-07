import { createTheme } from "@mui/material/styles";

import type { PaletteMode } from "@mui/material";

// Palette values mirror household-hub's purple design tokens (converted from OKLCH to hex),
// so both apps read as the same product family.
export default function createAppTheme(mode: PaletteMode) {
  const isDarkMode = mode === "dark";

  return createTheme({
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiChip: { defaultProps: { size: "small" } },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundAttachment: "fixed",
            backgroundImage: isDarkMode ? "radial-gradient(circle, #180828, #0a0414)" : "radial-gradient(circle, #f3ecfb, #fefcff)",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh"
          }
        }
      },
      MuiFormControl: { defaultProps: { size: "small" } },
      MuiIconButton: { defaultProps: { size: "small" } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiSvgIcon: { defaultProps: { fontSize: "small" } },
      MuiTextField: { defaultProps: { size: "small" } }
    },
    palette: {
      background: { default: isDarkMode ? "#0a0a0a" : "#f9f7fd", paper: isDarkMode ? "#1b1a27" : "#fefdff" },
      error: { main: isDarkMode ? "#ff6467" : "#e7000b" },
      mode,
      primary: {
        contrastText: "#fdfaff",
        dark: isDarkMode ? "#f9f7fe" : "#332647",
        light: isDarkMode ? "#462e69" : "#e6dafe",
        main: isDarkMode ? "#a968ff" : "#8b46df"
      },
      secondary: { main: isDarkMode ? "#f2b8d2" : "#a72d64" },
      success: { main: isDarkMode ? "#9bd5ae" : "#286a43" },
      text: { primary: isDarkMode ? "#fafafa" : "#1f1c2f", secondary: isDarkMode ? "#a4a2b7" : "#5d5b6e" },
      warning: { main: isDarkMode ? "#ffdca8" : "#815500" }
    },
    shape: { borderRadius: 10 },
    typography: {
      button: { fontWeight: 700, textTransform: "none" },
      fontFamily: '"Nunito", "Segoe UI", sans-serif',
      h1: { fontFamily: '"Baloo 2", "Nunito", sans-serif', fontWeight: 700 },
      h2: { fontFamily: '"Baloo 2", "Nunito", sans-serif', fontWeight: 700 },
      h3: { fontFamily: '"Baloo 2", "Nunito", sans-serif', fontWeight: 700 },
      h4: { fontFamily: '"Baloo 2", "Nunito", sans-serif', fontWeight: 700, letterSpacing: 0 },
      h5: { fontFamily: '"Baloo 2", "Nunito", sans-serif', fontWeight: 700, letterSpacing: 0 },
      h6: { fontFamily: '"Baloo 2", "Nunito", sans-serif', fontWeight: 700, letterSpacing: 0 }
    }
  });
}
