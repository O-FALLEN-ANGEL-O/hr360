"use client"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { Badge } from "@/components/ui/badge"

const data = [
  { subject: "React", current: 120, required: 110, fullMark: 150 },
  { subject: "Node.js", current: 70, required: 98, fullMark: 150 },
  { subject: "TypeScript", current: 86, required: 130, fullMark: 150 },
  { subject: "SQL", current: 99, required: 100, fullMark: 150 },
  { subject: "AWS", current: 65, required: 85, fullMark: 150 },
  { subject: "Project Mgt", current: 110, required: 90, fullMark: 150 },
]

const suggestedCourses = [
    { skill: "Node.js", course: "Advanced Node.js and Express", platform: "Udemy", status: "Not Started" },
    { skill: "TypeScript", course: "Mastering TypeScript", platform: "Coursera", status: "In Progress" },
    { skill: "AWS", course: "AWS Certified Developer", platform: "A Cloud Guru", status: "Not Started"},
]

export default function SkillGapPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Skill Gap Map"
        description="A visual radar of your current skills versus the skills required for your career goals."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Developer Skill Analysis</CardTitle>
                    <CardDescription>Comparison for a Senior Full-Stack role.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis />
                        <Tooltip contentStyle={{
                            background: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "var(--radius)"
                        }} />
                        <Legend />
                        <Radar name="Current Skills" dataKey="current" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                        <Radar name="Required Skills" dataKey="required" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.6} />
                    </RadarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>Learning Recommendations</CardTitle>
                    <CardDescription>Courses to bridge your skill gaps.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {suggestedCourses.map((item, index) => (
                            <li key={index} className="flex flex-col p-3 rounded-md border bg-muted/20">
                                <span className="font-semibold">{item.course}</span>
                                <span className="text-sm text-muted-foreground">For: <Badge variant="secondary">{item.skill}</Badge> on <Badge variant="outline">{item.platform}</Badge></span>
                                <span className="text-xs mt-2">Status: {item.status}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
