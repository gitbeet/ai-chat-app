import { LoadingPage } from "@/components/loading";
import { useUserStore } from "@/store";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { v7 as uuid } from "uuid";
import SendMessageInput from "../chat/send-message-input";
import ChatSidebar from "../chat/chat-sidebar";
import Messages from "../chat/messages";
import { toast } from "sonner";

export type APIResponseChatMessage = { message: string; reply: string };
export type FormattedChatMessage = { role: "user" | "ai"; content: string };

export type Chat = {
  id: string;
  messages: FormattedChatMessage[];
  createdAt: Date;
};

type APIResponseChat = {
  id: string;
  messages: APIResponseChatMessage[];
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

  const getMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/get-messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        return toast.error("Error while getting the messages");
      }

      const result = await response.json();
      if (result.chats.length === 0) return;
      const formattedChats: Chat[] = [];
      result.chats.forEach((chat: APIResponseChat) => {
        const formattedMessages = chat.messages.flatMap(
          (msg: APIResponseChatMessage): FormattedChatMessage[] => [
            { role: "user", content: msg.message },
            { role: "ai", content: msg.reply },
          ]
        );
        const formattedChat: Chat = { ...chat, messages: formattedMessages };
        formattedChats.push(formattedChat);
      });
      setChats(formattedChats);
      setCurrentChatId(formattedChats[0].id);
    } catch (e) {
      console.error(e);
      toast.error("Error while getting the messages");
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (message.length === 0) return;

    // id for both cases
    const chatId = currentChatId || uuid();

    try {
      setThinking(true);
      const newMessage: FormattedChatMessage = {
        role: "user",
        content: message,
      };

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
            {
              id: chatId,
              createdAt: new Date(),
              messages: [newMessage],
            },
            ...prev,
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
          chatId,
        }),
        credentials: "include",
      });

      if (!response.ok || !response.body) {
        return toast.error("Error getting the response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const aiMessage: FormattedChatMessage = { role: "ai", content: "" };

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
      toast.error("Sorry, there was an error processing your request.");
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

  const deleteChat = async (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/delete-chat`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.userId,
            chatId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error("Error while deleting chat: ", error);
      toast.error("Error while deleting chat");
    }
  };

  useEffect(() => {
    if (!user) return;
    getMessages();
  }, [user, getMessages]);

  if (loadingUser) return <LoadingPage />;
  if (!loadingUser && !user) navigate("/");

  const emptyChatJsx = (chats.length === 0 || !currentChatId) && (
    <div className="grid place-content-center">
      <h1>Hey, how can I help you today?</h1>
    </div>
  );

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  return (
    <div className="flex h-[85dvh]">
      <ChatSidebar
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        chats={chats}
        deleteChat={deleteChat}
      />
      {!loading && (
        <main className="grid grid-rows-[1fr_auto] max-w-[800px] mx-auto gap-8  pt-12 min-h-full  w-full">
          {emptyChatJsx}
          <Messages
            chat={currentChat}
            loading={loading}
            thinking={thinking}
          />
          <SendMessageInput
            disabled={message.length === 0}
            value={message}
            onSubmit={sendMessage}
            onChange={(e) => setMessage(e.target.value)}
          />
        </main>
      )}
    </div>
  );
};

export default Chat;
