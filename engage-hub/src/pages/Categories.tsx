import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Beaker, Atom, BookOpen, Film, Music, Gamepad2, Trophy, Globe, Landmark, Newspaper, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const Categories = () => {
  const academicCategories = [
    { name: "Physics", icon: Atom, count: 120, difficulty: "Medium" },
    { name: "Chemistry", icon: Beaker, count: 95, difficulty: "Hard" },
    { name: "Biology", icon: Brain, count: 110, difficulty: "Medium" },
    { name: "Mathematics", icon: BookOpen, count: 150, difficulty: "Hard" },
  ];

  const entertainmentCategories = [
    { name: "Movies", icon: Film, count: 85, difficulty: "Easy" },
    { name: "Music", icon: Music, count: 75, difficulty: "Easy" },
    { name: "Sports", icon: Trophy, count: 90, difficulty: "Medium" },
    { name: "Gaming", icon: Gamepad2, count: 60, difficulty: "Medium" },
  ];

  const knowledgeCategories = [
    { name: "Geography", icon: Globe, count: 100, difficulty: "Medium" },
    { name: "History", icon: Landmark, count: 130, difficulty: "Hard" },
    { name: "Current Affairs", icon: Newspaper, count: 80, difficulty: "Medium" },
    { name: "Science Facts", icon: Lightbulb, count: 95, difficulty: "Easy" },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success/20 text-success";
      case "Medium": return "bg-accent/20 text-accent";
      case "Hard": return "bg-destructive/20 text-destructive";
      default: return "bg-muted";
    }
  };

  const SubcategoryCard = ({ category }: { category: any }) => (
    <Link to="/quiz">
      <Card className="border-border/50 card-shadow hover:card-shadow-hover transform hover:scale-105 transition-all duration-300 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <category.icon className="w-7 h-7 text-white" />
            </div>
            <Badge className={getDifficultyColor(category.difficulty)}>
              {category.difficulty}
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">{category.name}</h3>
          <p className="text-sm text-muted-foreground">{category.count} quizzes available</p>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Explore Quiz <span className="text-foreground">Categories</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our wide range of topics and start testing your knowledge today
            </p>
          </div>

          {/* Academic Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">Academic</h2>
                <p className="text-muted-foreground">Test your knowledge in core subjects</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {academicCategories.map((category, index) => (
                <SubcategoryCard key={index} category={category} />
              ))}
            </div>
          </section>

          {/* Entertainment Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">Entertainment</h2>
                <p className="text-muted-foreground">Have fun with pop culture and media quizzes</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {entertainmentCategories.map((category, index) => (
                <SubcategoryCard key={index} category={category} />
              ))}
            </div>
          </section>

          {/* General Knowledge Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">General Knowledge</h2>
                <p className="text-muted-foreground">Expand your horizons with diverse topics</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {knowledgeCategories.map((category, index) => (
                <SubcategoryCard key={index} category={category} />
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center py-16 px-4 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Request a new category or suggest topics you'd like to see on QuizGen
            </p>
            <Button size="lg" className="gradient-primary text-white font-semibold">
              Request New Category
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
