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

const Page = () => {
  const { user, loading: loadingUser } = useUserStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<FormattedMessage[]>([]);
  const [loading, setLoading] = useState(true);
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
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setThinking(true);
    try {
      const responseJSON = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userId: user?.userId,
        }),
      });
      const response = await responseJSON.json();
      setMessages((prev) => [...prev, { role: "ai", content: response.reply }]);
      setMessage("");
    } catch (error) {
      alert(`Error while sending message: ${error}`);
    } finally {
      setThinking(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    getMessages();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, thinking]);

  if (loadingUser) return <LoadingPage />;
  if (!loadingUser && !user) navigate("/");
  return (
    <main className="grid grid-rows-[1fr_auto] max-w-[900px] mx-auto gap-8  pt-12 min-h-full h-[80dvh]">
      <div className="border shadow  rounded overflow-auto p-4">
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

export default Page;
