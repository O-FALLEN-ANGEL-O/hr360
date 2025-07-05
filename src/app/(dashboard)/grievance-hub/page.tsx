"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { PlusCircle } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const ticketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.enum(["Payroll", "Facilities", "Interpersonal", "Policy", "Feedback", "Other"]),
  anonymous: z.boolean().default(false).optional(),
});

const initialTickets = [
  { id: "TKT-001", title: "Issue with payslip calculation", category: "Payroll", assignedTo: "HR", status: "In Progress", created: "2024-05-20" },
  { id: "TKT-002", title: "Request for workplace adjustment", category: "Facilities", assignedTo: "Legal", status: "Open", created: "2024-05-18" },
  { id: "TKT-003", title: "Conflict with team member", category: "Interpersonal", assignedTo: "HR", status: "Resolved", created: "2024-05-15" },
  { id: "TKT-004", title: "Anonymous feedback on management", category: "Feedback", assignedTo: "HR", status: "Open", created: "2024-05-21" },
  { id: "TKT-005", title: "Policy clarification needed", category: "Policy", assignedTo: "Legal", status: "Closed", created: "2024-05-10" },
];

type Ticket = typeof initialTickets[0];

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
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Other",
      anonymous: false,
    },
  });

  function onSubmit(values: z.infer<typeof ticketSchema>) {
    const newTicket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      title: values.title,
      category: values.category,
      assignedTo: values.category === 'Policy' || values.category === 'Facilities' ? "Legal" : "HR",
      status: "Open",
      created: new Date().toISOString().split('T')[0],
    };
    setTickets(prev => [newTicket, ...prev]);
    toast({
      title: "Ticket Submitted!",
      description: `Your ticket ${newTicket.id} has been created.`,
    });
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Grievance Hub"
        description="A secure hub for anonymous or internal tickets with HR/legal responders and SLA tracking."
      />
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Submit a Grievance</DialogTitle>
                  <DialogDescription>
                    Your submission can be anonymous. Please provide as much detail as possible.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief title of the issue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the issue in detail" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Payroll">Payroll</SelectItem>
                            <SelectItem value="Interpersonal">Interpersonal</SelectItem>
                            <SelectItem value="Policy">Policy</SelectItem>
                            <SelectItem value="Facilities">Facilities</SelectItem>
                            <SelectItem value="Feedback">Feedback</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="anonymous"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 pt-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} id="anonymous" />
                        </FormControl>
                        <label htmlFor="anonymous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Submit Anonymously
                        </label>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Submit Ticket</Button>
                </DialogFooter>
              </form>
            </Form>
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
