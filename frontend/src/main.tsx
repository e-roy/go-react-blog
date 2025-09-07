import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../app/app.css";
import PageRouter from "../app/components/PageRouter";

// Main app component with lazy loading
function App() {
  return <PageRouter />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
