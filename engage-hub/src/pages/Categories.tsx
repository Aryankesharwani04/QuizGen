import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, Beaker, Atom, BookOpen, Film, Music, Gamepad2, Trophy, Globe, Landmark, Newspaper, Lightbulb, Code, Briefcase, Heart, Palette, Tv, Target, Cpu, BookText, Languages, Puzzle, Sparkles, Smile, Clock } from "lucide-react";
import { TOPICS, SUBTOPICS } from "@/lib/topics";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Categories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for quiz counts per subtopic
  const [quizCounts, setQuizCounts] = useState<Record<string, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(true);

  // State for popup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>("");
  const [availableQuizzes, setAvailableQuizzes] = useState<any[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success/20 text-success";
      case "Medium": return "bg-accent/20 text-accent";
      case "Hard": return "bg-destructive/20 text-destructive";
      default: return "bg-muted";
    }
  };

  // Fetch quiz counts for all subtopics on mount
  useEffect(() => {
    const fetchAllCounts = async () => {
      // Try to load from cache first
      const { default: cacheService } = await import('@/lib/cacheService');
      const cachedCounts = cacheService.get<Record<string, number>>('quiz_counts');

      // Show cached data immediately if available
      if (cachedCounts) {
        setQuizCounts(cachedCounts);
        setLoadingCounts(false);
      }

      // Fetch fresh counts (in background if cache exists)
      const counts: Record<string, number> = {};

      for (const topic of TOPICS) {
        const subtopics = SUBTOPICS[topic as keyof typeof SUBTOPICS];
        if (!subtopics) continue;

        for (const subtopic of subtopics) {
          try {
            const response = await api.countQuizzesByCategory(topic, subtopic);
            const key = `${topic}::${subtopic}`;
            counts[key] = response.count || 0;
          } catch (error) {
            console.error(`Failed to fetch count for ${topic}/${subtopic}:`, error);
            counts[`${topic}::${subtopic}`] = cachedCounts?.[`${topic}::${subtopic}`] || 0;
          }
        }
      }

      // Update state and cache with fresh data
      setQuizCounts(counts);
      cacheService.set('quiz_counts', counts, 5 * 60 * 1000); // Cache for 5 minutes
      setLoadingCounts(false);
    };

    fetchAllCounts();
  }, []);

  // Handle subtopic click - open popup and fetch quizzes
  const handleSubtopicClick = async (category: string, subtopic: string) => {
    setSelectedCategory(category);
    setSelectedSubtopic(subtopic);
    setShowPopup(true);
    setLoadingQuizzes(true);
    setAvailableQuizzes([]);

    try {
      // Try to load from cache first
      const { default: cacheService } = await import('@/lib/cacheService');
      const cacheKey = `quizzes_${category}_${subtopic}`;
      const cachedQuizzes = cacheService.get<any[]>(cacheKey);

      // Show cached quizzes immediately if available
      if (cachedQuizzes) {
        setAvailableQuizzes(cachedQuizzes);
        setLoadingQuizzes(false);
      }

      // Fetch fresh quiz list
      const response = await api.getQuizzesByCategory(category, subtopic);
      const quizzes = response.quizzes || [];

      // Update state and cache
      setAvailableQuizzes(quizzes);
      cacheService.set(cacheKey, quizzes, 5 * 60 * 1000); // Cache for 5 minutes
      setLoadingQuizzes(false);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
      toast({
        variant: "destructive",
        title: "Failed to load quizzes",
        description: "Could not fetch quiz list for this topic"
      });
      setLoadingQuizzes(false);
    }
  };

  // Handle quiz start
  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const SubcategoryCard = ({ category, topic, subtopic }: { category: any, topic: string, subtopic: string }) => {
    const key = `${topic}::${subtopic}`;
    const count = quizCounts[key] || 0;

    return (
      <div className="h-full block" onClick={() => handleSubtopicClick(topic, subtopic)}>
        <Card className="border-border/50 card-shadow hover:card-shadow-hover transform hover:scale-105 transition-all duration-300 cursor-pointer group h-full">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <category.icon className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {loadingCounts ? "Loading..." : `${count} quizzes available`}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

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
                    };
                    return (
                      <div key={index} className="flex-shrink-0 w-64 h-52">
                        <SubcategoryCard category={category} topic={topic} subtopic={subtopic} />
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

      {/* Quiz Selection Popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedSubtopic} Quizzes
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {selectedCategory}
            </p>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pr-2">
            {loadingQuizzes ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading quizzes...</p>
              </div>
            ) : availableQuizzes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No quizzes available for this topic yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableQuizzes.map((quiz, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{quiz.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>Quiz ID: {quiz.quiz_id}</span>
                          <Badge className={getDifficultyColor(quiz.level)}>
                            {quiz.level}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleStartQuiz(quiz.quiz_id)}
                        size="sm"
                        className="gradient-primary text-white"
                      >
                        Start Quiz
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Categories;
