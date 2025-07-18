
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';

const applicantSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  resumeText: z.string().optional(),
  resumeSummary: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json();
    const parsedData = applicantSchema.safeParse(body);

    if (!parsedData.success) {
      console.error('Validation error:', parsedData.error.flatten());
      return NextResponse.json({ error: 'Invalid input', details: parsedData.error.flatten().fieldErrors }, { status: 400 });
    }
    
    const { fullName, email, phone, resumeText, resumeSummary } = parsedData.data;

    const { data, error } = await supabaseAdmin.from('applicants').insert([
      {
        full_name: fullName,
        email: email,
        phone: phone,
        resume_text: resumeText,
        resume_summary: resumeSummary,
        role: 'Walk-in Applicant',
        source: 'Walk-in Kiosk',
        status: 'New'
      }
    ]).select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Database error', message: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
        console.error('Supabase insert error: No data returned after insert.');
        return NextResponse.json({ error: 'Failed to create applicant record. No data returned.' }, { status: 500 });
    }

    return NextResponse.json(data[0]);

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
