import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Zap, Target, Users, Sparkles, TrendingUp } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "Advanced algorithms create unique, contextual questions tailored to your learning needs."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get immediate feedback with detailed explanations to accelerate your learning journey."
    },
    {
      icon: Target,
      title: "Adaptive Learning",
      description: "Questions adapt to your skill level, ensuring optimal challenge and growth."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of learners sharing knowledge and competing in real-time."
    },
    {
      icon: Sparkles,
      title: "Diverse Categories",
      description: "From academics to entertainment, explore quizzes across countless topics."
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Detailed analytics help you understand strengths and areas for improvement."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Medical Student",
      content: "QuizGen transformed how I study. The AI-generated questions are incredibly relevant and challenging. I've seen my exam scores improve by 25%!",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "High School Teacher",
      content: "I use QuizGen to create engaging quizzes for my students. The platform saves me hours of prep time while keeping students excited about learning.",
      avatar: "MR"
    },
    {
      name: "Emily Park",
      role: "Corporate Trainer",
      content: "The adaptive learning feature is a game-changer. Our team's retention rates have doubled since we started using QuizGen for training.",
      avatar: "EP"
    },
    {
      name: "James Wilson",
      role: "Quiz Enthusiast",
      content: "As someone who loves trivia, QuizGen keeps me on my toes with fresh, challenging questions. The entertainment categories are pure gold!",
      avatar: "JW"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            About QuizGen
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Revolutionizing learning through AI-powered quiz generation. Our mission is to make knowledge 
            acquisition engaging, personalized, and accessible to everyone, everywhere.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="px-6 py-3 glass rounded-full">
              <span className="font-bold text-primary">100K+</span> Active Users
            </div>
            <div className="px-6 py-3 glass rounded-full">
              <span className="font-bold text-secondary">1M+</span> Quizzes Generated
            </div>
            <div className="px-6 py-3 glass rounded-full">
              <span className="font-bold text-accent">50+</span> Categories
            </div>
          </div>
        </div>
      </section>

      {/* AI Technology Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
              Powered by Advanced AI
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our cutting-edge machine learning models analyze millions of data points to generate 
              questions that are contextually relevant, appropriately challenging, and pedagogically sound.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 animate-fade-in-scale">
            <Card className="border-primary/20 card-shadow hover:card-shadow-hover transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto mb-6 flex items-center justify-center animate-float">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Natural Language Processing</h3>
                <p className="text-muted-foreground">
                  Understands context and nuance to create human-like questions
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 card-shadow hover:card-shadow-hover transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl gradient-secondary mx-auto mb-6 flex items-center justify-center animate-float" style={{ animationDelay: '0.2s' }}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Adaptive Algorithms</h3>
                <p className="text-muted-foreground">
                  Learns from your performance to optimize difficulty levels
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 card-shadow hover:card-shadow-hover transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl gradient-accent mx-auto mb-6 flex items-center justify-center animate-float" style={{ animationDelay: '0.4s' }}>
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Quality Validation</h3>
                <p className="text-muted-foreground">
                  Multi-layer verification ensures accuracy and relevance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 gradient-secondary bg-clip-text text-transparent">
              Why Choose QuizGen?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of learning with features designed to maximize engagement and retention.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="animate-fade-in-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 gradient-accent bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied learners who've transformed their knowledge journey with QuizGen.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-border/50 card-shadow hover:card-shadow-hover transition-all duration-300 hover:scale-105 animate-fade-in-scale"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our community and experience the power of AI-driven education.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/register"
              className="px-8 py-4 gradient-primary text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300 glow-primary"
            >
              Get Started Free
            </a>
            <a
              href="/categories"
              className="px-8 py-4 glass text-foreground font-semibold rounded-lg hover:scale-105 transition-transform duration-300"
            >
              Explore Categories
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
