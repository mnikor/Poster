"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileImage, FileIcon as FilePdf, Share2, Copy } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Add the import for AIPosterReview at the top of the file

export default function ExportOptions({ onExport }) {
  const [exportFormat, setExportFormat] = useState("pdf")
  const [paperSize, setPaperSize] = useState("a0")
  const [resolution, setResolution] = useState("300")
  const [filename, setFilename] = useState("academic-poster")

  const handleExport = () => {
    onExport({
      format: exportFormat,
      paperSize,
      resolution: Number.parseInt(resolution),
      filename,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Export Format</Label>
          <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="flex space-x-2">
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="text-sm flex items-center">
                <FilePdf className="h-3 w-3 mr-1" />
                PDF
              </Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="png" id="png" />
              <Label htmlFor="png" className="text-sm flex items-center">
                <FileImage className="h-3 w-3 mr-1" />
                PNG
              </Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="jpg" id="jpg" />
              <Label htmlFor="jpg" className="text-sm flex items-center">
                <FileImage className="h-3 w-3 mr-1" />
                JPG
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filename" className="text-xs text-gray-500">
            Filename
          </Label>
          <Input id="filename" value={filename} onChange={(e) => setFilename(e.target.value)} className="h-8 text-sm" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paper-size" className="text-xs text-gray-500">
            Paper Size
          </Label>
          <Select value={paperSize} onValueChange={setPaperSize}>
            <SelectTrigger id="paper-size" className="h-8 text-sm">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a0">A0 (841 × 1189 mm)</SelectItem>
              <SelectItem value="a1">A1 (594 × 841 mm)</SelectItem>
              <SelectItem value="custom">Custom Size</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {exportFormat !== "pdf" && (
          <div className="space-y-2">
            <Label htmlFor="resolution" className="text-xs text-gray-500">
              Resolution (DPI)
            </Label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger id="resolution" className="h-8 text-sm">
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="72">72 DPI (Web)</SelectItem>
                <SelectItem value="150">150 DPI (Medium)</SelectItem>
                <SelectItem value="300">300 DPI (Print)</SelectItem>
                <SelectItem value="600">600 DPI (High Quality)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="pt-2 flex flex-col space-y-2">
          <Button onClick={handleExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Poster
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Copy className="h-3 w-3 mr-1" />
              Duplicate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
