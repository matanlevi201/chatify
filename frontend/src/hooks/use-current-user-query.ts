import { getCurrentUser } from "@/api";
import { useQuery } from "@tanstack/react-query";

export type CurrentUser = {
  id: string;
  email: string;
  fullname: string;
  avatarUrl: string;
  bio?: string;
};

export function useCurrentUserQuery() {
  const currentUserQuery = useQuery<CurrentUser>({
    queryKey: ["get_current_user"],
    queryFn: getCurrentUser,
  });

  return currentUserQuery;
}
