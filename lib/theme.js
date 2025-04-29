// kidzy-frontend/kidzy/lib/theme.js
import "@fontsource/jaldi"; // “Jaldi” @ weights 400–700
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FBFCED", // your brand color
      contrastText: "#333", // readable on top of #FBFCED
    },
    secondary: {
      main: "#A3B18A", // gentle accent
    },
    background: {
      default: "#FFFFFF",
      paper: "#FBFCED",
    },
    text: {
      primary: "#212121",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "'Jaldi', sans-serif",
    h1: { fontWeight: 700, lineHeight: 1.2 },
    h2: { fontWeight: 700, lineHeight: 1.3 },
    h3: { fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // MUI’s spacing(1) === 8px
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "0.6rem 1.2rem",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: {
          padding: "1rem",
        },
      },
    },
  },
});

// give all your typography a smooth, responsive scale
theme = responsiveFontSizes(theme);

export default theme;
