import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Clock, TrendingUp, PlayCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome back, John! 👋</h1>
            <p className="text-muted-foreground text-lg">Track your progress and continue your learning journey</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-border/50 card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Quizzes</p>
                    <p className="text-3xl font-bold text-foreground">45</p>
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
                    <p className="text-3xl font-bold text-foreground">87%</p>
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
                    <p className="text-3xl font-bold text-foreground">24h</p>
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
                    <p className="text-sm text-muted-foreground mb-1">Improvement</p>
                    <p className="text-3xl font-bold text-success">+12%</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* In Progress Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/50 card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-primary" />
                    Continue Learning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Physics: Quantum Mechanics", progress: 65, questions: "13/20", category: "Academic" },
                    { title: "Movie Trivia: 90s Classics", progress: 40, questions: "8/20", category: "Entertainment" },
                    { title: "World Geography", progress: 80, questions: "16/20", category: "General Knowledge" },
                  ].map((quiz, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground">{quiz.category} • {quiz.questions} completed</p>
                        </div>
                        <Button size="sm" className="gradient-primary text-white">
                          Resume
                        </Button>
                      </div>
                      <Progress value={quiz.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border/50 card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    Recently Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { title: "Chemistry: Organic Compounds", score: 95, date: "2 hours ago" },
                      { title: "Sports History", score: 88, date: "Yesterday" },
                      { title: "Programming Basics", score: 92, date: "2 days ago" },
                    ].map((quiz, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div>
                          <h4 className="font-medium text-foreground">{quiz.title}</h4>
                          <p className="text-sm text-muted-foreground">{quiz.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-success">{quiz.score}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Performance Chart */}
              <Card className="border-border/50 card-shadow">
                <CardHeader>
                  <CardTitle>Your Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Academic</span>
                      <span className="text-sm font-semibold">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Entertainment</span>
                      <span className="text-sm font-semibold">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">General Knowledge</span>
                      <span className="text-sm font-semibold">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border/50 card-shadow">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full gradient-primary text-white justify-start">
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Start New Quiz
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Trophy className="w-5 h-5 mr-2" />
                    View Achievements
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-5 h-5 mr-2" />
                    Browse Categories
                  </Button>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="border-border/50 card-shadow">
                <CardHeader>
                  <CardTitle>Recent Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {["🏆", "⭐", "🎯", "🔥", "💎", "🚀"].map((emoji, index) => (
                      <div key={index} className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl hover:scale-110 transition-transform cursor-pointer">
                        {emoji}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
