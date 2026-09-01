import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: { default: "#f6f7f2", paper: "#ffffff" },
    primary: { main: "#176b5b", dark: "#0f5145", light: "#dcefe8" },
    secondary: { main: "#d96c43" },
    success: { main: "#3c805f" },
    warning: { main: "#8a590c" },
    text: { primary: "#20302d", secondary: "#66736e" }
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    h4: { fontWeight: 700, letterSpacing: 0 },
    h5: { fontWeight: 700, letterSpacing: 0 },
    h6: { fontWeight: 700, letterSpacing: 0 },
    button: { fontWeight: 700, textTransform: "none" }
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } }
  }
});

export default theme;
