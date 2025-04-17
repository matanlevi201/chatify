import { create } from "zustand";

type Profile = {
  displayName: string;
  email: string;
  avatarUrl: string;
  bio?: string;
};

interface ModalState {
  profile: Profile;
  setProfile: (profile: Partial<Profile>) => void;
}

export const useProfileStore = create<ModalState>((set) => ({
  profile: {
    displayName: "",
    email: "",
    avatarUrl: "",
    bio: "",
  },
  setProfile: (partialProfile) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...partialProfile,
      },
    })),
}));
