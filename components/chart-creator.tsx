"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BarChart, LineChart, PieChart, ScatterChartIcon as ScatterPlot } from "lucide-react"
import { cn } from "@/lib/utils"

const chartTypes = [
  { id: "bar", name: "Bar Chart", icon: BarChart },
  { id: "line", name: "Line Chart", icon: LineChart },
  { id: "pie", name: "Pie Chart", icon: PieChart },
  { id: "scatter", name: "Scatter Plot", icon: ScatterPlot },
]

const chartColors = [
  { id: "blue", name: "Blue", value: "#3b82f6" },
  { id: "green", name: "Green", value: "#10b981" },
  { id: "purple", name: "Purple", value: "#8b5cf6" },
  { id: "orange", name: "Orange", value: "#f97316" },
  { id: "red", name: "Red", value: "#ef4444" },
  { id: "gray", name: "Gray", value: "#6b7280" },
]

export default function ChartCreator({ initialData = null, onSave, onCancel }) {
  const [chartType, setChartType] = useState(initialData?.type || "bar")
  const [chartTitle, setChartTitle] = useState(initialData?.title || "")
  const [chartData, setChartData] = useState(initialData?.data || "")
  const [chartLabels, setChartLabels] = useState(initialData?.labels || "")
  const [chartColor, setChartColor] = useState(initialData?.color || "blue")
  const [showLegend, setShowLegend] = useState(initialData?.showLegend || true)
  const [showGrid, setShowGrid] = useState(initialData?.showGrid || true)
  const [activeTab, setActiveTab] = useState("data")

  const handleSave = () => {
    onSave({
      type: chartType,
      title: chartTitle,
      data: chartData,
      labels: chartLabels,
      color: chartColor,
      showLegend,
      showGrid,
    })
  }

  const renderChartPreview = () => {
    // Parse data and labels
    const dataPoints = chartData
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => Number.parseFloat(line.trim()))
      .filter((num) => !isNaN(num))

    const labelList = chartLabels
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.trim())

    // Simple chart preview based on type
    switch (chartType) {
      case "bar":
        return (
          <div className="h-48 flex items-end justify-around p-4 border rounded-md bg-gray-50">
            {dataPoints.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-8"
                  style={{
                    height: `${Math.min(100, (value / Math.max(...dataPoints)) * 100)}%`,
                    backgroundColor: chartColors.find((c) => c.id === chartColor)?.value || "#3b82f6",
                  }}
                ></div>
                {labelList[index] && <span className="text-xs mt-1">{labelList[index]}</span>}
              </div>
            ))}
          </div>
        )

      case "line":
        return (
          <div className="h-48 relative p-4 border rounded-md bg-gray-50">
            {showGrid && (
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="border border-gray-200"></div>
                ))}
              </div>
            )}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {dataPoints.length > 0 && (
                <polyline
                  points={dataPoints
                    .map((value, index) => {
                      const x = (index / (dataPoints.length - 1)) * 100
                      const y = 100 - (value / Math.max(...dataPoints)) * 100
                      return `${x},${y}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke={chartColors.find((c) => c.id === chartColor)?.value || "#3b82f6"}
                  strokeWidth="2"
                />
              )}
              {dataPoints.map((value, index) => {
                const x = (index / (dataPoints.length - 1)) * 100
                const y = 100 - (value / Math.max(...dataPoints)) * 100
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="2"
                    fill={chartColors.find((c) => c.id === chartColor)?.value || "#3b82f6"}
                  />
                )
              })}
            </svg>
            {showLegend && labelList.length > 0 && (
              <div className="absolute bottom-2 left-2 text-xs bg-white p-1 rounded border">
                {labelList.slice(0, 3).map((label, i) => (
                  <div key={i} className="flex items-center">
                    <span
                      className="inline-block w-2 h-2 mr-1 rounded-full"
                      style={{ backgroundColor: chartColors.find((c) => c.id === chartColor)?.value || "#3b82f6" }}
                    ></span>
                    <span>{label}</span>
                  </div>
                ))}
                {labelList.length > 3 && <div>...</div>}
              </div>
            )}
          </div>
        )

      case "pie":
        return (
          <div className="h-48 flex items-center justify-center p-4 border rounded-md bg-gray-50">
            <svg width="120" height="120" viewBox="0 0 100 100">
              {dataPoints.length > 0 &&
                (() => {
                  const total = dataPoints.reduce((sum, val) => sum + val, 0)
                  let startAngle = 0
                  return dataPoints.map((value, index) => {
                    const percentage = value / total
                    const angle = percentage * 360
                    const endAngle = startAngle + angle

                    // Calculate SVG arc path
                    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
                    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
                    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
                    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)

                    // Determine if the arc should be drawn the long way around
                    const largeArcFlag = angle > 180 ? 1 : 0

                    // Create the SVG path
                    const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

                    // Get a color for this slice (cycling through colors)
                    const colorIndex = index % chartColors.length
                    const color = chartColors[colorIndex].value

                    // Update the start angle for the next slice
                    const element = <path key={index} d={path} fill={color} stroke="white" strokeWidth="1" />

                    startAngle = endAngle
                    return element
                  })
                })()}
            </svg>
            {showLegend && (
              <div className="ml-4 text-xs">
                {dataPoints.map((value, index) => (
                  <div key={index} className="flex items-center mb-1">
                    <span
                      className="inline-block w-3 h-3 mr-1"
                      style={{
                        backgroundColor: chartColors[index % chartColors.length].value,
                      }}
                    ></span>
                    <span>
                      {labelList[index] || `Item ${index + 1}`}: {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case "scatter":
        return (
          <div className="h-48 relative p-4 border rounded-md bg-gray-50">
            {showGrid && (
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="border border-gray-200"></div>
                ))}
              </div>
            )}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {chartData
                .split("\n")
                .filter((line) => line.trim())
                .map((line, index) => {
                  const [x, y] = line
                    .split(",")
                    .map((val) => Number.parseFloat(val.trim()))
                    .filter((num) => !isNaN(num))

                  if (x !== undefined && y !== undefined) {
                    // Normalize to 0-100 range for display
                    const normalizedX = (x / 10) * 100
                    const normalizedY = 100 - (y / 10) * 100

                    return (
                      <circle
                        key={index}
                        cx={normalizedX}
                        cy={normalizedY}
                        r="3"
                        fill={chartColors.find((c) => c.id === chartColor)?.value || "#3b82f6"}
                      />
                    )
                  }
                  return null
                })}
            </svg>
          </div>
        )

      default:
        return <div className="h-48 flex items-center justify-center border rounded-md">Chart Preview</div>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Chart Creator</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="type">Chart Type</TabsTrigger>
            <TabsTrigger value="data">Data & Labels</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>

          <TabsContent value="type" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {chartTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Button
                    key={type.id}
                    variant={chartType === type.id ? "default" : "outline"}
                    className={cn(
                      "h-20 flex flex-col items-center justify-center",
                      chartType === type.id ? "border-2 border-primary" : "",
                    )}
                    onClick={() => setChartType(type.id)}
                  >
                    <Icon className="h-6 w-6 mb-1" />
                    <span>{type.name}</span>
                  </Button>
                )
              })}
            </div>

            <div className="space-y-2">
              <Label htmlFor="chart-title">Chart Title</Label>
              <Input
                id="chart-title"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Enter chart title"
              />
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chart-data">
                {chartType === "scatter" ? "Data Points (x,y pairs, one per line)" : "Data Values (one per line)"}
              </Label>
              <Textarea
                id="chart-data"
                value={chartData}
                onChange={(e) => setChartData(e.target.value)}
                placeholder={chartType === "scatter" ? "1.2, 3.4\n5.6, 7.8\n9.0, 10.1" : "10\n25\n15\n30"}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chart-labels">Labels (one per line)</Label>
              <Textarea
                id="chart-labels"
                value={chartLabels}
                onChange={(e) => setChartLabels(e.target.value)}
                placeholder="Label 1\nLabel 2\nLabel 3"
                className="min-h-[80px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <div className="space-y-2">
              <Label>Chart Color</Label>
              <div className="grid grid-cols-3 gap-2">
                {chartColors.map((color) => (
                  <Button
                    key={color.id}
                    variant="outline"
                    className={cn("h-8 border-2", chartColor === color.id ? "border-black" : "border-transparent")}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setChartColor(color.id)}
                  >
                    <span className="sr-only">{color.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show-legend"
                checked={showLegend}
                onChange={(e) => setShowLegend(e.target.checked)}
              />
              <Label htmlFor="show-legend">Show Legend</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show-grid"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
              />
              <Label htmlFor="show-grid">Show Grid</Label>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4">
          <Label className="text-sm font-medium">Preview</Label>
          {renderChartPreview()}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Chart</Button>
        </div>
      </CardContent>
    </Card>
  )
}
