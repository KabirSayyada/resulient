
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
  experienceScore: number;
  locationScore: number;
  industryScore: number;
  qualityBonus: number;
  hasApplied: boolean;
  appliedAt: string | null;
  detailedScoring: {
    skillsAnalysis: {
      matchingSkills: string[];
      missingSkills: string[];
      score: number;
      maxScore: number;
    };
    experienceAnalysis: {
      userExperience: number;
      requiredExperience: number | null;
      experienceGap: number;
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

  const calculateJobMatch = (job: Job, resumeData: ResumeScoreRecord, applications: any[] = []): EnhancedJobMatch => {
    const jobText = `${job.title} ${job.description} ${job.requirements || ''}`.toLowerCase();
    const resumeSkills = resumeData.suggested_skills || [];
    
    // Check if user has applied to this job
    const application = applications.find(app => app.job_id === job.id);
    const hasApplied = !!application;
    const appliedAt = application?.applied_at || null;
    
    // Extract required skills from job description
    const commonTechSkills = [
      'javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 
      'typescript', 'java', 'c++', 'angular', 'vue', 'mongodb', 'postgresql', 'git',
      'html', 'css', 'express', 'django', 'flask', 'spring', 'graphql', 'redis',
      'elasticsearch', 'jenkins', 'terraform', 'linux', 'windows', 'azure', 'gcp'
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
    
    // Experience analysis
    const experienceMatch = jobText.match(/(\d+)\+?\s*years?\s*(of\s*)?experience/i);
    const requiredExperience = experienceMatch ? parseInt(experienceMatch[1]) : null;
    const userExperience = resumeData.experience_duration || 0;
    const experienceGap = requiredExperience ? Math.max(0, requiredExperience - userExperience) : 0;
    
    // Experience scoring (max 25 points)
    let experienceScore = 15; // Base score
    if (requiredExperience) {
      if (userExperience >= requiredExperience) {
        experienceScore = 25;
      } else if (userExperience >= requiredExperience * 0.7) {
        experienceScore = 20;
      } else if (userExperience >= requiredExperience * 0.5) {
        experienceScore = 15;
      } else {
        experienceScore = 10;
      }
    }
    
    // Industry matching (max 20 points)
    const industryScore = jobText.includes(resumeData.industry.toLowerCase()) ? 20 : 8;
    
    // Location scoring (max 10 points)
    const locationScore = job.location.toLowerCase().includes('remote') ? 10 : 6;
    
    // Resume quality bonus (max 10 points)
    const qualityBonus = Math.min(10, (resumeData.overall_score / 100) * 10);
    
    const totalScore = skillsScore + experienceScore + industryScore + locationScore + qualityBonus;
    
    // Generate match reasons
    const matchReasons: string[] = [];
    if (matchingSkills.length > 0) {
      matchReasons.push(`${matchingSkills.length} of ${jobRequiredSkills.length} required skills match`);
    }
    if (experienceGap === 0 && requiredExperience) {
      matchReasons.push(`Meets ${requiredExperience}+ years experience requirement`);
    } else if (experienceGap > 0) {
      matchReasons.push(`${experienceGap} years short of experience requirement`);
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
      experienceAnalysis: {
        userExperience,
        requiredExperience,
        experienceGap,
        score: Math.round(experienceScore),
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
      experienceScore: Math.round(experienceScore),
      locationScore: Math.round(locationScore),
      industryScore: Math.round(industryScore),
      qualityBonus: Math.round(qualityBonus),
      hasApplied,
      appliedAt,
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
      // Fetch user's own jobs and their applications
      const [jobsResult, applicationsResult] = await Promise.all([
        supabase
          .from('jobs')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('posted_date', { ascending: false }),
        supabase
          .from('job_applications')
          .select('job_id, applied_at')
          .eq('user_id', user.id)
      ]);

      if (jobsResult.error) throw jobsResult.error;
      if (applicationsResult.error) throw applicationsResult.error;

      const jobs = jobsResult.data || [];
      const applications = applicationsResult.data || [];

      const jobsWithScores = jobs.map(job => calculateJobMatch(job, resumeScore, applications));
      
      // Sort by match score
      jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
      
      setAllJobsWithScores(jobsWithScores);
      setMatchedJobs(jobsWithScores);

      toast({
        title: "Job Analysis Complete",
        description: `Analyzed ${jobs.length} job listings. Found ${applications.length} previous applications.`,
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

  const handleJobApplication = async (jobId: string, externalUrl?: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_id: jobId,
          external_application_url: externalUrl
        });

      if (error) throw error;

      // Refresh job data to update application status
      if (selectedResume) {
        analyzeAllJobs(selectedResume);
      }

      toast({
        title: "Application Tracked",
        description: "Successfully recorded your job application.",
      });

      return true;
    } catch (error) {
      console.error('Error tracking application:', error);
      toast({
        title: "Error",
        description: "Failed to track application. You can still apply to the job.",
        variant: "destructive",
      });
      return false;
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
    handleJobApplication,
    reanalyzeJobs: () => selectedResume && analyzeAllJobs(selectedResume)
  };
}
