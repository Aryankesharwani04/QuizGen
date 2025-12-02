import { useState } from 'react';

export default function GenerateQuiz({ onGenerate }) {
    const [showTitleModal, setShowTitleModal] = useState(false);
    const [selectedTitles, setSelectedTitles] = useState([]);
    const [customTitle, setCustomTitle] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [questionCount, setQuestionCount] = useState(10);
    const [time, setTime] = useState(15);
    const [loading, setLoading] = useState(false);

    const predefinedTitles = [
        'General Knowledge',
        'Science',
        'History',
        'Geography',
        'Technology',
        'Sports',
        'Movies',
        'Music',
    ];

    const handleTitleToggle = (title) => {
        if (selectedTitles.includes(title)) {
            setSelectedTitles(selectedTitles.filter((t) => t !== title));
        } else {
            setSelectedTitles([...selectedTitles, title]);
        }
    };

    const handleAddCustomTitle = () => {
        if (customTitle.trim() && !selectedTitles.includes(customTitle.trim())) {
            setSelectedTitles([...selectedTitles, customTitle.trim()]);
            setCustomTitle('');
        }
    };

    const handleGenerateClick = async () => {
        if (selectedTitles.length === 0) {
            alert('Please select at least one topic.');
            return;
        }

        setLoading(true);
        const topic = selectedTitles.join(', ');

        try {
            // Import dynamically to avoid circular dependency issues if any, or just standard import
            const { createQuizConfig } = await import('../api/quizService');

            const configData = {
                topic: topic,
                difficulty: difficulty,
                num_questions: questionCount
            };

            const response = await createQuizConfig(configData);

            if (response.success) {
                const quiz = {
                    id: response.data.quiz_id,
                    quiz_id: response.data.quiz_id, // Explicitly add quiz_id for QuizCard
                    title: `${topic} Quiz`,
                    description: `A ${difficulty} quiz with ${questionCount} questions.`,
                    questions_count: questionCount,
                    estimated_time: questionCount * 1, // Assuming 1 min per question
                    difficulty: difficulty,
                    is_new: response.data.is_new
                };
                onGenerate(quiz);
            } else {
                alert('Failed to generate quiz configuration: ' + response.message);
            }
        } catch (error) {
            console.error('Error generating quiz:', error);
            alert('An error occurred while generating the quiz.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-bg-light p-6 rounded-xl shadow-2xl w-full max-w-md text-text-primary">
            <h2 className="text-2xl font-bold mb-4 text-center">Generate a Quiz</h2>

            <div className="flex flex-col gap-4">
                {/* Title Selection */}
                <div>
                    <label className="block text-sm font-bold mb-2 text-primary-dark">Topic / Title</label>
                    <button
                        onClick={() => setShowTitleModal(true)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-left text-gray-700 hover:border-accent focus:outline-none focus:ring-1 focus:ring-accent bg-white"
                    >
                        {selectedTitles.length > 0
                            ? selectedTitles.join(', ')
                            : 'Choose a Title...'}
                    </button>
                </div>

                {/* Difficulty */}
                <div>
                    <label className="block text-sm font-bold mb-2 text-primary-dark">Difficulty</label>
                    <div className="flex gap-2">
                        {['Easy', 'Medium', 'Hard'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className={`flex-1 py-2 rounded-lg border-2 font-medium transition ${difficulty === level
                                    ? 'bg-accent text-text-primary border-accent'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-accent'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Questions & Time */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-bold mb-2 text-primary-dark">Questions</label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-bold mb-2 text-primary-dark">Time (min)</label>
                        <input
                            type="number"
                            min="1"
                            max="120"
                            value={time}
                            onChange={(e) => setTime(parseInt(e.target.value) || 1)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                        />
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerateClick}
                    disabled={loading}
                    className={`w-full px-6 py-3 rounded-lg transition font-bold text-lg shadow-md mt-2 flex justify-center items-center gap-2 ${loading
                        ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                        : 'bg-primary text-text-on-dark hover:bg-primary-dark'}`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        'Generate Quiz'
                    )}
                </button>
            </div>

            {/* Title Selection Modal */}
            {showTitleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Select Topics</h3>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {predefinedTitles.map((title) => (
                                <button
                                    key={title}
                                    onClick={() => handleTitleToggle(title)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${selectedTitles.includes(title)
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    {title}
                                </button>
                            ))}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Topic</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customTitle}
                                    onChange={(e) => setCustomTitle(e.target.value)}
                                    placeholder="e.g. Quantum Physics"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTitle()}
                                />
                                <button
                                    onClick={handleAddCustomTitle}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowTitleModal(false)}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-bold"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
