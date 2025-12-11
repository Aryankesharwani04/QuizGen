import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Settings, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp,
  Edit2,
  Camera,
  Bell,
  Shield,
  Palette,
  LogOut,
  Award,
  Flame,
  Star,
  Zap
} from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const userProfile = {
    name: "John Doe",
    email: "john.doe@email.com",
    username: "@johndoe",
    avatar: "JD",
    bio: "Quiz enthusiast | Science lover | Always learning",
    level: 24,
    xp: 5420,
    xpToNextLevel: 8000,
    joinDate: "March 2024",
    totalQuizzes: 145,
    averageScore: 87,
    bestCategory: "Physics",
    streak: 12,
    longestStreak: 28,
    rank: 247,
  };

  const achievements = [
    { icon: "🏆", name: "Quiz Master", description: "Complete 100 quizzes", earned: true },
    { icon: "⚡", name: "Speed Demon", description: "Finish a quiz in under 2 minutes", earned: true },
    { icon: "🔥", name: "On Fire", description: "7-day streak", earned: true },
    { icon: "🎯", name: "Perfect Score", description: "Get 100% on any quiz", earned: true },
    { icon: "📚", name: "Knowledge Seeker", description: "Try all categories", earned: true },
    { icon: "💎", name: "Diamond Rank", description: "Reach top 100 globally", earned: false },
    { icon: "🌟", name: "Superstar", description: "Earn 10,000 XP", earned: false },
    { icon: "👑", name: "Legend", description: "30-day streak", earned: false },
  ];

  const recentActivity = [
    { quiz: "Physics: Quantum Mechanics", score: 95, date: "2 hours ago", xp: 150 },
    { quiz: "Movie Trivia: 90s Classics", score: 88, date: "Yesterday", xp: 120 },
    { quiz: "World Geography", score: 92, date: "2 days ago", xp: 135 },
    { quiz: "Chemistry: Organic Compounds", score: 85, date: "3 days ago", xp: 110 },
    { quiz: "Sports History", score: 78, date: "4 days ago", xp: 95 },
  ];

  const categoryStats = [
    { name: "Academic", quizzes: 65, avgScore: 89, color: "gradient-primary" },
    { name: "Entertainment", quizzes: 48, avgScore: 84, color: "gradient-secondary" },
    { name: "General Knowledge", quizzes: 32, avgScore: 88, color: "gradient-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="relative mb-8">
            <div className="h-48 rounded-2xl gradient-hero overflow-hidden" />
            <div className="absolute -bottom-16 left-8 flex items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl gradient-primary flex items-center justify-center text-white text-4xl font-bold border-4 border-background shadow-xl">
                  {userProfile.avatar}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full gradient-secondary flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-opacity">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-20 mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{userProfile.name}</h1>
              <p className="text-muted-foreground">{userProfile.username}</p>
              <p className="text-sm text-muted-foreground mt-2">{userProfile.bio}</p>
            </div>
            <Button 
              variant={isEditing ? "default" : "outline"} 
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? "gradient-primary text-white" : ""}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>

          {/* Level Progress */}
          <Card className="border-border/50 card-shadow mb-8 bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">Level {userProfile.level}</p>
                    <p className="text-muted-foreground">Quiz Champion</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">{userProfile.xp.toLocaleString()} / {userProfile.xpToNextLevel.toLocaleString()} XP</p>
                  <p className="text-sm text-muted-foreground">{userProfile.xpToNextLevel - userProfile.xp} XP to next level</p>
                </div>
              </div>
              <Progress value={(userProfile.xp / userProfile.xpToNextLevel) * 100} className="h-4" />
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50 card-shadow text-center">
              <CardContent className="p-6">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{userProfile.totalQuizzes}</p>
                <p className="text-sm text-muted-foreground">Quizzes Taken</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 card-shadow text-center">
              <CardContent className="p-6">
                <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="text-2xl font-bold">{userProfile.averageScore}%</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 card-shadow text-center">
              <CardContent className="p-6">
                <Flame className="w-8 h-8 text-destructive mx-auto mb-2" />
                <p className="text-2xl font-bold">{userProfile.streak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 card-shadow text-center">
              <CardContent className="p-6">
                <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold">#{userProfile.rank}</p>
                <p className="text-sm text-muted-foreground">Global Rank</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="activity" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              <Card className="border-border/50 card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{activity.quiz}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-success">{activity.score}%</p>
                          <p className="text-sm text-muted-foreground">+{activity.xp} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card className="border-border/50 card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-warning" />
                    Achievements ({achievements.filter(a => a.earned).length}/{achievements.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border ${
                          achievement.earned 
                            ? "border-warning/30 bg-warning/5" 
                            : "border-border/50 bg-muted/20 opacity-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                            achievement.earned ? "bg-warning/20" : "bg-muted"
                          }`}>
                            {achievement.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{achievement.name}</p>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                          {achievement.earned && (
                            <Star className="w-5 h-5 text-warning ml-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid gap-6">
                <Card className="border-border/50 card-shadow">
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {categoryStats.map((category, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-foreground">{category.name}</span>
                          <span className="text-muted-foreground">{category.quizzes} quizzes • {category.avgScore}% avg</span>
                        </div>
                        <Progress value={category.avgScore} className="h-3" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-border/50 card-shadow">
                    <CardHeader>
                      <CardTitle>Best Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Best Category</span>
                        <span className="font-semibold">{userProfile.bestCategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Highest Score</span>
                        <span className="font-semibold text-success">98%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Longest Streak</span>
                        <span className="font-semibold">{userProfile.longestStreak} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Best Rank</span>
                        <span className="font-semibold">#124</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 card-shadow">
                    <CardHeader>
                      <CardTitle>Time Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Time</span>
                        <span className="font-semibold">48h 32m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg per Quiz</span>
                        <span className="font-semibold">12m 15s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fastest Quiz</span>
                        <span className="font-semibold">1m 45s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member Since</span>
                        <span className="font-semibold">{userProfile.joinDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="grid gap-6">
                <Card className="border-border/50 card-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={userProfile.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue={userProfile.username} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={userProfile.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input id="bio" defaultValue={userProfile.bio} />
                      </div>
                    </div>
                    <Button className="gradient-primary text-white">Save Changes</Button>
                  </CardContent>
                </Card>

                <Card className="border-border/50 card-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {["Email notifications", "Push notifications", "Weekly digest", "Achievement alerts"].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-foreground">{item}</span>
                        <Button variant="outline" size="sm">Toggle</Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-border/50 card-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Two-Factor Authentication
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;