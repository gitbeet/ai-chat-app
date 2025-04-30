import { formatMessage } from "@/lib/formatMessage";
import { FormattedMessage } from "./pages/chat";
import { useEffect, useState } from "react";
// import { LucideBot } from "lucide-react";

const Message = ({ message }: { message: FormattedMessage }) => {
  const [m, setM] = useState("");
  useEffect(() => {
    function getMessage() {
      formatMessage(message.content).then((r) => setM(r));
    }
    getMessage();
  }, [message.content]);
  return (
    <div>
      {message.role === "user" && (
        <p className="p-4 w-fit rounded-md shadow-md bg-primary ml-auto text-white">
          {message.content}
        </p>
      )}
      {message.role === "ai" && (
        <p
          className="rounded  mr-auto py-4"
          dangerouslySetInnerHTML={{
            __html: m,
          }}
        ></p>
      )}
    </div>
  );
};

export default Message;
