
'use server';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const mockData = {
    "id": 1,
    "created_at": "2024-05-22T12:00:00.000Z",
    "attritionPrediction": "Attrition is predicted to be low (2.1%) next quarter, driven by high employee sentiment scores and competitive compensation packages.",
    "burnoutHeatmap": "The Engineering department shows a moderate risk of burnout due to the recent product launch crunch. Recommend monitoring workloads and encouraging PTO.",
    "salaryBenchmarks": "Salaries are competitive across most roles. The Data Science team is slightly below market average (5-7%); recommend a market adjustment review.",
    "keyInsights": "Overall company health is strong. Focus on targeted interventions for the Engineering team's workload and review Data Science compensation to maintain a competitive edge."
};

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase server environment variables not set. Returning mock data.');
      return NextResponse.json(mockData);
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error, status } = await supabaseAdmin
      .from('analytics')
      .select('*')
      .limit(1)
      .single();

    // A status of 406 from .single() means no rows were found, which is not a fatal error.
    if (error && status !== 406) {
      console.error('Supabase query error in /api/analytics:', error);
      console.warn('Returning mock analytics data due to Supabase error.');
      return NextResponse.json(mockData);
    }

    if (!data) {
      console.warn('No analytics data found in database, returning mock data.');
      return NextResponse.json(mockData);
    }

    return NextResponse.json(data);
  } catch (e) {
    const error = e as Error;
    console.error('Fatal error in /api/analytics handler:', error);
    return new NextResponse(
      JSON.stringify({
        message: 'An internal server error occurred while fetching analytics data.',
        error: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
