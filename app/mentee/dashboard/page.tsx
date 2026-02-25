import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Clock, TrendingUp, Award, ChevronRight } from "lucide-react";

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

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Personalized Learning Dashboard",
};

const yourPrograms = [
  {
    id: 1,
    title: "Leadership Excellence Program",
    mentor: "Sarah Johnson",
    progress: 75,
    focusArea: "Leadership & People",
    nextSession: "Today, 2:00 PM",
    status: "active",
  },
  {
    id: 2,
    title: "Strategic Business Planning",
    mentor: "Michael Chen",
    progress: 60,
    focusArea: "Strategy & Planning",
    nextSession: "Tomorrow, 10:00 AM",
    status: "active",
  },
];

const suggestedPrograms = [
  {
    id: 3,
    title: "Digital Marketing Mastery",
    mentor: "Emma Rodriguez",
    focusArea: "Branding, Marketing & Sales",
    duration: "8 weeks",
    rating: 4.9,
    reason: "Perfect match for your entrepreneurship goals",
  },
  {
    id: 4,
    title: "Innovation & Product Development",
    mentor: "David Kim",
    focusArea: "Operations & Innovation",
    duration: "6 weeks",
    rating: 4.8,
    reason: "Builds on your strategic planning foundation",
  },
];

const growthPrograms = [
  {
    id: 5,
    title: "Startup Funding Essentials",
    mentor: "Lisa Wang",
    focusArea: "Finance & Funding",
    duration: "4 weeks",
    rating: 4.7,
    reason: "Strengthen your entrepreneurial toolkit",
  },
  {
    id: 6,
    title: "Social Impact & Governance",
    mentor: "James Thompson",
    focusArea: "Governance & Impact",
    duration: "5 weeks",
    rating: 4.6,
    reason: "Expand your leadership perspective",
  },
];

export default function DashboardPage() {
  return (
    <div className="w-full">
      <DashboardHeader
        title="Welcome back, John!"
        description="Continue your entrepreneurial journey with personalized recommendations"
        actionButton={{
          label: "Explore Programs",
          href: "/programs",
          icon: Plus,
        }}
      />

      <div className="w-full pt-4 sm:pt-6 space-y-6 sm:space-y-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold">Your Programs</h2>
              <p className="text-sm sm:text-base text-gray-600">
                Active programs and personalized recommendations
              </p>
            </div>
          </div>

          {/* Active Programs */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Currently Active</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {yourPrograms.map((program) => (
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
                        <CardDescription className="text-xs sm:text-sm">with {program.mentor}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">{program.focusArea}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{program.progress}%</span>
                      </div>
                      <Progress value={program.progress} className="h-2" />
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
          </div>

          {/* Suggested Programs */}
          <div className="space-y-3 sm:space-y-4 pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-2 sm:mb-3">Recommended for You</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {suggestedPrograms.map((program) => (
                <Card
                  key={program.id}
                  className="hover:shadow-sm transition-shadow border-gray-200 bg-gray-50/50"
                >
                  <CardHeader className="pb-2 pt-3 px-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-semibold leading-tight mb-1">
                          {program.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          with {program.mentor}
                        </CardDescription>
                      </div>
                      <Badge className="bg-gray-200 text-gray-700 text-xs shrink-0">
                        {program.focusArea}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 px-4 pb-3">
                    <p className="text-xs text-gray-500 line-clamp-2">{program.reason}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-gray-500">
                        <span>{program.duration}</span>
                        <div className="flex items-center">
                          <Award className="mr-1 h-3 w-3 text-yellow-500" />
                          <span>{program.rating}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        asChild
                      >
                        <Link href={`/programs/${program.id}`}>
                          View
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 pt-4 border-t">
          <div>
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2 sm:mb-3">
              <TrendingUp className="h-4 w-4 text-gray-400 shrink-0" />
              Recommended for Growth
            </h3>
            <p className="text-xs text-gray-500 mb-3 sm:mb-4">
              Opportunities to strengthen your entrepreneurial toolkit
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {growthPrograms.map((program) => (
              <Card
                key={program.id}
                className="hover:shadow-sm transition-shadow border-gray-200 bg-gray-50/50"
              >
                <CardHeader className="pb-2 pt-3 px-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold leading-tight mb-1">
                        {program.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        with {program.mentor}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-gray-300 text-gray-600 text-xs shrink-0"
                    >
                      {program.focusArea}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 px-4 pb-3">
                  <p className="text-xs text-gray-500 line-clamp-2">{program.reason}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-gray-500">
                      <span>{program.duration}</span>
                      <div className="flex items-center">
                        <Award className="mr-1 h-3 w-3 text-yellow-500" />
                        <span>{program.rating}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      asChild
                    >
                      <Link href={`/programs/${program.id}`}>
                        View
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
