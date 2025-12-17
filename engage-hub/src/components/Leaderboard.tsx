import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Crown } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface LeaderboardEntry {
    rank: number;
    user_id: number;
    username: string;
    full_name: string;
    xp_score: number;
    level: number;
    avatar?: string;
}

export const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Check cache first
                const { default: cacheService } = await import('@/lib/cacheService');
                const cacheKey = 'leaderboard';
                const cachedData: any = cacheService.get(cacheKey);

                // Show cached data immediately
                if (cachedData && cachedData.data?.leaderboard) {
                    setLeaderboard(cachedData.data.leaderboard);
                    setCurrentUserRank(cachedData.data.current_user_rank);
                    setLoading(false);
                }

                // Fetch fresh data
                const response = await api.getLeaderboard(10);
                const data: any = response;

                if (data.success && data.data) {
                    setLeaderboard(data.data.leaderboard || []);
                    setCurrentUserRank(data.data.current_user_rank);

                    // Update cache
                    cacheService.set(cacheKey, response);
                }
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
        if (rank === 2) return <Crown className="w-4 h-4 text-gray-400" />;
        if (rank === 3) return <Crown className="w-4 h-4 text-orange-600" />;
        return null;
    };

    return (
        <Card className="border-border/50 card-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Leaderboard
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : leaderboard.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No rankings yet</div>
                ) : (
                    <div className="space-y-3">
                        {leaderboard.map((entry) => (
                            <div
                                key={entry.user_id}
                                className={`p-3 rounded-lg flex items-center gap-3 ${user && entry.user_id === user.id
                                    ? 'bg-primary/10 border border-primary/30'
                                    : 'bg-muted/30'
                                    }`}
                            >
                                <div className="flex items-center gap-2 min-w-[40px]">
                                    {getRankIcon(entry.rank)}
                                    <span className="font-bold text-sm">#{entry.rank}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{entry.full_name}</p>
                                    <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm">{entry.xp_score.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">XP</p>
                                </div>
                            </div>
                        ))}

                        {currentUserRank && currentUserRank > 10 && (
                            <div className="pt-2 border-t border-border">
                                <p className="text-xs text-muted-foreground text-center">
                                    Your rank: #{currentUserRank}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
