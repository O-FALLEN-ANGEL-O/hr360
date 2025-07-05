
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { MoreHorizontal, UploadCloud, PlusCircle, Building, Mail, Briefcase } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const collegeSchema = z.object({
  name: z.string().min(5, "College name is required."),
  location: z.string().min(3, "Location is required."),
  contactEmail: z.string().email("A valid email is required."),
});

const initialColleges = [
  { id: 1, name: "National Institute of Technology, Trichy", location: "Tiruchirappalli, TN", status: "Invited", resumes: 124 },
  { id: 2, name: "Indian Institute of Technology, Bombay", location: "Mumbai, MH", status: "Confirmed", resumes: 258 },
  { id: 3, name: "Vellore Institute of Technology", location: "Vellore, TN", status: "Screening", resumes: 312 },
  { id: 4, name: "Indian Institute of Technology, Delhi", location: "New Delhi, DL", status: "Invited", resumes: 98 },
  { id: 5, name: "College of Engineering, Pune", location: "Pune, MH", status: "Scheduled", resumes: 150 },
];

const initialInternships = [
  { id: 1, title: "Software Engineering Intern", company: "Tech Giant", source: "LinkedIn", url: "#" },
  { id: 2, title: "Product Management Intern", company: "Innovate Inc.", source: "Naukri", url: "#" },
  { id: 3, title: "Data Science Intern", company: "DataDriven Co.", source: "Internshala", url: "#" },
  { id: 4, title: "UX/UI Design Intern", company: "Creative Solutions", source: "LinkedIn", url: "#" },
  { id: 5, title: "Marketing Intern", company: "AdVantage", source: "Naukri", url: "#" },
  { id: 6, title: "Backend Developer Intern", company: "CloudNet", source: "Internshala", url: "#" },
];


type College = typeof initialColleges[0];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Confirmed": return "default";
    case "Invited": return "secondary";
    case "Screening": return "outline";
    case "Scheduled": return "default";
    default: return "secondary";
  }
};

export default function CampusHrPage() {
  const [colleges, setColleges] = useState<College[]>(initialColleges);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof collegeSchema>>({
    resolver: zodResolver(collegeSchema),
    defaultValues: { name: "", location: "", contactEmail: "" },
  });
  
  const handleApply = (title: string, company: string) => {
    toast({
        title: "Application Sent!",
        description: `Your application for the ${title} role at ${company} has been submitted.`
    });
  }

  function onSubmit(values: z.infer<typeof collegeSchema>) {
    const newCollege: College = {
      id: colleges.length + 1,
      name: values.name,
      location: values.location,
      status: "Invited",
      resumes: 0,
    };
    setColleges(prev => [newCollege, ...prev]);
    toast({
      title: "College Invited!",
      description: `An invitation has been sent to ${values.name}.`,
    });
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Campus Drive & Internship Aggregator"
        description="Invite colleges, manage campus drives, and browse aggregated internship postings."
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
            <CardHeader><CardTitle>Total Resumes Collected</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold">{colleges.reduce((acc, c) => acc + c.resumes, 0)}</p></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Colleges Participating</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold">{colleges.filter(c => c.status !== 'Invited').length}</p></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Drive Success Rate</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold">85%</p></CardContent>
            <CardFooter><p className="text-xs text-muted-foreground">Shortlisted vs. Total</p></CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Partner Colleges</CardTitle>
            <CardDescription>A list of all colleges participating in the current drive.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><UploadCloud className="mr-2 h-4 w-4" /> Bulk Resume Upload</Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Invite College</Button></DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <DialogHeader><DialogTitle>Invite New College</DialogTitle></DialogHeader>
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>College Name</FormLabel><FormControl><Input placeholder="e.g., University of Example" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="location" render={({ field }) => (
                      <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., City, State" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="contactEmail" render={({ field }) => (
                      <FormItem><FormLabel>Placement Cell Email</FormLabel><FormControl><Input type="email" placeholder="e.g., tpo@example.edu" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <DialogFooter><Button type="submit">Send Invite</Button></DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College Name</TableHead>
                <TableHead className="hidden sm:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resumes Received</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colleges.map((college) => (
                <TableRow key={college.id}>
                  <TableCell className="font-medium">{college.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{college.location}</TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(college.status)} className={college.status === 'Confirmed' || college.status === 'Scheduled' ? 'bg-accent text-accent-foreground' : ''}>{college.status}</Badge></TableCell>
                  <TableCell>{college.resumes}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Actions</span></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Building className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                        <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Send Reminder</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Aggregated Internships</CardTitle>
          <CardDescription>Browse the latest internship opportunities from top platforms.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Internship Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialInternships.map((internship) => (
                <TableRow key={internship.id}>
                  <TableCell className="font-medium">{internship.title}</TableCell>
                  <TableCell>{internship.company}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{internship.source}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleApply(internship.title, internship.company)}>
                        <Briefcase className="mr-2 h-4 w-4" />
                        Apply Now
                    </Button>
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
