'use server';

/**
 * @fileOverview This file defines a Genkit flow for an AI assistant that helps HR managers compose professional emails to candidates.
 *
 * - aiEmailResponder - A function that triggers the email composition flow.
 * - AiEmailResponderInput - The input type for the aiEmailResponder function.
 * - AiEmailResponderOutput - The return type for the aiEmailResponder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiEmailResponderInputSchema = z.object({
  applicantName: z.string().describe("The name of the job applicant."),
  jobTitle: z.string().describe('The title of the job being applied for.'),
  companyName: z.string().describe('The name of the company.'),
  recipientEmail: z.string().email().describe('The email address of the applicant.'),
  communicationContext: z.enum(['Invitation to Interview', 'Polite Rejection', 'Request for Information']).describe('The context of the communication.'),
});

export type AiEmailResponderInput = z.infer<typeof AiEmailResponderInputSchema>;

const AiEmailResponderOutputSchema = z.object({
  emailContent: z.string().describe('The complete content of the email to be sent, including a subject line.'),
});

export type AiEmailResponderOutput = z.infer<typeof AiEmailResponderOutputSchema>;

export async function aiEmailResponder(input: AiEmailResponderInput): Promise<AiEmailResponderOutput> {
  return aiEmailComposerFlow(input);
}

const aiEmailComposerPrompt = ai.definePrompt({
  name: 'aiEmailComposerPrompt',
  input: {schema: AiEmailResponderInputSchema},
  output: {schema: AiEmailResponderOutputSchema},
  prompt: `You are an expert HR communications assistant for a major multinational corporation, "{{companyName}}". Your task is to draft a professional, clear, and empathetic email to a job applicant.

The email should be tailored to the specific context provided.

Context for the email: {{{communicationContext}}}

Applicant Details:
- Name: {{{applicantName}}}
- Applied for: {{{jobTitle}}}
- Recipient Email: {{{recipientEmail}}}

Based on the context, please generate the full email content, including an appropriate subject line.

- If the context is 'Invitation to Interview', the email should be enthusiastic and clear, suggesting next steps for scheduling.
- If the context is 'Polite Rejection', the email must be empathetic and respectful, thanking the applicant for their interest and time, while clearly stating that they will not be moving forward in the process. Do not give false hope.
- If the context is 'Request for Information', clearly state what additional information is needed from the applicant.
`,
});

const aiEmailComposerFlow = ai.defineFlow(
  {
    name: 'aiEmailComposerFlow',
    inputSchema: AiEmailResponderInputSchema,
    outputSchema: AiEmailResponderOutputSchema,
  },
  async input => {
    const {output} = await aiEmailComposerPrompt(input);
    return output!;
  }
);
