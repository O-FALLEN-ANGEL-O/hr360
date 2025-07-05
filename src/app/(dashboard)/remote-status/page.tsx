"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const initialEmployees = [
  { id: 1, name: "Alice Johnson", role: "Software Engineer", status: "Remote", avatar: "https://placehold.co/100x100.png?text=AJ" },
  { id: 2, name: "Bob Williams", role: "Product Manager", status: "Office", avatar: "https://placehold.co/100x100.png?text=BW" },
  { id: 3, name: "Charlie Brown", role: "UX Designer", status: "Leave", avatar: "https://placehold.co/100x100.png?text=CB" },
  { id: 4, name: "Diana Miller", role: "Data Scientist", status: "Remote", avatar: "https://placehold.co/100x100.png?text=DM" },
  { id: 5, name: "Ethan Davis", role: "DevOps Engineer", status: "Probation", avatar: "https://placehold.co/100x100.png?text=ED" },
  { id: 6, name: "Fiona Garcia", role: "Frontend Developer", status: "Office", avatar: "https://placehold.co/100x100.png?text=FG" },
  { id: 7, name: "George Rodriguez", role: "Backend Developer", status: "Remote", avatar: "https://placehold.co/100x100.png?text=GR" },
  { id: 8, name: "Hannah Martinez", role: "HR Specialist", status: "Office", avatar: "https://placehold.co/100x100.png?text=HM" },
];

type Employee = typeof initialEmployees[0];
type Status = "Remote" | "Office" | "Leave" | "Probation";
const statuses: Status[] = ["Remote", "Office", "Leave", "Probation"];

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Remote":
      return "bg-blue-500 text-white hover:bg-blue-600";
    case "Office":
      return "bg-green-500 text-white hover:bg-green-600";
    case "Leave":
      return "bg-yellow-500 text-black hover:bg-yellow-600";
    case "Probation":
      return "bg-purple-500 text-white hover:bg-purple-600";
    default:
      return "bg-gray-500 text-white";
  }
};

export default function RemoteStatusPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const handleStatusChange = (employeeId: number, newStatus: Status) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId ? { ...emp, status: newStatus } : emp
      )
    );
  };

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Badge className={cn("text-xs cursor-pointer", getStatusBadgeClass(employee.status))}>
                    {employee.status}
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  {statuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onSelect={() => handleStatusChange(employee.id, status)}
                      disabled={employee.status === status}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
