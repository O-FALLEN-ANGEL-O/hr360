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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { MoreHorizontal, Share2, Send } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const jobArchive = [
  { id: 1, title: "Senior Product Manager", company: "Innovate Inc.", source: "LinkedIn", match: 92, status: "Interview" },
  { id: 2, title: "UX/UI Designer", company: "Creative Solutions", source: "Naukri", match: 85, status: "Sent" },
  { id: 3, title: "Backend Developer", company: "Tech Giant", source: "Inbox", match: 95, status: "Shortlisted" },
  { id: 4, title: "Data Scientist", company: "DataDriven Co.", source: "Internshala", match: 98, status: "Hired" },
  { id: 5, title: "Marketing Specialist", company: "AdVantage", source: "Inbox", match: 78, status: "Sent" },
  { id: 6, title: "Frontend Engineer", company: "WebWeavers", source: "LinkedIn", match: 88, status: "Sent" },
  { id: 7, title: "DevOps Engineer", company: "CloudNet", source: "Inbox", match: 91, status: "Interview" },
  { id: 8, title: "HR Business Partner", company: "PeopleFirst", source: "Naukri", match: 82, status: "Rejected" },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Interview": return "default";
    case "Sent": return "secondary";
    case "Shortlisted": return "outline";
    case "Hired": return "default";
    case "Rejected": return "destructive";
    default: return "secondary";
  }
};

const getMatchBadgeClass = (match: number) => {
  if (match > 90) return "bg-green-500 text-white";
  if (match > 80) return "bg-blue-500 text-white";
  return "bg-yellow-500 text-black";
}

export default function JobArchivePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Job Archive"
        description="A history of scanned job emails with details and application status."
      />
      <Card>
        <CardHeader>
          <CardTitle>All Scanned Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead className="hidden sm:table-cell">Source</TableHead>
                <TableHead>Match %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobArchive.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{job.company}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{job.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getMatchBadgeClass(job.match)}>
                      {job.match}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(job.status)} className={job.status === 'Hired' ? 'bg-accent text-accent-foreground' : ''}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Re-apply
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
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
