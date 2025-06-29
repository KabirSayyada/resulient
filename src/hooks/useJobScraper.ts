
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface JobScrapingParams {
  query?: string;
  location?: string;
  employment_types?: 'FULLTIME' | 'PARTTIME' | 'CONTRACTOR' | 'INTERN';
  num_pages?: number;
  date_posted?: 'today' | '3days' | 'week' | 'month';
  user_id?: string;
}

export function useJobScraper() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const scrapeJobs = async (params: JobScrapingParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Starting user-specific job scraping with params:', params);

      const { data, error: functionError } = await supabase.functions.invoke('scrape-jobs', {
        body: {
          query: params.query || 'software engineer',
          location: params.location || 'United States',
          employment_types: params.employment_types || 'FULLTIME',
          num_pages: params.num_pages || 1,
          date_posted: params.date_posted || '3days',
          user_id: params.user_id // Pass user ID for personalized job storage
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      console.log('User-specific job scraping response:', data);

      toast({
        title: "Your Jobs Updated!",
        description: `Successfully found ${data.count} personalized jobs from the past 3 days.`,
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scrape jobs';
      console.error('Job scraping error:', err);
      setError(errorMessage);
      
      toast({
        title: "Scraping Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    scrapeJobs,
    loading,
    error,
    clearError
  };
}
