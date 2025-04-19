"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Citation } from "./perplexity-client"
import { v4 as uuidv4 } from "uuid"

interface CitationLibraryContextType {
  citations: Citation[]
  addCitation: (citation: Citation) => void
  updateCitation: (id: string, citation: Partial<Citation>) => void
  deleteCitation: (id: string) => void
  getCitation: (id: string) => Citation | undefined
  formatCitation: (id: string, style: string) => string
}

const CitationLibraryContext = createContext<CitationLibraryContextType | undefined>(undefined)

interface CitationLibraryProviderProps {
  children: ReactNode
}

export function CitationLibraryProvider({ children }: CitationLibraryProviderProps) {
  const [citations, setCitations] = useState<Citation[]>([])

  // Load citations from localStorage on initial render
  useEffect(() => {
    const savedCitations = localStorage.getItem("posterCitations")
    if (savedCitations) {
      try {
        setCitations(JSON.parse(savedCitations))
      } catch (error) {
        console.error("Failed to parse saved citations:", error)
      }
    }
  }, [])

  // Save citations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("posterCitations", JSON.stringify(citations))
  }, [citations])

  const addCitation = (citation: Citation) => {
    // Generate an ID if one doesn't exist
    const newCitation = {
      ...citation,
      id: citation.id || uuidv4(),
    }

    // Check for duplicates based on DOI or title
    const isDuplicate = citations.some(
      (c) => (c.doi && c.doi === newCitation.doi) || c.title.toLowerCase() === newCitation.title.toLowerCase(),
    )

    if (!isDuplicate) {
      setCitations((prev) => [...prev, newCitation])
      return newCitation.id
    }

    return null
  }

  const updateCitation = (id: string, updatedFields: Partial<Citation>) => {
    setCitations((prev) => prev.map((citation) => (citation.id === id ? { ...citation, ...updatedFields } : citation)))
  }

  const deleteCitation = (id: string) => {
    setCitations((prev) => prev.filter((citation) => citation.id !== id))
  }

  const getCitation = (id: string) => {
    return citations.find((citation) => citation.id === id)
  }

  // Simple citation formatter (in a real app, this would use the Perplexity API)
  const formatCitation = (id: string, style: string) => {
    const citation = getCitation(id)
    if (!citation) return ""

    // Very basic APA-style formatting as fallback
    return `${citation.authors} (${citation.year}). ${citation.title}. ${citation.journal || ""} ${citation.volume || ""}${citation.issue ? `(${citation.issue})` : ""}, ${citation.pages || ""}.`
  }

  const value = {
    citations,
    addCitation,
    updateCitation,
    deleteCitation,
    getCitation,
    formatCitation,
  }

  return <CitationLibraryContext.Provider value={value}>{children}</CitationLibraryContext.Provider>
}

export function useCitationLibrary() {
  const context = useContext(CitationLibraryContext)
  if (context === undefined) {
    throw new Error("useCitationLibrary must be used within a CitationLibraryProvider")
  }
  return context
}
