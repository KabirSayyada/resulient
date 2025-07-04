
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles, Target, TrendingUp, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EnhancedJobDescriptionInputProps {
  jobDescription: string;
  setJobDescription: (description: string) => void;
}

export const EnhancedJobDescriptionInput = ({ jobDescription, setJobDescription }: EnhancedJobDescriptionInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [animateIcons, setAnimateIcons] = useState(false);
  const wordCount = jobDescription.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateIcons(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const analysisSteps = [
    { icon: Target, text: "Job Requirements", color: "text-blue-500" },
    { icon: TrendingUp, text: "Skill Matching", color: "text-green-500" },
    { icon: Zap, text: "ATS Optimization", color: "text-purple-500" }
  ];

  return (
    <Card className={`relative overflow-hidden transition-all duration-500 transform ${
      isFocused ? 'scale-[1.02] shadow-2xl' : 'hover:shadow-xl'
    } bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 border-2 ${
      isFocused ? 'border-blue-400' : 'border-blue-200 dark:border-blue-800'
    }`}>
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full translate-y-12 -translate-x-12 animate-pulse delay-1000"></div>
      
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <div className={`p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg transition-transform duration-300 ${
            animateIcons ? 'rotate-6 scale-110' : 'rotate-0 scale-100'
          }`}>
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Job Description
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
              <span className="text-sm font-normal text-blue-600 dark:text-blue-400">
                AI-Powered Analysis Ready
              </span>
            </div>
          </div>
        </CardTitle>
        
        {/* Analysis steps preview */}
        <div className="flex flex-wrap gap-2 mt-3">
          {analysisSteps.map((step, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="flex items-center gap-1 px-3 py-1 bg-white/80 dark:bg-gray-800/80 border transition-all duration-300"
            >
              <step.icon className={`h-3 w-3 ${step.color}`} />
              <span className="text-xs font-medium">{step.text}</span>
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        <div className="relative">
          <Textarea
            placeholder="🎯 Paste the complete job posting here...

✨ What we'll analyze:
• Job title and company details
• Required skills and qualifications  
• Key responsibilities and duties
• Experience requirements
• Important keywords and phrases
• Company culture indicators

💡 The more details you provide, the better we can optimize your resume!"
            className={`min-h-[200px] text-sm transition-all duration-300 resize-none ${
              isFocused 
                ? 'bg-white dark:bg-gray-800 border-2 border-blue-400 shadow-lg ring-4 ring-blue-400/20' 
                : 'bg-white/90 dark:bg-gray-800/90 border-2 border-blue-200 dark:border-blue-700'
            }`}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          {/* Word count with animation */}
          {wordCount > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-fade-in">
                <span className="font-bold">{wordCount}</span> words
              </div>
              {wordCount > 50 && (
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                  ✓
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Enhanced tip section */}
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-l-4 border-blue-500 rounded-lg p-4 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  🚀 Pro Optimization Tip
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                  Include the entire job posting for <span className="font-bold">maximum impact</span>. 
                  Our AI analyzes every detail to create a perfectly matched resume that gets past ATS systems 
                  and catches recruiters' attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
