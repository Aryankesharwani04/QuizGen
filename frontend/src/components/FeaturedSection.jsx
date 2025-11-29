import { useState, useEffect, useRef } from 'react';
import QuizCard from './QuizCard';
import PreferenceCategory from './PreferenceCategory';
import PreferencesModal from './PreferencesModal';
import { fetchFeaturedQuizzes, startQuiz } from '../api/quizService';
import { useAuth } from '../hooks/useAuth';

export default function FeaturedSection() {
    const { user } = useAuth();
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [mixSelected, setMixSelected] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPreferencesModal, setShowPreferencesModal] = useState(false);
    const quizListRef = useRef(null);

    // Mock preferences data - could be moved to a constant or API
    const preferences = [
        { id: 'art', name: 'Art', icon: '🎨' },
        { id: 'gaming', name: 'Gaming', icon: '🎮' },
        { id: 'facts', name: 'Facts', icon: '📚' },
        { id: 'science', name: 'Science', icon: '🔬' },
        { id: 'history', name: 'History', icon: '📜' },
        { id: 'geography', name: 'Geography', icon: '🌍' },
        { id: 'sports', name: 'Sports', icon: '⚽' },
        { id: 'movies', name: 'Movies', icon: '🎬' },
    ];

    useEffect(() => {
        loadQuizzes();
    }, [selectedPreferences, mixSelected]);

    const loadQuizzes = async () => {
        setLoading(true);
        try {
            // If mix is selected, we pass empty preferences to get all (or handle specifically in service)
            // If specific preferences selected, pass them
            // If neither, fetchFeaturedQuizzes handles default logic (maybe empty or all)

            let prefsToFetch = [];
            if (!mixSelected && selectedPreferences.length > 0) {
                prefsToFetch = selectedPreferences;
            }

            const response = await fetchFeaturedQuizzes(prefsToFetch);
            if (response.success) {
                setQuizzes(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch featured quizzes", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePreferenceToggle = (prefId) => {
        setSelectedPreferences(prev =>
            prev.includes(prefId)
                ? prev.filter(id => id !== prefId)
                : [...prev, prefId]
        );
        setMixSelected(false);
        setTimeout(() => {
            quizListRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleMixToggle = () => {
        setMixSelected(!mixSelected);
        if (!mixSelected) {
            setSelectedPreferences([]);
            setTimeout(() => {
                quizListRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <>
            <PreferencesModal
                isOpen={showPreferencesModal}
                onClose={() => setShowPreferencesModal(false)}
                initialPreferences={user?.preferences?.categories || []}
            />

            {/* Preferences Selection Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
                        Choose Your Interests
                    </h2>

                    {/* Mix Option */}
                    <div className="mb-8 flex justify-center">
                        <button
                            onClick={handleMixToggle}
                            className={`px-6 py-3 rounded-lg font-semibold transition ${mixSelected
                                ? 'bg-primary text-text-on-dark shadow-lg'
                                : 'bg-bg-light text-text-primary hover:bg-accent-light shadow-md hover:shadow-xl'
                                }`}
                        >
                            🎲 Pick Mix (All Categories)
                        </button>
                    </div>

                    {/* Preference Categories Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {preferences.map(pref => (
                            <PreferenceCategory
                                key={pref.id}
                                category={pref.name}
                                icon={pref.icon}
                                isSelected={selectedPreferences.includes(pref.id)}
                                onClick={() => handlePreferenceToggle(pref.id)}
                            />
                        ))}
                    </div>

                    {/* Selected Info */}
                    {selectedPreferences.length > 0 && (
                        <div className="bg-accent-light border-2 border-accent rounded-lg p-4 mb-8 text-center">
                            <p className="text-text-primary font-semibold">
                                Showing quizzes from: {selectedPreferences.map(id =>
                                    preferences.find(p => p.id === id)?.name
                                ).join(', ')}
                            </p>
                        </div>
                    )}

                    {mixSelected && (
                        <div className="bg-ocean-green bg-opacity-20 border-2 border-ocean-green rounded-lg p-4 mb-8 text-center">
                            <p className="text-text-primary font-semibold">
                                🎲 Showing quizzes from all categories
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Quizzes Section */}
            <section ref={quizListRef} className="py-16 bg-bg-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-text-primary mb-8">
                        Featured Quizzes
                    </h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <p>Loading quizzes...</p>
                        </div>
                    ) : quizzes.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-primary-dark text-lg">
                                Select a category to see quizzes
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            {quizzes.map(quiz => (
                                <QuizCard
                                    key={quiz.id}
                                    quiz={quiz}
                                    onPlay={async (quiz) => {
                                        try {
                                            const response = await startQuiz(quiz.id);
                                            if (response.success) {
                                                console.log('Starting quiz:', response.data);
                                                alert(`Starting quiz: ${quiz.title}`);
                                            } else {
                                                alert('Failed to start quiz');
                                            }
                                        } catch (error) {
                                            console.error('Error starting quiz:', error);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
