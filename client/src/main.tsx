import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { Toaster } from "sonner";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <UserProvider>
        <ThemeProvider>
          <>
          <App />
          <Toaster richColors position="top-center" />
        </>
        </ThemeProvider>
      </UserProvider>
  </StrictMode>
);
