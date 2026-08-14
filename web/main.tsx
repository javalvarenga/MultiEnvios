import React from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider, App as AntApp, theme as antdTheme } from "antd";
import esES from "antd/locale/es_ES";
import "antd/dist/reset.css";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App";
import "./styles/neon.scss";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("No se encontro el elemento #root");
}

const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
    background: { default: "#f5f5f5", paper: "#ffffff" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: [
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

createRoot(rootEl).render(
  <React.StrictMode>
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ConfigProvider
        locale={esES}
        theme={{
          algorithm: antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: "#1976d2",
            borderRadius: 8,
          },
        }}
      >
        <AntApp>
          <App />
        </AntApp>
      </ConfigProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
