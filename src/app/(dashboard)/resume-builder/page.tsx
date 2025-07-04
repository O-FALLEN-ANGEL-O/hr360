"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Bot, FileText, Loader2, Download, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/page-header"
import { smartResumeBuilder } from "@/ai/flows/smart-resume-builder"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const formSchema = z.object({
  userInfo: z.string().min(100, { message: "Please provide comprehensive information for a better resume." }),
  format: z.enum(["html", "pdf"]),
});

export default function SmartResumeBuilderPage() {
  const [resumeContent, setResumeContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInfo: "",
      format: "html",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResumeContent("")
    try {
      const response = await smartResumeBuilder(values)
      setResumeContent(response.resumeContent)
      toast({
        title: "Resume Generated!",
        description: `Your ${values.format.toUpperCase()} resume has been created.`,
      })
    } catch (error) {
      console.error("Error building resume:", error)
      toast({
        title: "Error",
        description: "Failed to build the resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    const format = form.getValues("format");
    const blob = new Blob([resumeContent], { type: format === 'html' ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume.${format === 'html' ? 'html' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const openInNewTab = () => {
    const format = form.getValues("format");
    if(format === 'html'){
        const newWindow = window.open();
        newWindow?.document.write(resumeContent);
        newWindow?.document.close();
    } else {
        toast({
            title: "Preview Not Available",
            description: "PDF preview is not supported. Please download the file.",
        })
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Smart Resume Builder"
        description="Convert your professional information into an ATS-optimized PDF or HTML resume."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Provide your details and choose a format.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="userInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Information</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your name, contact details, skills, experience, education, projects, etc." 
                          rows={15} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Output Format</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="html" />
                            </FormControl>
                            <FormLabel className="font-normal">HTML</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="pdf" />
                            </FormControl>
                            <FormLabel className="font-normal">PDF (Text)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Building Resume...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Generate Resume
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
              <CardTitle>Generated Resume</CardTitle>
              <CardDescription>Preview or download your new resume.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={openInNewTab} disabled={!resumeContent}>
                    <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleDownload} disabled={!resumeContent}>
                    <Download className="h-4 w-4" />
                </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center space-y-2">
                  <Bot className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
                  <p className="text-muted-foreground">AI is building your ATS-optimized resume...</p>
                </div>
              </div>
            )}
            {resumeContent && form.getValues("format") === "html" && (
              <iframe
                srcDoc={resumeContent}
                className="w-full h-full rounded-md border"
                title="Resume Preview"
              />
            )}
            {resumeContent && form.getValues("format") === "pdf" && (
                <div className="h-full rounded-md border bg-muted/50 p-4 whitespace-pre-wrap overflow-auto">
                    <pre className="text-sm font-mono">{resumeContent}</pre>
                </div>
            )}
            {!isLoading && !resumeContent && (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Your generated resume will appear here.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
