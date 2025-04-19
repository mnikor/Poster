"use client"

import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const templates = [
  {
    id: "academic",
    name: "Academic",
    description: "Traditional academic poster layout with clear sections",
    image: "/academic-poster-layout.png",
  },
  {
    id: "scientific",
    name: "Scientific",
    description: "Data-focused layout with emphasis on figures and results",
    image: "/scientific-poster-template-layout.png",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, modern design with minimal distractions",
    image: "/abstract-minimalist-poster.png",
  },
  {
    id: "visual",
    name: "Visual",
    description: "Image-heavy layout for visually engaging presentations",
    image: "/blank-event-poster.png",
  },
]

export default function TemplateSelector({ selectedTemplate, onSelectTemplate }) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Poster Templates</h3>
        <RadioGroup
          value={selectedTemplate}
          onValueChange={(value) => {
            console.log("Template selected in component:", value)
            onSelectTemplate(value)
          }}
          className="space-y-3"
        >
          {templates.map((template) => (
            <div key={template.id} className="space-y-2">
              <div
                className={cn(
                  "border-2 rounded-md overflow-hidden cursor-pointer transition-all",
                  selectedTemplate === template.id
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300",
                )}
                onClick={() => {
                  console.log("Template clicked:", template.id)
                  // Call the handler directly with the template ID
                  onSelectTemplate(template.id)
                }}
              >
                <Label htmlFor={template.id} className="cursor-pointer">
                  <div className="relative">
                    <img
                      src={template.image || "/placeholder.svg"}
                      alt={template.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <RadioGroupItem value={template.id} id={template.id} className="sr-only" />
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2",
                          selectedTemplate === template.id ? "bg-blue-500 border-white" : "bg-white border-gray-300",
                        )}
                      />
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
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
