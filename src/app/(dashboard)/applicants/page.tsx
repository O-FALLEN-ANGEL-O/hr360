
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
import { MoreHorizontal, User, PlusCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { NewApplicantForm } from "@/components/new-applicant-form"

const initialApplicants = [
  { id: 1, name: "Charlie Davis", email: "charlie.d@example.com", status: "Pending Review", role: "Chat Support" },
  { id: 2, name: "Diana Smith", email: "diana.s@example.com", status: "Interview Scheduled", role: "Product Manager" },
  { id: 3, name: "Ethan Johnson", email: "ethan.j@example.com", status: "Rejected", role: "Data Analyst" },
  { id: 4, name: "Fiona White", email: "fiona.w@example.com", status: "Pending Review", role: "UX Designer" },
  { id: 5, name: "George Black", email: "george.b@example.com", status: "Offer Extended", role: "Backend Developer" },
];

type Applicant = typeof initialApplicants[0];
type Status = "Pending Review" | "Interview Scheduled" | "Rejected" | "Offer Extended";


export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleAddApplicant = (data: { fullName: string, email: string }) => {
    const newId = applicants.length > 0 ? Math.max(...applicants.map(a => a.id)) + 1 : 1;
    const newApplicant = {
        id: newId,
        name: data.fullName,
        email: data.email,
        status: "Pending Review" as Status,
        role: "To Be Determined",
    };
    setApplicants(prev => [newApplicant, ...prev]);
    setIsDialogOpen(false);
    toast({
        title: "Applicant Added!",
        description: `${data.fullName} has been added to the system with ID APP-00${newId}.`
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Candidate Management"
        description="Review and manage all candidates in the pipeline."
      />
       <div className="flex justify-end">
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
           <DialogTrigger asChild>
             <Button><PlusCircle className="mr-2 h-4 w-4" /> Register Walk-in Applicant</Button>
           </DialogTrigger>
           <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Applicant Registration</DialogTitle>
                <DialogDescription>
                    Use this form to register a new walk-in applicant. The AI will help you fill out the details.
                </DialogDescription>
              </DialogHeader>
              <NewApplicantForm onApplicantAdd={handleAddApplicant} />
           </DialogContent>
         </Dialog>
       </div>
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
