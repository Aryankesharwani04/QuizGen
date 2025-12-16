import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Trophy, Clock, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";

interface StatsOverviewProps {
    className?: string;
}

export const StatsOverview = ({ className = "" }: StatsOverviewProps) => {
    // Stats summary state
    const [statsSummary, setStatsSummary] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    // Streak state
    const [streak, setStreak] = useState<any>(null);
    const [loadingStreak, setLoadingStreak] = useState(true);

    // Fetch stats summary with cache
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { default: cacheService } = await import('@/lib/cacheService');
                const cachedData: any = cacheService.get('stats_summary');

                if (cachedData) {
                    setStatsSummary(cachedData.data || {});
                    setLoadingStats(false);
                }

                const response = await api.getHistorySummary();
                const data: any = response;
                setStatsSummary(data.data || {});
                cacheService.set('stats_summary', response);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    // Fetch user streak with cache
    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const { default: cacheService } = await import('@/lib/cacheService');
                const cachedData: any = cacheService.get('user_streak');

                if (cachedData) {
                    setStreak(cachedData.data || {});
                    setLoadingStreak(false);
                }

                const response = await api.getUserStreak();
                const data: any = response;
                setStreak(data.data || {});
                cacheService.set('user_streak', response);
            } catch (error) {
                console.error('Failed to fetch streak:', error);
            } finally {
                setLoadingStreak(false);
            }
        };
        fetchStreak();
    }, []);

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
            {/* Total Quizzes */}
            <Card className="border-border/50 card-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Quizzes</p>
                            <p className="text-3xl font-bold text-foreground">
                                {loadingStats ? '...' : (statsSummary?.total_quizzes_attempted || 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Average Score */}
            <Card className="border-border/50 card-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Average Score</p>
                            <p className="text-3xl font-bold text-foreground">
                                {loadingStats ? '...' : `${statsSummary?.average_score_percentage || 0}%`}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Time Spent */}
            <Card className="border-border/50 card-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Time Spent</p>
                            <p className="text-3xl font-bold text-foreground">
                                {loadingStats ? '...' : `${((statsSummary?.total_time_spent || 0) / 3600).toFixed(1)}h`}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Current Streak */}
            <Card className="border-border/50 card-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                            <p className="text-3xl font-bold text-foreground">
                                {loadingStreak ? '...' : `${streak?.current_streak || 0} 🔥`}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-success" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
