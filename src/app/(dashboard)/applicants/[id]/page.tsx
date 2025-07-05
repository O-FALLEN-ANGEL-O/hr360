
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, Building, Briefcase, FileText, Keyboard, Loader2, Badge } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// In a real app, this data would be fetched from an API
const allApplicants = [
  { id: 1, name: "Charlie Davis", email: "charlie.d@example.com", contact: "+1234567890", college: "State University", status: "Pending Review", role: "Chat Support", aptitudeScore: "4/5", typingWPM: 75, typingAccuracy: 96, avatar: "https://placehold.co/100x100.png?text=CD", resumeSummary: "Experienced chat support specialist with a track record of high customer satisfaction scores. Proficient in Zendesk and Intercom." },
  { id: 2, name: "Diana Smith", email: "diana.s@example.com", contact: "+1987654321", college: "Ivy League College", status: "Interview Scheduled", role: "Product Manager", aptitudeScore: "5/5", typingWPM: null, typingAccuracy: null, avatar: "https://placehold.co/100x100.png?text=DS", resumeSummary: "Results-driven Product Manager with 5+ years of experience in agile environments. Successfully launched three major B2B SaaS products." },
  { id: 3, name: "Ethan Johnson", email: "ethan.j@example.com", contact: "+442079460958", college: "Tech Institute", status: "Rejected", role: "Data Analyst", aptitudeScore: "2/5", typingWPM: null, typingAccuracy: null, avatar: "https://placehold.co/100x100.png?text=EJ", resumeSummary: "Data Analyst with a strong background in SQL and Python. Lacks experience in the specific BI tools required for the role." },
  { id: 4, name: "Fiona White", email: "fiona.w@example.com", contact: "+61291112222", college: "Design School", status: "Pending Review", role: "UX Designer", aptitudeScore: "3/5", typingWPM: null, typingAccuracy: null, avatar: "https://placehold.co/100x100.png?text=FW", resumeSummary: "Creative UX Designer focused on user-centered design principles. Portfolio showcases mobile and web application designs." },
  { id: 5, name: "George Black", email: "george.b@example.com", contact: "+4915112345678", college: "Engineering College", status: "Offer Extended", role: "Backend Developer", aptitudeScore: "5/5", typingWPM: null, typingAccuracy: null, avatar: "https://placehold.co/100x100.png?text=GB", resumeSummary: "Senior Backend Developer with expertise in microservices architecture using Java and Spring Boot. Strong understanding of cloud-native development on AWS." },
  { id: 6, name: "Hannah Lee", email: "h.lee@inbox.com", contact: "+821012345678", college: "KAIST", status: "New", role: "Data Scientist", aptitudeScore: null, typingWPM: null, typingAccuracy: null, avatar: "https://placehold.co/100x100.png?text=HL", resumeSummary: "Recent graduate with a Master's in Data Science. Strong theoretical knowledge in machine learning and statistical modeling." },
  { id: 7, name: "Ivan Rodriguez", email: "ivan.r@inbox.com", contact: "+34600112233", college: "Polytechnic University of Madrid", status: "New", role: "Backend Developer", aptitudeScore: null, typingWPM: null, typingAccuracy: null, avatar: "https://placehold.co/100x100.png?text=IR", resumeSummary: "Backend developer with 2 years of experience building REST APIs with Node.js and Express. Eager to learn new technologies." },
];

type Applicant = typeof allApplicants[0];

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

    useEffect(() => {
        const applicantId = Number(params.id);
        const foundApplicant = allApplicants.find(a => a.id === applicantId);
        setApplicant(foundApplicant || null);
    }, [params.id]);

    const handleAssignTest = (testType: 'Aptitude' | 'Typing') => {
        toast({
            title: `${testType} Test Assigned`,
            description: `The candidate will be notified in their portal.`
        })
    }
    
    if (!applicant) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
          case "Pending Review": return "secondary";
          case "Interview Scheduled": return "default";
          case "Rejected": return "destructive";
          case "Offer Extended": return "outline";
          case "New": return "default";
          default: return "secondary";
        }
      };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={applicant.avatar} alt={applicant.name} data-ai-hint="employee avatar" />
                        <AvatarFallback>{applicant.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{applicant.name}</h1>
                        <p className="text-muted-foreground">{applicant.role}</p>
                        <Badge variant={getStatusBadgeVariant(applicant.status)} className={`mt-2 ${applicant.status === 'New' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}>{applicant.status}</Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleAssignTest("Aptitude")}><FileText className="mr-2 h-4 w-4" /> Assign Aptitude Test</Button>
                    {applicant.role.toLowerCase().includes("support") &&
                        <Button variant="outline" onClick={() => handleAssignTest("Typing")}><Keyboard className="mr-2 h-4 w-4" /> Assign Typing Test</Button>
                    }
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <InfoCard icon={<Mail className="h-4 w-4"/>} title="Email" value={applicant.email} />
                            <InfoCard icon={<Phone className="h-4 w-4"/>} title="Contact" value={applicant.contact} />
                            <InfoCard icon={<Building className="h-4 w-4"/>} title="College" value={applicant.college} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>AI Resume Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                           <p className="text-sm text-muted-foreground italic">{applicant.resumeSummary}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="md:col-span-2">
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
                                    <p className="text-2xl font-bold">{applicant.aptitudeScore || "Not Taken"}</p>
                                </div>
                                <Button variant="link" disabled={!applicant.aptitudeScore}>View Details</Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                             <h3 className="font-semibold flex items-center gap-2"><Keyboard className="h-5 w-5 text-primary" /> Typing Test</h3>
                             <div className="flex gap-4">
                                <div className="flex flex-1 items-center justify-between rounded-md border p-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">WPM</p>
                                        <p className="text-2xl font-bold">{applicant.typingWPM || "N/A"}</p>
                                    </div>
                                </div>
                                 <div className="flex flex-1 items-center justify-between rounded-md border p-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Accuracy</p>
                                        <p className="text-2xl font-bold">{applicant.typingAccuracy ? `${applicant.typingAccuracy}%` : "N/A"}</p>
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

    