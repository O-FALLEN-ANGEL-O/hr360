
"use client"

import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Bot, Loader2, Send, FileText, User, Mic, Star, CheckCircle, HelpCircle, Shield, Clock, BarChart, Upload, Video, MessageSquare } from "lucide-react"

// AI Flow Imports
import { generateAndEvaluateInterview, type GenerateAndEvaluateInterviewOutput } from "@/ai/flows/interview-bot"
import { generateAptitudeTest, type AptitudeTestOutput } from "@/ai/flows/aptitude-test-generator"
import { analyzeVideoResume, type AnalyzeVideoResumeOutput } from "@/ai/flows/video-resume-analyzer"

// Zod and Form Imports
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"


// --- Component for Tab 1: AI Interview Bot ---

const interviewBotFormSchema = z.object({
  jobDescription: z.string().min(50, { message: "Job description is required." }),
  candidateResume: z.string().min(50, { message: "Candidate resume is required." }),
  candidateResponse: z.string().optional(),
})

function InterviewBotTab() {
  const [result, setResult] = useState<GenerateAndEvaluateInterviewOutput | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof interviewBotFormSchema>>({
    resolver: zodResolver(interviewBotFormSchema),
    defaultValues: { jobDescription: "", candidateResume: "", candidateResponse: "" },
  })

  async function onGenerate(values: z.infer<typeof interviewBotFormSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const response = await generateAndEvaluateInterview({ ...values, candidateResponse: "" })
      setResult(response)
      toast({ title: "Questions Generated!", description: "Interview questions are ready for the candidate." })
    } catch (error) {
      console.error("Error generating questions:", error)
      toast({ title: "Error", description: "Failed to generate questions. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }
  
  async function onEvaluate(values: z.infer<typeof interviewBotFormSchema>) {
    if (!values.candidateResponse) {
        toast({ title: "Response Required", description: "Please provide the candidate's response to evaluate.", variant: "destructive"})
        return;
    }
    setIsLoading(true)
    try {
      const response = await generateAndEvaluateInterview(values)
      setResult(prev => ({ ...prev!, evaluation: response.evaluation }))
      toast({ title: "Evaluation Complete!", description: "Candidate's response has been evaluated." })
    } catch (error) {
      console.error("Error evaluating response:", error)
      toast({ title: "Error", description: "Failed to evaluate response. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mt-6">
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
  )
}


// --- Component for Tab 2: Aptitude Test Generator ---

const aptitudeFormSchema = z.object({
  topic: z.enum(['Logical', 'Tech', 'English']),
  numQuestions: z.coerce.number().int().min(5).max(20),
  timeLimitMinutes: z.coerce.number().int().min(5).max(60),
  difficulty: z.enum(['easy', 'medium', 'hard']),
})

function AptitudeTestTab() {
    const [result, setResult] = useState<AptitudeTestOutput | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof aptitudeFormSchema>>({
        resolver: zodResolver(aptitudeFormSchema),
        defaultValues: { topic: "Logical", numQuestions: 10, timeLimitMinutes: 15, difficulty: "medium" },
    })

    async function onSubmit(values: z.infer<typeof aptitudeFormSchema>) {
        setIsLoading(true)
        setResult(null)
        try {
        const response = await generateAptitudeTest(values)
        setResult(response)
        toast({ title: "Test Generated!", description: `Your ${values.difficulty} ${values.topic} test is ready.` })
        } catch (error) {
        console.error("Error generating test:", error)
        toast({ title: "Error", description: "Failed to generate the test. Please try again.", variant: "destructive" })
        } finally {
        setIsLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>Set the parameters for the test.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="topic" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a topic" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Logical">Logical Reasoning</SelectItem>
                            <SelectItem value="Tech">Technical Skills</SelectItem>
                            <SelectItem value="English">English Proficiency</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                   <FormField control={form.control} name="difficulty" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a difficulty" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <FormField control={form.control} name="numQuestions" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Questions (5-20)</FormLabel>
                        <FormControl><Input type="number" min="5" max="20" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <FormField control={form.control} name="timeLimitMinutes" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Limit in Minutes (5-60)</FormLabel>
                        <FormControl><Input type="number" min="5" max="60" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
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
    )
}


// --- Component for Tab 3: Video Analyzer ---

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

const videoAnalyzerFormSchema = z.object({
  video: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Video is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type), ".mp4, .webm, and .ogg files are accepted."),
});

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function VideoAnalyzerTab() {
  const [result, setResult] = useState<AnalyzeVideoResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof videoAnalyzerFormSchema>>({
    resolver: zodResolver(videoAnalyzerFormSchema),
  });
  
  const { register, handleSubmit, formState: { errors } } = form;

  async function onSubmit(values: z.infer<typeof videoAnalyzerFormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const file = values.video[0];
      const videoDataUri = await fileToDataUri(file);
      const response = await analyzeVideoResume({ videoDataUri });
      setResult(response);
      toast({ title: "Analysis Complete!", description: "The video resume has been successfully analyzed." });
    } catch (error) {
      console.error("Error analyzing video:", error);
      toast({ title: "Error", description: "Failed to analyze the video. Please check the file and try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Video Resume</CardTitle>
            <CardDescription>Select a video file to start the analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="video" render={() => (
                    <FormItem>
                      <FormLabel>Video File</FormLabel>
                      <FormControl>
                        <Input type="file" accept={ACCEPTED_VIDEO_TYPES.join(",")} {...register("video")} onChange={handleFileChange} />
                      </FormControl>
                      <FormMessage>{errors.video?.message as React.ReactNode}</FormMessage>
                    </FormItem>
                  )} />

                {videoPreview && (
                  <div className="rounded-md overflow-hidden border">
                    <video src={videoPreview} controls className="w-full aspect-video" />
                  </div>
                )}

                <Button type="submit" disabled={isLoading || !videoPreview} className="w-full">
                  {isLoading ? <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing... </> : <> <Bot className="mr-2 h-4 w-4" /> Analyze Video </> }
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Analysis Report</CardTitle>
            <CardDescription>AI-powered feedback on the candidate's presentation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>AI is watching the video...</p>
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground rounded-md border border-dashed py-12">
                <Video className="h-10 w-10 mb-2" />
                <p>Analysis report will appear here.</p>
              </div>
            )}
            {result && (
              <div className="space-y-6 animate-in fade-in-50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Star className="mx-auto h-6 w-6 text-yellow-500 mb-2" />
                    <p className="text-sm font-medium">Confidence</p>
                    <p className="text-2xl font-bold">{Math.round(result.confidence * 100)}%</p>
                    <Progress value={result.confidence * 100} className="h-2 mt-1" />
                  </div>
                   <div className="p-4 rounded-lg bg-muted/50">
                    <Mic className="mx-auto h-6 w-6 text-blue-500 mb-2" />
                    <p className="text-sm font-medium">Clarity</p>
                    <p className="text-2xl font-bold">{Math.round(result.clarity * 100)}%</p>
                    <Progress value={result.clarity * 100} className="h-2 mt-1" />
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <MessageSquare className="mx-auto h-6 w-6 text-green-500 mb-2" />
                    <p className="text-sm font-medium">Tone</p>
                    <p className="text-2xl font-bold">{Math.round(result.tone * 100)}%</p>
                    <Progress value={result.tone * 100} className="h-2 mt-1" />
                  </div>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold">AI Summary & Feedback</h3>
                    <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-md">{result.summary}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
}


// --- Main Page Component ---

export default function AssessmentCenterPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Assessment Center"
        description="A unified hub for candidate interviews, aptitude tests, and video analysis."
      />
      <Tabs defaultValue="interview-bot" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="interview-bot">AI Interview Bot</TabsTrigger>
          <TabsTrigger value="aptitude-test">Aptitude Test Generator</TabsTrigger>
          <TabsTrigger value="video-analyzer">Video Analyzer</TabsTrigger>
        </TabsList>
        <TabsContent value="interview-bot">
          <InterviewBotTab />
        </TabsContent>
        <TabsContent value="aptitude-test">
            <AptitudeTestTab />
        </TabsContent>
        <TabsContent value="video-analyzer">
            <VideoAnalyzerTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
