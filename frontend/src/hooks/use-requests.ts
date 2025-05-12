import { getRequests } from "@/api/requests";
import { useSuspenseQuery } from "@tanstack/react-query";

export type Request = {
  id: string;
  sender: { id: string; fullname: string; email: string; avatarUrl: string };
  receiver: { id: string; fullname: string; email: string; avatarUrl: string };
  status: "pending" | "rejected" | "accepted";
};

export function useRequests() {
  const { data, isLoading, isError } = useSuspenseQuery<Request[]>({
    queryKey: ["get_requests"],
    queryFn: getRequests,
  });

  return {
    requests: data,
    isLoading,
    isError,
  };
}
