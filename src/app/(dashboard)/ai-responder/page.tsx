"use client"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Bot, Clipboard, Loader2, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/page-header"
import { aiEmailResponder } from "@/ai/flows/ai-email-responder"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

const formSchema = z.object({
  jobDescription: z.string().min(50, { message: "Job description must be at least 50 characters." }),
  resume: z.string().min(50, { message: "Resume content must be at least 50 characters." }),
  coverLetter: z.string().optional(),
  companyName: z.string().min(2, { message: "Company name is required." }),
  jobTitle: z.string().min(2, { message: "Job title is required." }),
  recipientEmail: z.string().email(),
  senderName: z.string().min(2, { message: "Your name is required." }),
  senderEmail: z.string().email({ message: "A valid sender email is required."}),
  customSignature: z.string().min(10, { message: "A signature is required." }),
})

export default function AiEmailResponderPage() {
  const [generatedEmail, setGeneratedEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
      resume: "",
      coverLetter: "",
      companyName: "",
      jobTitle: "",
      recipientEmail: "",
      senderName: "",
      senderEmail: "",
      customSignature: "Best regards,\n[Your Name]",
    },
  })

  const startProgress = () => {
    const DURATION = 15; // Approximate seconds for generation
    const intervalTime = (DURATION * 1000) / 100;
    intervalRef.current = setInterval(() => {
        setProgress(prev => {
            if (prev >= 99) {
                clearInterval(intervalRef.current!);
                return 99;
            }
            return prev + 1;
        });
    }, intervalTime);
  }

  const stopProgress = () => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    setProgress(100);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setGeneratedEmail("")
    setProgress(0)
    startProgress()
    try {
      const result = await aiEmailResponder({
        ...values,
        coverLetter: values.coverLetter || "",
      })
      setGeneratedEmail(result.emailContent)
      toast({
        title: "Email Generated!",
        description: "Your personalized email has been successfully created.",
      });
    } catch (error) {
      console.error("Error generating email:", error)
      toast({
        title: "Error",
        description: "Failed to generate the email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      stopProgress()
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast({
      title: "Copied to Clipboard!",
      description: "The email content has been copied.",
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Email Responder"
        description="Auto-generate personalized emails tailored by role and job, including your resume and custom signature."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Applicant Details</CardTitle>
            <CardDescription>Fill in the details to generate a personalized email.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl><Input placeholder="e.g., Senior Frontend Developer" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Acme Inc." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Email</FormLabel>
                      <FormControl><Input type="email" placeholder="e.g., hr@acme.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl><Textarea placeholder="Paste the job description here..." rows={6} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="resume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Resume</FormLabel>
                      <FormControl><Textarea placeholder="Paste your resume content here..." rows={6} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="senderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senderEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl><Input type="email" placeholder="e.g., jane.doe@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customSignature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Signature</FormLabel>
                      <FormControl><Textarea rows={3} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Generate Email
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
                <CardTitle>Generated Email</CardTitle>
                <CardDescription>Review the AI-generated email below.</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyToClipboard} disabled={!generatedEmail || isLoading}>
                <Clipboard className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {isLoading && (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center space-y-4 w-4/5">
                    <Bot className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
                    <p className="text-muted-foreground">AI is crafting your email... ({Math.round(progress)}%)</p>
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-muted-foreground">This should take about 15 seconds.</p>
                </div>
              </div>
            )}
            {!isLoading && generatedEmail && (
              <div className="prose prose-sm max-w-none flex-1 rounded-md border bg-muted/50 p-4 whitespace-pre-wrap font-sans">
                {generatedEmail}
              </div>
            )}
            {!isLoading && !generatedEmail && (
                <div className="flex flex-1 items-center justify-center rounded-md border border-dashed">
                    <div className="text-center">
                        <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Your generated email will appear here.</p>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
