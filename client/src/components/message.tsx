import { formatMessage } from "@/lib/utils";
import { FormattedMessage } from "./pages/chat";
import { LucideBot } from "lucide-react";

const Message = ({ message }: { message: FormattedMessage }) => {
  return (
    <div>
      {message.role === "user" && (
        <p className="p-4  w-fit rounded-md shadow-md  ml-auto bg-muted">
          {message.content}
        </p>
      )}
      {message.role === "ai" && (
        <div className="flex items-start gap-4  p-4">
          <div className=" rounded-md bg-muted shadow p-2 ">
            <LucideBot className="w-8 h-8" />
          </div>
          <p
            className="w-fit rounded  mr-auto"
            dangerouslySetInnerHTML={{
              __html: formatMessage(message.content),
            }}
          ></p>
        </div>
      )}
    </div>
  );
};

export default Message;
