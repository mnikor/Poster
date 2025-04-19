"use client"

import { useState, useEffect, useRef } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import PosterSection from "./poster-section"
import { Button } from "@/components/ui/button"
import { Plus, ZoomIn, ZoomOut } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// Default sections for academic poster template
const defaultAcademicSections = [
  {
    id: "title",
    type: "title",
    content: {
      title: "Your Research Title",
      authors: "Author 1, Author 2, Author 3",
      institution: "Your Institution",
    },
    position: { x: 10, y: 10 },
    size: { width: 980, height: 120 },
    zIndex: 1,
  },
  {
    id: "abstract",
    type: "text",
    content: {
      title: "Abstract",
      text: "Your research abstract goes here. Summarize your research in a concise manner.",
    },
    position: { x: 10, y: 140 },
    size: { width: 320, height: 300 },
    zIndex: 1,
  },
  {
    id: "introduction",
    type: "text",
    content: {
      title: "Introduction",
      text: "Introduce your research topic and provide background information.",
    },
    position: { x: 340, y: 140 },
    size: { width: 320, height: 300 },
    zIndex: 1,
  },
  {
    id: "methods",
    type: "text",
    content: {
      title: "Methods",
      text: "Describe the methods used in your research.",
    },
    position: { x: 670, y: 140 },
    size: { width: 320, height: 300 },
    zIndex: 1,
  },
  {
    id: "results",
    type: "text",
    content: {
      title: "Results",
      text: "Present the results of your research.",
    },
    position: { x: 10, y: 400 },
    size: { width: 320, height: 300 },
    zIndex: 1,
  },
  {
    id: "figure1",
    type: "figure",
    content: {
      title: "Figure 1",
      caption: "Description of figure 1",
      imageUrl: "/cellular-landscape.png",
    },
    position: { x: 340, y: 400 },
    size: { width: 320, height: 300 },
    zIndex: 1,
  },
  {
    id: "conclusion",
    type: "text",
    content: {
      title: "Conclusion",
      text: "Summarize your findings and discuss their implications.",
    },
    position: { x: 670, y: 400 },
    size: { width: 320, height: 300 },
    zIndex: 1,
  },
  {
    id: "references",
    type: "text",
    content: {
      title: "References",
      text: "1. Reference 1\n2. Reference 2\n3. Reference 3",
    },
    position: { x: 10, y: 660 },
    size: { width: 980, height: 120 },
    zIndex: 1,
  },
]

// Default sections for scientific poster template
const defaultScientificSections = [
  {
    id: "title",
    type: "title",
    content: {
      title: "Scientific Research Title",
      authors: "Author 1, Author 2, Author 3",
      institution: "Research Institution",
    },
    position: { x: 10, y: 10 },
    size: { width: 980, height: 120 },
    zIndex: 1,
  },
  {
    id: "hypothesis",
    type: "text",
    content: {
      title: "Hypothesis",
      text: "State your research hypothesis here.",
    },
    position: { x: 10, y: 140 },
    size: { width: 480, height: 200 },
    zIndex: 1,
  },
  {
    id: "methodology",
    type: "text",
    content: {
      title: "Methodology",
      text: "Describe your research methodology in detail.",
    },
    position: { x: 500, y: 140 },
    size: { width: 490, height: 200 },
    zIndex: 1,
  },
  {
    id: "data",
    type: "figure",
    content: {
      title: "Data Analysis",
      caption: "Key data visualization",
      imageUrl: "/microscopic-world.png",
    },
    position: { x: 10, y: 350 },
    size: { width: 480, height: 350 },
    zIndex: 1,
  },
  {
    id: "findings",
    type: "text",
    content: {
      title: "Key Findings",
      text: "Present the main findings of your research.",
    },
    position: { x: 500, y: 350 },
    size: { width: 490, height: 350 },
    zIndex: 1,
  },
  {
    id: "conclusion",
    type: "text",
    content: {
      title: "Conclusion & Future Work",
      text: "Summarize your conclusions and suggest directions for future research.",
    },
    position: { x: 10, y: 710 },
    size: { width: 980, height: 170 },
    zIndex: 1,
  },
]

// Default sections for minimal poster template
const defaultMinimalSections = [
  {
    id: "title",
    type: "title",
    content: {
      title: "Minimal Research Title",
      authors: "Author 1, Author 2",
      institution: "Institution Name",
    },
    position: { x: 10, y: 10 },
    size: { width: 980, height: 100 },
    zIndex: 1,
  },
  {
    id: "main-content",
    type: "text",
    content: {
      title: "Main Content",
      text: "This minimal template focuses on the most important aspects of your research. Add your key points here in a concise manner.",
    },
    position: { x: 10, y: 120 },
    size: { width: 640, height: 500 },
    zIndex: 1,
  },
  {
    id: "key-figure",
    type: "figure",
    content: {
      title: "Key Visual",
      caption: "The most important visual from your research",
      imageUrl: "/colorful-abstract-flow.png",
    },
    position: { x: 660, y: 120 },
    size: { width: 330, height: 300 },
    zIndex: 1,
  },
  {
    id: "contact",
    type: "text",
    content: {
      title: "Contact & References",
      text: "Your contact information and key references go here.",
    },
    position: { x: 660, y: 430 },
    size: { width: 330, height: 190 },
    zIndex: 1,
  },
  {
    id: "conclusion",
    type: "text",
    content: {
      title: "Conclusion",
      text: "A brief conclusion summarizing your research.",
    },
    position: { x: 10, y: 630 },
    size: { width: 980, height: 100 },
    zIndex: 1,
  },
]

// Default sections for visual poster template
const defaultVisualSections = [
  {
    id: "title",
    type: "title",
    content: {
      title: "Visual Research Presentation",
      authors: "Author Names",
      institution: "Institution",
    },
    position: { x: 10, y: 10 },
    size: { width: 980, height: 100 },
    zIndex: 1,
    backgroundColor: "#f0f9ff",
  },
  {
    id: "main-visual",
    type: "figure",
    content: {
      title: "Main Visual",
      caption: "Primary research visualization",
      imageUrl: "/diverse-scientific-data.png",
    },
    position: { x: 10, y: 120 },
    size: { width: 480, height: 400 },
    zIndex: 1,
    backgroundColor: "#f8fafc",
  },
  {
    id: "brief-intro",
    type: "text",
    content: {
      title: "Brief Introduction",
      text: "A short introduction to your research topic and objectives.",
    },
    position: { x: 500, y: 120 },
    size: { width: 490, height: 190 },
    zIndex: 1,
    backgroundColor: "#f0fdfa",
  },
  {
    id: "visual-2",
    type: "figure",
    content: {
      title: "Supporting Visual",
      caption: "Secondary research visualization",
      imageUrl: "/Colorful Abstract Shapes.png",
    },
    position: { x: 500, y: 320 },
    size: { width: 240, height: 200 },
    zIndex: 1,
    backgroundColor: "#f8fafc",
  },
  {
    id: "visual-3",
    type: "figure",
    content: {
      title: "Additional Visual",
      caption: "Tertiary research visualization",
      imageUrl: "/chromatic-tapestry.png",
    },
    position: { x: 750, y: 320 },
    size: { width: 240, height: 200 },
    zIndex: 1,
    backgroundColor: "#f8fafc",
  },
  {
    id: "key-points",
    type: "text",
    content: {
      title: "Key Points",
      text: "• First key finding\n• Second key finding\n• Third key finding\n• Fourth key finding",
    },
    position: { x: 10, y: 530 },
    size: { width: 480, height: 200 },
    zIndex: 1,
    backgroundColor: "#fff7ed",
  },
  {
    id: "conclusion",
    type: "text",
    content: {
      title: "Conclusion & Contact",
      text: "Brief conclusion and contact information for further discussion.",
    },
    position: { x: 500, y: 530 },
    size: { width: 490, height: 200 },
    zIndex: 1,
    backgroundColor: "#fdf2f8",
  },
]

const templateMap = {
  academic: defaultAcademicSections,
  scientific: defaultScientificSections,
  minimal: defaultMinimalSections,
  visual: defaultVisualSections,
}

const sectionTypes = [
  { id: "text", name: "Text Section" },
  { id: "figure", name: "Figure/Chart" },
  { id: "table", name: "Data Table" },
  { id: "quote", name: "Quote/Highlight" },
]

// Add this at the beginning of the component to prevent any automatic orientation changes
// Update the PosterCanvas component to accept and use the new theme and font props
export default function PosterCanvas({
  template = "academic",
  extractedData,
  colorTheme = "default",
  fontFamily = "sans",
  fontSize = "medium",
  orientation = "landscape",
  previewMode = false,
  printMode = false,
  initialSections = null,
  onSectionsChange = () => {}, // Add this callback prop
  ...props // Capture any other props including key
}) {
  const [sections, setSections] = useState([])
  const [zoom, setZoom] = useState(100)
  const [selectedSection, setSelectedSection] = useState(null)

  // Replace the entire orientation-related code with this simpler implementation

  // Update canvas size based on orientation - this is now a simple derived state
  const canvasSize = orientation === "landscape" ? { width: 1000, height: 800 } : { width: 800, height: 1000 }

  // Remove the orientationLocked state and related useEffects
  // Remove the existing canvasSize state and setCanvasSize

  // Add this ref before the useEffect
  const initialRender = useRef(true)

  // Add this effect to adjust sections when orientation changes
  useEffect(() => {
    console.log(`Orientation changed to: ${orientation}`)
    console.log(`Canvas size set to: ${canvasSize.width}x${canvasSize.height}`)

    // Only adjust sections if we have any and if this is not the initial render
    if (sections.length > 0 && !initialRender.current) {
      console.log(`Adjusting ${sections.length} sections for new orientation`)

      // Create a deep copy of sections to avoid reference issues
      const newSections = JSON.parse(JSON.stringify(sections))

      // Adjust each section's position and size based on the new orientation
      const adjustedSections = newSections.map((section) => {
        // For landscape to portrait
        if (orientation === "portrait") {
          // Calculate new position - maintain relative position in the new canvas
          const newX = Math.min(section.position.x * 0.8, canvasSize.width - 100)
          const newY = Math.min(section.position.y * 1.25, canvasSize.height - 100)

          // Calculate new size - scale appropriately for the new canvas
          const newWidth = Math.min(section.size.width * 0.8, canvasSize.width - newX - 10)
          const newHeight = Math.min(section.size.height, canvasSize.height - newY - 10)

          return {
            ...section,
            position: { x: newX, y: newY },
            size: { width: newWidth, height: newHeight },
          }
        }
        // For portrait to landscape
        else {
          // Calculate new position - maintain relative position in the new canvas
          const newX = Math.min(section.position.x * 1.25, canvasSize.width - 100)
          const newY = Math.min(section.position.y * 0.8, canvasSize.height - 100)

          // Calculate new size - scale appropriately for the new canvas
          const newWidth = Math.min(section.size.width * 1.25, canvasSize.width - newX - 10)
          const newHeight = Math.min(section.size.height, canvasSize.height - newY - 10)

          return {
            ...section,
            position: { x: newX, y: newY },
            size: { width: newWidth, height: newHeight },
          }
        }
      })

      // Update sections with adjusted values
      console.log("Setting adjusted sections:", adjustedSections)
      setSections(adjustedSections)
    }

    // Mark that we're no longer in the initial render
    initialRender.current = false
  }, [orientation, canvasSize.width, canvasSize.height])

  // Add font size mapping
  const fontSizeMap = {
    small: {
      title: "text-xl",
      heading: "text-lg",
      body: "text-sm",
    },
    medium: {
      title: "text-2xl",
      heading: "text-xl",
      body: "text-base",
    },
    large: {
      title: "text-3xl",
      heading: "text-2xl",
      body: "text-lg",
    },
  }

  // Add font family mapping
  const fontFamilyMap = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
  }

  // Add color theme mapping
  const colorThemeMap = {
    default: {
      background: "bg-white",
      sectionBg: "bg-white",
      border: "border-gray-200",
      heading: "text-gray-900",
      text: "text-gray-700",
    },
    academic: {
      background: "bg-blue-50",
      sectionBg: "bg-white",
      border: "border-blue-200",
      heading: "text-blue-900",
      text: "text-blue-800",
    },
    scientific: {
      background: "bg-green-50",
      sectionBg: "bg-white",
      border: "border-green-200",
      heading: "text-green-900",
      text: "text-green-800",
    },
    modern: {
      background: "bg-purple-50",
      sectionBg: "bg-white",
      border: "border-purple-200",
      heading: "text-purple-900",
      text: "text-purple-800",
    },
    professional: {
      background: "bg-gray-50",
      sectionBg: "bg-white",
      border: "border-gray-300",
      heading: "text-gray-900",
      text: "text-gray-800",
    },
    contrast: {
      background: "bg-white",
      sectionBg: "bg-white",
      border: "border-black",
      heading: "text-black",
      text: "text-black",
    },
  }

  // Initialize sections based on template or use provided initialSections
  useEffect(() => {
    console.log("PosterCanvas initializing with template:", template)

    if (initialSections) {
      setSections(initialSections)
    } else {
      // Get the template sections directly from the map
      const templateSections = templateMap[template] || defaultAcademicSections

      // Create new sections with unique IDs
      const newSections = templateSections.map((section) => ({
        ...section,
        id: `${section.id}-${Math.random().toString(36).substring(2, 9)}`,
      }))

      console.log("Setting sections to:", newSections)
      setSections(newSections)
    }
  }, [template, initialSections]) // Added initialSections to dependency array

  // Call onSectionsChange whenever sections change
  useEffect(() => {
    if (sections.length > 0 && !initialRender.current) {
      onSectionsChange(sections)
    }
  }, [sections, onSectionsChange])

  // Helper function to create sections from extracted data
  const createSectionsFromExtractedData = (data) => {
    const dataSections = []

    // Add title section
    if (data.title) {
      dataSections.push({
        id: "title",
        type: "title",
        content: {
          title: data.title.title,
          authors: data.title.authors,
          institution: data.title.institution,
        },
        position: { x: 10, y: 10 },
        size: { width: 980, height: 120 },
        zIndex: 1,
      })
    }

    // Add text sections
    const textSections = ["abstract", "introduction", "methods", "results", "discussion", "conclusion"]
    let yPosition = 140
    let xPosition = 10

    textSections.forEach((section, index) => {
      if (data[section]) {
        dataSections.push({
          id: section,
          type: "text",
          content: {
            title: data[section].title,
            text: data[section].text,
          },
          position: {
            x: xPosition,
            y: yPosition,
          },
          size: { width: 320, height: 300 },
          zIndex: 1,
        })

        // Update position for next section
        xPosition += 330
        if ((index + 1) % 3 === 0) {
          xPosition = 10
          yPosition += 310
        }
      }
    })

    // Add references if available
    if (data.references) {
      dataSections.push({
        id: "references",
        type: "text",
        content: {
          title: data.references.title,
          text: data.references.text,
        },
        position: { x: 10, y: Math.max(760, yPosition + 310) },
        size: { width: 980, height: 120 },
        zIndex: 1,
      })
    }

    // Add figures
    if (data.figures && data.figures.length > 0) {
      data.figures.forEach((figure, index) => {
        dataSections.push({
          id: `figure-${index}`,
          type: "figure",
          content: {
            title: figure.title,
            caption: figure.caption,
            imageUrl: figure.imageUrl,
          },
          position: {
            x: 10 + (index % 3) * 330,
            y: yPosition,
          },
          size: { width: 320, height: 300 },
          zIndex: 1,
        })
      })

      // Update yPosition after adding figures
      yPosition += 310
    }

    // Add tables
    if (data.tables && data.tables.length > 0) {
      data.tables.forEach((table, index) => {
        dataSections.push({
          id: `table-${index}`,
          type: "table",
          content: {
            title: table.title,
            data: table.data,
          },
          position: {
            x: 10 + (index % 3) * 330,
            y: yPosition,
          },
          size: { width: 320, height: 300 },
          zIndex: 1,
        })
      })

      // Update yPosition after adding tables
      yPosition += 310
    }

    // Add charts
    if (data.charts && data.charts.length > 0) {
      data.charts.forEach((chart, index) => {
        dataSections.push({
          id: `chart-${index}`,
          type: "text", // We'll use text sections with chart data
          content: {
            title: chart.title,
            text: "Chart visualization",
            chartData: chart,
          },
          position: {
            x: 10 + (index % 3) * 330,
            y: yPosition,
          },
          size: { width: 320, height: 300 },
          zIndex: 1,
        })
      })
    }

    // Update canvas height based on content
    const maxY = dataSections.reduce((max, section) => {
      const sectionBottom = section.position.y + section.size.height
      return Math.max(max, sectionBottom)
    }, 900)

    return dataSections
  }

  useEffect(() => {
    if (extractedData) {
      const newSections = createSectionsFromExtractedData(extractedData)
      setSections(newSections)
    }
  }, [extractedData])

  const handleSectionMove = (id, position) => {
    setSections(sections.map((section) => (section.id === id ? { ...section, position } : section)))
  }

  const handleSectionResize = (id, size) => {
    setSections(sections.map((section) => (section.id === id ? { ...section, size } : section)))
  }

  const handleSectionDelete = (id) => {
    setSections(sections.filter((section) => section.id !== id))
  }

  const handleSectionContentChange = (id, content) => {
    setSections(sections.map((section) => (section.id === id ? { ...section, content } : section)))
  }

  const handleAddSection = (type) => {
    const newId = `section-${Date.now()}`
    const newSection = {
      id: newId,
      type,
      content: {
        title: "New Section",
        text: type === "text" ? "Add your content here" : "",
        imageUrl: type === "figure" ? "/chromatic-tapestry.png" : "",
        caption: type === "figure" ? "Figure caption" : "",
        data: type === "table" ? "Header 1,Header 2,Header 3\nData 1,Data 2,Data 3\nData 4,Data 5,Data 6" : "",
      },
      position: { x: 50, y: 50 },
      size: { width: 300, height: 200 },
      zIndex: sections.length + 1,
    }

    setSections([...sections, newSection])
    setSelectedSection(newId)
  }

  const handleZoomChange = (value) => {
    setZoom(value[0])
  }

  const handleBringToFront = (id) => {
    const maxZ = Math.max(...sections.map((s) => s.zIndex))
    setSections(sections.map((section) => (section.id === id ? { ...section, zIndex: maxZ + 1 } : section)))
  }

  // Special class for print mode
  const printModeClass = printMode ? "print-mode" : ""

  return (
    <div className={cn("flex flex-col h-full", printModeClass)}>
      {!previewMode && !printMode && (
        <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded-md">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Slider value={[zoom]} min={50} max={150} step={5} className="w-32" onValueChange={handleZoomChange} />
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(150, zoom + 10))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-500">{zoom}%</span>
          </div>

          <div className="flex space-x-2">
            {sectionTypes.map((type) => (
              <Button key={type.id} variant="outline" size="sm" onClick={() => handleAddSection(type.id)}>
                <Plus className="h-4 w-4 mr-1" />
                {type.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div
        className={cn(
          "relative overflow-auto border rounded-md shadow-sm",
          colorThemeMap[colorTheme]?.background || "bg-white",
          previewMode && "h-full",
          printMode && "print-container border-0 shadow-none",
        )}
        style={{
          height: printMode ? "auto" : previewMode ? "calc(100vh - 100px)" : "calc(100vh - 200px)",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: printMode ? "0" : "20px",
          overflowY: "auto",
        }}
      >
        <DndProvider backend={HTML5Backend}>
          <div
            className={cn(
              "relative poster-canvas",
              colorThemeMap[colorTheme]?.background || "bg-white",
              fontFamilyMap[fontFamily] || "font-sans",
              printMode && "print-canvas",
            )}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              transform: printMode ? "none" : `scale(${zoom / 100})`,
              transformOrigin: "top left",
              transition: "transform 0.2s",
            }}
          >
            {sections.map((section) => (
              <PosterSection
                key={section.id}
                section={section}
                isSelected={selectedSection === section.id}
                onSelect={() => setSelectedSection(section.id)}
                onMove={handleSectionMove}
                onResize={handleSectionResize}
                onDelete={handleSectionDelete}
                onContentChange={handleSectionContentChange}
                onBringToFront={handleBringToFront}
                colorTheme={colorTheme}
                fontFamily={fontFamily}
                fontSize={fontSize}
                previewMode={previewMode}
                printMode={printMode}
                themeClasses={{
                  border: colorThemeMap[colorTheme]?.border || "border-gray-200",
                  background: colorThemeMap[colorTheme]?.sectionBg || "bg-white",
                  heading: colorThemeMap[colorTheme]?.heading || "text-gray-900",
                  text: colorThemeMap[colorTheme]?.text || "text-gray-700",
                  fontSizes: fontSizeMap[fontSize] || fontSizeMap.medium,
                }}
              />
            ))}
          </div>
        </DndProvider>
      </div>
    </div>
  )
}
