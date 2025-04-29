import { LoadingPage } from "@/components/loading";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store";
import { LucideRocket } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import Message from "../message";

export type ChatMessage = { message: string; reply: string };
export type FormattedMessage = { role: "user" | "ai"; content: string };

const Chat = () => {
  const { user, loading: loadingUser } = useUserStore();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<FormattedMessage[]>([]);

  // loading the page
  const [loading, setLoading] = useState(true);
  // for when the AI is thinking of a response
  const [thinking, setThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const getMessages = async () => {
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

      const formattedMessages = response.messages.flatMap(
        (msg: ChatMessage): FormattedMessage[] => [
          { role: "user", content: msg.message },
          { role: "ai", content: msg.reply },
        ]
      );
      setMessages(formattedMessages);
    } catch (error) {
      alert(`Error:${error}`);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (message.length === 0) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    // loading while waiting for the stream to start
    setThinking(true);
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userId: user?.userId,
        }),
      });

      if (!response.ok) {
        // TODO: toast to display a potential error
        throw new Error(await response.text());
      }

      if (!response.body) {
        // TODO: toast to display a potential error
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const aiMessage: FormattedMessage = { role: "ai", content: "" };

      // Loading gone as soon as the stream starts
      setThinking(false);
      // Add empty AI message to start receiving the stream
      setMessages((prev) => [...prev, aiMessage]);

      while (true) {
        // read each chunk as long as we are not done
        const { done, value } = await reader.read();
        // break when done
        if (done) break;

        // decode chunk and append to the message
        const chunk = decoder.decode(value, { stream: true });
        aiMessage.content += chunk;

        // update the last message each time we read another chunk
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...aiMessage };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    }
  };

  useEffect(() => {
    if (!user) return;
    getMessages();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages, loading, thinking]);

  if (loadingUser) return <LoadingPage />;
  if (!loadingUser && !user) navigate("/");
  return (
    <main className="grid grid-rows-[1fr_auto] max-w-[900px] mx-auto gap-8  pt-12 min-h-full h-[85dvh]">
      <div className=" overflow-auto p-4 space-y-4">
        {loading && <LoadingPage />}
        {!loading &&
          messages?.map((m: FormattedMessage, i) => {
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
      <div>
        <form
          onSubmit={sendMessage}
          className="relative"
        >
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type something..."
            className="w-full h-12"
          />
          <Button
            disabled={message.length === 0}
            type="submit"
            className="absolute right-2 top-1.5"
          >
            <LucideRocket />
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Chat;
