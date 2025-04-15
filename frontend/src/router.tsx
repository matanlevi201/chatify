// routes/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Onboard from "@/pages/on-board";
import AppLayout from "./pages/app-layout";
import BlankPage from "./pages/blank-page";
import Chat from "./pages/chat";
import Friends from "./pages/friends";
import MyProfile from "./pages/my-profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <SignedOut>
          <RedirectToSignIn signUpForceRedirectUrl="/onboard" />
        </SignedOut>
        <SignedIn>
          <AppLayout />
        </SignedIn>
      </>
    ),
    children: [
      {
        index: true,
        element: <BlankPage />,
      },
      {
        path: "chat/:chatId",
        element: <Chat />,
      },
      {
        path: "friends",
        element: <Friends />,
      },
      {
        path: "profile",
        element: <MyProfile />,
      },
    ],
  },
  {
    path: "/onboard",
    element: (
      <>
        <SignedIn>
          <Onboard />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn signUpForceRedirectUrl="/onboard" />
        </SignedOut>
      </>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default router;
