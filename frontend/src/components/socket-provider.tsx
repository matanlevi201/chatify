import { useSocket } from "@/stores/use-socket";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export function SocketProvider({ children }: Props) {
  const { getToken, isSignedIn } = useAuth();
  const initSocket = useSocket((state) => state.initSocket);
  const isReady = useSocket((state) => state.isReady);
  const socket = useSocket((state) => state.socket);
  const socketQuery = useQuery({
    queryKey: ["set_scoket"],
    queryFn: async () => {
      if (!isSignedIn) return;
      const token = await getToken();
      if (token) {
        await initSocket(token);
      }
      return { isSocketConnected: true };
    },
    enabled: !isReady,
  });

  if (socketQuery.isPending) return <div>Connecting socket...</div>;
  if (socketQuery.isError) return <div>Error connection socket...</div>;

  if (!isReady || !socket) return <div>Loading...</div>;

  return <>{children}</>;
}
