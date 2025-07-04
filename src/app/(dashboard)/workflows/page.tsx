import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Clock, Mail, UserPlus, UserX, PlusCircle } from "lucide-react";

const workflows = [
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

export default function WorkflowsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="HR Workflows"
        description="Visualize and manage automated HR processes for efficiency and consistency."
      />
      <div className="flex justify-end">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Workflow
        </Button>
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
