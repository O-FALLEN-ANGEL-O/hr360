
"use client"

import {
  Users,
  BarChart,
  PieChart,
  TrendingUp,
  Target,
  CheckCircle,
  Briefcase
} from "lucide-react"
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import {
  Bar,
  CartesianGrid,
  Cell,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
} from "recharts"
import { useEffect, useState, useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"
import type { Job, Applicant } from "@/lib/types"

const statusVariant: { [key: string]: "default" | "secondary" | "outline" | "destructive" } = {
  Interviewing: "default",
  "Accepting Applications": "secondary",
  Screening: "outline",
  "Offer Extended": "default"
};

const StatCard = ({ title, value, icon, description, isLoading }: { title: string; value: string; icon: React.ReactNode, description: string, isLoading?: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-10 w-3/4" /> :
              <>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
              </>
            }
        </CardContent>
    </Card>
);

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ employees: 0, attrition: 8.2, openPositions: 0, compliance: 99.8 });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
        setIsLoading(true);

        const { data: jobsData, error: jobsError } = await supabase.from('jobs').select('*').limit(5);
        if (jobsError) console.error("Error fetching jobs", jobsError);
        else setJobs(jobsData || []);

        const { data: applicantsData, error: applicantsError } = await supabase.from('applicants').select('status');
        if (applicantsError) console.error("Error fetching applicants", applicantsError);
        else setApplicants(applicantsData || []);

        const { count: employeeCount, error: empCountError } = await supabase.from('employees').select('*', { count: 'exact', head: true });
        if (empCountError) console.error("Error fetching employee count", empCountError);
        
        const { count: openPositionsCount, error: openPosError } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).not('status', 'eq', 'Closed');
        if (openPosError) console.error("Error fetching open positions", openPosError);

        const { data: employeesData, error: employeesError } = await supabase.from('employees').select('role');
        if (employeesError) console.error("Error fetching employees for chart", employeesError);
        else setEmployees(employeesData || []);
        
        const { data: analyticsData, error: analyticsError } = await supabase.from('analytics').select('attritionPrediction').limit(1).single();
        const attritionMatch = analyticsData?.attritionPrediction.match(/(\d+\.\d+)/);
        const attritionRate = attritionMatch ? parseFloat(attritionMatch[1]) : 8.2;

        setStats(prev => ({
            ...prev,
            employees: employeeCount || 0,
            openPositions: openPositionsCount || 0,
            attrition: attritionRate,
        }));
        
        setIsLoading(false);
    };
    fetchData();
  }, [])

  const departmentData = useMemo(() => {
    const counts = employees.reduce((acc, emp) => {
        const role = emp.role || 'Other';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--muted))'];
    return Object.entries(counts).map(([name, value], index) => ({ name, value, color: colors[index % colors.length] }));
  }, [employees]);
  
  const pipelineData = useMemo(() => {
    const statusOrder = ["Applied", "Screening", "Interview Scheduled", "Offer Extended", "Hired"];
    const counts = applicants.reduce((acc, app) => {
      const status = app.status || 'Pending Review';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
    
    return statusOrder.map((status, index) => ({
      name: status,
      value: counts[status] || 0,
      fill: colors[index % colors.length]
    }));
  }, [applicants]);
  
  return (
    <div className="space-y-8">
      <PageHeader title="HR Dashboard" description="An overview of key metrics for the organization." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Employees" value={stats.employees.toLocaleString()} icon={<Users className="h-4 w-4 text-muted-foreground" />} description="+2.1% from last month" isLoading={isLoading} />
        <StatCard title="Attrition Rate" value={`${stats.attrition.toFixed(1)}%`} icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} description="Predicted next quarter" isLoading={isLoading} />
        <StatCard title="Open Positions" value={String(stats.openPositions)} icon={<Target className="h-4 w-4 text-muted-foreground" />} description="+2 since last week" isLoading={isLoading} />
        <StatCard title="Compliance" value={`${stats.compliance.toFixed(1)}%`} icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} description="All policies acknowledged" isLoading={isLoading} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-muted-foreground" />
              Employee Distribution by Role
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {!mounted || isLoading ? <Skeleton className="h-full w-full" /> :
             <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                    <Tooltip
                        cursor={false}
                        contentStyle={{
                            background: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "var(--radius)"
                        }}
                    />
                    <Pie data={departmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </RechartsPieChart>
             </ResponsiveContainer>
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-muted-foreground" />
              Hiring Pipeline Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {!mounted || isLoading ? <Skeleton className="h-full w-full" /> :
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={pipelineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "var(--radius)"
                        }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
            </ResponsiveContainer>
            }
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Job Postings</CardTitle>
          <CardDescription>Latest roles added to the job board.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
             </div>
          ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {jobs.map((job) => (
                    <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.source}</TableCell>
                    <TableCell>
                        <Badge variant={job.applicants_count > 90 ? "default" : "secondary"}>
                        {job.applicants_count}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant={statusVariant[job.status]} className={cn(job.status === "Hired" && "bg-accent text-accent-foreground")}>
                        {job.status}
                        </Badge>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

    