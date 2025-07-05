
"use client"

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, CheckCircle, Award, Building, Keyboard, Timer, Target } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';

const idSchema = z.object({
  candidateId: z.string().min(1, "A candidate ID is required."),
});

const sampleText = "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet, making it a perfect tool for practicing typing. Speed and accuracy are both important metrics for any professional who relies on a keyboard for their daily work. Consistent practice is the key to improvement. Remember to maintain good posture and take breaks to avoid strain.";

type Stage = 'id_input' | 'instructions' | 'testing' | 'results';

export default function TypingTestPage() {
  const [stage, setStage] = useState<Stage>('id_input');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [errors, setErrors] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof idSchema>>({
    resolver: zodResolver(idSchema),
    defaultValues: { candidateId: searchParams.get('id') || '' },
  });

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (isTestRunning && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        endTest();
    }
    return () => {
        if(timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTestRunning, timeLeft]);

  function onIdSubmit() {
    // In a real app, you would validate the ID here
    toast({ title: 'Candidate ID Verified', description: 'Please read the instructions before you begin.' });
    setStage('instructions');
  }

  const startTest = () => {
    setStage('testing');
    setIsTestRunning(true);
    startTimeRef.current = Date.now();
  }

  const endTest = () => {
    setIsTestRunning(false);
    
    const wordsTyped = (userInput.trim().length / 5);
    const timeElapsedMinutes = (60 - timeLeft) / 60;
    
    const grossWpm = timeElapsedMinutes > 0 ? Math.round(wordsTyped / timeElapsedMinutes) : 0;
    
    let correctChars = 0;
    userInput.split('').forEach((char, index) => {
        if (sampleText[index] === char) {
            correctChars++;
        }
    });

    const finalAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 0;
    
    setWpm(grossWpm);
    setAccuracy(finalAccuracy);
    setStage('results');
    toast({ title: 'Test Complete!', description: 'Your results have been submitted to HR.' });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4 font-sans">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
            <Building className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold">HR360+ Typing Test</h1>
        </div>

        {stage === 'id_input' && (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to the Typing Test</CardTitle>
              <CardDescription>Please enter your Candidate ID to begin.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onIdSubmit)}>
                <CardContent>
                  <FormField control={form.control} name="candidateId" render={({ field }) => (
                    <FormItem><FormLabel>Candidate ID</FormLabel><FormControl><Input placeholder="Enter the ID provided by HR" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full"><ArrowRight className="mr-2 h-4 w-4" /> Verify & Proceed</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        )}

        {stage === 'instructions' && (
            <Card>
                <CardHeader><CardTitle>Instructions</CardTitle></CardHeader>
                <CardContent className="space-y-4 prose prose-sm max-w-none">
                    <ul>
                        <li>You will have <strong>60 seconds</strong> to type the text provided.</li>
                        <li>Your Words Per Minute (WPM) and Accuracy will be calculated.</li>
                        <li>Do not use backspace to correct mistakes, as accuracy is measured.</li>
                        <li>The test will start as soon as you begin typing.</li>
                        <li>When you are ready, click the button below to start.</li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button onClick={startTest} className="w-full">
                        <Keyboard className="mr-2 h-4 w-4" /> I'm Ready, Start Test
                    </Button>
                </CardFooter>
            </Card>
        )}

        {stage === 'testing' && (
            <Card>
                <CardHeader className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 rounded-lg bg-muted">
                        <p className="text-sm font-medium">Time Left</p>
                        <p className="text-2xl font-bold">{timeLeft}s</p>
                    </div>
                     <div className="p-2 rounded-lg bg-muted">
                        <p className="text-sm font-medium">WPM</p>
                        <p className="text-2xl font-bold">{wpm}</p>
                    </div>
                     <div className="p-2 rounded-lg bg-muted">
                        <p className="text-sm font-medium">Accuracy</p>
                        <p className="text-2xl font-bold">{accuracy}%</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="p-4 rounded-md bg-muted/50 text-lg leading-relaxed font-mono tracking-wider">
                      {sampleText.split('').map((char, index) => {
                        let color = "text-muted-foreground";
                        if (index < userInput.length) {
                          color = char === userInput[index] ? "text-green-500" : "text-red-500 underline";
                        }
                        return <span key={index} className={cn(color)}>{char}</span>
                      })}
                    </p>
                    <textarea
                        className="w-full h-48 mt-4 p-4 rounded-md border text-lg leading-relaxed font-mono tracking-wider focus:ring-2 focus:ring-primary"
                        value={userInput}
                        onChange={handleInputChange}
                        disabled={!isTestRunning}
                        autoFocus
                    />
                </CardContent>
                 <CardFooter>
                    <Button onClick={endTest} className="w-full" variant="secondary">
                        <CheckCircle className="mr-2 h-4 w-4" /> End Test Manually
                    </Button>
                </CardFooter>
            </Card>
        )}
        
        {stage === 'results' && (
            <Card className="text-center">
                <CardHeader>
                    <Award className="mx-auto h-16 w-16 text-yellow-500" />
                    <CardTitle className="mt-4">Test Complete!</CardTitle>
                    <CardDescription>Your typing test results have been recorded.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted">
                        <Timer className="mx-auto h-8 w-8 text-primary mb-2" />
                        <p className="text-lg font-semibold">WPM (Words Per Minute)</p>
                        <p className="text-4xl font-bold">{wpm}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted">
                        <Target className="mx-auto h-8 w-8 text-primary mb-2" />
                        <p className="text-lg font-semibold">Accuracy</p>
                        <p className="text-4xl font-bold">{accuracy}%</p>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <p className="text-sm text-muted-foreground">Your results have been sent to our HR team.</p>
                    <p className="text-sm text-muted-foreground">Thank you for your time.</p>
                </CardFooter>
            </Card>
        )}

      </div>
    </div>
  );
}
