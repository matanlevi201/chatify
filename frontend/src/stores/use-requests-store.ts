import { create } from "zustand";
import { useCurrentUserStore } from "./use-current-user";

type Request = {
  id: number;
  sender: { id: string; fullname: string; email: string; avatarUrl: string };
  receiver: { id: string; fullname: string; email: string; avatarUrl: string };
  status: "pending" | "rejected" | "accepted";
};

type RequestsState = {
  requests: Request[];
  setRequests: (requests: Request[]) => void;
  addRequest: (request: Request) => void;
  sentRequests: () => Request[];
  incomingRequests: () => Request[];
};

export const useRequestStore = create<RequestsState>((set, get) => ({
  requests: [],
  setRequests: (requests: Request[]) =>
    set(() => ({
      requests: requests,
    })),
  addRequest: (request) =>
    set((state) => ({
      requests: [...state.requests, request],
    })),
  sentRequests: () => {
    const currentUser = useCurrentUserStore.getState().currentUser;
    return get().requests.filter((req) => req.sender.id === currentUser.id);
  },
  incomingRequests: () => {
    const currentUser = useCurrentUserStore.getState().currentUser;
    return get().requests.filter((req) => req.receiver.id === currentUser.id);
  },
}));
