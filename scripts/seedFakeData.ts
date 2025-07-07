
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Ensure environment variables are loaded
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or Service Role Key is missing from environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  console.log('Starting to seed database...');

  // 1. Seed Employees
  console.log('Seeding employees...');
  const { data: employees, error: empError } = await supabase.from('employees').upsert([
    { id: 1, name: 'Alice Johnson', role: 'Software Engineer', status: 'Remote', avatar_url: 'https://placehold.co/100x100.png?text=AJ', email: 'alice.j@hr360.com' },
    { id: 2, name: 'Bob Williams', role: 'Product Manager', status: 'Office', avatar_url: 'https://placehold.co/100x100.png?text=BW', email: 'bob.w@hr360.com' },
    { id: 3, name: 'Charlie Brown', role: 'UX Designer', status: 'Leave', avatar_url: 'https://placehold.co/100x100.png?text=CB', email: 'charlie.b@hr360.com' },
    { id: 4, name: 'Diana Miller', role: 'Data Scientist', status: 'Remote', avatar_url: 'https://placehold.co/100x100.png?text=DM', email: 'diana.m@hr360.com' },
    { id: 5, name: 'Ethan Davis', role: 'DevOps Engineer', status: 'Probation', avatar_url: 'https://placehold.co/100x100.png?text=ED', email: 'ethan.d@hr360.com' },
  ], { onConflict: 'email' }).select();
  if (empError) console.error('Error seeding employees:', empError.message);
  else console.log(`${employees?.length || 0} employees seeded.`);

  // 2. Seed Applicants
  console.log('Seeding applicants...');
  const { data: applicants, error: appError } = await supabase.from('applicants').upsert([
    { full_name: 'Charlie Davis', email: 'charlie.d@example.com', phone: '+1234567890', status: 'Pending Review', role: 'Chat Support', source: 'Email', college: 'State University', resume_summary: 'Experienced chat support specialist with a track record of high customer satisfaction scores.' },
    { full_name: 'Diana Smith', email: 'diana.s@example.com', phone: '+1987654321', status: 'Interview Scheduled', role: 'Product Manager', source: 'LinkedIn', college: 'Ivy League College', resume_summary: 'Results-driven Product Manager with 5+ years of experience in agile environments.' },
    { full_name: 'Ethan Johnson', email: 'ethan.j@example.com', phone: '+442079460958', status: 'Rejected', role: 'Data Analyst', source: 'Naukri', college: 'Tech Institute', resume_summary: 'Data Analyst with a strong background in SQL and Python.' },
  ], { onConflict: 'email' }).select();
  if (appError) console.error('Error seeding applicants:', appError.message);
  else console.log(`${applicants?.length || 0} applicants seeded.`);

  // 3. Seed Jobs
  console.log('Seeding jobs...');
  const { data: jobs, error: jobError } = await supabase.from('jobs').upsert([
    { title: 'Senior Product Manager', department: 'Product', location: 'San Francisco, CA', source: 'LinkedIn', status: 'Interviewing', applicants_count: 78 },
    { title: 'UX/UI Designer', department: 'Design', location: 'New York, NY', source: 'Company Website', status: 'Screening', applicants_count: 124 },
    { title: 'Backend Developer', department: 'Engineering', location: 'Remote', source: 'LinkedIn', status: 'Screening', applicants_count: 210 },
  ], { onConflict: 'title' }).select();
  if (jobError) console.error('Error seeding jobs:', jobError.message);
  else console.log(`${jobs?.length || 0} jobs seeded.`);

  // 4. Seed Colleges
  console.log('Seeding colleges...');
  const { data: colleges, error: colError } = await supabase.from('colleges').upsert([
    { name: 'National Institute of Technology, Trichy', location: 'Tiruchirappalli, TN', status: 'Invited', resumes_received: 124 },
    { name: 'Indian Institute of Technology, Bombay', location: 'Mumbai, MH', status: 'Confirmed', resumes_received: 258 },
    { name: 'Vellore Institute of Technology', location: 'Vellore, TN', status: 'Screening', resumes_received: 312 },
  ], { onConflict: 'name' }).select();
  if (colError) console.error('Error seeding colleges:', colError.message);
  else console.log(`${colleges?.length || 0} colleges seeded.`);
  
  // 5. Seed Documents
  console.log('Seeding documents...');
  const { data: documents, error: docError } = await supabase.from('documents').upsert([
    { name: 'Employee Handbook 2024', type: 'Policy', version: 'v3.1', status: 'Active', acknowledgement_percentage: 95 },
    { name: 'Code of Conduct', type: 'Policy', version: 'v2.5', status: 'Active', acknowledgement_percentage: 100 },
    { name: 'Anti-Harassment Training', type: 'Training', version: '2024', status: 'Active', expiry_date: '2024-12-31', acknowledgement_percentage: 78 },
  ], { onConflict: 'name,version' }).select();
  if (docError) console.error('Error seeding documents:', docError.message);
  else console.log(`${documents?.length || 0} documents seeded.`);

  // 6. Seed Grievances
  console.log('Seeding grievances...');
  const { data: grievances, error: grievError } = await supabase.from('grievances').upsert([
    { ticket_id: 'TKT-001', title: 'Issue with payslip calculation', category: 'Payroll', assigned_to: 'HR', status: 'In Progress', created_at: '2024-05-20T10:00:00Z' },
    { ticket_id: 'TKT-002', title: 'Request for workplace adjustment', category: 'Facilities', assigned_to: 'Legal', status: 'Open', created_at: '2024-05-18T14:30:00Z' },
    { ticket_id: 'TKT-003', title: 'Anonymous feedback on management', category: 'Feedback', is_anonymous: true, assigned_to: 'HR', status: 'Open', created_at: '2024-05-21T11:00:00Z' },
  ], { onConflict: 'ticket_id' }).select();
  if (grievError) console.error('Error seeding grievances:', grievError.message);
  else console.log(`${grievances?.length || 0} grievances seeded.`);

  // 7. Seed Analytics
  console.log('Seeding analytics...');
  const { data: analytics, error: analyticsError } = await supabase.from('analytics').insert([
      {
          "attritionPrediction": "Attrition is predicted to be low (2.1%) next quarter, driven by high employee sentiment scores and competitive compensation packages.",
          "burnoutHeatmap": "The Engineering department shows a moderate risk of burnout due to the recent product launch crunch. Recommend monitoring workloads and encouraging PTO.",
          "salaryBenchmarks": "Salaries are competitive across most roles. The Data Science team is slightly below market average (5-7%); recommend a market adjustment review.",
          "keyInsights": "Overall company health is strong. Focus on targeted interventions for the Engineering team's workload and review Data Science compensation to maintain a competitive edge."
      }
  ]);
  if (analyticsError) console.error('Error seeding analytics:', analyticsError.message);
  else console.log('Analytics data seeded.');

  console.log('Database seeding complete!');
}

seedDatabase().catch(console.error);
