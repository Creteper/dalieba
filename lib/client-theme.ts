import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export const useClientTheme = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return "light"
  }

  return theme
}

