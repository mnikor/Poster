"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CitationSearch from "./citation-search"
import CitationLibrary from "./citation-library"
import CitationVerifier from "./citation-verifier"
import CitationRecommender from "./citation-recommender"
import { Button } from "@/components/ui/button"

export default function CitationManager({ posterContent = "" }: { posterContent?: string }) {
  const [activeTab, setActiveTab] = useState("search")

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="library">My Library</TabsTrigger>
          <TabsTrigger value="verify">Verify</TabsTrigger>
          <TabsTrigger value="recommend">Recommend</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-4">
          <CitationSearch />
        </TabsContent>

        <TabsContent value="library" className="mt-4">
          <CitationLibrary />
        </TabsContent>

        <TabsContent value="verify" className="mt-4">
          <CitationVerifier />
        </TabsContent>

        <TabsContent value="recommend" className="mt-4">
          <CitationRecommender posterContent={posterContent} />
        </TabsContent>
      </Tabs>
      <div className="flex justify-end mt-6">
        <Button onClick={() => window.dispatchEvent(new CustomEvent("navigate-to-tab", { detail: "design" }))}>
          Continue to Poster Design
        </Button>
      </div>
    </div>
  )
}
