import { createRoot } from "react-dom/client";
import "./index.css";

import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ThemeProvider } from "@/components/theme-provider";
import { ModalManager } from "./components/modal-manager";
import ToastWrapper from "./components/toasts/toast-wrapper";
import InitializeApp from "./components/initializers/initialize-app";
import InitializeSocket from "./components/initializers/initialize-socket";
import InitializeListeners from "./components/initializers/initialize-listeners";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <QueryClientProvider client={queryClient}>
      {/* <App /> */}
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <InitializeApp>
          <InitializeSocket>
            <InitializeListeners>
              <RouterProvider router={router} />
              <ModalManager />
              <ToastWrapper />
            </InitializeListeners>
          </InitializeSocket>
        </InitializeApp>
      </ThemeProvider>
    </QueryClientProvider>
  </ClerkProvider>
  // </StrictMode>
);
