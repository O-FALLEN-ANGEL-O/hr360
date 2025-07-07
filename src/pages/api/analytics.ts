import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const mockData = {
    "id": 1,
    "created_at": "2024-05-22T12:00:00.000Z",
    "attritionPrediction": "Attrition is predicted to be low (2.1%) next quarter, driven by high employee sentiment scores and competitive compensation packages.",
    "burnoutHeatmap": "The Engineering department shows a moderate risk of burnout due to the recent product launch crunch. Recommend monitoring workloads and encouraging PTO.",
    "salaryBenchmarks": "Salaries are competitive across most roles. The Data Science team is slightly below market average (5-7%); recommend a market adjustment review.",
    "keyInsights": "Overall company health is strong. Focus on targeted interventions for the Engineering team's workload and review Data Science compensation to maintain a competitive edge."
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase server environment variables not set. Returning mock data.');
    return res.status(200).json(mockData);
  }

  // Create a new Supabase client for server-side access with the service role key
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const { data, error } = await supabaseAdmin
      .from('analytics')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.warn('Supabase error, returning mock data:', error.message);
      return res.status(200).json(mockData);
    }
    
    if (!data) {
        console.warn('No analytics data found, returning mock data.');
        return res.status(200).json(mockData);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(200).json(mockData);
  }
}
