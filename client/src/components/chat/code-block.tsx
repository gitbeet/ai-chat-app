import { useState } from "react";
import { LucideCheck, LucideCopy } from "lucide-react";
import { Button } from "../ui/button";
import DOMPurify from "dompurify";
interface CodeBlockProps {
  code: string;
  language?: string;
  highlighted: string;
}

const CodeBlock = ({ code, language, highlighted }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const purified = DOMPurify.sanitize(highlighted);

  return (
    <div className=" rounded-md border border-secondary shadow overflow-hidden my-4">
      <div className="flex bg-secondary items-center justify-between px-4 py-1">
        <span className="text-sm">{language}</span>
        <Button
          size={"sm"}
          variant="ghost"
          onClick={handleCopy}
        >
          {copied ? (
            <LucideCheck className="w-4 h-4 text-green-500" />
          ) : (
            <LucideCopy className="w-4 h-4" />
          )}
          <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <pre className="bg-card p-4">
        <code
          className={`language-${language} hljs`}
          dangerouslySetInnerHTML={{ __html: purified }}
        />
      </pre>
    </div>
  );
};

export default CodeBlock;
