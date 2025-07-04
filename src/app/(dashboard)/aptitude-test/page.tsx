"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Bot, Loader2, FileText, CheckCircle, HelpCircle, Shield, Clock, BarChart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import { generateAptitudeTest, type AptitudeTestOutput } from "@/ai/flows/aptitude-test-generator"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const formSchema = z.object({
  topic: z.enum(['Logical', 'Tech', 'English']),
  numQuestions: z.coerce.number().int().min(5).max(20),
  timeLimitMinutes: z.coerce.number().int().min(5).max(60),
  difficulty: z.enum(['easy', 'medium', 'hard']),
})

export default function AptitudeTestPage() {
  const [result, setResult] = useState<AptitudeTestOutput | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "Logical",
      numQuestions: 10,
      timeLimitMinutes: 15,
      difficulty: "medium",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const response = await generateAptitudeTest(values)
      setResult(response)
      toast({
        title: "Test Generated!",
        description: `Your ${values.difficulty} ${values.topic} test is ready.`,
      })
    } catch (error) {
      console.error("Error generating test:", error)
      toast({
        title: "Error",
        description: "Failed to generate the test. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Aptitude Test Generator"
        description="Create time-based MCQ tests with cheating prevention and auto-scoring."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>Set the parameters for the test.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a topic" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Logical">Logical Reasoning</SelectItem>
                            <SelectItem value="Tech">Technical Skills</SelectItem>
                            <SelectItem value="English">English Proficiency</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a difficulty" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Questions (5-20)</FormLabel>
                        <FormControl><Input type="number" min="5" max="20" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeLimitMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Limit in Minutes (5-60)</FormLabel>
                        <FormControl><Input type="number" min="5" max="60" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Generating Test...' : 'Generate Test'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
            <Card className="min-h-full">
                <CardHeader>
                    <CardTitle>Generated Aptitude Test</CardTitle>
                    <CardDescription>Review the generated test details below.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                            <p>AI is generating your aptitude test...</p>
                        </div>
                    )}
                    {!isLoading && !result && (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                            <FileText className="h-10 w-10 mb-2" />
                            <p>Your generated test will appear here.</p>
                        </div>
                    )}
                    {result && (
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2"><BarChart className="h-4 w-4 text-primary" /> <strong>Topic:</strong> {form.getValues('topic')}</div>
                                <div className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" /> <strong>Questions:</strong> {result.questions.length}</div>
                                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> <strong>Time:</strong> {form.getValues('timeLimitMinutes')} mins</div>
                            </div>
                            <h3 className="text-xl font-bold">{result.testName}</h3>
                            
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="instructions">
                                    <AccordionTrigger>Test Instructions</AccordionTrigger>
                                    <AccordionContent className="prose prose-sm max-w-none">
                                        <p>{result.testInstructions}</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="cheating-prevention">
                                    <AccordionTrigger className="flex items-center gap-2"><Shield className="h-4 w-4" /> Cheating Prevention Tips</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                            {result.cheatingPreventionTips.map((tip, i) => <li key={i}>{tip}</li>)}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <h4 className="font-semibold mt-4">Questions:</h4>
                             <Accordion type="multiple" className="w-full space-y-2">
                                {result.questions.map((q, i) => (
                                    <AccordionItem value={`item-${i}`} key={i} className="bg-muted/30 rounded-md px-4 border-b-0">
                                        <AccordionTrigger className="text-left">Q{i+1}: {q.question}</AccordionTrigger>
                                        <AccordionContent className="space-y-3">
                                            <ul className="space-y-1">
                                                {q.options.map((opt, j) => <li key={j} className="text-sm text-muted-foreground ml-4">{opt}</li>)}
                                            </ul>
                                            <div className="flex items-start gap-2 text-sm p-2 bg-green-100 dark:bg-green-900/30 rounded-md">
                                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                                                <div>
                                                    <span className="font-semibold">Correct Answer:</span> {q.correctAnswer}
                                                    <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
