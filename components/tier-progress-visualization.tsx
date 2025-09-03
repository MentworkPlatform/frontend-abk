"use client"

import { CheckCircle2, Circle, HelpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TierProgressVisualizationProps {
  currentTier: "starter" | "builder" | "leader" | "partner"
  sessionsCompleted: number
  rating: number
  programsCreated: number
  tierRequirements: {
    [key: string]: {
      sessions: number
      rating: number
      programsCreated: number
    }
  }
}

export function TierProgressVisualization({
  currentTier,
  sessionsCompleted,
  rating,
  programsCreated,
  tierRequirements,
}: TierProgressVisualizationProps) {
  const tiers = ["starter", "builder", "leader", "partner"]
  const currentTierIndex = tiers.indexOf(currentTier)
  const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null

  // Calculate progress percentages for the next tier
  const calculateProgress = (current: number, required: number) => {
    if (!required) return 100
    const progress = Math.min(Math.round((current / required) * 100), 100)
    return progress
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500"
    if (progress >= 66) return "bg-yellow-500"
    if (progress >= 33) return "bg-orange-500"
    return "bg-red-500"
  }

  const getRequirementStatus = (tier: string, field: "sessions" | "rating" | "programsCreated") => {
    const requirement = tierRequirements[tier][field]
    const current = field === "sessions" ? sessionsCompleted : field === "rating" ? rating : programsCreated

    return current >= requirement
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="relative">
          {/* Tier ladder visualization */}
          <div className="flex justify-between mb-8">
            {tiers.map((tier, index) => {
              const isCurrent = tier === currentTier
              const isPast = index <= currentTierIndex
              const isFuture = index > currentTierIndex

              return (
                <div key={tier} className={`flex flex-col items-center relative z-10 ${isCurrent ? "scale-110" : ""}`}>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isCurrent
                        ? "border-primary bg-primary/10 text-primary"
                        : isPast
                          ? "border-green-500 bg-green-500/10 text-green-500"
                          : "border-gray-300 bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isPast && !isCurrent ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : isCurrent ? (
                      <Circle className="h-6 w-6 fill-primary/20" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </div>
                  <span
                    className={`mt-2 font-medium capitalize ${
                      isCurrent ? "text-primary" : isPast ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {tier}
                  </span>

                  {/* Requirements tooltip */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="mt-1">
                          <HelpCircle
                            className={`h-4 w-4 ${
                              isCurrent ? "text-primary/60" : isPast ? "text-green-500/60" : "text-gray-400/60"
                            }`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="space-y-2 p-4 max-w-[250px]">
                        <h4 className="font-semibold capitalize">{tier} Tier Requirements:</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            {getRequirementStatus(tier, "sessions") ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                            <span>{tierRequirements[tier].sessions} Sessions</span>
                          </li>
                          <li className="flex items-center gap-2">
                            {getRequirementStatus(tier, "rating") ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                            <span>{tierRequirements[tier].rating.toFixed(1)}+ Rating</span>
                          </li>
                          <li className="flex items-center gap-2">
                            {getRequirementStatus(tier, "programsCreated") ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                            <span>{tierRequirements[tier].programsCreated} Programs Created</span>
                          </li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )
            })}

            {/* Connecting line */}
            <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
          </div>

          {/* Progress to next tier */}
          {nextTier && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Progress to {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)} Tier
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Sessions Completed</span>
                    <span>
                      {sessionsCompleted}/{tierRequirements[nextTier].sessions}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProgressColor(calculateProgress(sessionsCompleted, tierRequirements[nextTier].sessions))}`}
                      style={{ width: `${calculateProgress(sessionsCompleted, tierRequirements[nextTier].sessions)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Average Rating</span>
                    <span>
                      {rating.toFixed(1)}/{tierRequirements[nextTier].rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProgressColor(calculateProgress(rating, tierRequirements[nextTier].rating))}`}
                      style={{ width: `${calculateProgress(rating, tierRequirements[nextTier].rating)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Programs Created</span>
                    <span>
                      {programsCreated}/{tierRequirements[nextTier].programsCreated}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProgressColor(calculateProgress(programsCreated, tierRequirements[nextTier].programsCreated))}`}
                      style={{
                        width: `${calculateProgress(programsCreated, tierRequirements[nextTier].programsCreated)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
