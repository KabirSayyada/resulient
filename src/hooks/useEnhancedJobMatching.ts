import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { extractLocationFromResumeContent, formatLocationForDisplay } from '@/utils/resume/locationExtractor';
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

// Helper function to extract user location from resume
function extractUserLocationFromResume(resumeContent: string): string {
  try {
    // First try to parse as JSON (structured resume data)
    const resumeData = JSON.parse(resumeContent);
    
    // Try various possible location fields in structured data
    if (resumeData.personalInfo?.location) {
      return resumeData.personalInfo.location;
    } else if (resumeData.personalInfo?.city && resumeData.personalInfo?.state) {
      return `${resumeData.personalInfo.city}, ${resumeData.personalInfo.state}`;
    } else if (resumeData.contact?.location) {
      return resumeData.contact.location;
    } else if (resumeData.contact?.address) {
      return resumeData.contact.address;
    } else if (resumeData.location) {
      return resumeData.location;
    }
  } catch (error) {
    // If JSON parsing fails, treat as plain text and use location extractor
    console.log('Resume content is not JSON, using text extraction');
  }
  
  // Fallback to text-based location extraction
  const locationResult = extractLocationFromResumeContent(resumeContent);
  if (locationResult) {
    return formatLocationForDisplay(locationResult);
  }
  
  return 'United States'; // Default fallback
}

// Helper function to calculate location compatibility score
function calculateLocationScore(jobLocation: string, userLocation: string): number {
  if (!jobLocation || !userLocation) return 5; // Neutral score if location info missing
  
  const jobLoc = jobLocation.toLowerCase();
  const userLoc = userLocation.toLowerCase();
  
  // Remote jobs get high score regardless of user location
  if (jobLoc.includes('remote') || jobLoc.includes('work from home') || jobLoc.includes('anywhere')) {
    return 10;
  }
  
  // Exact location match
  if (jobLoc === userLoc) {
    return 10;
  }
  
  // City/state matching logic
  const jobParts = jobLoc.split(',').map(p => p.trim());
  const userParts = userLoc.split(',').map(p => p.trim());
  
  // Check if they share the same state (last part)
  if (jobParts.length > 1 && userParts.length > 1) {
    const jobState = jobParts[jobParts.length - 1];
    const userState = userParts[userParts.length - 1];
    
    if (jobState === userState) {
      // Same state, check city
      if (jobParts[0] === userParts[0]) {
        return 10; // Same city and state
      }
      return 7; // Same state, different city
    }
  }
  
  // Check for partial matches (city names, etc.)
  for (const jobPart of jobParts) {
    for (const userPart of userParts) {
      if (jobPart.includes(userPart) || userPart.includes(jobPart)) {
        return 6; // Partial match
      }
    }
  }
  
  return 3; // No clear match, but not zero to avoid completely filtering out
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
    
    // Extract user location from resume
    const userLocation = extractUserLocationFromResume(resumeData.resume_content);
    console.log(`User location extracted: ${userLocation}`);
    console.log(`Job location: ${job.location}`);
    
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
    
    // Enhanced location scoring (max 10 points) - now uses actual user location
    const locationScore = calculateLocationScore(job.location, userLocation);
    console.log(`Location score for job "${job.title}": ${locationScore} (Job: ${job.location}, User: ${userLocation})`);
    
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
    if (locationScore >= 7) {
      matchReasons.push(`Good location match with ${job.location}`);
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
      // Calculate cutoff date (3 days ago)
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      // Extract user location for better job filtering
      const userLocation = extractUserLocationFromResume(resumeScore.resume_content);
      console.log(`Analyzing jobs for user in location: ${userLocation}`);

      // Fetch user's own jobs and their applications, filtering out jobs older than 3 days
      const [jobsResult, applicationsResult] = await Promise.all([
        supabase
          .from('jobs')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .gte('posted_date', threeDaysAgo.toISOString())
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

      // Double-check client-side filtering for jobs older than 3 days
      const freshJobs = jobs.filter(job => {
        const jobDate = new Date(job.posted_date);
        return jobDate >= threeDaysAgo;
      });

      const jobsWithScores = freshJobs.map(job => calculateJobMatch(job, resumeScore, applications));
      
      // Sort by match score (location-aware scoring now included)
      jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
      
      setAllJobsWithScores(jobsWithScores);
      setMatchedJobs(jobsWithScores);

      toast({
        title: "Job Analysis Complete",
        description: `Analyzed ${freshJobs.length} fresh job listings (within 3 days) with location-based matching for ${userLocation}. Found ${applications.length} previous applications.`,
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
