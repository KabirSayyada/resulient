
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUploadSection } from "./FileUploadSection";
import { Edit, Sparkles, FileText, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface EnhancedResumeInputToggleProps {
  resumeContent: string;
  setResumeContent: (content: string) => void;
  userId?: string;
  onResumeSelected?: () => void;
}

export const EnhancedResumeInputToggle = ({ 
  resumeContent, 
  setResumeContent, 
  userId, 
  onResumeSelected 
}: EnhancedResumeInputToggleProps) => {
  const navigate = useNavigate();
  const [animateFeatures, setAnimateFeatures] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateFeatures(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBuildResumeClick = () => {
    navigate('/resume-builder');
  };

  const features = [
    { icon: Zap, text: "ATS-Friendly", color: "text-warning" },
    { icon: Target, text: "Keyword Rich", color: "text-success" },
    { icon: Sparkles, text: "AI-Enhanced", color: "text-primary" }
  ];

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-success/10 via-success/5 to-info/10 border-2 border-success/20 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-success/20 to-success/10 rounded-full -translate-y-20 -translate-x-20 animate-pulse delay-500"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-info/20 to-success/10 rounded-full translate-y-16 translate-x-16 animate-pulse delay-1500"></div>
        
        <CardContent className="p-8 relative z-10">
          {/* Header with animated title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg transition-transform duration-500 ${
                animateFeatures ? 'rotate-12 scale-110' : 'rotate-0 scale-100'
              }`}>
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-success via-success/80 to-info bg-clip-text text-transparent">
                Your Resume
              </h3>
            </div>
            
            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {features.map((feature, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className={`flex items-center gap-1 px-3 py-1 bg-card/90 border transition-all duration-300 delay-${index * 300} ${
                    resumeContent ? 'animate-pulse' : ''
                  }`}
                >
                  <feature.icon className={`h-3 w-3 ${feature.color}`} />
                  <span className="text-xs font-medium">{feature.text}</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Enhanced Build Resume button with animations */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={handleBuildResumeClick}
              className="px-8 py-4 text-lg font-bold rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group bg-gradient-to-r from-primary via-primary/90 to-info hover:from-primary/90 hover:via-primary/80 hover:to-info/90 text-primary-foreground border-0"
            >
              <Edit className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative">
                Build New Resume
                <span className="absolute inset-0 bg-card/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
              </span>
              <Sparkles className="h-5 w-5 ml-3 group-hover:animate-spin transition-transform duration-300" />
            </Button>
          </div>

          {/* Enhanced upload section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-success/10 to-info/10 rounded-lg blur-sm"></div>
            <div className="relative">
              <FileUploadSection 
                resumeContent={resumeContent} 
                setResumeContent={setResumeContent} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
