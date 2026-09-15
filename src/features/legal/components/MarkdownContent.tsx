import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

// Web equivalent of Expo's react-native-markdown-display + hardcoded
// hex color object. On native, that hex object was necessary because
// the library renders each rule as its own Text/View with a `style`
// prop that can't resolve NativeWind's CSS custom properties, and the
// colors had to be rebuilt on every theme change as a result. None of
// that applies here — react-markdown renders real HTML elements, so
// they can use the app's actual `text-foreground` / `border-border`
// etc. Tailwind classes directly and repaint automatically when the
// theme toggles, same as any other element in the app.
const MARKDOWN_COMPONENTS: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-foreground mt-6 mb-3">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-semibold text-foreground mt-5 mb-2.5">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base font-semibold text-foreground mt-3 mb-1.5">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-foreground text-[15px] leading-6 mb-3">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-link underline"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-5 mb-3 marker:text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 mb-3 marker:text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-foreground text-[15px] leading-6 mb-1.5">
      {children}
    </li>
  ),
  hr: () => <hr className="border-border my-5" />,
  blockquote: ({ children }) => (
    <blockquote className="bg-popover border-l-[3px] border-border px-3 py-2 mb-3">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-popover text-foreground rounded px-1 font-mono text-sm">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-popover text-foreground rounded-lg p-3 mb-3 font-mono text-sm overflow-x-auto">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <table className="border border-border rounded-md mb-3 w-full">
      {children}
    </table>
  ),
  th: ({ children }) => (
    <th className="text-foreground font-semibold p-2 text-left">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="text-foreground p-2">{children}</td>,
  tr: ({ children }) => (
    <tr className="border-b border-border">{children}</tr>
  ),
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
      {content}
    </ReactMarkdown>
  );
}
