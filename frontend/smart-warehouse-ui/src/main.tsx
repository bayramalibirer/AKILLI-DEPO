import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0d9488",
      light: "#2dd4bf",
      dark: "#0f766e"
    },
    secondary: {
      main: "#ea580c",
      light: "#fb923c",
      dark: "#c2410c"
    },
    background: {
      default: "#f0fdfa",
      paper: "#ffffff"
    },
    text: {
      primary: "#134e4a",
      secondary: "#54716e"
    }
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#134e4a"
    },
    h5: {
      fontWeight: 700,
      color: "#134e4a"
    },
    body1: {
      color: "#134e4a"
    }
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 12,
          padding: "10px 20px"
        },
        contained: {
          boxShadow: "0 2px 8px rgba(13, 148, 136, 0.35)"
        },
        containedSecondary: {
          boxShadow: "0 2px 8px rgba(234, 88, 12, 0.35)"
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(15, 118, 110, 0.08)",
          border: "1px solid rgba(13, 148, 136, 0.12)"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#ffffff"
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 4,
          borderRadius: 2,
          backgroundColor: "#0d9488"
        },
        flexContainer: {
          gap: 8
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem"
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: "0 24px 48px rgba(15, 118, 110, 0.15)"
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          color: "#134e4a",
          borderBottom: "2px solid rgba(13, 148, 136, 0.2)",
          paddingBottom: 2
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(13, 148, 136, 0.06)",
            borderBottom: "2px solid rgba(13, 148, 136, 0.2)"
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(13, 148, 136, 0.04)"
          }
        }
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
