import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="bg-background/60 relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
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
        <div className="absolute top-20 left-10 w-24 h-24 bg-white/20 rounded-full blur-2xl animate-float" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-yellow-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-1/4 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-cyan-300/20 rounded-full blur-xl animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold animate-fade-in">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            Powered by Google Gemini AI
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.1] animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Master Any Topic,
            <span className="block mt-2 bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 bg-clip-text text-transparent">
              In Any Language
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            AI-generated quizzes in <span className="font-semibold text-yellow-200">15+ languages</span>.
            Play solo, compete in <span className="font-semibold text-cyan-200">live multiplayer</span>,
            or tackle <span className="font-semibold text-pink-200">daily challenges</span>.
            Your learning journey starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/95 font-bold text-lg px-10 py-7 rounded-2xl shadow-2xl shadow-black/20 transform hover:scale-105 transition-all duration-300 gap-2">
                <Zap className="w-5 h-5" />
                Start Learning Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/categories#explore">
              <Button size="lg" variant="outline" className="border-2 border-white/40 text-white hover:bg-white/10 font-bold text-lg px-10 py-7 rounded-2xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300 gap-2">
                <Trophy className="w-5 h-5" />
                Explore Quizzes
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="pb-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto pt-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="text-3xl md:text-4xl font-bold text-white">5000+</div>
              <div className="text-white/80 text-sm mt-1">Pre-Built Quizzes</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="text-3xl md:text-4xl font-bold text-white">15+</div>
              <div className="text-white/80 text-sm mt-1">Languages</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="text-3xl md:text-4xl font-bold text-white">Live</div>
              <div className="text-white/80 text-sm mt-1">Multiplayer</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="text-3xl md:text-4xl font-bold text-white">∞</div>
              <div className="text-white/80 text-sm mt-1">AI Quizzes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  );
};
