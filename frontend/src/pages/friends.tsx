import { getRequests } from "@/api/requests";
import AllFriends from "@/components/friends-all";
import AppHeader from "@/components/app-header";
import IncomingRequests from "@/components/friends-incoming-requests";
import SentRequests from "@/components/friends-sent-requests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRequestStore } from "@/stores/use-requests-store";
import { useQuery } from "@tanstack/react-query";
import SearchUsers from "@/components/friends-search";

function Friends() {
  const { setRequests } = useRequestStore();
  const { isError, isLoading } = useQuery({
    queryKey: ["get_requets"],
    queryFn: async () => {
      const data = await getRequests();
      setRequests(data);
      return data;
    },
  });

  if (isLoading) return;
  if (isError) return;
  return (
    <div>
      <AppHeader>
        <div>Friends</div>
      </AppHeader>
      <div className="p-6">
        <SearchUsers />
        <Tabs defaultValue="all-friends" className="space-y-4">
          <TabsList className="grid min-w-[250px] grid-cols-2">
            <TabsTrigger value="all-friends">All Friends</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>
          <TabsContent value="all-friends">
            <AllFriends />
          </TabsContent>
          <TabsContent value="requests" className="space-y-4">
            <IncomingRequests />
            <SentRequests />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Friends;
