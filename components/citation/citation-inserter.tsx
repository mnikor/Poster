"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Quote, Search, X } from "lucide-react"
import { useCitationLibrary } from "./citation-library-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CitationInserterProps {
  onInsert: (citationText: string) => void
}

export default function CitationInserter({ onInsert }: CitationInserterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCitations, setSelectedCitations] = useState<string[]>([])
  const [citationStyle, setCitationStyle] = useState("apa")

  // Use try-catch to handle the case when the component is rendered outside the CitationLibraryProvider
  let citations = []
  let formatCitation = (id: string, style: string) => "Citation placeholder"

  const citationLibrary = useCitationLibrary()
  citations = citationLibrary.citations
  formatCitation = citationLibrary.formatCitation

  // Filter citations based on search query
  const filteredCitations = citations.filter((citation) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      citation.title.toLowerCase().includes(query) ||
      citation.authors.toLowerCase().includes(query) ||
      String(citation.year).includes(query)
    )
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

  const handleInsert = () => {
    if (selectedCitations.length === 0) return

    // Format based on citation style
    let citationText = ""

    if (citationStyle === "numbered") {
      // Numbered citation style [1,2,3]
      citationText = `[${selectedCitations.map((_, index) => index + 1).join(",")}]`
    } else if (citationStyle === "author-year") {
      // Author-year citation style (Smith, 2020; Jones, 2021)
      const formattedCitations = selectedCitations.map((id) => {
        const citation = citations.find((c) => c.id === id)
        if (!citation) return ""

        const author = citation.authors.split(",")[0].trim()
        return `${author}, ${citation.year}`
      })

      citationText = `(${formattedCitations.join("; ")})`
    } else {
      // Default APA style
      const formattedCitations = selectedCitations.map((id) => formatCitation(id, citationStyle))
      citationText = formattedCitations.join("; ")
    }

    onInsert(citationText)
    setIsOpen(false)
    setSelectedCitations([])
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Quote className="h-4 w-4 mr-2" />
          Cite
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Insert Citation</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search citations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <ScrollArea className="h-60">
          {filteredCitations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {citations.length === 0 ? (
                <p>Your citation library is empty. Add citations first.</p>
              ) : (
                <p>No citations match your search.</p>
              )}
            </div>
          ) : (
            <div className="py-1">
              {filteredCitations.map((citation) => (
                <div key={citation.id} className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50">
                  <Checkbox
                    checked={selectedCitations.includes(citation.id!)}
                    onCheckedChange={() => handleSelectCitation(citation.id!)}
                    id={`citation-${citation.id}`}
                  />
                  <label htmlFor={`citation-${citation.id}`} className="text-sm flex-1 cursor-pointer">
                    <div className="font-medium">
                      {citation.authors} ({citation.year})
                    </div>
                    <div className="text-gray-500 truncate">{citation.title}</div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm">Citation style:</span>
            <Select value={citationStyle} onValueChange={setCitationStyle}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apa">APA</SelectItem>
                <SelectItem value="mla">MLA</SelectItem>
                <SelectItem value="chicago">Chicago</SelectItem>
                <SelectItem value="author-year">(Author, Year)</SelectItem>
                <SelectItem value="numbered">[1,2,3]</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleInsert} disabled={selectedCitations.length === 0} className="w-full">
            Insert Citation{selectedCitations.length > 1 ? "s" : ""}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
