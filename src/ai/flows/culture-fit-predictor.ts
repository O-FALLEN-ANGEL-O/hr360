'use server';

/**
 * @fileOverview Culture fit predictor AI agent.
 *
 * - predictCultureFit - A function that handles the culture fit prediction process.
 * - PredictCultureFitInput - The input type for the predictCultureFit function.
 * - PredictCultureFitOutput - The return type for the predictCultureFit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictCultureFitInputSchema = z.object({
  candidateBehavior: z
    .string()
    .describe("Description of the candidate's observed behavior."),
  preHireAnswers: z
    .string()
    .describe('The candidate pre-hire answers to values based questions.'),
  companyValues: z.string().describe('The company values.'),
});
export type PredictCultureFitInput = z.infer<typeof PredictCultureFitInputSchema>;

const PredictCultureFitOutputSchema = z.object({
  cultureFitScore: z
    .number()
    .describe(
      'A score from 0 to 1 indicating the likelihood of the candidate fitting the company culture.'
    ),
  justification: z
    .string()
    .describe(
      'Explanation of why the candidate is, or is not, a good culture fit.'
    ),
});
export type PredictCultureFitOutput = z.infer<typeof PredictCultureFitOutputSchema>;

export async function predictCultureFit(
  input: PredictCultureFitInput
): Promise<PredictCultureFitOutput> {
  return predictCultureFitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictCultureFitPrompt',
  input: {schema: PredictCultureFitInputSchema},
  output: {schema: PredictCultureFitOutputSchema},
  prompt: `You are an expert HR consultant specializing in assessing culture fit between candidates and companies.

  Given the following information about a candidate's behavior, their pre-hire answers, and the company's values, determine a culture fit score (0-1) and justify your assessment.

  Candidate Behavior: {{{candidateBehavior}}}
  Pre-Hire Answers: {{{preHireAnswers}}}
  Company Values: {{{companyValues}}}

  Provide the culture fit score and justification based on your expert assessment.

  Format your response as a JSON object that matches the following schema:
  {
    "cultureFitScore": number,
    "justification": string
  }`,
});

const predictCultureFitFlow = ai.defineFlow(
  {
    name: 'predictCultureFitFlow',
    inputSchema: PredictCultureFitInputSchema,
    outputSchema: PredictCultureFitOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
