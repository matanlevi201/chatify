import { useSocketStore } from "@/stores/use-socket-store";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

function InitializeSocket({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const connect = useSocketStore((state) => state.connect);
  const isConnected = useSocketStore((state) => state.isConnected);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSocket = async () => {
      const token = await getToken();
      if (token) await connect(token);
      setLoading(false);
    };

    initSocket();
  }, [getToken, connect]);

  if (loading || !isConnected) return <div>Connecting socket...</div>;

  return <>{children}</>;
}

export default InitializeSocket;
