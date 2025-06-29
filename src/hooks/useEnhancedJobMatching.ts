import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';
import type { ResumeScoreRecord } from '@/types/resume';

type Job = Tables<'jobs'>;

export interface EnhancedJobMatch {
  job: Job;
  matchScore: number;
  matchReasons: string[];
  keywordMatches: string[];
  skillsScore: number;
  skillsGapScore: number;
  locationScore: number;
  industryScore: number;
  qualityBonus: number;
  detailedScoring: {
    skillsAnalysis: {
      matchingSkills: string[];
      missingSkills: string[];
      score: number;
      maxScore: number;
    };
    skillsGapAnalysis: {
      criticalMissingSkills: string[];
      recommendedSkills: string[];
      skillsStrength: string;
      score: number;
      maxScore: number;
    };
    resumeQualityAnalysis: {
      overallScore: number;
      industryMatch: boolean;
      strengthAreas: string[];
      improvementAreas: string[];
      score: number;
      maxScore: number;
    };
  };
}

export function useEnhancedJobMatching() {
  const [matchedJobs, setMatchedJobs] = useState<EnhancedJobMatch[]>([]);
  const [allJobsWithScores, setAllJobsWithScores] = useState<EnhancedJobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedResume, setSelectedResume] = useState<ResumeScoreRecord | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const calculateJobMatch = (job: Job, resumeData: ResumeScoreRecord): EnhancedJobMatch => {
    const jobText = `${job.title} ${job.description} ${job.requirements || ''}`.toLowerCase();
    const resumeSkills = resumeData.suggested_skills || [];
    
    // Extract required skills from job description
    const commonTechSkills = [
      'javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 
      'typescript', 'java', 'c++', 'angular', 'vue', 'mongodb', 'postgresql', 'git',
      'html', 'css', 'express', 'django', 'flask', 'spring', 'graphql', 'redis',
      'elasticsearch', 'jenkins', 'terraform', 'linux', 'windows', 'azure', 'gcp',
      'figma', 'photoshop', 'sketch', 'illustrator', 'marketing', 'seo', 'analytics'
    ];
    
    const jobRequiredSkills = commonTechSkills.filter(skill => jobText.includes(skill));
    const matchingSkills = resumeSkills.filter(skill => 
      jobRequiredSkills.some(jobSkill => skill.toLowerCase().includes(jobSkill) || jobSkill.includes(skill.toLowerCase()))
    );
    const missingSkills = jobRequiredSkills.filter(skill => 
      !resumeSkills.some(resumeSkill => resumeSkill.toLowerCase().includes(skill) || skill.includes(resumeSkill.toLowerCase()))
    );

    // Skills scoring (max 35 points)
    const skillsScore = Math.min(35, jobRequiredSkills.length > 0 ? 
      (matchingSkills.length / jobRequiredSkills.length) * 35 : 20);
    
    // Skills gap analysis (max 25 points)
    const criticalMissingSkills = missingSkills.slice(0, 3); // Top 3 most important missing skills
    const recommendedSkills = missingSkills.slice(3, 6); // Additional skills to consider
    const skillsStrength = matchingSkills.length > 0 ? 
      `Strong in ${matchingSkills.slice(0, 2).join(', ')}` : 
      'Limited technical alignment';
    
    const skillsGapScore = Math.max(5, 25 - (missingSkills.length * 3));
    
    // Industry matching (max 20 points)
    const industryScore = jobText.includes(resumeData.industry.toLowerCase()) ? 20 : 8;
    
    // Location scoring (max 10 points)
    const locationScore = job.location.toLowerCase().includes('remote') ? 10 : 6;
    
    // Resume quality bonus (max 10 points)
    const qualityBonus = Math.min(10, (resumeData.overall_score / 100) * 10);
    
    const totalScore = skillsScore + skillsGapScore + industryScore + locationScore + qualityBonus;
    
    // Generate match reasons
    const matchReasons: string[] = [];
    if (matchingSkills.length > 0) {
      matchReasons.push(`${matchingSkills.length} of ${jobRequiredSkills.length} required skills match`);
    }
    if (criticalMissingSkills.length === 0) {
      matchReasons.push('All critical technical skills present');
    } else if (criticalMissingSkills.length <= 2) {
      matchReasons.push('Only minor skill gaps identified');
    }
    if (industryScore > 10) {
      matchReasons.push(`${resumeData.industry} industry experience aligns`);
    }
    if (resumeData.overall_score >= 80) {
      matchReasons.push('Strong resume quality score');
    }

    // Detailed scoring breakdown
    const detailedScoring = {
      skillsAnalysis: {
        matchingSkills,
        missingSkills,
        score: Math.round(skillsScore),
        maxScore: 35
      },
      skillsGapAnalysis: {
        criticalMissingSkills,
        recommendedSkills,
        skillsStrength,
        score: Math.round(skillsGapScore),
        maxScore: 25
      },
      resumeQualityAnalysis: {
        overallScore: resumeData.overall_score,
        industryMatch: industryScore > 10,
        strengthAreas: getStrengthAreas(resumeData),
        improvementAreas: getImprovementAreas(resumeData),
        score: Math.round(industryScore + locationScore + qualityBonus),
        maxScore: 40
      }
    };

    return {
      job,
      matchScore: Math.round(totalScore),
      matchReasons,
      keywordMatches: matchingSkills,
      skillsScore: Math.round(skillsScore),
      skillsGapScore: Math.round(skillsGapScore),
      locationScore: Math.round(locationScore),
      industryScore: Math.round(industryScore),
      qualityBonus: Math.round(qualityBonus),
      detailedScoring
    };
  };

  const getStrengthAreas = (resumeData: ResumeScoreRecord): string[] => {
    const strengths: string[] = [];
    if (resumeData.overall_score >= 80) strengths.push('Strong overall profile');
    if (resumeData.skills_breadth >= 75) strengths.push('Diverse skill set');
    if (resumeData.experience_duration >= 60) strengths.push('Solid experience background');
    if (resumeData.ats_readiness >= 80) strengths.push('ATS-optimized resume');
    return strengths;
  };

  const getImprovementAreas = (resumeData: ResumeScoreRecord): string[] => {
    const improvements: string[] = [];
    if (resumeData.overall_score < 70) improvements.push('Overall resume quality');
    if (resumeData.skills_breadth < 60) improvements.push('Technical skills breadth');
    if (resumeData.experience_duration < 40) improvements.push('Professional experience');
    if (resumeData.ats_readiness < 70) improvements.push('ATS compatibility');
    return improvements;
  };

  const analyzeAllJobs = async (resumeScore: ResumeScoreRecord) => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch user's own jobs
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('posted_date', { ascending: false });

      if (error) throw error;

      const jobsWithScores = (jobs || []).map(job => calculateJobMatch(job, resumeScore));
      
      // Sort by match score
      jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
      
      setAllJobsWithScores(jobsWithScores);
      setMatchedJobs(jobsWithScores);

      toast({
        title: "Job Analysis Complete",
        description: `Analyzed ${jobs?.length || 0} of your personal job listings.`,
      });
    } catch (error) {
      console.error('Error analyzing jobs:', error);
      toast({
        title: "Error",
        description: "Failed to analyze job matches. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSelection = (resumeScore: ResumeScoreRecord) => {
    setSelectedResume(resumeScore);
    analyzeAllJobs(resumeScore);
  };

  return {
    matchedJobs,
    allJobsWithScores,
    loading,
    selectedResume,
    handleResumeSelection,
    reanalyzeJobs: () => selectedResume && analyzeAllJobs(selectedResume)
  };
}
