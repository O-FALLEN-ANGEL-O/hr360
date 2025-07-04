import { PageHeader } from "@/components/page-header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MoreHorizontal, Upload, Eye, FileWarning } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

const documents = [
  { id: 1, name: "Employee Handbook 2024", type: "Policy", version: "v3.1", status: "Active", expiry: "N/A", acknowledged: 95 },
  { id: 2, name: "Code of Conduct", type: "Policy", version: "v2.5", status: "Active", expiry: "N/A", acknowledged: 100 },
  { id: 3, name: "Anti-Harassment Training", type: "Training", version: "2024", status: "Active", expiry: "2024-12-31", acknowledged: 78 },
  { id: 4, name: "Data Protection Policy", type: "Policy", version: "v1.8", status: "Active", expiry: "N/A", acknowledged: 92 },
  { id: 5, name: "Work From Home Policy", type: "Policy", version: "v1.2", status: "Draft", expiry: "N/A", acknowledged: 0 },
  { id: 6, name: "Health & Safety Manual", type: "Manual", version: "v4.0", status: "Archived", expiry: "2023-12-31", acknowledged: 100 },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Active": return "default";
    case "Draft": return "secondary";
    case "Archived": return "outline";
    default: return "secondary";
  }
};

export default function CompliancePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Compliance Center"
        description="Manage HR documents, track acknowledgements, and monitor expiry dates."
      />
      <div className="flex justify-end">
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>HR Documents & Policies</CardTitle>
          <CardDescription>A list of all compliance documents for the organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Acknowledged</TableHead>
                <TableHead className="hidden lg:table-cell">Expires</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{doc.type}</TableCell>
                  <TableCell className="hidden md:table-cell">{doc.version}</TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(doc.status)}>{doc.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={doc.acknowledged} className="w-24" />
                      <span>{doc.acknowledged}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      {doc.expiry !== "N/A" && new Date(doc.expiry) < new Date() && <FileWarning className="h-4 w-4 text-destructive" />}
                      {doc.expiry}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Document</DropdownMenuItem>
                        <DropdownMenuItem><FileWarning className="mr-2 h-4 w-4" /> Send Reminder</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
