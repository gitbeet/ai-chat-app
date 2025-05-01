import { LucideArrowDown } from "lucide-react";
import { LoadingPage } from "../loading";
import Message from "./message";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { Chat, FormattedMessage } from "../pages/chat";

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
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }, 10);
  }, [chat?.id, loading, thinking]);

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
    // it gets a warning but it works
  }, [chatContainerRef.current]);

  const scrollDown = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
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
        chat?.messages?.map((m: FormattedMessage, i) => {
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
