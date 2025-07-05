'use server';

/**
 * @fileOverview An AI agent that predicts career growth for an employee.
 *
 * - predictCareerGrowth - A function that handles the career growth prediction process.
 * - PredictCareerGrowthInput - The input type for the predictCareerGrowth function.
 * - PredictCareerGrowthOutput - The return type for the predictCareerGrowth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictCareerGrowthInputSchema = z.object({
  currentRole: z.string().describe("The employee's current role."),
  skills: z.array(z.string()).describe("A list of the employee's current skills."),
  performanceReview: z.string().describe("A summary of the employee's latest performance review."),
  careerAspirations: z.string().describe("The employee's stated career aspirations."),
});
export type PredictCareerGrowthInput = z.infer<typeof PredictCareerGrowthInputSchema>;

const PredictedStepSchema = z.object({
    role: z.string().describe("The predicted future role."),
    timeline: z.string().describe("An estimated timeline to achieve this role (e.g., '1-2 years')."),
    requiredSkills: z.array(z.string()).describe("Key skills to develop for this role."),
    suggestedMentor: z.string().describe("A suggested type of mentor or specific person if applicable."),
  });

const PredictCareerGrowthOutputSchema = z.object({
  predictedPath: z.array(PredictedStepSchema).describe("A timeline chart of predicted future roles, skill upgrades, and mentors."),
});
export type PredictCareerGrowthOutput = z.infer<typeof PredictCareerGrowthOutputSchema>;

export async function predictCareerGrowth(input: PredictCareerGrowthInput): Promise<PredictCareerGrowthOutput> {
  return predictCareerGrowthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictCareerGrowthPrompt',
  input: {schema: PredictCareerGrowthInputSchema},
  output: {schema: PredictCareerGrowthOutputSchema},
  prompt: `You are an expert career development advisor in a large tech MNC.
  
  Based on the employee's current role, skills, performance, and aspirations, predict a realistic and ambitious career growth path for them within the company for the next 5-7 years.

  Employee Details:
  - Current Role: {{{currentRole}}}
  - Current Skills: {{#each skills}}- {{{this}}} {{/each}}
  - Latest Performance Review: {{{performanceReview}}}
  - Career Aspirations: {{{careerAspirations}}}

  Please generate a list of 2-3 future roles, each with a timeline, required skills to acquire, and a suggestion for a mentor.
  `,
});

const predictCareerGrowthFlow = ai.defineFlow(
  {
    name: 'predictCareerGrowthFlow',
    inputSchema: PredictCareerGrowthInputSchema,
    outputSchema: PredictCareerGrowthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
