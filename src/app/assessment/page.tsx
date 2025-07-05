
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generateAptitudeTest, type AptitudeTestOutput } from '@/ai/flows/aptitude-test-generator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, CheckCircle, Award, Building, Phone, School, PencilRuler, BrainCircuit, BookOpen } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';

const infoSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Please enter a valid email."),
  contactNumber: z.string().min(10, "A valid contact number is required.").max(15, "Contact number is too long."),
  collegeName: z.string().min(3, "College name is required."),
});

const testSchema = z.object({
  answers: z.array(z.object({
    answer: z.string({ required_error: "Please select an answer."}).min(1, "Please select an answer."),
  })),
});

type Stage = 'info' | 'selection' | 'testing' | 'results';
type TestTopic = "English" | "Logical" | "Comprehensive";

const TestTypeCard = ({ icon, title, description, onSelect }: { icon: React.ReactNode, title: string, description: string, onSelect: () => void }) => (
    <button onClick={onSelect} className="w-full text-left">
        <Card className="hover:border-primary hover:bg-muted/50 transition-all">
            <CardHeader className="flex flex-row items-center gap-4">
                {icon}
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
        </Card>
    </button>
);


export default function AssessmentPage() {
  const [stage, setStage] = useState<Stage>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState<AptitudeTestOutput | null>(null);
  const [score, setScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  useEffect(() => {
    setMounted(true);
  }, []);

  const infoForm = useForm<z.infer<typeof infoSchema>>({
    resolver: zodResolver(infoSchema),
    defaultValues: { name: '', email: '', contactNumber: '', collegeName: '' },
  });

  const testForm = useForm<z.infer<typeof testSchema>>({
    resolver: zodResolver(testSchema),
  });

  const { fields, replace } = useFieldArray({
    control: testForm.control,
    name: "answers"
  });

  function onInfoSubmit() {
    setStage('selection');
  }

  async function onStartTest(topic: TestTopic) {
    setIsLoading(true);
    try {
      const test = await generateAptitudeTest({
        topic,
        role: role || undefined,
        numQuestions: 5,
        timeLimitMinutes: 10,
        difficulty: 'medium',
      });
      setTestData(test);
      replace(test.questions.map(() => ({ answer: '' })));
      setStage('testing');
      toast({ title: 'Test Started!', description: 'Good luck with your assessment.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not generate the test.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmitTest(values: z.infer<typeof testSchema>) {
    if (!testData) return;
    let correctAnswers = 0;
    testData.questions.forEach((q, index) => {
      if (values.answers[index].answer === q.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setStage('results');
    toast({ title: 'Test Submitted!', description: 'Your results are ready.' });
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
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
            <Building className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold">HR360+ Candidate Assessment</h1>
        </div>

        {stage === 'info' && (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to the Aptitude Test</CardTitle>
              <CardDescription>Please fill in your details to begin. This test will help us understand your skills better. Good luck!</CardDescription>
            </CardHeader>
            <Form {...infoForm}>
              <form onSubmit={infoForm.handleSubmit(onInfoSubmit)}>
                <CardContent className="space-y-4">
                  <FormField control={infoForm.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={infoForm.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="jane.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={infoForm.control} name="contactNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Phone className="h-4 w-4" />Contact Number</FormLabel>
                      <FormControl><Input placeholder="Your contact number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={infoForm.control} name="collegeName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><School className="h-4 w-4" />College Name</FormLabel>
                      <FormControl><Input placeholder="Your college name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Proceed to Test Selection
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        )}
        
        {stage === 'selection' && (
            <Card>
                <CardHeader>
                    <CardTitle>Select Your Assessment</CardTitle>
                    <CardDescription>Choose the test you would like to take. {role && `The test will be tailored for the ${role} role.`}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div> :
                    <>
                        <TestTypeCard icon={<BookOpen className="h-8 w-8 text-blue-500" />} title="English Proficiency Test" description="Assess your language and comprehension skills." onSelect={() => onStartTest('English')} />
                        <TestTypeCard icon={<BrainCircuit className="h-8 w-8 text-purple-500" />} title="Logical Reasoning Test" description="Challenge your problem-solving and pattern-recognition abilities." onSelect={() => onStartTest('Logical')} />
                        <TestTypeCard icon={<PencilRuler className="h-8 w-8 text-green-500" />} title="Comprehensive Test" description="A mix of logical, verbal, and puzzle-based questions." onSelect={() => onStartTest('Comprehensive')} />
                    </>
                    }
                </CardContent>
            </Card>
        )}

        {stage === 'testing' && testData && (
          <Card>
            <CardHeader>
              <CardTitle>{testData.testName}</CardTitle>
              <CardDescription>{testData.testInstructions}</CardDescription>
            </CardHeader>
            <Form {...testForm}>
              <form onSubmit={testForm.handleSubmit(onSubmitTest)}>
                <CardContent className="space-y-8">
                  {fields.map((field, index) => {
                    const q = testData.questions[index];
                    return (
                        <FormField
                        key={field.id}
                        control={testForm.control}
                        name={`answers.${index}.answer`}
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel className="font-semibold">Q{index + 1}: {q.questionText}</FormLabel>
                            {q.questionImage && (
                                <div className="my-2 p-2 border rounded-md bg-white">
                                    <Image src={q.questionImage} alt={`Puzzle for Q${index+1}`} width={300} height={200} className="rounded-md mx-auto" data-ai-hint="puzzle diagram" />
                                </div>
                            )}
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
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
                        )}
                        />
                    )
                  })}
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
        )}

        {stage === 'results' && testData && (
          <Card className="text-center">
            <CardHeader>
              <Award className="mx-auto h-16 w-16 text-yellow-500" />
              <CardTitle className="mt-4">Assessment Complete!</CardTitle>
              <CardDescription>Thank you for taking the time. Here are your results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xl">You scored:</p>
              <p className="text-6xl font-bold">{score} / {testData.questions.length}</p>
              <Progress value={(score / testData.questions.length) * 100} className="w-3/4 mx-auto" />
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <p className="text-sm text-muted-foreground">Your results have been sent to our HR team.</p>
                <p className="text-sm text-muted-foreground">We will be in touch with you shortly.</p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
