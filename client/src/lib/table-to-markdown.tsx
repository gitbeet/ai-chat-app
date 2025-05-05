import { Children, isValidElement, ReactNode } from "react";

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (isValidElement(node)) {
    const children = (node as React.ReactElement<{ children?: ReactNode }>)
      .props?.children;
    return extractText(children);
  }

  return "";
}

export function htmlTableToMarkdown(tableChildren: ReactNode[]): string {
  const rows: string[][] = [];

  tableChildren.forEach((section) => {
    if (!isValidElement(section)) return;
    const sectionChildren = (
      section as React.ReactElement<{ children?: ReactNode }>
    ).props.children;
    const sectionRows = Array.isArray(sectionChildren)
      ? sectionChildren
      : [sectionChildren];

    sectionRows.forEach((row) => {
      if (!isValidElement(row)) return;
      const cells = Children.toArray(
        (row as React.ReactElement<{ children?: ReactNode }>).props.children
      ).map((cell) => {
        return extractText(cell).trim();
      });
      rows.push(cells);
    });
  });

  if (rows.length === 0) return "";

  // Build Markdown table
  const header = rows[0];
  const separator = header.map(() => "---");
  const body = rows.slice(1);

  const lines = [header, separator, ...body].map(
    (cols) => `| ${cols.join(" | ")} |`
  );
  return lines.join("\n");
}
