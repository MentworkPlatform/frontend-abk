"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Users,
  BookOpen,
  Eye,
  ArrowRight,
  Calendar,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardHeader } from "@/components/dashboard-header";

const upcomingSessions = [
  {
    id: 1,
    programId: "1",
    programTitle: "Digital Marketing Bootcamp",
    topic: "Topic 5: Social Media Strategy",
    time: "Today, 3:00 PM",
    duration: "90 minutes",
    participants: 25,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    meetingId: "123-456-789",
  },
  {
    id: 2,
    programId: "2",
    programTitle: "Leadership Excellence Program",
    topic: "Topic 8: Team Building",
    time: "Tomorrow, 11:00 AM",
    duration: "120 minutes",
    participants: 18,
    meetingLink: "https://zoom.us/j/123456789",
    meetingId: "123 456 789",
  },
  {
    id: 3,
    programId: "1",
    programTitle: "Digital Marketing Bootcamp",
    topic: "Topic 6: Content Marketing",
    time: "Friday, 3:00 PM",
    duration: "90 minutes",
    participants: 25,
    meetingLink: "https://meet.google.com/xyz-uvwx-rst",
    meetingId: "987-654-321",
  },
];

export default function TrainerDashboard() {
  const [programs] = useState([
    {
      id: "1",
      title: "Digital Marketing Bootcamp",
      participants: 25,
      mentors: 4,
      status: "active",
      startDate: "2024-01-15",
      hasLMS: true,
    },
    {
      id: "2",
      title: "Leadership Excellence Program",
      participants: 18,
      mentors: 3,
      status: "active",
      startDate: "2024-02-01",
      hasLMS: true,
    },
    {
      id: "3",
      title: "Data Science Fundamentals",
      participants: 30,
      mentors: 5,
      status: "completed",
      startDate: "2023-11-01",
      hasLMS: false,
    },
    {
      id: "4",
      title: "Personal Branding Workshop",
      participants: 12,
      mentors: 2,
      status: "draft",
      startDate: "2023-10-15",
      hasLMS: false,
    },
    {
      id: "5",
      title: "Product Management Masterclass",
      participants: 0,
      mentors: 0,
      status: "draft",
      startDate: null,
      hasLMS: false,
    },
  ]);

  const activePrograms = programs.filter((p) => p.status === "active");
  const draftPrograms = programs.filter((p) => p.status === "draft");
  const completedPrograms = programs.filter((p) => p.status === "completed");

  const getStatusColor = (status: string) => {
    return status === "active" ? "default" : "secondary";
  };

  return (
    <>
      <DashboardHeader
        title="Trainer Dashboard"
        description="Manage your programs, sessions, and mentors"
        actionButton={{
          label: "Create Program",
          href: "/trainer/dashboard/programs/create",
          icon: Plus,
        }}
      />
      <div className="w-full pt-2 space-y-4 sm:space-y-6 md:px-6 md:pt-5 md:pb-5">
        {/* All Programs Section */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-semibold sm:text-lg">All Programs</CardTitle>
            <CardDescription className="text-xs sm:text-sm">View and manage all your programs</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-9">
                <TabsTrigger value="active" className="text-xs sm:text-sm">
                  Active ({activePrograms.length})
                </TabsTrigger>
                <TabsTrigger value="draft" className="text-xs sm:text-sm">
                  Draft ({draftPrograms.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs sm:text-sm">
                  Completed ({completedPrograms.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-4">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {activePrograms.map((program) => (
                <Card
                  key={program.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarImage
                            src="/placeholder.svg?height=40&width=40"
                            alt="Program"
                          />
                          <AvatarFallback className="text-xs">
                            {program.title
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <CardTitle className="text-base font-semibold leading-tight">
                            {program.title}
                          </CardTitle>
                          <Badge
                            variant={getStatusColor(program.status)}
                            className="mt-1 text-xs"
                          >
                            {program.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {program.participants}
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {program.mentors} mentors
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/trainer/dashboard/programs/${program.id}/lms`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent h-8 text-xs sm:text-sm"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        Manage Program
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
              </TabsContent>

              <TabsContent value="draft" className="mt-4">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {draftPrograms.map((program) => (
                <Card
                  key={program.id}
                  className="hover:shadow-md transition-shadow cursor-pointer opacity-75"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarImage
                            src="/placeholder.svg?height=40&width=40"
                            alt="Program"
                          />
                          <AvatarFallback className="text-xs">
                            {program.title
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <CardTitle className="text-base font-semibold leading-tight">
                            {program.title}
                          </CardTitle>
                          <Badge
                            variant={getStatusColor(program.status)}
                            className="mt-1 text-xs"
                          >
                            {program.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {program.participants}
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {program.mentors} mentors
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/trainer/dashboard/programs/${program.id}/lms`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent h-8 text-xs sm:text-sm"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View Program
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {completedPrograms.map((program) => (
                    <Card
                      key={program.id}
                      className="hover:shadow-md transition-shadow cursor-pointer opacity-75"
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarImage
                                src="/placeholder.svg?height=40&width=40"
                                alt="Program"
                              />
                              <AvatarFallback className="text-xs">
                                {program.title
                                  .split(" ")
                                  .map((word) => word[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <CardTitle className="text-base font-semibold leading-tight">
                                {program.title}
                              </CardTitle>
                              <Badge
                                variant={getStatusColor(program.status)}
                                className="mt-1 text-xs"
                              >
                                {program.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {program.participants}
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {program.mentors} mentors
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/trainer/dashboard/programs/${program.id}/lms`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent h-8 text-xs sm:text-sm"
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            View Program
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              Your Upcoming Sessions
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Next sessions scheduled with meeting links
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-gray-50 gap-3"
                >
                  <Link
                    href={`/trainer/dashboard/programs/${session.programId}/lms`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-medium hover:text-[#FFD500] transition-colors">
                        {session.programTitle}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {session.topic}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.time} ({session.duration})
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {session.participants} participants
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                    <div className="text-right text-sm">
                      <p className="font-mono text-xs text-muted-foreground">
                        ID: {session.meetingId}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(session.meetingLink, "_blank");
                      }}
                      className="bg-[#FFD500] hover:bg-[#e6c000] w-full sm:w-auto"
                    >
                      Join Meeting
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  </>
  );
}
