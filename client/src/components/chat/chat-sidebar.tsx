import { LucidePlus } from "lucide-react";
import { Button } from "../ui/button";
import { Chat } from "../pages/chat";

interface Props {
  currentChatId: string | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
  chats: Chat[];
}

const ChatSidebar = ({ currentChatId, setCurrentChatId, chats }: Props) => {
  return (
    <div className="w-64 border-y border-r border-secondary py-8 h-[85dvh] rounded shadow absolute space-y-4">
      <Button
        onClick={() => setCurrentChatId(null)}
        className="ml-4"
      >
        <LucidePlus />
        New chat
      </Button>
      {chats.length !== 0 && (
        <ul className="py-4">
          {chats.map((chat) => (
            <li
              onClick={() => setCurrentChatId(chat.id)}
              key={chat.id}
              className={`truncate py-3 text-sm px-4 border-y cursor-pointer ${
                chat.id === currentChatId
                  ? "bg-muted border-secondary"
                  : " border-transparent"
              }`}
            >
              {chat.messages[0].content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default ChatSidebar;
