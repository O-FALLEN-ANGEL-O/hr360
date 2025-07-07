
"use client"

import { useState, useEffect } from "react"
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
import { MoreHorizontal, Upload, Eye, FileWarning, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import type { Document } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

const documentSchema = z.object({
  name: z.string().min(5, "Document name must be at least 5 characters."),
  type: z.enum(["Policy", "Training", "Manual"]),
  version: z.string().min(1, "Version is required."),
});

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Active": return "default";
    case "Draft": return "secondary";
    case "Archived": return "outline";
    default: return "secondary";
  }
};

export default function CompliancePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      type: "Policy",
      version: "v1.0",
    },
  });

  const fetchDocuments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('documents').select('*');
    if (error) {
      console.error(error);
      toast({ title: "Error", description: "Could not fetch documents", variant: "destructive" });
    } else {
      setDocuments(data || []);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function onSubmit(values: z.infer<typeof documentSchema>) {
    const { data, error } = await supabase.from('documents').insert([{
      ...values,
      status: "Draft",
      acknowledgement_percentage: 0,
    }]).select();
    
    if (error) {
      toast({ title: "Error", description: "Failed to add document", variant: "destructive" });
    } else {
      setDocuments(prev => [data[0], ...prev]);
      toast({ title: "Document Added!", description: `"${values.name}" has been added as a draft.` });
      form.reset();
      setIsDialogOpen(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Compliance Center"
        description="Manage HR documents, track acknowledgements, and monitor expiry dates."
      />
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Upload New Document</DialogTitle>
                  <DialogDescription>
                    Add a new compliance document to the system. It will be in 'Draft' status initially.
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Q3 2024 Security Policy" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Policy">Policy</SelectItem>
                          <SelectItem value="Training">Training</SelectItem>
                          <SelectItem value="Manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl><Input placeholder="e.g., v1.0" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Document
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>HR Documents & Policies</CardTitle>
          <CardDescription>A list of all compliance documents for the organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acknowledged</TableHead>
                  <TableHead className="hidden lg:table-cell">Expires</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{doc.type}</TableCell>
                    <TableCell className="hidden md:table-cell">{doc.version}</TableCell>
                    <TableCell><Badge variant={getStatusBadgeVariant(doc.status)}>{doc.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={doc.acknowledgement_percentage} className="w-24" />
                        <span>{doc.acknowledgement_percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        {doc.expiry_date && new Date(doc.expiry_date) < new Date() && <FileWarning className="h-4 w-4 text-destructive" />}
                        {doc.expiry_date || 'N/A'}
                      </div>
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
                          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Document</DropdownMenuItem>
                          <DropdownMenuItem><FileWarning className="mr-2 h-4 w-4" /> Send Reminder</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
