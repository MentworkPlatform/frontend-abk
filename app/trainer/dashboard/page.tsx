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
      status: "inactive",
      startDate: "2023-11-01",
      hasLMS: false,
    },
    {
      id: "4",
      title: "Personal Branding Workshop",
      participants: 12,
      mentors: 2,
      status: "inactive",
      startDate: "2023-10-15",
      hasLMS: false,
    },
  ]);

  const activePrograms = programs.filter((p) => p.status === "active");
  const inactivePrograms = programs.filter((p) => p.status === "inactive");

  const getStatusColor = (status: string) => {
    return status === "active" ? "default" : "secondary";
  };

  return (
    <div className="flex-1 space-y-6">
      <DashboardHeader
        title="Trainer Dashboard"
        description="Manage your programs, sessions, and mentors"
        actionButton={{
          label: "Create Program",
          href: "/trainer/dashboard/programs/create",
          icon: Plus,
        }}
      />

      <div className="w-full space-y-6 p-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Your Programs</h2>
          <p className="text-gray-600">
            Manage and track all your training programs
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Your Upcoming Sessions
            </CardTitle>
            <CardDescription>
              Next sessions scheduled with meeting links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-4"
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

        <div className="space-y-6">
          {/* Active Programs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                Active Programs ({activePrograms.length})
              </h3>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {activePrograms.map((program) => (
                <Card
                  key={program.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src="/placeholder.svg?height=40&width=40"
                            alt="Program"
                          />
                          <AvatarFallback>
                            {program.title
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {program.title}
                          </CardTitle>
                          <Badge
                            variant={getStatusColor(program.status)}
                            className="mt-1"
                          >
                            {program.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                        className="w-full bg-transparent"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Manage Program
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Inactive Programs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                Inactive Programs ({inactivePrograms.length})
              </h3>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {inactivePrograms.map((program) => (
                <Card
                  key={program.id}
                  className="hover:shadow-md transition-shadow cursor-pointer opacity-75"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src="/placeholder.svg?height=40&width=40"
                            alt="Program"
                          />
                          <AvatarFallback>
                            {program.title
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {program.title}
                          </CardTitle>
                          <Badge
                            variant={getStatusColor(program.status)}
                            className="mt-1"
                          >
                            {program.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                        className="w-full bg-transparent"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Program
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
