
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Target, AlertTriangle, TrendingUp } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import type { ResumeScoreRecord } from '@/types/resume';

type Job = Tables<'jobs'>;

interface JobGapAnalysisProps {
  job: Job;
  selectedResume: ResumeScoreRecord;
}

interface SkillGap {
  skill: string;
  importance: 'Critical' | 'Important' | 'Nice to Have';
  howToImprove: string;
}

interface JobGapAnalysis {
  matchScore: number;
  skillGaps: SkillGap[];
  experienceGaps: string[];
  recommendations: string[];
}

export function JobGapAnalysis({ job, selectedResume }: JobGapAnalysisProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState<JobGapAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeJobGaps = (): JobGapAnalysis => {
    const jobText = `${job.title} ${job.description} ${job.requirements || ''}`.toLowerCase();
    const resumeSkills = selectedResume.suggested_skills || [];
    
    // Extract required skills from job description
    const techSkills = ['javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'typescript', 'java', 'c++', 'angular', 'vue', 'mongodb', 'postgresql'];
    const jobRequiredSkills = techSkills.filter(skill => jobText.includes(skill));
    
    // Find missing skills
    const missingSkills = jobRequiredSkills.filter(skill => 
      !resumeSkills.some(resumeSkill => resumeSkill.toLowerCase().includes(skill))
    );

    // Calculate basic match score
    const skillMatch = resumeSkills.filter(skill => 
      jobText.includes(skill.toLowerCase())
    ).length;
    const matchScore = Math.min(85, (skillMatch / Math.max(jobRequiredSkills.length, 1)) * 100);

    // Create skill gaps
    const skillGaps: SkillGap[] = missingSkills.map(skill => ({
      skill: skill.charAt(0).toUpperCase() + skill.slice(1),
      importance: jobText.includes('required') && jobText.includes(skill) ? 'Critical' : 
                 jobText.includes('experience') && jobText.includes(skill) ? 'Important' : 'Nice to Have',
      howToImprove: `Consider learning ${skill} through online courses or hands-on projects`
    }));

    // Experience gaps
    const experienceGaps: string[] = [];
    const experienceMatch = jobText.match(/(\d+)\+?\s*years?\s*(of\s*)?experience/i);
    if (experienceMatch) {
      const requiredYears = parseInt(experienceMatch[1]);
      const userExperience = selectedResume.experience_duration || 0;
      if (userExperience < requiredYears) {
        experienceGaps.push(`Need ${requiredYears - userExperience} more years of experience`);
      }
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (skillGaps.length > 0) {
      recommendations.push(`Focus on learning ${skillGaps.slice(0, 3).map(gap => gap.skill).join(', ')}`);
    }
    if (experienceGaps.length > 0) {
      recommendations.push('Consider applying anyway - many companies are flexible with experience requirements');
    }
    if (selectedResume.overall_score < 75) {
      recommendations.push('Improve your resume score to increase match potential');
    }
    recommendations.push('Highlight transferable skills that relate to this role');

    return {
      matchScore: Math.round(matchScore),
      skillGaps,
      experienceGaps,
      recommendations
    };
  };

  const handleAnalyze = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const result = analyzeJobGaps();
      setAnalysis(result);
      setLoading(false);
      setIsOpen(true);
    }, 500);
  };

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleAnalyze}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <Target className="h-4 w-4" />
        {loading ? 'Analyzing...' : 'How to Become a Match'}
      </Button>

      {analysis && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto font-normal">
              <div className="flex items-center gap-2">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span>Gap Analysis Results</span>
                <Badge variant={analysis.matchScore >= 70 ? 'default' : analysis.matchScore >= 50 ? 'secondary' : 'destructive'}>
                  {analysis.matchScore}% Match
                </Badge>
              </div>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4">
            <Card>
              <CardContent className="p-4">
                {analysis.skillGaps.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      Missing Skills
                    </h4>
                    <div className="space-y-2">
                      {analysis.skillGaps.map((gap, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Badge variant={gap.importance === 'Critical' ? 'destructive' : gap.importance === 'Important' ? 'secondary' : 'outline'}>
                            {gap.importance}
                          </Badge>
                          <div className="flex-1">
                            <div className="font-medium">{gap.skill}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {gap.howToImprove}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.experienceGaps.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Experience Gaps</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {analysis.experienceGaps.map((gap, index) => (
                        <li key={index}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    Recommendations
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-400">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>

                {analysis.matchScore < 30 && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This role might be a significant stretch. Consider building more relevant experience before applying.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
