
"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { predictCareerGrowth, type PredictCareerGrowthOutput } from "@/ai/flows/career-growth-predictor"
import { Bot, Loader2, User, Briefcase, Sparkles, Milestone, ArrowRight, Star, GraduationCap } from "lucide-react"

const formSchema = z.object({
  currentRole: z.string().min(3, "Current role is required."),
  skills: z.string().min(10, "Please list some key skills."),
  performanceReview: z.string().min(50, "Performance review summary is required."),
  careerAspirations: z.string().min(20, "Please describe career aspirations."),
});

export default function CareerGrowthPage() {
  const [result, setResult] = useState<PredictCareerGrowthOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentRole: "Software Engineer II",
      skills: "React, Node.js, TypeScript, SQL, Agile Methodologies",
      performanceReview: "Exceeds expectations in all areas. Strong technical skills and a great team player. Consistently delivers high-quality code and shows leadership potential.",
      careerAspirations: "Interested in moving towards a tech leadership or architect role. Enjoys mentoring junior developers.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await predictCareerGrowth({
        ...values,
        skills: values.skills.split(',').map(s => s.trim()),
      });
      setResult(response);
      toast({
        title: "Career Path Predicted!",
        description: "The AI has generated a potential career timeline.",
      });
    } catch (error) {
      console.error("Error predicting career growth:", error);
      toast({
        title: "Error",
        description: "Failed to predict career path. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Career Growth Predictor"
        description="Predict future roles, skill upgrades, and mentors using AI."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Employee Profile</CardTitle>
            <CardDescription>Enter employee details to generate a career path prediction.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="currentRole" render={({ field }) => (
                  <FormItem><FormLabel>Current Role</FormLabel><FormControl><Input placeholder="e.g., Senior Analyst" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="skills" render={({ field }) => (
                  <FormItem><FormLabel>Current Skills (comma-separated)</FormLabel><FormControl><Textarea placeholder="e.g., Java, Python, SQL" rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="performanceReview" render={({ field }) => (
                  <FormItem><FormLabel>Latest Performance Review Summary</FormLabel><FormControl><Textarea placeholder="Summarize the latest performance review..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="careerAspirations" render={({ field }) => (
                  <FormItem><FormLabel>Career Aspirations</FormLabel><FormControl><Textarea placeholder="Describe the employee's career goals..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Predicting...</> : <><Sparkles className="mr-2 h-4 w-4" /> Predict Path</>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Predicted Career Timeline</CardTitle>
            <CardDescription>An AI-generated potential growth path.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading && (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  <p>AI is forecasting the future...</p>
                </div>
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed text-muted-foreground">
                <div className="text-center">
                  <Milestone className="mx-auto h-12 w-12" />
                  <p className="mt-2 text-sm">The career path prediction will appear here.</p>
                </div>
              </div>
            )}
            {result && (
              <div className="relative pl-6">
                <div className="absolute left-[30px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                 {result.predictedPath.map((step, index) => (
                    <div key={index} className="relative mb-8">
                      <div className="absolute left-[30px] top-1/2 h-0.5 w-6 bg-border -translate-x-full -translate-y-1/2"></div>
                      <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
                         <Briefcase className="h-4 w-4" />
                      </div>
                      <div className="pl-12">
                        <p className="text-xs text-muted-foreground">{step.timeline}</p>
                        <h4 className="font-semibold text-primary">{step.role}</h4>
                        <div className="mt-2 space-y-1">
                            <p className="text-sm flex items-center gap-2"><GraduationCap className="h-4 w-4 text-muted-foreground" /> <strong>Skills to build:</strong> {step.requiredSkills.join(', ')}</p>
                            <p className="text-sm flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> <strong>Suggested Mentor:</strong> {step.suggestedMentor}</p>
                        </div>
                      </div>
                    </div>
                ))}
                <div className="relative">
                   <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground ring-4 ring-background">
                        <Star className="h-4 w-4" />
                   </div>
                   <div className="pl-12"><p className="font-semibold">Future is Bright!</p></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
