"use client";

import { LoadingSpinner } from "@/components/loading";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store";
import { LucideBot, LucideRocket } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";

type ChatMessage = { message: string; reply: string };
type FormattedMessage = { role: "user" | "ai"; content: string };

// Format AI messages for better display
const formatMessage = (text: string) => {
  if (!text) return "";
  const cleanHTML = DOMPurify.sanitize(text);

  return cleanHTML
    .replace(/\n/g, "<br>") // Preserve line breaks
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold text
    .replace(/\*(.*?)\*/g, "<i>$1</i>") // Italic text
    .replace(/`(.*?)`/g, "<code>$1</code>") // Inline code
    .replace(/(?:^|\n)- (.*?)(?:\n|$)/g, "<li>$1</li>") // Bullet points
    .replace(/(?:^|\n)(\d+)\. (.*?)(?:\n|$)/g, "<li>$1. $2</li>") // Numbered lists
    .replace(/<\/li>\n<li>/g, "</li><li>") // Ensure list continuity
    .replace(/<li>/, "<ul><li>") // Wrap in `<ul>`
    .replace(/<\/li>$/, "</li></ul>"); // Close the `<ul>`
};

const Page = () => {
  const { user } = useUserStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<FormattedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = user?.email.replace(/[^a-zA-Z0-9_-]/g, "_");

  const getMessages = async () => {
    console.log(userId);
    try {
      const responseJSON = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
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
      console.log(formattedMessages);
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
    setSending(true);
    try {
      const responseJSON = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            userId,
          }),
        }
      );
      const response = await responseJSON.json();
      setMessages((prev) => [...prev, { role: "ai", content: response.reply }]);
      setMessage("");
    } catch (error) {
      alert(`Error while sending message: ${error}`);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    getMessages();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, sending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="grid grid-rows-[1fr_auto] max-w-[900px] mx-auto gap-8  pt-12 min-h-full h-[80dvh]">
      <div className="border shadow  rounded overflow-auto p-4">
        {loading && (
          <div className="grid place-content-center h-full">
            <LoadingSpinner />
          </div>
        )}
        {!loading &&
          messages?.map((m: FormattedMessage, i) => {
            return (
              <div key={i}>
                {m.role === "user" && (
                  <p className="p-4  w-fit rounded-md bg-primary text-secondary ml-auto">
                    {m.content}
                  </p>
                )}
                {m.role === "ai" && (
                  <div className="flex items-start gap-4  p-4">
                    <div className=" rounded-md border p-2 ">
                      <LucideBot className="w-8 h-8" />
                    </div>
                    <p
                      className="w-fit rounded  mr-auto"
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(m.content),
                      }}
                    ></p>
                  </div>
                )}
              </div>
            );
          })}
        {sending && (
          <div className="w-full py-8 grid place-content-center">
            <LoadingSpinner />
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
            variant="default"
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
