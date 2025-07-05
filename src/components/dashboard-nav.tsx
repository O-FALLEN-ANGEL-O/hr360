
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
  UserCheck
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
          Recruitment
        </SidebarMenuButton>
        <SidebarMenuSub>
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
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/interview-bot")}>
              <Link href="/interview-bot">Interview Bot</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
           <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/video-analyzer")}>
              <Link href="/video-analyzer">Video Analyzer</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/aptitude-test")}>
              <Link href="/aptitude-test">Aptitude Test Generator</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton>
          <Users />
          Employee Management
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/remote-status")}>
              <Link href="/remote-status">Remote Status</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/culture-fit")}>
              <Link href="/culture-fit">Culture Fit Predictor</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/sentiment-analyzer")}>
              <Link href="/sentiment-analyzer">Sentiment Analyzer</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton>
          <GanttChartSquare />
          Talent Development
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/skill-gap")}>
              <Link href="/skill-gap">Skill Gap Map</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton>
          <Building2 />
          Operations & Compliance
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/workflows")}>
              <Link href="/workflows">HR Workflows</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/document-generator")}>
              <Link href="/document-generator">Document Generator</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive("/compliance")}>
              <Link href="/compliance">Compliance Center</Link>
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
          <BarChart3 />
          Analytics & Tools
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
            <SidebarMenuSubButton asChild isActive={isActive("/ai-responder")}>
                <Link href="/ai-responder">AI Email Responder</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>

    </SidebarMenu>
  )
}
