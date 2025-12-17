import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Trophy,
    Medal,
    Crown,
    TrendingUp,
    Users,
    Flame,
    Star,
    ChevronUp,
    ChevronDown,
    Minus
} from "lucide-react";
import { useState, useEffect } from "react";
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

const Leaderboard = () => {
    const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.getLeaderboard(100); // Get top 100
                const data: any = response;

                if (data.success && data.data) {
                    setTopPlayers(data.data.leaderboard || []);
                    setCurrentUserRank(data.data.current_user_rank);
                    setTotalUsers(data.data.total_users || 0);
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
        if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRankGradient = (rank: number) => {
        if (rank === 1) return "gradient-primary";
        if (rank === 2) return "bg-gradient-to-r from-slate-400 to-slate-500";
        if (rank === 3) return "gradient-accent";
        return "bg-muted";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">                <main className="pt-24 pb-16">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-xl text-muted-foreground">Loading leaderboard...</p>
                    </div>
                </main>            </div>
        );
    }

    const top3 = topPlayers.slice(0, 3);
    const currentUser = user && topPlayers.find(p => p.user_id === user.id);

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-4">
                            Global <span className="text-foreground">Leaderboard</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            See how you stack up against the best quiz masters in the world
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                        <Card className="border-border/50 card-shadow text-center">
                            <CardContent className="p-6">
                                <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                                <p className="text-3xl font-bold">{totalUsers.toLocaleString()}</p>
                                <p className="text-muted-foreground">Active Players</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 card-shadow text-center">
                            <CardContent className="p-6">
                                <Trophy className="w-10 h-10 text-warning mx-auto mb-3" />
                                <p className="text-3xl font-bold">{topPlayers.reduce((sum, p) => sum + (p.xp_score || 0), 0).toLocaleString()}</p>
                                <p className="text-muted-foreground">Total XP Earned</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 card-shadow text-center">
                            <CardContent className="p-6">
                                <Flame className="w-10 h-10 text-destructive mx-auto mb-3" />
                                <p className="text-3xl font-bold">{top3[0]?.level || 0}</p>
                                <p className="text-muted-foreground">Highest Level</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top 3 Podium */}
                    {top3.length >= 3 && (
                        <div className="flex justify-center items-end gap-4 mb-12 max-w-3xl mx-auto">
                            {/* 2nd Place */}
                            <div className="text-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-slate-400 to-slate-500 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {getInitials(top3[1].full_name)}
                                </div>
                                <p className="font-semibold text-foreground">{top3[1].full_name}</p>
                                <p className="text-sm text-muted-foreground">{top3[1].xp_score.toLocaleString()} XP</p>
                                <div className="h-24 bg-gradient-to-r from-slate-400 to-slate-500 rounded-t-lg mt-3 flex items-center justify-center">
                                    <Medal className="w-10 h-10 text-white" />
                                </div>
                            </div>

                            {/* 1st Place */}
                            <div className="text-center animate-slide-up">
                                <div className="relative">
                                    <Crown className="w-8 h-8 text-yellow-500 absolute -top-8 left-1/2 -translate-x-1/2 animate-float" />
                                    <div className="w-24 h-24 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center text-white text-3xl font-bold shadow-xl animate-glow">
                                        {getInitials(top3[0].full_name)}
                                    </div>
                                </div>
                                <p className="font-bold text-lg text-foreground">{top3[0].full_name}</p>
                                <p className="text-sm text-muted-foreground">{top3[0].xp_score.toLocaleString()} XP</p>
                                <div className="h-32 gradient-primary rounded-t-lg mt-3 flex items-center justify-center">
                                    <Trophy className="w-12 h-12 text-white" />
                                </div>
                            </div>

                            {/* 3rd Place */}
                            <div className="text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
                                <div className="w-20 h-20 rounded-full gradient-accent mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {getInitials(top3[2].full_name)}
                                </div>
                                <p className="font-semibold text-foreground">{top3[2].full_name}</p>
                                <p className="text-sm text-muted-foreground">{top3[2].xp_score.toLocaleString()} XP</p>
                                <div className="h-20 gradient-accent rounded-t-lg mt-3 flex items-center justify-center">
                                    <Medal className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Leaderboard */}
                    <Tabs defaultValue="global" className="max-w-4xl mx-auto">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="global">Global Rankings</TabsTrigger>
                            <TabsTrigger value="top100">Top 100</TabsTrigger>
                        </TabsList>

                        <TabsContent value="global">
                            <Card className="border-border/50 card-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                        Top 10 Players
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {topPlayers.slice(0, 10).map((player) => (
                                            <div
                                                key={player.user_id}
                                                className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:bg-muted/50 ${player.rank <= 3 ? "bg-muted/30" : ""
                                                    } ${user && player.user_id === user.id ? "bg-primary/10 border border-primary/30" : ""}`}
                                            >
                                                <div className="w-10 flex justify-center">
                                                    {getRankIcon(player.rank)}
                                                </div>
                                                <div className={`w-12 h-12 rounded-full ${getRankGradient(player.rank)} flex items-center justify-center text-white font-bold`}>
                                                    {getInitials(player.full_name)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-foreground">{player.full_name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Level {player.level} • @{player.username}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-foreground">{player.xp_score.toLocaleString()}</p>
                                                    <p className="text-sm text-muted-foreground">XP</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="top100">
                            <Card className="border-border/50 card-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-warning" />
                                        Top 100 Rankings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                        {topPlayers.map((player) => (
                                            <div
                                                key={player.user_id}
                                                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all ${user && player.user_id === user.id ? "bg-primary/10 border border-primary/30" : ""
                                                    }`}
                                            >
                                                <div className="w-8 text-center">
                                                    <span className="text-sm font-bold text-muted-foreground">#{player.rank}</span>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                                                    {getInitials(player.full_name)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{player.full_name}</p>
                                                    <p className="text-xs text-muted-foreground">Level {player.level}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm">{player.xp_score.toLocaleString()}</p>
                                                    <p className="text-xs text-muted-foreground">XP</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Your Position */}
                    {user && currentUser && (
                        <Card className="border-border/50 card-shadow max-w-4xl mx-auto mt-8 bg-gradient-to-r from-primary/10 to-secondary/10">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold">
                                            {getInitials(currentUser.full_name)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-foreground">Your Position</p>
                                            <p className="text-muted-foreground">Keep playing to climb the ranks!</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-foreground">#{currentUserRank}</p>
                                            <p className="text-sm text-muted-foreground">Global Rank</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-foreground">{currentUser.xp_score.toLocaleString()}</p>
                                            <p className="text-sm text-muted-foreground">Total XP</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-foreground">{currentUser.level}</p>
                                            <p className="text-sm text-muted-foreground">Level</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>        </div>
    );
};

export default Leaderboard;
