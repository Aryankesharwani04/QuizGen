import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function QuizCard({ quiz, onPlay }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePlayClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (onPlay) {
      onPlay(quiz);
    }
  };

  return (
    <div className="bg-bg-light rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105 flex flex-col h-full">
      {/* Quiz Image */}
      <div className="w-full h-40 bg-accent overflow-hidden flex-shrink-0">
        {quiz.image ? (
          <img
            src={quiz.image}
            alt={quiz.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-accent-dark">
            <span className="text-4xl">📚</span>
          </div>
        )}
      </div>

      {/* Quiz Info - Flex grow to push button down */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
          {quiz.title}
        </h3>
        
        <p className="text-sm text-primary-dark mb-3 line-clamp-2 flex-grow">
          {quiz.description || 'Test your knowledge on this topic'}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-accent-light text-text-primary px-2 py-1 rounded-full">
              {quiz.category || 'General'}
            </span>
            {quiz.difficulty && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                quiz.difficulty === 'easy' ? 'bg-accent text-text-primary' :
                quiz.difficulty === 'medium' ? 'bg-ocean-green text-bg-dark' :
                'bg-accent-dark text-text-on-dark'
              }`}>
                {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
              </span>
            )}
          </div>
        </div>

        {/* Quiz Stats */}
        <div className="text-xs text-primary-dark mb-4 space-y-1 flex-grow">
          {quiz.questions_count && (
            <p>📝 {quiz.questions_count} questions</p>
          )}
          {quiz.estimated_time && (
            <p>⏱️ ~{quiz.estimated_time} min</p>
          )}
        </div>

        {/* Play Button - Always at bottom */}
        <button
          onClick={handlePlayClick}
          className="w-full px-4 py-2 bg-primary text-text-on-dark rounded-lg hover:bg-primary-dark transition font-medium mt-auto"
        >
          {isAuthenticated ? 'Start Quiz' : 'Login to Start'}
        </button>
      </div>
    </div>
  );
}
