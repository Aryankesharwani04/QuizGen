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

import { useAuth } from "@/contexts/AuthContext";

export const ExploreQuizzes = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loadingQuizzes, setLoadingQuizzes] = useState(true);
    const { user } = useAuth(); // Get user for preferences

    useEffect(() => {
        let isMounted = true;

        const sortQuizzes = (allQuizzes: Quiz[], preferences?: string[]) => {
            if (!allQuizzes || allQuizzes.length === 0) return [];

            // Helper to shuffle array (Fisher-Yates)
            const shuffle = (array: any[]) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            };

            // If no preferences, just return random shuffle
            if (!preferences || preferences.length === 0) {
                return shuffle([...allQuizzes]);
            }

            // Group quizzes into Preferred and Others
            const preferred: Quiz[] = [];
            const others: Quiz[] = [];

            allQuizzes.forEach(quiz => {
                const topic = (quiz.topic || quiz.category || '').toLowerCase();
                const matches = preferences.some(p => topic.includes(p.toLowerCase()));
                if (matches) {
                    preferred.push(quiz);
                } else {
                    others.push(quiz);
                }
            });

            // Shuffle buckets to avoid stale order
            shuffle(preferred);
            shuffle(others);

            // Construct Top 3 to cover different preferences if possible
            const top3: Quiz[] = [];
            const usedPrefs = new Set<string>();

            // 1. Try to find one quiz for each distinct preference up to 3
            // We iterate through shuffled preferred list
            for (let i = 0; i < preferred.length; i++) {
                if (top3.length >= 3) break;

                const quiz = preferred[i];
                const topic = (quiz.topic || quiz.category || '').toLowerCase();

                // Which preference did this quiz match?
                const matchedPref = preferences.find(p => topic.includes(p.toLowerCase()));

                if (matchedPref && !usedPrefs.has(matchedPref)) {
                    top3.push(quiz);
                    usedPrefs.add(matchedPref);
                    // Remove from 'preferred' list effectively (we'll filter later or just track indices)
                    preferred[i] = null as any; // Mark for removal
                }
            }

            // Cleanup nulls from preferred
            const remainingPreferred = preferred.filter(q => q !== null);

            // 2. If top3 not full, fill with other preferred quizzes
            while (top3.length < 3 && remainingPreferred.length > 0) {
                top3.push(remainingPreferred.shift()!);
            }

            // 3. If still not full, fill with 'others'
            while (top3.length < 3 && others.length > 0) {
                top3.push(others.shift()!);
            }

            // Combine: Top 3 + Remaining Preferred + Others
            return [...top3, ...remainingPreferred, ...others];
        };

        const fetchQuizzes = async () => {
            try {
                // Check cache first for instant loading
                const { default: cacheService } = await import('@/lib/cacheService');
                const cacheKey = 'explore_quizzes';
                const cachedData: any = cacheService.get(cacheKey);

                if (isMounted && cachedData && cachedData.quizzes) {
                    const sorted = sortQuizzes(cachedData.quizzes, user?.preferences?.interests);
                    setQuizzes(sorted);
                    setLoadingQuizzes(false);
                }

                // Fetch fresh data in background
                const response = await api.getQuizList();
                const data: any = response;

                if (isMounted && data.quizzes && Array.isArray(data.quizzes)) {
                    const sorted = sortQuizzes(data.quizzes, user?.preferences?.interests);
                    setQuizzes(sorted);
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
    }, [user?.preferences?.interests]); // Re-run if preferences change

    return (
        <Card className="border-border/50 card-shadow bg-background/60">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-primary" />
                        <Link to={"/categories"} className="hover:underline hover:text-primary transition-colors">
                            Explore Quizzes
                        </Link>
                    </div>
                    <Link to="/categories#explore" className="text-xs text-muted-foreground hover:text-primary transition-colors font-normal">
                        View All
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