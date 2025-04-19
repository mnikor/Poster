"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TableEditor({ initialData = null, onSave, onCancel }) {
  const [tableTitle, setTableTitle] = useState(initialData?.title || "")
  const [tableData, setTableData] = useState(
    initialData?.data
      ? parseCSVToArray(initialData.data)
      : [
          ["Header 1", "Header 2", "Header 3"],
          ["Data 1", "Data 2", "Data 3"],
          ["Data 4", "Data 5", "Data 6"],
        ],
  )
  const [headerStyle, setHeaderStyle] = useState(initialData?.headerStyle || "default")
  const [borderStyle, setBorderStyle] = useState(initialData?.borderStyle || "default")
  const [stripedRows, setStripedRows] = useState(initialData?.stripedRows || false)
  const [activeTab, setActiveTab] = useState("data")
  const [selectedCell, setSelectedCell] = useState({ row: -1, col: -1 })

  // Parse CSV string to 2D array
  function parseCSVToArray(csv) {
    return csv.split("\n").map((row) => row.split(",").map((cell) => cell.trim()))
  }

  // Convert 2D array to CSV string
  function arrayToCSV(array) {
    return array.map((row) => row.join(",")).join("\n")
  }

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = [...tableData]
    newData[rowIndex][colIndex] = value
    setTableData(newData)
  }

  const addRow = () => {
    const newRow = Array(tableData[0].length).fill("")
    setTableData([...tableData, newRow])
  }

  const addColumn = () => {
    const newData = tableData.map((row) => [...row, ""])
    setTableData(newData)
  }

  const removeRow = (rowIndex) => {
    if (tableData.length <= 1) return
    const newData = tableData.filter((_, index) => index !== rowIndex)
    setTableData(newData)
  }

  const removeColumn = (colIndex) => {
    if (tableData[0].length <= 1) return
    const newData = tableData.map((row) => row.filter((_, index) => index !== colIndex))
    setTableData(newData)
  }

  const moveRow = (rowIndex, direction) => {
    if ((direction === "up" && rowIndex === 0) || (direction === "down" && rowIndex === tableData.length - 1)) {
      return
    }

    const newData = [...tableData]
    const targetIndex = direction === "up" ? rowIndex - 1 : rowIndex + 1
    const temp = newData[targetIndex]
    newData[targetIndex] = newData[rowIndex]
    newData[rowIndex] = temp
    setTableData(newData)
  }

  const moveColumn = (colIndex, direction) => {
    if ((direction === "left" && colIndex === 0) || (direction === "right" && colIndex === tableData[0].length - 1)) {
      return
    }

    const targetIndex = direction === "left" ? colIndex - 1 : colIndex + 1
    const newData = tableData.map((row) => {
      const newRow = [...row]
      const temp = newRow[targetIndex]
      newRow[targetIndex] = newRow[colIndex]
      newRow[colIndex] = temp
      return newRow
    })
    setTableData(newData)
  }

  const handleSave = () => {
    onSave({
      title: tableTitle,
      data: arrayToCSV(tableData),
      headerStyle,
      borderStyle,
      stripedRows,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Table Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="table-title">Table Title</Label>
              <Input
                id="table-title"
                value={tableTitle}
                onChange={(e) => setTableTitle(e.target.value)}
                placeholder="Enter table title"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Table Data</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={addRow}>
                    <Plus className="h-3 w-3 mr-1" /> Row
                  </Button>
                  <Button variant="outline" size="sm" onClick={addColumn}>
                    <Plus className="h-3 w-3 mr-1" /> Column
                  </Button>
                </div>
              </div>

              <div className="border rounded-md overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <tbody>
                    {tableData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border p-1 bg-gray-100 w-10">
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => moveRow(rowIndex, "up")}
                              disabled={rowIndex === 0}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => moveRow(rowIndex, "down")}
                              disabled={rowIndex === tableData.length - 1}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-red-500"
                              onClick={() => removeRow(rowIndex)}
                              disabled={tableData.length <= 1}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        {row.map((cell, colIndex) => (
                          <td
                            key={colIndex}
                            className={cn(
                              "border p-1",
                              rowIndex === 0 && "bg-gray-50",
                              selectedCell.row === rowIndex && selectedCell.col === colIndex && "bg-blue-50",
                            )}
                          >
                            <Input
                              value={cell}
                              onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                              className="h-8 min-w-[80px]"
                              onFocus={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="border p-1 bg-gray-100"></td>
                      {tableData[0].map((_, colIndex) => (
                        <td key={colIndex} className="border p-1 bg-gray-100">
                          <div className="flex justify-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => moveColumn(colIndex, "left")}
                              disabled={colIndex === 0}
                            >
                              <ArrowLeft className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => moveColumn(colIndex, "right")}
                              disabled={colIndex === tableData[0].length - 1}
                            >
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-red-500"
                              onClick={() => removeColumn(colIndex)}
                              disabled={tableData[0].length <= 1}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="header-style">Header Style</Label>
              <Select value={headerStyle} onValueChange={setHeaderStyle}>
                <SelectTrigger id="header-style">
                  <SelectValue placeholder="Select header style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="filled">Filled Background</SelectItem>
                  <SelectItem value="bordered">Bordered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="border-style">Border Style</Label>
              <Select value={borderStyle} onValueChange={setBorderStyle}>
                <SelectTrigger id="border-style">
                  <SelectValue placeholder="Select border style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="none">No Borders</SelectItem>
                  <SelectItem value="horizontal">Horizontal Only</SelectItem>
                  <SelectItem value="outer">Outer Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="striped-rows"
                checked={stripedRows}
                onChange={(e) => setStripedRows(e.target.checked)}
              />
              <Label htmlFor="striped-rows">Striped Rows</Label>
            </div>

            <div className="mt-4 border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <table className="w-full">
                <thead>
                  <tr>
                    {tableData[0].map((header, index) => (
                      <th
                        key={index}
                        className={cn(
                          "p-2",
                          headerStyle === "default" && "bg-gray-50 font-medium",
                          headerStyle === "bold" && "font-bold",
                          headerStyle === "filled" && "bg-gray-200",
                          headerStyle === "bordered" && "border-b-2 border-black",
                          borderStyle === "default" && "border",
                          borderStyle === "none" && "border-0",
                          borderStyle === "horizontal" && "border-b",
                          borderStyle === "outer" && index === 0 && "border-l",
                          borderStyle === "outer" && index === tableData[0].length - 1 && "border-r",
                          borderStyle === "outer" && "border-t",
                        )}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={cn(
                            "p-2",
                            stripedRows && rowIndex % 2 === 0 && "bg-gray-50",
                            borderStyle === "default" && "border",
                            borderStyle === "none" && "border-0",
                            borderStyle === "horizontal" && "border-b",
                            borderStyle === "outer" && cellIndex === 0 && "border-l",
                            borderStyle === "outer" && cellIndex === row.length - 1 && "border-r",
                            borderStyle === "outer" && rowIndex === tableData.length - 2 && "border-b",
                          )}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Table</Button>
        </div>
      </CardContent>
    </Card>
  )
}
