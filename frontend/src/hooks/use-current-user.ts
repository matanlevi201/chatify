import { getCurrentUser } from "@/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export type CurrentUser = {
  id: string;
  email: string;
  fullname: string;
  avatarUrl: string;
  bio?: string;
};

export function useCurrentUser() {
  const { data, isLoading, isError } = useSuspenseQuery<CurrentUser>({
    queryKey: ["get_current_user"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  });

  return {
    currentUser: data,
    isLoading,
    isError,
  };
}
