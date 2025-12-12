import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Zap,
  Upload
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { calculateLevel } from "@/lib/levelUtils";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, checkAuth } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Get user interests from preferences - MUST be before editFormData
  const userInterests = user?.preferences?.interests || [];

  // Edit profile state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  // Stats summary state
  const [statsSummary, setStatsSummary] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [xp, setXP] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // Calculate level from XP
  const levelInfo = calculateLevel(xp);

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [summaryRes, streakRes, xpRes] = await Promise.all([
          api.getHistorySummary(),
          api.getUserStreak(),
          api.getUserXP()
        ]);
        // Backend wraps in {success, message, data}, so access .data
        const summaryData: any = summaryRes;
        const streakData: any = streakRes;
        const xpData: any = xpRes;
        setStatsSummary(summaryData.data || {});
        setStreak(streakData.data || {});
        setXP(xpData.data?.xp_score || 0);
        console.log('Stats fetched:', {
          summary: summaryData.data,
          streak: streakData.data,
          xp: xpData.data
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);
  const [editFormData, setEditFormData] = useState({
    full_name: user?.full_name || '',
    bio: '',
    preferences: {
      interests: userInterests
    }
  });

  // Predefined preference options
  const availablePreferences = [
    'Art', 'Entertainment', 'Study', 'Science', 'Music',
    'Sports', 'Technology', 'History', 'Literature', 'Mathematics',
    'Physics', 'Chemistry', 'Biology', 'Geography', 'Movies',
    'Gaming', 'Cooking', 'Travel', 'Photography', 'Fashion'
  ];

  // Get user's initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Avatar image must be smaller than 5MB",
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      await api.uploadAvatar(selectedFile);
      toast({
        title: "Success!",
        description: "Avatar uploaded successfully",
      });
      setShowAvatarDialog(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      // Refresh user data to get new avatar
      await checkAuth();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddPreference = (preference: string) => {
    if (!editFormData.preferences.interests.includes(preference)) {
      setEditFormData({
        ...editFormData,
        preferences: {
          interests: [...editFormData.preferences.interests, preference]
        }
      });
    }
  };

  const handleRemovePreference = (preference: string) => {
    setEditFormData({
      ...editFormData,
      preferences: {
        interests: editFormData.preferences.interests.filter(p => p !== preference)
      }
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.updateProfile(editFormData);
      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });
      setShowEditDialog(false);
      // Refresh user data
      await checkAuth();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const userProfile = {
    name: user?.full_name || "User",
    email: user?.email || "",
    username: `@${user?.email?.split('@')[0] || 'user'}`,
    avatar: user?.avatar || getInitials(user?.full_name || "U"),
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
    { icon: "ðŸ†", name: "Quiz Master", description: "Complete 100 quizzes", earned: true },
    { icon: "âš¡", name: "Speed Demon", description: "Finish a quiz in under 2 minutes", earned: true },
    { icon: "ðŸ”¥", name: "On Fire", description: "7-day streak", earned: true },
    { icon: "ðŸŽ¯", name: "Perfect Score", description: "Get 100% on any quiz", earned: true },
    { icon: "ðŸ“š", name: "Knowledge Seeker", description: "Try all categories", earned: true },
    { icon: "ðŸ’Ž", name: "Diamond Rank", description: "Reach top 100 globally", earned: false },
    { icon: "ðŸŒŸ", name: "Superstar", description: "Earn 10,000 XP", earned: false },
    { icon: "ðŸ‘‘", name: "Legend", description: "30-day streak", earned: false },
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
                {/* Check avatar_file first (uploaded), then avatar (URL from OAuth) */}
                {(user?.avatar_file || (user?.avatar && user.avatar.startsWith('http'))) ? (
                  <img
                    src={user.avatar_file || user.avatar}
                    alt={user.full_name}
                    className="w-32 h-32 rounded-2xl border-4 border-background shadow-xl object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl gradient-primary flex items-center justify-center text-white text-4xl font-bold border-4 border-background shadow-xl">
                    {userProfile.avatar}
                  </div>
                )}
                <button
                  onClick={() => setShowAvatarDialog(true)}
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full gradient-secondary flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-opacity"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-20 mb-8 flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">{userProfile.name}</h1>
              <p className="text-muted-foreground">{userProfile.email}</p>

              {/* Bio Section */}
              {user?.bio && (
                <p className="text-sm text-foreground mt-2">{user.bio}</p>
              )}

              {/* Preferences Section */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Preferences</h3>
                {userInterests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userInterests.map((interest: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-foreground font-medium text-sm hover:scale-105 transition-transform"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No preferences set yet</p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setEditFormData({
                  full_name: user?.full_name || '',
                  bio: user?.bio || '',
                  preferences: {
                    interests: userInterests
                  }
                });
                setShowEditDialog(true);
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
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
                    <p className="text-2xl font-bold text-foreground">
                      Level {loadingStats ? '...' : levelInfo.level}
                    </p>
                    <p className="text-muted-foreground">Quiz Champion</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
                    {loadingStats ? '...' : `${xp} / ${levelInfo.nextLevelXP} XP`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loadingStats ? '...' : `${levelInfo.nextLevelXP - xp} XP to next level`}
                  </p>
                </div>
              </div>
              <Progress
                value={loadingStats ? 0 : levelInfo.progressPercentage}
                className="h-4"
              />
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            <Card className="border-border/50 card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                    <p className="text-3xl font-bold text-foreground">
                      {loadingStats ? '...' : `${streak?.current_streak || 0} 🔥`}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                </div>
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
                        className={`p-4 rounded-lg border ${achievement.earned
                          ? "border-warning/30 bg-warning/5"
                          : "border-border/50 bg-muted/20 opacity-50"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${achievement.earned ? "bg-warning/20" : "bg-muted"
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
                          <span className="text-muted-foreground">{category.quizzes} quizzes â€¢ {category.avgScore}% avg</span>
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

      {/* Avatar Upload Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Avatar</DialogTitle>
            <DialogDescription>
              Choose an image to upload as your profile avatar (max 5MB)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {previewUrl ? (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={previewUrl}
                  alt="Avatar preview"
                  className="w-32 h-32 rounded-xl object-cover border-4 border-primary/20"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  Choose Different Image
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to select an image
                  </p>
                </label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAvatarDialog(false);
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="gradient-primary text-white"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload Avatar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fullname">Full Name</Label>
              <Input
                id="edit-fullname"
                value={editFormData.full_name}
                onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Input
                id="edit-bio"
                value={editFormData.bio}
                onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                placeholder="Enter your bio"
              />
            </div>
            <div className="space-y-2">
              <Label>Preferences</Label>
              <select
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddPreference(e.target.value);
                    e.target.value = '';
                  }
                }}
                disabled={saving}
              >
                <option value="">Select a preference to add...</option>
                {availablePreferences
                  .filter(pref => !editFormData.preferences.interests.includes(pref))
                  .map((pref) => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
              </select>
              {/* Selected Preferences */}
              {editFormData.preferences.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editFormData.preferences.interests.map((interest: string) => (
                    <span
                      key={interest}
                      className="px-3 py-1 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-foreground font-medium text-sm flex items-center gap-2"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemovePreference(interest)}
                        className="hover:text-destructive transition-colors"
                        disabled={saving}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="gradient-primary text-white"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
