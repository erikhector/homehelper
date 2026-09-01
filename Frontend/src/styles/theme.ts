import { createTheme } from "@mui/material/styles";

import type { PaletteMode } from "@mui/material";

export default function createAppTheme(mode: PaletteMode) {
  const isDarkMode = mode === "dark";

  return createTheme({
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } }
    },
    palette: {
      background: { default: isDarkMode ? "#17131f" : "#faf8fc", paper: isDarkMode ? "#241d2c" : "#ffffff" },
      error: { main: isDarkMode ? "#ffb4ab" : "#ba1a1a" },
      mode,
      primary: { dark: isDarkMode ? "#efe7ff" : "#4b167f", light: isDarkMode ? "#493761" : "#ece2fa", main: isDarkMode ? "#c9adff" : "#6d38ae" },
      secondary: { main: isDarkMode ? "#f2b8d2" : "#a72d64" },
      success: { main: isDarkMode ? "#9bd5ae" : "#286a43" },
      text: { primary: isDarkMode ? "#e9e0eb" : "#251c29", secondary: isDarkMode ? "#cec1d0" : "#665b69" },
      warning: { main: isDarkMode ? "#ffdca8" : "#815500" }
    },
    shape: { borderRadius: 8 },
    typography: {
      button: { fontWeight: 700, textTransform: "none" },
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
      h4: { fontWeight: 700, letterSpacing: 0 },
      h5: { fontWeight: 700, letterSpacing: 0 },
      h6: { fontWeight: 700, letterSpacing: 0 }
    }
  });
}
