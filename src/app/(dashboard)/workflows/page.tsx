"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Clock, Mail, UserPlus, UserX, PlusCircle } from "lucide-react"
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

const workflowSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(10, "Description is required."),
})

const initialWorkflows = [
  {
    title: "New Employee Onboarding",
    icon: <UserPlus className="h-8 w-8 text-green-500" />,
    description: "Automated workflow for welcoming new hires, from offer acceptance to first-day setup.",
    steps: [
      { name: "Send Welcome Email", icon: <Mail className="text-blue-500" />, done: true },
      { name: "IT Equipment Provisioning", icon: <Clock className="text-yellow-500" />, done: false },
      { name: "Create System Accounts", icon: <Clock className="text-yellow-500" />, done: false },
      { name: "Schedule Orientation", icon: <Check className="text-green-500" />, done: true },
    ]
  },
  {
    title: "Employee Offboarding",
    icon: <UserX className="h-8 w-8 text-red-500" />,
    description: "A streamlined process for employee exits, ensuring all assets are recovered and access is revoked.",
    steps: [
      { name: "Conduct Exit Interview", icon: <Check className="text-green-500" />, done: true },
      { name: "Deactivate Accounts", icon: <Check className="text-green-500" />, done: true },
      { name: "Final Payroll Processing", icon: <Clock className="text-yellow-500" />, done: false },
      { name: "Collect Company Assets", icon: <Clock className="text-yellow-500" />, done: false },
    ]
  },
  {
    title: "Leave Approval Process",
    icon: <Clock className="h-8 w-8 text-blue-500" />,
    description: "A multi-step approval workflow for employee leave requests.",
    steps: [
      { name: "Employee Submits Request", icon: <Check className="text-green-500" />, done: true },
      { name: "Manager Approval", icon: <Clock className="text-yellow-500" />, done: false },
      { name: "HR Confirmation", icon: <Clock className="text-yellow-500" />, done: false },
      { name: "Update Calendar", icon: <Clock className="text-yellow-500" />, done: false },
    ]
  }
];

type Workflow = typeof initialWorkflows[0];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      icon: <PlusCircle className="h-8 w-8 text-gray-500" />, // Default icon for new workflows
      steps: [
        { name: "Step 1: Define", icon: <Clock className="text-yellow-500" />, done: false },
        { name: "Step 2: Assign", icon: <Clock className="text-yellow-500" />, done: false },
        { name: "Step 3: Activate", icon: <Clock className="text-yellow-500" />, done: false },
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
        {workflows.map((workflow, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <div className="flex-shrink-0">{workflow.icon}</div>
              <div className="flex-grow">
                <CardTitle>{workflow.title}</CardTitle>
                <CardDescription className="mt-1">{workflow.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {workflow.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-center gap-3">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${step.done ? "bg-green-100" : "bg-yellow-100"}`}>
                        {step.done ? <Check className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-yellow-600" />}
                    </div>
                    <span className={`flex-1 text-sm ${step.done ? "text-muted-foreground line-through" : ""}`}>{step.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="border-t p-4">
              <Button variant="outline" className="w-full">
                View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
