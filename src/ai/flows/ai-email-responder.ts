'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically sending personalized emails to potential employers.
 *
 * - aiEmailResponder - A function that triggers the email sending flow.
 * - AiEmailResponderInput - The input type for the aiEmailResponder function.
 * - AiEmailResponderOutput - The return type for the aiEmailResponder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiEmailResponderInputSchema = z.object({
  jobDescription: z.string().describe('The full job description of the position.'),
  resume: z.string().describe('The applicant\'s resume text.'),
  coverLetter: z.string().describe('The applicant\'s cover letter text.'),
  companyName: z.string().describe('The name of the company.'),
  jobTitle: z.string().describe('The title of the job being applied for.'),
  recipientEmail: z.string().email().describe('The email address of the recipient.'),
  senderName: z.string().describe('The name of the sender.'),
  senderEmail: z.string().email().describe('The email address of the sender.'),
  customSignature: z.string().describe('The custom email signature to include.'),
});

export type AiEmailResponderInput = z.infer<typeof AiEmailResponderInputSchema>;

const AiEmailResponderOutputSchema = z.object({
  emailContent: z.string().describe('The complete content of the email to be sent.'),
});

export type AiEmailResponderOutput = z.infer<typeof AiEmailResponderOutputSchema>;

export async function aiEmailResponder(input: AiEmailResponderInput): Promise<AiEmailResponderOutput> {
  return aiEmailResponderFlow(input);
}

const aiEmailResponderPrompt = ai.definePrompt({
  name: 'aiEmailResponderPrompt',
  input: {schema: AiEmailResponderInputSchema},
  output: {schema: AiEmailResponderOutputSchema},
  prompt: `You are an AI-powered email assistant designed to craft personalized emails to potential employers.

  Given the job description, resume, and cover letter, create a compelling and tailored email that increases the chances of the applicant getting an interview. The email should include a custom signature at the end. The email should be polite and professional.

  Job Description: {{{jobDescription}}}
  Resume: {{{resume}}}
  Cover Letter: {{{coverLetter}}}
  Company Name: {{{companyName}}}
  Job Title: {{{jobTitle}}}
  Sender Name: {{{senderName}}}
  Custom Signature: {{{customSignature}}}

  Please generate the full email content, including a subject line.
  `,
});

const aiEmailResponderFlow = ai.defineFlow(
  {
    name: 'aiEmailResponderFlow',
    inputSchema: AiEmailResponderInputSchema,
    outputSchema: AiEmailResponderOutputSchema,
  },
  async input => {
    const {output} = await aiEmailResponderPrompt(input);
    return output!;
  }
);
