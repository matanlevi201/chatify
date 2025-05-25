import { getFriends } from "@/api/friends";
import { useQuery } from "@tanstack/react-query";

function useFriendsQuery() {
  const friendsQuery = useQuery<
    { id: string; fullname: string; email: string; avatarUrl: string }[]
  >({
    queryKey: ["get_friends"],
    queryFn: async () => {
      const data = await getFriends();
      return data;
    },
  });

  return friendsQuery;
}

export default useFriendsQuery;
