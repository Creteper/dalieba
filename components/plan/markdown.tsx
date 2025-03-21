/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-20 11:26:23
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-20 11:27:29
 * @FilePath: \dalieba\components\plan\markdown.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { ComponentProps } from 'react'

type MarkdownProps = {
  content: string;
} & Omit<ComponentProps<typeof ReactMarkdown>, 'children'>

export default function MarkdownRenderer({ content, ...props }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-4 text-primary">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold mt-6 mb-3 text-primary/90">{children}</h2>
        ),
        p: ({ children }) => (
          <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-4 ml-4 space-y-2 list-disc list-inside">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 ml-4 space-y-2 list-decimal list-inside">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-600 dark:text-gray-300">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="pl-4 my-4 border-l-4 border-primary/50 italic text-gray-600 dark:text-gray-300">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-primary/90">{children}</strong>
        ),
        code: ({ children }) => (
          <code className="px-1.5 py-0.5 mx-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">
            {children}
          </code>
        ),
      }}
      {...props}
    >
      {content}
    </ReactMarkdown>
  )
}
