// Sectors with their associated skills
export const SECTORS = [
  {
    id: "agriculture",
    name: "Agriculture & Agro-Processing",
    skills: [
      "Crop farming",
      "Livestock",
      "Poultry",
      "Fishery",
      "Agro-processing (cassava, rice, dairy, spices, etc.)",
    ],
  },
  {
    id: "food-hospitality",
    name: "Food & Hospitality",
    skills: [
      "Restaurants",
      "Ghost kitchens",
      "Catering",
      "Street food",
      "Serviced Apartments",
      "Hotels",
      "Guesthouses",
    ],
  },
  {
    id: "retail-ecommerce",
    name: "Retail & E-Commerce",
    skills: [
      "Supermarkets",
      "Convenience stores",
      "Online shops",
      "Marketplaces",
    ],
  },
  {
    id: "fashion-apparel",
    name: "Fashion, Apparel & Textiles",
    skills: [
      "Clothing",
      "Footwear",
      "Tailoring",
      "Traditional wear",
      "Textile production",
      "Leatherworks",
    ],
  },
  {
    id: "beauty-cosmetics",
    name: "Beauty, Cosmetics & Personal Care",
    skills: [
      "Hair salons",
      "Skincare",
      "Spa services",
      "Beauty product manufacturing",
    ],
  },
  {
    id: "construction-real-estate",
    name: "Construction, Housing & Real Estate",
    skills: ["Building contractors", "Interior design", "Property management"],
  },
  {
    id: "recycling-waste",
    name: "Recycling, Waste Management & Circular Economy",
    skills: ["Plastic recycling", "Waste-to-energy", "Composting", "Upcycling"],
  },
  {
    id: "transport-logistics",
    name: "Transport, Logistics & Delivery",
    skills: [
      "Ride-hailing",
      "Courier services",
      "Delivery services",
      "Trucking",
      "Cold chain logistics",
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Fabrication",
    skills: ["Furniture", "Metalworks", "3D printing", "Industrial assembly"],
  },
  {
    id: "technology-it",
    name: "Technology, IT & Digital Services",
    skills: ["Software", "AI tools", "Web development", "Cybersecurity"],
  },
  {
    id: "creative-arts",
    name: "Creative, Arts & Media",
    skills: ["Film", "Photography", "Graphic design", "Content creation"],
  },
  {
    id: "health-wellness",
    name: "Health, Wellness & Fitness",
    skills: [
      "Clinics",
      "Nutrition",
      "Sports",
      "Fitness coaching",
      "Alternative medicine",
    ],
  },
  {
    id: "education-training",
    name: "Education and Training",
    skills: ["Schools", "Tutoring", "Online courses", "Skills training"],
  },
  {
    id: "tourism-travel",
    name: "Tourism, Travel & Events",
    skills: ["Tour operators", "Event planning", "Cultural tourism"],
  },
  {
    id: "energy-cleantech",
    name: "Energy, Cleantech & Green Innovations",
    skills: ["Solar", "Biofuels", "Energy efficiency solutions"],
  },
  {
    id: "handicrafts",
    name: "Handicrafts & Local Artisanship",
    skills: ["Pottery", "Woodwork", "Beadwork", "Cultural crafts"],
  },
  {
    id: "professional-services",
    name: "Professional & Business Services",
    skills: ["Consulting", "Legal", "Accounting", "HR", "BPO"],
  },
  {
    id: "wash",
    name: "Water, Sanitation & Hygiene (WASH)",
    skills: ["Water treatment", "Borehole services", "Sanitation solutions"],
  },
  {
    id: "automotive",
    name: "Automotive & Repairs",
    skills: ["Car sales", "Auto repairs", "Spare parts distribution"],
  },
  {
    id: "security",
    name: "Security Services",
    skills: ["Physical security", "Cybersecurity", "Security tech solutions"],
  },
  {
    id: "tech-startups",
    name: "Tech Startups",
    skills: ["Ed-tech", "Fintech", "Legtech"],
  },
] as const;

// General Skills & Capabilities (available across all sectors)
export const SKILLS_CAPABILITIES = [
  "Leadership, People & Culture",
  "Business Planning & Strategic Thinking",
  "Branding, Marketing & Digital Presence",
  "Sales & Customer Acquisition",
  "Customer Experience & Service Excellence",
  "Financial Management, Bookkeeping & Cost Control",
  "Operations, Process Optimization & Supply Chain",
  "Product Development, Prototyping & Innovation",
  "Digital Skills & Technology Adoption",
  "Fundraising, Access to Finance & Investor Readiness",
  "Compliance, Legal & Corporate Governance",
  "Social Impact, ESG & Sustainability Practices",
  "Pitching, Storytelling & Public Speaking",
  "Negotiation & Conflict Resolution",
  "Time Management & Productivity",
  "Team Building & Collaboration",
  "Risk Management & Business Continuity",
  "Market Research & Opportunity Analysis",
  "Export Readiness & International Trade",
  "Data Analytics & Decision-Making",
] as const;

// Get all skills for selected sectors
export const getSkillsForSectors = (selectedSectorIds: string[]): string[] => {
  const sectorSkills: string[] = [];

  selectedSectorIds.forEach((sectorId) => {
    const sector = SECTORS.find((s) => s.id === sectorId);
    if (sector) {
      sectorSkills.push(...sector.skills);
    }
  });

  // Remove duplicates
  return [...new Set(sectorSkills)];
};

// Get skills grouped by sector
export const getSkillsGroupedBySector = (
  selectedSectorIds: string[]
): Array<{
  sectorId: string;
  sectorName: string;
  skills: string[];
}> => {
  return selectedSectorIds.map((sectorId) => {
    const sector = SECTORS.find((s) => s.id === sectorId);
    return {
      sectorId: sector?.id || sectorId,
      sectorName: sector?.name || sectorId,
      skills: sector?.skills ? [...sector.skills] : [],
    };
  });
};

// Get all available skills (sector skills + general skills)
export const getAllAvailableSkills = (
  selectedSectorIds: string[]
): string[] => {
  const sectorSkills = getSkillsForSectors(selectedSectorIds);
  const allSkills = [...sectorSkills, ...SKILLS_CAPABILITIES];

  // Remove duplicates
  return [...new Set(allSkills)];
};
