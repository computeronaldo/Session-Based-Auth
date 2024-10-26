import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AuthProvider from "./contexts/AuthContext.jsx";
import GlobalStyles from "./GlobalStyles.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalStyles />
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
