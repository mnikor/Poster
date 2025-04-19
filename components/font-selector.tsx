"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { Type } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fontFamilies = [
  { id: "sans", name: "Sans-serif", value: "ui-sans-serif, system-ui, sans-serif" },
  { id: "serif", name: "Serif", value: "ui-serif, Georgia, Cambria, serif" },
  { id: "mono", name: "Monospace", value: "ui-monospace, SFMono-Regular, Menlo, monospace" },
]

const fontSizes = [
  { id: "small", name: "Small" },
  { id: "medium", name: "Medium" },
  { id: "large", name: "Large" },
]

export default function FontSelector({ selectedFont, selectedSize, onSelectFont, onSelectSize }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Type className="h-4 w-4 mr-2 text-gray-500" />
          <h3 className="font-medium">Typography</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500 mb-2 block">Font Family</Label>
            <RadioGroup value={selectedFont} onValueChange={onSelectFont} className="grid grid-cols-1 gap-2">
              {fontFamilies.map((font) => (
                <div key={font.id} className="space-y-1">
                  <div
                    className={cn(
                      "border rounded-md overflow-hidden cursor-pointer transition-all p-2",
                      selectedFont === font.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <Label htmlFor={font.id} className="cursor-pointer flex items-center">
                      <RadioGroupItem value={font.id} id={font.id} className="mr-2" />
                      <span style={{ fontFamily: font.value }}>{font.name}</span>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-2 block">Font Size</Label>
            <Select value={selectedSize} onValueChange={onSelectSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
