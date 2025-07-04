
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUploadSection } from "./FileUploadSection";
import { Edit, Sparkles, FileText, Zap, Target, Rocket } from "lucide-react";
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
    { icon: Zap, text: "ATS-Friendly", color: "text-yellow-600" },
    { icon: Target, text: "Keyword Rich", color: "text-green-600" },
    { icon: Sparkles, text: "AI-Enhanced", color: "text-blue-600" }
  ];

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50/90 via-white to-green-50/90 dark:from-emerald-950/40 dark:via-background dark:to-green-950/40 border-2 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xl hover:shadow-3xl transition-all duration-500">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-emerald-300/20 to-green-300/10 dark:from-emerald-700/20 dark:to-green-700/10 rounded-full -translate-y-24 -translate-x-24 animate-pulse delay-500"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-300/20 to-emerald-300/10 dark:from-blue-700/20 dark:to-emerald-700/10 rounded-full translate-y-20 translate-x-20 animate-pulse delay-1500"></div>
        
        <CardContent className="p-8 relative z-10">
          {/* Header with animated title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-xl transition-transform duration-500 ${
                animateFeatures ? 'rotate-12 scale-110' : 'rotate-0 scale-100'
              }`}>
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                Your Resume
              </h3>
            </div>
            
            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {features.map((feature, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className={`flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-background/60 border-2 border-emerald-200/60 dark:border-emerald-800/60 transition-all duration-300 delay-${index * 300} hover:scale-105 shadow-lg ${
                    resumeContent ? 'animate-pulse' : ''
                  }`}
                >
                  <feature.icon className={`h-4 w-4 ${feature.color}`} />
                  <span className="font-medium">{feature.text}</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Enhanced Build Resume button with animations */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={handleBuildResumeClick}
              className="px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl group bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 hover:from-emerald-700 hover:via-green-700 hover:to-blue-700 text-white border-0 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Edit className="h-7 w-7 mr-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
              <span className="relative z-10">
                Build New Resume
              </span>
              <Rocket className="h-6 w-6 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 relative z-10" />
            </Button>
          </div>

          {/* Enhanced upload section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/30 to-blue-200/30 dark:from-emerald-800/30 dark:to-blue-800/30 rounded-2xl blur-sm"></div>
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
