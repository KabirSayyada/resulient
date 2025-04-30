
import React, { useState } from 'react';
import { ScoreData } from '@/types/resume';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { ScoreBreakdown } from './ScoreBreakdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SuggestedSkills } from './components/SuggestedSkills';

interface CompareResumesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scores: ScoreData[];
}

export const CompareResumes = ({ open, onOpenChange, scores }: CompareResumesProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  if (!scores || scores.length < 2) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Resume Score Comparison</DialogTitle>
          <DialogDescription className="text-center">
            Compare your resume scores to track your progress over time
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-indigo-700 dark:text-indigo-300">Score 1</h3>
            <div className="flex items-center gap-2">
              <div className="text-4xl font-bold text-indigo-600">{scores[0].overallScore}</div>
              <div className="text-sm text-gray-500">{scores[0].timestamp}</div>
            </div>
            <div className="text-sm text-indigo-600 font-medium">Industry: {scores[0].Industry}</div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-indigo-700 dark:text-indigo-300">Score 2</h3>
            <div className="flex items-center gap-2">
              <div className="text-4xl font-bold text-indigo-600">{scores[1].overallScore}</div>
              <div className="text-sm text-gray-500">{scores[1].timestamp}</div>
            </div>
            <div className="text-sm text-indigo-600 font-medium">Industry: {scores[1].Industry}</div>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2 text-center">Score: {scores[0].overallScore}</h4>
                  <div className="text-sm text-center mb-4 text-gray-500">{scores[0].timestamp}</div>
                  <ScoreBreakdown scoreData={scores[0]} />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2 text-center">Score: {scores[1].overallScore}</h4>
                  <div className="text-sm text-center mb-4 text-gray-500">{scores[1].timestamp}</div>
                  <ScoreBreakdown scoreData={scores[1]} />
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
                <div className="text-center">{scores[0].skillsAlignment}</div>
                <div className="text-center">{scores[1].skillsAlignment}</div>
              </div>
              
              <div className="text-right">Work Experience</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">{scores[0].WorkExperience}</div>
                <div className="text-center">{scores[1].WorkExperience}</div>
              </div>
              
              <div className="text-right">Achievements</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">{scores[0].Achievements}</div>
                <div className="text-center">{scores[1].Achievements}</div>
              </div>
              
              <div className="text-right">Education Quality</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">{scores[0].EducationQuality}</div>
                <div className="text-center">{scores[1].EducationQuality}</div>
              </div>
              
              <div className="text-right">Certifications</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">{scores[0].Certifications}</div>
                <div className="text-center">{scores[1].Certifications}</div>
              </div>
              
              <div className="text-right">Content Structure</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">{scores[0].ContentStructure}</div>
                <div className="text-center">{scores[1].ContentStructure}</div>
              </div>
              
              <div className="text-right">Keyword Relevance</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">{scores[0].keywordRelevance}</div>
                <div className="text-center">{scores[1].keywordRelevance}</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Suggested Skills (Score 1)</h4>
                  <SuggestedSkills skills={scores[0].suggestedSkills || []} />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Suggested Skills (Score 2)</h4>
                  <SuggestedSkills skills={scores[1].suggestedSkills || []} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
