"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Wand2, Quote, LayoutGrid, Download, Users, Sparkles, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("academic")

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Create Professional Academic Posters in Minutes
              </h1>
              <p className="text-xl opacity-90">
                Transform your research into visually stunning academic posters with our AI-powered tool. No design
                skills required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-blue-50">
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700" asChild>
                  <Link href="/editor">Try Demo</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/academic-poster-layout.png"
                alt="Academic Poster Example"
                className="rounded-lg shadow-2xl transform -rotate-1 border-4 border-white"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Researchers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create professional academic posters without the hassle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Wand2 className="h-10 w-10 text-blue-500" />}
              title="AI-Powered Content Extraction"
              description="Upload your research papers and our AI will automatically extract key information, saving you hours of work."
            />
            <FeatureCard
              icon={<LayoutGrid className="h-10 w-10 text-blue-500" />}
              title="Beautiful Templates"
              description="Choose from professionally designed templates optimized for academic conferences and presentations."
            />
            <FeatureCard
              icon={<Quote className="h-10 w-10 text-blue-500" />}
              title="Citation Management"
              description="Easily search, verify, and format citations in your preferred style with our integrated citation tools."
            />
            <FeatureCard
              icon={<FileText className="h-10 w-10 text-blue-500" />}
              title="Rich Text Editing"
              description="Format your content with our intuitive editor. Add tables, charts, and images with ease."
            />
            <FeatureCard
              icon={<Download className="h-10 w-10 text-blue-500" />}
              title="Export Options"
              description="Export your poster as PDF, PNG, or JPG in high resolution, ready for printing or digital presentation."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-blue-500" />}
              title="Collaboration Tools"
              description="Work together with colleagues on the same poster with real-time collaboration features."
            />
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Professional Templates</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from a variety of templates designed for different academic disciplines
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="scientific">Scientific</TabsTrigger>
                <TabsTrigger value="minimal">Minimal</TabsTrigger>
                <TabsTrigger value="visual">Visual</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="academic" className="flex justify-center">
              <div className="relative max-w-3xl">
                <img
                  src="/academic-poster-layout.png"
                  alt="Academic Template"
                  className="rounded-lg shadow-lg border border-gray-200"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow">
                  <h3 className="font-bold">Academic Template</h3>
                  <p className="text-sm text-gray-600">Perfect for humanities and social sciences</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scientific" className="flex justify-center">
              <div className="relative max-w-3xl">
                <img
                  src="/scientific-poster-template-layout.png"
                  alt="Scientific Template"
                  className="rounded-lg shadow-lg border border-gray-200"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow">
                  <h3 className="font-bold">Scientific Template</h3>
                  <p className="text-sm text-gray-600">Ideal for STEM research and data-heavy presentations</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="minimal" className="flex justify-center">
              <div className="relative max-w-3xl">
                <img
                  src="/abstract-minimalist-poster.png"
                  alt="Minimal Template"
                  className="rounded-lg shadow-lg border border-gray-200"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow">
                  <h3 className="font-bold">Minimal Template</h3>
                  <p className="text-sm text-gray-600">Clean design focusing on your key message</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visual" className="flex justify-center">
              <div className="relative max-w-3xl">
                <img
                  src="/blank-event-poster.png"
                  alt="Visual Template"
                  className="rounded-lg shadow-lg border border-gray-200"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow">
                  <h3 className="font-bold">Visual Template</h3>
                  <p className="text-sm text-gray-600">Image-focused layout for visual impact</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Create your academic poster in four simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Upload Documents"
              description="Upload your research papers, data, and other documents."
              icon={<FileText className="h-6 w-6" />}
            />
            <StepCard
              number="2"
              title="Extract Content"
              description="Our AI extracts key information from your documents."
              icon={<Wand2 className="h-6 w-6" />}
            />
            <StepCard
              number="3"
              title="Design Poster"
              description="Customize your poster with our intuitive editor."
              icon={<LayoutGrid className="h-6 w-6" />}
            />
            <StepCard
              number="4"
              title="Export & Share"
              description="Download your poster in high resolution or share it directly."
              icon={<Download className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Researchers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of researchers who have simplified their poster creation process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="This tool saved me hours of work. I was able to create a professional poster for my conference in just 30 minutes!"
              author="Dr. Sarah Johnson"
              role="Associate Professor, Biology"
              image="/thoughtful-gaze.png"
            />
            <TestimonialCard
              quote="The AI content extraction is incredible. It pulled all the key points from my paper automatically and arranged them perfectly."
              author="Michael Chen"
              role="PhD Candidate, Computer Science"
              image="/thoughtful-gaze.png"
            />
            <TestimonialCard
              quote="As someone with no design skills, this tool was a lifesaver. My poster looked professional and received great feedback at the conference."
              author="Emma Rodriguez"
              role="Research Fellow, Psychology"
              image="/thoughtful-gaze.png"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Academic Poster?</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Join thousands of researchers who have simplified their poster creation process
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-blue-50">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700" asChild>
              <Link href="/editor">Try Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Academic Poster Generator</h3>
              <p className="text-gray-400">Create professional academic posters in minutes with our AI-powered tool.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Features</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white">
                    AI Content Extraction
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Citation Management
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Export Options
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Academic Poster Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon, title, description }) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

// Step Card Component
function StepCard({ number, title, description, icon }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 relative">
        <span className="text-blue-600 text-xl font-bold">{number}</span>
        <div className="absolute -right-1 -bottom-1 bg-blue-500 rounded-full p-2 text-white">{icon}</div>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ quote, author, role, image }) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          <Sparkles className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0 mt-1" />
          <p className="text-gray-700 italic">"{quote}"</p>
        </div>
        <div className="flex items-center mt-4">
          <img src={image || "/placeholder.svg"} alt={author} className="w-12 h-12 rounded-full mr-4" />
          <div>
            <h4 className="font-bold">{author}</h4>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
