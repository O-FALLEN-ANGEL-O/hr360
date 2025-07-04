'use server';

/**
 * @fileOverview Sentiment analyzer AI agent.
 *
 * - analyzeSentiment - A function that analyzes text sentiment to detect low morale, burnout, and toxic areas.
 * - SentimentAnalyzerInput - The input type for the analyzeSentiment function.
 * - SentimentAnalyzerOutput - The return type for the analyzeSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SentimentAnalyzerInputSchema = z.object({
  text: z
    .string()    
    .describe('The text to analyze for sentiment, morale, burnout, and toxicity.'),
});
export type SentimentAnalyzerInput = z.infer<typeof SentimentAnalyzerInputSchema>;

const SentimentAnalyzerOutputSchema = z.object({
  overallSentiment: z.string().describe('The overall sentiment of the text (e.g., positive, negative, neutral).'),
  moraleScore: z.number().describe('A score indicating the level of morale (e.g., 0-100).'),
  burnoutIndicators: z.string().describe('Indicators of burnout present in the text.'),
  toxicityLevel: z.string().describe('The level of toxicity detected in the text (e.g., high, medium, low, none).'),
});
export type SentimentAnalyzerOutput = z.infer<typeof SentimentAnalyzerOutputSchema>;

export async function analyzeSentiment(input: SentimentAnalyzerInput): Promise<SentimentAnalyzerOutput> {
  return sentimentAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sentimentAnalyzerPrompt',
  input: {schema: SentimentAnalyzerInputSchema},
  output: {schema: SentimentAnalyzerOutputSchema},
  prompt: `You are an AI sentiment analysis expert specializing in detecting morale, burnout, and toxicity in workplace communications.

  Analyze the following text and provide an assessment of the overall sentiment, morale, burnout indicators, and toxicity level.

  Text: {{{text}}}

  Consider factors such as tone, language used, and any explicit mentions of stress, negativity, or conflict.

  Output your analysis in JSON format, following this schema:
  ${JSON.stringify(SentimentAnalyzerOutputSchema.describe('JSON schema for sentiment analysis output'))}
  `,
});

const sentimentAnalyzerFlow = ai.defineFlow(
  {
    name: 'sentimentAnalyzerFlow',
    inputSchema: SentimentAnalyzerInputSchema,
    outputSchema: SentimentAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
