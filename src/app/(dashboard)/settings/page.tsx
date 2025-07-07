
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email(),
});

export default function SettingsPage() {
  const { toast } = useToast()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    const savedTheme = localStorage.getItem('theme')
    const darkMode = savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    setIsDarkMode(darkMode)
    root.classList.toggle('dark', darkMode)
    setMounted(true)
  }, [])

  const handleThemeChange = (checked: boolean) => {
    const root = window.document.documentElement
    setIsDarkMode(checked)
    root.classList.toggle('dark', checked)
    localStorage.setItem('theme', checked ? 'dark' : 'light')
    toast({
        title: "Theme Changed",
        description: `Switched to ${checked ? 'Dark' : 'Light'} Mode.`
    })
  }

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Admin User",
      email: "admin@hr360.plus",
    },
  });

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    })
  }
  
  if (!mounted) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Settings"
          description="Manage your account settings and theme preferences."
        />
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>This is how others will see you on the site.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8 max-w-lg">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-11 rounded-full" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account settings and theme preferences."
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This is how others will see you on the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8 max-w-lg">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update profile</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={handleThemeChange} />
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
