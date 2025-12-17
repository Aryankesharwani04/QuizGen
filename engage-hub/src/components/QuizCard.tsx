import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
    Clock, 
    ListChecks, 
    CalendarDays, 
    Share2, 
    Copy, 
    Zap, 
    Timer, 
    BookOpen, 
    Layers
} from "lucide-react";
import { useState } from "react";

interface QuizCardProps {
    quiz_id: string;
    title: string;
    topic: string;
    quiz_type: string;
    level: string;
    num_questions: number;
    duration_seconds: number;
    created_at?: string | null;
}

export const QuizCard = ({ 
    quiz_id, 
    title,
    topic,
    quiz_type,
    level, 
    num_questions, 
    duration_seconds,
    created_at 
}: QuizCardProps) => {

    const [copied, setCopied] = useState(false);

    const handleCopyId = () => {
        navigator.clipboard.writeText(quiz_id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getLevelStyle = (level: string) => {
        const levelLower = (level || '').toLowerCase();
        if (levelLower === 'easy') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
        if (levelLower === 'medium') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
        if (levelLower === 'hard') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
    };

    const getQuizTypeConfig = (type: string) => {
        // FORCE DEFAULT: If type is missing, default to 'time-based'
        const effectiveType = (type || 'time-based').toLowerCase().replace(' ', '-');
        
        switch (effectiveType) {
            case 'fast-paced':
                return { 
                    style: 'bg-violet-500/10 text-violet-600 border-violet-200/20', 
                    icon: <Zap className="w-3 h-3" />, 
                    label: 'Fast Paced' 
                };
            case 'learning-based':
                return { 
                    style: 'bg-blue-500/10 text-blue-600 border-blue-200/20', 
                    icon: <BookOpen className="w-3 h-3" />, 
                    label: 'Learning' 
                };
            case 'time-based':
            default: // Default case also catches unrecognized types, mapping them to Time Based style if preferred, or use a generic fallback.
                return { 
                    style: 'bg-orange-500/10 text-orange-600 border-orange-200/20', 
                    icon: <Timer className="w-3 h-3" />, 
                    label: 'Time Based' 
                };
        }
    };

    const typeConfig = getQuizTypeConfig(quiz_type);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="group relative w-full rounded-xl border border-border/50 bg-background/50 p-5 hover:bg-muted/30 transition-all duration-300 hover:shadow-md hover:border-primary/20">
            
            {/* Top Right: Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
                <button 
                    onClick={handleCopyId}
                    className="p-1.5 text-muted-foreground/60 hover:text-primary transition-colors rounded-md hover:bg-background/80"
                    title="Copy Quiz ID"
                >
                    {copied ? <span className="text-[10px] font-bold text-green-500">Copied</span> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground/50 select-text border-l border-r border-border/50 px-2 h-4">
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-wider opacity-70">ID</span>
                    <span>{quiz_id}</span>
                </div>
                
                <button className="p-1.5 text-muted-foreground/60 hover:text-foreground transition-colors rounded-full hover:bg-background/80">
                    <Share2 className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
                
                {/* Content */}
                <div className="flex-1 space-y-2.5 pr-2 sm:pr-0">
                    
                    {/* Title & Level */}
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-foreground tracking-tight line-clamp-1">
                            {title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getLevelStyle(level)}`}>
                            {level || 'Normal'}
                        </span>
                    </div>

                    {/* Topic & Type */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                            <Layers className="w-4 h-4 text-primary/60" />
                            <span>{topic || 'General Knowledge'}</span>
                        </div>

                        <span className="text-border">•</span>

                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium ${typeConfig.style}`}>
                            {typeConfig.icon}
                            <span>{typeConfig.label}</span>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-primary/70" />
                            <span>{Math.floor((duration_seconds || 0) / 60)} mins</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <ListChecks className="w-3.5 h-3.5 text-primary/70" />
                            <span>{num_questions} Qs</span>
                        </div>

                        {created_at && (
                            <div className="flex items-center gap-1.5">
                                <CalendarDays className="w-3.5 h-3.5 text-primary/70" />
                                <span>{formatDate(created_at)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Start Button */}
                <div className="flex sm:flex-col justify-end items-end sm:min-w-[120px]">
                    <Link to={`/quiz/${quiz_id}`} className="w-full sm:w-auto">
                        <Button size="sm" className="gradient-primary text-white shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all w-full sm:w-32">
                            Start Quiz
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};