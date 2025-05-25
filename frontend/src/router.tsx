// routes/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Onboard from "@/pages/on-board";
import AppLayout from "./pages/app-layout";
import BlankPage from "./pages/blank-page";
import Friends from "./pages/friends";
import MyProfile from "./pages/my-profile";
import ProfileSetup from "./pages/profile-setup";
import ConversationWindow from "./pages/conversation";

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
        element: <ConversationWindow />,
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
    path: "/profile-setup",
    element: (
      <>
        <SignedIn>
          <ProfileSetup />
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
