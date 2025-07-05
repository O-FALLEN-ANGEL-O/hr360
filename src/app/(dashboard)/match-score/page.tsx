"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Bot, FileText, Loader2, User, Sparkles, ThumbsUp, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { matchJobToResume, type MatchJobToResumeOutput } from "@/ai/flows/gpt-powered-match-score";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  jobDescription: z.string().min(100, { message: "Job description must be at least 100 characters." }),
  resume: z.string().min(100, { message: "Resume content must be at least 100 characters." }),
});

const ResultIcon = ({ category }: { category: MatchJobToResumeOutput['matchCategory'] }) => {
    switch (category) {
        case 'Perfect Match':
            return <ThumbsUp className="h-16 w-16 text-green-500" />;
        case 'Good Fit':
            return <Sparkles className="h-16 w-16 text-blue-500" />;
        case 'Low Match':
            return <AlertTriangle className="h-16 w-16 text-yellow-500" />;
        default:
            return <Bot className="h-16 w-16 text-muted-foreground" />;
    }
};

const ResultBadge = ({ category }: { category: MatchJobToResumeOutput['matchCategory'] }) => {
    switch (category) {
        case 'Perfect Match':
            return <Badge className="bg-green-500 hover:bg-green-600">🔥 {category}</Badge>;
        case 'Good Fit':
            return <Badge className="bg-blue-500 hover:bg-blue-600">✅ {category}</Badge>;
        case 'Low Match':
            return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">⚠️ {category}</Badge>;
        default:
            return <Badge>{category}</Badge>;
    }
}

export default function MatchScorePage() {
  const [result, setResult] = useState<MatchJobToResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
      resume: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await matchJobToResume(values);
      setResult(response);
      toast({
        title: "Match Analysis Complete!",
        description: `Candidate is a ${response.matchCategory}.`,
      });
    } catch (error) {
      console.error("Error matching resume:", error);
      toast({
        title: "Error",
        description: "Failed to analyze the resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="GPT-Powered Match Score"
        description="Match job descriptions against candidate resumes and get an AI-powered compatibility score."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Input</CardTitle>
            <CardDescription>Paste the job description and candidate resume below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><FileText className="h-4 w-4" /> Job Description</FormLabel>
                      <FormControl><Textarea placeholder="Paste the full job description here..." rows={10} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="resume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><User className="h-4 w-4" /> Candidate Resume</FormLabel>
                      <FormControl><Textarea placeholder="Paste the candidate's full resume here..." rows={10} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Calculate Match Score
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Match Result</CardTitle>
            <CardDescription>The AI-powered analysis of the candidate's fit.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            {isLoading && (
                <div className="flex flex-1 items-center justify-center">
                    <div className="text-center space-y-2">
                        <Bot className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
                        <p className="text-muted-foreground">AI is comparing the documents...</p>
                    </div>
                </div>
            )}
            {result && (
              <div className="w-full space-y-6 animate-in fade-in-50">
                <div className="flex flex-col items-center space-y-4">
                    <ResultIcon category={result.matchCategory} />
                    <ResultBadge category={result.matchCategory} />
                    <div className="text-6xl font-bold tracking-tighter">{result.matchScore}<span className="text-2xl text-muted-foreground">/100</span></div>
                </div>
                <div className="text-left space-y-2">
                    <h3 className="font-semibold">Reasoning:</h3>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md">{result.reasoning}</p>
                </div>
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex flex-1 items-center justify-center rounded-md border border-dashed w-full">
                  <div className="text-center">
                      <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Your match analysis will appear here.</p>
                  </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
