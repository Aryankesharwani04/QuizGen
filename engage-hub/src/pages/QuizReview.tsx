import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

const QuizReview = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [attempt, setAttempt] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttempt = async () => {
            try {
                const response = await api.getQuizHistoryById(parseInt(attemptId!));
                const data: any = response;
                setAttempt(data.data); // Access data.data since ResponseFormatter wraps it
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Failed to load quiz attempt",
                    description: "Could not fetch quiz review"
                });
                navigate("/dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchAttempt();
    }, [attemptId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading quiz review...</p>
                </div>
            </div>
        );
    }

    if (!attempt) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <Card className="max-w-2xl mx-auto border-border/50 card-shadow">
                        <CardHeader className="text-center">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <CardTitle className="text-3xl">Quiz Review</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center">
                                <p className="text-5xl font-bold text-primary mb-2">{attempt.percentage}%</p>
                                <p className="text-muted-foreground">You scored {attempt.score} out of {attempt.total_questions}</p>
                                <p className="text-sm text-muted-foreground mt-2">{attempt.title}</p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg">Review Answers:</h3>
                                {attempt.questions?.map((q: any, idx: number) => (
                                    <div key={idx} className={`p-4 rounded-lg ${q.is_correct ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                        <p className="font-medium mb-2">Q{idx + 1}: {q.text}</p>
                                        <p className="text-sm text-muted-foreground">Your answer: {q.user_answer || 'Not answered'}</p>
                                        {!q.is_correct && (
                                            <p className="text-sm text-green-600">Correct answer: {q.correct_answer}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={() => navigate("/dashboard")} variant="outline" className="flex-1">
                                    Back to Dashboard
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>        </div>
    );
};

export default QuizReview;
