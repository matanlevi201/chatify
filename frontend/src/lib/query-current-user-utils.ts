import { CurrentUser } from "@/hooks/use-current-user";
import { QueryClient } from "@tanstack/react-query";

export const setUserProfile = (
  queryClient: QueryClient,
  profile: Partial<Omit<CurrentUser, "id" | "email">>
) => {
  queryClient.setQueryData<CurrentUser>(["get_current_user"], (old) => {
    if (old) return { ...old, ...profile };
  });
};
