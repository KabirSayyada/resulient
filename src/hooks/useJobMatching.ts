
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
  skillsScore: number;
  experienceScore: number;
  locationScore: number;
  industryScore: number;
  qualityBonus: number;
}

interface UserResumeData {
  skills: string[];
  experience: any[];
  industryExperience: string[];
  yearsOfExperience: number;
  jobTitles: string[];
  location?: string;
}

interface UserScoreData {
  overallScore: number;
  industry: string;
  suggestedSkills: string[];
  percentile: number;
  experienceDuration: number;
}

export function useJobMatching() {
  const [matchedJobs, setMatchedJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Enhanced skill matching with fuzzy logic
  const normalizeSkill = (skill: string): string => {
    return skill.toLowerCase()
      .replace(/js|javascript/g, 'javascript')
      .replace(/reactjs/g, 'react')
      .replace(/nodejs/g, 'node')
      .replace(/typescript/g, 'ts')
      .replace(/postgresql/g, 'postgres')
      .replace(/mongodb/g, 'mongo')
      .trim();
  };

  const calculateSkillsMatch = (
    jobText: string, 
    userSkills: string[], 
    suggestedSkills: string[]
  ): { score: number; matches: string[]; reasons: string[] } => {
    const jobWords = jobText.toLowerCase().split(/\W+/).filter(word => word.length > 2);
    const normalizedJobText = jobText.toLowerCase();
    
    const directMatches = userSkills.filter(skill => 
      normalizedJobText.includes(normalizeSkill(skill))
    );
    
    // Check for skill gaps (skills job needs but user doesn't have)
    const skillGaps = suggestedSkills.filter(skill => 
      normalizedJobText.includes(normalizeSkill(skill)) && 
      !userSkills.some(userSkill => normalizeSkill(userSkill) === normalizeSkill(skill))
    );
    
    // Calculate score based on matches and penalize for gaps
    let skillsScore = 0;
    const reasons: string[] = [];
    
    if (directMatches.length > 0) {
      skillsScore = Math.min(35, (directMatches.length / Math.max(userSkills.length, 5)) * 35);
      reasons.push(`${directMatches.length} matching skills found`);
    }
    
    // Penalize for skill gaps but not too harshly
    if (skillGaps.length > 0 && skillGaps.length > directMatches.length) {
      skillsScore *= 0.7; // Reduce score by 30% if more gaps than matches
      reasons.push(`${skillGaps.length} skills to develop: ${skillGaps.slice(0, 3).join(', ')}`);
    }
    
    return {
      score: skillsScore,
      matches: directMatches,
      reasons
    };
  };

  const calculateExperienceMatch = (
    job: Job, 
    userExperience: any[], 
    userJobTitles: string[],
    yearsOfExperience: number
  ): { score: number; reasons: string[] } => {
    const jobText = `${job.title} ${job.description} ${job.requirements || ''}`.toLowerCase();
    const reasons: string[] = [];
    let experienceScore = 0;
    
    // Extract experience requirements from job text
    const experienceMatch = jobText.match(/(\d+)\+?\s*years?\s*(of\s*)?experience/i);
    const requiredYears = experienceMatch ? parseInt(experienceMatch[1]) : null;
    
    // Determine job level
    const isEntry = jobText.includes('entry') || jobText.includes('junior') || jobText.includes('associate');
    const isMid = jobText.includes('mid') || jobText.includes('intermediate') || !isEntry && !jobText.includes('senior');
    const isSenior = jobText.includes('senior') || jobText.includes('lead') || jobText.includes('principal');
    
    // Match experience level
    if (isEntry && yearsOfExperience <= 2) {
      experienceScore += 25;
      reasons.push('Perfect match for entry-level position');
    } else if (isMid && yearsOfExperience >= 2 && yearsOfExperience <= 5) {
      experienceScore += 25;
      reasons.push('Experience aligns with mid-level requirements');
    } else if (isSenior && yearsOfExperience >= 5) {
      experienceScore += 25;
      reasons.push('Senior-level experience matches role');
    } else if (requiredYears && yearsOfExperience >= requiredYears) {
      experienceScore += 20;
      reasons.push(`Meets ${requiredYears}+ years experience requirement`);
    }
    
    // Check for relevant job title matches
    const titleMatches = userJobTitles.filter(title => 
      jobText.includes(title.toLowerCase()) || 
      job.title.toLowerCase().includes(title.toLowerCase().split(' ')[0])
    );
    
    if (titleMatches.length > 0) {
      experienceScore += 10;
      reasons.push('Similar job title experience');
    }
    
    // Check for industry experience
    userExperience.forEach(exp => {
      if (exp.description && jobText.includes(exp.company?.toLowerCase() || '')) {
        experienceScore += 5;
        reasons.push('Relevant company/industry experience');
      }
    });
    
    return {
      score: Math.min(25, experienceScore),
      reasons
    };
  };

  const calculateIndustryMatch = (
    job: Job, 
    userIndustry: string, 
    userExperience: any[]
  ): { score: number; reasons: string[] } => {
    const jobText = `${job.title} ${job.description} ${job.company}`.toLowerCase();
    const reasons: string[] = [];
    let industryScore = 0;
    
    // Direct industry match
    if (userIndustry && jobText.includes(userIndustry.toLowerCase())) {
      industryScore += 15;
      reasons.push(`${userIndustry} industry experience`);
    }
    
    // Company type matching (startup, enterprise, etc.)
    const companyIndicators = userExperience.map(exp => exp.company).filter(Boolean);
    if (companyIndicators.length > 0) {
      industryScore += 5;
      reasons.push('Relevant company background');
    }
    
    return {
      score: Math.min(20, industryScore),
      reasons
    };
  };

  const calculateLocationMatch = (
    job: Job, 
    userLocation?: string
  ): { score: number; reasons: string[] } => {
    const jobLocation = job.location.toLowerCase();
    const reasons: string[] = [];
    let locationScore = 0;
    
    // Remote work preference
    if (jobLocation.includes('remote')) {
      locationScore += 10;
      reasons.push('Remote work available');
    }
    
    // Hybrid options
    if (jobLocation.includes('hybrid')) {
      locationScore += 8;
      reasons.push('Hybrid work option');
    }
    
    // Location proximity (basic implementation)
    if (userLocation && jobLocation.includes(userLocation.toLowerCase())) {
      locationScore += 10;
      reasons.push('Located in your area');
    }
    
    return {
      score: Math.min(10, locationScore),
      reasons
    };
  };

  const calculateQualityBonus = (
    overallScore: number, 
    percentile: number
  ): { score: number; reasons: string[] } => {
    const reasons: string[] = [];
    let qualityBonus = 0;
    
    // High-quality resume bonus
    if (overallScore >= 80) {
      qualityBonus += 8;
      reasons.push('Strong resume profile');
    } else if (overallScore >= 70) {
      qualityBonus += 5;
      reasons.push('Good resume quality');
    }
    
    // Percentile bonus
    if (percentile >= 90) {
      qualityBonus += 2;
      reasons.push('Top-tier candidate profile');
    }
    
    return {
      score: Math.min(10, qualityBonus),
      reasons
    };
  };

  const calculateJobMatch = (
    job: Job, 
    userData: UserResumeData, 
    scoreData: UserScoreData
  ): JobMatch => {
    const jobText = `${job.title} ${job.description} ${job.requirements || ''}`.toLowerCase();
    
    // Calculate individual scores
    const skillsMatch = calculateSkillsMatch(jobText, userData.skills, scoreData.suggestedSkills);
    const experienceMatch = calculateExperienceMatch(job, userData.experience, userData.jobTitles, userData.yearsOfExperience);
    const industryMatch = calculateIndustryMatch(job, scoreData.industry, userData.experience);
    const locationMatch = calculateLocationMatch(job, userData.location);
    const qualityBonus = calculateQualityBonus(scoreData.overallScore, scoreData.percentile);
    
    // Combine scores
    const totalScore = skillsMatch.score + experienceMatch.score + industryMatch.score + locationMatch.score + qualityBonus.score;
    
    // Combine reasons
    const allReasons = [
      ...skillsMatch.reasons,
      ...experienceMatch.reasons,
      ...industryMatch.reasons,
      ...locationMatch.reasons,
      ...qualityBonus.reasons
    ];
    
    return {
      job,
      matchScore: Math.round(totalScore),
      matchReasons: allReasons,
      keywordMatches: skillsMatch.matches,
      skillsScore: skillsMatch.score,
      experienceScore: experienceMatch.score,
      locationScore: locationMatch.score,
      industryScore: industryMatch.score,
      qualityBonus: qualityBonus.score
    };
  };

  const extractUserData = (resumeData: any, profile: any): UserResumeData => {
    const skills: string[] = [];
    const experience: any[] = [];
    const jobTitles: string[] = [];
    const industryExperience: string[] = [];
    let yearsOfExperience = 0;
    
    if (resumeData) {
      // Extract skills
      if (resumeData.skills) {
        skills.push(...resumeData.skills);
      }
      
      // Extract experience
      if (resumeData.workExperience) {
        experience.push(...resumeData.workExperience);
        
        // Calculate years of experience
        resumeData.workExperience.forEach((exp: any) => {
          if (exp.startDate && exp.endDate) {
            const start = new Date(exp.startDate);
            const end = exp.endDate === 'Present' ? new Date() : new Date(exp.endDate);
            yearsOfExperience += (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
          }
          
          if (exp.jobTitle) {
            jobTitles.push(exp.jobTitle);
          }
        });
      }
      
      // Extract education skills
      if (resumeData.education) {
        resumeData.education.forEach((edu: any) => {
          if (edu.field) {
            skills.push(edu.field);
          }
        });
      }
    }
    
    // Add profile job title
    if (profile?.job_title) {
      jobTitles.push(profile.job_title);
    }
    
    return {
      skills: [...new Set(skills)], // Remove duplicates
      experience,
      industryExperience,
      yearsOfExperience: Math.round(yearsOfExperience),
      jobTitles: [...new Set(jobTitles)],
      location: profile?.location
    };
  };

  const findMatchingJobs = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get user's resume data, profile, and latest score
      const [resumeResponse, profileResponse, scoreResponse, jobsResponse] = await Promise.all([
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
          .from('resume_scores')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('jobs')
          .select('*')
          .eq('is_active', true)
          .order('posted_date', { ascending: false })
          .limit(100)
      ]);

      if (jobsResponse.error) throw jobsResponse.error;

      const jobs = jobsResponse.data || [];
      const resumeData = resumeResponse.data?.resume_data as any;
      const profile = profileResponse.data;
      const latestScore = scoreResponse.data;

      if (!resumeData && !profile?.job_title && !latestScore) {
        toast({
          title: "No Profile Data",
          description: "Build your resume or complete your profile to get personalized job matches.",
          variant: "destructive",
        });
        return;
      }

      // Extract user data
      const userData = extractUserData(resumeData, profile);
      
      // Use score data if available, otherwise use defaults
      const scoreData: UserScoreData = {
        overallScore: latestScore?.overall_score || 50,
        industry: latestScore?.industry || 'Technology',
        suggestedSkills: latestScore?.suggested_skills || [],
        percentile: latestScore?.percentile || 50,
        experienceDuration: latestScore?.experience_duration || userData.yearsOfExperience
      };

      console.log('User data for matching:', userData);
      console.log('Score data for matching:', scoreData);

      // Calculate matches for all jobs with minimum threshold
      const jobMatches = jobs
        .map(job => calculateJobMatch(job, userData, scoreData))
        .filter(match => match.matchScore >= 30) // Only show meaningful matches
        .sort((a, b) => b.matchScore - a.matchScore);

      setMatchedJobs(jobMatches);

      if (jobMatches.length > 0) {
        toast({
          title: "Smart Job Matches Found!",
          description: `Found ${jobMatches.length} personalized job matches based on your profile and resume.`,
        });
      } else {
        toast({
          title: "No Strong Matches",
          description: "Consider updating your resume or profile to improve job matching accuracy.",
          variant: "destructive",
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
