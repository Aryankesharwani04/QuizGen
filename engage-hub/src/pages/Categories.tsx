import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Brain, Beaker, Atom, BookOpen, Film, Music, Gamepad2, Trophy, Globe, 
  Landmark, Newspaper, Lightbulb, Code, Briefcase, Heart, Palette, Tv, 
  Target, Cpu, BookText, Languages, Puzzle, Sparkles, Smile 
} from "lucide-react";
import { TOPICS, SUBTOPICS } from "@/lib/topics";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QuizCard } from "@/components/QuizCard"; // Import the shared component

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

  // Icon mapping for subtopics
  const getSubtopicIcon = (topicName: string, subtopicName: string): any => {
    const iconMap: Record<string, any> = {
      "Physics": Atom, "Chemistry": Beaker, "Biology": Brain, "Mathematics": BookOpen,
      "Movies": Film, "Music": Music, "Sports": Trophy, "Gaming": Gamepad2,
      "Geography": Globe, "History": Landmark, "Current Affairs": Newspaper,
      "Programming Languages": Code, "Artificial Intelligence": Sparkles, "Cyber Security": Cpu,
    };
    return iconMap[subtopicName] || topicIcons[topicName] || BookText;
  };

  // Fetch quiz counts for all subtopics on mount
  useEffect(() => {
    const fetchAllCounts = async () => {
      const { default: cacheService } = await import('@/lib/cacheService');
      const cachedCounts = cacheService.get<Record<string, number>>('quiz_counts');

      if (cachedCounts) {
        setQuizCounts(cachedCounts);
        setLoadingCounts(false);
      }

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
            counts[`${topic}::${subtopic}`] = cachedCounts?.[`${topic}::${subtopic}`] || 0;
          }
        }
      }

      setQuizCounts(counts);
      cacheService.set('quiz_counts', counts, 5 * 60 * 1000);
      setLoadingCounts(false);
    };

    fetchAllCounts();
  }, []);

  // Handle subtopic click
  const handleSubtopicClick = async (category: string, subtopic: string) => {
    setSelectedCategory(category);
    setSelectedSubtopic(subtopic);
    setShowPopup(true);
    setLoadingQuizzes(true);
    setAvailableQuizzes([]);

    try {
      const { default: cacheService } = await import('@/lib/cacheService');
      const cacheKey = `quizzes_${category}_${subtopic}`;
      const cachedQuizzes = cacheService.get<any[]>(cacheKey);

      if (cachedQuizzes) {
        setAvailableQuizzes(cachedQuizzes);
        setLoadingQuizzes(false);
      }

      const response = await api.getQuizzesByCategory(category, subtopic);
      const quizzes = response.quizzes || [];

      setAvailableQuizzes(quizzes);
      cacheService.set(cacheKey, quizzes, 5 * 60 * 1000);
      setLoadingQuizzes(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load quizzes",
        description: "Could not fetch quiz list for this topic"
      });
      setLoadingQuizzes(false);
    }
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
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Explore Quiz <span className="text-foreground">Categories</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our wide range of topics and start testing your knowledge today
            </p>
          </div>

          {/* Dynamic Category Sections */}
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
                    const category = { name: subtopic, icon: SubtopicIcon };
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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col bg-background/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <span className="text-primary">{selectedSubtopic}</span> Quizzes
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {selectedCategory}
            </p>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pr-2 space-y-4 p-1">
            {loadingQuizzes ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading quizzes...</p>
              </div>
            ) : availableQuizzes.length === 0 ? (
              <div className="text-center py-12 border rounded-xl bg-muted/20">
                <Brain className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No quizzes available for this topic yet.</p>
                <Button className="mt-4" variant="outline" onClick={() => setShowPopup(false)}>
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {availableQuizzes.map((quiz, index) => (
                   // Calling QuizCard with data and strict fallbacks
                  <QuizCard
                    key={quiz.quiz_id || index}
                    quiz_id={quiz.quiz_id || 'unknown'}
                    title={quiz.title || 'Untitled Quiz'}
                    // Use the selected subtopic if the quiz object lacks a topic
                    topic={quiz.topic || selectedSubtopic} 
                    // QuizCard will default to 'time-based' if this is null
                    quiz_type={quiz.quiz_type} 
                    level={quiz.level || 'Medium'}
                    // List views often miss details, so we provide safe defaults
                    num_questions={quiz.num_questions || 10}
                    duration_seconds={quiz.duration_seconds || 600}
                    created_at={quiz.created_at || null}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;