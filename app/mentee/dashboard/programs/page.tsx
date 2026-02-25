"use client";

import Link from "next/link";
import { Clock, BookOpen, Plus } from "lucide-react";

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

      <div className="w-full pt-2 space-y-4 sm:space-y-6">
        {programs.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {programs.map((program) => (
              <Card
                key={program.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg leading-tight">
                        {program.title}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        with {program.mentor}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs shrink-0"
                    >
                      {program.focusArea}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
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
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-1">
                    <Link
                      href={`/mentee/dashboard/programs/${program.id}`}
                      className="flex items-center text-xs sm:text-sm text-gray-600 hover:text-[#FFD500] transition-colors cursor-pointer"
                    >
                      <Clock className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      {program.nextSession}
                    </Link>
                    <Button
                      size="sm"
                      className="w-full sm:w-auto bg-[#FFD500] text-black hover:bg-[#e6c000] text-sm"
                      asChild
                    >
                      <Link href={`/mentee/dashboard/programs/${program.id}`}>
                        Continue
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 px-6">
              <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No programs yet
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
                Enroll in a program to start learning. Your progress and sessions
                will show here.
              </p>
              <Button
                className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                asChild
              >
                <Link href="/programs">Explore programs</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
