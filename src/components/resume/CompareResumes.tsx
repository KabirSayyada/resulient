
import React, { useState, useEffect } from 'react';
import { ScoreData } from '@/types/resume';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { ScoreBreakdown } from './ScoreBreakdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SuggestedSkills } from './components/SuggestedSkills';
import { Button } from "@/components/ui/button";
import { ArrowRight, GitCompare, Lock } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface CompareResumesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scores: ScoreData[];
  preSelectedScores?: [string, string]; // Optional pre-selected score IDs
}

export const CompareResumes = ({ open, onOpenChange, scores, preSelectedScores }: CompareResumesProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [leftScoreId, setLeftScoreId] = useState<string>("");
  const [rightScoreId, setRightScoreId] = useState<string>("");
  const { subscription } = useSubscription();
  
  // Check if user has platinum access
  const hasPlatinumAccess = subscription.tier === "platinum";
  
  // Get actual score objects
  const leftScore = scores.find(s => s.id === leftScoreId);
  const rightScore = scores.find(s => s.id === rightScoreId);
  
  // Initialize with preselected scores or first two scores by default
  useEffect(() => {
    if (open && scores.length >= 2 && hasPlatinumAccess) {
      if (preSelectedScores && preSelectedScores.length === 2) {
        setLeftScoreId(preSelectedScores[0]);
        setRightScoreId(preSelectedScores[1]);
      } else if (!leftScoreId && !rightScoreId) {
        setLeftScoreId(scores[0].id);
        setRightScoreId(scores[1].id);
      }
    }
  }, [open, scores, preSelectedScores, hasPlatinumAccess]);
  
  if (!scores || scores.length < 2) {
    return null;
  }

  // Function to get a formatted label for the score
  const getScoreLabel = (score: ScoreData) => {
    const date = new Date(score.timestamp).toLocaleDateString();
    return `Score ${score.overallScore} (${date})`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">
            Resume Score Comparison
          </DialogTitle>
          <DialogDescription className="text-center">
            Compare your resume scores to track your progress over time
          </DialogDescription>
        </DialogHeader>
        
        {!hasPlatinumAccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="bg-amber-100 dark:bg-amber-900 rounded-full p-6">
              <Lock className="h-12 w-12 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Premium Feature
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Resume comparison is exclusively available on our Platinum plan. Upgrade now to unlock this powerful feature and track your progress over time.
            </p>
            <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
              <a href="/pricing">
                Upgrade to Platinum
              </a>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Score Selection Interface */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-indigo-700 dark:text-indigo-300">Score 1</h3>
                <Select value={leftScoreId} onValueChange={setLeftScoreId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a resume score" />
                  </SelectTrigger>
                  <SelectContent>
                    {scores.map((score) => (
                      <SelectItem key={score.id} value={score.id}>
                        {getScoreLabel(score)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {leftScore && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-2">
                      <div className="text-4xl font-bold text-indigo-600">{leftScore.overallScore}</div>
                      <div className="text-sm text-gray-500">{leftScore.timestamp}</div>
                    </div>
                    <div className="text-sm text-indigo-600 font-medium">Industry: {leftScore.Industry}</div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-indigo-700 dark:text-indigo-300">Score 2</h3>
                <Select value={rightScoreId} onValueChange={setRightScoreId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a resume score" />
                  </SelectTrigger>
                  <SelectContent>
                    {scores.filter(score => score.id !== leftScoreId).map((score) => (
                      <SelectItem key={score.id} value={score.id}>
                        {getScoreLabel(score)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {rightScore && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-2">
                      <div className="text-4xl font-bold text-indigo-600">{rightScore.overallScore}</div>
                      <div className="text-sm text-gray-500">{rightScore.timestamp}</div>
                    </div>
                    <div className="text-sm text-indigo-600 font-medium">Industry: {rightScore.Industry}</div>
                  </div>
                )}
              </div>
            </div>
            
            {leftScore && rightScore && (
              <Tabs defaultValue="overview" className="mt-6" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-md">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold mb-2 text-center">Score: {leftScore.overallScore}</h4>
                        <div className="text-sm text-center mb-4 text-gray-500">{leftScore.timestamp}</div>
                        <ScoreBreakdown scoreData={leftScore} />
                      </CardContent>
                    </Card>
                    
                    <Card className="border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-md">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold mb-2 text-center">Score: {rightScore.overallScore}</h4>
                        <div className="text-sm text-center mb-4 text-gray-500">{rightScore.timestamp}</div>
                        <ScoreBreakdown scoreData={rightScore} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="metrics" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="font-semibold text-right">Metrics</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="font-semibold text-center">Score 1</div>
                      <div className="font-semibold text-center">Score 2</div>
                    </div>
                    
                    <div className="text-right">Skills Alignment</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">{leftScore.skillsAlignment}</div>
                      <div className="text-center">{rightScore.skillsAlignment}</div>
                    </div>
                    
                    <div className="text-right">Work Experience</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">{leftScore.WorkExperience}</div>
                      <div className="text-center">{rightScore.WorkExperience}</div>
                    </div>
                    
                    <div className="text-right">Achievements</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">{leftScore.Achievements}</div>
                      <div className="text-center">{rightScore.Achievements}</div>
                    </div>
                    
                    <div className="text-right">Education Quality</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">{leftScore.EducationQuality}</div>
                      <div className="text-center">{rightScore.EducationQuality}</div>
                    </div>
                    
                    <div className="text-right">Certifications</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">{leftScore.Certifications}</div>
                      <div className="text-center">{rightScore.Certifications}</div>
                    </div>
                    
                    <div className="text-right">Content Structure</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">{leftScore.ContentStructure}</div>
                      <div className="text-center">{rightScore.ContentStructure}</div>
                    </div>
                    
                    <div className="text-right">Keyword Relevance</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">{leftScore.keywordRelevance}</div>
                      <div className="text-center">{rightScore.keywordRelevance}</div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="skills" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <h4 className="font-semibold mb-2">Suggested Skills (Score 1)</h4>
                        <SuggestedSkills skills={leftScore.suggestedSkills || []} />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <h4 className="font-semibold mb-2">Suggested Skills (Score 2)</h4>
                        <SuggestedSkills skills={rightScore.suggestedSkills || []} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            )}
            
            <DialogFooter className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <div className="text-sm text-gray-500">
                Comparing scores from {leftScore?.timestamp || ""} and {rightScore?.timestamp || ""}
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
