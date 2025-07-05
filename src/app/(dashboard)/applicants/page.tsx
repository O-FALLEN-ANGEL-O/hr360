
"use client"

import { useState, useEffect, useRef } from "react"
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
import { MoreHorizontal, User, Mail, Loader2, Link2, Power } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const initialApplicants = [
  { id: 1, name: "Charlie Davis", email: "charlie.d@example.com", status: "Pending Review", role: "Chat Support", source: "Email" },
  { id: 2, name: "Diana Smith", email: "diana.s@example.com", status: "Interview Scheduled", role: "Product Manager", source: "LinkedIn" },
  { id: 3, name: "Ethan Johnson", email: "ethan.j@example.com", status: "Rejected", role: "Data Analyst", source: "Naukri" },
  { id: 4, name: "Fiona White", email: "fiona.w@example.com", status: "Pending Review", role: "UX Designer", source: "Email" },
  { id: 5, name: "George Black", email: "george.b@example.com", status: "Offer Extended", role: "Backend Developer", source: "LinkedIn" },
];

const newScannedApplicantsPool = [
    { id: 6, name: "Hannah Lee", email: "h.lee@inbox.com", status: "New", role: "Data Scientist", source: "Email" },
    { id: 7, name: "Ivan Rodriguez", email: "ivan.r@inbox.com", status: "New", role: "Backend Developer", source: "Walk-in" },
    { id: 9, name: "Kevin Scott", email: "k.scott@example.com", status: "New", role: "QA Engineer", source: "LinkedIn" },
    { id: 10, name: "Laura Green", email: "laura.g@example.com", status: "New", role: "Marketing Intern", source: "Naukri" },
    { id: 11, name: "Mike Adams", email: "m.adams@example.com", status: "New", role: "DevOps Engineer", source: "Email" },
];


type Applicant = typeof initialApplicants[0];
type Status = "Pending Review" | "Interview Scheduled" | "Rejected" | "Offer Extended" | "New";


export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [isScanning, setIsScanning] = useState(false);
  const [isDriveMode, setIsDriveMode] = useState(false);
  const driveModeInterval = useRef<NodeJS.Timeout | null>(null);
  const availableApplicants = useRef([...newScannedApplicantsPool]);
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

  const handleFetchNewApplicants = () => {
    if (availableApplicants.current.length === 0) {
        toast({ title: "No More Applicants", description: "The pool of new applicants is empty."});
        if(isDriveMode) setIsDriveMode(false);
        return;
    }
    
    setIsScanning(true);
    toast({
        title: "Fetching New Applicants...",
        description: "Scanning all sources for new candidates.",
    });

    setTimeout(() => {
        const newApplicant = availableApplicants.current.pop();
        if(newApplicant) {
            setApplicants(prev => [newApplicant, ...prev]);
             toast({
                title: "Scan Complete!",
                description: `1 new applicant has been added.`,
            });
        }
        setIsScanning(false);
    }, 1500);
  }

  useEffect(() => {
    if (isDriveMode) {
        driveModeInterval.current = setInterval(handleFetchNewApplicants, 5000); // Fetch every 5 seconds
    } else {
        if(driveModeInterval.current) {
            clearInterval(driveModeInterval.current);
        }
    }

    return () => {
        if(driveModeInterval.current) {
            clearInterval(driveModeInterval.current);
        }
    }
  }, [isDriveMode]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/register`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Walk-in registration link copied to clipboard.",
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Candidate Management"
        description="Review and manage all candidates in the pipeline."
      />
       <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
            <div className="flex items-center space-x-2">
                <Switch id="drive-mode" checked={isDriveMode} onCheckedChange={setIsDriveMode} />
                <Label htmlFor="drive-mode" className="flex items-center gap-2">
                    <Power className={`h-4 w-4 transition-colors ${isDriveMode ? 'text-red-500' : 'text-muted-foreground'}`} />
                    Hiring Drive Mode
                </Label>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleCopyLink}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Copy Walk-in Kiosk Link
                </Button>
                <Button onClick={handleFetchNewApplicants} disabled={isScanning || isDriveMode}>
                    {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                    Fetch New Applicants
                </Button>
            </div>
       </div>
      <Card>
        <CardHeader>
          <CardTitle>All Applicants</CardTitle>
          <CardDescription>A list of all candidates in the pipeline from all sources.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate Name</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden sm:table-cell">Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant.id} className={cn("transition-colors", {"bg-primary/5": applicant.status === "New"})} >
                  <TableCell className="font-medium">{applicant.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{applicant.role}</TableCell>
                   <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{applicant.source}</Badge>
                  </TableCell>
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
