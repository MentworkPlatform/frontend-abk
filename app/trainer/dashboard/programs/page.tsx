"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  BookOpen,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardHeader } from "@/components/dashboard-header";
import type { TrainerProgram } from "@/types/trainer";

export default function TrainerPrograms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [programs] = useState<TrainerProgram[]>([
    {
      id: "prog-1",
      title: "Digital Marketing Bootcamp",
      tagline: "Comprehensive digital marketing training program",
      description:
        "Learn SEO, SEM, social media, content marketing, and analytics.",
      category: "Marketing",
      industry: "Tech",
      level: "intermediate",
      language: "English",
      format: "virtual",
      type: "group",
      maxParticipants: 25,
      price: 1500,
      duration: 12,
      startDate: "2024-09-01",
      endDate: "2024-11-23",
      status: "active",
      coverImage: "/placeholder.svg?height=200&width=300",
      learningOutcomes: ["Master SEO strategies", "Run effective ad campaigns"],
      prerequisites: ["Basic marketing knowledge"],
      curriculum: [],
      mentorAssignments: [],
      createdAt: "2024-07-01",
      updatedAt: "2024-07-10",
    },
    {
      id: "prog-2",
      title: "Advanced React Development",
      tagline: "Build scalable and performant React applications",
      description:
        "Deep dive into React hooks, context, performance optimization, and Next.js.",
      category: "Technology",
      industry: "Software",
      level: "advanced",
      language: "English",
      format: "virtual",
      type: "group",
      maxParticipants: 15,
      price: 2000,
      duration: 10,
      startDate: "2024-10-01",
      endDate: "2024-12-06",
      status: "published",
      coverImage: "/placeholder.svg?height=200&width=300",
      learningOutcomes: [
        "Optimize React app performance",
        "Implement complex state management",
      ],
      prerequisites: ["Proficiency in JavaScript and React basics"],
      curriculum: [],
      mentorAssignments: [],
      createdAt: "2024-07-15",
      updatedAt: "2024-07-20",
    },
    {
      id: "prog-3",
      title: "Leadership Essentials for Managers",
      tagline: "Develop key leadership skills for effective team management",
      description:
        "Covering communication, delegation, conflict resolution, and motivation.",
      category: "Leadership",
      industry: "All",
      level: "intermediate",
      language: "English",
      format: "in-person",
      type: "group",
      maxParticipants: 20,
      price: 1200,
      duration: 8,
      startDate: "2024-08-01",
      endDate: "2024-09-27",
      status: "completed",
      coverImage: "/placeholder.svg?height=200&width=300",
      learningOutcomes: [
        "Improve team productivity",
        "Foster a positive work environment",
      ],
      prerequisites: ["Experience in a managerial role"],
      curriculum: [],
      mentorAssignments: [],
      createdAt: "2024-06-01",
      updatedAt: "2024-09-27",
    },
    {
      id: "prog-4",
      title: "Personal Branding for Professionals",
      tagline: "Build a strong personal brand to advance your career",
      description:
        "Strategies for online presence, networking, and thought leadership.",
      category: "Business",
      industry: "All",
      level: "beginner",
      language: "English",
      format: "virtual",
      type: "one-on-one",
      maxParticipants: 1,
      price: 800,
      duration: 4,
      startDate: "2024-09-15",
      endDate: "2024-10-15",
      status: "draft",
      coverImage: "/placeholder.svg?height=200&width=300",
      learningOutcomes: [
        "Define your unique value proposition",
        "Create a compelling online presence",
      ],
      prerequisites: [],
      curriculum: [],
      mentorAssignments: [],
      createdAt: "2024-07-25",
      updatedAt: "2024-07-25",
    },
  ]);

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || program.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || program.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "published":
        return "secondary";
      case "completed":
        return "outline";
      case "draft":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex-1 space-y-6">
      <DashboardHeader
        title="Your Programs"
        description="Manage and track all your training programs"
        actionButton={{
          label: "Create New Program",
          href: "/trainer/dashboard/programs/create",
          icon: Plus,
        }}
      />

      <div className="w-full space-y-6 p-8">
        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Input
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Leadership">Leadership</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>

        {/* Program List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All ({filteredPrograms.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({programs.filter((p) => p.status === "active").length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Published (
              {programs.filter((p) => p.status === "published").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed (
              {programs.filter((p) => p.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft ({programs.filter((p) => p.status === "draft").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <ProgramList
              programs={filteredPrograms}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
          <TabsContent value="active" className="space-y-4">
            <ProgramList
              programs={filteredPrograms.filter((p) => p.status === "active")}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
          <TabsContent value="published" className="space-y-4">
            <ProgramList
              programs={filteredPrograms.filter(
                (p) => p.status === "published"
              )}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
          <TabsContent value="completed" className="space-y-4">
            <ProgramList
              programs={filteredPrograms.filter(
                (p) => p.status === "completed"
              )}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
          <TabsContent value="draft" className="space-y-4">
            <ProgramList
              programs={filteredPrograms.filter((p) => p.status === "draft")}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface ProgramListProps {
  programs: TrainerProgram[];
  getStatusColor: (status: string) => string;
}

function ProgramList({ programs, getStatusColor }: ProgramListProps) {
  if (programs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No programs found</h3>
          <p className="text-muted-foreground text-center">
            Try adjusting your filters or create a new program to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <Card key={program.id} className="flex flex-col">
          <CardHeader className="relative p-0">
            <img
              src={
                program.coverImage || "/placeholder.svg?height=200&width=300"
              }
              alt={program.title}
              width={300}
              height={200}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <Badge
              variant={getStatusColor(program.status)}
              className="absolute top-3 right-3 text-xs px-2 py-1"
            >
              {program.status}
            </Badge>
          </CardHeader>
          <CardContent className="p-4 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold mb-1">{program.title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {program.tagline}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {program.duration} weeks
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {program.type === "group"
                  ? `${program.maxParticipants} participants`
                  : "1:1"}
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {program.category}
              </div>
              <div className="flex items-center">
                <span className="font-medium text-foreground">
                  ${program.price}
                </span>
              </div>
            </div>
            <div className="mt-auto flex justify-between items-center">
              <Link
                href={`/trainer/dashboard/programs/${program.id}/lms`}
                passHref
              >
                <Button variant="outline" size="sm">
                  Manage Program
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/trainer/dashboard/programs/${program.id}/edit`}
                    >
                      Edit Program
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/trainer/dashboard/programs/${program.id}/mentors`}
                    >
                      Manage Mentors
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Delete Program
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
