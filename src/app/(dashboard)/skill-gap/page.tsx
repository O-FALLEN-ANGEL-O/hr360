"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/hooks/use-toast"
import { Briefcase } from "lucide-react"

const initialInternships = [
  { id: 1, title: "Software Engineering Intern", company: "Tech Giant", source: "LinkedIn", url: "#" },
  { id: 2, title: "Product Management Intern", company: "Innovate Inc.", source: "Naukri", url: "#" },
  { id: 3, title: "Data Science Intern", company: "DataDriven Co.", source: "Internshala", url: "#" },
  { id: 4, title: "UX/UI Design Intern", company: "Creative Solutions", source: "LinkedIn", url: "#" },
  { id: 5, title: "Marketing Intern", company: "AdVantage", source: "Naukri", url: "#" },
  { id: 6, title: "Backend Developer Intern", company: "CloudNet", source: "Internshala", url: "#" },
];

export default function InternshipAggregatorPage() {
    const { toast } = useToast();

    const handleApply = (title: string, company: string) => {
        toast({
            title: "Application Sent!",
            description: `Your application for the ${title} role at ${company} has been submitted.`
        });
    }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Internship Aggregator"
        description="Internship postings pulled from LinkedIn, Naukri, and Internshala."
      />
      <Card>
        <CardHeader>
          <CardTitle>Available Internships</CardTitle>
          <CardDescription>Browse the latest internship opportunities from top platforms.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Internship Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialInternships.map((internship) => (
                <TableRow key={internship.id}>
                  <TableCell className="font-medium">{internship.title}</TableCell>
                  <TableCell>{internship.company}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{internship.source}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleApply(internship.title, internship.company)}>
                        <Briefcase className="mr-2 h-4 w-4" />
                        Apply Now
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
