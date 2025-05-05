import renderer from "@/lib/utils/markdown-renderer";
import Markdown from "marked-react";

const TextFormatter = ({ text }: { text: string }) => {
  return (
    <Markdown
      value={text}
      gfm
      renderer={renderer}
    />
  );
};

export default TextFormatter;
