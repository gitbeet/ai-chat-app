import { ReactNode } from "react";
import { LucideCheck, LucideCopy } from "lucide-react";
import { Button } from "../ui/button";
import { Table } from "../ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { htmlTableToMarkdown } from "@/lib/utils/table-to-markdown";

const TableMarkdown = ({ children }: { children: ReactNode[] }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const markdown = htmlTableToMarkdown(children);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed: ", err);
      toast.error("Copy failed");
    }
  };
  return (
    <div className="relative group my-4">
      <Button
        onClick={handleCopy}
        size={"icon"}
        variant={"ghost"}
        className="absolute z-10 top-1 right-1 opacity-0 group-hover:opacity-100"
      >
        {copied ? (
          <LucideCheck className="w-4 h-4 text-green-500" />
        ) : (
          <LucideCopy className="w-4 h-4" />
        )}
      </Button>
      <Table>{children}</Table>
    </div>
  );
};

export default TableMarkdown;
