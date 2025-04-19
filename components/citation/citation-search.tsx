"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search, Plus, ExternalLink, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { citationClient, type Citation, type CitationSearchResult } from "./perplexity-client"
import { useCitationLibrary } from "./citation-library-context"

export default function CitationSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<CitationSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchTab, setSearchTab] = useState("natural")
  const { addCitation } = useCitationLibrary()

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const searchResults = await citationClient.searchCitation(query)
      setResults(searchResults)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleAddToLibrary = (citation: Citation) => {
    addCitation(citation)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Citation Search</CardTitle>
        <CardDescription>Search for citations using natural language, DOI, or paper details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={searchTab} onValueChange={setSearchTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="natural">Natural Language</TabsTrigger>
            <TabsTrigger value="structured">Structured Search</TabsTrigger>
          </TabsList>

          <TabsContent value="natural" className="space-y-4 pt-2">
            <div className="flex space-x-2">
              <Input
                placeholder="Search by paper title, author, topic, or DOI..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              <p>Example searches:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>"Smith et al. 2022 machine learning"</li>
                <li>"Recent papers on CRISPR gene editing"</li>
                <li>"10.1038/s41586-021-03819-2" (DOI)</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="structured" className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Author(s)" />
              <Input placeholder="Year" />
              <Input placeholder="Title" className="col-span-2" />
              <Input placeholder="Journal/Conference" className="col-span-2" />
              <Input placeholder="DOI" />
              <div className="flex justify-end">
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {results.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Search Results</h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {results.map((result, index) => (
                  <CitationResultCard key={index} result={result} onAdd={() => handleAddToLibrary(result.citation)} />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface CitationResultCardProps {
  result: CitationSearchResult
  onAdd: () => void
}

function CitationResultCard({ result, onAdd }: CitationResultCardProps) {
  const { citation, confidence, sources } = result
  const [expanded, setExpanded] = useState(false)

  // Format confidence as percentage
  const confidencePercent = Math.round(confidence * 100)

  // Determine confidence level for styling
  const getConfidenceColor = () => {
    if (confidencePercent >= 90) return "bg-green-100 text-green-800"
    if (confidencePercent >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-base">{citation.title}</h4>
            <p className="text-sm text-gray-600">{citation.authors}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{citation.year}</Badge>
              {citation.journal && (
                <Badge variant="outline" className="font-normal">
                  {citation.journal}
                </Badge>
              )}
              <Badge className={getConfidenceColor()}>{confidencePercent}% match</Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)}>
            <FileText className="h-4 w-4" />
          </Button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t text-sm">
            {citation.abstract && (
              <div className="mb-2">
                <p className="font-medium">Abstract:</p>
                <p className="text-gray-600">{citation.abstract}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {citation.doi && (
                <div>
                  <span className="font-medium">DOI: </span>
                  <a
                    href={`https://doi.org/${citation.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center"
                  >
                    {citation.doi}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}

              {citation.url && (
                <div>
                  <span className="font-medium">URL: </span>
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center"
                  >
                    View
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}

              {citation.volume && (
                <div>
                  <span className="font-medium">Volume: </span>
                  <span>{citation.volume}</span>
                </div>
              )}

              {citation.issue && (
                <div>
                  <span className="font-medium">Issue: </span>
                  <span>{citation.issue}</span>
                </div>
              )}

              {citation.pages && (
                <div>
                  <span className="font-medium">Pages: </span>
                  <span>{citation.pages}</span>
                </div>
              )}

              {citation.publisher && (
                <div>
                  <span className="font-medium">Publisher: </span>
                  <span>{citation.publisher}</span>
                </div>
              )}
            </div>

            {sources && sources.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Sources:</p>
                <ul className="list-disc pl-5 text-xs text-gray-600">
                  {sources.slice(0, 3).map((source, i) => (
                    <li key={i} className="truncate">
                      {source}
                    </li>
                  ))}
                  {sources.length > 3 && <li>+ {sources.length - 3} more sources</li>}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-2 bg-gray-50 flex justify-end">
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Add to Library
        </Button>
      </CardFooter>
    </Card>
  )
}
