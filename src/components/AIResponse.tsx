import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import "prismjs/themes/prism-tomorrow.css"; // Import theme Prism.js

interface AIResponseProps {
    content: string;
    isUser: boolean;
}

const AIResponse: React.FC<AIResponseProps> = ({ content, isUser }) => {
    return (
        <div className=" text-black text-sm max-w-xl">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypePrism]} // Kích hoạt highlight code
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default AIResponse;
