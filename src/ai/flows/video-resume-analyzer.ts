// src/ai/flows/video-resume-analyzer.ts
'use server';

/**
 * @fileOverview Analyzes video resumes to assess candidate confidence, clarity, and tone.
 *
 * - analyzeVideoResume - A function that handles the video resume analysis process.
 * - AnalyzeVideoResumeInput - The input type for the analyzeVideoResume function.
 * - AnalyzeVideoResumeOutput - The return type for the analyzeVideoResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVideoResumeInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeVideoResumeInput = z.infer<typeof AnalyzeVideoResumeInputSchema>;

const AnalyzeVideoResumeOutputSchema = z.object({
  confidence: z
    .number()
    .describe('A rating of the candidate\'s confidence, from 0 to 1.'),
  clarity: z
    .number()
    .describe('A rating of the candidate\'s clarity of speech, from 0 to 1.'),
  tone: z
    .number()
    .describe('A rating of the candidate\'s tone and enthusiasm, from 0 to 1.'),
  summary: z
    .string()
    .describe('A summary of the video resume, including areas for improvement.'),
});
export type AnalyzeVideoResumeOutput = z.infer<typeof AnalyzeVideoResumeOutputSchema>;

export async function analyzeVideoResume(
  input: AnalyzeVideoResumeInput
): Promise<AnalyzeVideoResumeOutput> {
  return analyzeVideoResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVideoResumePrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: AnalyzeVideoResumeInputSchema},
  output: {schema: AnalyzeVideoResumeOutputSchema},
  prompt: `You are an expert HR video resume analyzer.

You will watch the video and rate the candidate's confidence, clarity, and tone from their introductory videos. All ratings should be from 0 to 1.

Consider these factors:

Confidence: Posture, eye contact, nervousness, and overall self-assuredness.
Clarity: Enunciation, pace, and the ability to clearly articulate thoughts.
Tone: Enthusiasm, warmth, and the ability to engage the viewer.


Based on these ratings, provide an actionable summary to the candidate with areas for improvement. The summary should be concise and to the point.

Video: {{media url=videoDataUri}}`,
});

const analyzeVideoResumeFlow = ai.defineFlow(
  {
    name: 'analyzeVideoResumeFlow',
    inputSchema: AnalyzeVideoResumeInputSchema,
    outputSchema: AnalyzeVideoResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
