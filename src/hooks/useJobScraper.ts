
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface JobScrapingParams {
  query: string;
  location: string;
  employment_types?: string;
  num_pages?: number;
  date_posted?: string;
  user_id: string;
}

export function useJobScraper() {
  const [loading, setLoading] = useState(false);
  const [lastScrapeTime, setLastScrapeTime] = useState<string | null>(
    localStorage.getItem('lastJobScrapeTime')
  );
  const { toast } = useToast();

  const scrapeJobs = async (params: JobScrapingParams) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('scrape-jobs', {
        body: params
      });

      if (error) {
        throw error;
      }

      // Update last scrape time
      const now = new Date().toISOString();
      setLastScrapeTime(now);
      localStorage.setItem('lastJobScrapeTime', now);

      toast({
        title: "Jobs Scraped Successfully",
        description: `Found ${data?.jobCount || 0} new jobs matching your criteria.`,
      });

      return data;
    } catch (error) {
      console.error('Job scraping error:', error);
      toast({
        title: "Job Scraping Failed",
        description: "Failed to fetch new jobs. Please try again later.",
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
