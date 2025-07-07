
"use client"

import { useState, useEffect, useCallback } from "react"
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
import { MoreHorizontal, UploadCloud, PlusCircle, Building, Mail, Briefcase, File, CalendarClock, UserX, Loader2 } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { createClient } from '@/lib/supabase/client'
import type { College, Applicant } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

const collegeSchema = z.object({
  name: z.string().min(5, "College name is required."),
  location: z.string().min(3, "Location is required."),
  contact_email: z.string().email("A valid email is required."),
});

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Confirmed": return "default";
    case "Invited": return "secondary";
    case "Screening": return "outline";
    case "Scheduled": return "default";
    default: return "secondary";
  }
};

const getApplicantStatusBadgeVariant = (status: Applicant['status']) => {
    switch (status) {
      case "Interview Scheduled": return "default";
      case "Offer Extended": return "default";
      case "Applied": return "secondary";
      case "Screening": return "outline";
      case "Rejected": return "destructive";
      default: return "secondary";
    }
};

export default function CampusHrPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<z.infer<typeof collegeSchema>>({
    resolver: zodResolver(collegeSchema),
    defaultValues: { name: "", location: "", contact_email: "" },
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const collegePromise = supabase.from('colleges').select('*');
    const applicantPromise = supabase.from('applicants').select('*').ilike('role', '%Intern%');

    const [collegeRes, applicantRes] = await Promise.all([collegePromise, applicantPromise]);

    if(collegeRes.error) console.error(collegeRes.error);
    else setColleges(collegeRes.data || []);

    if(applicantRes.error) console.error(applicantRes.error);
    else setApplicants(applicantRes.data || []);

    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  async function onSubmit(values: z.infer<typeof collegeSchema>) {
    const { data, error } = await supabase.from('colleges').insert([
      { ...values, status: 'Invited', resumes_received: 0 }
    ]).select();

    if (error) {
      toast({ title: "Error", description: "Failed to invite college.", variant: "destructive"});
    } else {
      setColleges(prev => [data[0], ...prev]);
      toast({ title: "College Invited!", description: `An invitation has been sent to ${values.name}.` });
      form.reset();
      setIsDialogOpen(false);
    }
  }

  const handleApplicantStatusChange = async (applicantId: number, newStatus: Applicant['status']) => {
    const { error } = await supabase.from('applicants').update({ status: newStatus }).eq('id', applicantId);

    if (error) {
        toast({ title: "Error", description: "Could not update status.", variant: "destructive" });
    } else {
        setApplicants(applicants.map((app) => app.id === applicantId ? { ...app, status: newStatus } : app));
        const applicantName = applicants.find(app => app.id === applicantId)?.full_name;
        toast({ title: "Status Updated!", description: `${applicantName}'s status changed to ${newStatus}.` });
    }
  }

  const handleViewResume = (applicantName: string) => {
      toast({ title: "Viewing Resume", description: `Opening ${applicantName}'s resume in a new tab.` })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Campus Drive & Internship Aggregator"
        description="Invite colleges, manage campus drives, and track internship applicants."
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
            <CardHeader><CardTitle>Total Resumes Collected</CardTitle></CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-10 w-1/2" /> : <p className="text-4xl font-bold">{colleges.reduce((acc, c) => acc + c.resumes_received, 0)}</p>}
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Colleges Participating</CardTitle></CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-10 w-1/2" /> : <p className="text-4xl font-bold">{colleges.filter(c => c.status !== 'Invited').length}</p>}
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Intern Offers Made</CardTitle></CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-10 w-1/2" /> : <p className="text-4xl font-bold">{applicants.filter(a => a.status === 'Offer Extended').length}</p>}
            </CardContent>
            <CardFooter><p className="text-xs text-muted-foreground">This hiring season</p></CardFooter>
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
                     <FormField control={form.control} name="contact_email" render={({ field }) => (
                      <FormItem><FormLabel>Placement Cell Email</FormLabel><FormControl><Input type="email" placeholder="e.g., tpo@example.edu" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <DialogFooter>
                      <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Invite
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-40 w-full" /> : 
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
                  <TableCell><Badge variant={getStatusBadgeVariant(college.status)} className={cn({"bg-accent text-accent-foreground hover:bg-accent/80": college.status === 'Confirmed' || college.status === 'Scheduled'})}>{college.status}</Badge></TableCell>
                  <TableCell>{college.resumes_received}</TableCell>
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
          }
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Internship & Campus Applicants</CardTitle>
          <CardDescription>Manage candidates from campus drives and internship postings.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-40 w-full" /> :
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Role Applied For</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell className="font-medium">{applicant.full_name}</TableCell>
                  <TableCell>{applicant.college}</TableCell>
                  <TableCell>{applicant.role}</TableCell>
                   <TableCell>
                    <Badge variant={getApplicantStatusBadgeVariant(applicant.status)} className={cn({"bg-accent text-accent-foreground hover:bg-accent/80": applicant.status === 'Offer Extended'})}>
                        {applicant.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewResume(applicant.full_name)}>
                                <File className="mr-2 h-4 w-4" /> View Resume
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleApplicantStatusChange(applicant.id, 'Interview Scheduled')}>
                                <CalendarClock className="mr-2 h-4 w-4" /> Schedule Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleApplicantStatusChange(applicant.id, 'Rejected')}>
                                <UserX className="mr-2 h-4 w-4" /> Reject Candidate
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          }
        </CardContent>
      </Card>
    </div>
  )
}
