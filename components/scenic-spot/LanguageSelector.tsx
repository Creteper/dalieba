import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// 语言选项配置
export const LANGUAGE_OPTIONS = [
  { value: "Chinese", label: "中文", flag: "🇨🇳" },
  { value: "English", label: "English", flag: "🇺🇸" },
  { value: "Japanese", label: "日本語", flag: "🇯🇵" },
  { value: "Korean", label: "한국어", flag: "🇰🇷" },
  { value: "French", label: "Français", flag: "🇫🇷" },
  { value: "German", label: "Deutsch", flag: "🇩🇪" },
  { value: "Spanish", label: "Español", flag: "🇪🇸" },
  { value: "Russian", label: "Русский", flag: "🇷🇺" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  isMobile?: boolean;
  className?: string;
}

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  isMobile = false,
  className
}: LanguageSelectorProps) {
  const currentLanguage = LANGUAGE_OPTIONS.find(lang => lang.value === selectedLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={isMobile ? "sm" : "sm"}
          className={cn(
            "justify-between bg-background/70 border-border/50",
            isMobile ? "w-full h-12 rounded-xl border border-border/30" : "w-full h-8 text-xs",
            className
          )}
        >
          <div className="flex items-center gap-1.5">
            <Languages className={cn("h-3 w-3", isMobile && "h-4 w-4")} />
            <span className={isMobile ? "text-lg" : ""}>{currentLanguage?.flag}</span>
            <span className={cn("text-xs", isMobile && "text-sm")}>{currentLanguage?.label}</span>
          </div>
          <ChevronDown className={cn("h-3 w-3", isMobile && "h-4 w-4")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-full min-w-[280px]">
        {LANGUAGE_OPTIONS.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => onLanguageChange(language.value)}
            className={cn(
              "flex items-center gap-2 text-xs",
              isMobile && "py-3 gap-3",
              selectedLanguage === language.value ? 'bg-accent' : ''
            )}
          >
            <span className={cn("text-base", isMobile && "text-lg")}>{language.flag}</span>
            <span className={cn("", isMobile && "text-sm")}>{language.label}</span>
            {language.value !== "Chinese" && (
              <span className={cn("text-muted-foreground ml-auto", isMobile && "text-xs")}>
                AI导游
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 