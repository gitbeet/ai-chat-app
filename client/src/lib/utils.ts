import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "dompurify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format AI messages for better display
export const formatMessage = (text: string) => {
  if (!text) return "";
  const cleanHTML = DOMPurify.sanitize(text);

  return cleanHTML
    .replace(/\n/g, "<br>") // Preserve line breaks
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold text
    .replace(/\*(.*?)\*/g, "<i>$1</i>") // Italic text
    .replace(/`(.*?)`/g, "<code>$1</code>") // Inline code
    .replace(/(?:^|\n)- (.*?)(?:\n|$)/g, "<li>$1</li>") // Bullet points
    .replace(/(?:^|\n)(\d+)\. (.*?)(?:\n|$)/g, "<li>$1. $2</li>") // Numbered lists
    .replace(/<\/li>\n<li>/g, "</li><li>") // Ensure list continuity
    .replace(/<li>/, "<ul><li>") // Wrap in `<ul>`
    .replace(/<\/li>$/, "</li></ul>"); // Close the `<ul>`
};
