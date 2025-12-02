import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, total, answers, questions, quizTitle } = location.state || {};

    if (!location.state) {
        return <div className="text-text-primary text-center mt-10">No result data found.</div>;
    }

    const percentage = Math.round((score / total) * 100);
    let message = '';
    let colorClass = '';

    if (percentage >= 80) {
        message = 'Outstanding!';
        colorClass = 'text-primary';
    } else if (percentage >= 60) {
        message = 'Good Job!';
        colorClass = 'text-primary-light';
    } else {
        message = 'Keep Practicing!';
        colorClass = 'text-accent';
    }

    return (
        <div className="min-h-screen bg-bg-light text-text-primary p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center border border-gray-100">
                    <h1 className="text-3xl font-bold mb-2 text-primary-dark">{quizTitle}</h1>
                    <h2 className={`text-4xl font-extrabold mb-4 ${colorClass}`}>{message}</h2>

                    <div className="flex justify-center items-center gap-4 mb-6">
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <p className="text-text-secondary text-sm">Score</p>
                            <p className="text-3xl font-bold text-text-primary">{score} / {total}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <p className="text-text-secondary text-sm">Percentage</p>
                            <p className="text-3xl font-bold text-text-primary">{percentage}%</p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-text-primary rounded-lg font-semibold transition-colors"
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={() => navigate('/quiz/history')}
                            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors"
                        >
                            View History
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-4 text-text-primary">Review Answers</h3>
                    {questions.map((q, idx) => {
                        const userAnswer = answers.find(a => a.question_id === q.id);
                        const isCorrect = userAnswer?.correct;
                        const selected = userAnswer?.selected;

                        return (
                            <div key={q.id} className={`bg-white p-6 rounded-xl border-l-4 shadow-sm ${isCorrect ? 'border-primary' : 'border-accent'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-lg font-semibold text-text-primary">
                                        <span className="text-text-secondary mr-2">{idx + 1}.</span>
                                        {q.question_text}
                                    </h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCorrect ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                                        {isCorrect ? 'Correct' : 'Incorrect'}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {q.options.map((opt, optIdx) => {
                                        let optClass = 'bg-gray-50 text-text-secondary border border-gray-200';
                                        if (opt === q.correct_answer) {
                                            optClass = 'bg-primary/10 text-primary-dark border border-primary';
                                        } else if (opt === selected && !isCorrect) {
                                            optClass = 'bg-accent/10 text-accent-dark border border-accent';
                                        }

                                        return (
                                            <div key={optIdx} className={`p-3 rounded-lg ${optClass}`}>
                                                {opt}
                                                {opt === q.correct_answer && <span className="float-right text-xs font-semibold">Correct Answer</span>}
                                                {opt === selected && !isCorrect && <span className="float-right text-xs font-semibold">Your Answer</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuizResult;
