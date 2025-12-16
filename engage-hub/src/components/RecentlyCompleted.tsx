import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

interface QuizAttempt {
    attempt_id: number;
    quiz_id: string;
    title: string;
    score: number;
    total_questions: number;
    percentage: number;
    completed_at: string;
}

interface RecentlyCompletedProps {
    limit?: number;
    className?: string;
}

export const RecentlyCompleted = ({ limit = 2, className = "" }: RecentlyCompletedProps) => {
    const [allAttempts, setAllAttempts] = useState<QuizAttempt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                // Try to use cache first
                const { default: cacheService } = await import('@/lib/cacheService');
                const cachedData: any = cacheService.get('quiz_history');

                if (cachedData) {
                    setAllAttempts(cachedData.data?.attempts || []);
                    setLoading(false);
                }

                // Fetch fresh data (will update if cache was stale)
                const response = await api.getQuizHistory();
                const data: any = response;
                const attempts = data.data?.attempts || [];
                setAllAttempts(attempts);

                // Update cache
                cacheService.set('quiz_history', response);
            } catch (error) {
                console.error('Failed to fetch quiz history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttempts();
    }, []);

    // Apply limit for display only
    const displayedAttempts = allAttempts.slice(0, limit);
    const hasMore = allAttempts.length > limit;

    return (
        <Card className={`border-border/50 card-shadow ${className}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    Recently Completed
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading history...</div>
                    ) : allAttempts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No quizzes completed yet. Start your first quiz!
                        </div>
                    ) : (
                        <>
                            {displayedAttempts.map((attempt) => (
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
                            ))}

                            {/* See more link */}
                            {hasMore && (
                                <div className="text-center pt-2">
                                    <Link
                                        to="/profile#activity"
                                        className="text-sm text-primary hover:underline font-medium"
                                    >
                                        See more ({allAttempts.length - limit} more)
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
