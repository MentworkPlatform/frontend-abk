"use client"

import Link from "next/link"
import { Rocket, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PreLaunchOverviewPage() {
  // Mock program data for demonstration
  const programs = [
    {
      id: "program-1",
      title: "Digital Marketing Mastery",
      description: "Comprehensive digital marketing training program.",
      status: "pre-launch",
      launchDate: "2024-03-15",
    },
    {
      id: "program-2",
      title: "Advanced Web Development",
      description: "Deep dive into modern web technologies and frameworks.",
      status: "pre-launch",
      launchDate: "2024-04-01",
    },
    {
      id: "program-3",
      title: "Data Science Fundamentals",
      description: "Introduction to data analysis, machine learning, and statistics.",
      status: "active", // Example of an active program
      launchDate: "2023-10-01",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <Rocket className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Pre-Launch Programs Overview</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Select a program below to manage its pre-launch activities, including milestones, marketing campaigns, and
          mentor negotiations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card key={program.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{program.title}</CardTitle>
                <CardDescription>{program.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Launch Date: {new Date(program.launchDate).toLocaleDateString()}</span>
                  <Badge variant={program.status === "pre-launch" ? "secondary" : "default"}>{program.status}</Badge>
                </div>
                {program.status === "pre-launch" ? (
                  <Button asChild className="w-full">
                    <Link href={`/lms/programs/${program.id}/pre-launch`}>
                      Manage Pre-Launch <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="w-full bg-transparent">
                    Program Already Launched
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {programs.filter((p) => p.status === "pre-launch").length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-4">No programs currently in pre-launch phase.</p>
            <Button asChild>
              <Link href="/lms/programs/create">Create New Program</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
