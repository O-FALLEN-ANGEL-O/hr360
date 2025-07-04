"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Bot, Loader2, HeartHandshake, Building, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { predictCultureFit, type PredictCultureFitOutput } from "@/ai/flows/culture-fit-predictor";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  candidateBehavior: z.string().min(50, { message: "Provide some observations on candidate behavior." }),
  preHireAnswers: z.string().min(50, { message: "Provide the candidate's answers to value-based questions." }),
  companyValues: z.string().min(50, { message: "Please list the core company values." }),
});

export default function CultureFitPage() {
  const [result, setResult] = useState<PredictCultureFitOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateBehavior: "",
      preHireAnswers: "",
      companyValues: "Collaboration, Innovation, Customer-Centricity, Integrity, Accountability",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await predictCultureFit(values);
      setResult(response);
      toast({
        title: "Culture Fit Analysis Complete!",
        description: `The candidate has a fit score of ${Math.round(response.cultureFitScore * 100)}%.`,
      });
    } catch (error) {
      console.error("Error predicting culture fit:", error);
      toast({
        title: "Error",
        description: "Failed to analyze culture fit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const getScoreColor = (score: number) => {
    if (score > 0.75) return "text-green-500";
    if (score > 0.5) return "text-blue-500";
    if (score > 0.25) return "text-yellow-500";
    return "text-red-500";
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Culture Fit Predictor"
        description="Match candidate behavior and answers against company values for a culture fit score."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Candidate & Company Data</CardTitle>
            <CardDescription>Enter the data to predict the culture fit.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyValues"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Building className="h-4 w-4" /> Company Values</FormLabel>
                      <FormControl><Textarea placeholder="e.g., Innovation, Teamwork, Integrity..." rows={3} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="candidateBehavior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><HeartHandshake className="h-4 w-4" /> Observed Candidate Behavior</FormLabel>
                      <FormControl><Textarea placeholder="Describe the candidate's behavior during interviews..." rows={5} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="preHireAnswers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Quote className="h-4 w-4" /> Pre-Hire Assessment Answers</FormLabel>
                      <FormControl><Textarea placeholder="Paste the candidate's answers to value-based questions..." rows={5} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Predict Culture Fit
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Culture Fit Analysis</CardTitle>
            <CardDescription>The AI-powered assessment of cultural alignment.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
             {isLoading && (
                <div className="flex flex-1 items-center justify-center">
                    <div className="text-center space-y-2">
                        <Bot className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
                        <p className="text-muted-foreground">AI is assessing the cultural alignment...</p>
                    </div>
                </div>
            )}
            {result && (
              <div className="w-full space-y-6 text-center animate-in fade-in-50">
                <div className="flex flex-col items-center space-y-2">
                    <HeartHandshake className={`h-16 w-16 ${getScoreColor(result.cultureFitScore)}`} />
                    <p className="text-sm text-muted-foreground">Culture Fit Score</p>
                    <div className={`text-7xl font-bold tracking-tighter ${getScoreColor(result.cultureFitScore)}`}>
                        {Math.round(result.cultureFitScore * 100)}<span className="text-2xl">%</span>
                    </div>
                </div>
                <div className="text-left space-y-2">
                    <h3 className="font-semibold">Justification:</h3>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md">{result.justification}</p>
                </div>
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex flex-1 items-center justify-center rounded-md border border-dashed w-full">
                  <div className="text-center">
                      <HeartHandshake className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Culture fit analysis will appear here.</p>
                  </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
