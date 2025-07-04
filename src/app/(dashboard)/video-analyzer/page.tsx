"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Bot, Loader2, Upload, Video, Star, MessageSquare, Mic } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { analyzeVideoResume, type AnalyzeVideoResumeOutput } from "@/ai/flows/video-resume-analyzer";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

const formSchema = z.object({
  video: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Video is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type),
      ".mp4, .webm, and .ogg files are accepted."
    ),
});

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function VideoAnalyzerPage() {
  const [result, setResult] = useState<AnalyzeVideoResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const { register, handleSubmit, formState: { errors } } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const file = values.video[0];
      const videoDataUri = await fileToDataUri(file);
      const response = await analyzeVideoResume({ videoDataUri });
      setResult(response);
      toast({
        title: "Analysis Complete!",
        description: "The video resume has been successfully analyzed.",
      });
    } catch (error) {
      console.error("Error analyzing video:", error);
      toast({
        title: "Error",
        description: "Failed to analyze the video. Please check the file and try again.",
        variant: "destructive",
      });
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
    <div className="space-y-8">
      <PageHeader
        title="Video Resume Analyzer"
        description="Rate confidence, clarity, and tone from candidate's introductory videos using AI."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Video Resume</CardTitle>
            <CardDescription>Select a video file to start the analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="video"
                  render={() => (
                    <FormItem>
                      <FormLabel>Video File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept={ACCEPTED_VIDEO_TYPES.join(",")}
                          {...register("video")}
                          onChange={handleFileChange}
                        />
                      </FormControl>
                      <FormMessage>{errors.video?.message as React.ReactNode}</FormMessage>
                    </FormItem>
                  )}
                />

                {videoPreview && (
                  <div className="rounded-md overflow-hidden border">
                    <video src={videoPreview} controls className="w-full aspect-video" />
                  </div>
                )}

                <Button type="submit" disabled={isLoading || !videoPreview} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" /> Analyze Video
                    </>
                  )}
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
    </div>
  );
}
