
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { processResume } from '@/ai/flows/resume-processor';
import { Loader2, User, Upload, Camera, Scan, Sparkles, CheckCircle, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("A valid email is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  resumeText: z.string().optional(),
  resumeSummary: z.string().optional(),
});

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function NewApplicantForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [newApplicantId, setNewApplicantId] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: '', email: '', phone: '', resumeText: '', resumeSummary: '' },
  });
  
  // Effect to redirect after submission
  useEffect(() => {
    if (isSubmitted && newApplicantId !== null) {
      const timer = setTimeout(() => {
        router.push(`/portal/${newApplicantId}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, newApplicantId, router]);


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const resumeDataUri = await fileToDataUri(file);
      const result = await processResume({ resumeDataUri });

      form.setValue('fullName', result.fullName);
      form.setValue('email', result.email);
      form.setValue('phone', result.phone);
      form.setValue('resumeText', result.rawText);
      form.setValue('resumeSummary', result.summary);
      
      toast({ title: 'Resume Processed!', description: 'Your details have been auto-filled.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to process resume.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCapture = useCallback(async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const resumeDataUri = canvas.toDataURL('image/jpeg');
    
    setIsCameraOpen(false);
    setIsProcessing(true);
    try {
        const result = await processResume({ resumeDataUri });
        form.setValue('fullName', result.fullName);
        form.setValue('email', result.email);
        form.setValue('phone', result.phone);
        form.setValue('resumeText', result.rawText);
        form.setValue('resumeSummary', result.summary);
        toast({ title: 'Resume Captured & Processed!', description: 'Your details have been auto-filled.' });
    } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Failed to process captured image.', variant: 'destructive' });
    } finally {
        setIsProcessing(false);
    }
  }, [form, toast]);
  
  const getCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
    }
  }, [toast]);
  
  useEffect(() => {
    if (isCameraOpen) {
      getCameraPermission();
    } else {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [isCameraOpen, getCameraPermission]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/applicants/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application.');
      }
      
      const data = await response.json();

      if (!data || !data.id) {
        throw new Error("Failed to create applicant. No data returned from server.");
      }

      setNewApplicantId(data.id);
      setIsSubmitted(true);
      toast({
        title: "Registration Complete!",
        description: "Thank you. Redirecting you to your personal applicant portal...",
      });
    } catch (error) {
      console.error("Error submitting applicant:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to submit application: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
        <Card>
            <CardContent className="text-center p-8 flex flex-col items-center justify-center">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold">Registration Successful!</h3>
                <p className="text-muted-foreground mt-2">Your Applicant ID is <span className="font-mono text-primary font-bold">APP-00{newApplicantId}</span>.</p>
                <div className="flex items-center gap-2 mt-6">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    <p className="text-sm text-muted-foreground">Redirecting to your portal...</p>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button type="button" variant="outline" disabled={isProcessing} onClick={() => document.getElementById('resume-upload')?.click()}>
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Upload Resume
            </Button>
            <Input id="resume-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />

            <Button type="button" variant="outline" disabled={isProcessing} onClick={() => setIsCameraOpen(true)}>
              <Camera className="mr-2 h-4 w-4" />
              Use Webcam
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <p>Upload a resume or use the webcam to auto-fill the form.</p>
          </div>
          
          <FormField control={form.control} name="fullName" render={({ field }) => (
            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="e.g., jane.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="e.g., +1234567890" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="resumeText" render={({ field }) => (
            <FormItem><FormLabel>Resume Content (Extracted)</FormLabel><FormControl><Textarea placeholder="Resume text will appear here after processing..." rows={8} {...field} readOnly /></FormControl><FormMessage /></FormItem>
          )} />

          <Button type="submit" disabled={isProcessing || isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </form>
      </Form>
      
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Scan Your Resume</DialogTitle>
            </DialogHeader>
             <div className='relative'>
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                <div className="absolute inset-0 border-4 border-dashed border-primary/50 m-4 rounded-lg"></div>
            </div>
            {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access to use this feature.
                  </Aler_Description>
                </Alert>
            )}
            <DialogFooter>
                <Button onClick={handleCapture} disabled={!hasCameraPermission} className="w-full">
                    <Scan className="mr-2 h-4 w-4" />
                    Capture and Process
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
