import { publishFriendAway, publishFriendOnline } from "@/events/pulishers";
import { useIdle } from "@uidotdev/usehooks";
import { useEffect } from "react";

function useUserActivity() {
  const idle = useIdle(300000);

  useEffect(() => {
    if (idle) publishFriendAway();
    if (!idle) publishFriendOnline();
  }, [idle]);
}

export default useUserActivity;
