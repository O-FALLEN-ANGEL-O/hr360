'use server';

/**
 * @fileOverview An AI agent that converts user information into an ATS-optimized resume.
 *
 * - smartResumeBuilder - A function that handles the resume building process.
 * - SmartResumeBuilderInput - The input type for the smartResumeBuilder function.
 * - SmartResumeBuilderOutput - The return type for the smartResumeBuilder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartResumeBuilderInputSchema = z.object({
  userInfo: z
    .string()
    .describe('User information including name, contact details, skills, experience, and education.'),
  format: z.enum(['pdf', 'html']).describe('The desired format for the resume (PDF or HTML).'),
});
export type SmartResumeBuilderInput = z.infer<typeof SmartResumeBuilderInputSchema>;

const SmartResumeBuilderOutputSchema = z.object({
  resumeContent: z.string().describe('The generated resume content in the specified format.'),
});
export type SmartResumeBuilderOutput = z.infer<typeof SmartResumeBuilderOutputSchema>;

export async function smartResumeBuilder(input: SmartResumeBuilderInput): Promise<SmartResumeBuilderOutput> {
  return smartResumeBuilderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartResumeBuilderPrompt',
  input: {schema: SmartResumeBuilderInputSchema},
  output: {schema: SmartResumeBuilderOutputSchema},
  prompt: `You are an expert resume writer specializing in creating ATS-optimized resumes.

You will use the provided user information to generate a resume in the specified format that is tailored for Applicant Tracking Systems (ATS).

User Information:
{{{userInfo}}}

Desired Format: {{{format}}}

Ensure the resume is well-structured, uses relevant keywords, and highlights the user's skills and experience effectively.

{{#eq format "pdf"}}
Return the resume content as a plain text representation suitable for conversion to PDF.
{{else}}
Return the resume content as HTML.
{{/eq}}`,
});

const smartResumeBuilderFlow = ai.defineFlow(
  {
    name: 'smartResumeBuilderFlow',
    inputSchema: SmartResumeBuilderInputSchema,
    outputSchema: SmartResumeBuilderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
