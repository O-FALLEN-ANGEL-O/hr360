
"use client"

import {
  Users,
  BarChart,
  PieChart,
  TrendingUp,
  Target,
  CheckCircle
} from "lucide-react"
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
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const initialApplications = [
  {
    title: "Senior Product Manager",
    company: "Innovate Inc.",
    status: "Interview",
    match: 92,
    source: "LinkedIn",
  },
  {
    title: "UX/UI Designer",
    company: "Creative Solutions",
    status: "Sent",
    match: 85,
    source: "Naukri",
  },
  {
    title: "Backend Developer",
    company: "Tech Giant",
    status: "Shortlisted",
    match: 95,
    source: "Inbox",
  },
  {
    title: "Data Scientist",
    company: "DataDriven Co.",
    status: "Hired",
    match: 98,
    source: "Internshala",
  },
  {
    title: "Marketing Specialist",
    company: "AdVantage",
    status: "Sent",
    match: 78,
    source: "Inbox",
  },
]

const statusVariant: { [key: string]: "default" | "secondary" | "outline" | "destructive" } = {
  Interview: "default",
  Sent: "secondary",
  Shortlisted: "outline",
  Hired: "default"
};

const initialDepartmentData = [
    { name: 'Engineering', value: 450, color: 'hsl(var(--chart-1))' },
    { name: 'Sales', value: 250, color: 'hsl(var(--chart-2))' },
    { name: 'Marketing', value: 180, color: 'hsl(var(--chart-3))' },
    { name: 'HR', value: 80, color: 'hsl(var(--chart-4))' },
    { name: 'Support', value: 320, color: 'hsl(var(--chart-5))' },
    { name: 'Other', value: 143, color: 'hsl(var(--muted))' }
];

const initialPipelineData = [
    { name: 'Applied', value: 250, fill: 'hsl(var(--chart-1))' },
    { name: 'Screening', value: 180, fill: 'hsl(var(--chart-2))' },
    { name: 'Interview', value: 95, fill: 'hsl(var(--chart-3))' },
    { name: 'Offer', value: 35, fill: 'hsl(var(--chart-4))' },
    { name: 'Hired', value: 15, fill: 'hsl(var(--chart-5))' }
];

const StatCard = ({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode, description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ employees: 1243, attrition: 8.2, openPositions: 42, compliance: 99.8 });
  const [departmentData, setDepartmentData] = useState(initialDepartmentData);
  const [pipelineData, setPipelineData] = useState(initialPipelineData);
  
  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
        setStats(prev => ({
            employees: prev.employees + Math.floor(Math.random() * 3) - 1,
            attrition: Math.max(0, prev.attrition + (Math.random() - 0.5) * 0.1),
            openPositions: prev.openPositions + Math.floor(Math.random() * 3) - 1,
            compliance: Math.min(100, prev.compliance + (Math.random() - 0.4) * 0.1),
        }));

        setPipelineData(prev => prev.map(p => ({
            ...p,
            value: Math.max(10, p.value + Math.floor(Math.random() * 5) - 2)
        })));
        
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);

  }, [])
  
  return (
    <div className="space-y-8">
      <PageHeader title="HR Dashboard" description="An overview of key metrics for the organization." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Employees" value={stats.employees.toLocaleString()} icon={<Users className="h-4 w-4 text-muted-foreground" />} description="+20.1% from last month" />
        <StatCard title="Attrition Rate" value={`${stats.attrition.toFixed(1)}%`} icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} description="-1.5% from last quarter" />
        <StatCard title="Open Positions" value={String(stats.openPositions)} icon={<Target className="h-4 w-4 text-muted-foreground" />} description="+5 since last week" />
        <StatCard title="Compliance" value={`${stats.compliance.toFixed(1)}%`} icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} description="All policies acknowledged" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-muted-foreground" />
              Employee Distribution by Department
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {!mounted ? <Skeleton className="h-full w-full" /> :
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
            {!mounted ? <Skeleton className="h-full w-full" /> :
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
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Latest candidates in the hiring pipeline.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Match %</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialApplications.map((app) => (
                <TableRow key={app.title}>
                  <TableCell className="font-medium">{app.title}</TableCell>
                  <TableCell>{app.company}</TableCell>
                  <TableCell>{app.source}</TableCell>
                  <TableCell>
                     <Badge variant={app.match > 90 ? "default" : "secondary"} className={app.match > 90 ? "bg-green-600 hover:bg-green-700": ""}>
                       {app.match}%
                     </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[app.status]} className={app.status === "Hired" ? "bg-accent text-accent-foreground" : ""}>
                      {app.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
