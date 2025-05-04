import { LucideSend } from "lucide-react";
import { Button } from "../ui/button";
import { AutoResizeTextArea } from "../ui/textarea";
import { ChangeEvent, FormEvent, useEffect, useRef } from "react";

interface Props {
  disabled: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
}

const SendMessageInput = ({ onSubmit, onChange, value, disabled }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" && !e.shiftKey && formRef.current) {
        e.preventDefault();
        formRef.current.requestSubmit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed w-full left-1/2 -translate-x-1/2 max-w-[800px] px-4  bottom-0 pb-16 pt-4 bg-background">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="relative"
      >
        <AutoResizeTextArea
          rows={1}
          value={value}
          onChange={onChange}
          placeholder="Ask anything!"
          className="w-full resize-none scrollbar-none pr-16"
        />
        <Button
          disabled={disabled}
          type="submit"
          className="absolute right-3 top-3.5"
        >
          <LucideSend />
        </Button>
      </form>
    </div>
  );
};

export default SendMessageInput;
