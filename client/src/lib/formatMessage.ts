import DOMPurify from "dompurify";
import { marked } from "marked";

const renderer = new marked.Renderer();

renderer.code = ({ text, lang }) => {
  // Escape HTML tags to prevent XSS
  const escapedCode = text.replace(
    /[&<>]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!)
  );

  return `
      <div class="my-4 rounded-md overflow-hidden border border-secondary w-full">
        ${
          lang
            ? `<div class="px-4 py-2 bg-secondary text-sm font-mono">${lang}</div>`
            : ""
        }
        <pre class="bg-card p-4 text-sm overflow-x-auto"><code>${escapedCode}</code></pre>
      </div>
    `;
};

renderer.codespan = ({ text }) => {
  const escapedCode = text.replace(
    /[&<>]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!)
  );

  return `<code class="bg-secondary px-2 py-0.5 rounded text-sm font-mono">${escapedCode}</code>`;
};

renderer.list = ({ ordered, items }) => {
  const tag = ordered ? "ol" : "ul";
  const className = ordered ? "list-decimal" : "list-disc";
  return `<${tag} class="${className} ml-6 py-4 space-y-1">${items
    .map((item) => `<li>${item.text}</li>`)
    .join("")}</${tag}>`;
};

renderer.listitem = ({ text }: { text: string }) => {
  return `<li class="text-sm leading-relaxed">${text}</li>`;
};

// Main formatting function
export const formatMessage = async (text: string): Promise<string> => {
  if (!text) return "";

  const rawHtml = await marked.parse(text, { renderer }); // Now works!
  const cleanHTML = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
    ALLOWED_ATTR: ["href", "title", "target", "rel", "class"],
  });

  return cleanHTML;
};
