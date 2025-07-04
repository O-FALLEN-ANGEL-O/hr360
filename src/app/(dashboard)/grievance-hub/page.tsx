import { PageHeader } from "@/components/page-header"
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
import { PenSquare, PlusCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const tickets = [
  { id: "TKT-001", title: "Issue with payslip calculation", category: "Payroll", assignedTo: "HR", status: "In Progress", created: "2024-05-20" },
  { id: "TKT-002", title: "Request for workplace adjustment", category: "Facilities", assignedTo: "Legal", status: "Open", created: "2024-05-18" },
  { id: "TKT-003", title: "Conflict with team member", category: "Interpersonal", assignedTo: "HR", status: "Resolved", created: "2024-05-15" },
  { id: "TKT-004", title: "Anonymous feedback on management", category: "Feedback", assignedTo: "HR", status: "Open", created: "2024-05-21" },
  { id: "TKT-005", title: "Policy clarification needed", category: "Policy", assignedTo: "Legal", status: "Closed", created: "2024-05-10" },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "In Progress": return "default";
    case "Open": return "destructive";
    case "Resolved": return "outline";
    case "Closed": return "secondary";
    default: return "secondary";
  }
};


export default function GrievanceHubPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Grievance Hub"
        description="A secure hub for anonymous or internal tickets with HR/legal responders and SLA tracking."
      />
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Submit a Grievance</DialogTitle>
              <DialogDescription>
                Your submission can be anonymous. Please provide as much detail as possible.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" placeholder="Brief title of the issue" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                <Textarea id="description" placeholder="Describe the issue in detail" className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                 <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payroll">Payroll</SelectItem>
                    <SelectItem value="interpersonal">Interpersonal</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="facilities">Facilities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 col-start-2 col-span-3">
                  <Checkbox id="anonymous" />
                  <label htmlFor="anonymous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Submit Anonymously
                  </label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Open Tickets</CardTitle>
          <CardDescription>All active and past grievance tickets.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{ticket.title}</TableCell>
                  <TableCell className="hidden sm:table-cell"><Badge variant="outline">{ticket.category}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell">{ticket.assignedTo}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{ticket.created}</TableCell>
                   <TableCell>
                     <Button variant="outline" size="sm">View</Button>
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
