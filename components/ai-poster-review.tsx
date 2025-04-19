"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb } from "lucide-react"

export default function AIPosterReview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center">
          <Lightbulb className="h-4 w-4 mr-2" />
          AI Poster Review
        </CardTitle>
        <CardDescription>Get AI-powered suggestions to improve your poster.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Analyze your poster content and get suggestions for improvements.</p>
          <Badge variant="secondary">Coming Soon</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
