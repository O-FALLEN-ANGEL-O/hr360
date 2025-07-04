"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Bot, Loader2, Send, FileText, User, Mic, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/page-header"
import { generateAndEvaluateInterview, type GenerateAndEvaluateInterviewOutput } from "@/ai/flows/interview-bot"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  jobDescription: z.string().min(50, { message: "Job description is required." }),
  candidateResume: z.string().min(50, { message: "Candidate resume is required." }),
  candidateResponse: z.string().optional(),
})

export default function InterviewBotPage() {
  const [result, setResult] = useState<GenerateAndEvaluateInterviewOutput | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
      candidateResume: "",
      candidateResponse: "",
    },
  })

  async function onGenerate(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const response = await generateAndEvaluateInterview({ ...values, candidateResponse: "" })
      setResult(response)
      toast({
        title: "Questions Generated!",
        description: "Interview questions are ready for the candidate.",
      })
    } catch (error) {
      console.error("Error generating questions:", error)
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  async function onEvaluate(values: z.infer<typeof formSchema>) {
    if (!values.candidateResponse) {
        toast({ title: "Response Required", description: "Please provide the candidate's response to evaluate.", variant: "destructive"})
        return;
    }
    setIsLoading(true)
    try {
      const response = await generateAndEvaluateInterview(values)
      setResult(prev => ({ ...prev!, evaluation: response.evaluation }))
      toast({
        title: "Evaluation Complete!",
        description: "Candidate's response has been evaluated.",
      })
    } catch (error) {
      console.error("Error evaluating response:", error)
      toast({
        title: "Error",
        description: "Failed to evaluate response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="space-y-8">
      <PageHeader
        title="Interview Bot"
        description="Auto-generate MCQ/video questions, evaluate responses, and send results to HR."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Interview Setup</CardTitle>
              <CardDescription>Provide job and candidate details to generate questions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><FileText className="h-4 w-4" /> Job Description</FormLabel>
                        <FormControl><Textarea placeholder="Paste job description..." rows={6} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="candidateResume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><User className="h-4 w-4" /> Candidate Resume</FormLabel>
                        <FormControl><Textarea placeholder="Paste candidate resume..." rows={6} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" onClick={form.handleSubmit(onGenerate)} disabled={isLoading} className="w-full">
                    {isLoading && !form.getValues("candidateResponse") ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                    ) : (
                      <><Bot className="mr-2 h-4 w-4" /> Generate Questions</>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Generated Questions & Evaluation</CardTitle>
              <CardDescription>Review questions and the candidate's evaluation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading && !result && (
                  <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      <p>Generating interview...</p>
                  </div>
              )}
              {!isLoading && !result && (
                  <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                    <Bot className="h-10 w-10 mb-2" />
                    <p>Generated questions will appear here.</p>
                  </div>
              )}
              {result && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Multiple Choice Questions</h3>
                    <ul className="space-y-2 list-decimal list-inside text-sm bg-muted/50 p-4 rounded-md">
                      {result.mcqQuestions.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Mic className="h-4 w-4" /> Video Question</h3>
                    <p className="text-sm bg-muted/50 p-4 rounded-md italic">"{result.videoQuestion}"</p>
                  </div>

                  <Separator />
                  
                   <Form {...form}>
                     <form className="space-y-4">
                        <FormField
                            control={form.control}
                            name="candidateResponse"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Candidate's Video Response (Transcript)</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Enter the transcript of the candidate's response here..." rows={5} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="button" onClick={form.handleSubmit(onEvaluate)} disabled={isLoading} className="w-full">
                            {isLoading && form.getValues("candidateResponse") ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating...</>
                            ) : (
                                <><Send className="mr-2 h-4 w-4" /> Evaluate Response</>
                            )}
                        </Button>
                     </form>
                   </Form>

                   {result.evaluation && (
                       <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><Star className="h-4 w-4" /> AI Evaluation</h3>
                            <p className="text-sm bg-muted/50 p-4 rounded-md">{result.evaluation}</p>
                       </div>
                   )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
