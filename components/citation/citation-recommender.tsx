"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, Plus, ThumbsUp, ThumbsDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { citationClient, type CitationRecommendation } from "./perplexity-client"
import { useCitationLibrary } from "./citation-library-context"

export default function CitationRecommender({ posterContent }: { posterContent: string }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendations, setRecommendations] = useState<CitationRecommendation[]>([])
  const { addCitation } = useCitationLibrary()

  const handleGenerateRecommendations = async () => {
    setIsGenerating(true)
    try {
      const results = await citationClient.getRecommendations(posterContent)
      setRecommendations(results)
    } catch (error) {
      console.error("Failed to generate recommendations:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddToLibrary = (citation: CitationRecommendation["citation"]) => {
    addCitation(citation)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Citation Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerateRecommendations} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing content...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Recommendations
            </>
          )}
        </Button>

        {recommendations.length > 0 && (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={index}
                  recommendation={recommendation}
                  onAdd={() => handleAddToLibrary(recommendation.citation)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

interface RecommendationCardProps {
  recommendation: CitationRecommendation
  onAdd: () => void
}

function RecommendationCard({ recommendation, onAdd }: RecommendationCardProps) {
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null)

  return (
    <Card>
      <CardContent className="p-4">
        <div>
          <h3 className="font-medium">{recommendation.citation.title}</h3>
          <p className="text-sm text-gray-600">{recommendation.citation.authors}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline">{recommendation.citation.year}</Badge>
            {recommendation.citation.journal && (
              <Badge variant="outline" className="font-normal">
                {recommendation.citation.journal}
              </Badge>
            )}
          </div>

          <div className="mt-3 space-y-2">
            <div>
              <p className="text-sm font-medium">Why it's relevant:</p>
              <p className="text-sm text-gray-600">{recommendation.relevance}</p>
            </div>

            <div>
              <p className="text-sm font-medium">Suggested location:</p>
              <p className="text-sm text-gray-600">{recommendation.suggestedLocation}</p>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={feedback === "helpful" ? "default" : "outline"}
                onClick={() => setFeedback("helpful")}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Helpful
              </Button>
              <Button
                size="sm"
                variant={feedback === "not-helpful" ? "default" : "outline"}
                onClick={() => setFeedback("not-helpful")}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Not Helpful
              </Button>
            </div>

            <Button size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Add to Library
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
