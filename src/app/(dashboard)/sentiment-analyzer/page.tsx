"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Bot, Loader2, Smile, Frown, Meh, Sparkles, Flame } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { analyzeSentiment, type SentimentAnalyzerOutput } from "@/ai/flows/sentiment-analyzer";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  text: z.string().min(20, { message: "Text must be at least 20 characters for a meaningful analysis." }),
});

const SentimentIcon = ({ sentiment }: { sentiment: string }) => {
  if (sentiment.toLowerCase().includes("positive")) return <Smile className="h-6 w-6 text-green-500" />;
  if (sentiment.toLowerCase().includes("negative")) return <Frown className="h-6 w-6 text-red-500" />;
  return <Meh className="h-6 w-6 text-yellow-500" />;
};

const ToxicityIcon = ({ level }: { level: string }) => {
    if (level.toLowerCase().includes("high")) return <Flame className="h-6 w-6 text-red-700" />;
    if (level.toLowerCase().includes("medium")) return <Flame className="h-6 w-6 text-orange-500" />;
    if (level.toLowerCase().includes("low")) return <Sparkles className="h-6 w-6 text-yellow-500" />;
    return <Smile className="h-6 w-6 text-green-500" />;
};

export default function SentimentAnalyzerPage() {
  const [result, setResult] = useState<SentimentAnalyzerOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await analyzeSentiment(values);
      setResult(response);
      toast({
        title: "Analysis Complete!",
        description: "The text sentiment has been successfully analyzed.",
      });
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      toast({
        title: "Error",
        description: "Failed to analyze the text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sentiment Analyzer"
        description="Analyze exit forms, feedback, and reviews to detect morale, burnout, and toxicity."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Input</CardTitle>
            <CardDescription>Paste the text you want to analyze below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text for Analysis</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste text from exit interviews, feedback forms, reviews, etc."
                          rows={12}
                          {...field}
                        />
                      </FormControl>
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
                      Analyze Sentiment
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>The AI-powered sentiment breakdown.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>AI is reading the room...</p>
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground rounded-md border border-dashed py-12">
                <Bot className="h-10 w-10 mb-2" />
                <p>Analysis results will appear here.</p>
              </div>
            )}
            {result && (
              <div className="space-y-6 animate-in fade-in-50">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Overall Sentiment</p>
                    <p className="text-xl font-bold">{result.overallSentiment}</p>
                  </div>
                  <SentimentIcon sentiment={result.overallSentiment} />
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                        <p className="text-sm font-medium">Morale Score</p>
                        <p className="text-xl font-bold">{result.moraleScore} <span className="text-sm font-normal text-muted-foreground">/ 100</span></p>
                    </div>
                    <Progress value={result.moraleScore} />
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">Burnout Indicators</p>
                    <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">{result.burnoutIndicators}</p>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Toxicity Level</p>
                    <p className="text-xl font-bold capitalize">{result.toxicityLevel}</p>
                  </div>
                  <ToxicityIcon level={result.toxicityLevel} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
