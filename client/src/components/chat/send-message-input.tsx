import { LucideSend } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ChangeEvent, FormEvent } from "react";

interface Props {
  disabled: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
}

const SendMessageInput = ({ onSubmit, onChange, value, disabled }: Props) => {
  return (
    <form
      onSubmit={onSubmit}
      className="relative"
    >
      <Textarea
        rows={1}
        value={value}
        onChange={onChange}
        placeholder="Ask anything!"
        className="w-full resize-none scrollbar-none pr-14"
      />
      <Button
        disabled={disabled}
        type="submit"
        className="absolute right-3 top-3"
      >
        <LucideSend />
      </Button>
    </form>
  );
};

export default SendMessageInput;
