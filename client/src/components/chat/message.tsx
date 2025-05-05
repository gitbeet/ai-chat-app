import { FormattedChatMessage } from "../pages/chat";
import TextFormatter from "../text-formatter";
// import { LucideBot } from "lucide-react";

const Message = ({ message }: { message: FormattedChatMessage }) => {
  return (
    <div>
      {message.role === "user" && (
        <p className="p-4 w-fit rounded-md shadow-md bg-primary ml-auto text-white max-w-[70%] whitespace-pre-wrap">
          {message.content}
        </p>
      )}
      {message.role === "ai" && <TextFormatter text={message.content} />}
    </div>
  );
};

export default Message;
