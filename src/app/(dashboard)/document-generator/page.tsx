"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Bot, Loader2, FileText, Download, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/page-header"
import { generateDocument } from "@/ai/flows/document-generator"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  documentType: z.enum(["offerLetter", "memo"]),
  templateData: z.string().min(20, { message: "Please provide data for the document." }),
  additionalInstructions: z.string().optional(),
})

export default function DocumentGeneratorPage() {
  const [documentContent, setDocumentContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "offerLetter",
      templateData: `{"candidateName": "Jane Doe", "jobTitle": "Software Engineer", "salary": "90000", "startDate": "2024-08-01"}`,
      additionalInstructions: "Please use a formal and welcoming tone.",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setDocumentContent("")
    try {
      const parsedData = JSON.parse(values.templateData)
      const response = await generateDocument({
        ...values,
        templateData: parsedData,
      })
      setDocumentContent(response.documentContent)
      toast({
        title: "Document Generated!",
        description: `Your ${values.documentType} has been created successfully.`,
      })
    } catch (error) {
      console.error("Error generating document:", error)
       if (error instanceof SyntaxError) {
        toast({
            title: "Invalid JSON",
            description: "Please check the format of your template data.",
            variant: "destructive",
        })
       } else {
        toast({
            title: "Error",
            description: "Failed to generate the document. Please try again.",
            variant: "destructive",
        })
       }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(documentContent)
    toast({ title: "Copied!", description: "Document content copied to clipboard." })
  }

  const handleDownload = () => {
    const blob = new Blob([documentContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${form.getValues("documentType")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Document Generator"
        description="Generate offer letters, memos, and more using AI-powered templates."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
            <CardDescription>Select a document type and provide the necessary data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a document type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="offerLetter">Offer Letter</SelectItem>
                          <SelectItem value="memo">Internal Memo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="templateData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Data (JSON format)</FormLabel>
                      <FormControl><Textarea placeholder='e.g., {"name": "John Doe", "position": "Developer"}' rows={8} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Instructions (Optional)</FormLabel>
                      <FormControl><Textarea placeholder="e.g., Ensure the tone is formal." rows={3} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Bot className="mr-2 h-4 w-4" /> Generate Document</>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader className="flex-row items-start justify-between">
            <div>
                <CardTitle>Generated Document</CardTitle>
                <CardDescription>Review the generated content below.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleCopy} disabled={!documentContent}><Copy className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={handleDownload} disabled={!documentContent}><Download className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading && (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                    <p>AI is writing your document...</p>
                </div>
              </div>
            )}
            {!isLoading && !documentContent && (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed text-muted-foreground">
                <div className="text-center">
                    <FileText className="mx-auto h-12 w-12" />
                    <p className="mt-2 text-sm">Your generated document will appear here.</p>
                </div>
              </div>
            )}
            {documentContent && (
              <div className="prose prose-sm max-w-none h-full rounded-md border bg-muted/50 p-4 whitespace-pre-wrap overflow-auto">
                {documentContent}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
