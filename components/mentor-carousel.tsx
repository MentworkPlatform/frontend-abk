import Link from "next/link"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function MentorCarousel() {
  // Mock data for mentors
  const mentors = [
    {
      id: 1,
      name: "Dr. Amina Diallo",
      title: "Tech Entrepreneur & Investor",
      rating: 4.9,
      reviews: 124,
      image: "/placeholder.svg?height=300&width=300",
      tags: ["Startup Growth", "Fundraising", "Tech Leadership"],
      programCount: 3,
    },
    {
      id: 2,
      name: "Emmanuel Osei",
      title: "Marketing Director",
      rating: 4.8,
      reviews: 98,
      image: "/placeholder.svg?height=300&width=300",
      tags: ["Digital Marketing", "Brand Strategy", "E-commerce"],
      programCount: 2,
    },
    {
      id: 3,
      name: "Fatima Nkosi",
      title: "Finance Executive",
      rating: 4.7,
      reviews: 87,
      image: "/placeholder.svg?height=300&width=300",
      tags: ["MSME Financing", "Investment", "Business Strategy"],
      programCount: 4,
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Mentor Programs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn from industry experts who are passionate about sharing their knowledge and experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img src={mentor.image || "/placeholder.svg"} alt={mentor.name} className="w-full h-64 object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-[#FFD500] text-[#FFD500]" />
                  <span className="font-medium">{mentor.rating}</span>
                  <span className="text-sm text-gray-500">({mentor.reviews} reviews)</span>
                </div>
                <h3 className="text-xl font-bold">{mentor.name}</h3>
                <p className="text-gray-600 mb-4">{mentor.title}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link href={`/programs?mentor=${mentor.id}`}>
                  <Button className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]">
                    View {mentor.programCount} Programs
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
