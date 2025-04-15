import AppHeader from "@/components/app-header";
import { useParams } from "react-router-dom";

function Chat() {
  const { chatId } = useParams();

  return (
    <div>
      <AppHeader>
        <div>Chat title</div>
      </AppHeader>
      Chat ID: {chatId}
    </div>
  );
}

export default Chat;
