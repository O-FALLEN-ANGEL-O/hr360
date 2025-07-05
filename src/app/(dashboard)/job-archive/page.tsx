"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { MoreHorizontal, Share2, Send, PlusCircle } from "lucide-react"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const initialJobArchive = [
  { id: 1, title: "Senior Product Manager", company: "Innovate Inc.", source: "LinkedIn", match: 92, status: "Interview" },
  { id: 2, title: "UX/UI Designer", company: "Creative Solutions", source: "Naukri", match: 85, status: "Sent" },
  { id: 3, title: "Backend Developer", company: "Tech Giant", source: "Inbox", match: 95, status: "Shortlisted" },
  { id: 4, title: "Data Scientist", company: "DataDriven Co.", source: "Internshala", match: 98, status: "Hired" },
  { id: 5, title: "Marketing Specialist", company: "AdVantage", source: "Inbox", match: 78, status: "Sent" },
  { id: 6, title: "Frontend Engineer", company: "WebWeavers", source: "LinkedIn", match: 88, status: "Sent" },
  { id: 7, title: "DevOps Engineer", company: "CloudNet", source: "Inbox", match: 91, status: "Interview" },
  { id: 8, title: "HR Business Partner", company: "PeopleFirst", source: "Naukri", match: 82, status: "Rejected" },
];

type Job = typeof initialJobArchive[0];

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  company: z.string().min(2, "Company name is required."),
  source: z.enum(["LinkedIn", "Naukri", "Inbox", "Internshala", "Other"]),
  status: z.enum(["Sent", "Interview", "Shortlisted", "Hired", "Rejected"]),
  match: z.coerce.number().min(0).max(100),
});

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
  const [jobs, setJobs] = useState<Job[]>(initialJobArchive);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: "",
      source: "Other",
      status: "Sent",
      match: 80,
    },
  });

  function onSubmit(values: z.infer<typeof jobSchema>) {
    const newJob: Job = {
      id: jobs.length + 1,
      ...values,
    };
    setJobs(prev => [newJob, ...prev]);
    toast({
      title: "Job Archived!",
      description: `"${values.title}" has been added to the archive.`,
    });
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Job Archive"
        description="A history of scanned job emails with details and application status."
      />
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Archive New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Archive New Job</DialogTitle>
                  <DialogDescription>
                    Manually add a job application to the archive.
                  </DialogDescription>
                </DialogHeader>
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="e.g., Senior Frontend Developer" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="company" render={({ field }) => (
                  <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="e.g., Acme Inc." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="source" render={({ field }) => (
                    <FormItem><FormLabel>Source</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="LinkedIn">LinkedIn</SelectItem><SelectItem value="Naukri">Naukri</SelectItem><SelectItem value="Inbox">Inbox</SelectItem><SelectItem value="Internshala">Internshala</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Sent">Sent</SelectItem><SelectItem value="Interview">Interview</SelectItem><SelectItem value="Shortlisted">Shortlisted</SelectItem><SelectItem value="Hired">Hired</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="match" render={({ field }) => (
                  <FormItem><FormLabel>Match %</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit">Archive Job</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
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
              {jobs.map((job) => (
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
