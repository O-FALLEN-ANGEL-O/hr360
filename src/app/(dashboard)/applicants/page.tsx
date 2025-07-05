
"use client"

import { useState } from "react"
import Link from "next/link"
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
import { MoreHorizontal, Mail, Check, X, CalendarPlus, Clipboard, User, FileText, Keyboard } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

const initialApplicants = [
  { id: 1, name: "Charlie Davis", email: "charlie.d@example.com", status: "Pending Review", role: "Chat Support", aptitudeScore: "4/5", typingWPM: 75, typingAccuracy: 96 },
  { id: 2, name: "Diana Smith", email: "diana.s@example.com", status: "Interview Scheduled", role: "Product Manager", aptitudeScore: "5/5", typingWPM: null, typingAccuracy: null },
  { id: 3, name: "Ethan Johnson", email: "ethan.j@example.com", status: "Rejected", role: "Data Analyst", aptitudeScore: "2/5", typingWPM: null, typingAccuracy: null },
  { id: 4, name: "Fiona White", email: "fiona.w@example.com", status: "Pending Review", role: "UX Designer", aptitudeScore: "3/5", typingWPM: null, typingAccuracy: null },
  { id: 5, name: "George Black", email: "george.b@example.com", status: "Offer Extended", role: "Backend Developer", aptitudeScore: "5/5", typingWPM: null, typingAccuracy: null },
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
    let url = '';
    let message = '';

    if (action === "Send Aptitude Test") {
      url = applicant.role
        ? `${window.location.origin}/assessment?role=${encodeURIComponent(applicant.role)}`
        : `${window.location.origin}/assessment`;
      message = "Aptitude test link copied to clipboard."
    } else if (action === "Send Typing Test") {
      url = `${window.location.origin}/typing-test?id=${applicant.id}`;
      message = "Typing test link copied to clipboard.";
    }
    
    if(url) {
        navigator.clipboard.writeText(url);
        toast({
            title: "Link Copied!",
            description: `${message} Send it to ${applicant.name}.`
        });
    }
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
        title="Candidate Management"
        description="Review and manage candidates who have applied or completed assessments."
      />
      <Card>
        <CardHeader>
          <CardTitle>All Applicants</CardTitle>
          <CardDescription>A list of all candidates in the pipeline.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate Name</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell className="font-medium">{applicant.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{applicant.role}</TableCell>
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
                        <DropdownMenuItem asChild>
                           <Link href={`/applicants/${applicant.id}`}>
                               <User className="mr-2 h-4 w-4" /> View Profile
                           </Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleAction(applicant, 'Send Aptitude Test')}>
                            <FileText className="mr-2 h-4 w-4" /> Send Aptitude Test
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleAction(applicant, 'Send Typing Test')}>
                            <Keyboard className="mr-2 h-4 w-4" /> Send Typing Test
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(applicant.id, 'Interview Scheduled')}>
                            <CalendarPlus className="mr-2 h-4 w-4" /> Schedule Interview
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
