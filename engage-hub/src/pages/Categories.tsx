import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Beaker, Atom, BookOpen, Film, Music, Gamepad2, Trophy, Globe, Landmark, Newspaper, Lightbulb, Code, Briefcase, Heart, Palette, Tv, Target, Cpu, BookText, Languages, Puzzle, Sparkles, Smile } from "lucide-react";
import { Link } from "react-router-dom";
import { TOPICS, SUBTOPICS } from "@/lib/topics";

const Categories = () => {
  // Icon mapping for main topics
  const topicIcons: Record<string, any> = {
    "Academic & Education": BookOpen,
    "Competitive Exams": Target,
    "Technology & Computing": Code,
    "General Knowledge": Globe,
    "Business & Finance": Briefcase,
    "Health & Medicine": Heart,
    "Arts & Humanities": Palette,
    "Entertainment & Pop Culture": Tv,
    "Sports & Games": Trophy,
    "Gaming": Gamepad2,
    "Lifestyle & Society": Smile,
    "Science & Innovation": Atom,
    "Languages": Languages,
    "Logical & Aptitude Reasoning": Puzzle,
    "Coding & Interview Prep": Code,
    "AI, Ethics & Future": Sparkles,
    "Fun & Casual": Lightbulb,
  };

  // Icon mapping for subtopics (fallback to general icons)
  const getSubtopicIcon = (topicName: string, subtopicName: string): any => {
    const iconMap: Record<string, any> = {
      // Science & Innovation
      "Physics": Atom,
      "Chemistry": Beaker,
      "Biology": Brain,
      "Mathematics": BookOpen,
      // Entertainment
      "Movies": Film,
      "Music": Music,
      "Sports": Trophy,
      "Gaming": Gamepad2,
      // General Knowledge
      "Geography": Globe,
      "History": Landmark,
      "Current Affairs": Newspaper,
      // Tech
      "Programming Languages": Code,
      "Artificial Intelligence": Sparkles,
      "Cyber Security": Cpu,
    };
    return iconMap[subtopicName] || topicIcons[topicName] || BookText;
  };

  // Generate random count and difficulty for demo purposes
  const getRandomCount = () => Math.floor(Math.random() * 100) + 50;
  const getRandomDifficulty = () => {
    const difficulties = ["Easy", "Medium", "Hard"];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success/20 text-success";
      case "Medium": return "bg-accent/20 text-accent";
      case "Hard": return "bg-destructive/20 text-destructive";
      default: return "bg-muted";
    }
  };

  const SubcategoryCard = ({ category }: { category: any }) => (
    <Link to="/quiz" className="h-full block">
      <Card className="border-border/50 card-shadow hover:card-shadow-hover transform hover:scale-105 transition-all duration-300 cursor-pointer group h-full">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <category.icon className="w-7 h-7 text-white" />
            </div>
            <Badge className={getDifficultyColor(category.difficulty)}>
              {category.difficulty}
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{category.name}</h3>
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

          {/* Dynamic Category Sections from SUBTOPICS */}
          {TOPICS.map((topic, topicIndex) => {
            const subtopics = SUBTOPICS[topic as keyof typeof SUBTOPICS];
            if (!subtopics || subtopics.length === 0) return null;

            const TopicIcon = topicIcons[topic] || BookText;
            const gradientClass = topicIndex % 3 === 0 ? "gradient-primary" : topicIndex % 3 === 1 ? "gradient-secondary" : "gradient-accent";

            return (
              <section key={topic} className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${gradientClass} flex items-center justify-center`}>
                    <TopicIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">{topic}</h2>
                    <p className="text-muted-foreground">Explore {subtopics.length} subcategories</p>
                  </div>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarGutter: 'stable' }}>
                  {subtopics.map((subtopic, index) => {
                    const SubtopicIcon = getSubtopicIcon(topic, subtopic);
                    const category = {
                      name: subtopic,
                      icon: SubtopicIcon,
                      count: getRandomCount(),
                      difficulty: getRandomDifficulty()
                    };
                    return (
                      <div key={index} className="flex-shrink-0 w-64 h-52">
                        <SubcategoryCard category={category} />
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

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
