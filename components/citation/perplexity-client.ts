import { perplexity } from "@ai-sdk/perplexity"
import { generateText } from "ai"

export interface Citation {
  id?: string
  title: string
  authors: string
  year: string | number
  journal?: string
  volume?: string
  issue?: string
  pages?: string
  doi?: string
  url?: string
  publisher?: string
  abstract?: string
  keywords?: string[]
}

export interface CitationSearchResult {
  citation: Citation
  confidence: number
  sources: string[]
}

export interface VerificationResult {
  isAccurate: boolean
  corrections?: Partial<Citation>
  message: string
  sources: string[]
}

export interface CitationRecommendation {
  citation: Citation
  relevance: string
  suggestedLocation: string
}

/**
 * Client for interacting with Perplexity API for citation-related operations
 */
export class PerplexityCitationClient {
  private model = perplexity("sonar-pro")

  /**
   * Search for citations based on a natural language query
   */
  async searchCitation(query: string): Promise<CitationSearchResult[]> {
    try {
      const { text, sources } = await generateText({
        model: this.model,
        prompt: `Find the complete citation information for: "${query}".
                Please return the results in the following JSON format:
                [
                  {
                    "title": "Full paper title",
                    "authors": "Author names in format: Last, First; Last, First",
                    "year": "Publication year",
                    "journal": "Journal name if applicable",
                    "volume": "Volume number if applicable",
                    "issue": "Issue number if applicable",
                    "pages": "Page range if applicable",
                    "doi": "DOI if available",
                    "url": "URL if available",
                    "publisher": "Publisher name if applicable"
                  }
                ]
                If multiple results are found, include up to 3 most relevant citations.
                Return ONLY the JSON array with no additional text.`,
      })

      // Extract JSON from the response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\[\s*\{[\s\S]*\}\s*\]/)

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        const citations = JSON.parse(jsonStr)

        return citations.map((citation: Citation, index: number) => ({
          citation,
          confidence: 0.9 - index * 0.1, // Assign decreasing confidence scores
          sources: sources || [],
        }))
      }

      return []
    } catch (error) {
      console.error("Citation search failed:", error)
      return []
    }
  }

  /**
   * Verify if a citation is accurate and complete
   */
  async verifyCitation(citation: Citation): Promise<VerificationResult> {
    try {
      const citationStr = this.formatCitationForPrompt(citation)

      const { text, sources } = await generateText({
        model: this.model,
        prompt: `Verify if this citation is accurate and complete:
                "${citationStr}"
                
                Check for any errors in author names, title, journal, year, or other details.
                If there are errors, provide the correct information.
                
                Return your response in this JSON format:
                {
                  "isAccurate": true/false,
                  "corrections": {
                    // only include fields that need correction
                  },
                  "message": "Explanation of verification results"
                }
                
                Return ONLY the JSON with no additional text.`,
      })

      // Extract JSON from the response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/)

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        const result = JSON.parse(jsonStr)

        return {
          ...result,
          sources: sources || [],
        }
      }

      return {
        isAccurate: false,
        message: "Failed to parse verification result",
        sources: [],
      }
    } catch (error) {
      console.error("Citation verification failed:", error)
      return {
        isAccurate: false,
        message: "Verification failed due to an error",
        sources: [],
      }
    }
  }

  /**
   * Enrich a citation with additional metadata
   */
  async enrichCitation(citation: Citation): Promise<Citation> {
    try {
      const citationStr = this.formatCitationForPrompt(citation)

      const { text } = await generateText({
        model: this.model,
        prompt: `Enrich this citation with additional metadata:
                "${citationStr}"
                
                Please add any missing information including:
                - Complete author list
                - DOI
                - URL
                - Abstract (a brief summary)
                - Keywords (up to 5)
                
                Return as JSON in this format:
                {
                  "title": "...",
                  "authors": "...",
                  "year": "...",
                  "journal": "...",
                  "volume": "...",
                  "issue": "...",
                  "pages": "...",
                  "doi": "...",
                  "url": "...",
                  "publisher": "...",
                  "abstract": "...",
                  "keywords": ["keyword1", "keyword2", ...]
                }
                
                Return ONLY the JSON with no additional text.`,
      })

      // Extract JSON from the response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/)

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        const enriched = JSON.parse(jsonStr)

        // Preserve the original ID if it exists
        if (citation.id) {
          enriched.id = citation.id
        }

        return enriched
      }

      return citation
    } catch (error) {
      console.error("Citation enrichment failed:", error)
      return citation
    }
  }

  /**
   * Get citation recommendations based on poster content
   */
  async getRecommendations(content: string): Promise<CitationRecommendation[]> {
    try {
      const { text } = await generateText({
        model: this.model,
        prompt: `Based on this academic poster content, suggest 3-5 relevant citations that would strengthen it:
                
                ${content}
                
                For each recommendation, provide:
                1. The complete citation (with all available metadata)
                2. A brief explanation of why this paper is relevant
                3. Where in the poster it could be cited
                
                Focus on recent, high-impact papers from reputable sources.
                
                Return your recommendations in this JSON format:
                [
                  {
                    "citation": {
                      "title": "...",
                      "authors": "...",
                      "year": "...",
                      "journal": "...",
                      "volume": "...",
                      "issue": "...",
                      "pages": "...",
                      "doi": "...",
                      "url": "..."
                    },
                    "relevance": "Explanation of why this paper is relevant",
                    "suggestedLocation": "Where in the poster to cite this"
                  },
                  ...
                ]
                
                Return ONLY the JSON array with no additional text.`,
      })

      // Extract JSON from the response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\[\s*\{[\s\S]*\}\s*\]/)

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        return JSON.parse(jsonStr)
      }

      return []
    } catch (error) {
      console.error("Citation recommendations failed:", error)
      return []
    }
  }

  /**
   * Format a citation in a specific style
   */
  async formatCitation(citation: Citation, style: string): Promise<string> {
    try {
      const citationStr = this.formatCitationForPrompt(citation)

      const { text } = await generateText({
        model: this.model,
        prompt: `Format this citation in ${style} style:
                
                "${citationStr}"
                
                Return only the formatted citation text without any additional explanation or markdown formatting.`,
      })

      // Clean up the response to get just the formatted citation
      return text.replace(/^["'\s`]+|["'\s`]+$/g, "")
    } catch (error) {
      console.error("Citation formatting failed:", error)
      return this.formatCitationForPrompt(citation)
    }
  }

  /**
   * Helper method to format a citation object as a string for prompts
   */
  private formatCitationForPrompt(citation: Citation): string {
    const parts = [citation.authors, `(${citation.year})`, `"${citation.title}"`]

    if (citation.journal) {
      parts.push(`${citation.journal}`)

      const journalDetails = [
        citation.volume && `vol. ${citation.volume}`,
        citation.issue && `no. ${citation.issue}`,
        citation.pages && `pp. ${citation.pages}`,
      ]
        .filter(Boolean)
        .join(", ")

      if (journalDetails) {
        parts.push(`${journalDetails}`)
      }
    } else if (citation.publisher) {
      parts.push(`${citation.publisher}`)
    }

    if (citation.doi) {
      parts.push(`DOI: ${citation.doi}`)
    }

    if (citation.url) {
      parts.push(`URL: ${citation.url}`)
    }

    return parts.join(". ")
  }
}

// Create a singleton instance for use throughout the application
export const citationClient = new PerplexityCitationClient()
