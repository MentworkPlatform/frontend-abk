"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface TierPerksTableProps {
  currentTier: "starter" | "builder" | "leader" | "partner"
}

export function TierPerksTable({ currentTier }: TierPerksTableProps) {
  const tiers = ["starter", "builder", "leader", "partner"]
  const currentTierIndex = tiers.indexOf(currentTier)

  // Define perks for each tier
  const perks = [
    {
      name: "Commission Rate",
      values: {
        starter: "10%",
        builder: "15%",
        leader: "20%",
        partner: "25%",
      },
      highlight: true,
    },
    {
      name: "School Program Access",
      values: {
        starter: false,
        builder: true,
        leader: true,
        partner: true,
      },
    },
    {
      name: "Featured on Homepage",
      values: {
        starter: false,
        builder: false,
        leader: true,
        partner: true,
      },
    },
    {
      name: "Priority Support",
      values: {
        starter: false,
        builder: false,
        leader: true,
        partner: true,
      },
    },
    {
      name: "Referral Bonus",
      values: {
        starter: "$5",
        builder: "$10",
        leader: "$15",
        partner: "$20",
      },
      highlight: true,
    },
    {
      name: "Early Access to Features",
      values: {
        starter: false,
        builder: false,
        leader: false,
        partner: true,
      },
    },
    {
      name: "Custom Program Branding",
      values: {
        starter: false,
        builder: false,
        leader: false,
        partner: true,
      },
    },
    {
      name: "Mentwork Certification",
      values: {
        starter: false,
        builder: true,
        leader: true,
        partner: true,
      },
    },
  ]

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Perk</TableHead>
            {tiers.map((tier, index) => (
              <TableHead key={tier} className="text-center">
                <div className="flex flex-col items-center">
                  <span className="capitalize">{tier}</span>
                  {tier === currentTier && (
                    <Badge variant="outline" className="mt-1">
                      Current
                    </Badge>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {perks.map((perk) => (
            <TableRow key={perk.name}>
              <TableCell className="font-medium">{perk.name}</TableCell>
              {tiers.map((tier) => {
                const value = perk.values[tier]
                const isAvailable = typeof value === "boolean" ? value : true
                const tierIndex = tiers.indexOf(tier)
                const isCurrentOrPast = tierIndex <= currentTierIndex

                return (
                  <TableCell key={tier} className="text-center">
                    {typeof value === "boolean" ? (
                      isAvailable ? (
                        <CheckCircle2
                          className={`h-5 w-5 mx-auto ${isCurrentOrPast ? "text-green-500" : "text-gray-300"}`}
                        />
                      ) : (
                        <XCircle className="h-5 w-5 mx-auto text-gray-300" />
                      )
                    ) : (
                      <span
                        className={`font-medium ${perk.highlight ? "text-primary" : ""} ${isCurrentOrPast ? "" : "text-gray-400"}`}
                      >
                        {value}
                      </span>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
