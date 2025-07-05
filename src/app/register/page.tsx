
"use client"

import { NewApplicantForm } from "@/components/new-applicant-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bot } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4 font-sans">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-8">
            <Bot className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold">HR360+ Applicant Registration</h1>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Welcome!</CardTitle>
                <CardDescription>
                    Please register your details below. You can upload a resume file or use your phone's camera to take a picture of it, and our AI will help fill out the form.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <NewApplicantForm />
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
