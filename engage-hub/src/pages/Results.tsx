import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  Share2,
  Star,
  Zap
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultsData = location.state;

  // Redirect to dashboard if no results data
  useEffect(() => {
    if (!resultsData) {
      navigate('/dashboard');
    }
  }, [resultsData, navigate]);

  if (!resultsData) {
    return null; // Will redirect
  }

  // Use passed data from QuizAttempt
  const results = {
    quizTitle: resultsData.quizTitle,
    category: resultsData.category,
    score: resultsData.score,
    correctAnswers: resultsData.correctAnswers,
    totalQuestions: resultsData.totalQuestions,
    timeTaken: resultsData.timeTaken,
    difficulty: resultsData.difficulty,
    xpEarned: resultsData.xpEarned,
    quizType: resultsData.quizType || 'time-based', // Get quiz type from navigation state
  };

  const questions = resultsData.questions || [];
  const isLearningBased = results.quizType === 'learning-based';

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Outstanding! 🎉";
    if (score >= 70) return "Great Job! 👏";
    if (score >= 50) return "Good Effort! 💪";
    return "Keep Practicing! 📚";
  };

  return (
    <div className="min-h-screen bg-transparent">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Score Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Quiz Complete!</h1>
            <p className="text-xl text-muted-foreground mb-8">{results.quizTitle}</p>

            <div className="relative inline-block">
              <div className="w-48 h-48 rounded-full gradient-primary p-1 mx-auto animate-glow">
                <div className="w-full h-full rounded-full bg-background flex flex-col items-center justify-center">
                  <span className={`text-6xl font-bold ${getScoreColor(results.score)}`}>
                    {results.score}%
                  </span>
                  <span className="text-muted-foreground text-sm mt-1">
                    {results.correctAnswers}/{results.totalQuestions} correct
                  </span>
                </div>
              </div>
            </div>

            <p className="text-2xl font-semibold mt-6 animate-slide-up">
              {getScoreMessage(results.score)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
            <Card className="border-border/50 card-shadow text-center animate-fade-in-scale" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-6">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {isLearningBased ? 'N/A' : results.timeTaken}
                </p>
                <p className="text-sm text-muted-foreground">Time Taken</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 card-shadow text-center animate-fade-in-scale" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-6">
                <Target className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="text-2xl font-bold">{results.difficulty}</p>
                <p className="text-sm text-muted-foreground">Difficulty</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 card-shadow text-center animate-fade-in-scale" style={{ animationDelay: "0.3s" }}>
              <CardContent className="p-6">
                <Zap className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {isLearningBased ? 'N/A' : `+${results.xpEarned}`}
                </p>
                <p className="text-sm text-muted-foreground">XP Earned</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link to="/categories">
              <Button className="gradient-primary text-white px-8 py-6 text-lg">
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Another Quiz
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="px-8 py-6 text-lg">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button variant="outline" className="px-8 py-6 text-lg">
              <Share2 className="w-5 h-5 mr-2" />
              Share Quiz
            </Button>
          </div>

          {/* Question Review */}
          <Card className="border-border/50 card-shadow max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Question Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border ${q.correct
                    ? "border-success/30 bg-success/5"
                    : "border-destructive/30 bg-destructive/5"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${q.correct ? "bg-success text-white" : "bg-destructive text-white"
                      }`}>
                      {q.correct ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-2">
                        Q{index + 1}. {q.question}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Your Answer: <span className={q.correct ? "text-success font-semibold" : "text-destructive font-semibold"}>
                            {q.yourAnswer}
                          </span>
                        </span>
                        {!q.correct && (
                          <span className="text-muted-foreground">
                            Correct Answer: <span className="text-success font-semibold">{q.correctAnswer}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Breakdown */}
          <Card className="border-border/50 card-shadow max-w-4xl mx-auto mt-8">
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="text-sm font-semibold">{results.score}%</span>
                </div>
                <Progress value={results.score} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Speed (based on time)</span>
                  <span className="text-sm font-semibold">Good</span>
                </div>
                <Progress value={75} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>    </div>
  );
};

export default Results;