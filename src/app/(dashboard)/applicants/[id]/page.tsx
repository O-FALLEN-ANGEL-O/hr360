
"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, Building, FileText, Keyboard, Loader2, Badge, MessageSquare, Info, Save } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { createClient } from '@/lib/supabase/client'
import type { Applicant } from "@/lib/types"

const InfoCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string | null }) => (
    <div className="flex items-start gap-3">
        <div className="text-muted-foreground mt-1">{icon}</div>
        <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-sm font-medium">{value || 'N/A'}</p>
        </div>
    </div>
);

export default function ApplicantProfilePage() {
    const params = useParams();
    const { toast } = useToast();
    const [applicant, setApplicant] = useState<Applicant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notes, setNotes] = useState("");
    const supabase = createClient();

    const fetchApplicant = useCallback(async () => {
        setIsLoading(true);
        const applicantId = Number(params.id);
        const { data, error } = await supabase
            .from('applicants')
            .select('*')
            .eq('id', applicantId)
            .single();

        if (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to fetch applicant data.", variant: "destructive" });
        } else {
            setApplicant(data);
            setNotes(data.hr_notes || "");
        }
        setIsLoading(false);
    }, [params.id, toast, supabase]);

    useEffect(() => {
        fetchApplicant();
    }, [fetchApplicant]);
    
    const handleSaveNotes = async () => {
      if(!applicant) return;
      setIsSaving(true);
      const { error } = await supabase
        .from('applicants')
        .update({ hr_notes: notes })
        .eq('id', applicant.id);

      if (error) {
        toast({ title: "Error", description: "Failed to save notes.", variant: "destructive"});
      } else {
        toast({ title: "Notes Saved!", description: "Your notes have been updated."});
      }
      setIsSaving(false);
    }

    const handleAssignTest = async (testType: 'Aptitude' | 'Typing') => {
        if (!applicant) return;
        const { error } = await supabase
            .from('applicants')
            .update({ assigned_test: testType.toLowerCase() as 'aptitude' | 'typing' })
            .eq('id', applicant.id);
        
        if (error) {
             toast({
                title: 'Error',
                description: `Could not assign ${testType} Test.`,
                variant: 'destructive'
            })
        } else {
            setApplicant(prev => prev ? {...prev, assigned_test: testType.toLowerCase() as 'aptitude' | 'typing'} : null);
            toast({
                title: `${testType} Test Assigned`,
                description: `The candidate will be notified in their portal.`
            })
        }
    }
    
    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (!applicant) {
        return <div className="text-center">Applicant not found.</div>;
    }

    const getStatusBadgeVariant = (status: string) => {
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

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20" data-ai-hint="employee avatar">
                        <AvatarImage src={`https://placehold.co/100x100.png`} alt={applicant.full_name} />
                        <AvatarFallback>{applicant.full_name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{applicant.full_name}</h1>
                        <p className="text-muted-foreground">{applicant.role}</p>
                        <Badge variant={getStatusBadgeVariant(applicant.status)} className={cn("mt-2", {
                            "bg-accent text-accent-foreground hover:bg-accent/80": applicant.status === "Offer Extended" || applicant.status === "Hired",
                            "bg-blue-500 hover:bg-blue-600 text-white": applicant.status === "New"
                        })}>
                            {applicant.status}
                        </Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleAssignTest("Aptitude")}><FileText className="mr-2 h-4 w-4" /> Assign Aptitude Test</Button>
                    {applicant.role.toLowerCase().includes("support") &&
                        <Button variant="outline" onClick={() => handleAssignTest("Typing")}><Keyboard className="mr-2 h-4 w-4" /> Assign Typing Test</Button>
                    }
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <InfoCard icon={<Mail className="h-4 w-4"/>} title="Email" value={applicant.email} />
                            <InfoCard icon={<Phone className="h-4 w-4"/>} title="Contact" value={applicant.phone} />
                            <InfoCard icon={<Building className="h-4 w-4"/>} title="College" value={applicant.college} />
                            <InfoCard icon={<Info className="h-4 w-4"/>} title="Source" value={applicant.source} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>AI Resume Summary</CardTitle></CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground italic">{applicant.resume_summary}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5"/> HR Notes</CardTitle></CardHeader>
                        <CardContent>
                           <Textarea placeholder="Add internal notes about the candidate..." rows={4} value={notes} onChange={(e) => setNotes(e.target.value)}/>
                        </CardContent>
                        <CardFooter>
                            <Button size="sm" className="w-full" onClick={handleSaveNotes} disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Notes
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Assessment Center</CardTitle>
                        <CardDescription>Performance in all assigned assessments.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Aptitude Test</h3>
                            <div className="flex items-center justify-between rounded-md border p-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Score</p>
                                    <p className="text-2xl font-bold">{applicant.aptitude_score || "Not Taken"}</p>
                                </div>
                                <Button variant="link" disabled={!applicant.aptitude_score}>View Details</Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                             <h3 className="font-semibold flex items-center gap-2"><Keyboard className="h-5 w-5 text-primary" /> Typing Test</h3>
                             <div className="flex gap-4">
                                <div className="flex flex-1 items-center justify-between rounded-md border p-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">WPM</p>
                                        <p className="text-2xl font-bold">{applicant.typing_wpm || "N/A"}</p>
                                    </div>
                                </div>
                                 <div className="flex flex-1 items-center justify-between rounded-md border p-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Accuracy</p>
                                        <p className="text-2xl font-bold">{applicant.typing_accuracy ? `${applicant.typing_accuracy}%` : "N/A"}</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">Results are automatically updated upon test completion.</p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
