import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { QuizCard } from "@/components/QuizCard";

// Updated Interface to allow for variations in API response
interface Quiz {
    quiz_id: string;
    title: string;
    category?: string;    // Older API field
    topic?: string;       // Newer API field
    quiz_type?: string;
    level: string;
    num_questions: number;
    duration_seconds: number;
    created_at?: string;
}

export const ExploreQuizzes = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loadingQuizzes, setLoadingQuizzes] = useState(true);

    useEffect(() => {
        let isMounted = true; 

        const fetchQuizzes = async () => {
            try {
                // Check cache first for instant loading
                const { default: cacheService } = await import('@/lib/cacheService');
                const cacheKey = 'explore_quizzes';
                const cachedData: any = cacheService.get(cacheKey);

                if (isMounted && cachedData && cachedData.quizzes) {
                    setQuizzes(cachedData.quizzes);
                    setLoadingQuizzes(false);
                }

                // Fetch fresh data in background
                const response = await api.getQuizList();
                const data: any = response;

                if (isMounted && data.quizzes && Array.isArray(data.quizzes)) {
                    setQuizzes(data.quizzes);
                    cacheService.set(cacheKey, data);
                }
            } catch (error) {
                console.error('Failed to fetch quizzes:', error);
            } finally {
                if (isMounted) {
                    setLoadingQuizzes(false);
                }
            }
        };

        fetchQuizzes();

        return () => {
            isMounted = false;
        };
    }, []); 

    return (
        <Card className="border-border/50 card-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-primary" />
                    <Link to={"/categories"} className="hover:underline hover:text-primary transition-colors">
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
                        <QuizCard
                            key={quiz.quiz_id || index}
                            quiz_id={quiz.quiz_id}
                            title={quiz.title}
                            // Fallback Logic: Topic > Category > Default
                            topic={quiz.topic || quiz.category || 'General Knowledge'}
                            // Fallback Logic: Type > Default
                            quiz_type={quiz.quiz_type || 'time-based'}
                            level={quiz.level}
                            num_questions={quiz.num_questions}
                            duration_seconds={quiz.duration_seconds}
                            created_at={quiz.created_at}
                        />
                    ))
                )}
            </CardContent>
        </Card>
    );
};