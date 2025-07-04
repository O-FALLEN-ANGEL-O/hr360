import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const employees = [
  { id: 1, name: "Alice Johnson", role: "Software Engineer", status: "Remote", avatar: "https://placehold.co/100x100.png?text=AJ" },
  { id: 2, name: "Bob Williams", role: "Product Manager", status: "Office", avatar: "https://placehold.co/100x100.png?text=BW" },
  { id: 3, name: "Charlie Brown", role: "UX Designer", status: "Leave", avatar: "https://placehold.co/100x100.png?text=CB" },
  { id: 4, name: "Diana Miller", role: "Data Scientist", status: "Remote", avatar: "https://placehold.co/100x100.png?text=DM" },
  { id: 5, name: "Ethan Davis", role: "DevOps Engineer", status: "Probation", avatar: "https://placehold.co/100x100.png?text=ED" },
  { id: 6, name: "Fiona Garcia", role: "Frontend Developer", status: "Office", avatar: "https://placehold.co/100x100.png?text=FG" },
  { id: 7, name: "George Rodriguez", role: "Backend Developer", status: "Remote", avatar: "https://placehold.co/100x100.png?text=GR" },
  { id: 8, name: "Hannah Martinez", role: "HR Specialist", status: "Office", avatar: "https://placehold.co/100x100.png?text=HM" },
];

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Remote":
      return "bg-blue-500 text-white";
    case "Office":
      return "bg-green-500 text-white";
    case "Leave":
      return "bg-yellow-500 text-black";
    case "Probation":
      return "bg-purple-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export default function RemoteStatusPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Remote Status Manager"
        description="A real-time grid of your team's work status and location."
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {employees.map((employee) => (
          <Card key={employee.id} className="text-center">
            <CardHeader>
              <Avatar className="mx-auto h-20 w-20">
                <AvatarImage src={employee.avatar} alt={employee.name} data-ai-hint="employee avatar" />
                <AvatarFallback>
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">{employee.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{employee.role}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Badge className={cn("text-xs", getStatusBadgeClass(employee.status))}>
                {employee.status}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
