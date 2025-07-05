
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generateAptitudeTest, type AptitudeTestOutput } from '@/ai/flows/aptitude-test-generator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, CheckCircle, Award, Building, User, Bell, Keyboard, Timer, Target } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Mock data that would typically come from a database
const allApplicants = [
  { id: 1, name: "Charlie Davis", email: "charlie.d@example.com", status: "Pending Review", role: "Chat Support", assignedTest: 'aptitude' as 'aptitude' | 'typing' | null },
  { id: 2, name: "Diana Smith", email: "diana.s@example.com", status: "Interview Scheduled", role: "Product Manager", assignedTest: null },
  { id: 3, name: "Ethan Johnson", email: "ethan.j@example.com", status: "Rejected", role: "Data Analyst", assignedTest: null },
  { id: 4, name: "Fiona White", email: "fiona.w@example.com", status: "Pending Review", role: "UX Designer", assignedTest: 'typing' as 'aptitude' | 'typing' | null },
  { id: 5, name: "George Black", email: "george.b@example.com", status: "Offer Extended", role: "Backend Developer", assignedTest: null },
  { id: 8, name: "Jennifer Wilson", email: "j.wilson@example.com", status: "New", role: "Chat Support", assignedTest: 'aptitude' as 'aptitude' | 'typing' | null },
];
type Applicant = typeof allApplicants[0];

const testSchema = z.object({
  answers: z.array(z.object({
    answer: z.string({ required_error: "Please select an answer."}).min(1, "Please select an answer."),
  })),
});

const sampleTypingText = "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet, making it a perfect tool for practicing typing. Speed and accuracy are both important metrics for any professional who relies on a keyboard for their daily work. Consistent practice is the key to improvement. Remember to maintain good posture and take breaks to avoid strain.";

type Stage = 'loading' | 'portal' | 'aptitude_test' | 'typing_test' | 'results';

export default function ApplicantPortalPage() {
  const [stage, setStage] = useState<Stage>('loading');
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState<AptitudeTestOutput | null>(null);
  const [testScore, setTestScore] = useState(0);
  
  // Typing test state
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const params = useParams();
  const { toast } = useToast();

  const testForm = useForm<z.infer<typeof testSchema>>({
    resolver: zodResolver(testSchema),
  });

  const { fields, replace } = useFieldArray({
    control: testForm.control,
    name: "answers"
  });

  // Fetch applicant data and check for assessments
  useEffect(() => {
    const applicantId = Number(params.id);
    const foundApplicant = allApplicants.find(a => a.id === applicantId);
    if (foundApplicant) {
      setApplicant(foundApplicant);
      setStage('portal');
      // Simulate checking for an assigned test after a short delay
      setTimeout(() => {
        if (foundApplicant.assignedTest) {
          setShowNotification(true);
        }
      }, 2000);
    } else {
      // Handle applicant not found
      setStage('portal'); // Or an error stage
    }
  }, [params.id]);

  // Timer logic for typing test
  useEffect(() => {
    if (isTestRunning && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTestRunning) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      endTypingTest();
    }
    return () => {
      if(timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTestRunning, timeLeft]);


  const startAptitudeTest = useCallback(async () => {
    if (!applicant) return;
    setShowNotification(false);
    setIsLoading(true);
    try {
      const test = await generateAptitudeTest({
        topic: 'Comprehensive',
        role: applicant.role,
        numQuestions: 5,
        timeLimitMinutes: 10,
        difficulty: 'medium',
      });
      setTestData(test);
      replace(test.questions.map(() => ({ answer: '' })));
      setStage('aptitude_test');
      toast({ title: 'Test Started!', description: 'Good luck with your assessment.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not generate the test.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [applicant, replace, toast]);

  const startTypingTest = () => {
    setShowNotification(false);
    setStage('typing_test');
    setIsTestRunning(true);
  }

  function submitAptitudeTest(values: z.infer<typeof testSchema>) {
    if (!testData) return;
    let correctAnswers = 0;
    testData.questions.forEach((q, index) => {
      if (values.answers[index].answer === q.correctAnswer) {
        correctAnswers++;
      }
    });
    setTestScore(correctAnswers);
    setStage('results');
    toast({ title: 'Aptitude Test Submitted!', description: 'Your results are ready.' });
  }

  const endTypingTest = useCallback(() => {
    setIsTestRunning(false);
    const wordsTyped = (userInput.trim().length / 5);
    const timeElapsedMinutes = (60 - timeLeft) / 60;
    const grossWpm = timeElapsedMinutes > 0 ? Math.round(wordsTyped / timeElapsedMinutes) : 0;
    
    let correctChars = 0;
    userInput.split('').forEach((char, index) => {
      if (sampleTypingText[index] === char) {
        correctChars++;
      }
    });

    const finalAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 0;
    
    setWpm(grossWpm);
    setAccuracy(finalAccuracy);
    setStage('results');
    toast({ title: 'Typing Test Complete!', description: 'Your results have been submitted to HR.' });
  }, [userInput, timeLeft]);

  if (stage === 'loading' || !applicant) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  const handleStartTest = () => {
    if (applicant.assignedTest === 'aptitude') {
      startAptitudeTest();
    } else if (applicant.assignedTest === 'typing') {
      startTypingTest();
    }
  };

  const renderContent = () => {
    switch (stage) {
      case 'portal':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {applicant.name}!</CardTitle>
              <CardDescription>This is your personal application portal. Your applicant ID is <span className="font-mono font-bold">{`APP-00${applicant.id}`}</span>.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Your application for the <span className="font-semibold">{applicant.role}</span> position is currently <Badge>{applicant.status}</Badge>.</p>
              <p className="mt-4 text-sm text-muted-foreground">We will notify you here of any next steps. Please keep this link safe.</p>
            </CardContent>
          </Card>
        );
      case 'aptitude_test':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{testData?.testName}</CardTitle>
              <CardDescription>{testData?.testInstructions}</CardDescription>
            </CardHeader>
            <Form {...testForm}>
              <form onSubmit={testForm.handleSubmit(submitAptitudeTest)}>
                <CardContent className="space-y-8">
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={testForm.control}
                      name={`answers.${index}.answer`}
                      render={({ field: formField }) => {
                        const q = testData!.questions[index];
                        return (
                          <FormItem className="space-y-3">
                            <FormLabel className="font-semibold">Q{index + 1}: {q.questionText}</FormLabel>
                            {q.questionImage && (
                              <div className="my-2 p-2 border rounded-md bg-white">
                                <Image src={q.questionImage} alt={`Puzzle for Q${index+1}`} width={300} height={200} className="rounded-md mx-auto" data-ai-hint="puzzle diagram" />
                              </div>
                            )}
                            <FormControl>
                              <RadioGroup onValueChange={formField.onChange} defaultValue={formField.value} className="flex flex-col space-y-1">
                                {q.options.map((opt, i) => (
                                  <FormItem key={i} className="flex items-center space-x-3 space-y-0 p-2 rounded-md hover:bg-muted">
                                    <FormControl><RadioGroupItem value={opt} id={`${index}-${i}`} /></FormControl>
                                    <FormLabel htmlFor={`${index}-${i}`} className="font-normal cursor-pointer w-full">{opt}</FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit Test
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        );
      case 'typing_test':
        return (
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
                      {sampleTypingText.split('').map((char, index) => {
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
                        onChange={(e) => setUserInput(e.target.value)}
                        disabled={!isTestRunning}
                        autoFocus
                    />
                </CardContent>
                 <CardFooter>
                    <Button onClick={endTypingTest} className="w-full" variant="secondary">
                        <CheckCircle className="mr-2 h-4 w-4" /> End Test Manually
                    </Button>
                </CardFooter>
            </Card>
        );
      case 'results':
        return (
          <Card className="text-center">
            <CardHeader>
              <Award className="mx-auto h-16 w-16 text-yellow-500" />
              <CardTitle className="mt-4">Assessment Complete!</CardTitle>
              <CardDescription>Thank you for taking the time. Your results have been submitted.</CardDescription>
            </CardHeader>
            <CardContent>
              {applicant.assignedTest === 'aptitude' && testData && (
                <div className="space-y-4">
                  <p className="text-xl">Your Aptitude Score:</p>
                  <p className="text-6xl font-bold">{testScore} / {testData.questions.length}</p>
                  <Progress value={(testScore / testData.questions.length) * 100} className="w-3/4 mx-auto" />
                </div>
              )}
              {applicant.assignedTest === 'typing' && (
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted">
                          <Timer className="mx-auto h-8 w-8 text-primary mb-2" />
                          <p className="text-lg font-semibold">WPM</p>
                          <p className="text-4xl font-bold">{wpm}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                          <Target className="mx-auto h-8 w-8 text-primary mb-2" />
                          <p className="text-lg font-semibold">Accuracy</p>
                          <p className="text-4xl font-bold">{accuracy}%</p>
                      </div>
                  </div>
              )}
            </CardContent>
            <CardFooter>
                <p className="w-full text-center text-sm text-muted-foreground">We will be in touch with you shortly.</p>
            </CardFooter>
          </Card>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4 font-sans">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
            <Building className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold">HR360+ Candidate Portal</h1>
        </div>
        
        {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div> : renderContent()}

        <Dialog open={showNotification} onOpenChange={setShowNotification}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Bell /> You have a new assessment!</DialogTitle>
              <DialogDescription>
                Your application has progressed to the next stage. Please complete the following assessment to continue.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNotification(false)}>Later</Button>
              <Button onClick={handleStartTest}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Start Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
