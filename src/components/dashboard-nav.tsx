
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bot,
  Briefcase,
  Building2,
  FileText,
  HeartHandshake,
  LayoutGrid,
  ShieldCheck,
  Users,
  Video,
  ClipboardList,
  GanttChartSquare,
  UserCheck,
  Trophy,
  GraduationCap,
  Sparkles,
  School,
  FileSearch,
  Mail,
  Ticket,
  Network,
  Users2,
  UserCog,
  ShieldQuestion
} from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

export function DashboardNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive("/")}>
          <Link href="/">
            <LayoutGrid />
            Dashboard
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton>
          <Briefcase />
          Talent Acquisition
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/job-archive")}>
              <Link href="/job-archive">Live Job Feed</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
           <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/campus-hr")}>
              <Link href="/campus-hr">Campus & Internships</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
           <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/skill-gap")}>
              <Link href="/skill-gap">Internship Aggregator</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
           <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/assessment-center")}>
              <Link href="/assessment-center">Assessment Center</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/applicants")}>
              <Link href="/applicants">Applicants</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/match-score")}>
              <Link href="/match-score">GPT Match Score</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>

       <SidebarMenuItem>
        <SidebarMenuButton>
          <FileText />
          Docs & Communication
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/document-generator")}>
              <Link href="/document-generator">Document Generator</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
           <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/ai-responder")}>
              <Link href="/ai-responder">AI Email Composer</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/grievance-hub")}>
              <Link href="/grievance-hub">Grievance Hub</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton>
          <Users2 />
          Employee Management
        </SidebarMenuButton>
        <SidebarMenuSub>
           <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/remote-status")}>
              <Link href="/remote-status">Live Employee Status</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/career-growth")}>
              <Link href="/career-growth">Career Path Predictor</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
           <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/recognition")}>
              <Link href="/recognition">Recognition & Rewards</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
           <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/sentiment-analyzer")}>
              <Link href="/sentiment-analyzer">Sentiment Analyzer</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/culture-fit")}>
              <Link href="/culture-fit">Culture Fit Predictor</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton>
          <UserCog />
          Automation & Compliance
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/workflows")}>
              <Link href="/workflows">HR Workflows</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/compliance")}>
              <Link href="/compliance">Compliance Center</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>

       <SidebarMenuItem>
        <SidebarMenuButton>
          <Sparkles />
          Intelligence & Tools
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/analytics")}>
              <Link href="/analytics">Predictive Analytics</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
           <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/mobile-bot")}>
              <Link href="/mobile-bot">Mobile HR Bot</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/resume-builder")}>
              <Link href="/resume-builder">Smart Resume Builder</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>

    </SidebarMenu>
  )
}
