import { createMuiTheme } from "@material-ui/core/styles";

const adminTheme = createMuiTheme({
  palette: {
    primary: { main: "#e11d48" },
    secondary: { main: "#0f172a" },
    background: {
      default: "#f4f7fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Be Vietnam Pro", "Inter", "Segoe UI", sans-serif',
    h4: { fontWeight: 900 },
    h5: { fontWeight: 900 },
    h6: { fontWeight: 800 },
    subtitle1: { fontWeight: 700 },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          background:
            "radial-gradient(circle at top left, rgba(225,29,72,0.08), transparent 28%), linear-gradient(180deg, #f4f7fb 0%, #eef2ff 100%)",
        },
      },
    },
    MuiAppBar: {
      colorSecondary: {
        background:
          "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.92))",
        boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 18,
      },
    },
    MuiCard: {
      root: {
        borderRadius: 20,
        boxShadow: "0 14px 35px rgba(15,23,42,0.08)",
      },
    },
    MuiButton: {
      containedPrimary: {
        borderRadius: 999,
        boxShadow: "none",
        textTransform: "none",
        fontWeight: 800,
      },
    },
    MuiTableCell: {
      head: {
        fontWeight: 800,
      },
    },
  },
});

export default adminTheme;
