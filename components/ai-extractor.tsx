"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Wand2, FileText, Check, AlertCircle, Upload, Table, BarChart, ImageIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

// Simulated extracted data sections
const simulatedExtractedData = {
  title: {
    title: "Effects of Climate Change on Biodiversity in Marine Ecosystems",
    authors: "Jane Smith, John Doe, Sarah Johnson",
    institution: "Ocean Research Institute, University of Marine Biology",
  },
  abstract: {
    title: "Abstract",
    text: "This study examines the impact of rising ocean temperatures on marine biodiversity. Through analysis of data collected over a 10-year period, we demonstrate significant changes in species distribution and population dynamics across multiple trophic levels. Our findings suggest that continued warming will lead to substantial ecosystem restructuring.",
  },
  introduction: {
    title: "Introduction",
    text: "Marine ecosystems are experiencing unprecedented changes due to global climate change. Rising ocean temperatures, acidification, and changing circulation patterns are affecting marine species in complex ways. This research aims to quantify these effects and provide insights for conservation strategies.",
  },
  methods: {
    title: "Methods",
    text: "We collected data from 15 monitoring stations across the Pacific Ocean between 2010-2020. Temperature, pH, and species abundance were recorded monthly. Statistical analysis was performed using R (version 4.1.0) with the vegan package for community analysis.",
  },
  results: {
    title: "Results",
    text: "Our analysis revealed a 12% decrease in species richness in tropical regions, while temperate regions showed a 7% increase. Species migration rates averaged 5.1 km/year poleward. Coral reef ecosystems showed the most dramatic changes, with 23% reduction in cover in the most affected areas.",
  },
  discussion: {
    title: "Discussion",
    text: "The observed shifts in species distribution align with predictions from climate models. The differential responses across trophic levels suggest potential mismatches in predator-prey relationships, which could further destabilize marine food webs.",
  },
  conclusion: {
    title: "Conclusion",
    text: "Our findings highlight the urgent need for comprehensive conservation strategies that account for shifting species distributions. Marine protected areas should be designed with climate change trajectories in mind to effectively preserve biodiversity.",
  },
  references: {
    title: "References",
    text: "1. Johnson et al. (2018). Climate change impacts on marine ecosystems. Nature Climate Change, 8(1), 24-33.\n2. Smith & Brown (2019). Species migration rates in warming oceans. Science, 365(6450), 1503-1506.\n3. Garcia et al. (2020). Coral reef resilience to climate change. Coral Reefs, 39(3), 729-742.",
  },
  figures: [
    {
      title: "Figure 1: Temperature Changes (2010-2020)",
      caption: "Mean annual sea surface temperature changes across study sites",
      imageUrl: "/ocean-warming-trend.png",
    },
    {
      title: "Figure 2: Species Richness Changes",
      caption: "Changes in species richness across latitude gradients",
      imageUrl: "/biodiversity-change-over-time.png",
    },
    {
      title: "Figure 3: Coral Cover Decline",
      caption: "Percentage decline in coral cover at monitored reef sites",
      imageUrl: "/coral-reef-decline-over-time.png",
    },
  ],
  tables: [
    {
      title: "Table 1: Migration Rates by Species Group",
      data: "Species Group,Migration Rate (km/year),p-value\nFish,6.2,<0.001\nInvertebrates,4.3,<0.001\nPlankton,8.7,<0.001\nSeabirds,3.1,0.02",
    },
  ],
  charts: [
    {
      title: "Temperature Trends (2010-2020)",
      type: "line",
      data: "2010,21.3\n2011,21.5\n2012,21.8\n2013,22.1\n2014,22.4\n2015,22.8\n2016,23.2\n2017,23.5\n2018,23.7\n2019,24.0\n2020,24.3",
      labels: "2010\n2011\n2012\n2013\n2014\n2015\n2016\n2017\n2018\n2019\n2020",
      color: "red",
      showLegend: true,
      showGrid: true,
    },
    {
      title: "Species Richness by Region",
      type: "bar",
      data: "45\n38\n62\n29\n51",
      labels: "Tropical\nSubtropical\nTemperate\nSubpolar\nPolar",
      color: "blue",
      showLegend: true,
      showGrid: true,
    },
    {
      title: "Ecosystem Composition",
      type: "pie",
      data: "42\n28\n15\n10\n5",
      labels: "Fish\nInvertebrates\nPlankton\nAlgae\nOther",
      color: "green",
      showLegend: true,
      showGrid: false,
    },
  ],
}

export default function AIExtractor({ onDataExtracted }) {
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionComplete, setExtractionComplete] = useState(false)
  const [activeTab, setActiveTab] = useState("automatic")
  const [customPrompt, setCustomPrompt] = useState(
    "Extract key information from my research documents to create an academic poster. Include title, authors, abstract, introduction, methods, results, discussion, and conclusion sections.",
  )
  const [selectedSections, setSelectedSections] = useState({
    title: true,
    abstract: true,
    introduction: true,
    methods: true,
    results: true,
    discussion: true,
    conclusion: true,
    references: true,
    figures: true,
    tables: true,
    charts: true,
  })
  const [documentText, setDocumentText] = useState("")
  const [error, setError] = useState("")
  const [extractedElements, setExtractedElements] = useState(null)
  const [selectedElements, setSelectedElements] = useState({
    figures: [],
    tables: [],
    charts: [],
  })

  const handleExtract = async () => {
    setIsExtracting(true)
    setError("")

    try {
      // Simulate extraction with progress
      simulateExtractionProgress()
    } catch (err) {
      console.error("Extraction error:", err)
      setError("An unexpected error occurred during extraction")
    }
  }

  const simulateExtractionProgress = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 2
      setExtractionProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsExtracting(false)
          setExtractionComplete(true)
          setExtractedElements({
            figures: simulatedExtractedData.figures,
            tables: simulatedExtractedData.tables,
            charts: simulatedExtractedData.charts,
          })
        }, 500)
      }
    }, 100)
  }

  const handleComplete = () => {
    // Combine the text content with selected visual elements
    const combinedData = {
      ...simulatedExtractedData,
      figures: simulatedExtractedData.figures.filter((_, index) => selectedElements.figures.includes(index)),
      tables: simulatedExtractedData.tables.filter((_, index) => selectedElements.tables.includes(index)),
      charts: simulatedExtractedData.charts.filter((_, index) => selectedElements.charts.includes(index)),
    }

    onDataExtracted(combinedData, "citations")
  }

  const toggleSection = (section) => {
    setSelectedSections({
      ...selectedSections,
      [section]: !selectedSections[section],
    })
  }

  const toggleElement = (type, index) => {
    setSelectedElements((prev) => {
      const newSelected = [...prev[type]]
      if (newSelected.includes(index)) {
        return {
          ...prev,
          [type]: newSelected.filter((i) => i !== index),
        }
      } else {
        return {
          ...prev,
          [type]: [...newSelected, index],
        }
      }
    })
  }

  const handleTextUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setDocumentText(event.target.result)
    }
    reader.readAsText(file)
  }

  const renderChartPreview = (chart) => {
    // Simple chart preview based on type
    switch (chart.type) {
      case "bar":
        return (
          <div className="h-24 flex items-end justify-around p-2 border rounded-md bg-gray-50">
            {chart.data.split("\n").map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-4"
                  style={{
                    height: `${Math.min(100, (Number.parseFloat(value) / 100) * 100)}%`,
                    backgroundColor: getColorValue(chart.color),
                  }}
                ></div>
                <span className="text-xs mt-1 max-w-[30px] truncate">
                  {chart.labels.split("\n")[index] || `Item ${index + 1}`}
                </span>
              </div>
            ))}
          </div>
        )

      case "line":
        return (
          <div className="h-24 relative p-2 border rounded-md bg-gray-50">
            <svg className="w-full h-full" viewBox="0 0 100 50">
              <polyline
                points="0,50 20,30 40,35 60,15 80,25 100,10"
                fill="none"
                stroke={getColorValue(chart.color)}
                strokeWidth="2"
              />
            </svg>
          </div>
        )

      case "pie":
        return (
          <div className="h-24 flex items-center justify-center p-2 border rounded-md bg-gray-50">
            <div className="h-16 w-16 rounded-full border-8" style={{ borderColor: getColorValue(chart.color) }}></div>
          </div>
        )

      default:
        return <div className="h-24 flex items-center justify-center border rounded-md">Chart Preview</div>
    }
  }

  const getColorValue = (colorName) => {
    const colorMap = {
      blue: "#3b82f6",
      green: "#10b981",
      purple: "#8b5cf6",
      orange: "#f97316",
      red: "#ef4444",
      gray: "#6b7280",
    }
    return colorMap[colorName] || "#3b82f6"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Extract Content with AI</CardTitle>
          <CardDescription>
            Our AI will analyze your documents and extract relevant content for your poster.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="automatic">
                <Wand2 className="h-4 w-4 mr-2" />
                Automatic Extraction
              </TabsTrigger>
              <TabsTrigger value="custom">
                <FileText className="h-4 w-4 mr-2" />
                Custom Extraction
              </TabsTrigger>
            </TabsList>

            <TabsContent value="automatic" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                    <Wand2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800">AI-Powered Extraction</h3>
                    <p className="text-sm text-blue-600">
                      Our AI will automatically identify key sections from your research documents and extract the most
                      relevant content for your poster, including tables, figures, and charts.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Select sections to extract:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedSections).map(([section, isSelected]) => (
                      <div key={section} className="flex items-center space-x-2">
                        <Checkbox id={section} checked={isSelected} onCheckedChange={() => toggleSection(section)} />
                        <Label htmlFor={section} className="capitalize">
                          {section}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-md flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-3 mt-1">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-800">Custom Extraction</h3>
                    <p className="text-sm text-purple-600">
                      Provide specific instructions to guide the AI in extracting exactly what you need for your poster.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-prompt">Custom extraction prompt:</Label>
                  <Textarea
                    id="custom-prompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Provide instructions for the AI..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document-text">Paste document text or upload a text file:</Label>
                  <Textarea
                    id="document-text"
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                    placeholder="Paste your document text here..."
                    className="min-h-[150px]"
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => document.getElementById("file-input").click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Text File
                    </Button>
                    <input
                      id="file-input"
                      type="file"
                      accept=".txt,.md,.csv"
                      className="hidden"
                      onChange={handleTextUpload}
                    />
                    <span className="text-xs text-gray-500">Supported: .txt, .md, .csv</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {isExtracting && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Extracting content...</span>
                <span>{extractionProgress}%</span>
              </div>
              <Progress value={extractionProgress} />
            </div>
          )}

          {extractionComplete && !extractedElements && (
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 p-4 rounded-md flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">Extraction Complete</h3>
                  <p className="text-sm text-green-600">
                    We've successfully extracted content from your documents. You can now proceed to design your poster.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Extracted Content Summary:</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Title and Authors
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Abstract (124 words)
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Introduction (89 words)
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Methods (76 words)
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Results (92 words)
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Discussion (82 words)
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Conclusion (78 words)
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />3 Figures identified
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />1 Table extracted
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />3 Charts generated
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    References (3 citations)
                  </li>
                </ul>
              </div>
            </div>
          )}

          {extractedElements && (
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 p-4 rounded-md flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">Extraction Complete</h3>
                  <p className="text-sm text-green-600">
                    We've identified the following visual elements. Select which ones you'd like to include in your
                    poster.
                  </p>
                </div>
              </div>

              <Accordion type="multiple" className="w-full">
                {/* Figures Section */}
                <AccordionItem value="figures">
                  <AccordionTrigger className="flex items-center">
                    <div className="flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      <span>Figures</span>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {selectedElements.figures.length}/{extractedElements.figures.length} selected
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                      <div className="space-y-4">
                        {extractedElements.figures.map((figure, index) => (
                          <div
                            key={`figure-${index}`}
                            className={`p-3 rounded-md border ${
                              selectedElements.figures.includes(index) ? "border-blue-500 bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{figure.title}</h4>
                                <p className="text-xs text-gray-500">{figure.caption}</p>
                              </div>
                              <Checkbox
                                checked={selectedElements.figures.includes(index)}
                                onCheckedChange={() => toggleElement("figures", index)}
                              />
                            </div>
                            <div className="mt-2">
                              <img
                                src={figure.imageUrl || "/placeholder.svg"}
                                alt={figure.title}
                                className="max-h-32 object-contain mx-auto"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>

                {/* Tables Section */}
                <AccordionItem value="tables">
                  <AccordionTrigger className="flex items-center">
                    <div className="flex items-center">
                      <Table className="h-4 w-4 mr-2" />
                      <span>Tables</span>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {selectedElements.tables.length}/{extractedElements.tables.length} selected
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                      <div className="space-y-4">
                        {extractedElements.tables.map((table, index) => (
                          <div
                            key={`table-${index}`}
                            className={`p-3 rounded-md border ${
                              selectedElements.tables.includes(index) ? "border-blue-500 bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-sm">{table.title}</h4>
                              <Checkbox
                                checked={selectedElements.tables.includes(index)}
                                onCheckedChange={() => toggleElement("tables", index)}
                              />
                            </div>
                            <div className="mt-2 overflow-x-auto">
                              <table className="min-w-full border-collapse text-xs">
                                <tbody>
                                  {table.data.split("\n").map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                      {row.split(",").map((cell, cellIndex) => (
                                        <td
                                          key={cellIndex}
                                          className={`border px-2 py-1 ${
                                            rowIndex === 0 ? "font-semibold bg-gray-100" : ""
                                          }`}
                                        >
                                          {cell.trim()}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>

                {/* Charts Section */}
                <AccordionItem value="charts">
                  <AccordionTrigger className="flex items-center">
                    <div className="flex items-center">
                      <BarChart className="h-4 w-4 mr-2" />
                      <span>Charts</span>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {selectedElements.charts.length}/{extractedElements.charts.length} selected
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                      <div className="space-y-4">
                        {extractedElements.charts.map((chart, index) => (
                          <div
                            key={`chart-${index}`}
                            className={`p-3 rounded-md border ${
                              selectedElements.charts.includes(index) ? "border-blue-500 bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-sm">{chart.title}</h4>
                                <p className="text-xs text-gray-500">{chart.type} chart</p>
                              </div>
                              <Checkbox
                                checked={selectedElements.charts.includes(index)}
                                onCheckedChange={() => toggleElement("charts", index)}
                              />
                            </div>
                            <div className="mt-2">{renderChartPreview(chart)}</div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!extractionComplete ? (
            <Button onClick={handleExtract} disabled={isExtracting} className="ml-auto">
              {isExtracting ? (
                <>
                  <span className="mr-2">Extracting</span>
                  <span className="animate-spin">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </span>
                </>
              ) : (
                "Extract Content"
              )}
            </Button>
          ) : (
            <Button onClick={handleComplete} className="ml-auto" variant="default">
              Continue to Poster Design
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Extraction Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium">For best results:</h3>
                <ul className="text-sm space-y-1 mt-1 list-disc pl-5">
                  <li>Upload well-structured documents with clear section headings</li>
                  <li>Include figures and tables as separate files if possible</li>
                  <li>Make sure text in PDFs is selectable (not scanned images)</li>
                  <li>For custom extraction, be specific about what information you need</li>
                  <li>Data-rich documents will yield better charts and visualizations</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
