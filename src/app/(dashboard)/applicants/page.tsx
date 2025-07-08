
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
import { MoreHorizontal, User, Mail, Loader2, Link2, Power, CalendarPlus, FileCheck, UserX } from "lucide-react"
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
import { aiEmailResponder } from "@/ai/flows/ai-email-responder"
import { useSupabase } from "@/hooks/use-supabase-client"
import type { Applicant } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [isDriveMode, setIsDriveMode] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState<number | null>(null);
  const driveModeInterval = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const supabase = useSupabase();

  const fetchApplicants = useCallback(async (showToast = false) => {
    if (!supabase) return;
    if (!showToast) setIsLoading(true);
    else setIsScanning(true);

    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching applicants:", error);
      toast({ title: "Error", description: "Could not fetch applicants.", variant: "destructive" });
    } else {
      if (showToast && data && data.length > applicants.length && applicants.length > 0) {
        toast({ title: "New Applicants Arrived!", description: `${data.length - applicants.length} new candidates are available.` });
      }
      setApplicants(data || []);
    }
    setIsLoading(false);
    setIsScanning(false);
  }, [toast, applicants.length, supabase]);

  useEffect(() => {
    if (supabase) {
      fetchApplicants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  useEffect(() => {
    if (isDriveMode) {
      driveModeInterval.current = setInterval(() => fetchApplicants(true), 5000); // Fetch every 5 seconds
    } else {
      if (driveModeInterval.current) {
        clearInterval(driveModeInterval.current);
      }
    }

    return () => {
      if (driveModeInterval.current) {
        clearInterval(driveModeInterval.current);
      }
    }
  }, [isDriveMode, fetchApplicants]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/register`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Walk-in registration link copied to clipboard.",
    });
  };
  
  const getStatusBadgeVariant = (status: Applicant['status']) => {
    switch (status) {
      case "Pending Review": return "secondary";
      case "Interview Scheduled": return "default";
      case "Rejected": return "destructive";
      case "Offer Extended": return "default";
      case "New": return "default";
      case "Hired": return "default";
      default: return "secondary";
    }
  };

  const handleStatusChange = async (
    applicantId: number,
    newStatus: Applicant['status'],
    context: 'Invitation to Interview' | 'Offer Extended' | 'Polite Rejection'
  ) => {
    if (!supabase) return;
    const applicant = applicants.find(a => a.id === applicantId);
    if (!applicant) return;

    setIsSendingEmail(applicantId);

    try {
      await aiEmailResponder({
        applicantName: applicant.full_name,
        jobTitle: applicant.role,
        recipientEmail: applicant.email,
        communicationContext: context,
        companyName: "HR360+ Platform Inc."
      });

      const { error } = await supabase.from('applicants').update({ status: newStatus }).eq('id', applicantId);
      if (error) throw error;

      setApplicants(prev => prev.map(a =>
        a.id === applicantId ? { ...a, status: newStatus } : a
      ));

      toast({
        title: "Email Sent & Status Updated!",
        description: `A ${context.toLowerCase()} email has been sent to ${applicant.full_name}.`,
      });

    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSendingEmail(null);
    }
  }


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
            <Power className={cn("h-4 w-4 transition-colors text-muted-foreground", { "text-destructive": isDriveMode })} />
            Hiring Drive Mode
          </Label>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyLink}>
            <Link2 className="mr-2 h-4 w-4" />
            Copy Walk-in Kiosk Link
          </Button>
          <Button onClick={() => fetchApplicants(true)} disabled={isScanning || isDriveMode}>
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
                  <TableHead>Candidate Name</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicants.map((applicant) => (
                  <TableRow key={applicant.id} className={cn({ "bg-primary/5": applicant.status === "New" })} >
                    <TableCell className="font-medium">{applicant.full_name}</TableCell>
                    <TableCell className="hidden md:table-cell">{applicant.role}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{applicant.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(applicant.status)} className={cn({
                        "bg-accent text-accent-foreground hover:bg-accent/80": applicant.status === "Offer Extended" || applicant.status === "Hired",
                        "bg-blue-500 hover:bg-blue-600 text-white": applicant.status === "New"
                      })}>
                        {applicant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isSendingEmail === applicant.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
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
                            <DropdownMenuItem onClick={() => handleStatusChange(applicant.id, 'Interview Scheduled', 'Invitation to Interview')}>
                              <CalendarPlus className="mr-2 h-4 w-4" /> Schedule Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(applicant.id, 'Offer Extended', 'Offer Extended')}>
                              <FileCheck className="mr-2 h-4 w-4" /> Extend Offer
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleStatusChange(applicant.id, 'Rejected', 'Polite Rejection')}>
                              <UserX className="mr-2 h-4 w-4" /> Reject Candidate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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
