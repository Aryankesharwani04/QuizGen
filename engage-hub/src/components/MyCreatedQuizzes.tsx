import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle, Plus, BookOpen } from "lucide-react";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";

interface Quiz {
    quiz_id: string;
    title: string;
    category: string;
    level: string;
    num_questions: number;
    duration_seconds: number;
    created_at: string;
}

interface MyCreatedQuizzesProps {
    onCreateClick: () => void;
    refreshTrigger?: number;
    className?: string;
    limit?: number;
    showSeeMore?: boolean;
}

export const MyCreatedQuizzes = ({ onCreateClick, refreshTrigger, className = "", limit = 3, showSeeMore = false }: MyCreatedQuizzesProps) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyQuizzes = async () => {
            try {
                // Check cache first
                const { default: cacheService } = await import('@/lib/cacheService');
                const cacheKey = 'my_created_quizzes';
                const cachedData: any = cacheService.get(cacheKey);

                // If cached data exists, show it immediately
                if (cachedData && cachedData.data?.quizzes) {
                    const sortedCached = cachedData.data.quizzes.sort((a: Quiz, b: Quiz) => {
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    });
                    setQuizzes(sortedCached);
                    setLoading(false);
                }

                // Fetch fresh data from API
                const response = await api.getMyCreatedQuizzes();
                const data: any = response;

                // Sort by created_at descending (most recent first)
                const sortedQuizzes = (data.data?.quizzes || []).sort((a: Quiz, b: Quiz) => {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });

                // Update state with fresh data
                setQuizzes(sortedQuizzes);

                // Update cache
                cacheService.set(cacheKey, response);
            } catch (error) {
                console.error('Failed to fetch created quizzes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyQuizzes();
    }, [refreshTrigger]);

    // Format duration
    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} min`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    // Get level badge color
    const getLevelColor = (level: string) => {
        const colors: Record<string, string> = {
            easy: "bg-success/10 text-success border-success/30",
            medium: "bg-warning/10 text-warning border-warning/30",
            hard: "bg-destructive/10 text-destructive border-destructive/30"
        };
        return colors[level.toLowerCase()] || colors.medium;
    };

    return (
        <Card className={`border-border/50 card-shadow ${className}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    My Created Quizzes ({quizzes.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading your quizzes...</div>
                ) : quizzes.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">You haven't created any quizzes yet</p>
                        <Button
                            onClick={onCreateClick}
                            className="gradient-primary text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Quiz
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {quizzes.slice(0, limit).map((quiz) => (
                            <div
                                key={quiz.quiz_id}
                                className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-foreground">{quiz.title}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getLevelColor(quiz.level)}`}>
                                                {quiz.level}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {quiz.category} • {quiz.num_questions} questions
                                        </p>
                                    </div>
                                    <Link to={`/quiz/${quiz.quiz_id}`}>
                                        <Button size="sm" className="gradient-primary text-white">
                                            <PlayCircle className="w-4 h-4 mr-1" />
                                            Start
                                        </Button>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {formatDuration(quiz.duration_seconds)}
                                    </div>
                                    <span>•</span>
                                    <span>Created {formatDate(quiz.created_at)}</span>
                                </div>
                            </div>
                        ))}

                        {showSeeMore && quizzes.length > limit && (
                            <div className="text-center pt-2">
                                <Link to="/profile#MyQuizzes" className="text-primary hover:underline text-sm font-medium">
                                    See more →
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
