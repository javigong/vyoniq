import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components = {
    // Custom heading rendering
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-vyoniq-blue dark:text-white">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-6 mb-3 text-vyoniq-blue dark:text-white">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold mt-5 mb-2 text-vyoniq-blue dark:text-white">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-bold mt-4 mb-2 text-vyoniq-blue dark:text-white">
        {children}
      </h4>
    ),
    h5: ({ children }: any) => (
      <h5 className="text-base font-bold mt-3 mb-2 text-vyoniq-blue dark:text-white">
        {children}
      </h5>
    ),
    h6: ({ children }: any) => (
      <h6 className="text-sm font-bold mt-2 mb-1 text-vyoniq-blue dark:text-white">
        {children}
      </h6>
    ),

    // Custom paragraph rendering
    p: ({ children }: any) => (
      <p className="mb-4 text-vyoniq-text dark:text-vyoniq-dark-text leading-relaxed">
        {children}
      </p>
    ),

    // Custom code block and inline code rendering
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <div className="my-6">
          <SyntaxHighlighter
            style={tomorrow}
            language={match[1]}
            PreTag="div"
            className="rounded-lg"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-vyoniq-purple dark:text-vyoniq-green"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Custom link rendering
    a: ({ href, children }: any) => (
      <a
        href={href}
        className="text-vyoniq-green hover:text-vyoniq-purple transition-colors underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    // Custom list rendering
    ul: ({ children }: any) => (
      <ul className="list-disc ml-6 mb-4 space-y-2 text-vyoniq-text dark:text-vyoniq-dark-text">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal ml-6 mb-4 space-y-2 text-vyoniq-text dark:text-vyoniq-dark-text">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="text-vyoniq-text dark:text-vyoniq-dark-text">
        {children}
      </li>
    ),

    // Custom blockquote rendering
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-vyoniq-green pl-4 my-6 italic text-vyoniq-text dark:text-vyoniq-dark-text bg-gray-50 dark:bg-gray-800 py-2">
        {children}
      </blockquote>
    ),

    // Custom table rendering
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
          {children}
        </table>
      </div>
    ),
    th: ({ children }: any) => (
      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-bold text-vyoniq-blue dark:text-white">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-vyoniq-text dark:text-vyoniq-dark-text">
        {children}
      </td>
    ),

    // Custom horizontal rule
    hr: () => <hr className="my-8 border-gray-300 dark:border-gray-600" />,

    // Custom strong (bold) text
    strong: ({ children }: any) => (
      <strong className="font-bold text-vyoniq-blue dark:text-white">
        {children}
      </strong>
    ),

    // Custom emphasis (italic) text
    em: ({ children }: any) => (
      <em className="italic text-vyoniq-text dark:text-vyoniq-dark-text">
        {children}
      </em>
    ),
  };

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
