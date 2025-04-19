"use client"

import type React from "react"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useRef, useEffect } from "react"
import { useDrag } from "react-dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash, Edit, Check, X, ArrowUpToLine, Palette, Quote, Undo } from "lucide-react"
import { cn } from "@/lib/utils"

// Add the AI-related imports at the top
import { Wand2, Sparkles, MessageSquare, RefreshCw, ImageIcon } from "lucide-react"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { summarizeText, rephraseText, generateFigureCaption, suggestImprovements } from "@/app/actions"

// Add the following imports at the top with the other imports
import { Table2, BarChart3, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import ChartCreator from "./chart-creator"
import TableEditor from "./table-editor"

// Add this import at the top with the other imports
import CitationInserter from "./citation/citation-inserter"

// Update the component props to include printMode
export default function PosterSection({
  section,
  isSelected,
  onSelect,
  onMove,
  onResize,
  onDelete,
  onContentChange,
  onBringToFront,
  colorTheme = "default",
  fontFamily = "sans",
  fontSize = "medium",
  previewMode = false,
  printMode = false,
  themeClasses = {},
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(section.content)
  // Add history state for undo functionality
  const [contentHistory, setContentHistory] = useState([section.content])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 })
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 })
  const ref = useRef(null)

  // State for modal dialogs
  const [chartDialogOpen, setChartDialogOpen] = useState(false)
  const [tableDialogOpen, setTableDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("/colorful-abstract-flow.png")

  // Modify the drag functionality to be disabled in preview or print mode
  const [{ isDragging }, drag] = useDrag({
    type: "SECTION",
    item: { id: section.id, type: section.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !previewMode && !printMode, // Disable dragging in preview or print mode
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset()
      if (delta) {
        const newPosition = {
          x: Math.max(0, section.position.x + delta.x),
          y: Math.max(0, section.position.y + delta.y),
        }
        onMove(section.id, newPosition)
      }
    },
  })

  drag(ref)

  // Add state for tracking which corner is being dragged
  const [resizeCorner, setResizeCorner] = useState(null)

  // Reset history when starting to edit
  useEffect(() => {
    if (isEditing) {
      setContentHistory([section.content])
      setHistoryIndex(0)
      setEditedContent(section.content)
    }
  }, [isEditing, section.content])

  // Custom resize functionality
  const handleResizeStart = (e, corner) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    setResizeStart({ x: e.clientX, y: e.clientY })
    setInitialSize({ width: section.size.width, height: section.size.height })
    setResizeCorner(corner)

    // Add event listeners for resize
    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)
  }

  const handleResizeMove = (e) => {
    if (!isResizing) return

    const deltaX = e.clientX - resizeStart.x
    const deltaY = e.clientY - resizeStart.y

    let newWidth = initialSize.width
    let newHeight = initialSize.height
    let newX = section.position.x
    let newY = section.position.y

    // Handle different resize directions based on which corner is being dragged
    switch (resizeCorner) {
      case "top-left":
        newWidth = Math.max(100, initialSize.width - deltaX)
        newHeight = Math.max(100, initialSize.height - deltaY)
        newX = section.position.x + initialSize.width - newWidth
        newY = section.position.y + initialSize.height - newHeight
        break
      case "top-right":
        newWidth = Math.max(100, initialSize.width + deltaX)
        newHeight = Math.max(100, initialSize.height - deltaY)
        newY = section.position.y + initialSize.height - newHeight
        break
      case "bottom-left":
        newWidth = Math.max(100, initialSize.width - deltaX)
        newHeight = Math.max(100, initialSize.height + deltaY)
        newX = section.position.x + initialSize.width - newWidth
        break
      case "bottom-right":
        newWidth = Math.max(100, initialSize.width + deltaX)
        newHeight = Math.max(100, initialSize.height + deltaY)
        break
    }

    // Update the section size in real-time for visual feedback
    if (ref.current) {
      ref.current.style.width = `${newWidth}px`
      ref.current.style.height = `${newHeight}px`
      ref.current.style.left = `${newX}px`
      ref.current.style.top = `${newY}px`
    }
  }

  const handleResizeEnd = (e) => {
    if (!isResizing) return

    setIsResizing(false)

    const deltaX = e.clientX - resizeStart.x
    const deltaY = e.clientY - resizeStart.y

    let newWidth = initialSize.width
    let newHeight = initialSize.height
    let newX = section.position.x
    let newY = section.position.y

    // Handle different resize directions based on which corner is being dragged
    switch (resizeCorner) {
      case "top-left":
        newWidth = Math.max(100, initialSize.width - deltaX)
        newHeight = Math.max(100, initialSize.height - deltaY)
        newX = section.position.x + initialSize.width - newWidth
        newY = section.position.y + initialSize.height - newHeight
        break
      case "top-right":
        newWidth = Math.max(100, initialSize.width + deltaX)
        newHeight = Math.max(100, initialSize.height - deltaY)
        newY = section.position.y + initialSize.height - newHeight
        break
      case "bottom-left":
        newWidth = Math.max(100, initialSize.width - deltaX)
        newHeight = Math.max(100, initialSize.height + deltaY)
        newX = section.position.x + initialSize.width - newWidth
        break
      case "bottom-right":
        newWidth = Math.max(100, initialSize.width + deltaX)
        newHeight = Math.max(100, initialSize.height + deltaY)
        break
    }

    // Call the parent's onResize with the new size
    onResize(section.id, { width: newWidth, height: newHeight })

    // Call the parent's onMove with the new position if it changed
    if (newX !== section.position.x || newY !== section.position.y) {
      onMove(section.id, { x: newX, y: newY })
    }

    // Remove event listeners
    document.removeEventListener("mousemove", handleResizeMove)
    document.removeEventListener("mouseup", handleResizeEnd)
  }

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleResizeMove)
      document.removeEventListener("mouseup", handleResizeEnd)
    }
  }, [isResizing])

  const handleEditStart = (e) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleEditSave = (e) => {
    e.stopPropagation()
    onContentChange(section.id, editedContent)
    setIsEditing(false)
  }

  const handleEditCancel = (e) => {
    e.stopPropagation()
    setEditedContent(section.content)
    setIsEditing(false)
  }

  // Update the handleContentChange function to properly track history
  const handleContentChange = (field, value) => {
    // Save current state to history before making changes
    const newContent = {
      ...editedContent,
      [field]: value,
    }

    // Only add to history if content has actually changed
    if (JSON.stringify(newContent) !== JSON.stringify(contentHistory[historyIndex])) {
      // Truncate history if we're not at the end
      const newHistory = contentHistory.slice(0, historyIndex + 1)
      newHistory.push(newContent)
      setContentHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }

    // Update the content
    setEditedContent(newContent)
  }

  // Update the handleUndo function to properly check history
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setEditedContent({ ...contentHistory[newIndex] })
    }
  }

  const renderSectionContent = () => {
    if (isEditing) {
      switch (section.type) {
        case "title":
          return (
            <div className="space-y-2">
              <Input
                value={editedContent.title}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder="Title"
                className="font-bold text-lg"
              />
              <Input
                value={editedContent.authors}
                onChange={(e) => handleContentChange("authors", e.target.value)}
                placeholder="Authors"
              />
              <Input
                value={editedContent.institution}
                onChange={(e) => handleContentChange("institution", e.target.value)}
                placeholder="Institution"
              />
            </div>
          )
        case "text":
          return (
            <div className="space-y-2">
              <Input
                value={editedContent.title}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder="Section Title"
                className="font-bold"
              />
              <div className="flex items-center space-x-2 mb-2">
                {/* Existing toolbar buttons */}
                <CitationInserter
                  onInsert={(citationText) => {
                    // Insert the citation at cursor position or at the end
                    const textarea = document.activeElement as HTMLTextAreaElement
                    if (textarea && textarea.tagName === "TEXTAREA") {
                      const start = textarea.selectionStart
                      const end = textarea.selectionEnd
                      const text = editedContent.text
                      const newText = text.substring(0, start) + citationText + text.substring(end)
                      handleContentChange("text", newText)
                    } else {
                      // Append to the end if no selection
                      handleContentChange("text", editedContent.text + " " + citationText)
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-1 p-1 bg-gray-50 rounded-md border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-gray-700 hover:bg-gray-200"
                    onClick={() => formatText("bold")}
                  >
                    <span className="font-bold">B</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-gray-700 hover:bg-gray-200"
                    onClick={() => formatText("italic")}
                  >
                    <span className="italic">I</span>
                  </Button>
                  <div className="h-4 w-px bg-gray-300 mx-1"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-gray-700 hover:bg-gray-200"
                    onClick={() => formatText("bullet")}
                  >
                    <ul className="h-4 w-4 mr-1">•</ul>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-gray-700 hover:bg-gray-200"
                    onClick={() => formatText("number")}
                  >
                    <ol className="h-4 w-4 mr-1">1.</ol>
                  </Button>
                  <div className="h-4 w-px bg-gray-300 mx-1"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-gray-700 hover:bg-gray-200"
                    onClick={() => formatText("clear")}
                  >
                    <span className="text-xs">Clear</span>
                  </Button>
                  <div className="h-4 w-px bg-gray-300 mx-1"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-gray-700 hover:bg-gray-200"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  id="section-text-editor"
                  value={editedContent.text}
                  onChange={(e) => handleContentChange("text", e.target.value)}
                  placeholder="Section Content"
                  className="min-h-[100px] font-sans"
                />
              </div>
            </div>
          )
        case "figure":
          return (
            <div className="space-y-2">
              <Input
                value={editedContent.title}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder="Figure Title"
                className="font-bold"
              />
              <div className="relative border rounded-md p-1">
                <img
                  src={editedContent.imageUrl || "/placeholder.svg"}
                  alt="Figure"
                  className="max-w-full object-contain"
                  style={{ maxHeight: "150px" }}
                />
              </div>
              <Input
                value={editedContent.caption}
                onChange={(e) => handleContentChange("caption", e.target.value)}
                placeholder="Caption"
              />
            </div>
          )
        case "table":
          return (
            <div className="space-y-2">
              <Input
                value={editedContent.title}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder="Table Title"
                className="font-bold"
              />
              <Textarea
                value={editedContent.data}
                onChange={(e) => handleContentChange("data", e.target.value)}
                placeholder="Table Data (CSV format)"
                className="min-h-[100px]"
              />
            </div>
          )
        default:
          return <div>Unknown section type</div>
      }
    } else {
      switch (section.type) {
        case "title":
          return (
            <div className="text-center">
              <h1 className={cn("font-bold mb-2", themeClasses.fontSizes?.title || "text-2xl")}>
                {section.content.title}
              </h1>
              <p className={cn("mb-1", themeClasses.fontSizes?.heading || "text-lg")}>{section.content.authors}</p>
              <p className="text-gray-600">{section.content.institution}</p>
            </div>
          )
        case "text":
          return (
            <>
              <div className="flex justify-between items-start mb-2">
                <h2 className={cn("font-semibold", themeClasses.fontSizes?.heading || "text-xl")}>
                  {section.content.title}
                </h2>
              </div>
              <div
                className={cn("whitespace-pre-line", themeClasses.fontSizes?.body || "text-base")}
                dangerouslySetInnerHTML={{
                  __html: section.content.text
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/_(.*?)_/g, "<em>$1</em>")
                    .replace(/^• (.*?)$/gm, "<li>$1</li>")
                    .replace(/^(\d+)\. (.*?)$/gm, "<li>$1. $2</li>")
                    .replace(/<li>.*?<\/li>/gs, (match) => `<ul>${match}</ul>`)
                    .replace(/\n/g, "<br />"),
                }}
              />

              {/* Render image if present */}
              {section.content.imageUrl && (
                <div className="mt-4 flex flex-col items-center">
                  <img
                    src={section.content.imageUrl || "/placeholder.svg"}
                    alt={section.content.caption || "Image"}
                    className="max-w-full object-contain max-h-[200px]"
                  />
                  {section.content.caption && <p className="text-sm text-gray-600 mt-1">{section.content.caption}</p>}
                </div>
              )}

              {/* Render table if present */}
              {section.content.tableData && (
                <div className="mt-4 overflow-auto">
                  <table className="min-w-full border-collapse">
                    {section.content.tableData.split("\n").map((row, rowIndex) => {
                      if (rowIndex === 0) {
                        return (
                          <thead key="thead">
                            <tr>
                              {row.split(",").map((cell, cellIndex) => (
                                <th key={cellIndex} className="border px-2 py-1 font-semibold bg-gray-100">
                                  {cell.trim()}
                                </th>
                              ))}
                            </tr>
                          </thead>
                        )
                      } else if (rowIndex === 1) {
                        return (
                          <tbody key="tbody">
                            <tr>
                              {row.split(",").map((cell, cellIndex) => (
                                <td key={cellIndex} className="border px-2 py-1">
                                  {cell.trim()}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        )
                      } else {
                        return (
                          <tr key={rowIndex}>
                            {row.split(",").map((cell, cellIndex) => (
                              <td key={cellIndex} className="border px-2 py-1">
                                {cell.trim()}
                              </td>
                            ))}
                          </tr>
                        )
                      }
                    })}
                  </table>
                </div>
              )}

              {/* Render chart if present */}
              {section.content.chartData && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">{section.content.chartData.title}</h3>
                  <div className="border rounded-md p-2">
                    {/* Simple chart visualization */}
                    <div className="h-40 bg-gray-50 flex items-center justify-center">
                      {section.content.chartData.type === "bar" && (
                        <div className="flex items-end space-x-2 h-32 w-full px-4">
                          {section.content.chartData.data.split("\n").map((value, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div
                                className="w-full"
                                style={{
                                  height: `${Math.min(100, (Number.parseFloat(value) / 100) * 100)}%`,
                                  backgroundColor: getChartColor(section.content.chartData.color),
                                }}
                              ></div>
                              <span className="text-xs mt-1">
                                {section.content.chartData.labels.split("\n")[i] || `Item ${i + 1}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {section.content.chartData.type === "line" && (
                        <svg className="h-32 w-full" viewBox="0 0 100 50">
                          <polyline
                            points="0,50 20,30 40,35 60,15 80,25 100,10"
                            fill="none"
                            stroke={getChartColor(section.content.chartData.color)}
                            strokeWidth="2"
                          />
                        </svg>
                      )}
                      {section.content.chartData.type === "pie" && (
                        <div className="h-32 w-32 rounded-full border-8 border-blue-500 flex items-center justify-center">
                          <span className="text-xs text-center">Pie Chart</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )
        case "figure":
          return (
            <div className="flex flex-col items-center">
              <div className="w-full flex justify-between items-start mb-2">
                <h2 className={cn("font-semibold", themeClasses.fontSizes?.heading || "text-xl")}>
                  {section.content.title}
                </h2>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <img
                  src={section.content.imageUrl || "/placeholder.svg"}
                  alt={section.content.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">{section.content.caption}</p>
            </div>
          )
        case "table":
          return (
            <>
              <h2 className={cn("font-semibold mb-2", themeClasses.fontSizes?.heading || "text-xl")}>
                {section.content.title}
              </h2>
              <div className="overflow-auto">
                <table className="min-w-full border-collapse">
                  {section.content.data &&
                    section.content.data.split("\n").map((row, rowIndex) => {
                      // For the first row, use thead
                      if (rowIndex === 0) {
                        return (
                          <thead key="thead">
                            <tr>
                              {row.split(",").map((cell, cellIndex) => (
                                <th key={cellIndex} className="border px-2 py-1 font-semibold bg-gray-100">
                                  {cell.trim()}
                                </th>
                              ))}
                            </tr>
                          </thead>
                        )
                      }
                      // For the first row after header, start tbody
                      else if (rowIndex === 1) {
                        return (
                          <tbody key="tbody">
                            <tr>
                              {row.split(",").map((cell, cellIndex) => (
                                <td key={cellIndex} className="border px-2 py-1">
                                  {cell.trim()}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        )
                      }
                      // For subsequent rows, just return tr (they'll be in the tbody)
                      else {
                        return (
                          <tr key={rowIndex}>
                            {row.split(",").map((cell, cellIndex) => (
                              <td key={cellIndex} className="border px-2 py-1">
                                {cell.trim()}
                              </td>
                            ))}
                          </tr>
                        )
                      }
                    })}
                </table>
              </div>
            </>
          )
        default:
          return <div>Unknown section type</div>
      }
    }
  }

  const formatText = (format) => {
    const textarea = document.getElementById("section-text-editor")
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = editedContent.text.substring(start, end)

    if (start === end && (format === "bold" || format === "italic")) {
      // If no text is selected, just insert the markdown
      const prefix = format === "bold" ? "**" : "_"
      const newText =
        editedContent.text.substring(0, start) + prefix + "text" + prefix + editedContent.text.substring(end)
      handleContentChange("text", newText)
      return
    }

    if (selectedText.length === 0 && (format === "bullet" || format === "number")) {
      // If no text is selected for lists, add a placeholder
      const prefix = format === "bullet" ? "• " : "1. "
      const newText = editedContent.text.substring(0, start) + prefix + "List item" + editedContent.text.substring(end)
      handleContentChange("text", newText)
      return
    }

    let newText

    switch (format) {
      case "bold":
        newText = editedContent.text.substring(0, start) + `**${selectedText}**` + editedContent.text.substring(end)
        break
      case "italic":
        newText = editedContent.text.substring(0, start) + `_${selectedText}_` + editedContent.text.substring(end)
        break
      case "bullet":
        // Split selected text into lines and add bullets
        newText =
          editedContent.text.substring(0, start) +
          selectedText
            .split("\n")
            .map((line) => `• ${line}`)
            .join("\n") +
          editedContent.text.substring(end)
        break
      case "number":
        // Split selected text into lines and add numbers
        newText =
          editedContent.text.substring(0, start) +
          selectedText
            .split("\n")
            .map((line, i) => `${i + 1}. ${line}`)
            .join("\n") +
          editedContent.text.substring(end)
        break
      case "clear":
        // Remove markdown formatting
        const clearedText = selectedText
          .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
          .replace(/_(.*?)_/g, "$1") // Remove italic
          .replace(/^[•-] /gm, "") // Remove bullets
          .replace(/^\d+\. /gm, "") // Remove numbers

        newText = editedContent.text.substring(0, start) + clearedText + editedContent.text.substring(end)
        break
      default:
        return
    }

    handleContentChange("text", newText)

    // Restore focus to the textarea
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start, start + newText.length - editedContent.text.length + selectedText.length)
    }, 0)
  }

  // Helper function for chart colors
  const getChartColor = (colorName) => {
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

  const [isProcessing, setIsProcessing] = useState(false)
  const [aiPopoverOpen, setAiPopoverOpen] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")

  const handleAIAction = async (action) => {
    setIsProcessing(true)
    setAiPopoverOpen(true)
    setAiSuggestion("Processing...")

    try {
      let result

      switch (action) {
        case "summarize":
          result = await summarizeText(section.content.text)
          if (result.success) {
            setAiSuggestion(result.text)
          } else {
            setAiSuggestion("Failed to summarize text. Please try again.")
          }
          break

        case "rephrase":
          result = await rephraseText(section.content.text)
          if (result.success) {
            setAiSuggestion(result.text)
          } else {
            setAiSuggestion("Failed to rephrase text. Please try again.")
          }
          break

        case "improve":
          result = await suggestImprovements(section.type, section.content.text)
          if (result.success) {
            setAiSuggestion(result.text)
          } else {
            setAiSuggestion("Failed to generate suggestions. Please try again.")
          }
          break

        case "caption":
          result = await generateFigureCaption(section.content.title)
          if (result.success) {
            setAiSuggestion(result.text)
          } else {
            setAiSuggestion("Failed to generate caption. Please try again.")
          }
          break

        default:
          setAiSuggestion("Unknown action")
      }
    } catch (error) {
      console.error("AI action error:", error)
      setAiSuggestion("An error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const applyAISuggestion = () => {
    if (section.type === "figure") {
      onContentChange(section.id, {
        ...section.content,
        caption: aiSuggestion,
      })
    } else {
      onContentChange(section.id, {
        ...section.content,
        text: aiSuggestion,
      })
    }
    setAiPopoverOpen(false)
  }

  // Handle saving chart data
  const handleSaveChart = (chartData) => {
    const updatedContent = { ...section.content, chartData }
    onContentChange(section.id, updatedContent)
    setChartDialogOpen(false)
  }

  // Handle saving table data
  const handleSaveTable = (tableData) => {
    const updatedContent = { ...section.content, tableData: tableData.data }
    onContentChange(section.id, updatedContent)
    setTableDialogOpen(false)
  }

  // Handle saving image
  const handleSaveImage = () => {
    const updatedContent = {
      ...section.content,
      imageUrl: selectedImage,
      caption: "Image caption",
    }
    onContentChange(section.id, updatedContent)
    setImageDialogOpen(false)
  }

  // Handle changing background color
  const handleChangeBackgroundColor = (color) => {
    onContentChange(section.id, {
      ...section.content,
      backgroundColor: color,
    })
    setColorPickerOpen(false)
  }

  // Available images for selection
  const availableImages = [
    { url: "/colorful-abstract-flow.png", name: "Abstract Flow" },
    { url: "/cellular-landscape.png", name: "Cellular Landscape" },
    { url: "/microscopic-world.png", name: "Microscopic World" },
    { url: "/chromatic-tapestry.png", name: "Chromatic Tapestry" },
    { url: "/ocean-warming-trend.png", name: "Ocean Warming Trend" },
    { url: "/biodiversity-change-over-time.png", name: "Biodiversity Change" },
    { url: "/coral-reef-decline-over-time.png", name: "Coral Reef Decline" },
  ]

  // Available background colors
  const backgroundColors = [
    { name: "White", value: "white" },
    { name: "Light Gray", value: "#f8f9fa" },
    { name: "Light Blue", value: "#e6f7ff" },
    { name: "Light Green", value: "#e6fffa" },
    { name: "Light Yellow", value: "#fffde7" },
    { name: "Light Purple", value: "#f3e5f5" },
    { name: "Light Pink", value: "#fce4ec" },
  ]

  // Add special classes for print mode
  const printModeClass = printMode ? "print-section" : ""

  // Update the return statement to hide controls in preview or print mode
  return (
    <div
      ref={ref}
      className={cn(
        "absolute border rounded-md overflow-hidden",
        themeClasses.background || "bg-white",
        themeClasses.border || "border-gray-200",
        isSelected && !previewMode && !printMode && "ring-2 ring-blue-500",
        isDragging && "opacity-50",
        printModeClass,
      )}
      style={{
        width: section.size.width,
        height: section.size.height,
        left: section.position.x,
        top: section.position.y,
        zIndex: section.zIndex,
        cursor: previewMode || printMode ? "default" : isDragging ? "grabbing" : "grab",
        backgroundColor: section.content.backgroundColor || "white",
        // Add print-specific styles
        pageBreakInside: printMode ? "avoid" : "auto",
      }}
      onClick={() => !previewMode && !printMode && onSelect()}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card className="h-full border-0 shadow-none" style={{ backgroundColor: "transparent" }}>
        {/* Always show edit button when not in preview/print mode, with opacity based on hover/selection state */}
        {!previewMode && !printMode && (
          <div className="absolute top-0 right-0 z-20 no-print">
            {isEditing ? (
              <div className="flex bg-white border rounded-bl-md">
                <Button variant="ghost" size="icon" onClick={handleEditSave}>
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleEditCancel}>
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 bg-white border rounded-bl-md transition-opacity duration-200",
                      isSelected || isHovering ? "opacity-100" : "opacity-30",
                    )}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleEditStart}>
                    <Edit className="h-4 w-4 mr-2" />
                    <span>Edit Content</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setColorPickerOpen(true)}>
                    <Palette className="h-4 w-4 mr-2" />
                    <span>Change Background</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onBringToFront(section.id)}>
                    <ArrowUpToLine className="h-4 w-4 mr-2" />
                    <span>Bring to Front</span>
                  </DropdownMenuItem>

                  {section.type === "text" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          // Open the text editor if not already open
                          if (!isEditing) {
                            handleEditStart(new Event("click") as React.MouseEvent<HTMLButtonElement>)
                          }
                        }}
                      >
                        <Quote className="h-4 w-4 mr-2" />
                        <span>Add Citation</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  {section.type === "text" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Wand2 className="h-4 w-4 mr-2" />
                          <span>AI Assist</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => handleAIAction("summarize")}>
                            <Wand2 className="h-4 w-4 mr-2" />
                            <span>Make it Concise</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAIAction("rephrase")}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            <span>Rephrase</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAIAction("improve")}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            <span>Improve</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </>
                  )}

                  {section.type === "figure" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleAIAction("caption")}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span>Generate Caption</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  {section.type === "text" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Plus className="h-4 w-4 mr-2" />
                          <span>Add Element</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => setImageDialogOpen(true)}>
                            <ImageIcon className="h-4 w-4 mr-2" />
                            <span>Add Image</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTableDialogOpen(true)}>
                            <Table2 className="h-4 w-4 mr-2" />
                            <span>Add Table</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setChartDialogOpen(true)}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            <span>Add Chart</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(section.id)} className="text-red-600">
                    <Trash className="h-4 w-4 mr-2" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        <CardContent className={cn("p-4 h-full overflow-auto", themeClasses.text || "text-gray-700")}>
          {renderSectionContent()}
        </CardContent>
      </Card>

      {/* Only show resize handles when selected and not in preview or print mode */}
      {isSelected && !previewMode && !printMode && (
        <>
          <div
            className="absolute top-0 left-0 w-4 h-4 bg-gray-300 rounded-tr cursor-nw-resize z-10 no-print"
            onMouseDown={(e) => handleResizeStart(e, "top-left")}
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 bg-gray-300 rounded-tl cursor-ne-resize z-10 no-print"
            onMouseDown={(e) => handleResizeStart(e, "top-right")}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 bg-gray-300 rounded-br cursor-sw-resize z-10 no-print"
            onMouseDown={(e) => handleResizeStart(e, "bottom-left")}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 bg-gray-300 rounded-bl cursor-se-resize z-10 no-print"
            onMouseDown={(e) => handleResizeStart(e, "bottom-right")}
          />
        </>
      )}

      {/* AI Suggestion Popover */}
      <Popover open={aiPopoverOpen} onOpenChange={setAiPopoverOpen}>
        <PopoverContent className="w-80 no-print" side="right">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">AI Suggestion</h3>
            <div className="p-2 bg-gray-50 rounded-md text-sm max-h-60 overflow-y-auto">
              {isProcessing ? (
                <div className="flex items-center justify-center py-4">
                  <svg
                    className="animate-spin h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <p className="whitespace-pre-line">{aiSuggestion}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setAiPopoverOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={applyAISuggestion} disabled={isProcessing}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Chart Creator Dialog */}
      <Dialog open={chartDialogOpen} onOpenChange={setChartDialogOpen}>
        <DialogContent className="max-w-4xl no-print">
          <DialogTitle>Create Chart</DialogTitle>
          <ChartCreator
            initialData={section.content.chartData}
            onSave={handleSaveChart}
            onCancel={() => setChartDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Table Editor Dialog */}
      <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
        <DialogContent className="max-w-4xl no-print">
          <DialogTitle>Edit Table</DialogTitle>
          <TableEditor
            initialData={section.content.tableData ? { data: section.content.tableData } : null}
            onSave={handleSaveTable}
            onCancel={() => setTableDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Image Selector Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="no-print">
          <DialogTitle>Select Image</DialogTitle>
          <div className="grid grid-cols-2 gap-4 py-4">
            {availableImages.map((image) => (
              <div
                key={image.url}
                className={cn(
                  "border rounded-md p-2 cursor-pointer hover:bg-gray-50 transition-colors",
                  selectedImage === image.url ? "border-blue-500 bg-blue-50" : "border-gray-200",
                )}
                onClick={() => setSelectedImage(image.url)}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.name}
                  className="w-full h-32 object-contain mb-2"
                />
                <p className="text-xs text-center font-medium">{image.name}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveImage}>Add Image</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Background Color Picker Dialog */}
      <Dialog open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
        <DialogContent className="no-print">
          <DialogTitle>Select Background Color</DialogTitle>
          <div className="grid grid-cols-3 gap-3 py-4">
            {backgroundColors.map((color) => (
              <div
                key={color.value}
                className={cn(
                  "border rounded-md p-2 cursor-pointer hover:bg-gray-50 transition-colors h-20 flex flex-col items-center justify-center",
                  section.content.backgroundColor === color.value
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200",
                )}
                style={{ backgroundColor: color.value }}
                onClick={() => handleChangeBackgroundColor(color.value)}
              >
                <p
                  className="text-xs text-center font-medium"
                  style={{ color: color.value === "white" ? "black" : "inherit" }}
                >
                  {color.name}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setColorPickerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setColorPickerOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
