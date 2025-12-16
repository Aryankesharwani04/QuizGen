import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Clock, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

const QuizAttempt = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [quiz, setQuiz] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    // Fetch quiz questions
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                let response;
                let isFromCSV = false;

                // Try database endpoint first (for user-created quizzes)
                try {
                    response = await api.getQuizQuestions(quizId!);
                    console.log('Database response:', JSON.stringify(response, null, 2));
                } catch (dbError) {
                    // If database fetch fails, try CSV endpoint (for category quizzes)
                    console.log('Database fetch failed, trying CSV...', dbError);
                    response = await api.getQuizQuestionsFromCSV(quizId!);
                    isFromCSV = true;
                    console.log('CSV response:', JSON.stringify(response, null, 2));
                }

                // Handle response format based on source
                let quizData;

                if (isFromCSV && response.success && response.quiz_info) {
                    // CSV format
                    console.log('Processing CSV format');
                    quizData = {
                        quiz_id: response.quiz_info.quiz_id,
                        title: response.quiz_info.title,
                        category: response.quiz_info.category,
                        level: response.quiz_info.level,
                        duration_seconds: parseInt(response.quiz_info.duration_seconds) || 600,
                        questions: response.questions.map((q: any) => ({
                            text: q.question_text,
                            options: Object.values(q.options),
                            correct_answer: q.correct_answer
                        }))
                    };
                } else if (response.success && (response.data || response.quiz_id)) {
                    // Database format - data can be at root or under 'data' key
                    console.log('Processing database format');
                    const quizInfo = response.data || response;
                    quizData = {
                        quiz_id: quizInfo.quiz_id,
                        title: quizInfo.title,
                        category: quizInfo.category,
                        level: quizInfo.level || quizInfo.difficulty_level,
                        duration_seconds: quizInfo.duration_seconds,
                        questions: quizInfo.questions.map((q: any) => ({
                            text: q.text || q.question_text,
                            options: Array.isArray(q.options) ? q.options : Object.values(q.options),
                            correct_answer: q.correct_answer
                        }))
                    };
                } else {
                    console.error('Unknown response format:', response);
                    throw new Error('Invalid response format');
                }

                setQuiz(quizData);
                setQuestions(quizData.questions || []);
                setTimeRemaining(quizData.duration_seconds);
            } catch (error) {
                console.error('Failed to fetch quiz:', error);
                toast({
                    variant: 'destructive',
                    title: 'Failed to load quiz',
                    description: 'Could not load quiz questions. Please try again.'
                });
                navigate("/dashboard"); // Navigate away if quiz fails to load
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId, toast, navigate]);

    // Timer countdown
    useEffect(() => {
        if (timeRemaining <= 0 || quizCompleted) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    handleSubmitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, quizCompleted]);

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestionIndex]: answer
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        const score = questions.reduce((acc, q, idx) => {
            return selectedAnswers[idx] === q.correct_answer ? acc + 1 : acc;
        }, 0);

        const percentage = Math.round((score / questions.length) * 100);

        // Calculate time taken (initial time - remaining time)
        const initialTime = quiz?.duration_seconds || 600;
        const timeTaken = initialTime - timeRemaining;

        // Save attempt to backend
        try {
            await api.saveQuizAttempt(quizId!, selectedAnswers, timeTaken);
            console.log('Quiz attempt saved successfully');
        } catch (error: any) {
            console.error('Failed to save quiz attempt:', error);
            // Show error to user so we can debug
            toast({
                variant: "destructive",
                title: "Failed to save quiz attempt",
                description: error.message || "Your attempt couldn't be saved. Your score is still displayed below."
            });
            // Continue showing results even if save fails
        }

        toast({
            title: "Quiz Completed! 🎉",
            description: `You scored ${score}/${questions.length} (${percentage}%)`
        });

        setQuizCompleted(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (quizCompleted) {
        const score = questions.reduce((acc, q, idx) => {
            return selectedAnswers[idx] === q.correct_answer ? acc + 1 : acc;
        }, 0);
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="pt-24 pb-16">
                    <div className="container mx-auto px-4">
                        <Card className="max-w-2xl mx-auto border-border/50 card-shadow">
                            <CardHeader className="text-center">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-center">
                                    <p className="text-5xl font-bold text-primary mb-2">{percentage}%</p>
                                    <p className="text-muted-foreground">You scored {score} out of {questions.length}</p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">Review Answers:</h3>
                                    {questions.map((q, idx) => (
                                        <div key={idx} className={`p-4 rounded-lg ${selectedAnswers[idx] === q.correct_answer ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                            <p className="font-medium mb-2">Q{idx + 1}: {q.text}</p>
                                            <p className="text-sm text-muted-foreground">Your answer: {selectedAnswers[idx] || 'Not answered'}</p>
                                            {selectedAnswers[idx] !== q.correct_answer && (
                                                <p className="text-sm text-green-600">Correct answer: {q.correct_answer}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <Button onClick={() => navigate("/dashboard")} variant="outline" className="flex-1">
                                        Back to Dashboard
                                    </Button>
                                    <Button onClick={() => window.location.reload()} className="flex-1 gradient-primary text-white">
                                        Retake Quiz
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Quiz Header */}
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold">{quiz?.title}</h1>
                                <p className="text-muted-foreground">{quiz?.category} • Level: {quiz?.level}</p>
                            </div>
                            <div className="flex items-center gap-2 text-primary">
                                <Clock className="w-5 h-5" />
                                <span className="text-2xl font-bold">{Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</span>
                            </div>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    </div>

                    {/* Question Card */}
                    <Card className="max-w-4xl mx-auto border-border/50 card-shadow">
                        <CardHeader>
                            <CardTitle className="text-xl">Question {currentQuestionIndex + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-lg">{currentQuestion?.text}</p>

                            <div className="space-y-3">
                                {currentQuestion?.options.map((option: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswerSelect(option)}
                                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${selectedAnswers[currentQuestionIndex] === option
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <span className="font-semibold mr-3">{String.fromCharCode(65 + idx)}.</span>
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <Button
                                    onClick={handlePrevious}
                                    disabled={currentQuestionIndex === 0}
                                    variant="outline"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Previous
                                </Button>

                                <div className="flex gap-2">
                                    {questions.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 rounded-full ${selectedAnswers[idx] ? 'bg-primary' : 'bg-muted'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {currentQuestionIndex === questions.length - 1 ? (
                                    <Button
                                        onClick={handleSubmitQuiz}
                                        className="gradient-primary text-white"
                                    >
                                        Submit Quiz
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        className="gradient-primary text-white"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main >

            <Footer />
        </div >
    );
};

export default QuizAttempt;
