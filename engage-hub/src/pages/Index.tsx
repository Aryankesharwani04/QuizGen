import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { FeatureCard } from "@/components/FeatureCard";
import { Brain, Zap, Target, TrendingUp, Clock, Award } from "lucide-react";
import academicIcon from "@/assets/academic-icon.png";
import entertainmentIcon from "@/assets/entertainment-icon.png";
import knowledgeIcon from "@/assets/knowledge-icon.png";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show landing page if user is authenticated (redirect is in progress)
  if (user) {
    return null;
  }

  // Show landing page to unauthenticated users
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Why Choose <span className="gradient-primary bg-clip-text text-transparent">QuizGen?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of learning with AI-powered features designed to enhance your quiz journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={Brain}
              title="AI-Generated Questions"
              description="Dynamic quiz questions powered by advanced AI, ensuring fresh and relevant content every time you play."
            />
            <FeatureCard
              icon={Zap}
              title="Instant Feedback"
              description="Get immediate results with detailed explanations for incorrect answers to accelerate your learning."
            />
            <FeatureCard
              icon={Target}
              title="Multiple Difficulty Levels"
              description="Choose from Easy, Medium, or Hard difficulty levels to match your current skill and challenge yourself."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Progress Tracking"
              description="Monitor your performance with comprehensive dashboards showing your quiz history and improvement trends."
            />
            <FeatureCard
              icon={Clock}
              title="Timed Challenges"
              description="Race against the clock with built-in timers that make your quiz experience more engaging and competitive."
            />
            <FeatureCard
              icon={Award}
              title="Achievement System"
              description="Earn badges and track your rankings as you complete quizzes and reach new milestones in your learning journey."
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Explore Quiz <span className="gradient-secondary bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dive into diverse topics and challenge yourself across multiple domains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <CategoryCard
              title="Academic"
              description="Physics, Chemistry, Biology, Mathematics and more"
              icon={academicIcon}
              gradient="gradient-primary"
              quizCount={300}
              link="/categories/academic"
            />
            <CategoryCard
              title="Entertainment"
              description="Movies, Music, Sports, Gaming and Pop Culture"
              icon={entertainmentIcon}
              gradient="gradient-secondary"
              quizCount={250}
              link="/categories/entertainment"
            />
            <CategoryCard
              title="General Knowledge"
              description="History, Geography, Current Affairs and Trivia"
              icon={knowledgeIcon}
              gradient="gradient-accent"
              quizCount={450}
              link="/categories/general"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of learners who are already improving their knowledge with QuizGen's AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register">
                <button className="px-8 py-4 rounded-2xl gradient-primary text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Create Free Account
                </button>
              </a>
              <a href="/categories">
                <button className="px-8 py-4 rounded-2xl border-2 border-primary text-primary font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300">
                  Browse All Categories
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
