
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
    { id: 1, name: 'Alice Johnson', role: 'Software Engineer', status: 'Remote', avatar_url: 'https://placehold.co/100x100.png', email: 'alice.j@hr360.com', points: 1200 },
    { id: 2, name: 'Bob Williams', role: 'Product Manager', status: 'Office', avatar_url: 'https://placehold.co/100x100.png', email: 'bob.w@hr360.com', points: 950 },
    { id: 3, name: 'Charlie Brown', role: 'UX Designer', status: 'Leave', avatar_url: 'https://placehold.co/100x100.png', email: 'charlie.b@hr360.com', points: 800 },
    { id: 4, name: 'Diana Miller', role: 'Data Scientist', status: 'Remote', avatar_url: 'https://placehold.co/100x100.png', email: 'diana.m@hr360.com', points: 1500 },
    { id: 5, name: 'Ethan Davis', role: 'DevOps Engineer', status: 'Probation', avatar_url: 'https://placehold.co/100x100.png', email: 'ethan.d@hr360.com', points: 300 },
  ], { onConflict: 'email' }).select();
  if (empError) console.error('Error seeding employees:', empError.message);
  else console.log(`${employees?.length || 0} employees seeded.`);

  // 2. Seed Applicants
  console.log('Seeding applicants...');
  const { data: applicants, error: appError } = await supabase.from('applicants').upsert([
    { full_name: 'Charlie Davis', email: 'charlie.d@example.com', phone: '+1234567890', status: 'Pending Review', role: 'Chat Support', source: 'Email', college: 'State University', resume_summary: 'Experienced chat support specialist with a track record of high customer satisfaction scores.' },
    { full_name: 'Diana Smith', email: 'diana.s@example.com', phone: '+1987654321', status: 'Interview Scheduled', role: 'Product Manager', source: 'LinkedIn', college: 'Ivy League College', resume_summary: 'Results-driven Product Manager with 5+ years of experience in agile environments.' },
    { full_name: 'Ethan Johnson', email: 'ethan.j@example.com', phone: '+442079460958', status: 'Rejected', role: 'Data Analyst', source: 'Naukri', college: 'Tech Institute', resume_summary: 'Data Analyst with a strong background in SQL and Python.' },
    { full_name: 'Fiona Garcia', email: 'fiona.g@example.com', phone: '+1231231234', status: 'Applied', role: 'Software Engineer Intern', source: 'Campus Drive', college: 'National Institute of Technology, Trichy' },
    { full_name: 'George Clark', email: 'george.c@example.com', phone: '+1231231235', status: 'Screening', role: 'Marketing Intern', source: 'Campus Drive', college: 'Indian Institute of Technology, Bombay' },
  ], { onConflict: 'email' }).select();
  if (appError) console.error('Error seeding applicants:', appError.message);
  else console.log(`${applicants?.length || 0} applicants seeded.`);

  // 3. Seed Jobs
  console.log('Seeding jobs...');
  const { data: jobs, error: jobError } = await supabase.from('jobs').upsert([
    { title: 'Senior Product Manager', department: 'Product', location: 'San Francisco, CA', source: 'LinkedIn', status: 'Interviewing', applicants_count: 78 },
    { title: 'UX/UI Designer', department: 'Design', location: 'New York, NY', source: 'Company Website', status: 'Screening', applicants_count: 124 },
    { title: 'Backend Developer', department: 'Engineering', location: 'Remote', source: 'LinkedIn', status: 'Screening', applicants_count: 210 },
    { title: 'Software Engineering Intern', department: 'Engineering', location: 'Remote', source: 'Internshala', status: 'Accepting Applications', applicants_count: 350 },
  ], { onConflict: 'title' }).select();
  if (jobError) console.error('Error seeding jobs:', jobError.message);
  else console.log(`${jobs?.length || 0} jobs seeded.`);

  // 4. Seed Colleges
  console.log('Seeding colleges...');
  const { data: colleges, error: colError } = await supabase.from('colleges').upsert([
    { name: 'National Institute of Technology, Trichy', location: 'Tiruchirappalli, TN', status: 'Invited', resumes_received: 124, contact_email: 'tpo@nitt.edu' },
    { name: 'Indian Institute of Technology, Bombay', location: 'Mumbai, MH', status: 'Confirmed', resumes_received: 258, contact_email: 'tpo@iitb.ac.in' },
    { name: 'Vellore Institute of Technology', location: 'Vellore, TN', status: 'Screening', resumes_received: 312, contact_email: 'tpo@vit.ac.in' },
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
  await supabase.from('analytics').delete().neq('id', 0); // Clear old data
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
  
  // 8. Seed Kudos
  console.log('Seeding kudos...');
  const { data: kudos, error: kudosError } = await supabase.from('kudos').upsert([
    { id: 1, giver_name: 'Alice Johnson', receiver_name: 'Bob Williams', reason_text: 'Great presentation on the new feature!', reason_category: 'Team Collaboration', points_awarded: 50 },
    { id: 2, giver_name: 'Charlie Brown', receiver_name: 'Alice Johnson', reason_text: 'Thanks for helping me debug my code.', reason_category: 'Mentorship', points_awarded: 30 },
    { id: 3, giver_name: 'Admin', receiver_name: 'Diana Miller', reason_text: 'Congratulations on your 3-year work anniversary!', reason_category: 'Work Anniversary', points_awarded: 100 },
  ], { onConflict: 'id' }).select();
  if (kudosError) console.error('Error seeding kudos:', kudosError.message);
  else console.log(`${kudos?.length || 0} kudos seeded.`);

  // 9. Seed Workflows
  console.log('Seeding workflows...');
  const workflowsToSeed = [
    { id: 1, title: 'New Employee Onboarding', description: 'Automated workflow for welcoming new hires, from offer acceptance to first-day setup.', icon: 'UserPlus', icon_color: 'text-green-500' },
    { id: 2, title: '48-Hour Unseen Resume Alert', description: 'If a resume is unseen for 48 hours, this workflow sends an apology and alerts HR.', icon: 'Hourglass', icon_color: 'text-blue-500' },
    { id: 3, title: 'Employee Offboarding', description: 'A streamlined process for employee exits, ensuring all assets are recovered and access is revoked.', icon: 'UserX', icon_color: 'text-red-500' },
    { id: 4, title: 'Leave Approval Process', description: 'A multi-step approval workflow for employee leave requests.', icon: 'Clock', icon_color: 'text-yellow-500' },
  ];
  const { data: seededWorkflows, error: workflowError } = await supabase.from('workflows').upsert(workflowsToSeed, { onConflict: 'id' }).select();
  if (workflowError) console.error('Error seeding workflows:', workflowError.message);
  else console.log(`${seededWorkflows?.length || 0} workflows seeded.`);

  // 10. Seed Workflow Steps
  console.log('Seeding workflow steps...');
  await supabase.from('workflow_steps').delete().neq('id', -1); // Clear old data to avoid duplicates
  const workflowStepsToSeed = [
    // Onboarding
    { workflow_id: 1, name: 'Send Welcome Email', icon: 'Mail', done: true },
    { workflow_id: 1, name: 'IT Equipment Provisioning', icon: 'Clock', done: false },
    { workflow_id: 1, name: 'Create System Accounts', icon: 'Clock', done: false },
    { workflow_id: 1, name: 'Schedule Orientation', icon: 'Check', done: true },
    // Resume Alert
    { workflow_id: 2, name: 'Monitor Unseen Resumes', icon: 'Check', done: true },
    { workflow_id: 2, name: 'Trigger After 48 Hours', icon: 'Clock', done: false },
    { workflow_id: 2, name: 'Send Auto-Apology Email', icon: 'Mail', done: false },
    { workflow_id: 2, name: 'Alert HR Team', icon: 'BellRing', done: false },
    // Offboarding
    { workflow_id: 3, name: 'Conduct Exit Interview', icon: 'Check', done: true },
    { workflow_id: 3, name: 'Deactivate Accounts', icon: 'Check', done: true },
    { workflow_id: 3, name: 'Final Payroll Processing', icon: 'Clock', done: false },
    { workflow_id: 3, name: 'Collect Company Assets', icon: 'Clock', done: false },
    // Leave Approval
    { workflow_id: 4, name: 'Employee Submits Request', icon: 'Check', done: true },
    { workflow_id: 4, name: 'Manager Approval', icon: 'Clock', done: false },
    { workflow_id: 4, name: 'HR Confirmation', icon: 'Clock', done: false },
    { workflow_id: 4, name: 'Update Calendar', icon: 'Clock', done: false },
  ];
  const { data: seededSteps, error: stepsError } = await supabase.from('workflow_steps').insert(workflowStepsToSeed).select();
  if (stepsError) console.error('Error seeding workflow steps:', stepsError.message);
  else console.log(`${seededSteps?.length || 0} workflow steps seeded.`);

  console.log('Database seeding complete!');
}

seedDatabase().catch(console.error);
