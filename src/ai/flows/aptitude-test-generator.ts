'use server';
/**
 * @fileOverview Generates aptitude tests (Logical, Tech, English) with cheating prevention, auto-scoring, and feedback.
 *
 * - generateAptitudeTest - A function that generates the aptitude test.
 * - AptitudeTestInput - The input type for the generateAptitudeTest function.
 * - AptitudeTestOutput - The return type for the generateAptitudeTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AptitudeTestInputSchema = z.object({
  topic: z.enum(['Logical', 'Tech', 'English']).describe('The topic of the aptitude test.'),
  numQuestions: z.number().int().min(5).max(20).describe('The number of questions to generate.'),
  timeLimitMinutes: z.number().int().min(5).max(60).describe('The time limit for the test in minutes.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the test.'),
});
export type AptitudeTestInput = z.infer<typeof AptitudeTestInputSchema>;

const AptitudeTestOutputSchema = z.object({
  testName: z.string().describe('The name of the aptitude test.'),
  questions: z.array(
    z.object({
      question: z.string().describe('The question text.'),
      options: z.array(z.string()).describe('The possible answer options.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
      explanation: z.string().describe('Explanation of the correct answer.'),
    })
  ).describe('The generated questions for the aptitude test.'),
  cheatingPreventionTips: z.array(z.string()).describe('Tips to prevent cheating during the test.'),
  testInstructions: z.string().describe('Instructions for taking the test.'),
});
export type AptitudeTestOutput = z.infer<typeof AptitudeTestOutputSchema>;

export async function generateAptitudeTest(input: AptitudeTestInput): Promise<AptitudeTestOutput> {
  return generateAptitudeTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aptitudeTestPrompt',
  input: {schema: AptitudeTestInputSchema},
  output: {schema: AptitudeTestOutputSchema},
  prompt: `You are an expert in creating aptitude tests. Generate a {{topic}} aptitude test with the following specifications:

Number of Questions: {{numQuestions}}
Time Limit: {{timeLimitMinutes}} minutes
Difficulty: {{difficulty}}

Include multiple-choice questions with 4 options each. Provide the correct answer and a brief explanation for each question.
Also include cheating prevention tips for the test administrator, and instructions for the test taker.

Make sure the test is appropriate for the given difficulty level and topic. Adhere to the output schema strictly.

Considerations for Cheating Prevention:
*   Randomize question order and answer options.
*   Use a secure testing platform that prevents screen sharing or accessing other applications.
*   Monitor candidates during the test using webcams.
*   Set a timer and display it prominently.
*   Include a mix of question types to assess different skills.
*   Provide unique questions to each candidate if possible.
`,
});

const generateAptitudeTestFlow = ai.defineFlow(
  {
    name: 'generateAptitudeTestFlow',
    inputSchema: AptitudeTestInputSchema,
    outputSchema: AptitudeTestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
