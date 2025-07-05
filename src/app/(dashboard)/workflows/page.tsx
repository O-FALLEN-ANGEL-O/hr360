
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Clock, Mail, UserPlus, UserX, PlusCircle, BellRing, Hourglass, type LucideIcon, BookUser } from "lucide-react"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

const workflowSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(10, "Description is required."),
})

type IconName = "UserPlus" | "UserX" | "Clock" | "Mail" | "Check" | "Hourglass" | "BellRing" | "PlusCircle";

const iconMap: { [key in IconName]: LucideIcon } = {
  UserPlus,
  UserX,
  Clock,
  Mail,
  Check,
  Hourglass,
  BellRing,
  PlusCircle,
};

const initialWorkflows = [
  {
    title: "New Employee Onboarding",
    icon: "UserPlus" as const,
    iconColor: "text-green-500",
    description: "Automated workflow for welcoming new hires, from offer acceptance to first-day setup.",
    steps: [
      { name: "Send Welcome Email", icon: "Mail" as const, done: true },
      { name: "IT Equipment Provisioning", icon: "Clock" as const, done: false },
      { name: "Create System Accounts", icon: "Clock" as const, done: false },
      { name: "Schedule Orientation", icon: "Check" as const, done: true },
    ]
  },
  {
    title: "48-Hour Resume Reminder",
    icon: "Hourglass" as const,
    iconColor: "text-blue-500",
    description: "If a resume is unseen for 48 hours, this workflow sends an apology and alerts HR.",
    steps: [
      { name: "Monitor Unseen Resumes", icon: "Check" as const, done: true },
      { name: "Trigger After 48 Hours", icon: "Clock" as const, done: false },
      { name: "Send Auto-Apology Email", icon: "Clock" as const, done: false },
      { name: "Alert HR Team", icon: "BellRing" as const, done: false },
    ]
  },
  {
    title: "Employee Offboarding",
    icon: "UserX" as const,
    iconColor: "text-red-500",
    description: "A streamlined process for employee exits, ensuring all assets are recovered and access is revoked.",
    steps: [
      { name: "Conduct Exit Interview", icon: "Check" as const, done: true },
      { name: "Deactivate Accounts", icon: "Check" as const, done: true },
      { name: "Final Payroll Processing", icon: "Clock" as const, done: false },
      { name: "Collect Company Assets", icon: "Clock" as const, done: false },
    ]
  },
  {
    title: "Leave Approval Process",
    icon: "Clock" as const,
    iconColor: "text-blue-500",
    description: "A multi-step approval workflow for employee leave requests.",
    steps: [
      { name: "Employee Submits Request", icon: "Check" as const, done: true },
      { name: "Manager Approval", icon: "Clock" as const, done: false },
      { name: "HR Confirmation", icon: "Clock" as const, done: false },
      { name: "Update Calendar", icon: "Clock" as const, done: false },
    ]
  }
];

type Workflow = typeof initialWorkflows[0];

const UserGuideContent = () => (
    <div className="space-y-6 text-sm">
        <div className="space-y-2">
            <h2 className="text-xl font-bold">Core Workflow: Handling a Walk-in Candidate</h2>
            <p>This is one of the most common tasks you'll perform. Our platform makes it incredibly efficient.</p>
            <ul className="space-y-2 list-decimal list-inside pl-2">
                <li>
                    <strong>Provide the Registration Link:</strong> Navigate to the <strong>Applicants</strong> page, click <strong>"Copy Walk-in Registration Link,"</strong> and provide it to the candidate on a company tablet.
                </li>
                <li>
                    <strong>Applicant Self-Registers:</strong> The candidate opens the link, uploads or takes a photo of their resume, and our AI pre-fills their details for confirmation.
                </li>
                <li>
                    <strong>View the Applicant in the Dashboard:</strong> The new candidate instantly appears on your <strong>Applicants</strong> page. Click their name to view their Unified Profile.
                </li>
                <li>
                    <strong>Assign Assessments:</strong> From their profile, assign an Aptitude or Typing Test. The candidate is notified immediately in their portal.
                </li>
            </ul>
        </div>
        <hr className="border-border" />
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Module-by-Module Feature Guide</h2>
            <div>
                <h3 className="font-semibold text-base mb-1">🚀 Talent Acquisition</h3>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                    <li><strong>Live Job Postings:</strong> Central dashboard to track all open positions.</li>
                    <li><strong>Campus Drive & Internship Aggregator:</strong> Manage large-scale campus recruitment and intern programs.</li>
                    <li><strong>Assessment Center:</strong> Unified hub to create and manage all candidate tests.</li>
                    <li><strong>Applicants & GPT Match Score:</strong> Review candidates and use AI for instant resume-to-job-description fit analysis.</li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-base mb-1">📄 Documentation & Communication</h3>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                    <li><strong>Document Generator:</strong> Instantly create error-free HR documents like offer letters.</li>
                    <li><strong>AI Email Composer:</strong> Intelligent assistant to draft personalized, professional emails.</li>
                    <li><strong>Grievance Hub:</strong> Secure, anonymous, and trackable ticketing system for employee concerns.</li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-base mb-1">📈 Employee Management</h3>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                    <li><strong>Live Employee Status Grid:</strong> Real-time dashboard showing the work status of all employees.</li>
                    <li><strong>Career Path Predictor:</strong> Forecast potential career growth paths for employees.</li>
                    <li><strong>Recognition & Rewards Dashboard:</strong> Automated system to detect kudos, award points, and manage rewards.</li>
                    <li><strong>Sentiment & Culture Fit Analyzer:</strong> Process feedback to detect morale and predict candidate culture fit.</li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-base mb-1">⚙️ Automation & Compliance</h3>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                    <li><strong>HR Workflows:</strong> Automate multi-step processes like onboarding and offboarding.</li>
                    <li><strong>Compliance Center:</strong> Central repository to manage policies and track acknowledgments.</li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-base mb-1">📊 Intelligence & Tools</h3>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                    <li><strong>Predictive Analytics Dashboard:</strong> AI-driven insights on attrition, burnout, and salary benchmarks.</li>
                    <li><strong>Mobile & WhatsApp HR Bot:</strong> AI assistant for employees to self-serve common requests.</li>
                </ul>
            </div>
        </div>
        <hr className="border-border" />
        <p className="text-center font-semibold">We hope this guide helps you feel confident using the HR360+ platform. Welcome aboard!</p>
    </div>
);

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof workflowSchema>>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof workflowSchema>) {
    const newWorkflow: Workflow = {
      title: values.title,
      description: values.description,
      icon: "PlusCircle",
      iconColor: "text-gray-500",
      steps: [
        { name: "Step 1: Define", icon: "Clock", done: false },
        { name: "Step 2: Assign", icon: "Clock", done: false },
        { name: "Step 3: Activate", icon: "Clock", done: false },
      ]
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    toast({
      title: "Workflow Created!",
      description: `The "${values.title}" workflow has been added.`,
    });
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="HR Workflows"
        description="Visualize and manage automated HR processes for efficiency and consistency."
      />
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Create New Workflow</DialogTitle>
                  <DialogDescription>
                    Define a new automated process. You can add steps later.
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workflow Title</FormLabel>
                      <FormControl><Input placeholder="e.g., Performance Review Cycle" {...field} /></FormControl>
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
                      <FormControl><Textarea placeholder="What is this workflow for?" rows={3} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create Workflow</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {/* User Guide Card */}
        <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
            <DialogTrigger asChild>
                <Card className="flex flex-col cursor-pointer hover:border-primary transition-colors order-first">
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                        <div className="flex-shrink-0">
                            <BookUser className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-grow">
                          <CardTitle>HR360+ User Guide</CardTitle>
                          <CardDescription className="mt-1">New here? Start with this guide to learn how to use the platform.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground">Click to learn about:</p>
                        <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                            <li>Core Workflows</li>
                            <li>Module Features</li>
                            <li>Getting Started</li>
                        </ul>
                    </CardContent>
                    <div className="border-t p-4">
                        <Button variant="outline" className="w-full" onClick={() => setIsGuideOpen(true)}>
                          Open Guide <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Welcome to HR360+: Your Guide to Getting Started</DialogTitle>
                    <DialogDescription>
                        This guide will help you quickly get up to speed with our powerful, all-in-one HR platform.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-6">
                    <UserGuideContent />
                </ScrollArea>
            </DialogContent>
        </Dialog>

        {workflows.map((workflow, index) => {
           const MainIcon = iconMap[workflow.icon];
           return (
            <Card key={index} className="flex flex-col">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="flex-shrink-0">
                    <MainIcon className={`h-8 w-8 ${workflow.iconColor}`} />
                </div>
                <div className="flex-grow">
                  <CardTitle>{workflow.title}</CardTitle>
                  <CardDescription className="mt-1">{workflow.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {workflow.steps.map((step, stepIndex) => {
                    const StepIcon = iconMap[step.icon];
                    return (
                        <li key={stepIndex} className="flex items-center gap-3">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full ${step.done ? "bg-green-100 dark:bg-green-900/20" : "bg-yellow-100 dark:bg-yellow-900/20"}`}>
                                <StepIcon className={`h-4 w-4 ${step.done ? "text-green-600" : "text-yellow-600"}`} />
                            </div>
                            <span className={`flex-1 text-sm ${step.done ? "text-muted-foreground line-through" : ""}`}>{step.name}</span>
                        </li>
                    )
                  })}
                </ul>
              </CardContent>
              <div className="border-t p-4">
                <Button variant="outline" className="w-full">
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
           )
        })}
      </div>
    </div>
  );
}
