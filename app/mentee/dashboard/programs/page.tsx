"use client";

import Link from "next/link";
import { Clock, ArrowRight, BookOpen, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardHeader } from "@/components/dashboard-header";

// Mock data - replace with API call
const programs = [
  {
    id: 1,
    title: "Leadership Excellence Program",
    mentor: "Sarah Johnson",
    progress: 75,
    focusArea: "Leadership & People",
    nextSession: "Today, 2:00 PM",
    status: "active",
    totalTopics: 8,
    completedTopics: 6,
  },
  {
    id: 2,
    title: "Strategic Business Planning",
    mentor: "Michael Chen",
    progress: 60,
    focusArea: "Strategy & Planning",
    nextSession: "Tomorrow, 10:00 AM",
    status: "active",
    totalTopics: 6,
    completedTopics: 4,
  },
  {
    id: 3,
    title: "Digital Marketing Mastery",
    mentor: "Emma Rodriguez",
    progress: 30,
    focusArea: "Branding, Marketing & Sales",
    nextSession: "Next Week",
    status: "active",
    totalTopics: 10,
    completedTopics: 3,
  },
];

export default function ProgramsPage() {
  return (
    <div className="w-full space-y-6">
      <DashboardHeader
        title="My Programs"
        description="View and manage all your enrolled programs"
        actionButton={{
          label: "Explore Programs",
          href: "/programs",
          icon: Plus,
        }}
      />

      <div className="w-full space-y-6 p-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Link key={program.id} href={`/mentee/dashboard/programs/${program.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">
                        {program.title}
                      </CardTitle>
                      <CardDescription>with {program.mentor}</CardDescription>
                    </div>
                    <Badge variant="secondary">{program.focusArea}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{program.progress}%</span>
                    </div>
                    <Progress value={program.progress} className="h-2" />
                    <div className="text-xs text-gray-500">
                      {program.completedTopics}/{program.totalTopics} topics
                      completed
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="mr-1 h-4 w-4" />
                      {program.nextSession}
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#FFD500] text-black hover:bg-[#e6c000] font-medium"
                    >
                      View Program
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </Link>
          ))}
        </div>

        {programs.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No programs yet</h3>
              <p className="text-gray-600 text-center mb-4">
                Start your learning journey by enrolling in a program
              </p>
              <Button
                className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                asChild
              >
                <Link href="/programs">Explore Programs</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
