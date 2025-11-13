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

      <div className="w-full p-8 space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Your Programs</h2>
              <p className="text-gray-600">
                Active programs and personalized recommendations
              </p>
            </div>
          </div>

          {/* Active Programs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Currently Active</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {yourPrograms.map((program) => (
                <Card
                  key={program.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {program.title}
                        </CardTitle>
                        <CardDescription>with {program.mentor}</CardDescription>
                      </div>
                      <Badge variant="secondary">{program.focusArea}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{program.progress}%</span>
                      </div>
                      <Progress value={program.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/lms/programs/${program.id}`}
                        className="flex items-center text-sm text-gray-600 hover:text-[#FFD500] transition-colors cursor-pointer"
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        {program.nextSession}
                      </Link>
                      <Button
                        size="sm"
                        className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                        asChild
                      >
                        <Link href={`/lms/programs/${program.id}`}>
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
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Recommended for You</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedPrograms.map((program) => (
                <Card
                  key={program.id}
                  className="hover:shadow-md transition-shadow border-[#FFD500]/20"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {program.title}
                        </CardTitle>
                        <CardDescription>with {program.mentor}</CardDescription>
                      </div>
                      <Badge className="bg-[#FFD500] text-black text-nowrap">
                        {program.focusArea}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{program.reason}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">
                          {program.duration}
                        </span>
                        <div className="flex items-center">
                          <Award className="mr-1 h-4 w-4 text-yellow-500" />
                          <span>{program.rating}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/programs/${program.id}`}>
                          Learn More
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Recommended for Growth
              </h2>
              <p className="text-gray-600">
                Opportunities to strengthen your entrepreneurial toolkit
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {growthPrograms.map((program) => (
              <Card
                key={program.id}
                className="hover:shadow-md transition-shadow border-green-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{program.title}</CardTitle>
                      <CardDescription>with {program.mentor}</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-700"
                    >
                      {program.focusArea}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{program.reason}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">{program.duration}</span>
                      <div className="flex items-center">
                        <Award className="mr-1 h-4 w-4 text-yellow-500" />
                        <span>{program.rating}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-700 hover:bg-green-50 bg-transparent"
                      asChild
                    >
                      <Link href={`/programs/${program.id}`}>
                        Explore
                        <ChevronRight className="ml-1 h-4 w-4" />
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
