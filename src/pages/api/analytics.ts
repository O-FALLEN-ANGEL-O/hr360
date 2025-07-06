import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

const mockData = [
    {
        "id": 1,
        "created_at": "2024-05-22T12:00:00.000Z",
        "attritionPrediction": "Attrition is predicted to be low (2.1%) next quarter, driven by high employee sentiment scores and competitive compensation packages.",
        "burnoutHeatmap": "The Engineering department shows a moderate risk of burnout due to the recent product launch crunch. Recommend monitoring workloads and encouraging PTO.",
        "salaryBenchmarks": "Salaries are competitive across most roles. The Data Science team is slightly below market average (5-7%); recommend a market adjustment review.",
        "keyInsights": "Overall company health is strong. Focus on targeted interventions for the Engineering team's workload and review Data Science compensation to maintain a competitive edge."
    }
];


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Example: Fetch analytics data from a table named 'analytics'
    const { data, error } = await supabase.from('analytics').select('*').limit(1).single();

    if (error) {
      console.warn('Supabase error, returning mock data:', error.message);
      // If there's an error (e.g., table not found), return mock data
      return res.status(200).json(mockData[0]);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
     // Fallback to mock data in case of any other server error
    res.status(200).json(mockData[0]);
  }
}
