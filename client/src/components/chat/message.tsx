import { FormattedChatMessage } from "../pages/chat";
import TextFormatter from "../text-formatter";
import CopyButton from "../ui/copy-button";
// import { LucideBot } from "lucide-react";

const Message = ({
  message,
  streamingResponse,
}: {
  message: FormattedChatMessage;
  streamingResponse: boolean;
}) => {
  return (
    <div>
      {message.role === "user" && (
        <p className="p-4 w-fit rounded-md shadow-md bg-primary ml-auto text-white max-w-[70%] whitespace-pre-wrap">
          {message.content}
        </p>
      )}
      {message.role === "ai" && (
        <div className="group">
          <TextFormatter text={message.content} />
          {!streamingResponse && (
            <CopyButton
              text={message.content}
              className={` ${
                streamingResponse
                  ? "opacity-0 pointer-events-none"
                  : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
              }  mt-2 transition`}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
