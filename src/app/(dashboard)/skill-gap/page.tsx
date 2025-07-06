"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Bot, User } from "lucide-react"

const skillData = [
  { subject: "Leadership", current: 75, required: 90 },
  { subject: "React", current: 95, required: 90 },
  { subject: "Node.js", current: 80, required: 85 },
  { subject: "System Design", current: 60, required: 80 },
  { subject: "Communication", current: 85, required: 95 },
  { subject: "Project Management", current: 70, required: 80 },
]

export default function SkillGapPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Skill Gap Map"
        description="A visual radar of current skills versus needed skills for a role."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Analysis Details</CardTitle>
                    <CardDescription>Comparing employee skills against role requirements.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">Employee</p>
                            <p className="font-medium">Diana Smith</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Bot className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">Target Role</p>
                            <p className="font-medium">Senior Product Manager</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skill Comparison Radar</CardTitle>
            <CardDescription>
              This chart visualizes the gap between current and required skill levels.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            {!mounted ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                  <Legend />
                  <Radar
                    name="Current Skills"
                    dataKey="current"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Required Skills"
                    dataKey="required"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
