"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function OrientationSelector({ selectedOrientation, onSelectOrientation }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 mr-2 text-gray-500"
          >
            <rect width="18" height="14" x="3" y="5" rx="2" />
            <path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8" />
          </svg>
          <h3 className="font-medium">Orientation</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div
            className={cn(
              "border-2 rounded-md overflow-hidden cursor-pointer transition-all p-2 flex flex-col items-center",
              selectedOrientation === "landscape"
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300",
            )}
            onClick={() => onSelectOrientation("landscape")}
          >
            <div className="w-16 h-12 bg-gray-100 rounded mb-1"></div>
            <span className="text-xs">Landscape</span>
          </div>

          <div
            className={cn(
              "border-2 rounded-md overflow-hidden cursor-pointer transition-all p-2 flex flex-col items-center",
              selectedOrientation === "portrait"
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300",
            )}
            onClick={() => onSelectOrientation("portrait")}
          >
            <div className="w-12 h-16 bg-gray-100 rounded mb-1"></div>
            <span className="text-xs">Portrait</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
