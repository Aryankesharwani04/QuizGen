import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, Target, Clock, TrendingUp, PlayCircle, CheckCircle2, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Quiz creation state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [quizForm, setQuizForm] = useState({
    category: '',
    title: '',
    level: 'easy' as 'easy' | 'medium' | 'hard',
    num_questions: 10,
    duration_seconds: 600,
    additional_instructions: ''
  });

  // Quiz list state
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);

  // Recent attempts state
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);

  // Stats summary state
  const [statsSummary, setStatsSummary] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch quizzes on mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.getQuizList();
        const data: any = response;
        setQuizzes(data.quizzes || []);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
        toast({
          variant: "destructive",
          title: "Failed to load quizzes",
          description: "Could not fetch quiz list"
        });
      } finally {
        setLoadingQuizzes(false);
      }
    };
    fetchQuizzes();
  }, []);

  // Fetch recent quiz attempts
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await api.getQuizHistory();
        const data: any = response;
        setRecentAttempts((data.data?.attempts || []).slice(0, 2)); // Access data.data.attempts
      } catch (error) {
        console.error('Failed to fetch quiz history:', error);
      } finally {
        setLoadingAttempts(false);
      }
    };
    fetchAttempts();
  }, []);

  // Fetch stats summary
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.getHistorySummary();
        const data: any = response;
        setStatsSummary(data.data || {});
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Category performance state
  const [categoryPerformance, setCategoryPerformance] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch category performance
  useEffect(() => {
    const fetchCategoryPerformance = async () => {
      try {
        const response = await api.getCategoryPerformance();
        const data: any = response;
        setCategoryPerformance(data.data?.categories || []);
      } catch (error) {
        console.error('Failed to fetch category performance:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategoryPerformance();
  }, []);

  // Streak state
  const [streak, setStreak] = useState<any>(null);
  const [loadingStreak, setLoadingStreak] = useState(true);

  // Fetch user streak
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await api.getUserStreak();
        const data: any = response;
        setStreak(data.data || {});
      } catch (error) {
        console.error('Failed to fetch streak:', error);
      } finally {
        setLoadingStreak(false);
      }
    };
    fetchStreak();
  }, []);

  const handleCreateQuiz = async () => {
    if (!quizForm.category || !quizForm.title) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in category and title"
      });
      return;
    }

    setCreating(true);
    try {
      const response = await api.createQuiz(quizForm);
      toast({
        title: "Quiz Created Successfully! 🎉",
        description: `Quiz ID: ${response.data.quiz_id} with ${response.data.num_questions} questions`
      });
      setShowCreateDialog(false);
      // Reset form
      setQuizForm({
        category: '',
        title: '',
        level: 'easy',
        num_questions: 10,
        duration_seconds: 600,
        additional_instructions: ''
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Quiz Creation Failed",
        description: error.message || "Failed to create quiz. Please try again."
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.full_name || 'User'}! 👋</h1>
              <p className="text-muted-foreground text-lg">Track your progress and continue your learning journey</p>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="gradient-primary text-white font-semibold"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Quiz
            </Button>
          </div>

          {/* Create Quiz Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Quiz</DialogTitle>
                <DialogDescription>
                  Fill in the details below to generate a new quiz with AI-powered questions
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Mathematics, Science"
                      value={quizForm.category}
                      onChange={(e) => setQuizForm({ ...quizForm, category: e.target.value })}
                      disabled={creating}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Quiz Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Algebra Basics"
                      value={quizForm.title}
                      onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                      disabled={creating}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Difficulty Level</Label>
                    <select
                      id="level"
                      value={quizForm.level}
                      onChange={(e) => setQuizForm({ ...quizForm, level: e.target.value as 'easy' | 'medium' | 'hard' })}
                      disabled={creating}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="num_questions">Number of Questions</Label>
                    <Input
                      id="num_questions"
                      type="number"
                      min="1"
                      max="50"
                      value={quizForm.num_questions}
                      onChange={(e) => setQuizForm({ ...quizForm, num_questions: parseInt(e.target.value) || 10 })}
                      disabled={creating}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="60"
                      value={quizForm.duration_seconds}
                      onChange={(e) => setQuizForm({ ...quizForm, duration_seconds: parseInt(e.target.value) || 600 })}
                      disabled={creating}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
                  <textarea
                    id="instructions"
                    placeholder="e.g., Focus on linear equations and basic algebra"
                    value={quizForm.additional_instructions}
                    onChange={(e) => setQuizForm({ ...quizForm, additional_instructions: e.target.value })}
                    disabled={creating}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background min-h-[80px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateQuiz}
                  disabled={creating}
                  className="gradient-primary text-white"
                >
                  {creating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Quiz...
                    </>
                  ) : (
                    "Create Quiz"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* In Progress Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/50 card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-primary" />
                    <Link
                      to={"/categories"}>
                      Explore Quizzes
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingQuizzes ? (
                    <div className="text-center py-8 text-muted-foreground">Loading quizzes...</div>
                  ) : quizzes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No quizzes available yet. Create your first quiz!</div>
                  ) : (
                    quizzes.slice(0, 3).map((quiz, index) => (
                      <div key={quiz.quiz_id} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">{quiz.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Quiz ID: {quiz.quiz_id} • {quiz.category} • {quiz.num_questions} questions • Level: {quiz.level}
                            </p>
                          </div>
                          <Link to={`/quiz/${quiz.quiz_id}`}>
                            <Button size="sm" className="gradient-primary text-white">
                              Start
                            </Button>
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{Math.floor(quiz.duration_seconds / 60)} minutes</span>
                        </div>
                      </div>
                    ))
                  )}
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
                    {loadingAttempts ? (
                      <div className="text-center py-8 text-muted-foreground">Loading history...</div>
                    ) : recentAttempts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No quizzes completed yet. Start your first quiz!</div>
                    ) : (
                      recentAttempts.map((attempt) => (
                        <div key={attempt.attempt_id} className="p-4 rounded-lg bg-muted/30">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-foreground">{attempt.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Quiz ID: {attempt.quiz_id} • Score: {attempt.score}/{attempt.total_questions}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-success">{attempt.percentage}%</p>
                            </div>
                          </div>
                          {/* Progress bar for score */}
                          <Progress value={attempt.percentage} className="h-2 mb-2" />
                          {/* Review button */}
                          <div className="flex justify-end">
                            <Link
                              to={`/quiz/review/${attempt.attempt_id}`}
                              className="text-sm text-primary hover:underline cursor-pointer"
                            >
                              Review
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
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
                  {loadingCategories ? (
                    <div className="text-center py-8 text-muted-foreground">Loading...</div>
                  ) : categoryPerformance.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No quizzes attempted yet</div>
                  ) : (
                    categoryPerformance.map((cat, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">{cat.category}</span>
                          <span className="text-sm font-semibold">{cat.average_score}%</span>
                        </div>
                        <Progress value={cat.average_score} className="h-2" />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border/50 card-shadow">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full gradient-primary text-white justify-start"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Create New Quiz
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Trophy className="w-5 h-5 mr-2" />
                    View Achievements
                  </Button>
                  <Link
                    to="/categories"
                    className="w-full justify-start flex items-center border rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Browse Categories
                  </Link>

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
