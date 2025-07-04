// predictive-analytics-dashboard.ts
'use server';

/**
 * @fileOverview Generates predictive analytics dashboard content including attrition prediction,
 * burnout heatmaps, and salary benchmarks.
 *
 * - generatePredictiveAnalyticsDashboard - A function that generates content for a predictive analytics dashboard.
 * - PredictiveAnalyticsDashboardInput - The input type for the generatePredictiveAnalyticsDashboard function.
 * - PredictiveAnalyticsDashboardOutput - The return type for the generatePredictiveAnalyticsDashboard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveAnalyticsDashboardInputSchema = z.object({
  companyData: z.string().describe('Aggregated HR data for the company, including employee demographics, performance reviews, salary information, and exit interviews.'),
  industryBenchmarks: z.string().describe('Industry benchmarks for attrition rates, salary ranges, and employee engagement scores.'),
  economicIndicators: z.string().describe('Relevant economic indicators that may impact attrition and salary trends.'),
});
export type PredictiveAnalyticsDashboardInput = z.infer<typeof PredictiveAnalyticsDashboardInputSchema>;

const PredictiveAnalyticsDashboardOutputSchema = z.object({
  attritionPrediction: z.string().describe('Predicted attrition rate for the next quarter, with explanations of key factors.'),
  burnoutHeatmap: z.string().describe('Analysis of burnout risk across different departments or teams, highlighting potential problem areas.'),
  salaryBenchmarks: z.string().describe('Comparison of company salaries to industry benchmarks, identifying areas where salaries may be uncompetitive.'),
  keyInsights: z.string().describe('Summary of key insights and recommendations for HR based on the predictive analytics.'),
});
export type PredictiveAnalyticsDashboardOutput = z.infer<typeof PredictiveAnalyticsDashboardOutputSchema>;

export async function generatePredictiveAnalyticsDashboard(input: PredictiveAnalyticsDashboardInput): Promise<PredictiveAnalyticsDashboardOutput> {
  return predictiveAnalyticsDashboardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictiveAnalyticsDashboardPrompt',
  input: {schema: PredictiveAnalyticsDashboardInputSchema},
  output: {schema: PredictiveAnalyticsDashboardOutputSchema},
  prompt: `You are an expert HR analyst. Generate a predictive analytics dashboard based on the provided data.

  Company Data: {{{companyData}}}
  Industry Benchmarks: {{{industryBenchmarks}}}
  Economic Indicators: {{{economicIndicators}}}

  Your analysis should include:
  - Attrition Prediction: Predict the attrition rate for the next quarter, explaining the key factors influencing the prediction.
  - Burnout Heatmap: Analyze burnout risk across different departments or teams, highlighting potential problem areas.
  - Salary Benchmarks: Compare company salaries to industry benchmarks, identifying areas where salaries may be uncompetitive.
  - Key Insights: Provide a summary of key insights and recommendations for HR based on the predictive analytics.
  `,
});

const predictiveAnalyticsDashboardFlow = ai.defineFlow(
  {
    name: 'predictiveAnalyticsDashboardFlow',
    inputSchema: PredictiveAnalyticsDashboardInputSchema,
    outputSchema: PredictiveAnalyticsDashboardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
