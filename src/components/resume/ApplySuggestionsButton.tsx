import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { ScoreData } from "@/types/resume";
import { EnhancementPreviewModal } from "./EnhancementPreviewModal";
import { useNavigate } from "react-router-dom";
import { useResumeEnhancer } from "@/hooks/useResumeEnhancer";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { useAuth } from "@/hooks/useAuth";

interface ApplySuggestionsButtonProps {
  scoreData: ScoreData;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
}

export const ApplySuggestionsButton = ({ 
  scoreData, 
  variant = "default",
  size = "default",
  fullWidth = false 
}: ApplySuggestionsButtonProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { generatePreviewSummary } = useResumeEnhancer();
  const { resumeData } = useResumeBuilder();
  const { user } = useAuth();

  const summary = generatePreviewSummary(scoreData);
  
  if (summary.length === 0) {
    return null;
  }

  const handleClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setShowPreview(true);
  };

  const buttonText = resumeData ? "Enhance Existing Resume" : "Start Building with AI";

  return (
    <>
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        className={`${fullWidth ? 'w-full' : ''} gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0`}
      >
        <Sparkles className="h-5 w-5" />
        {buttonText}
        <ArrowRight className="h-5 w-5" />
      </Button>

      <EnhancementPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        scoreData={scoreData}
      />
    </>
  );
};
