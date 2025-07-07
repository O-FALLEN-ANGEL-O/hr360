
"use client"

import { useState, useEffect } from "react"
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
import { supabase } from "@/lib/supabaseClient"
import type { Job } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function InternshipAggregatorPage() {
    const { toast } = useToast();
    const [internships, setInternships] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchInternships = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .ilike('title', '%Intern%');

        if(error) {
          console.error("Error fetching internships:", error);
          toast({ title: "Error", description: "Could not fetch internships", variant: "destructive" });
        } else {
          setInternships(data || []);
        }
        setIsLoading(false);
      }
      fetchInternships();
    }, [toast]);

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
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Internship Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {internships.map((internship) => (
                  <TableRow key={internship.id}>
                    <TableCell className="font-medium">{internship.title}</TableCell>
                    <TableCell>{internship.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{internship.source}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleApply(internship.title, internship.department)}>
                          <Briefcase className="mr-2 h-4 w-4" />
                          Apply Now
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

    