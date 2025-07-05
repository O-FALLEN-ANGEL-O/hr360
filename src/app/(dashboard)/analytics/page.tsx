"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Loader2, TrendingUp, Flame, DollarSign, Lightbulb, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePredictiveAnalyticsDashboard, type PredictiveAnalyticsDashboardOutput } from "@/ai/flows/predictive-analytics-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const [result, setResult] = useState<PredictiveAnalyticsDashboardOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchAnalytics = useCallback(async () => {
    if (!isLoading) setIsRefreshing(true);
    try {
      // Mock data for the flow input
      const mockInput = {
        companyData: "Aggregated data: 500 employees, avg tenure 3.5 yrs, 15% turnover last year. Performance reviews avg 3.8/5. Sales dept shows highest exit rate.",
        industryBenchmarks: "Industry avg attrition is 18%. Salary for developers is benchmarked at $120k.",
        economicIndicators: "Tech market is growing, leading to higher competition for talent.",
      };
      const response = await generatePredictiveAnalyticsDashboard(mockInput);
      setResult(response);
       if (!isLoading) {
         toast({
            title: "Analytics Refreshed!",
            description: "The latest predictive insights have been loaded.",
         });
       }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load predictive analytics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isLoading, toast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const AnalyticsCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-3 rounded-full bg-primary/10 text-primary">{icon}</div>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-24 w-full" /> : <p className="text-sm text-muted-foreground">{children}</p>}
        </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Predictive Analytics Dashboard"
          description="AI-driven insights on attrition, burnout, and salary benchmarks."
        />
        <Button variant="outline" onClick={() => fetchAnalytics()} disabled={isRefreshing || isLoading}>
            {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <AnalyticsCard icon={<TrendingUp />} title="Attrition Prediction">
            {result?.attritionPrediction}
        </AnalyticsCard>

        <AnalyticsCard icon={<Flame />} title="Burnout Heatmap">
            {result?.burnoutHeatmap}
        </AnalyticsCard>

        <AnalyticsCard icon={<DollarSign />} title="Salary Benchmarks">
            {result?.salaryBenchmarks}
        </AnalyticsCard>

        <AnalyticsCard icon={<Lightbulb />} title="Key Insights & Recommendations">
            {result?.keyInsights}
        </AnalyticsCard>
      </div>

    </div>
  );
}
