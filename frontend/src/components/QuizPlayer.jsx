import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startQuiz, submitQuiz } from '../api/quizService';

const QuizPlayer = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizData, setQuizData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { questionId: selectedOption }
    const [attemptId, setAttemptId] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
        const initQuiz = async () => {
            try {
                setLoading(true);
                const response = await startQuiz(quizId);

                if (response.success) {
                    const { attempt_id, questions, duration_minutes, title } = response.data;
                    setAttemptId(attempt_id);
                    setQuestions(questions);
                    setQuizData({ title, duration: duration_minutes });
                    setTimeLeft(duration_minutes * 60);
                } else {
                    setError(response.message || 'Failed to start quiz');
                }
            } catch (err) {
                setError('An error occurred while starting the quiz');
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            initQuiz();
        }
    }, [quizId]);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitting) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleSubmit(); // Auto submit
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timeLeft, isSubmitting]);

    const handleOptionSelect = (option) => {
        const currentQuestion = questions[currentQuestionIndex];
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: option
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleJumpToQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        if (timerRef.current) clearInterval(timerRef.current);

        let score = 0;
        const formattedAnswers = questions.map(q => {
            const selected = userAnswers[q.id];
            const isCorrect = selected === q.correct_answer;
            if (isCorrect) score++;
            return {
                question_id: q.id,
                selected: selected || null,
                correct: isCorrect
            };
        });

        try {
            const response = await submitQuiz(attemptId, {
                score: score,
                user_answers: formattedAnswers
            });

            if (response.success) {
                navigate('/quiz/result', {
                    state: {
                        score,
                        total: questions.length,
                        answers: formattedAnswers,
                        questions: questions,
                        quizTitle: quizData.title
                    }
                });
            } else {
                alert('Failed to submit quiz: ' + response.message);
                setIsSubmitting(false);
            }
        } catch (err) {
            alert('Error submitting quiz');
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-bg-light">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-primary-dark">Loading Quiz...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen bg-bg-light">
            <div className="text-accent text-xl font-semibold">{error}</div>
        </div>
    );

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
        <div className="h-screen bg-bg-light text-text-primary flex flex-col overflow-hidden">
            <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="shrink-0 flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-md border border-gray-100">
                    <div>
                        <h1 className="text-xl font-bold text-primary">{quizData?.title}</h1>
                        <span className="text-sm text-text-secondary">Question {currentQuestionIndex + 1} of {questions.length}</span>
                    </div>
                    <div className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-accent' : 'text-primary-dark'}`}>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Question Navigation Bubbles */}
                <div className="shrink-0 flex flex-wrap gap-2 mb-4 justify-center max-h-24 overflow-y-auto">
                    {questions.map((q, idx) => {
                        const isAnswered = userAnswers[q.id] !== undefined;
                        const isCurrent = idx === currentQuestionIndex;

                        // Base color: Red (accent) if unanswered, Green (primary) if answered
                        let bgClass = isAnswered ? 'bg-primary text-white' : 'bg-accent text-white';

                        // Active state: Add ring/border to highlight current question
                        if (isCurrent) {
                            bgClass += ' ring-2 ring-offset-2 ring-primary-dark transform scale-110';
                        } else {
                            bgClass += ' opacity-80 hover:opacity-100';
                        }

                        return (
                            <button
                                key={q.id}
                                onClick={() => handleJumpToQuestion(idx)}
                                className={`w-8 h-8 text-sm rounded-full flex items-center justify-center font-bold transition-all ${bgClass}`}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>

                {/* Question Card - Scrollable Area */}
                <div className="flex-1 overflow-y-auto min-h-0 bg-white p-6 rounded-2xl shadow-lg mb-4 border border-gray-100">
                    <h2 className="text-xl md:text-2xl font-semibold mb-6 text-text-primary">{currentQuestion.question_text}</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(option)}
                                className={`p-4 rounded-xl text-left transition-all border-2 ${userAnswers[currentQuestion.id] === option
                                    ? 'border-primary bg-primary/10 text-primary-dark'
                                    : 'border-gray-200 hover:border-primary-light hover:bg-gray-50 text-text-secondary'
                                    }`}
                            >
                                <span className="inline-block w-8 font-bold text-gray-400">{String.fromCharCode(65 + idx)}.</span>
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="shrink-0 flex justify-between items-center mt-auto">
                    <button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${currentQuestionIndex === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-text-secondary hover:bg-gray-50'
                            }`}
                    >
                        Previous
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-3 rounded-lg font-bold bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-lg transform hover:scale-105 transition-all"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 rounded-lg font-semibold bg-primary hover:bg-primary-dark text-white transition-colors"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPlayer;
