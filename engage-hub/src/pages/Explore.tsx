
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { QuizCard } from "@/components/QuizCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Compass } from "lucide-react";

interface Quiz {
    quiz_id: string;
    title: string;
    category?: string;
    topic?: string;
    quiz_type?: string;
    level: string;
    num_questions: number;
    duration_seconds: number;
    created_at?: string;
}

const Explore = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                // Check cache first
                const { default: cacheService } = await import('@/lib/cacheService');
                const cacheKey = 'explore_quizzes';
                const cachedData: any = cacheService.get(cacheKey);

                if (cachedData && cachedData.quizzes) {
                    setQuizzes(cachedData.quizzes);
                    setFilteredQuizzes(cachedData.quizzes);
                    setLoading(false);
                }

                // Fetch fresh data
                const response = await api.getQuizList();
                const data: any = response;

                if (data.quizzes && Array.isArray(data.quizzes)) {
                    setQuizzes(data.quizzes);
                    setFilteredQuizzes(data.quizzes);
                    cacheService.set(cacheKey, data);
                }
            } catch (error) {
                console.error('Failed to fetch quizzes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredQuizzes(quizzes);
            return;
        }

        const lowerTerm = searchTerm.toLowerCase();
        const filtered = quizzes.filter(quiz =>
            quiz.title.toLowerCase().includes(lowerTerm) ||
            (quiz.topic || quiz.category || '').toLowerCase().includes(lowerTerm)
        );
        setFilteredQuizzes(filtered);
    }, [searchTerm, quizzes]);

    return (
        <div className="container max-w-6xl pt-24 py-8 px-4 md:px-6 space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
                        <Compass className="w-8 h-8 text-primary" />
                        Explore Quizzes
                    </h1>
                    <p className="text-muted-foreground">
                        Discover new challenges and test your knowledge.
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search quizzes..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredQuizzes.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg bg-muted/10">
                    <Compass className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium text-muted-foreground">No quizzes found.</p>
                    {searchTerm && (
                        <p className="text-sm text-muted-foreground mt-1">
                            Try adjusting your search terms.
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuizzes.map((quiz, index) => (
                        <QuizCard
                            key={quiz.quiz_id || index}
                            quiz_id={quiz.quiz_id}
                            title={quiz.title}
                            topic={quiz.topic || quiz.category || 'General Knowledge'}
                            level={quiz.level}
                            num_questions={quiz.num_questions}
                            duration_seconds={quiz.duration_seconds}
                            created_at={quiz.created_at}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Explore;
