import DOMPurify from "dompurify";
import CopyButton from "../ui/copy-button";
interface CodeBlockProps {
  code: string;
  language?: string;
  highlighted: string;
}

const CodeBlock = ({ code, language, highlighted }: CodeBlockProps) => {
  const purified = DOMPurify.sanitize(highlighted);

  return (
    <div className=" rounded-md border border-secondary shadow overflow-hidden my-4">
      <div className="flex bg-secondary items-center justify-between px-4 py-1">
        <span className="text-sm">{language}</span>
        <CopyButton
          text={code}
          buttonText
        />
      </div>
      <pre className="bg-card p-4 overflow-x-auto">
        <code
          className={`language-${language} hljs`}
          dangerouslySetInnerHTML={{ __html: purified }}
        />
      </pre>
    </div>
  );
};

export default CodeBlock;
