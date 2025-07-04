'use server';
/**
 * @fileOverview Implements a flow that matches job descriptions against a resume using a GPT tool.
 *
 * - matchJobToResume - A function that takes a job description and resume as input, and returns a match score.
 * - MatchJobToResumeInput - The input type for the matchJobToResume function.
 * - MatchJobToResumeOutput - The return type for the matchJobToResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchJobToResumeInputSchema = z.object({
  jobDescription: z.string().describe('The job description to match against.'),
  resume: z.string().describe('The resume to use for matching.'),
});
export type MatchJobToResumeInput = z.infer<typeof MatchJobToResumeInputSchema>;

const MatchJobToResumeOutputSchema = z.object({
  matchCategory: z
    .enum(['Perfect Match', 'Good Fit', 'Low Match'])
    .describe("The match category based on the job description and resume."),
  matchScore: z.number().describe('A numerical score representing the match quality (0-100).'),
  reasoning: z.string().describe('Explanation of why this match score was assigned'),
});
export type MatchJobToResumeOutput = z.infer<typeof MatchJobToResumeOutputSchema>;

export async function matchJobToResume(input: MatchJobToResumeInput): Promise<MatchJobToResumeOutput> {
  return matchJobToResumeFlow(input);
}

const matchJobToResumePrompt = ai.definePrompt({
  name: 'matchJobToResumePrompt',
  input: {schema: MatchJobToResumeInputSchema},
  output: {schema: MatchJobToResumeOutputSchema},
  prompt: `You are an expert HR assistant who is responsible for matching resumes to job descriptions.

You will receive a job description and a resume.

Based on the job description and resume, provide a matchCategory of "Perfect Match", "Good Fit", or "Low Match".
Also, provide a numerical matchScore between 0 and 100.

Job Description: {{{jobDescription}}}
Resume: {{{resume}}}

Consider the following when assigning the matchCategory and matchScore:
- Skills and experience
- Education
- Keywords
- Overall fit

Output the reasoning for your category and score.
`,
});

const matchJobToResumeFlow = ai.defineFlow(
  {
    name: 'matchJobToResumeFlow',
    inputSchema: MatchJobToResumeInputSchema,
    outputSchema: MatchJobToResumeOutputSchema,
  },
  async input => {
    const {output} = await matchJobToResumePrompt(input);
    return output!;
  }
);
