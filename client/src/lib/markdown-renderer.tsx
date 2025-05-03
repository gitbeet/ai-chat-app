// utils/markdownRenderer.tsx
import { ReactRenderer } from "marked-react";
import hljs from "./hljs-init"; // or wherever your HLJS config lives
import CodeBlock from "@/components/chat/code-block";
import "../highlight.css";

const renderer: Partial<ReactRenderer> = {
  list(children, ordered) {
    return ordered ? (
      <ol className="list-decimal pl-6 mb-2">{children}</ol>
    ) : (
      <ul className="list-disc pl-6 mb-2">{children}</ul>
    );
  },
  listItem(text) {
    const key = text
      ? text.toString().substring(0, 10) +
        Math.random().toString(36).substring(2, 9)
      : Math.random().toString(36).substring(2, 9);
    return (
      <li
        key={key}
        className="mb-1"
      >
        {text}
      </li>
    );
  },
  code(code: string, infostring?: string) {
    const language = infostring?.trim();

    let highlighted;
    try {
      if (language && hljs.getLanguage(language)) {
        highlighted = hljs.highlight(code, { language }).value;
      } else {
        highlighted = hljs.highlightAuto(code).value;
      }
    } catch (e) {
      console.error(e);
      highlighted = code;
    }

    return (
      <CodeBlock
        code={code}
        language={language}
        highlighted={highlighted}
      />
    );
  },
};

export default renderer;
