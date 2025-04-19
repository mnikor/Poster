"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, Download, ZoomIn, ZoomOut, Grid, Maximize } from "lucide-react"
import { cn } from "@/lib/utils"
import PosterCanvas from "./poster-canvas"

// Paper sizes in mm
const paperSizes = {
  a0: { width: 841, height: 1189, name: "A0 (841 × 1189 mm)" },
  a1: { width: 594, height: 841, name: "A1 (594 × 841 mm)" },
  a2: { width: 420, height: 594, name: "A2 (420 × 594 mm)" },
  a3: { width: 297, height: 420, name: "A3 (297 × 420 mm)" },
  a4: { width: 210, height: 297, name: "A4 (210 × 297 mm)" },
  letter: { width: 216, height: 279, name: "US Letter (8.5 × 11 in)" },
  tabloid: { width: 279, height: 432, name: "Tabloid (11 × 17 in)" },
  poster: { width: 900, height: 1200, name: "Poster (900 × 1200 mm)" },
  custom: { width: 600, height: 900, name: "Custom Size" },
}

// Update the component props to include orientation
export default function PrintPreview({
  open,
  onOpenChange,
  template,
  colorTheme,
  fontFamily,
  fontSize,
  orientation = "landscape",
  sections,
}) {
  const [paperSize, setPaperSize] = useState("a0")
  const [localOrientation, setOrientation] = useState("portrait")
  const [scale, setScale] = useState(100)
  const [margins, setMargins] = useState(10)
  const [showGrid, setShowGrid] = useState(true)
  const [showPageBreaks, setShowPageBreaks] = useState(true)
  const [customWidth, setCustomWidth] = useState(600)
  const [customHeight, setCustomHeight] = useState(900)
  const [zoom, setZoom] = useState(50)
  const [activeTab, setActiveTab] = useState("preview")
  const previewRef = useRef(null)

  // Calculate dimensions based on paper size and orientation
  const getDimensions = () => {
    if (paperSize === "custom") {
      return localOrientation === "portrait"
        ? { width: customWidth, height: customHeight }
        : { width: customHeight, height: customWidth }
    }

    const dimensions = paperSizes[paperSize]
    return localOrientation === "portrait"
      ? { width: dimensions.width, height: dimensions.height }
      : { width: dimensions.height, height: dimensions.width }
  }

  const dimensions = getDimensions()

  // Calculate how many pages are needed based on the poster size and paper size
  const calculatePages = () => {
    // Assuming poster is 1000px wide by default
    const posterWidth = 1000
    const posterHeight = 800

    // Convert mm to pixels (approximate)
    const pxPerMm = 3.779527559
    const paperWidthPx = dimensions.width * pxPerMm * (scale / 100)
    const paperHeightPx = dimensions.height * pxPerMm * (scale / 100)

    const pagesHorizontal = Math.ceil(posterWidth / paperWidthPx)
    const pagesVertical = Math.ceil(posterHeight / paperHeightPx)

    return { horizontal: pagesHorizontal, vertical: pagesVertical, total: pagesHorizontal * pagesVertical }
  }

  const pages = calculatePages()

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")

    // Add print-specific CSS
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Poster</title>
          <style>
            @page {
              size: ${paperSize === "custom" ? `${customWidth}mm ${customHeight}mm` : paperSize} ${localOrientation};
              margin: ${margins}mm;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .poster-container {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="poster-container">
            ${previewRef.current.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  const handleDownloadPDF = () => {
    // In a real implementation, this would use a library like html2pdf.js or jsPDF
    // For this demo, we'll just show an alert
    alert(
      "PDF download functionality would be implemented here. This would convert the poster to a PDF with the selected paper size and orientation.",
    )
  }

  const handleZoomChange = (value) => {
    setZoom(value[0])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Print Preview</DialogTitle>
          <DialogDescription>
            Preview how your poster will look when printed. Adjust paper size, orientation, and scaling.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="settings">Print Settings</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(10, zoom - 10))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Slider value={[zoom]} min={10} max={100} step={5} className="w-32" onValueChange={handleZoomChange} />
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(100, zoom + 10))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">{zoom}%</span>
            </div>
          </div>

          <TabsContent value="preview" className="flex-1 mt-4">
            <div className="bg-gray-100 p-4 rounded-md overflow-auto h-[calc(90vh-200px)]">
              <div
                className="bg-white mx-auto shadow-lg transform-origin-top-left"
                style={{
                  transform: `scale(${zoom / 100})`,
                  width: "fit-content",
                }}
              >
                <div
                  ref={previewRef}
                  className={cn("relative", showGrid && "bg-grid-pattern")}
                  style={{
                    width: `${dimensions.width * 3.779527559 * (scale / 100)}px`,
                    height: `${dimensions.height * 3.779527559 * (scale / 100)}px`,
                    padding: `${margins}mm`,
                  }}
                >
                  {/* Page break indicators */}
                  {showPageBreaks &&
                    pages.horizontal > 1 &&
                    Array.from({ length: pages.horizontal - 1 }).map((_, i) => (
                      <div
                        key={`vbreak-${i}`}
                        className="absolute top-0 bottom-0 border-r-2 border-dashed border-blue-400 z-10"
                        style={{
                          left: `${((i + 1) * 100) / pages.horizontal}%`,
                          height: "100%",
                        }}
                      />
                    ))}

                  {showPageBreaks &&
                    pages.vertical > 1 &&
                    Array.from({ length: pages.vertical - 1 }).map((_, i) => (
                      <div
                        key={`hbreak-${i}`}
                        className="absolute left-0 right-0 border-b-2 border-dashed border-blue-400 z-10"
                        style={{
                          top: `${((i + 1) * 100) / pages.vertical}%`,
                          width: "100%",
                        }}
                      />
                    ))}

                  {/* Render the poster at the specified scale */}
                  <div style={{ transform: `scale(${scale / 100})`, transformOrigin: "top left" }}>
                    <PosterCanvas
                      template={template}
                      colorTheme={colorTheme}
                      fontFamily={fontFamily}
                      fontSize={fontSize}
                      orientation={orientation}
                      previewMode={true}
                      printMode={true}
                      initialSections={sections}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {pages.total > 1 ? (
                  <span>
                    Will print on {pages.total} pages ({pages.horizontal}×{pages.vertical})
                  </span>
                ) : (
                  <span>Will print on 1 page</span>
                )}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paper-size">Paper Size</Label>
                  <Select value={paperSize} onValueChange={setPaperSize}>
                    <SelectTrigger id="paper-size">
                      <SelectValue placeholder="Select paper size" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(paperSizes).map(([key, size]) => (
                        <SelectItem key={key} value={key}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {paperSize === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom-width">Width (mm)</Label>
                      <Input
                        id="custom-width"
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        min={100}
                        max={2000}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-height">Height (mm)</Label>
                      <Input
                        id="custom-height"
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                        min={100}
                        max={2000}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="orientation">Orientation</Label>
                  <Select value={localOrientation} onValueChange={setOrientation}>
                    <SelectTrigger id="orientation">
                      <SelectValue placeholder="Select orientation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="margins">Margins (mm)</Label>
                  <Slider
                    id="margins"
                    value={[margins]}
                    min={0}
                    max={50}
                    step={1}
                    onValueChange={(value) => setMargins(value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0mm</span>
                    <span>{margins}mm</span>
                    <span>50mm</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scale">Scale (%)</Label>
                  <Slider
                    id="scale"
                    value={[scale]}
                    min={10}
                    max={200}
                    step={5}
                    onValueChange={(value) => setScale(value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10%</span>
                    <span>{scale}%</span>
                    <span>200%</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Grid className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="show-grid">Show Grid</Label>
                    </div>
                    <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Maximize className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="show-page-breaks">Show Page Breaks</Label>
                    </div>
                    <Switch id="show-page-breaks" checked={showPageBreaks} onCheckedChange={setShowPageBreaks} />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-md mt-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Print Tips</h3>
                  <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                    <li>For large posters, use A0 or A1 paper size at a professional print shop</li>
                    <li>Adjust scale to fit your poster on fewer pages</li>
                    <li>Use landscape orientation for wider posters</li>
                    <li>Check page breaks to ensure important content isn't split</li>
                    <li>Download as PDF for the best print quality</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
