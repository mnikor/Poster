"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Clock,
  Star,
  Trash2,
  MoreHorizontal,
  Edit,
  Copy,
  Download,
  Share2,
  FileText,
  LayoutGrid,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Types for our poster data
interface Poster {
  id: string
  title: string
  template: string
  thumbnail: string
  createdAt: string
  updatedAt: string
  starred: boolean
}

export default function DashboardPage() {
  const [posters, setPosters] = useState<Poster[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newPosterTitle, setNewPosterTitle] = useState("")
  const [newPosterTemplate, setNewPosterTemplate] = useState("academic")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [posterToDelete, setPosterToDelete] = useState<string | null>(null)

  // Load posters from localStorage on initial render
  useEffect(() => {
    const savedPosters = localStorage.getItem("academicPosters")
    if (savedPosters) {
      try {
        setPosters(JSON.parse(savedPosters))
      } catch (error) {
        console.error("Failed to parse saved posters:", error)
        // Initialize with sample data if parsing fails
        setPosters(samplePosters)
        localStorage.setItem("academicPosters", JSON.stringify(samplePosters))
      }
    } else {
      // Initialize with sample data if no saved posters
      setPosters(samplePosters)
      localStorage.setItem("academicPosters", JSON.stringify(samplePosters))
    }
  }, [])

  // Save posters to localStorage whenever they change
  useEffect(() => {
    if (posters.length > 0) {
      localStorage.setItem("academicPosters", JSON.stringify(posters))
    }
  }, [posters])

  // Filter posters based on search query
  const filteredPosters = posters.filter((poster) => poster.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Get recent posters (last 7 days)
  const recentPosters = filteredPosters.filter((poster) => {
    const posterDate = new Date(poster.updatedAt)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return posterDate >= sevenDaysAgo
  })

  // Get starred posters
  const starredPosters = filteredPosters.filter((poster) => poster.starred)

  // Create a new poster
  const handleCreatePoster = () => {
    if (!newPosterTitle.trim()) return

    const newPoster: Poster = {
      id: `poster-${Date.now()}`,
      title: newPosterTitle,
      template: newPosterTemplate,
      thumbnail: getTemplateThumbnail(newPosterTemplate),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      starred: false,
    }

    setPosters([newPoster, ...posters])
    setNewPosterTitle("")
    setNewPosterTemplate("academic")
    setIsCreateDialogOpen(false)

    // Redirect to editor with the new poster ID
    window.location.href = `/editor?id=${newPoster.id}`
  }

  // Toggle star status
  const toggleStar = (id: string) => {
    setPosters(posters.map((poster) => (poster.id === id ? { ...poster, starred: !poster.starred } : poster)))
  }

  // Delete poster
  const deletePoster = (id: string) => {
    setPosters(posters.filter((poster) => poster.id !== id))
    setPosterToDelete(null)
  }

  // Duplicate poster
  const duplicatePoster = (id: string) => {
    const posterToDuplicate = posters.find((poster) => poster.id === id)
    if (!posterToDuplicate) return

    const duplicatedPoster: Poster = {
      ...posterToDuplicate,
      id: `poster-${Date.now()}`,
      title: `${posterToDuplicate.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      starred: false,
    }

    setPosters([duplicatedPoster, ...posters])
  }

  // Helper function to get template thumbnail
  const getTemplateThumbnail = (template: string): string => {
    switch (template) {
      case "academic":
        return "/academic-poster-layout.png"
      case "scientific":
        return "/scientific-poster-template-layout.png"
      case "minimal":
        return "/abstract-minimalist-poster.png"
      case "visual":
        return "/blank-event-poster.png"
      default:
        return "/academic-poster-layout.png"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Academic Poster Generator
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Help</Button>
              <Button variant="ghost">Account</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Posters</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search posters..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Poster
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Poster</DialogTitle>
                  <DialogDescription>Give your poster a name and choose a template to get started.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="poster-title" className="text-sm font-medium">
                      Poster Title
                    </label>
                    <Input
                      id="poster-title"
                      placeholder="Enter poster title"
                      value={newPosterTitle}
                      onChange={(e) => setNewPosterTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Choose Template</label>
                    <div className="grid grid-cols-2 gap-4">
                      <TemplateOption
                        name="Academic"
                        image="/academic-poster-layout.png"
                        value="academic"
                        selected={newPosterTemplate === "academic"}
                        onSelect={() => setNewPosterTemplate("academic")}
                      />
                      <TemplateOption
                        name="Scientific"
                        image="/scientific-poster-template-layout.png"
                        value="scientific"
                        selected={newPosterTemplate === "scientific"}
                        onSelect={() => setNewPosterTemplate("scientific")}
                      />
                      <TemplateOption
                        name="Minimal"
                        image="/abstract-minimalist-poster.png"
                        value="minimal"
                        selected={newPosterTemplate === "minimal"}
                        onSelect={() => setNewPosterTemplate("minimal")}
                      />
                      <TemplateOption
                        name="Visual"
                        image="/blank-event-poster.png"
                        value="visual"
                        selected={newPosterTemplate === "visual"}
                        onSelect={() => setNewPosterTemplate("visual")}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePoster} disabled={!newPosterTitle.trim()}>
                    Create Poster
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Posters</TabsTrigger>
            <TabsTrigger value="recent">
              <Clock className="mr-2 h-4 w-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="starred">
              <Star className="mr-2 h-4 w-4" />
              Starred
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredPosters.length === 0 ? (
              <EmptyState
                title="No posters found"
                description={searchQuery ? "Try a different search term" : "Create your first poster to get started"}
                icon={<FileText className="h-12 w-12 text-gray-400" />}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPosters.map((poster) => (
                  <PosterCard
                    key={poster.id}
                    poster={poster}
                    onToggleStar={() => toggleStar(poster.id)}
                    onDelete={() => setPosterToDelete(poster.id)}
                    onDuplicate={() => duplicatePoster(poster.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            {recentPosters.length === 0 ? (
              <EmptyState
                title="No recent posters"
                description="Posters you've worked on in the last 7 days will appear here"
                icon={<Clock className="h-12 w-12 text-gray-400" />}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentPosters.map((poster) => (
                  <PosterCard
                    key={poster.id}
                    poster={poster}
                    onToggleStar={() => toggleStar(poster.id)}
                    onDelete={() => setPosterToDelete(poster.id)}
                    onDuplicate={() => duplicatePoster(poster.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="starred" className="space-y-6">
            {starredPosters.length === 0 ? (
              <EmptyState
                title="No starred posters"
                description="Star your favorite posters to find them quickly"
                icon={<Star className="h-12 w-12 text-gray-400" />}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {starredPosters.map((poster) => (
                  <PosterCard
                    key={poster.id}
                    poster={poster}
                    onToggleStar={() => toggleStar(poster.id)}
                    onDelete={() => setPosterToDelete(poster.id)}
                    onDuplicate={() => duplicatePoster(poster.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!posterToDelete} onOpenChange={(open) => !open && setPosterToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your poster.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => posterToDelete && deletePoster(posterToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Poster Card Component
function PosterCard({ poster, onToggleStar, onDelete, onDuplicate }) {
  const formattedDate = new Date(poster.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/editor?id=${poster.id}`}>
        <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
          <img
            src={poster.thumbnail || "/placeholder.svg"}
            alt={poster.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium truncate">{poster.title}</CardTitle>
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.preventDefault()
                onToggleStar()
              }}
            >
              <Star className={`h-5 w-5 ${poster.starred ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/editor?id=${poster.id}`} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-500">Last edited: {formattedDate}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center text-xs text-gray-500">
          <LayoutGrid className="h-3 w-3 mr-1" />
          <span className="capitalize">{poster.template} template</span>
        </div>
      </CardFooter>
    </Card>
  )
}

// Template Option Component
function TemplateOption({ name, image, value, selected, onSelect }) {
  return (
    <div
      className={`border rounded-md overflow-hidden cursor-pointer transition-all ${
        selected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onSelect}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-2 text-center">
        <span className="text-sm font-medium">{name}</span>
      </div>
    </div>
  )
}

// Empty State Component
function EmptyState({ title, description, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-gray-500 max-w-md">{description}</p>
    </div>
  )
}

// Sample poster data
const samplePosters: Poster[] = [
  {
    id: "poster-1",
    title: "Climate Change Effects on Marine Ecosystems",
    template: "scientific",
    thumbnail: "/scientific-poster-template-layout.png",
    createdAt: "2023-04-10T12:00:00Z",
    updatedAt: "2023-04-15T14:30:00Z",
    starred: true,
  },
  {
    id: "poster-2",
    title: "Machine Learning Applications in Healthcare",
    template: "academic",
    thumbnail: "/academic-poster-layout.png",
    createdAt: "2023-03-22T09:15:00Z",
    updatedAt: "2023-04-18T11:45:00Z",
    starred: false,
  },
  {
    id: "poster-3",
    title: "The Impact of Social Media on Mental Health",
    template: "minimal",
    thumbnail: "/abstract-minimalist-poster.png",
    createdAt: "2023-04-05T16:20:00Z",
    updatedAt: "2023-04-05T18:10:00Z",
    starred: true,
  },
  {
    id: "poster-4",
    title: "Renewable Energy Technologies",
    template: "visual",
    thumbnail: "/blank-event-poster.png",
    createdAt: "2023-03-15T10:30:00Z",
    updatedAt: "2023-04-01T13:45:00Z",
    starred: false,
  },
]
