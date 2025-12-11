import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/90" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-glow rounded-full blur-xl opacity-60 animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary-glow rounded-full blur-2xl opacity-50 animate-float animation-delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-accent rounded-full blur-xl opacity-40 animate-float animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-2 border-white/20 text-white/90 text-sm font-semibold animate-slide-up">
            <Sparkles className="w-4 h-4" />
            AI-Powered Quiz Platform
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight animate-slide-up animation-delay-200">
            Learn, Challenge,
            <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              Excel with QuizGen
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto animate-slide-up animation-delay-400">
            Experience dynamic, AI-generated quizzes across Academic, Entertainment, and General Knowledge categories. 
            Track your progress and become a quiz champion!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-600">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                <Zap className="w-5 h-5 mr-2" />
                Start Learning Free
              </Button>
            </Link>
            <Link to="/categories">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 rounded-2xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                <Trophy className="w-5 h-5 mr-2" />
                Browse Quizzes
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto pt-8 animate-slide-up animation-delay-800">
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-white">1000+</div>
              <div className="text-white/80 text-sm md:text-base mt-1">AI Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-white">50+</div>
              <div className="text-white/80 text-sm md:text-base mt-1">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-white">24/7</div>
              <div className="text-white/80 text-sm md:text-base mt-1">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
};
