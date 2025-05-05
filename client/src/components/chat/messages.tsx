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

  function handleScroll() {
    const container = chatContainerRef.current;
    if (!container) return;
    const isButtonVisible =
      container.scrollHeight - container.scrollTop - container.clientHeight >
      250;
    setShowScrollToBottom(isButtonVisible);
  }

  useEffect(() => {
    const container = chatContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    handleScroll();
  }, [chatContainerRef, chat]);

  const scrollDown = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Button
        size={"icon"}
        variant={"secondary"}
        onClick={scrollDown}
        className={` ${
          showScrollToBottom ? "opacity-100" : "opacity-0"
        } fixed bottom-36 -translate-y-full left-1/2 -translate-x-1/2 z-10`}
      >
        <LucideArrowDown />
      </Button>
      <div
        ref={chatContainerRef}
        className="fixed scrollbar-none top-24 bottom-36 w-full overflow-y-auto left-1/2 -translate-x-1/2 space-y-8 max-w-[800px] mx-auto px-4"
      >
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
          <div className="w-full py-8 grid place-content-center">
            <LoadingPage />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
};

export default Messages;
