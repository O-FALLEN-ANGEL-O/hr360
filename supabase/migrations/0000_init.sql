
-- Enums for status types
create type public.employee_status as enum ('Remote', 'Office', 'Leave', 'Probation');
create type public.job_source as enum ('LinkedIn', 'Company Website', 'Indeed', 'Naukri', 'Other', 'Walk-in', 'Internshala');
create type public.job_status as enum ('Accepting Applications', 'Screening', 'Interviewing', 'Offer Extended', 'Closed');
create type public.applicant_status as enum ('New', 'Pending Review', 'Screening', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected', 'Applied');
create type public.college_status as enum ('Invited', 'Confirmed', 'Screening', 'Scheduled');
create type public.document_type as enum ('Policy', 'Training', 'Manual');
create type public.document_status as enum ('Active', 'Draft', 'Archived');
create type public.grievance_category as enum ('Payroll', 'Facilities', 'Interpersonal', 'Policy', 'Feedback', 'Other');
create type public.grievance_status as enum ('Open', 'In Progress', 'Resolved', 'Closed');
create type public.grievance_assignee as enum ('HR', 'Legal');
create type public.test_type as enum ('aptitude', 'typing');

-- Tables
create table employees (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default now() not null,
  name text not null,
  email text not null unique,
  role text not null,
  status public.employee_status not null default 'Probation',
  avatar_url text,
  points int not null default 0
);

create table applicants (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default now() not null,
  full_name text not null,
  email text not null unique,
  phone text,
  role text not null,
  source text not null default 'Walk-in',
  college text,
  status public.applicant_status not null default 'New',
  resume_text text,
  resume_summary text,
  hr_notes text,
  assigned_test public.test_type,
  aptitude_score text,
  typing_wpm int,
  typing_accuracy int
);

create table jobs (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default now() not null,
  title text not null unique,
  department text not null,
  location text not null,
  source public.job_source not null,
  status public.job_status not null,
  applicants_count int not null default 0
);

create table colleges (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default now() not null,
  name text not null unique,
  location text not null,
  status public.college_status not null,
  resumes_received int not null default 0,
  contact_email text
);

create table documents (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default now() not null,
  name text not null,
  type public.document_type not null,
  version text not null,
  status public.document_status not null,
  acknowledgement_percentage int not null default 0,
  expiry_date date,
  unique(name, version)
);

create table grievances (
  ticket_id text primary key default 'TKT-' || trim(to_char(nextval('grievances_ticket_id_seq'), '000000')),
  created_at timestamp with time zone default now() not null,
  title text not null,
  description text,
  category public.grievance_category not null,
  status public.grievance_status not null,
  assigned_to public.grievance_assignee not null,
  is_anonymous boolean not null default false
);
create sequence if not exists grievances_ticket_id_seq;

create table kudos (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default now() not null,
  giver_name text not null,
  receiver_name text not null,
  reason_text text not null,
  reason_category text not null,
  points_awarded int not null default 10
);

create table analytics (
    id bigint generated by default as identity primary key,
    created_at timestamp with time zone default now() not null,
    "attritionPrediction" text not null,
    "burnoutHeatmap" text not null,
    "salaryBenchmarks" text not null,
    "keyInsights" text not null
);

create table workflows (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default now() not null,
  title text not null,
  description text not null,
  icon text not null,
  icon_color text not null
);

create table workflow_steps (
  id bigint generated by default as identity primary key,
  workflow_id bigint references workflows(id) on delete cascade not null,
  name text not null,
  icon text not null,
  done boolean not null default false
);


-- Row Level Security (RLS)
alter table employees enable row level security;
alter table applicants enable row level security;
alter table jobs enable row level security;
alter table colleges enable row level security;
alter table documents enable row level security;
alter table grievances enable row level security;
alter table kudos enable row level security;
alter table analytics enable row level security;
alter table workflows enable row level security;
alter table workflow_steps enable row level security;

-- Policies
create policy "Public access for all tables" on employees for all using (true) with check (true);
create policy "Public access for all tables" on applicants for all using (true) with check (true);
create policy "Public access for all tables" on jobs for all using (true) with check (true);
create policy "Public access for all tables" on colleges for all using (true) with check (true);
create policy "Public access for all tables" on documents for all using (true) with check (true);
create policy "Public access for all tables" on grievances for all using (true) with check (true);
create policy "Public access for all tables" on kudos for all using (true) with check (true);
create policy "Public access for analytics" on analytics for select using (true);
create policy "Allow service_role to insert analytics" on analytics for insert to service_role with check (true);
create policy "Public access for workflows" on workflows for all using (true) with check (true);
create policy "Public access for workflow_steps" on workflow_steps for all using (true) with check (true);
