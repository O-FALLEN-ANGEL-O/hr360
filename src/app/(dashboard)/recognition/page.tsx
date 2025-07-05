
"use client"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Gift, Sparkles } from "lucide-react"

const leaderboard = [
  { name: "Diana Smith", points: 2500, avatar: "https://placehold.co/100x100.png?text=DS" },
  { name: "George Black", points: 2250, avatar: "https://placehold.co/100x100.png?text=GB" },
  { name: "Alice Johnson", points: 2100, avatar: "https://placehold.co/100x100.png?text=AJ" },
  { name: "Bob Williams", points: 1980, avatar: "https://placehold.co/100x100.png?text=BW" },
  { name: "Fiona Garcia", points: 1850, avatar: "https://placehold.co/100x100.png?text=FG" },
]

const recentKudos = [
  { from: "Charlie Brown", to: "Diana Smith", reason: "for exceptional leadership on the Q2 project.", points: 50 },
  { from: "Admin", to: "Entire Sales Team", reason: "for exceeding their quarterly targets.", points: 100 },
  { from: "Fiona Garcia", to: "George Black", reason: "for being a fantastic mentor and guide.", points: 30 },
  { from: "HR Bot", to: "Alice Johnson", reason: "for a 3-year work anniversary!", points: 75 },
]

const rewards = [
    { name: "Company Swag Pack", cost: 500, icon: <Gift className="h-6 w-6 text-blue-500" /> },
    { name: "Half-day off", cost: 1000, icon: <Gift className="h-6 w-6 text-green-500" /> },
    { name: "Team Lunch Voucher", cost: 1500, icon: <Gift className="h-6 w-6 text-yellow-500" /> },
    { name: "Professional Development Fund", cost: 3000, icon: <Gift className="h-6 w-6 text-purple-500" /> },
]

export default function RecognitionPage() {
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
              <ul className="space-y-4">
                {leaderboard.map((person, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <span className="font-bold text-lg text-muted-foreground">{index + 1}</span>
                    <Avatar>
                      <AvatarImage src={person.avatar} alt={person.name} data-ai-hint="employee avatar" />
                      <AvatarFallback>{person.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{person.name}</p>
                      <p className="text-sm text-muted-foreground">{person.points.toLocaleString()} pts</p>
                    </div>
                  </li>
                ))}
              </ul>
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
                    <ul className="space-y-4">
                        {recentKudos.map((kudo, index) => (
                            <li key={index} className="p-4 rounded-lg border bg-muted/20 flex items-start gap-4">
                               <Avatar>
                                    <AvatarFallback>{kudo.from.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                               </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm">
                                        <span className="font-semibold">{kudo.from}</span> gave kudos to <span className="font-semibold">{kudo.to}</span>
                                    </p>
                                    <p className="text-muted-foreground text-sm mt-1 italic">"{kudo.reason}"</p>
                                </div>
                                <Badge className="bg-green-500 hover:bg-green-600 text-white">+{kudo.points} pts</Badge>
                            </li>
                        ))}
                    </ul>
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
                            <div className="flex justify-center">{reward.icon}</div>
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
