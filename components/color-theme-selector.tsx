"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { Paintbrush } from "lucide-react"

const colorThemes = [
  {
    id: "default",
    name: "Default",
    colors: {
      primary: "#ffffff",
      secondary: "#f8fafc",
      accent: "#3b82f6",
      text: "#0f172a",
    },
  },
  {
    id: "academic",
    name: "Academic",
    colors: {
      primary: "#ffffff",
      secondary: "#f0f9ff",
      accent: "#0369a1",
      text: "#0c4a6e",
    },
  },
  {
    id: "scientific",
    name: "Scientific",
    colors: {
      primary: "#ffffff",
      secondary: "#f0fdf4",
      accent: "#15803d",
      text: "#14532d",
    },
  },
  {
    id: "modern",
    name: "Modern",
    colors: {
      primary: "#ffffff",
      secondary: "#faf5ff",
      accent: "#7e22ce",
      text: "#581c87",
    },
  },
  {
    id: "professional",
    name: "Professional",
    colors: {
      primary: "#ffffff",
      secondary: "#f1f5f9",
      accent: "#475569",
      text: "#1e293b",
    },
  },
  {
    id: "contrast",
    name: "High Contrast",
    colors: {
      primary: "#ffffff",
      secondary: "#f8fafc",
      accent: "#000000",
      text: "#000000",
    },
  },
]

export default function ColorThemeSelector({ selectedTheme, onSelectTheme }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Paintbrush className="h-4 w-4 mr-2 text-gray-500" />
          <h3 className="font-medium">Color Theme</h3>
        </div>

        <RadioGroup
          value={selectedTheme}
          onValueChange={(value) => {
            console.log("Theme selected in component:", value)
            onSelectTheme(value)
          }}
          className="grid grid-cols-2 gap-2"
        >
          {colorThemes.map((theme) => (
            <div key={theme.id} className="space-y-1">
              <div
                className={cn(
                  "border-2 rounded-md overflow-hidden cursor-pointer transition-all p-1",
                  selectedTheme === theme.id
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300",
                )}
                onClick={() => onSelectTheme(theme.id)}
              >
                <Label htmlFor={theme.id} className="cursor-pointer">
                  <div className="relative">
                    <div className="flex h-8 rounded overflow-hidden">
                      <div className="w-1/4" style={{ backgroundColor: theme.colors.primary }}></div>
                      <div className="w-1/4" style={{ backgroundColor: theme.colors.secondary }}></div>
                      <div className="w-1/4" style={{ backgroundColor: theme.colors.accent }}></div>
                      <div className="w-1/4" style={{ backgroundColor: theme.colors.text }}></div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <RadioGroupItem value={theme.id} id={theme.id} className="sr-only" />
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2",
                          selectedTheme === theme.id ? "bg-blue-500 border-white" : "bg-white border-gray-300",
                        )}
                      />
                    </div>
                  </div>
                  <div className="text-center mt-1">
                    <div className="text-xs font-medium">{theme.name}</div>
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
