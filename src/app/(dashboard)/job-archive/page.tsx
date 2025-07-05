
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
import { MoreHorizontal, PlusCircle, Rss, Users, FileEdit, Archive } from "lucide-react"
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
import { cn } from "@/lib/utils"

const initialJobPostings = [
  { id: 1, title: "Senior Product Manager", department: "Product", location: "San Francisco, CA", source: "LinkedIn", applicants: 78, status: "Interviewing" },
  { id: 2, title: "UX/UI Designer", department: "Design", location: "New York, NY", source: "Company Website", applicants: 124, status: "Screening" },
  { id: 3, title: "Backend Developer", department: "Engineering", location: "Remote", source: "LinkedIn", applicants: 210, status: "Screening" },
  { id: 4, title: "Data Scientist", department: "Analytics", location: "London, UK", source: "Indeed", applicants: 95, status: "Offer Extended" },
  { id: 5, title: "Marketing Specialist", department: "Marketing", location: "Singapore", source: "Naukri", applicants: 150, status: "Accepting Applications" },
  { id: 6, title: "Frontend Engineer", department: "Engineering", location: "Remote", source: "Company Website", applicants: 180, status: "Interviewing" },
  { id: 7, title: "DevOps Engineer", department: "Infrastructure", location: "Berlin, DE", source: "LinkedIn", applicants: 65, status: "Accepting Applications" },
  { id: 8, title: "HR Business Partner", department: "Human Resources", location: "New York, NY", source: "Indeed", applicants: 45, status: "Closed" },
];

type Job = typeof initialJobPostings[0];

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  department: z.string().min(2, "Department is required."),
  location: z.string().min(2, "Location is required."),
  source: z.enum(["LinkedIn", "Company Website", "Indeed", "Naukri", "Other"]),
  status: z.enum(["Accepting Applications", "Screening", "Interviewing", "Offer Extended", "Closed"]),
});

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Interviewing": return "default";
    case "Accepting Applications": return "secondary";
    case "Screening": return "outline";
    case "Offer Extended": return "default";
    case "Closed": return "destructive";
    default: return "secondary";
  }
};

export default function JobArchivePage() {
  const [postings, setPostings] = useState<Job[]>(initialJobPostings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      source: "Other",
      status: "Accepting Applications",
    },
  });

  function onSubmit(values: z.infer<typeof jobSchema>) {
    const newJob: Job = {
      id: postings.length + 1,
      ...values,
      applicants: 0,
    };
    setPostings(prev => [newJob, ...prev]);
    toast({
      title: "Job Added!",
      description: `"${values.title}" has been added to the job board.`,
    });
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Live Job Postings"
        description="Track all open positions your company has posted across different platforms."
      />
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Job Posting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Add New Job Posting</DialogTitle>
                  <DialogDescription>
                    Manually add a job posting to the board.
                  </DialogDescription>
                </DialogHeader>
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="e.g., Senior Frontend Developer" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="department" render={({ field }) => (
                      <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="e.g., Engineering" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="location" render={({ field }) => (
                      <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Remote" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="source" render={({ field }) => (
                    <FormItem><FormLabel>Source</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="LinkedIn">LinkedIn</SelectItem><SelectItem value="Company Website">Company Website</SelectItem><SelectItem value="Indeed">Indeed</SelectItem><SelectItem value="Naukri">Naukri</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Accepting Applications">Accepting Applications</SelectItem><SelectItem value="Screening">Screening</SelectItem><SelectItem value="Interviewing">Interviewing</SelectItem><SelectItem value="Offer Extended">Offer Extended</SelectItem><SelectItem value="Closed">Closed</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                </div>
                <DialogFooter>
                  <Button type="submit">Add Posting</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Rss className="h-5 w-5" /> All Company Job Postings</CardTitle>
          <CardDescription>This feed shows all positions currently managed by HR.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden sm:table-cell">Source</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {postings.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{job.department}</TableCell>
                  <TableCell className="hidden md:table-cell">{job.location}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{job.source}</Badge>
                  </TableCell>
                  <TableCell>{job.applicants}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(job.status)} className={cn({"bg-accent text-accent-foreground hover:bg-accent/80": job.status === 'Offer Extended'})}>
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
                          <Users className="mr-2 h-4 w-4" />
                          View Applicants
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileEdit className="mr-2 h-4 w-4" />
                          Edit Posting
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Archive className="mr-2 h-4 w-4" />
                          Close Posting
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
