import { LoadingPage } from "@/components/loading";
import { useUserStore } from "@/store";
import { LucideArrowDown, LucidePlus, LucideSend } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import Message from "../message";
import { Textarea } from "../ui/textarea";
import { v7 as uuid } from "uuid";

export type ChatMessage = { message: string; reply: string };
export type FormattedMessage = { role: "user" | "ai"; content: string };

export type Chat = {
  id: string;
  messages: FormattedMessage[];
  createdAt: Date;
};

const Chat = () => {
  const navigate = useNavigate();
  const { user, loading: loadingUser } = useUserStore();

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // loading the page
  const [loading, setLoading] = useState(true);
  // for when the AI is thinking of a response
  const [thinking, setThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const getMessages = async () => {
    setLoading(true);
    try {
      const responseJSON = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/get-messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.userId,
          }),
        }
      );
      const response = await responseJSON.json();
      if (response.chats.length === 0) return;
      response.chats.forEach((chat) => {
        const formattedMessages = chat.messages.flatMap(
          (msg: ChatMessage): FormattedMessage[] => [
            { role: "user", content: msg.message },
            { role: "ai", content: msg.reply },
          ]
        );
        chat.messages = formattedMessages;
      });
      setChats(response.chats);
      setCurrentChatId(response.chats[0].id);
      console.log(response.chats);
    } catch (error) {
      alert(`Error:${error}`);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (message.length === 0) return;

    // id for both cases
    const chatId = currentChatId || uuid();

    try {
      setThinking(true);
      const newMessage: FormattedMessage = { role: "user", content: message };

      // update state regardless
      setChats((prev) => {
        const existingChat = prev.find((chat) => chat.id === chatId);
        if (existingChat) {
          return prev.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [...chat.messages, newMessage] }
              : chat
          );
        } else {
          return [
            ...prev,
            {
              id: chatId,
              createdAt: new Date(),
              messages: [newMessage],
            },
          ];
        }
      });

      // set the id
      if (!currentChatId) {
        setCurrentChatId(chatId);
      }

      // reset input
      setMessage("");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userId: user?.userId,
          chatId,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const aiMessage: FormattedMessage = { role: "ai", content: "" };

      setThinking(false);

      // append an empty message
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );

      // while chunks are incoming -> populate latest ai response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiMessage.content += chunk;

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((m, i) =>
                    i === chat.messages.length - 1 ? { ...aiMessage } : m
                  ),
                }
              : chat
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "ai",
                    content:
                      "Sorry, there was an error processing your request.",
                  },
                ],
              }
            : chat
        )
      );
    }
  };

  useEffect(() => {
    if (!user) return;
    getMessages();
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }, 10);
  }, [currentChatId, chats, loading, thinking]);

  useEffect(() => {
    const container = chatContainerRef.current;
    function handleScroll() {
      if (!container) return;
      const isButtonVisible =
        container.scrollHeight - container.scrollTop - container.clientHeight >
        250;
      setShowScrollToBottom(isButtonVisible);
    }

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [chatContainerRef.current]);

  const scrollDown = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loadingUser) return <LoadingPage />;
  if (!loadingUser && !user) navigate("/");

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const inputJsx = (
    <div>
      <form
        onSubmit={sendMessage}
        className="relative"
      >
        <Textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything!"
          className="w-full resize-none scrollbar-none pr-14"
        />
        <Button
          disabled={message.length === 0}
          type="submit"
          className="absolute right-3 top-3"
        >
          <LucideSend />
        </Button>
      </form>
    </div>
  );

  const sidebarJsx = (
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

  const emptyChatJsx = (chats.length === 0 || !currentChatId) && (
    <div className="grid place-content-center">
      <h1>Hey, how can I help you today?</h1>
    </div>
  );

  const chatsJsx = chats.length !== 0 && (
    <div
      ref={chatContainerRef}
      className="overflow-auto py-4 space-y-8 scrollbar-none"
    >
      <Button
        size={"icon"}
        variant={"outline"}
        onClick={scrollDown}
        className={` ${
          showScrollToBottom ? "opacity-100" : "opacity-0"
        } sticky top-full -translate-y-full left-1/2 -translate-x-1/2`}
      >
        <LucideArrowDown />
      </Button>
      {loading && <LoadingPage />}
      {!loading &&
        currentChat?.messages?.map((m: FormattedMessage, i) => {
          return (
            <Message
              key={i}
              message={m}
            />
          );
        })}
      {thinking && (
        <div className="w-full py-8  grid place-content-center">
          <LoadingPage />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  return (
    <div className="flex h-[85dvh]">
      {sidebarJsx}
      {!loading && (
        <main className="grid grid-rows-[1fr_auto] max-w-[800px] mx-auto gap-8  pt-12 min-h-full  w-full">
          {emptyChatJsx}
          {chatsJsx}
          {inputJsx}
        </main>
      )}
    </div>
  );
};

export default Chat;
