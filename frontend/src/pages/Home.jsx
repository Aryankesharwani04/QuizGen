import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutSection from '../components/AboutSection';
import FeaturedSection from '../components/FeaturedSection';
import JoinQuiz from '../components/JoinQuiz';
import GenerateQuiz from '../components/GenerateQuiz';
import QuizCard from '../components/QuizCard';
import { startQuiz } from '../api/quizService';

export default function Home() {
  const navigate = useNavigate();
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const generatedQuizRef = useRef(null);

  const handleQuizGenerated = (quiz) => {
    setGeneratedQuiz(quiz);
  };

  useEffect(() => {
    if (generatedQuiz && generatedQuizRef.current) {
      generatedQuizRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [generatedQuiz]);

  return (
    <div className="min-h-screen bg-granny-apple">
      {/* Hero Section with Split Layout */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-text-on-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* Left Column: Join Quiz */}
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center md:text-left">Welcome to QuizGen</h1>
              <p className="text-lg mb-8 text-granny-apple text-center md:text-left">
                Challenge yourself with engaging quizzes or generate your own!
              </p>
              <div className="w-full max-w-md">
                <JoinQuiz />
              </div>
            </div>

            {/* Right Column: Generate Quiz */}
            <div className="flex justify-center md:justify-end w-full">
              <GenerateQuiz onGenerate={handleQuizGenerated} />
            </div>

          </div>
        </div>
      </section>

      {/* Generated Quiz Result Section */}
      {generatedQuiz && (
        <section ref={generatedQuizRef} className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary-dark">Your Generated Quiz</h2>
            <div className="flex justify-center">
              <QuizCard
                quiz={generatedQuiz}
                onPlay={(quiz) => {
                  navigate(`/quiz/start/${quiz.id}`);
                }}
              />
            </div>
          </div>
        </section>
      )}

      <AboutSection />

      <FeaturedSection />
    </div>
  );
}
