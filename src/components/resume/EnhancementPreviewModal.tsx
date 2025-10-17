import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScoreData } from "@/types/resume";
import { useResumeEnhancer } from "@/hooks/useResumeEnhancer";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles, TrendingUp, Target, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancementPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  scoreData: ScoreData;
}

export const EnhancementPreviewModal = ({
  isOpen,
  onClose,
  scoreData,
}: EnhancementPreviewModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { parseScoringSuggestions, parseAndEnhanceResume } = useResumeEnhancer();
  const [isApplying, setIsApplying] = useState(false);

  const summary = parseScoringSuggestions(scoreData);

  const handleApply = async () => {
    setIsApplying(true);
    
    try {
      // Parse original resume and apply enhancements
      const { enhanced, enhancements } = await parseAndEnhanceResume(scoreData.id, scoreData);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Save to database with enhancement metadata
      const { error: saveError } = await supabase
        .from('user_resume_data')
        .upsert({
          user_id: user.id,
          resume_data: enhanced as any,
          enhancements: enhancements as any,
          applied_from_score_id: scoreData.id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (saveError) throw saveError;

      toast({
        title: "✨ Enhancements Applied!",
        description: `Your resume has been populated with original content and AI improvements.`,
      });
      
      // Navigate to resume builder with enhancement flag
      navigate(`/ats-resume-builder?enhanced=true&score_id=${scoreData.id}`);
      onClose();
    } catch (error) {
      console.error('Enhancement error:', error);
      toast({
        title: "Error",
        description: "Failed to apply enhancements. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const estimatedScoreIncrease = Math.min(
    Math.floor(summary.skillsToAdd.length * 1.5 + summary.achievementEnhancements.length * 0.8),
    15
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            Apply AI Suggestions
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            We'll help you improve your resume with personalized enhancements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Score Impact Prediction */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimated Score Increase</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">+{estimatedScoreIncrease} points</p>
                </div>
              </div>
              <Badge className="bg-emerald-600 text-white">High Impact</Badge>
            </div>
          </div>

          {/* Summary of Changes */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              What we'll enhance:
            </h4>
            
            {summary.skillsToAdd.length > 0 && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Add {summary.skillsToAdd.length} new skill{summary.skillsToAdd.length > 1 ? 's' : ''}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {summary.skillsToAdd.slice(0, 5).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                        {skill}
                      </Badge>
                    ))}
                    {summary.skillsToAdd.length > 5 && (
                      <Badge variant="outline" className="border-blue-300 text-blue-600">
                        +{summary.skillsToAdd.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {summary.achievementEnhancements.length > 0 && (
              <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-purple-900 dark:text-purple-100">
                    Apply {summary.achievementEnhancements.length} improvement tip{summary.achievementEnhancements.length > 1 ? 's' : ''}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-purple-700 dark:text-purple-300">
                    {summary.achievementEnhancements.slice(0, 3).map((tip, idx) => (
                      <li key={idx} className="line-clamp-1">• {tip}</li>
                    ))}
                    {summary.achievementEnhancements.length > 3 && (
                      <li className="text-purple-600 dark:text-purple-400 font-medium">
                        • And {summary.achievementEnhancements.length - 3} more improvements...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Assurance Message */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-900 dark:text-amber-100">
                <p className="font-medium">Your current resume data will be preserved</p>
                <p className="text-amber-700 dark:text-amber-300 mt-1">
                  We'll only add new improvements without removing existing content.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isApplying}>
            Cancel
          </Button>
          <Button 
            onClick={handleApply} 
            disabled={isApplying}
            className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {isApplying ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Apply & Open Builder
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
