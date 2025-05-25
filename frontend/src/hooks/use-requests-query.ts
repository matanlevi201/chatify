import { getRequests } from "@/api/requests";
import { useQuery } from "@tanstack/react-query";

export type Request = {
  id: string;
  sender: { id: string; fullname: string; email: string; avatarUrl: string };
  receiver: { id: string; fullname: string; email: string; avatarUrl: string };
  status: "pending" | "rejected" | "accepted";
};

export function useRequestsQuery() {
  const useRequestsQuery = useQuery<Request[]>({
    queryKey: ["get_requests"],
    queryFn: getRequests,
  });

  return useRequestsQuery;
}
