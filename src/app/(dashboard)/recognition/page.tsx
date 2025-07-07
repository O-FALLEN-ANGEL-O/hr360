
"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Gift, Sparkles, UserCheck, MessageSquare, PartyPopper, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from '@/lib/supabase/client'
import type { Employee, Kudo } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

const iconMap: Record<string, LucideIcon> = {
  "Project Milestone": UserCheck,
  "Target Exceeded": Trophy,
  "Mentorship": MessageSquare,
  "Work Anniversary": PartyPopper,
  "Team Collaboration": UserCheck,
  "Feature Launch": Trophy,
  "Helpful Documentation": MessageSquare,
  "Default": Sparkles,
}

const rewards = [
    { name: "Company Swag Pack", cost: 500, iconColor: "text-blue-500" },
    { name: "Half-day off", cost: 1000, iconColor: "text-green-500" },
    { name: "Team Lunch Voucher", cost: 1500, iconColor: "text-yellow-500" },
    { name: "Professional Development Fund", cost: 3000, iconColor: "text-purple-500" },
]

export default function RecognitionPage() {
  const [leaderboard, setLeaderboard] = useState<Employee[]>([]);
  const [recentKudos, setRecentKudos] = useState<Kudo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const leaderboardPromise = supabase.from('employees').select('*').order('points', { ascending: false }).limit(5);
      const kudosPromise = supabase.from('kudos').select('*').order('created_at', { ascending: false }).limit(5);

      const [leaderboardRes, kudosRes] = await Promise.all([leaderboardPromise, kudosPromise]);
      
      if(leaderboardRes.error) console.error(leaderboardRes.error);
      else setLeaderboard(leaderboardRes.data || []);
      
      if(kudosRes.error) console.error(kudosRes.error);
      else setRecentKudos(kudosRes.data || []);

      setIsLoading(false);
    }
    fetchData();
  }, [supabase]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Recognition Engine"
        description="Detect kudos, award points, and foster a culture of appreciation."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Trophy className="text-yellow-500" /> Leaderboard</CardTitle>
              <CardDescription>Top employees by recognition points.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <ul className="space-y-4">
                  {leaderboard.map((person, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <span className="font-bold text-lg text-muted-foreground">{index + 1}</span>
                      <Avatar data-ai-hint="employee avatar">
                        <AvatarImage src={person.avatar_url} alt={person.name} />
                        <AvatarFallback>{person.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{person.name}</p>
                        <p className="text-sm text-muted-foreground">{person.points.toLocaleString()} pts</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent" /> Recent Kudos</CardTitle>
                    <CardDescription>Latest recognitions across the company.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                          <Skeleton className="h-16 w-full" />
                          <Skeleton className="h-16 w-full" />
                          <Skeleton className="h-16 w-full" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                          {recentKudos.map((kudo) => {
                              const Icon = iconMap[kudo.reason_category] || iconMap.Default;
                              return (
                                  <div key={kudo.id} className="p-4 rounded-lg border bg-muted/20 flex items-start gap-4 animate-in fade-in-50">
                                  <Avatar>
                                          <AvatarFallback><Icon className="h-4 w-4 text-muted-foreground" /></AvatarFallback>
                                  </Avatar>
                                      <div className="flex-1">
                                          <p className="text-sm">
                                              <span className="font-semibold">{kudo.giver_name}</span> gave kudos to <span className="font-semibold">{kudo.receiver_name}</span>
                                          </p>
                                          <p className="text-muted-foreground text-sm mt-1 italic">"{kudo.reason_text}"</p>
                                      </div>
                                      <Badge className="bg-green-500 hover:bg-green-600 text-white">+{kudo.points_awarded} pts</Badge>
                                  </div>
                              )
                          })}
                      </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Gift /> Redeemable Rewards</CardTitle>
                    <CardDescription>Spend your well-earned points.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                     {rewards.map((reward, index) => (
                        <div key={index} className="p-4 rounded-lg border text-center space-y-2">
                            <div className="flex justify-center">
                                <Gift className={cn("h-6 w-6", reward.iconColor)} />
                            </div>
                            <p className="font-semibold">{reward.name}</p>
                            <Badge variant="outline">{reward.cost.toLocaleString()} pts</Badge>
                            <Button size="sm" className="w-full">Redeem</Button>
                        </div>
                     ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
