
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
}

interface UserResumeData {
  skills: string[];
  industryExperience: string[];
  yearsOfExperience: number;
  location?: string;
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
    
    // Calculate skills match
    const skillMatches = resumeSkills.filter(skill => 
      jobText.includes(skill.toLowerCase())
    );
    const skillsScore = Math.min(35, (skillMatches.length / Math.max(resumeSkills.length, 5)) * 35);
    
    // Calculate experience match
    const experienceScore = Math.min(25, (resumeData.experience_duration / 100) * 25);
    
    // Calculate industry match
    const industryScore = jobText.includes(resumeData.industry.toLowerCase()) ? 20 : 5;
    
    // Calculate location match (basic)
    const locationScore = job.location.toLowerCase().includes('remote') ? 10 : 5;
    
    // Quality bonus based on overall resume score
    const qualityBonus = Math.min(10, (resumeData.overall_score / 100) * 10);
    
    const totalScore = skillsScore + experienceScore + industryScore + locationScore + qualityBonus;
    
    const matchReasons: string[] = [];
    if (skillMatches.length > 0) {
      matchReasons.push(`${skillMatches.length} matching skills found`);
    }
    if (resumeData.experience_duration >= 50) {
      matchReasons.push('Strong experience background');
    }
    if (industryScore > 10) {
      matchReasons.push(`${resumeData.industry} industry experience`);
    }
    if (resumeData.overall_score >= 80) {
      matchReasons.push('High-quality resume profile');
    }

    return {
      job,
      matchScore: Math.round(totalScore),
      matchReasons,
      keywordMatches: skillMatches,
      skillsScore,
      experienceScore,
      locationScore,
      industryScore,
      qualityBonus
    };
  };

  const analyzeAllJobs = async (resumeScore: ResumeScoreRecord) => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch ALL jobs for comprehensive matching
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('posted_date', { ascending: false });

      if (error) throw error;

      const jobsWithScores = (jobs || []).map(job => calculateJobMatch(job, resumeScore));
      
      // Sort by match score
      jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
      
      setAllJobsWithScores(jobsWithScores);
      
      // Filter for strong matches (30+ score) for the "My Matches" tab
      const strongMatches = jobsWithScores.filter(match => match.matchScore >= 30);
      setMatchedJobs(strongMatches);

      toast({
        title: "Job Analysis Complete",
        description: `Found ${strongMatches.length} strong matches out of ${jobs?.length || 0} total jobs.`,
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
