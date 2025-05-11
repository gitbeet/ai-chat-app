import { ReactNode } from "react";
import { Table } from "../ui/table";
import { htmlTableToMarkdown } from "@/lib/utils/table-to-markdown";
import CopyButton from "../ui/copy-button";

const TableMarkdown = ({ children }: { children: ReactNode[] }) => {
  const markdown = htmlTableToMarkdown(children);

  return (
    <div className="relative group my-4">
      <CopyButton
        text={markdown}
        className="absolute z-10 top-1 right-1 opacity-0 group-hover:opacity-100"
      />
      <Table>{children}</Table>
    </div>
  );
};

export default TableMarkdown;
