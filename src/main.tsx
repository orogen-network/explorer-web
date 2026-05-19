import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { setApi } from "./api";
import { PolkadotChainApi } from "./polkadot-api";
import "./styles/global.css";

// VITE_WS_ENDPOINT overrides at build time; defaults to the public forge testnet.
const wsEndpoint =
  (import.meta.env.VITE_WS_ENDPOINT as string | undefined) ??
  "wss://chain.orogen.network";

setApi(new PolkadotChainApi(wsEndpoint));

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
