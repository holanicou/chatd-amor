"use client"

import { Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm">
        <Palette className="h-4 w-4" />
      </Button>
    )
  }

  const themes = [
    { name: "Claro", value: "light", icon: Sun },
    { name: "Oscuro", value: "dark", icon: Moon },
    { name: "Rosa", value: "pink", icon: Palette },
    { name: "Púrpura", value: "purple", icon: Palette },
    { name: "Amor", value: "love", icon: Palette },
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[0]
  const IconComponent = currentTheme.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <IconComponent className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => {
          const ThemeIcon = themeOption.icon
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className="flex items-center space-x-2"
            >
              <ThemeIcon className="h-4 w-4" />
              <span>{themeOption.name}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}