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

  const categories: Record<string, Chat[]> = {};

  // sort the chats into the categories
  chats.forEach((chat) => {
    const date = chat.createdAt;
    if (isToday(date)) {
      if (!categories["Today"]) categories["Today"] = [];
      categories.Today.push(chat);
    } else if (isYesterday(date)) {
      if (!categories["Yesterday"]) categories["Yesterday"] = [];
      categories.Yesterday.push(chat);
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
      if (!categories["This Week"]) categories["This Week"] = [];
      categories["This Week"].push(chat);
    } else if (isThisMonth(date)) {
      if (!categories["This Month"]) categories["This Month"] = [];
      categories["This Month"].push(chat);
    } else {
      const year = getYear(date);
      if (year === currentYear) {
        const monthName = format(date, "LLLL");
        if (!categories[monthName]) categories[monthName] = [];
        categories[monthName].push(chat);
      } else {
        if (!categories[year]) categories[year] = [];
        categories[year].push(chat);
      }
    }
  });

  // order the chats in each category (they are still unsorted, just being put into categories)
  for (const category in categories) {
    categories[category].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // order the categories
  const final = Object.entries(categories).map(([category, items]) => ({
    label: category,
    chats: items,
  }));

  final.sort(
    (a, b) =>
      new Date(b.chats[0]?.createdAt).getTime() -
      new Date(a.chats[0]?.createdAt).getTime()
  );

  return final;
}

interface Props {
  currentChatId: string | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
  chats: Chat[];
  renameChat: (chatId: string, name: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}

const ChatSidebar = ({
  currentChatId,
  setCurrentChatId,
  chats,
  renameChat,
  deleteChat,
}: Props) => {
  const [show, setShow] = useState(true);
  const toggleSidebar = () => setShow((prev) => !prev);

  const categories = groupChatsByTime(chats);
  console.log(categories);

  return (
    <aside
      className={` ${
        show ? "" : "-translate-x-full"
      } transition w-64 border-r border-secondary py-16 pb-8 h-screen top-0 fixed shadow-md space-y-4 bg-card z-20`}
    >
      <div className="absolute translate-x-full -right-2 top-16 bg-card border border-secondary p-2 rounded-md shadow flex flex-col gap-2  transition">
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
      <div className="max-h-[90%] overflow-y-auto space-y-4 scrollbar-thin">
        {chats.length !== 0 && (
          <>
            {categories.map(
              (category) =>
                category.chats.length !== 0 && (
                  <div key={category.label}>
                    <p className="text-xs pl-6 mb-2 text-card-foreground/50">
                      {category.label}
                    </p>
                    <ul>
                      {category.chats.map((chat) => (
                        <SidebarChatListElement
                          key={chat.id}
                          chat={chat}
                          currentChatId={currentChatId}
                          deleteChat={deleteChat}
                          renameChat={renameChat}
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
