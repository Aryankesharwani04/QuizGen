import { useState } from 'react';
import QuizCard from '../components/QuizCard';
import PreferenceCategory from '../components/PreferenceCategory';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [mixSelected, setMixSelected] = useState(false);

  // Mock preferences data
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

  // Mock quiz data
  const mockQuizzes = [
    {
      id: 1,
      title: 'Famous Artists of the Renaissance',
      description: 'Test your knowledge about Renaissance art and artists',
      category: 'Art',
      preference: 'art',
      difficulty: 'medium',
      questions_count: 10,
      estimated_time: 5,
      image: null,
    },
    {
      id: 2,
      title: 'Video Game Trivia',
      description: 'Can you name these popular video games?',
      category: 'Gaming',
      preference: 'gaming',
      difficulty: 'easy',
      questions_count: 8,
      estimated_time: 4,
      image: null,
    },
    {
      id: 3,
      title: 'Random Facts Challenge',
      description: 'Think you know random facts? Prove it!',
      category: 'Facts',
      preference: 'facts',
      difficulty: 'hard',
      questions_count: 15,
      estimated_time: 10,
      image: null,
    },
    {
      id: 4,
      title: 'Biology Basics',
      description: 'Test your knowledge of fundamental biology',
      category: 'Science',
      preference: 'science',
      difficulty: 'medium',
      questions_count: 12,
      estimated_time: 8,
      image: null,
    },
    {
      id: 5,
      title: 'World History Quiz',
      description: 'Major events and dates in world history',
      category: 'History',
      preference: 'history',
      difficulty: 'hard',
      questions_count: 20,
      estimated_time: 12,
      image: null,
    },
  ];

  const handlePreferenceToggle = (prefId) => {
    setSelectedPreferences(prev =>
      prev.includes(prefId)
        ? prev.filter(id => id !== prefId)
        : [...prev, prefId]
    );
    setMixSelected(false);
  };

  const handleMixToggle = () => {
    setMixSelected(!mixSelected);
    if (!mixSelected) {
      setSelectedPreferences([]);
    }
  };

  // Filter quizzes based on selected preferences and search
  const filteredQuizzes = mockQuizzes.filter(quiz => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (mixSelected) {
      return matchesSearch;
    }

    if (selectedPreferences.length === 0) {
      return matchesSearch;
    }

    return matchesSearch && selectedPreferences.includes(quiz.preference);
  });

  return (
    <div className="min-h-screen bg-granny-apple">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-text-on-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to QuizGen</h1>
          <p className="text-lg mb-8 text-granny-apple">
            Challenge yourself with engaging quizzes on your favorite topics
          </p>

          {/* Search Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search quizzes by title or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="px-6 py-3 bg-accent text-text-primary rounded-lg hover:bg-accent-dark transition font-medium">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* About QuizGen Section */}
      <section className="bg-bg-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left - Info */}
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-4">
                About QuizGen
              </h2>
              <p className="text-primary-dark mb-4 text-lg">
                QuizGen is your ultimate platform for creating, sharing, and taking interactive quizzes on any topic you're passionate about.
              </p>
              <ul className="space-y-3 text-primary-dark">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <span>Create custom quizzes in minutes</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <span>Track your progress and scores</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <span>Learn from various categories</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">🌟</span>
                  <span>Share with friends and compete</span>
                </li>
              </ul>
            </div>

            {/* Right - Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary text-text-on-dark p-6 rounded-lg text-center">
                <div className="text-4xl mb-2">🎓</div>
                <h3 className="font-bold mb-2">Learn</h3>
                <p className="text-sm">Expand your knowledge</p>
              </div>
              <div className="bg-accent text-text-primary p-6 rounded-lg text-center">
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="font-bold mb-2">Compete</h3>
                <p className="text-sm">Challenge yourself</p>
              </div>
              <div className="bg-ocean-green text-bg-dark p-6 rounded-lg text-center">
                <div className="text-4xl mb-2">👥</div>
                <h3 className="font-bold mb-2">Share</h3>
                <p className="text-sm">Share with friends</p>
              </div>
              <div className="bg-accent-light text-text-primary p-6 rounded-lg text-center">
                <div className="text-4xl mb-2">📈</div>
                <h3 className="font-bold mb-2">Track</h3>
                <p className="text-sm">Monitor progress</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
            Choose Your Interests
          </h2>

          {/* Mix Option */}
          <div className="mb-8 flex justify-center">
            <button
              onClick={handleMixToggle}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                mixSelected
                  ? 'bg-primary text-text-on-dark'
                  : 'bg-bg-light text-text-primary border-2 border-primary hover:bg-accent-light'
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

      {/* Quizzes Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-text-primary mb-8">
            {filteredQuizzes.length === 0 ? 'No Quizzes Found' : 'Featured Quizzes'}
          </h2>

          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-primary-dark text-lg">
                {searchTerm
                  ? `No quizzes match "${searchTerm}"`
                  : 'Select a category to see quizzes'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {filteredQuizzes.map(quiz => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onPlay={(quiz) => console.log('Playing quiz:', quiz)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
