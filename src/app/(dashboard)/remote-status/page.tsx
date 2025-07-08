
"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSupabase } from "@/hooks/use-supabase-client";
import type { Employee } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useSupabase();

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!supabase) return;
      setIsLoading(true);
      const { data, error } = await supabase.from('employees').select('*');
      if (error) {
        console.error(error);
      } else {
        setEmployees(data || []);
      }
      setIsLoading(false);
    }
    fetchEmployees();
  }, [supabase]);

  const handleStatusChange = async (employeeId: number, newStatus: Status) => {
    if (!supabase) return;
    // Optimistically update the UI
    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId ? { ...emp, status: newStatus } : emp
      )
    );
    // Update the database
    await supabase.from('employees').update({ status: newStatus }).eq('id', employeeId);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Remote Status Manager"
        description="A real-time grid of your team's work status and location."
      />
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="items-center"><Skeleton className="h-20 w-20 rounded-full" /></CardHeader>
              <CardContent className="text-center space-y-2">
                <Skeleton className="h-5 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </CardContent>
              <CardFooter className="justify-center"><Skeleton className="h-6 w-20 rounded-full" /></CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {employees.map((employee) => (
            <Card key={employee.id} className="text-center">
              <CardHeader>
                <Avatar className="mx-auto h-20 w-20" data-ai-hint="employee avatar">
                  <AvatarImage src={employee.avatar_url} alt={employee.name} />
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
                    <Badge className={cn("text-xs cursor-pointer transition-all", getStatusBadgeClass(employee.status))}>
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
      )}
    </div>
  );
}
