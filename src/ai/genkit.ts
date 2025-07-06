import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Add a check to ensure the API key is set during development.
// This will not run in production, where environment variables are expected to be set on the server.
if (process.env.NODE_ENV !== 'production' && !process.env.GOOGLE_API_KEY) {
  console.warn(
    '\n\n⚠️ GOOGLE_API_KEY is not set. AI features will not work. ⚠️\n' +
      'Please create a .env.local file in the root directory and add:\n' +
      'GOOGLE_API_KEY="your-google-api-key"\n' +
      'You can get a key from Google AI Studio: https://aistudio.google.com/app/apikey\n\n'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      // The API key is automatically picked up from the GOOGLE_API_KEY environment variable.
      // You can explicitly pass it here if needed, e.g., apiKey: process.env.GOOGLE_API_KEY
    }),
  ],
  // Set a more capable default model for all AI flows.
  // Flows that need specific models (like for image generation) will override this.
  model: 'googleai/gemini-1.5-flash',
});
