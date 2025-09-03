"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star, Calendar, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample program data
const programs = [
  {
    id: 1,
    title: "Startup Funding Masterclass",
    instructor: "Dr. Amina Diallo",
    category: "Business Growth",
    type: "Group Program",
    sessions: 8,
    price: "$1,200",
    rating: 4.9,
    reviews: 124,
    startDate: "June 15, 2025",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    title: "Digital Marketing for MSMEs",
    instructor: "Emmanuel Osei",
    category: "Marketing",
    type: "Group Program",
    sessions: 6,
    price: "$950",
    rating: 4.8,
    reviews: 98,
    startDate: "May 20, 2025",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    title: "Business Growth Strategy",
    instructor: "Fatima Nkosi",
    category: "Business Strategy",
    type: "1:1 Program",
    sessions: 6,
    price: "$2,000",
    rating: 4.7,
    reviews: 87,
    startDate: "June 5, 2025",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 4,
    title: "Financial Management for Entrepreneurs",
    instructor: "Kwame Mensah",
    category: "Finance",
    type: "Group Program",
    sessions: 10,
    price: "$1,500",
    rating: 4.9,
    reviews: 112,
    startDate: "July 10, 2025",
    image: "/placeholder.svg?height=300&width=400",
  },
]

export default function UpcomingPrograms() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const visibleItems = 3
  const maxIndex = Math.max(0, programs.length - visibleItems)

  const scrollPrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const scrollNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-md"
          onClick={scrollPrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>
      </div>

      <div className="flex overflow-hidden gap-6 px-8">
        {programs.map((program, index) => (
          <div
            key={program.id}
            className="flex-none w-full sm:w-1/2 lg:w-1/3 px-2"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: "transform 0.5s ease-in-out",
              display: index >= currentIndex && index < currentIndex + visibleItems ? "block" : "none",
            }}
          >
            <Card className="h-full border-none shadow-lg rounded-xl overflow-hidden">
              <div className="relative">
                <img
                  src={program.image || "/placeholder.svg"}
                  alt={program.title}
                  className="object-cover w-full h-48"
                />
                <Badge className="absolute top-4 left-4 bg-[#FFD500] text-black">{program.type}</Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 fill-[#FFD500] text-[#FFD500]" />
                  <span className="font-bold">{program.rating}</span>
                  <span className="text-sm text-gray-500">({program.reviews} reviews)</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{program.title}</h3>
                <p className="text-gray-600 mb-4">with {program.instructor}</p>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Starts {program.startDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Users className="h-4 w-4" />
                  <span>{program.sessions} sessions</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{program.price}</span>
                  <Badge variant="outline" className="bg-gray-100">
                    {program.category}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]">Enroll Now</Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-md"
          onClick={scrollNext}
          disabled={currentIndex >= maxIndex}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      <div className="flex justify-center mt-6 gap-1">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-[#FFD500]" : "bg-gray-300"}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
