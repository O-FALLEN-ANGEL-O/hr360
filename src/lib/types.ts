
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          attritionPrediction: string
          burnoutHeatmap: string
          created_at: string
          id: number
          keyInsights: string
          salaryBenchmarks: string
        }
        Insert: {
          attritionPrediction: string
          burnoutHeatmap: string
          created_at?: string
          id?: number
          keyInsights: string
          salaryBenchmarks: string
        }
        Update: {
          attritionPrediction?: string
          burnoutHeatmap?: string
          created_at?: string
          id?: number
          keyInsights?: string
          salaryBenchmarks?: string
        }
        Relationships: []
      }
      applicants: {
        Row: {
          aptitude_score: string | null
          assigned_test: "aptitude" | "typing" | null
          college: string | null
          created_at: string
          email: string
          full_name: string
          hr_notes: string | null
          id: number
          phone: string | null
          resume_summary: string | null
          resume_text: string | null
          role: string
          source: string
          status:
            | "New"
            | "Pending Review"
            | "Screening"
            | "Interview Scheduled"
            | "Offer Extended"
            | "Hired"
            | "Rejected"
            | "Applied"
          typing_accuracy: number | null
          typing_wpm: number | null
        }
        Insert: {
          aptitude_score?: string | null
          assigned_test?: "aptitude" | "typing" | null
          college?: string | null
          created_at?: string
          email: string
          full_name: string
          hr_notes?: string | null
          id?: number
          phone?: string | null
          resume_summary?: string | null
          resume_text?: string | null
          role: string
          source?: string
          status?:
            | "New"
            | "Pending Review"
            | "Screening"
            | "Interview Scheduled"
            | "Offer Extended"
            | "Hired"
            | "Rejected"
            | "Applied"
          typing_accuracy?: number | null
          typing_wpm?: number | null
        }
        Update: {
          aptitude_score?: string | null
          assigned_test?: "aptitude" | "typing" | null
          college?: string | null
          created_at?: string
          email?: string
          full_name?: string
          hr_notes?: string | null
          id?: number
          phone?: string | null
          resume_summary?: string | null
          resume_text?: string | null
          role?: string
          source?: string
          status?:
            | "New"
            | "Pending Review"
            | "Screening"
            | "Interview Scheduled"
            | "Offer Extended"
            | "Hired"
            | "Rejected"
            | "Applied"
          typing_accuracy?: number | null
          typing_wpm?: number | null
        }
        Relationships: []
      }
      colleges: {
        Row: {
          contact_email: string | null
          created_at: string
          id: number
          location: string
          name: string
          resumes_received: number
          status: "Invited" | "Confirmed" | "Screening" | "Scheduled"
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          id?: number
          location: string
          name: string
          resumes_received?: number
          status?: "Invited" | "Confirmed" | "Screening" | "Scheduled"
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          id?: number
          location?: string
          name?: string
          resumes_received?: number
          status?: "Invited" | "Confirmed" | "Screening" | "Scheduled"
        }
        Relationships: []
      }
      documents: {
        Row: {
          acknowledgement_percentage: number
          created_at: string
          expiry_date: string | null
          id: number
          name: string
          status: "Active" | "Draft" | "Archived"
          type: "Policy" | "Training" | "Manual"
          version: string
        }
        Insert: {
          acknowledgement_percentage?: number
          created_at?: string
          expiry_date?: string | null
          id?: number
          name: string
          status?: "Active" | "Draft" | "Archived"
          type?: "Policy" | "Training" | "Manual"
          version: string
        }
        Update: {
          acknowledgement_percentage?: number
          created_at?: string
          expiry_date?: string | null
          id?: number
          name?: string
          status?: "Active" | "Draft" | "Archived"
          type?: "Policy" | "Training" | "Manual"
          version?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: number
          name: string
          points: number
          role: string
          status: "Remote" | "Office" | "Leave" | "Probation"
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: number
          name: string
          points?: number
          role: string
          status?: "Remote" | "Office" | "Leave" | "Probation"
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: number
          name?: string
          points?: number
          role?: string
          status?: "Remote" | "Office" | "Leave" | "Probation"
        }
        Relationships: []
      }
      grievances: {
        Row: {
          assigned_to: "HR" | "Legal"
          category:
            | "Payroll"
            | "Facilities"
            | "Interpersonal"
            | "Policy"
            | "Feedback"
            | "Other"
          created_at: string
          description: string | null
          is_anonymous: boolean
          status: "Open" | "In Progress" | "Resolved" | "Closed"
          ticket_id: string
          title: string
        }
        Insert: {
          assigned_to?: "HR" | "Legal"
          category?:
            | "Payroll"
            | "Facilities"
            | "Interpersonal"
            | "Policy"
            | "Feedback"
            | "Other"
          created_at?: string
          description?: string | null
          is_anonymous?: boolean
          status?: "Open" | "In Progress" | "Resolved" | "Closed"
          ticket_id?: string
          title: string
        }
        Update: {
          assigned_to?: "HR" | "Legal"
          category?:
            | "Payroll"
            | "Facilities"
            | "Interpersonal"
            | "Policy"
            | "Feedback"
            | "Other"
          created_at?: string
          description?: string | null
          is_anonymous?: boolean
          status?: "Open" | "In Progress" | "Resolved" | "Closed"
          ticket_id?: string
          title?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          applicants_count: number
          created_at: string
          department: string
          id: number
          location: string
          source:
            | "LinkedIn"
            | "Company Website"
            | "Indeed"
            | "Naukri"
            | "Other"
            | "Walk-in"
          status:
            | "Accepting Applications"
            | "Screening"
            | "Interviewing"
            | "Offer Extended"
            | "Closed"
          title: string
        }
        Insert: {
          applicants_count?: number
          created_at?: string
          department: string
          id?: number
          location: string
          source?:
            | "LinkedIn"
            | "Company Website"
            | "Indeed"
            | "Naukri"
            | "Other"
            | "Walk-in"
          status?:
            | "Accepting Applications"
            | "Screening"
            | "Interviewing"
            | "Offer Extended"
            | "Closed"
          title: string
        }
        Update: {
          applicants_count?: number
          created_at?: string
          department?: string
          id?: number
          location?: string
          source?:
            | "LinkedIn"
            | "Company Website"
            | "Indeed"
            | "Naukri"
            | "Other"
            | "Walk-in"
          status?:
            | "Accepting Applications"
            | "Screening"
            | "Interviewing"
            | "Offer Extended"
            | "Closed"
          title?: string
        }
        Relationships: []
      }
      kudos: {
        Row: {
          created_at: string
          giver_name: string
          id: number
          points_awarded: number
          reason_category: string
          reason_text: string
          receiver_name: string
        }
        Insert: {
          created_at?: string
          giver_name: string
          id?: number
          points_awarded?: number
          reason_category: string
          reason_text: string
          receiver_name: string
        }
        Update: {
          created_at?: string
          giver_name?: string
          id?: number
          points_awarded?: number
          reason_category?: string
          reason_text?: string
          receiver_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

// Custom app types from database tables
export type Applicant = Tables<'applicants'>
export type Employee = Tables<'employees'>
export type Job = Tables<'jobs'>
export type College = Tables<'colleges'>
export type Document = Tables<'documents'>
export type Grievance = Tables<'grievances'>
export type Kudo = Tables<'kudos'>

    
