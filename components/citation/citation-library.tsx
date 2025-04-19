"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, Trash2, Copy, ExternalLink, Download } from "lucide-react"
import { useCitationLibrary } from "./citation-library-context"
import type { Citation } from "./perplexity-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CitationLibrary() {
  const { citations, deleteCitation, formatCitation } = useCitationLibrary()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"author" | "year" | "title">("author")
  const [filterType, setFilterType] = useState<string | null>(null)
  const [selectedCitations, setSelectedCitations] = useState<string[]>([])
  const [formatDialogOpen, setFormatDialogOpen] = useState(false)
  const [citationStyle, setCitationStyle] = useState("apa")
  const [formattedCitations, setFormattedCitations] = useState<string[]>([])

  // Get unique citation types for filtering
  const citationTypes = Array.from(new Set(citations.map((c) => c.journal || "Other")))

  // Filter and sort citations
  const filteredCitations = citations
    .filter((citation) => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          citation.title.toLowerCase().includes(query) ||
          citation.authors.toLowerCase().includes(query) ||
          String(citation.year).includes(query) ||
          (citation.journal && citation.journal.toLowerCase().includes(query))
        )
      }

      // Apply type filter
      if (filterType) {
        if (filterType === "Other") {
          return !citation.journal
        }
        return citation.journal === filterType
      }

      return true
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "author") {
        return a.authors.localeCompare(b.authors)
      } else if (sortBy === "year") {
        return Number(b.year) - Number(a.year)
      } else {
        return a.title.localeCompare(b.title)
      }
    })

  const handleSelectCitation = (id: string) => {
    setSelectedCitations((prev) => {
      if (prev.includes(id)) {
        return prev.filter((cid) => cid !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedCitations.length === filteredCitations.length) {
      setSelectedCitations([])
    } else {
      setSelectedCitations(filteredCitations.map((c) => c.id!))
    }
  }

  const handleDeleteSelected = () => {
    selectedCitations.forEach((id) => deleteCitation(id))
    setSelectedCitations([])
  }

  const handleFormatSelected = () => {
    const formatted = selectedCitations.map((id) => formatCitation(id, citationStyle))
    setFormattedCitations(formatted)
    setFormatDialogOpen(true)
  }

  const handleExportBibTeX = () => {
    // Simple BibTeX export implementation
    const bibtex = selectedCitations
      .map((id) => {
        const citation = citations.find((c) => c.id === id)
        if (!citation) return ""

        const key = `${citation.authors.split(",")[0].trim()}${citation.year}`

        return `@article{${key},
  title = {${citation.title}},
  author = {${citation.authors}},
  year = {${citation.year}}${
    citation.journal
      ? `,
  journal = {${citation.journal}}`
      : ""
  }${
    citation.volume
      ? `,
  volume = {${citation.volume}}`
      : ""
  }${
    citation.issue
      ? `,
  number = {${citation.issue}}`
      : ""
  }${
    citation.pages
      ? `,
  pages = {${citation.pages}}`
      : ""
  }${
    citation.doi
      ? `,
  doi = {${citation.doi}}`
      : ""
  }
}`
      })
      .join("\n\n")

    // Create and download file
    const blob = new Blob([bibtex], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "citations.bib"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Citation Library</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedCitations.length === filteredCitations.length ? "Deselect All" : "Select All"}
            </Button>
            {selectedCitations.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={handleFormatSelected}>
                  Format ({selectedCitations.length})
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportBibTeX}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search citations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="author">Sort by Author</SelectItem>
                <SelectItem value="year">Sort by Year</SelectItem>
                <SelectItem value="title">Sort by Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <Button variant={filterType === null ? "default" : "outline"} size="sm" onClick={() => setFilterType(null)}>
              All
            </Button>
            {citationTypes.map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
              >
                {type}
              </Button>
            ))}
          </div>

          {filteredCitations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {citations.length === 0 ? (
                <p>Your citation library is empty. Search for citations to add them here.</p>
              ) : (
                <p>No citations match your search criteria.</p>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {filteredCitations.map((citation) => (
                  <CitationCard
                    key={citation.id}
                    citation={citation}
                    isSelected={selectedCitations.includes(citation.id!)}
                    onSelect={() => handleSelectCitation(citation.id!)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <Dialog open={formatDialogOpen} onOpenChange={setFormatDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Formatted Citations</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex space-x-2 items-center">
                <span className="text-sm font-medium">Citation Style:</span>
                <Select value={citationStyle} onValueChange={setCitationStyle}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apa">APA 7th Edition</SelectItem>
                    <SelectItem value="mla">MLA 9th Edition</SelectItem>
                    <SelectItem value="chicago">Chicago 17th Edition</SelectItem>
                    <SelectItem value="harvard">Harvard</SelectItem>
                    <SelectItem value="ieee">IEEE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md p-4 bg-gray-50">
                {formattedCitations.map((citation, index) => (
                  <div key={index} className="mb-2 last:mb-0">
                    <p>{citation}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => navigator.clipboard.writeText(formattedCitations.join("\n\n"))}
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

interface CitationCardProps {
  citation: Citation
  isSelected: boolean
  onSelect: () => void
}

function CitationCard({ citation, isSelected, onSelect }: CitationCardProps) {
  return (
    <div
      className={`p-3 border rounded-md transition-colors ${
        isSelected ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50"
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium">{citation.title}</h4>
          <p className="text-sm text-gray-600">{citation.authors}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline">{citation.year}</Badge>
            {citation.journal && (
              <Badge variant="outline" className="font-normal">
                {citation.journal}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex space-x-1">
          {citation.doi && (
            <a
              href={`https://doi.org/${citation.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
