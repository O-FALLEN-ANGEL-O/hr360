"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generateAptitudeTest, type AptitudeTestOutput } from '@/ai/flows/aptitude-test-generator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, CheckCircle, Award, Building } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';

const infoSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Please enter a valid email."),
});

const testSchema = z.object({
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string().min(1, "Please select an answer."),
  })),
});

type Stage = 'info' | 'testing' | 'results';

export default function AssessmentPage() {
  const [stage, setStage] = useState<Stage>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState<AptitudeTestOutput | null>(null);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const infoForm = useForm<z.infer<typeof infoSchema>>({
    resolver: zodResolver(infoSchema),
    defaultValues: { name: '', email: '' },
  });

  const testForm = useForm<z.infer<typeof testSchema>>({
    resolver: zodResolver(testSchema),
    defaultValues: { answers: [] },
  });
  const { replace } = useFieldArray({
    control: testForm.control,
    name: "answers"
  });

  async function onStartTest() {
    setIsLoading(true);
    try {
      const test = await generateAptitudeTest({
        topic: 'Logical',
        numQuestions: 5,
        timeLimitMinutes: 10,
        difficulty: 'medium',
      });
      setTestData(test);
      replace(test.questions.map(q => ({ question: q.question, answer: '' })));
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
              <CardTitle>Welcome!</CardTitle>
              <CardDescription>Please provide your basic information to begin the assessment.</CardDescription>
            </CardHeader>
            <Form {...infoForm}>
              <form onSubmit={infoForm.handleSubmit(onStartTest)}>
                <CardContent className="space-y-4">
                  <FormField control={infoForm.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={infoForm.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="jane.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                    Start Assessment
                  </Button>
                </CardFooter>
              </form>
            </Form>
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
                  {testData.questions.map((q, index) => (
                    <FormField
                      key={index}
                      control={testForm.control}
                      name={`answers.${index}.answer`}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-semibold">Q{index + 1}: {q.question}</FormLabel>
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
