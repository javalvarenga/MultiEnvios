import React from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider, App as AntApp, theme as antdTheme } from "antd";
import esES from "antd/locale/es_ES";
import "antd/dist/reset.css";
import App from "App";
import "./styles/neon.scss";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("No se encontro el elemento #root");
}

createRoot(rootEl).render(
  <React.StrictMode>
    <ConfigProvider
      locale={esES}
      theme={{
        algorithm: antdTheme.darkAlgorithm,
        token: {
          colorPrimary: "#00b4d8",
          borderRadius: 8,
        },
      }}
    >
      <AntApp>
        <App />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>,
);
