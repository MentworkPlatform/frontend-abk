export default function PartnerLogos() {
  // Sample partner logos
  const partners = [
    { name: "TechHub Africa", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Innovation Capital", logo: "/placeholder.svg?height=60&width=120" },
    { name: "African Business Council", logo: "/placeholder.svg?height=60&width=120" },
    { name: "African Business Council", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Global Entrepreneurs Network", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Digital Africa Initiative", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Future Leaders Foundation", logo: "/placeholder.svg?height=60&width=120" },
  ]

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
      {partners.map((partner, index) => (
        <div key={index} className="flex flex-col items-center">
          <img
            src={partner.logo || "/placeholder.svg"}
            alt={partner.name}
            className="h-12 md:h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
          />
          <span className="text-xs text-gray-500 mt-2">{partner.name}</span>
        </div>
      ))}
    </div>
  )
}
