
"use client"

import { useState } from "react"
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
import { MoreHorizontal, Mail, Check, X, CalendarPlus, Clipboard } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

const initialApplicants = [
  { id: 1, name: "Charlie Davis", email: "charlie.d@example.com", testScore: "4/5", status: "Pending Review", role: "Software Engineer" },
  { id: 2, name: "Diana Smith", email: "diana.s@example.com", testScore: "5/5", status: "Interview Scheduled", role: "Product Manager" },
  { id: 3, name: "Ethan Johnson", email: "ethan.j@example.com", testScore: "2/5", status: "Rejected", role: "Data Analyst" },
  { id: 4, name: "Fiona White", email: "fiona.w@example.com", testScore: "3/5", status: "Pending Review", role: "UX Designer" },
  { id: 5, name: "George Black", email: "george.b@example.com", testScore: "5/5", status: "Offer Extended", role: "Backend Developer" },
];

type Applicant = typeof initialApplicants[0];
type Status = "Pending Review" | "Interview Scheduled" | "Rejected" | "Offer Extended";


export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const { toast } = useToast();

  const getStatusBadgeVariant = (status: Status) => {
    switch (status) {
      case "Pending Review": return "secondary";
      case "Interview Scheduled": return "default";
      case "Rejected": return "destructive";
      case "Offer Extended": return "outline";
      default: return "secondary";
    }
  };

  const handleAction = (applicant: Applicant, action: string) => {
    if (action === "Send Assessment") {
      const url = applicant.role
        ? `${window.location.origin}/assessment?role=${encodeURIComponent(applicant.role)}`
        : `${window.location.origin}/assessment`;
      navigator.clipboard.writeText(url);
      toast({
          title: "Assessment Link Copied!",
          description: `The link has been copied to your clipboard. Send it to ${applicant.name}.`
      });
      return;
    }
    
    toast({
        title: `Action: ${action}`,
        description: `An email has been sent to ${applicant.name}.`
    });
  }

  const handleStatusChange = (applicantId: number, newStatus: Status) => {
    setApplicants(
      applicants.map((app) =>
        app.id === applicantId ? { ...app, status: newStatus } : app
      )
    );
    
    if (newStatus === 'Interview Scheduled') {
        toast({
            title: "Status Updated!",
            description: `Applicant status changed to ${newStatus}. A calendar invite has been sent.`
        });
    } else {
        toast({
            title: "Status Updated!",
            description: `Applicant status changed to ${newStatus}.`
        });
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Candidate Assessments"
        description="Review and manage candidates who have completed their initial assessment."
      />
      <Card>
        <CardHeader>
          <CardTitle>Applicant Submissions</CardTitle>
          <CardDescription>A list of all candidates who have completed the assessment.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Aptitude Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell className="font-medium">{applicant.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{applicant.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{applicant.testScore}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(applicant.status)} className={applicant.status === "Offer Extended" ? "bg-accent text-accent-foreground" : ""}>
                        {applicant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => handleAction(applicant, 'Send Assessment')}>
                            <Clipboard className="mr-2 h-4 w-4" /> Send Assessment
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(applicant.id, 'Interview Scheduled')}>
                            <CalendarPlus className="mr-2 h-4 w-4" /> Schedule Interview
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleAction(applicant, 'Send Follow-up')}>
                            <Mail className="mr-2 h-4 w-4" /> Send Follow-up
                        </DropdownMenuItem>
                         <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleStatusChange(applicant.id, 'Rejected')}>
                            <X className="mr-2 h-4 w-4" /> Reject Candidate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
