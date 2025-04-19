"use server"

// Simulated AI responses instead of using the OpenAI API
// This avoids the need for an API key in the demo environment

export async function extractContentFromDocuments(documentText: string) {
  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Return simulated data
    return {
      success: true,
      data: simulateExtractedData(),
    }
  } catch (error) {
    console.error("Error extracting content:", error)
    return { success: false, error: "Failed to extract content from documents" }
  }
}

export async function summarizeText(text: string, targetLength: "short" | "medium" | "long" = "medium") {
  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a simulated summary based on the original text
    const words = text.split(" ")
    let summaryLength

    switch (targetLength) {
      case "short":
        summaryLength = Math.max(3, Math.floor(words.length * 0.3))
        break
      case "medium":
        summaryLength = Math.max(5, Math.floor(words.length * 0.5))
        break
      case "long":
        summaryLength = Math.max(7, Math.floor(words.length * 0.7))
        break
    }

    // Take some words from the beginning, middle and end to simulate a summary
    const beginning = words.slice(0, Math.floor(summaryLength * 0.4)).join(" ")
    const middle = words
      .slice(Math.floor(words.length * 0.4), Math.floor(words.length * 0.4) + Math.floor(summaryLength * 0.3))
      .join(" ")
    const end = words.slice(words.length - Math.floor(summaryLength * 0.3)).join(" ")

    const summary = `${beginning} ${middle} ${end}`

    return { success: true, text: summary }
  } catch (error) {
    console.error("Error summarizing text:", error)
    return { success: false, error: "Failed to summarize text" }
  }
}

export async function rephraseText(text: string, style: "formal" | "simple" | "engaging" = "formal") {
  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple rephrasing simulation
    let rephrased = text

    switch (style) {
      case "formal":
        rephrased = `Our analysis indicates that ${text.toLowerCase()}`
        break
      case "simple":
        rephrased = `Simply put, ${text.toLowerCase()}`
        break
      case "engaging":
        rephrased = `Interestingly, we found that ${text.toLowerCase()}`
        break
    }

    return { success: true, text: rephrased }
  } catch (error) {
    console.error("Error rephrasing text:", error)
    return { success: false, error: "Failed to rephrase text" }
  }
}

export async function generateFigureCaption(figureDescription: string) {
  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a simulated caption
    const caption = `This figure illustrates ${figureDescription.toLowerCase()}. The data shows significant trends that support our research hypothesis.`

    return { success: true, text: caption }
  } catch (error) {
    console.error("Error generating caption:", error)
    return { success: false, error: "Failed to generate figure caption" }
  }
}

export async function suggestImprovements(sectionType: string, content: string) {
  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Generate simulated improvement suggestions
    const suggestions = `Here are some suggestions to improve this ${sectionType} section:

1. Consider adding more quantitative data to strengthen your argument.
2. The second paragraph could be more concise.
3. Adding a brief comparison to related work would provide context.
4. Consider using more specific terminology in the technical descriptions.
5. A concluding sentence would help tie the ideas together.`

    return { success: true, text: suggestions }
  } catch (error) {
    console.error("Error generating suggestions:", error)
    return { success: false, error: "Failed to generate improvement suggestions" }
  }
}

// Helper function to simulate extracted data
function simulateExtractedData() {
  // This is a simplified version - in a real app, you'd parse the actual document
  return {
    title: {
      title: "Simulated Research Title",
      authors: "Simulated Authors",
      institution: "Simulated Institution",
    },
    abstract: {
      title: "Abstract",
      text: "This is a simulated abstract extracted from the document.",
    },
    // Add other sections as needed
  }
}

// Helper function to parse AI response into structured data
function parseAIResponse(aiResponse: string) {
  // This is a simplified parser - in a real app, you'd want more robust parsing
  // based on the actual format of the AI response

  // For now, we'll return a mock structure similar to our simulatedExtractedData
  return {
    title: {
      title: "Extracted Research Title",
      authors: "Extracted Authors",
      institution: "Extracted Institution",
    },
    abstract: {
      title: "Abstract",
      text: "Extracted abstract text...",
    },
    // Add other sections as needed
  }
}
