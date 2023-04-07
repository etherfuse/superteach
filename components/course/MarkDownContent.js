import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import remarkBreaks from "remark-breaks";
import classNames from "classnames";
import DOMPurify from "isomorphic-dompurify";
import { createElement } from "react";

const domPurifyConfig = {
  ADD_TAGS: ["iframe"],
  ADD_ATTR: [
    "src",
    "width",
    "height",
    "frameborder",
    "allow",
    "allowfullscreen",
    "title",
  ],
};

const MarkDownContent = ({ title = "", content = "" }) => {
  const sanitizedMarkdown = DOMPurify.sanitize(content, domPurifyConfig);

  return (
    <div className="markdown">
      <h1 className="capitalize font-bold mb-4 text-2xl">{title}</h1>
      <ReactMarkdown
        className={classNames(
          "prose-sm",
          "text-white",
          "text-base",
          "max-w-none",
          "mx-auto"
        )}
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[
          [rehypeRaw],
          [rehypeReact, { createElement: createElement }],
        ]}
      >
        {sanitizedMarkdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkDownContent;
