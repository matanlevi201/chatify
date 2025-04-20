import { create } from "zustand";
import { useCurrentUserStore } from "./use-current-user";

type Request = {
  id: string;
  sender: { id: string; fullname: string; email: string; avatarUrl: string };
  receiver: { id: string; fullname: string; email: string; avatarUrl: string };
  status: "pending" | "rejected" | "accepted";
};

type RequestsState = {
  requests: Request[];
  incoming: Request[];
  sent: Request[];
  setRequests: (requests: Request[]) => void;
  addRequest: (request: Request) => void;
  addSentRequest: (request: Request) => void;
  addIncomingRequest: (request: Request) => void;
  removeSentRequest: (id: string) => void;
  removeIncomingRequest: (id: string) => void;
};

export const useRequestStore = create<RequestsState>((set) => ({
  requests: [],
  incoming: [],
  sent: [],
  setRequests: (requests: Request[]) => {
    const currentUser = useCurrentUserStore.getState().currentUser;
    return set(() => ({
      requests: requests,
      incoming: requests.filter(
        (req) => req.receiver.id === currentUser.id && req.status === "pending"
      ),
      sent: requests.filter(
        (req) => req.sender.id === currentUser.id && req.status === "pending"
      ),
    }));
  },
  addRequest: (request) =>
    set((state) => ({
      requests: [...state.requests, request],
    })),
  addSentRequest: (request) =>
    set((state) => ({
      sent: [...state.sent, request],
    })),
  addIncomingRequest: (request) =>
    set((state) => ({
      sent: [...state.sent, request],
    })),
  removeSentRequest: (id) =>
    set((state) => ({
      sent: state.sent.filter((req) => req.id !== id),
    })),
  removeIncomingRequest: (id) =>
    set((state) => ({
      incoming: state.incoming.filter((req) => req.id !== id),
    })),
}));
