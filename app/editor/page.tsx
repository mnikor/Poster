"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import PosterCanvas from "@/components/poster-canvas"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  FileText,
  Wand2,
  Quote,
  Lightbulb,
  Printer,
  Type,
  LayoutIcon,
  Palette,
  Save,
  ArrowLeft,
  Share2,
} from "lucide-react"
import ColorThemeSelector from "@/components/color-theme-selector"
import FontSelector from "@/components/font-selector"
import ExportOptions from "@/components/export-options"
import CitationManager from "@/components/citation/citation-manager"
import { CitationLibraryProvider } from "@/components/citation/citation-library-context"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import PrintPreview from "@/components/print-preview"
import OrientationSelector from "@/components/orientation-selector"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DocumentUploader from "@/components/document-uploader"
import AIExtractor from "@/components/ai-extractor"
import TemplateSelector from "@/components/template-selector"

// Interface for poster data
interface Poster {
  id: string
  title: string
  template: string
  thumbnail: string
  createdAt: string
  updatedAt: string
  starred: boolean
  // Additional properties for editor state
  colorTheme?: string
  fontFamily?: string
  fontSize?: string
  orientation?: string
  sections?: any[]
}

export default function EditorPage() {
  const searchParams = useSearchParams()
  const posterId = searchParams.get("id")

  const [poster, setPoster] = useState<Poster | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState("academic")
  const [colorTheme, setColorTheme] = useState("default")
  const [fontFamily, setFontFamily] = useState("sans")
  const [fontSize, setFontSize] = useState("medium")
  const [activeTab, setActiveTab] = useState("design")
  const [extractedData, setExtractedData] = useState(null)
  const [canvasKey, setCanvasKey] = useState(Date.now())
  const [aiReviewOpen, setAiReviewOpen] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false)
  const [currentSections, setCurrentSections] = useState([])
  const [orientation, setOrientation] = useState("landscape")
  const [exportOptionsOpen, setExportOptionsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load poster data if ID is provided
  useEffect(() => {
    if (posterId) {
      const savedPosters = localStorage.getItem("academicPosters")
      if (savedPosters) {
        try {
          const posters = JSON.parse(savedPosters)
          const foundPoster = posters.find((p) => p.id === posterId)
          if (foundPoster) {
            setPoster(foundPoster)

            // Set editor state from poster data if available
            if (foundPoster.template) setSelectedTemplate(foundPoster.template)
            if (foundPoster.colorTheme) setColorTheme(foundPoster.colorTheme)
            if (foundPoster.fontFamily) setFontFamily(foundPoster.fontFamily)
            if (foundPoster.fontSize) setFontSize(foundPoster.fontSize)
            if (foundPoster.orientation) setOrientation(foundPoster.orientation)

            // Force re-render with the loaded settings
            setCanvasKey(Date.now())
          }
        } catch (error) {
          console.error("Failed to parse saved posters:", error)
        }
      }
    }
  }, [posterId])

  // Add event listener for tab navigation
  useEffect(() => {
    const handleNavigate = (e) => {
      if (e.detail) {
        setActiveTab(e.detail)
      }
    }

    window.addEventListener("navigate-to-tab", handleNavigate)

    return () => {
      window.removeEventListener("navigate-to-tab", handleNavigate)
    }
  }, [])

  const handleDataExtracted = (data, nextTab = "citations") => {
    setExtractedData(data)
    setActiveTab(nextTab)
  }

  const handleExportPoster = () => {
    setExportOptionsOpen(true)
  }

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template)
    setTimeout(() => {
      setCanvasKey(Date.now())
    }, 0)
  }

  const handleThemeChange = (theme) => {
    setColorTheme(theme)
    setCanvasKey(Date.now())
  }

  const togglePreview = () => {
    setPreviewMode(!previewMode)
    setCanvasKey(Date.now())
  }

  const handlePrintPreview = () => {
    setPrintPreviewOpen(true)
  }

  const handleOrientationChange = (newOrientation) => {
    if (newOrientation !== orientation) {
      console.log(`Changing orientation from ${orientation} to ${newOrientation}`)

      const orientationButtons = document.querySelectorAll("[data-orientation-button]")
      orientationButtons.forEach((button) => {
        button.setAttribute("disabled", "true")
      })

      setOrientation(newOrientation)

      const newKey = Date.now()
      console.log("Setting new canvas key:", newKey)
      setCanvasKey(newKey)

      setTimeout(() => {
        orientationButtons.forEach((button) => {
          button.removeAttribute("disabled")
        })
      }, 1000)
    }
  }

  // Save poster data
  const savePoster = (sections = []) => {
    if (!posterId) return

    setIsSaving(true)

    setTimeout(() => {
      const savedPosters = localStorage.getItem("academicPosters")
      if (savedPosters) {
        try {
          const posters = JSON.parse(savedPosters)
          const updatedPosters = posters.map((p) => {
            if (p.id === posterId) {
              return {
                ...p,
                updatedAt: new Date().toISOString(),
                colorTheme,
                fontFamily,
                fontSize,
                orientation,
                sections: sections.length > 0 ? sections : p.sections || [],
              }
            }
            return p
          })

          localStorage.setItem("academicPosters", JSON.stringify(updatedPosters))

          // Update thumbnail if needed (in a real app, this would be a canvas snapshot)
          // For now, we'll just use the template image

          setIsSaving(false)
        } catch (error) {
          console.error("Failed to save poster:", error)
          setIsSaving(false)
        }
      }
    }, 500)
  }

  return (
    <CitationLibraryProvider>
      <main className="flex min-h-screen flex-col">
        <header className="border-b bg-white p-4">
          <div className="container flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild className="mr-2">
                <Link href="/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-xl font-bold">{poster?.title || "New Poster"}</h1>
            </div>

            {activeTab === "design" && (
              <div className="flex items-center gap-3 ml-auto mr-4">
                {/* Typography Controls */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Type className="h-4 w-4" />
                      <span>Typography</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Font Family</h3>
                        <Select
                          value={fontFamily}
                          onValueChange={(value) => {
                            setFontFamily(value)
                            setCanvasKey(Date.now())
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sans">Sans-serif</SelectItem>
                            <SelectItem value="serif">Serif</SelectItem>
                            <SelectItem value="mono">Monospace</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Font Size</h3>
                        <Select
                          value={fontSize}
                          onValueChange={(value) => {
                            setFontSize(value)
                            setCanvasKey(Date.now())
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Color Theme Controls */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Palette className="h-4 w-4" />
                      <span>Theme</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Color Theme</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {["default", "academic", "scientific", "modern", "professional", "contrast"].map((theme) => (
                          <div
                            key={theme}
                            className={cn(
                              "border rounded-md p-2 cursor-pointer text-center text-xs capitalize",
                              colorTheme === theme
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300",
                            )}
                            onClick={() => handleThemeChange(theme)}
                          >
                            {theme}
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Orientation Controls */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <LayoutIcon className="h-4 w-4" />
                      <span>Orientation</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Poster Orientation</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          className={cn(
                            "border rounded-md p-2 flex flex-col items-center cursor-pointer",
                            orientation === "landscape"
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300",
                          )}
                          onClick={() => handleOrientationChange("landscape")}
                          data-orientation-button="true"
                        >
                          <div className="w-16 h-12 bg-gray-100 rounded mb-1"></div>
                          <span className="text-xs">Landscape</span>
                        </div>
                        <div
                          className={cn(
                            "border rounded-md p-2 flex flex-col items-center cursor-pointer",
                            orientation === "portrait"
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300",
                          )}
                          onClick={() => handleOrientationChange("portrait")}
                          data-orientation-button="true"
                        >
                          <div className="w-12 h-16 bg-gray-100 rounded mb-1"></div>
                          <span className="text-xs">Portrait</span>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => savePoster()}
                disabled={isSaving}
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant={previewMode ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={togglePreview}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {previewMode ? "Exit Preview" : "Preview"}
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setAiReviewOpen(true)}>
                <Lightbulb className="h-4 w-4" />
                AI Review
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={handlePrintPreview}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleExportPoster}>
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </header>

        <div className="container flex-1 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Upload Documents
              </TabsTrigger>
              <TabsTrigger value="extract" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Extract Content
              </TabsTrigger>
              <TabsTrigger value="citations" className="flex items-center gap-2">
                <Quote className="h-4 w-4" />
                Citations
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M2 12h20M12 2v20" />
                </svg>
                Design Poster
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <DocumentUploader onComplete={() => setActiveTab("extract")} />
            </TabsContent>

            <TabsContent value="extract" className="space-y-4">
              <AIExtractor onDataExtracted={handleDataExtracted} />
            </TabsContent>

            <TabsContent value="citations" className="space-y-4">
              <CitationManager posterContent={extractedData ? JSON.stringify(extractedData) : ""} />
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <div className={cn("grid gap-4", previewMode ? "grid-cols-1" : "grid-cols-4")}>
                {!previewMode && (
                  <div className="col-span-1 space-y-4">
                    <TemplateSelector selectedTemplate={selectedTemplate} onSelectTemplate={handleTemplateChange} />
                    {/* We've moved these controls to the top header, but keeping them here as a fallback */}
                    <div className="md:hidden">
                      <ColorThemeSelector selectedTheme={colorTheme} onSelectTheme={handleThemeChange} />
                      <FontSelector
                        selectedFont={fontFamily}
                        selectedSize={fontSize}
                        onSelectFont={(font) => {
                          setFontFamily(font)
                          setCanvasKey(Date.now())
                        }}
                        onSelectSize={(size) => {
                          setFontSize(size)
                          setCanvasKey(Date.now())
                        }}
                      />
                      <OrientationSelector
                        selectedOrientation={orientation}
                        onSelectOrientation={handleOrientationChange}
                      />
                    </div>
                  </div>
                )}
                <div className={previewMode ? "col-span-1" : "col-span-3"}>
                  <PosterCanvas
                    key={canvasKey}
                    template={selectedTemplate}
                    extractedData={extractedData}
                    colorTheme={colorTheme}
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                    orientation={orientation}
                    previewMode={previewMode}
                    onSectionsChange={(sections) => {
                      setCurrentSections(sections)
                      savePoster(sections)
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Review Dialog */}
        <Dialog open={aiReviewOpen} onOpenChange={setAiReviewOpen}>
          <DialogContent className="max-w-3xl">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-blue-600" />
                  Layout Suggestions
                </h3>
                <p className="text-sm text-blue-800">
                  Your poster has a good balance of text and visuals. Consider adding more whitespace between sections
                  to improve readability.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-md">
                <h3 className="font-medium mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-green-600" />
                  Content Suggestions
                </h3>
                <p className="text-sm text-green-800">
                  The abstract is clear and concise. Your methods section could benefit from more specific details about
                  your research approach.
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-md">
                <h3 className="font-medium mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-amber-600" />
                  Visual Suggestions
                </h3>
                <p className="text-sm text-amber-800">
                  Consider using a consistent color scheme throughout your figures and charts to create a more cohesive
                  look.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Print Preview Dialog */}
        <PrintPreview
          open={printPreviewOpen}
          onOpenChange={setPrintPreviewOpen}
          template={selectedTemplate}
          colorTheme={colorTheme}
          fontFamily={fontFamily}
          fontSize={fontSize}
          orientation={orientation}
          sections={currentSections}
        />

        {/* Export Options Dialog */}
        <Dialog open={exportOptionsOpen} onOpenChange={setExportOptionsOpen}>
          <DialogContent className="max-w-md">
            <ExportOptions
              onExport={(options) => {
                console.log("Exporting with options:", options)
                setExportOptionsOpen(false)
                // Here you would implement the actual export functionality
                alert(`Exporting poster as ${options.format.toUpperCase()} with ${options.paperSize} size`)
              }}
            />
          </DialogContent>
        </Dialog>
      </main>
    </CitationLibraryProvider>
  )
}
