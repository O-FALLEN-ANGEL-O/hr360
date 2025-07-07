
'use server';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

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
    const supabaseAdmin = createAdminClient();

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
    console.error('Fatal error in /api/analytics handler, falling back to mock data:', error);
    return NextResponse.json(mockData);
  }
}
