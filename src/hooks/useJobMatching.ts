
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Job = Tables<'jobs'>;

export interface JobMatch {
  job: Job;
  matchScore: number;
  matchReasons: string[];
  keywordMatches: string[];
}

export function useJobMatching() {
  const [matchedJobs, setMatchedJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const calculateJobMatch = (job: Job, userSkills: string[], userExperience: string, userProfile: any): JobMatch => {
    let score = 0;
    const reasons: string[] = [];
    const keywordMatches: string[] = [];

    // Extract keywords from job title and description
    const jobText = `${job.title} ${job.description} ${job.requirements || ''}`.toLowerCase();
    const jobWords = jobText.split(/\W+/).filter(word => word.length > 2);

    // Skill matching (40% of score)
    const matchingSkills = userSkills.filter(skill => 
      jobText.includes(skill.toLowerCase())
    );
    
    if (matchingSkills.length > 0) {
      const skillScore = Math.min(40, (matchingSkills.length / userSkills.length) * 40);
      score += skillScore;
      keywordMatches.push(...matchingSkills);
      reasons.push(`${matchingSkills.length} matching skills: ${matchingSkills.slice(0, 3).join(', ')}`);
    }

    // Experience relevance (30% of score)
    if (userExperience) {
      const experienceWords = userExperience.toLowerCase().split(/\W+/);
      const commonWords = jobWords.filter(word => 
        experienceWords.includes(word) && 
        word.length > 3 &&
        !['experience', 'work', 'responsibilities', 'duties'].includes(word)
      );
      
      if (commonWords.length > 0) {
        const expScore = Math.min(30, (commonWords.length / 10) * 30);
        score += expScore;
        reasons.push(`Experience matches job requirements`);
      }
    }

    // Job type and level matching (20% of score)
    const userTitle = userProfile?.job_title?.toLowerCase() || '';
    const jobTitle = job.title.toLowerCase();
    
    if (userTitle && jobTitle.includes(userTitle.split(' ')[0])) {
      score += 20;
      reasons.push('Job title matches your current role');
    }

    // Location preference (10% of score)
    if (job.location.toLowerCase().includes('remote')) {
      score += 10;
      reasons.push('Remote work available');
    }

    return {
      job,
      matchScore: Math.round(score),
      matchReasons: reasons,
      keywordMatches: keywordMatches.slice(0, 5) // Limit to top 5 matches
    };
  };

  const findMatchingJobs = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get user's resume data and profile
      const [resumeResponse, profileResponse, jobsResponse] = await Promise.all([
        supabase
          .from('user_resume_data')
          .select('resume_data')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('jobs')
          .select('*')
          .eq('is_active', true)
          .order('posted_date', { ascending: false })
          .limit(50)
      ]);

      if (jobsResponse.error) throw jobsResponse.error;

      const jobs = jobsResponse.data || [];
      const resumeData = resumeResponse.data?.resume_data as any;
      const profile = profileResponse.data;

      if (!resumeData && !profile?.job_title) {
        toast({
          title: "No Resume Data",
          description: "Build or upload a resume to get personalized job matches.",
          variant: "destructive",
        });
        return;
      }

      // Extract skills and experience from resume data
      const userSkills: string[] = [];
      const userExperience: string[] = [];

      if (resumeData) {
        // Extract skills
        if (resumeData.skills) {
          userSkills.push(...resumeData.skills);
        }

        // Extract experience descriptions
        if (resumeData.workExperience) {
          resumeData.workExperience.forEach((exp: any) => {
            if (exp.description) {
              userExperience.push(exp.description);
            }
          });
        }
      }

      // Calculate matches for all jobs
      const jobMatches = jobs
        .map(job => calculateJobMatch(job, userSkills, userExperience.join(' '), profile))
        .filter(match => match.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);

      setMatchedJobs(jobMatches);

      if (jobMatches.length > 0) {
        toast({
          title: "Job Matches Found!",
          description: `Found ${jobMatches.length} jobs that match your profile.`,
        });
      }
    } catch (error) {
      console.error('Error finding job matches:', error);
      toast({
        title: "Error",
        description: "Failed to find job matches. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      findMatchingJobs();
    }
  }, [user]);

  return {
    matchedJobs,
    loading,
    refindMatches: findMatchingJobs
  };
}
