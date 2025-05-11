import { useState } from "react";
import { Button } from "./button";
import { LucideCheck, LucideCopy } from "lucide-react";
import { toast } from "sonner";

const CopyButton = ({
  text,
  buttonText = false,
  className,
}: {
  text: string;
  buttonText?: boolean;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed: ", err);
      toast.error("Copy failed");
    }
  };
  return (
    <Button
      size={buttonText ? "sm" : "icon"}
      variant={"ghost"}
      onClick={handleCopy}
      className={className}
    >
      {copied ? (
        <LucideCheck className="w-4 h-4 text-green-500" />
      ) : (
        <LucideCopy className="w-4 h-4" />
      )}
      {buttonText && (
        <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
      )}
    </Button>
  );
};

export default CopyButton;
