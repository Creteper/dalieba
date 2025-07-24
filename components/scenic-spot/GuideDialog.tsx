import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { X, Play, Pause } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { LANGUAGE_OPTIONS } from "./LanguageSelector";

interface GuideDialogProps {
  guideMessage: string;
  guideAudioUrl: string;
  selectedLanguage: string;
  isPlaying: boolean;
  onClose: () => void;
  onPlayAudio: (audioUrl: string) => void;
}

export default function GuideDialog({
  guideMessage,
  guideAudioUrl,
  selectedLanguage,
  isPlaying,
  onClose,
  onPlayAudio
}: GuideDialogProps) {
  const currentLanguage = LANGUAGE_OPTIONS.find(lang => lang.value === selectedLanguage);

  if (!guideMessage) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-999 flex items-end sm:items-center sm:justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-[3px]"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.4, type: "spring", damping: 20 }}
        className="w-full max-w-2xl max-h-[80vh] flex flex-col bg-background/95 backdrop-blur-xl rounded-xl shadow-2xl border border-primary/20 overflow-hidden"
      >
        {/* 头部 */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border/30 bg-muted/20">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 rounded-full bg-primary/15 p-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-medium truncate">
                  AI 智能导游
                </h3>
                <div className="flex items-center gap-1 bg-primary/10 rounded-full px-2 py-0.5">
                  <span className="text-xs">{currentLanguage?.flag}</span>
                  <span className="text-xs text-primary font-medium">
                    {currentLanguage?.label}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                由人工智能提供专业讲解
              </p>
            </div>
            {guideAudioUrl && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={isPlaying ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => onPlayAudio(guideAudioUrl)}
                  className="h-9 ml-1 flex-shrink-0 gap-1.5 transition-all duration-200 rounded-full px-3.5"
                >
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                </Button>
              </motion.div>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 flex-shrink-0 rounded-full hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 prose prose-sm md:prose-base max-w-none scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          <div className="text-foreground [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-4 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mt-5 [&>h2]:mb-3 [&>h3]:text-base [&>h3]:font-medium [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:my-2 [&>p]:leading-relaxed [&>ul]:my-2 [&>ol]:my-2 [&>li]:my-1 [&>li]:ml-2 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/30 [&>blockquote]:bg-primary/5 [&>blockquote]:pl-4 [&>blockquote]:py-2 [&>blockquote]:my-3 [&>blockquote]:italic [&>blockquote]:rounded-sm [&>code]:bg-muted/70 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:text-sm [&>code]:text-primary [&>pre]:bg-muted/60 [&>pre]:p-4 [&>pre]:rounded-md [&>pre]:my-3 [&>pre]:overflow-x-auto [&>a]:text-primary [&>a]:underline [&>a]:underline-offset-4 [&>a]:hover:text-primary/80 [&>table]:w-full [&>table]:my-4 [&>table]:border-collapse [&>th]:border [&>th]:border-muted [&>th]:p-2 [&>td]:border [&>td]:border-muted [&>td]:p-2 [&>*]:break-words [&>*]:max-w-full">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {guideMessage}
            </ReactMarkdown>
          </div>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/30 bg-muted/10">
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full bg-primary/10 px-3 py-1">
              <span className="text-xs text-primary font-medium">
                AI 导游模式
              </span>
            </div>
            {isPlaying && (
              <div className="flex items-center space-x-1">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                ></motion.span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.2,
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                ></motion.span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.4,
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                ></motion.span>
              </div>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs px-3"
            >
              关闭导游
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
} 