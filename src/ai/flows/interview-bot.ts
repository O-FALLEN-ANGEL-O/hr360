// use server'
'use server';
/**
 * @fileOverview Interview question generator and evaluator.
 *
 * - generateAndEvaluateInterview - A function that handles the generation of interview questions, and evaluation of responses.
 * - GenerateAndEvaluateInterviewInput - The input type for the generateAndEvaluateInterview function.
 * - GenerateAndEvaluateInterviewOutput - The return type for the generateAndEvaluateInterview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAndEvaluateInterviewInputSchema = z.object({
  jobDescription: z.string().describe('The job description for the role.'),
  candidateResume: z.string().describe('The candidate\'s resume.'),
  candidateResponse: z.string().optional().describe('The candidate\'s response to the video question.'),
});
export type GenerateAndEvaluateInterviewInput = z.infer<
  typeof GenerateAndEvaluateInterviewInputSchema
>;

const GenerateAndEvaluateInterviewOutputSchema = z.object({
  mcqQuestions: z
    .array(z.string())
    .describe('Array of multiple-choice questions.'),
  videoQuestion: z.string().describe('A video question for the candidate.'),
  evaluation: z.string().optional().describe('Evaluation of the candidate\'s response to the video question.'),
});
export type GenerateAndEvaluateInterviewOutput = z.infer<
  typeof GenerateAndEvaluateInterviewOutputSchema
>;

export async function generateAndEvaluateInterview(
  input: GenerateAndEvaluateInterviewInput
): Promise<GenerateAndEvaluateInterviewOutput> {
  return generateAndEvaluateInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAndEvaluateInterviewPrompt',
  input: {schema: GenerateAndEvaluateInterviewInputSchema},
  output: {schema: GenerateAndEvaluateInterviewOutputSchema},
  prompt: `You are an expert HR assistant specializing in conducting interviews.

You will generate multiple-choice questions (MCQ) and a video question for a candidate based on their resume and the job description.
If the candidate has already responded to the video question, you will evaluate their response.

Job Description: {{{jobDescription}}}
Candidate Resume: {{{candidateResume}}}
Candidate Response: {{{candidateResponse}}}

Output the MCQ questions in an array. Output the video question as a string.
If the candidate response is provided, evaluate the response and provide feedback.
`,
});

const generateAndEvaluateInterviewFlow = ai.defineFlow(
  {
    name: 'generateAndEvaluateInterviewFlow',
    inputSchema: GenerateAndEvaluateInterviewInputSchema,
    outputSchema: GenerateAndEvaluateInterviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
