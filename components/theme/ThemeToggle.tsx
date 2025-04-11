/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-18 18:04:57
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-03-28 14:02:09
 * @FilePath: \dalieba\components\theme\ThemeToggle.tsx
 * @Description: 主题切换
 */

"use client"

import * as React from "react"
import { Moon, Sun, SunMoon } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ModeToggleProps {
  variant?: "default" | "outline" | "ghost" | "link" | "reversalDefault"
  className?: string
}

export function ModeToggle({ variant = "ghost", className }: ModeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant={variant} size="icon" className={cn("relative", className, variant === 'default' ? 'bg-background' : '')}>
        <Sun className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className={cn("relative", className)}>
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div
                key="moon"
                initial={{ rotate: 90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -90, scale: 0 }}
                transition={{ duration: 0.2 }}
                className="absolutqe inset-0 flex items-center justify-center"
              >
                <Moon className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sun className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => {
          setTheme("light")
          localStorage.setItem("theme", "light")
          window.postMessage('hi! RN')
        }}>
          <motion.div 
            className="flex gap-2 items-center"
            whileHover="hover"
          >
            <motion.div
              variants={{
                hover: { rotate: 360 }
              }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="h-5 w-5" />
            </motion.div>
            <motion.span
              variants={{
                hover: { x: 5 }
              }}
              transition={{ duration: 0.2 }}
            >
              白天模式
            </motion.span>
          </motion.div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          setTheme("dark")
          localStorage.setItem("theme", "dark")
          window.postMessage('hi! RN')
        }}>
          <motion.div 
            className="flex gap-2 items-center"
            whileHover="hover"
          >
            <motion.div
              variants={{
                hover: { rotate: 360 }
              }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="h-5 w-5" />
            </motion.div>
            <motion.span
              variants={{
                hover: { x: 5 }
              }}
              transition={{ duration: 0.2 }}
            >
              深色模式
            </motion.span>
          </motion.div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          setTheme("system")
          localStorage.setItem("theme", "system")
          window.postMessage('hi! RN')
        }}>
          <motion.div
            className="flex gap-2 items-center"
            whileHover="hover"
          >
            <motion.div
              variants={{
                hover: { rotate: 360 }
              }}
              transition={{ duration: 0.3 }}
            >
              <SunMoon className="h-5 w-5" />
            </motion.div>
            <motion.span
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              跟随系统
            </motion.span>
          </motion.div>

        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
