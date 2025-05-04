import { LucideArrowDown } from "lucide-react";
import { LoadingPage } from "../loading";
import Message from "./message";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { Chat, FormattedChatMessage } from "../pages/chat";

interface Props {
  loading: boolean;
  thinking: boolean;
  chat: Chat | undefined;
}

const Messages = ({ loading, thinking, chat }: Props) => {
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [chat?.id, loading, thinking]);

  useEffect(() => {
    function handleScroll() {
      const isButtonVisible =
        document.documentElement.scrollHeight -
          window.scrollY -
          window.innerHeight >
        250;
      setShowScrollToBottom(isButtonVisible);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollDown = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div
      ref={chatContainerRef}
      className="w-full space-y-8 max-w-[800px] mx-auto px-4"
    >
      <Button
        size={"icon"}
        variant={"outline"}
        onClick={scrollDown}
        className={` ${
          showScrollToBottom ? "opacity-100" : "opacity-0"
        } fixed bottom-24 -translate-y-full left-1/2 -translate-x-1/2`}
      >
        <LucideArrowDown />
      </Button>
      {loading && <LoadingPage />}
      {!loading &&
        chat?.messages?.map((m: FormattedChatMessage, i) => {
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
};

export default Messages;
