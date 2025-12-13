import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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

const Leaderboard = () => {
  const topPlayers = [
    { rank: 1, name: "Sarah Chen", avatar: "SC", xp: 15420, quizzes: 234, streak: 45, change: "up" },
    { rank: 2, name: "Alex Johnson", avatar: "AJ", xp: 14850, quizzes: 212, streak: 38, change: "up" },
    { rank: 3, name: "Mike Williams", avatar: "MW", xp: 14200, quizzes: 198, streak: 32, change: "down" },
    { rank: 4, name: "Emma Davis", avatar: "ED", xp: 13650, quizzes: 187, streak: 28, change: "same" },
    { rank: 5, name: "James Miller", avatar: "JM", xp: 12900, quizzes: 176, streak: 25, change: "up" },
    { rank: 6, name: "Lisa Anderson", avatar: "LA", xp: 12450, quizzes: 165, streak: 22, change: "down" },
    { rank: 7, name: "David Brown", avatar: "DB", xp: 11800, quizzes: 154, streak: 19, change: "up" },
    { rank: 8, name: "Sophie Taylor", avatar: "ST", xp: 11200, quizzes: 143, streak: 17, change: "same" },
    { rank: 9, name: "Chris Wilson", avatar: "CW", xp: 10650, quizzes: 132, streak: 15, change: "up" },
    { rank: 10, name: "Anna Martin", avatar: "AM", xp: 10100, quizzes: 121, streak: 12, change: "down" },
  ];

  const categoryLeaders = {
    academic: [
      { rank: 1, name: "Dr. Robert Lee", avatar: "RL", score: 98, quizzes: 89 },
      { rank: 2, name: "Prof. Maria Garcia", avatar: "MG", score: 96, quizzes: 76 },
      { rank: 3, name: "Jennifer White", avatar: "JW", score: 94, quizzes: 82 },
    ],
    entertainment: [
      { rank: 1, name: "Movie Buff Mike", avatar: "MM", score: 97, quizzes: 156 },
      { rank: 2, name: "Trivia Queen Tina", avatar: "TQ", score: 95, quizzes: 142 },
      { rank: 3, name: "Pop Culture Pete", avatar: "PP", score: 93, quizzes: 128 },
    ],
    general: [
      { rank: 1, name: "Know-It-All Ken", avatar: "KK", score: 96, quizzes: 201 },
      { rank: 2, name: "Wise Wendy", avatar: "WW", score: 94, quizzes: 189 },
      { rank: 3, name: "Factual Frank", avatar: "FF", score: 92, quizzes: 175 },
    ],
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-warning" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-muted-foreground" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-accent" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getChangeIcon = (change: string) => {
    if (change === "up") return <ChevronUp className="w-4 h-4 text-success" />;
    if (change === "down") return <ChevronDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getRankGradient = (rank: number) => {
    if (rank === 1) return "gradient-primary";
    if (rank === 2) return "bg-gradient-to-r from-slate-400 to-slate-500";
    if (rank === 3) return "gradient-accent";
    return "bg-muted";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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
                <p className="text-3xl font-bold">12,458</p>
                <p className="text-muted-foreground">Active Players</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 card-shadow text-center">
              <CardContent className="p-6">
                <Trophy className="w-10 h-10 text-warning mx-auto mb-3" />
                <p className="text-3xl font-bold">45,892</p>
                <p className="text-muted-foreground">Quizzes Completed</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 card-shadow text-center">
              <CardContent className="p-6">
                <Flame className="w-10 h-10 text-destructive mx-auto mb-3" />
                <p className="text-3xl font-bold">45</p>
                <p className="text-muted-foreground">Longest Streak</p>
              </CardContent>
            </Card>
          </div>

          {/* Top 3 Podium */}
          <div className="flex justify-center items-end gap-4 mb-12 max-w-3xl mx-auto">
            {/* 2nd Place */}
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-slate-400 to-slate-500 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {topPlayers[1].avatar}
              </div>
              <p className="font-semibold text-foreground">{topPlayers[1].name}</p>
              <p className="text-sm text-muted-foreground">{topPlayers[1].xp.toLocaleString()} XP</p>
              <div className="h-24 bg-gradient-to-r from-slate-400 to-slate-500 rounded-t-lg mt-3 flex items-center justify-center">
                <Medal className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center animate-slide-up">
              <div className="relative">
                <Crown className="w-8 h-8 text-warning absolute -top-8 left-1/2 -translate-x-1/2 animate-float" />
                <div className="w-24 h-24 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center text-white text-3xl font-bold shadow-xl animate-glow">
                  {topPlayers[0].avatar}
                </div>
              </div>
              <p className="font-bold text-lg text-foreground">{topPlayers[0].name}</p>
              <p className="text-sm text-muted-foreground">{topPlayers[0].xp.toLocaleString()} XP</p>
              <div className="h-32 gradient-primary rounded-t-lg mt-3 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-20 h-20 rounded-full gradient-accent mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {topPlayers[2].avatar}
              </div>
              <p className="font-semibold text-foreground">{topPlayers[2].name}</p>
              <p className="text-sm text-muted-foreground">{topPlayers[2].xp.toLocaleString()} XP</p>
              <div className="h-20 gradient-accent rounded-t-lg mt-3 flex items-center justify-center">
                <Medal className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Tabs for different views */}
          <Tabs defaultValue="global" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="global">Global</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="category">By Category</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
            </TabsList>

            <TabsContent value="global">
              <Card className="border-border/50 card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Global Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPlayers.map((player, index) => (
                      <div
                        key={player.rank}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:bg-muted/50 ${player.rank <= 3 ? "bg-muted/30" : ""
                          }`}
                      >
                        <div className="w-10 flex justify-center">
                          {getRankIcon(player.rank)}
                        </div>
                        <div className={`w-12 h-12 rounded-full ${getRankGradient(player.rank)} flex items-center justify-center text-white font-bold`}>
                          {player.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{player.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {player.quizzes} quizzes • {player.streak} day streak
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <div>
                            <p className="font-bold text-foreground">{player.xp.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">XP</p>
                          </div>
                          {getChangeIcon(player.change)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly">
              <Card className="border-border/50 card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-destructive" />
                    This Week's Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPlayers.slice(0, 5).map((player, index) => (
                      <div
                        key={player.rank}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-all"
                      >
                        <div className="w-10 flex justify-center">
                          {getRankIcon(index + 1)}
                        </div>
                        <div className={`w-12 h-12 rounded-full ${getRankGradient(index + 1)} flex items-center justify-center text-white font-bold`}>
                          {player.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{player.name}</p>
                          <p className="text-sm text-muted-foreground">+{Math.floor(player.xp / 10)} XP this week</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-success">+{Math.floor(player.quizzes / 5)}</p>
                          <p className="text-sm text-muted-foreground">quizzes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="category">
              <div className="grid gap-6">
                {Object.entries(categoryLeaders).map(([category, leaders]) => (
                  <Card key={category} className="border-border/50 card-shadow">
                    <CardHeader>
                      <CardTitle className="capitalize flex items-center gap-2">
                        <Star className="w-5 h-5 text-warning" />
                        {category === "general" ? "General Knowledge" : category} Champions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {leaders.map((leader) => (
                          <div
                            key={leader.rank}
                            className={`p-4 rounded-lg ${getRankGradient(leader.rank)} text-white text-center`}
                          >
                            <div className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center text-xl font-bold">
                              {leader.avatar}
                            </div>
                            <p className="font-semibold">{leader.name}</p>
                            <p className="text-sm opacity-90">{leader.score}% avg score</p>
                            <p className="text-xs opacity-75">{leader.quizzes} quizzes</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="friends">
              <Card className="border-border/50 card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Friends Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold text-foreground mb-2">Connect with Friends</p>
                  <p className="text-muted-foreground mb-6">Add friends to compare scores and compete together!</p>
                  <Button className="gradient-primary text-white">
                    Find Friends
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Your Position */}
          <Card className="border-border/50 card-shadow max-w-4xl mx-auto mt-8 bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold">
                    JD
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">Your Position</p>
                    <p className="text-muted-foreground">Keep playing to climb the ranks!</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">#247</p>
                    <p className="text-sm text-muted-foreground">Global Rank</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">5,420</p>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;