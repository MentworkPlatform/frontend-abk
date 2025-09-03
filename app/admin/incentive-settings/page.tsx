"use client"

import { useState } from "react"
import { Info, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

// Mock data for tier criteria
const initialTierCriteria = {
  starter: {
    sessions: 0,
    rating: 0,
    programsCreated: 0,
    commission: 10,
    schoolProgramAccess: false,
    referralBonus: 5,
  },
  builder: {
    sessions: 5,
    rating: 4.0,
    programsCreated: 1,
    commission: 15,
    schoolProgramAccess: true,
    referralBonus: 10,
  },
  leader: {
    sessions: 15,
    rating: 4.3,
    programsCreated: 2,
    commission: 20,
    schoolProgramAccess: true,
    referralBonus: 15,
  },
  partner: {
    sessions: 30,
    rating: 4.5,
    programsCreated: 3,
    commission: 25,
    schoolProgramAccess: true,
    referralBonus: 20,
  },
}

export default function IncentiveSettings() {
  const [tierCriteria, setTierCriteria] = useState(initialTierCriteria)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (tier, field, value) => {
    setTierCriteria({
      ...tierCriteria,
      [tier]: {
        ...tierCriteria[tier],
        [field]: field === "schoolProgramAccess" ? value : Number(value),
      },
    })
  }

  const handleSave = () => {
    // In a real app, you would save the changes to the database
    toast({
      title: "Settings saved",
      description: "Your incentive settings have been updated successfully.",
    })
    setIsEditing(false)
  }

  const handleReset = () => {
    setTierCriteria(initialTierCriteria)
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incentive Settings</h1>
          <p className="text-muted-foreground">Configure tier criteria and rewards for mentors.</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save size={16} />
                <span>Save Changes</span>
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Settings</Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="tier-criteria" className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="tier-criteria">Tier Criteria</TabsTrigger>
          <TabsTrigger value="commission-rates">Commission Rates</TabsTrigger>
          <TabsTrigger value="referral-program">Referral Program</TabsTrigger>
        </TabsList>

        <TabsContent value="tier-criteria" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tier Advancement Criteria</CardTitle>
              <CardDescription>Set the requirements for mentors to advance to each tier level.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Tier</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Min. Sessions
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                The minimum number of completed mentoring sessions required to reach this tier.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Min. Rating
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">The minimum average rating required to reach this tier.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Programs Created
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                The minimum number of programs a mentor must create to reach this tier.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(tierCriteria).map(([tier, criteria]) => (
                    <TableRow key={tier}>
                      <TableCell className="font-medium capitalize">{tier}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="number"
                            min="0"
                            value={criteria.sessions}
                            onChange={(e) => handleInputChange(tier, "sessions", e.target.value)}
                            className="w-20"
                          />
                        ) : (
                          criteria.sessions
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={criteria.rating}
                            onChange={(e) => handleInputChange(tier, "rating", e.target.value)}
                            className="w-20"
                          />
                        ) : (
                          criteria.rating.toFixed(1)
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="number"
                            min="0"
                            value={criteria.programsCreated}
                            onChange={(e) => handleInputChange(tier, "programsCreated", e.target.value)}
                            className="w-20"
                          />
                        ) : (
                          criteria.programsCreated
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission-rates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Rates</CardTitle>
              <CardDescription>Set the commission percentage for each mentor tier.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Tier</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Commission Rate (%)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">The percentage of program fees that mentors receive.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        School Program Access
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Whether mentors at this tier can apply to teach school programs.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(tierCriteria).map(([tier, criteria]) => (
                    <TableRow key={tier}>
                      <TableCell className="font-medium capitalize">{tier}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <div className="flex items-center">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={criteria.commission}
                              onChange={(e) => handleInputChange(tier, "commission", e.target.value)}
                              className="w-20"
                            />
                            <span className="ml-2">%</span>
                          </div>
                        ) : (
                          `${criteria.commission}%`
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Switch
                            checked={criteria.schoolProgramAccess}
                            onCheckedChange={(checked) => handleInputChange(tier, "schoolProgramAccess", checked)}
                          />
                        ) : criteria.schoolProgramAccess ? (
                          "Yes"
                        ) : (
                          "No"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referral-program" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral Program Settings</CardTitle>
              <CardDescription>Configure the referral bonuses for each mentor tier.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Tier</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Referral Bonus ($)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                The amount mentors receive when they successfully refer a new mentor.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(tierCriteria).map(([tier, criteria]) => (
                    <TableRow key={tier}>
                      <TableCell className="font-medium capitalize">{tier}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <div className="flex items-center">
                            <span className="mr-2">$</span>
                            <Input
                              type="number"
                              min="0"
                              value={criteria.referralBonus}
                              onChange={(e) => handleInputChange(tier, "referralBonus", e.target.value)}
                              className="w-20"
                            />
                          </div>
                        ) : (
                          `$${criteria.referralBonus}`
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Referral Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referral-expiry">Referral Link Expiry (days)</Label>
                    <Input id="referral-expiry" type="number" min="0" defaultValue="30" disabled={!isEditing} />
                    <p className="text-sm text-muted-foreground">Number of days before a referral link expires.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referral-qualification">Qualification Period (days)</Label>
                    <Input id="referral-qualification" type="number" min="0" defaultValue="60" disabled={!isEditing} />
                    <p className="text-sm text-muted-foreground">
                      Days a referred mentor must be active before bonus is paid.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-referrals">Maximum Referrals Per Month</Label>
                    <Input id="max-referrals" type="number" min="0" defaultValue="10" disabled={!isEditing} />
                    <p className="text-sm text-muted-foreground">Maximum number of successful referrals per month.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="double-bonus-threshold">Double Bonus Threshold</Label>
                    <Input id="double-bonus-threshold" type="number" min="0" defaultValue="5" disabled={!isEditing} />
                    <p className="text-sm text-muted-foreground">
                      Number of successful referrals to qualify for double bonus.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="enable-double-bonus" defaultChecked disabled={!isEditing} />
                  <Label htmlFor="enable-double-bonus">Enable Double Bonus for High Performers</Label>
                </div>
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end">
                <p className="text-sm text-muted-foreground mr-auto">
                  Changes will apply to all current and future mentors.
                </p>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
