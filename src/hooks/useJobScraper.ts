
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface JobScrapingParams {
  query?: string;
  location?: string;
  employment_types?: 'FULLTIME' | 'PARTTIME' | 'CONTRACTOR' | 'INTERN';
  job_requirements?: string;
  num_pages?: number;
  date_posted?: 'today' | '3days' | 'week' | 'month';
  user_id?: string;
}

interface UserScrapeData {
  lastScrapeTime: string;
  loading: boolean;
}

// Store per-user scrape data
const userScrapeCache = new Map<string, UserScrapeData>();

export function useJobScraper() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get user-specific data from cache or initialize
  const getUserData = (): UserScrapeData => {
    if (!user?.id) return { lastScrapeTime: '', loading: false };
    
    if (!userScrapeCache.has(user.id)) {
      // Try to get from localStorage for persistence across sessions
      const stored = localStorage.getItem(`job_scrape_${user.id}`);
      const data = stored ? JSON.parse(stored) : { lastScrapeTime: '', loading: false };
      userScrapeCache.set(user.id, data);
    }
    
    return userScrapeCache.get(user.id)!;
  };

  const setUserData = (data: Partial<UserScrapeData>) => {
    if (!user?.id) return;
    
    const currentData = getUserData();
    const newData = { ...currentData, ...data };
    userScrapeCache.set(user.id, newData);
    
    // Persist to localStorage
    localStorage.setItem(`job_scrape_${user.id}`, JSON.stringify(newData));
  };

  const [loading, setLoading] = useState(getUserData().loading);
  const lastScrapeTime = getUserData().lastScrapeTime;

  const scrapeJobs = async (params: JobScrapingParams) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to fetch jobs.",
        variant: "destructive",
      });
      return;
    }

    // Check user-specific cooldown
    if (lastScrapeTime) {
      const tenHoursAgo = new Date(Date.now() - 10 * 60 * 60 * 1000);
      if (new Date(lastScrapeTime) > tenHoursAgo) {
        const hoursLeft = Math.ceil((new Date(lastScrapeTime).getTime() + (10 * 60 * 60 * 1000) - Date.now()) / (60 * 60 * 1000));
        toast({
          title: "Please Wait",
          description: `You can fetch jobs again in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}`,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    setUserData({ loading: true });

    try {
      const { data, error } = await supabase.functions.invoke('scrape-jobs', {
        body: {
          ...params,
          user_id: user.id
        }
      });

      if (error) throw error;

      const currentTime = new Date().toISOString();
      setUserData({ 
        lastScrapeTime: currentTime,
        loading: false 
      });

      const jobCount = data?.count || 0;
      const totalScraped = data?.totalScraped || 0;
      const duplicatesFiltered = data?.duplicatesFiltered || 0;

      toast({
        title: "Jobs Fetched Successfully!",
        description: `Found ${jobCount} new jobs (${totalScraped} total, ${duplicatesFiltered} duplicates filtered)`,
      });

      return data;
    } catch (error) {
      console.error('Job scraping error:', error);
      setUserData({ loading: false });
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch jobs",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    scrapeJobs,
    loading,
    lastScrapeTime
  };
}
