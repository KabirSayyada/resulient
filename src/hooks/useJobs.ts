
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

export function useJobs(filters?: JobFilters) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const { user } = useAuth();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get recent jobs (last 7 days) to show fresh opportunities
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .gte('posted_date', sevenDaysAgo.toISOString())
        .order('posted_date', { ascending: false })
        .limit(200); // Limit to keep response manageable

      if (fetchError) {
        throw fetchError;
      }

      setAllJobs(data || []);
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

    return allJobs.filter((job) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          (job.tags && job.tags.some(tag => tag.toLowerCase().includes(searchLower)));
        
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location) {
        if (filters.location === 'remote') {
          if (!job.location.toLowerCase().includes('remote')) return false;
        } else {
          const locationMap: { [key: string]: string } = {
            'san-francisco': 'san francisco',
            'new-york': 'new york',
            'los-angeles': 'los angeles',
            'chicago': 'chicago',
            'seattle': 'seattle',
            'boston': 'boston',
            'austin': 'austin'
          };
          
          const targetLocation = locationMap[filters.location];
          if (targetLocation && !job.location.toLowerCase().includes(targetLocation)) {
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
  }, []);

  // Update jobs when filters change
  useEffect(() => {
    setJobs(filteredJobs);
  }, [filteredJobs]);

  return {
    jobs: filteredJobs,
    loading,
    error,
    refetch: fetchJobs,
    totalJobs: allJobs.length
  };
}
