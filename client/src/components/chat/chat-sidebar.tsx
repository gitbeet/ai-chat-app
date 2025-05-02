import {
  LucidePlus,
  LucideSidebarClose,
  LucideSidebarOpen,
  LucideTrash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Chat } from "../pages/chat";
import { useState } from "react";

interface Props {
  currentChatId: string | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
  chats: Chat[];
  deleteChat: (chatId: string) => Promise<void>;
}

const ChatSidebar = ({
  currentChatId,
  setCurrentChatId,
  chats,
  deleteChat,
}: Props) => {
  const [show, setShow] = useState(true);
  const toggleSidebar = () => setShow((prev) => !prev);

  return (
    <aside
      className={` ${
        show ? "" : "-translate-x-full"
      } transition w-64 border-y border-r border-secondary py-8 h-[85dvh] rounded absolute shadow-md space-y-4 bg-card z-10`}
    >
      <Button
        onClick={toggleSidebar}
        size={"lg"}
        className="absolute right-0 translate-x-full rounded-l-none"
      >
        {show ? <LucideSidebarClose /> : <LucideSidebarOpen />}
      </Button>
      <Button
        onClick={() => setCurrentChatId(null)}
        className="ml-4"
      >
        <LucidePlus />
        New chat
      </Button>
      {chats.length !== 0 && (
        <ul className="py-4 overflow-y-auto h-full m-0">
          {chats.map((chat) => (
            <li
              onClick={() => setCurrentChatId(chat.id)}
              key={chat.id}
              className={` border relative group max-w-full py-3 text-sm mx-4 rounded-md px-4  cursor-pointer ${
                chat.id === currentChatId
                  ? "bg-background  border-secondary "
                  : " border-transparent"
              }`}
            >
              <p className="max-w-full truncate">{chat.messages[0].content}</p>
              <Button
                onClick={() => deleteChat(chat.id)}
                variant={"secondary"}
                size={"xs"}
                className={` ${
                  currentChatId === chat.id
                    ? "opacity-0 group-hover:opacity-100"
                    : "opacity-0 group-hover:opacity-50"
                } hover:opacity-100  transition absolute top-1/2 -translate-y-1/2 right-1`}
              >
                <LucideTrash2 />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};
export default ChatSidebar;
