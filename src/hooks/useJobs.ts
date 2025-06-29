
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Tables } from '@/integrations/supabase/types';

type Job = Tables<'jobs'>;

export interface JobFilters {
  search: string;
  location: string;
  jobType: string;
  salaryRange: string;
}

export function useJobs(filters?: JobFilters, userId?: string) {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate date for past 3 days
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      // Execute query - removed user_id filter since column doesn't exist
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .gte('posted_date', threeDaysAgo.toISOString())
        .order('posted_date', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Remove duplicates based on external_job_id and title+company combination
      const jobData = data || [];
      const uniqueJobs = jobData.filter((job: Job, index: number, arr: Job[]) => {
        // First check by external_job_id if it exists
        if (job.external_job_id) {
          return arr.findIndex((j: Job) => j.external_job_id === job.external_job_id) === index;
        }
        // Fallback to title + company combination
        return arr.findIndex((j: Job) => 
          j.title.toLowerCase() === job.title.toLowerCase() && 
          j.company.toLowerCase() === job.company.toLowerCase()
        ) === index;
      });

      setAllJobs(uniqueJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on filters
  const filteredJobs = useMemo(() => {
    if (!filters) return allJobs;

    return allJobs.filter((job: Job) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const jobTitle = job.title?.toLowerCase() || '';
        const jobCompany = job.company?.toLowerCase() || '';
        const jobDescription = job.description?.toLowerCase() || '';
        const jobTags = job.tags || [];
        
        const matchesSearch = 
          jobTitle.includes(searchLower) ||
          jobCompany.includes(searchLower) ||
          jobDescription.includes(searchLower) ||
          jobTags.some((tag: string) => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location) {
        const jobLocation = job.location?.toLowerCase() || '';
        if (filters.location === 'remote') {
          if (!jobLocation.includes('remote')) return false;
        } else {
          const locationMap: Record<string, string> = {
            'san-francisco': 'san francisco',
            'new-york': 'new york',
            'los-angeles': 'los angeles',
            'chicago': 'chicago',
            'seattle': 'seattle',
            'boston': 'boston',
            'austin': 'austin'
          };
          
          const targetLocation = locationMap[filters.location];
          if (targetLocation && !jobLocation.includes(targetLocation)) {
            return false;
          }
        }
      }

      // Job type filter
      if (filters.jobType && job.type !== filters.jobType) {
        return false;
      }

      // Salary range filter
      if (filters.salaryRange && job.salary) {
        const salaryText = job.salary.toLowerCase();
        const extractSalaryNumber = (text: string): number => {
          const numbers = text.match(/\d+,?\d*/g);
          if (numbers && numbers.length > 0) {
            return parseInt(numbers[0].replace(',', ''));
          }
          return 0;
        };

        const jobSalary = extractSalaryNumber(salaryText);
        
        switch (filters.salaryRange) {
          case '0-50000':
            if (jobSalary > 50000) return false;
            break;
          case '50000-80000':
            if (jobSalary < 50000 || jobSalary > 80000) return false;
            break;
          case '80000-120000':
            if (jobSalary < 80000 || jobSalary > 120000) return false;
            break;
          case '120000-150000':
            if (jobSalary < 120000 || jobSalary > 150000) return false;
            break;
          case '150000+':
            if (jobSalary < 150000) return false;
            break;
        }
      }

      return true;
    });
  }, [allJobs, filters]);

  useEffect(() => {
    fetchJobs();
  }, []); // Removed userId dependency since we're not using it

  return {
    jobs: filteredJobs,
    allJobs, // Always provide access to all jobs
    loading,
    error,
    refetch: fetchJobs,
    totalJobs: allJobs.length
  };
}
