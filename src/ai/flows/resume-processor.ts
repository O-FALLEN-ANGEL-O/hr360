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

const ProcessResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. This can be an image or a document."
    ),
});
export type ProcessResumeInput = z.infer<typeof ProcessResumeInputSchema>;

const ProcessResumeOutputSchema = z.object({
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
  prompt: `You are an expert HR data entry assistant specializing in processing resumes from images, which may be of poor quality (e.g., skewed, poorly lit, or containing background noise). Your task is to intelligently analyze the provided resume image, perform any necessary corrections in your interpretation to read the text accurately, and extract key information.

  Extract the applicant's full name, email address, and phone number. Also create a concise two-sentence summary of their professional profile and provide the full, raw text you extracted from the resume.

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
