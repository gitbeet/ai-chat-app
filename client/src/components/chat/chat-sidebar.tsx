import {
  LucideMessageSquarePlus,
  LucideSidebar,
  LucideSidebarClose,
} from "lucide-react";
import { Button } from "../ui/button";
import { Chat } from "../pages/chat";
import { useState } from "react";

import {
  isToday,
  isThisWeek,
  isThisMonth,
  format,
  getYear,
  isYesterday,
} from "date-fns";
import SidebarChatListElement from "./sidebar-chat-list-element";

function groupChatsByTime(chats: Chat[]) {
  const now = new Date();
  const currentYear = getYear(now);

  const categories: Record<string, Chat[]> = {
    Today: [],
    "Yesterday": [],
    "This Week": [],
    "Last Week": [],
    "This Month": [],
  };

  chats.forEach((chat) => {
    const date = chat.createdAt;

    if (isToday(date)) {
      categories.Today.push(chat);
    } else if (isYesterday(date)) {
      categories.Yesterday.push(chat);
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
      categories["This Week"].push(chat);
    } else if (isThisMonth(date)) {
      categories["This Month"].push(chat);
    } else {
      const year = getYear(date);
      if (year === currentYear) {
        const monthName = format(date, "LLLL"); // e.g. 'January'
        if (!categories[monthName]) categories[monthName] = [];
        categories[monthName].push(chat);
      } else {
        if (!categories[year]) categories[year] = [];
        categories[year].push(chat);
      }
    }
  });

  return categories;
}

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

  const categories = groupChatsByTime(chats);

  return (
    <aside
      className={` ${
        show ? "" : "-translate-x-full"
      } transition w-64 border-r border-secondary pt-16 pb-8 h-screen top-0  fixed shadow-md space-y-4 bg-card z-10`}
    >
      <div className="absolute translate-x-full -right-2 top-16 bg-card border border-secondary p-2 rounded-md shadow flex flex-col gap-2 opacity-50 hover:opacity-100 transition">
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={toggleSidebar}
        >
          {show ? (
            <LucideSidebarClose className="!h-5 !w-5" />
          ) : (
            <LucideSidebar className="!h-5 !w-5" />
          )}
        </Button>
        <Button
          size={"icon"}
          onClick={() => setCurrentChatId(null)}
        >
          <LucideMessageSquarePlus className="!h-5 !w-5" />
        </Button>
      </div>
      <Button
        onClick={() => setCurrentChatId(null)}
        className="ml-4 mb-8"
        size={"sm"}
      >
        <LucideMessageSquarePlus className="!h-5 !w-5" />
        New chat
      </Button>
      <div className="max-h-2/3  overflow-auto space-y-4">
        {chats.length !== 0 && (
          <>
            {Object.entries(categories).map(
              ([category, chats]) =>
                chats.length !== 0 && (
                  <div key={category}>
                    <p className="text-xs pl-6 mb-2 text-card-foreground/50">
                      {category}
                    </p>
                    <ul>
                      {chats.map((chat) => (
                        <SidebarChatListElement
                          key={chat.id}
                          chat={chat}
                          currentChatId={currentChatId}
                          deleteChat={deleteChat}
                          setCurrentChatId={setCurrentChatId}
                        />
                      ))}
                    </ul>
                  </div>
                )
            )}
          </>
        )}
      </div>
    </aside>
  );
};
export default ChatSidebar;
