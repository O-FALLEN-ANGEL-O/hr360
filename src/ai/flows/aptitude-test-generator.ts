'use server';
/**
 * @fileOverview Generates aptitude tests (Logical, English, Comprehensive) with cheating prevention, auto-scoring, and feedback.
 * This version supports role-based questions and picture puzzles.
 *
 * - generateAptitudeTest - A function that generates the aptitude test.
 * - AptitudeTestInput - The input type for the generateAptitudeTest function.
 * - AptitudeTestOutput - The return type for the generateAptitudeTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AptitudeTestInputSchema = z.object({
  topic: z.enum(['Logical', 'English', 'Comprehensive']).describe('The topic of the aptitude test.'),
  role: z.string().optional().describe('The job role the test is for, to generate role-specific questions.'),
  numQuestions: z.number().int().min(5).max(20).describe('The number of questions to generate.'),
  timeLimitMinutes: z.number().int().min(5).max(60).describe('The time limit for the test in minutes.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the test.'),
});
export type AptitudeTestInput = z.infer<typeof AptitudeTestInputSchema>;

const AptitudeTestOutputSchema = z.object({
  testName: z.string().describe('The name of the aptitude test.'),
  questions: z.array(
    z.object({
      questionText: z.string().describe('The text part of the question.'),
      questionImage: z.string().optional().describe("A base64 data URI of an image for the question, if it's a picture puzzle."),
      options: z.array(z.string()).describe('The possible answer options.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
      explanation: z.string().describe('Explanation of the correct answer.'),
    })
  ).describe('The generated questions for the aptitude test.'),
  cheatingPreventionTips: z.array(z.string()).describe('Tips to prevent cheating during the test.'),
  testInstructions: z.string().describe('Instructions for taking the test.'),
});
export type AptitudeTestOutput = z.infer<typeof AptitudeTestOutputSchema>;

export async function generateAptitudeTest(input: AptitudeTestInput): Promise<AptitudeTestOutput> {
  return generateAptitudeTestFlow(input);
}


// Internal schema for the first step: generating text content and image prompts
const TestStructureSchema = z.object({
  testName: z.string(),
  questions: z.array(
    z.object({
      questionText: z.string(),
      imagePrompt: z.string().optional().describe("A detailed text-to-image prompt for a picture puzzle. Only for visual questions."),
      options: z.array(z.string()),
      correctAnswer: z.string(),
      explanation: z.string(),
    })
  ),
  cheatingPreventionTips: z.array(z.string()),
  testInstructions: z.string(),
});


const textGenerationPrompt = ai.definePrompt({
  name: 'aptitudeTestTextPrompt',
  input: {schema: AptitudeTestInputSchema},
  output: {schema: TestStructureSchema},
  prompt: `You are an expert in creating aptitude tests for job candidates. Generate a {{#if role}}role-specific {{/if}}{{topic}} aptitude test{{#if role}} for a "{{role}}" position{{/if}} with the following specifications:

Number of Questions: {{numQuestions}}
Time Limit: {{timeLimitMinutes}} minutes
Difficulty: {{difficulty}}

The test should contain multiple-choice questions with 4 options each. Provide the correct answer and a brief explanation for each question.
Also include general cheating prevention tips for the test administrator, and instructions for the test taker.

IMPORTANT: If the topic is 'Logical' or 'Comprehensive', you MUST include at least one picture puzzle question. For any picture puzzle, provide a detailed, descriptive text-to-image prompt in the 'imagePrompt' field. The image should be a simple, clear, black and white diagram or puzzle. For non-visual questions, leave 'imagePrompt' empty.

Example for a picture puzzle:
"questionText": "Which of the following shapes completes the pattern?",
"imagePrompt": "A 3x3 grid of shapes. The first row shows a square, a circle, a triangle. The second row shows a circle, a triangle, a square. The third row shows a triangle, a square, and a question mark. Generate a simple, black and white line drawing of this grid."

Make sure the test is appropriate for the given difficulty level and topic. Adhere to the output schema strictly.
`,
});

const generateAptitudeTestFlow = ai.defineFlow(
  {
    name: 'generateAptitudeTestFlow',
    inputSchema: AptitudeTestInputSchema,
    outputSchema: AptitudeTestOutputSchema,
  },
  async (input) => {
    // Step 1: Generate the text structure of the test, including prompts for images.
    const { output: testStructure } = await textGenerationPrompt(input);
    if (!testStructure) {
      throw new Error("Failed to generate test structure.");
    }

    // Step 2: Generate images for questions that have an image prompt.
    const processedQuestions = await Promise.all(
        testStructure.questions.map(async (q) => {
            let imageUrl: string | undefined = undefined;
            if (q.imagePrompt) {
                try {
                    const { media } = await ai.generate({
                        model: 'googleai/gemini-2.0-flash-preview-image-generation',
                        prompt: q.imagePrompt,
                        config: {
                            responseModalities: ['TEXT', 'IMAGE'],
                        },
                    });
                    if (media) {
                      imageUrl = media.url;
                    }
                } catch (e) {
                    console.error("Image generation failed for prompt:", q.imagePrompt, e);
                    // Fail gracefully, the question will just not have an image.
                }
            }
            return {
                questionText: q.questionText,
                questionImage: imageUrl,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
            };
        })
    );

    // Step 3: Assemble the final output.
    return {
        testName: testStructure.testName,
        questions: processedQuestions,
        cheatingPreventionTips: testStructure.cheatingPreventionTips,
        testInstructions: testStructure.testInstructions,
    };
  }
);
