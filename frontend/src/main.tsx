import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ThemeProvider } from "@/components/theme-provider";
import { ModalManager } from "./components/modal-manager";
import ToastWrapper from "./components/toasts/toast-wrapper";
import { SocketProvider } from "./stores/use-socket-context";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <QueryClientProvider client={queryClient}>
      {/* <App /> */}
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SocketProvider>
          <RouterProvider router={router} />
          <ModalManager />
          <ToastWrapper />
        </SocketProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ClerkProvider>
);
