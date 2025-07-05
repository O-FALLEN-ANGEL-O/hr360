'use server';
/**
 * @fileOverview An AI agent that processes a resume (image or text) to extract structured information.
 *
 * - processResume - A function that handles the resume processing.
 * - ProcessResumeInput - The input type for the processResume function.
 * - ProcessResumeOutput - The return type for the processResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ProcessResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. This can be an image or a document."
    ),
});
export type ProcessResumeInput = z.infer<typeof ProcessResumeInputSchema>;

export const ProcessResumeOutputSchema = z.object({
  fullName: z.string().describe("The full name of the applicant."),
  email: z.string().describe("The primary email address of the applicant."),
  phone: z.string().describe("The primary phone number of the applicant."),
  summary: z.string().describe("A brief, two-sentence summary of the applicant's profile."),
  rawText: z.string().describe("The full, raw text extracted from the resume."),
});
export type ProcessResumeOutput = z.infer<typeof ProcessResumeOutputSchema>;

export async function processResume(input: ProcessResumeInput): Promise<ProcessResumeOutput> {
  return processResumeFlow(input);
}

const processResumePrompt = ai.definePrompt({
  name: 'processResumePrompt',
  input: {schema: ProcessResumeInputSchema},
  output: {schema: ProcessResumeOutputSchema},
  prompt: `You are an expert HR data entry assistant. Your task is to extract key information from the provided resume.

  Analyze the resume and extract the applicant's full name, email address, phone number, and create a concise two-sentence summary of their professional profile. Also, provide the full raw text from the resume.

  If a piece of information (like a phone number) is not available, return an empty string for that field.

  Resume Document:
  {{media url=resumeDataUri}}
  `,
});

const processResumeFlow = ai.defineFlow(
  {
    name: 'processResumeFlow',
    inputSchema: ProcessResumeInputSchema,
    outputSchema: ProcessResumeOutputSchema,
  },
  async input => {
    const {output} = await processResumePrompt(input);
    return output!;
  }
);
