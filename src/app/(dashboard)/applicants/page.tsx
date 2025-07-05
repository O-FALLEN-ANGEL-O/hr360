
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
import { MoreHorizontal, User, Mail, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const initialApplicants = [
  { id: 1, name: "Charlie Davis", email: "charlie.d@example.com", status: "Pending Review", role: "Chat Support" },
  { id: 2, name: "Diana Smith", email: "diana.s@example.com", status: "Interview Scheduled", role: "Product Manager" },
  { id: 3, name: "Ethan Johnson", email: "ethan.j@example.com", status: "Rejected", role: "Data Analyst" },
  { id: 4, name: "Fiona White", email: "fiona.w@example.com", status: "Pending Review", role: "UX Designer" },
  { id: 5, name: "George Black", email: "george.b@example.com", status: "Offer Extended", role: "Backend Developer" },
];

const newScannedApplicants = [
    { id: 6, name: "Hannah Lee", email: "h.lee@inbox.com", status: "New", role: "Data Scientist" },
    { id: 7, name: "Ivan Rodriguez", email: "ivan.r@inbox.com", status: "New", role: "Backend Developer" },
];


type Applicant = typeof initialApplicants[0];
type Status = "Pending Review" | "Interview Scheduled" | "Rejected" | "Offer Extended" | "New";


export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const getStatusBadgeVariant = (status: Status) => {
    switch (status) {
      case "Pending Review": return "secondary";
      case "Interview Scheduled": return "default";
      case "Rejected": return "destructive";
      case "Offer Extended": return "outline";
      case "New": return "default";
      default: return "secondary";
    }
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    toast({
        title: "Scanning Inbox...",
        description: "Looking for new applications.",
    });

    setTimeout(() => {
        setApplicants(prev => [...newScannedApplicants, ...prev]);
        setIsScanning(false);
        toast({
            title: "Scan Complete!",
            description: `${newScannedApplicants.length} new applicants have been added.`,
        });
    }, 2500);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Candidate Management"
        description="Review and manage all candidates in the pipeline."
      />
       <div className="flex justify-end">
          <Button onClick={handleSimulateScan} disabled={isScanning}>
            {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
            Simulate Inbox Scan
          </Button>
       </div>
      <Card>
        <CardHeader>
          <CardTitle>All Applicants</CardTitle>
          <CardDescription>A list of all candidates in the pipeline, including newly scanned applications.</CardDescription>
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
                <TableRow key={applicant.id} className={applicant.status === "New" ? "bg-primary/5" : ""}>
                  <TableCell className="font-medium">{applicant.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{applicant.role}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(applicant.status as Status)} className={cn(
                        {"bg-accent text-accent-foreground": applicant.status === "Offer Extended"},
                        {"bg-blue-500 hover:bg-blue-600 text-white": applicant.status === "New"}
                    )}>
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

    