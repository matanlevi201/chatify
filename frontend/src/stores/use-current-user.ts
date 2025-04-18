import { create } from "zustand";

export type CurrentUser = {
  id: string;
  email: string;
};

interface CurrentUserState {
  currentUser: CurrentUser;
  setCurrentUser: (currentUser: CurrentUser) => void;
}

export const useCurrentUserStore = create<CurrentUserState>((set) => ({
  currentUser: {
    id: "",
    email: "",
  },
  setCurrentUser: (currentUser: CurrentUser) =>
    set(() => ({
      currentUser: currentUser,
    })),
}));
