'use server';

/**
 * @fileOverview Generates role-specific typing test content.
 *
 * - generateTypingTest - A function that creates a paragraph for a typing test.
 * - GenerateTypingTestInput - The input type for the generateTypingTest function.
 * - GenerateTypingTestOutput - The return type for the generateTypingTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTypingTestInputSchema = z.object({
  jobRole: z.string().describe('The job role the typing test is for, to generate role-specific content.'),
});
export type GenerateTypingTestInput = z.infer<typeof GenerateTypingTestInputSchema>;

const GenerateTypingTestOutputSchema = z.object({
  testContent: z.string().describe('A paragraph of text (approx. 300-400 characters) for the typing test, containing vocabulary and concepts relevant to the specified job role.'),
});
export type GenerateTypingTestOutput = z.infer<typeof GenerateTypingTestOutputSchema>;

export async function generateTypingTest(input: GenerateTypingTestInput): Promise<GenerateTypingTestOutput> {
  return generateTypingTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'typingTestPrompt',
  input: {schema: GenerateTypingTestInputSchema},
  output: {schema: GenerateTypingTestOutputSchema},
  prompt: `You are an expert in creating professional skills assessments. Your task is to generate a single, coherent paragraph of text to be used for a typing test.

The paragraph should be approximately 300-400 characters long. It must be tailored to the specific job role provided. It should include relevant terminology, concepts, and scenarios that a person in that role would encounter. Do not use markdown or special formatting.

Job Role: {{{jobRole}}}
`,
});

const generateTypingTestFlow = ai.defineFlow(
  {
    name: 'generateTypingTestFlow',
    inputSchema: GenerateTypingTestInputSchema,
    outputSchema: GenerateTypingTestOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
