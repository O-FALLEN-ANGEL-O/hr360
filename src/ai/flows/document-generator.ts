// src/ai/flows/document-generator.ts
'use server';
/**
 * @fileOverview A document generator AI agent.
 *
 * - generateDocument - A function that handles the document generation process.
 * - GenerateDocumentInput - The input type for the generateDocument function.
 * - GenerateDocumentOutput - The return type for the generateDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocumentInputSchema = z.object({
  documentType: z.enum(['offerLetter', 'memo']).describe('The type of document to generate.'),
  templateData: z.record(z.string()).describe('The data to populate the document template with.'),
  additionalInstructions: z.string().optional().describe('Any additional instructions for generating the document.'),
});
export type GenerateDocumentInput = z.infer<typeof GenerateDocumentInputSchema>;

const GenerateDocumentOutputSchema = z.object({
  documentContent: z.string().describe('The generated document content.'),
});
export type GenerateDocumentOutput = z.infer<typeof GenerateDocumentOutputSchema>;

export async function generateDocument(input: GenerateDocumentInput): Promise<GenerateDocumentOutput> {
  return generateDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDocumentPrompt',
  input: {schema: GenerateDocumentInputSchema},
  output: {schema: GenerateDocumentOutputSchema},
  prompt: `You are an expert HR document generator.

You will generate a document based on the provided document type and template data.

Document Type: {{{documentType}}}
Template Data: {{{templateData}}}
Additional Instructions: {{{additionalInstructions}}}

Please generate the document content.`, 
});

const generateDocumentFlow = ai.defineFlow(
  {
    name: 'generateDocumentFlow',
    inputSchema: GenerateDocumentInputSchema,
    outputSchema: GenerateDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
