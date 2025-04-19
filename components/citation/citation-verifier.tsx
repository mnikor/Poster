"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle, AlertCircle, Shield } from "lucide-react"
import { citationClient, type Citation, type VerificationResult } from "./perplexity-client"
import { useCitationLibrary } from "./citation-library-context"

export default function CitationVerifier() {
  const [inputText, setInputText] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [parsedCitation, setParsedCitation] = useState<Citation | null>(null)
  const { addCitation } = useCitationLibrary()

  const handleVerify = async () => {
    if (!inputText.trim()) return

    setIsVerifying(true)
    try {
      // First, try to parse the citation
      const searchResults = await citationClient.searchCitation(inputText)

      if (searchResults.length > 0) {
        setParsedCitation(searchResults[0].citation)

        // Then verify it
        const result = await citationClient.verifyCitation(searchResults[0].citation)
        setVerificationResult(result)
      } else {
        setVerificationResult({
          isAccurate: false,
          message: "Unable to parse the citation. Please check the format and try again.",
          sources: [],
        })
      }
    } catch (error) {
      console.error("Verification failed:", error)
      setVerificationResult({
        isAccurate: false,
        message: "An error occurred during verification. Please try again.",
        sources: [],
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleAddToLibrary = () => {
    if (parsedCitation) {
      // If there are corrections, apply them
      const correctedCitation = verificationResult?.corrections
        ? { ...parsedCitation, ...verificationResult.corrections }
        : parsedCitation

      addCitation(correctedCitation)

      // Reset the form
      setInputText("")
      setParsedCitation(null)
      setVerificationResult(null)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Citation Verifier</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Paste a citation to verify its accuracy..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleVerify} disabled={isVerifying || !inputText.trim()}>
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Verify Citation
              </>
            )}
          </Button>
        </div>

        {verificationResult && (
          <div className={`p-4 rounded-md ${verificationResult.isAccurate ? "bg-green-50" : "bg-amber-50"}`}>
            <div className="flex items-start">
              {verificationResult.isAccurate ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
              )}
              <div>
                <h3 className={`font-medium ${verificationResult.isAccurate ? "text-green-800" : "text-amber-800"}`}>
                  {verificationResult.isAccurate ? "Citation is accurate" : "Citation needs corrections"}
                </h3>
                <p className="text-sm mt-1">{verificationResult.message}</p>

                {verificationResult.corrections && Object.keys(verificationResult.corrections).length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium text-sm">Suggested corrections:</h4>
                    <ul className="list-disc pl-5 text-sm mt-1">
                      {Object.entries(verificationResult.corrections).map(([field, value]) => (
                        <li key={field}>
                          <span className="font-medium">{field}:</span> {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {parsedCitation && (
                  <div className="mt-3">
                    <Button
                      size="sm"
                      onClick={handleAddToLibrary}
                      variant={verificationResult.isAccurate ? "default" : "outline"}
                    >
                      {verificationResult.isAccurate ? "Add to Library" : "Add with Corrections"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
