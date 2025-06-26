
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JobPosting, JobMatch } from "@/types/job";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface JobSearchFilters {
  location?: string;
  jobType?: string;
  workArrangement?: string;
  salaryMin?: number;
  salaryMax?: number;
  industry?: string;
  experienceLevel?: string;
  keywords?: string;
}

export function useJobSearch(filters: JobSearchFilters = {}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('job_postings')
        .select('*')
        .eq('is_active', true)
        .order('posted_at', { ascending: false })
        .limit(50);

      // Apply filters
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.jobType) {
        query = query.eq('job_type', filters.jobType);
      }
      if (filters.workArrangement) {
        query = query.eq('work_arrangement', filters.workArrangement);
      }
      if (filters.industry) {
        query = query.eq('industry', filters.industry);
      }
      if (filters.experienceLevel) {
        query = query.eq('experience_level', filters.experienceLevel);
      }
      if (filters.salaryMin) {
        query = query.gte('salary_min', filters.salaryMin);
      }
      if (filters.salaryMax) {
        query = query.lte('salary_max', filters.salaryMax);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredJobs = data || [];

      // Apply keyword filtering
      if (filters.keywords) {
        const keywords = filters.keywords.toLowerCase().split(' ');
        filteredJobs = filteredJobs.filter(job => 
          keywords.some(keyword => 
            job.title.toLowerCase().includes(keyword) ||
            job.description.toLowerCase().includes(keyword) ||
            (job.requirements && job.requirements.toLowerCase().includes(keyword))
          )
        );
      }

      setJobs(filteredJobs);

      // Fetch job matches if user is authenticated
      if (user && filteredJobs.length > 0) {
        const jobIds = filteredJobs.map(job => job.id);
        const { data: matches } = await supabase
          .from('job_matches')
          .select('*')
          .eq('user_id', user.id)
          .in('job_posting_id', jobIds)
          .order('match_score', { ascending: false });

        setJobMatches(matches || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      toast({
        title: "Error",
        description: "Failed to load job listings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getJobMatch = (jobId: string): JobMatch | undefined => {
    return jobMatches.find(match => match.job_posting_id === jobId);
  };

  const refreshJobs = () => {
    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  }, [user, JSON.stringify(filters)]);

  return {
    jobs,
    jobMatches,
    loading,
    error,
    refreshJobs,
    getJobMatch
  };
}
