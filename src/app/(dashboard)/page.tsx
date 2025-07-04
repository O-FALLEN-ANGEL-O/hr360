import {
  Activity,
  Briefcase,
  Users,
  CheckCircle,
} from "lucide-react"
import {
  Card,
  CardContent,
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

const applications = [
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


export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Welcome to your HR360+ overview." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Interviews Scheduled
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+52</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Hires</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Job Postings
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">+2 since last hour</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
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
              {applications.map((app) => (
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
