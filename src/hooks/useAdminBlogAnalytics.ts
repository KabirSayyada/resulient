import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type DateRange = {
  from: Date;
  to: Date;
};

type AnalyticsFilters = {
  dateRange?: DateRange;
  postId?: string;
  category?: string;
  refetchTrigger?: number; 
};

export function useAdminBlogAnalytics(filters: AnalyticsFilters = {}) {
  const [pageViews, setPageViews] = useState<number>(0);
  const [uniqueVisitors, setUniqueVisitors] = useState<number>(0);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);
  const [conversionEvents, setConversionEvents] = useState<any[]>([]);
  const [timeOnPageAvg, setTimeOnPageAvg] = useState<number>(0);
  const [scrollDepthAvg, setScrollDepthAvg] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  // Use a ref to track if we've already shown an error toast
  const hasShownErrorToast = useRef(false);
  
  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);
  
  // Keep track of the active fetch operation
  const fetchingRef = useRef(false);

  useEffect(() => {
    // Reset the error toast flag when filters change
    hasShownErrorToast.current = false;
    
    // Set isMounted to true when the hook is first used
    isMounted.current = true;
    
    // Clean up function to set isMounted to false when the component unmounts
    return () => {
      isMounted.current = false;
    };
  }, [filters]);

  useEffect(() => {
    // Create an abort controller to cancel fetch requests if needed
    const abortController = new AbortController();
    
    const fetchAnalytics = async () => {
      // Prevent multiple concurrent fetches
      if (fetchingRef.current) return;
      
      fetchingRef.current = true;
      
      try {
        if (!isMounted.current) return;
        
        setIsLoading(true);
        setError(null);
        
        // Build date filter
        let fromDate = '';
        let toDate = '';
        
        if (filters.dateRange) {
          fromDate = filters.dateRange.from.toISOString();
          toDate = filters.dateRange.to.toISOString();
        }
        
        // Fetch page views
        let pageViewsQuery = supabase
          .from('blog_analytics')
          .select('*', { count: 'exact' });
          
        if (fromDate && toDate) {
          pageViewsQuery = pageViewsQuery.gte('visit_timestamp', fromDate).lte('visit_timestamp', toDate);
        }
        
        if (filters.postId) {
          pageViewsQuery = pageViewsQuery.eq('post_id', filters.postId);
        }
        
        const { count: totalViews, error: viewsError } = await pageViewsQuery;
        
        if (viewsError) throw viewsError;
        
        // Fetch unique visitors - count distinct visitor_ids
        let uniqueVisitorsQuery = supabase
          .from('blog_analytics')
          .select('visitor_id');
          
        if (fromDate && toDate) {
          uniqueVisitorsQuery = uniqueVisitorsQuery.gte('visit_timestamp', fromDate).lte('visit_timestamp', toDate);
        }
        
        if (filters.postId) {
          uniqueVisitorsQuery = uniqueVisitorsQuery.eq('post_id', filters.postId);
        }
        
        const { data: visitorData, error: uniqueError } = await uniqueVisitorsQuery;
        
        if (uniqueError) throw uniqueError;
        
        // Count unique visitor IDs
        const uniqueVisitorIds = new Set();
        visitorData?.forEach(record => {
          if (record.visitor_id) {
            uniqueVisitorIds.add(record.visitor_id);
          }
        });
        
        // Fetch blog posts first
        const { data: postsData, error: postsError } = await supabase
          .from('blog_posts')
          .select(`
            id,
            title,
            slug,
            category
          `)
          .order('created_at', { ascending: false });
        
        if (postsError) throw postsError;
        
        // Get analytics counts for each post in a single efficient query
        const postCounts = await Promise.all(
          (postsData || []).map(async (post) => {
            const { count, error } = await supabase
              .from('blog_analytics')
              .select('*', { count: 'exact' })
              .eq('post_id', post.id);
              
            if (error) {
              console.error(`Error fetching count for post ${post.id}:`, error);
              return { ...post, count: 0 };
            }
            
            return {
              id: post.id,
              title: post.title,
              slug: post.slug,
              category: post.category || 'Uncategorized',
              count: count || 0
            };
          })
        );
        
        // Sort posts by view count
        const sortedPosts = postCounts
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        
        // Fetch interactions data (time on page, scroll depth)
        const { data: interactionsData, error: interactionsError } = await supabase
          .from('blog_user_interactions')
          .select('time_on_page, scroll_depth');
        
        if (interactionsError) throw interactionsError;
        
        // Calculate averages
        let totalTime = 0;
        let totalScroll = 0;
        let timeCount = 0;
        let scrollCount = 0;
        
        interactionsData?.forEach(interaction => {
          if (interaction.time_on_page) {
            totalTime += interaction.time_on_page;
            timeCount++;
          }
          if (interaction.scroll_depth) {
            totalScroll += interaction.scroll_depth;
            scrollCount++;
          }
        });
        
        const avgTime = timeCount > 0 ? Math.round(totalTime / timeCount) : 0;
        const avgScroll = scrollCount > 0 ? Math.round(totalScroll / scrollCount) : 0;
        
        // Fetch conversion events
        const { data: eventsData, error: eventsError } = await supabase
          .from('blog_conversion_events')
          .select(`
            id,
            event_type,
            event_timestamp,
            event_data,
            analytics_id
          `)
          .order('event_timestamp', { ascending: false })
          .limit(50);
        
        if (eventsError) throw eventsError;
        
        // For each conversion event, fetch the associated blog_analytics record
        const eventsWithAnalytics = await Promise.all(
          (eventsData || []).map(async (event) => {
            if (!event.analytics_id) {
              return { ...event, blog_analytics: null };
            }
            
            const { data, error } = await supabase
              .from('blog_analytics')
              .select('id, page_path, post_id')
              .eq('id', event.analytics_id)
              .single();
            
            return {
              ...event,
              blog_analytics: error ? null : data
            };
          })
        );
        
        // Update state only if component is still mounted
        if (isMounted.current) {
          setPageViews(totalViews || 0);
          setUniqueVisitors(uniqueVisitorIds.size || 0);
          setPopularPosts(sortedPosts || []);
          setTimeOnPageAvg(avgTime);
          setScrollDepthAvg(avgScroll);
          setConversionEvents(eventsWithAnalytics || []);
          setError(null);
          setIsLoading(false);
        }
        
      } catch (err) {
        console.error('Error fetching analytics:', err);
        
        if (isMounted.current) {
          setError(err as Error);
          setIsLoading(false);
          
          // Only show the error toast once
          if (!hasShownErrorToast.current) {
            toast({
              title: 'Error',
              description: 'Failed to fetch analytics data',
              variant: 'destructive',
            });
            hasShownErrorToast.current = true;
          }
        }
      } finally {
        // Reset the fetching flag
        fetchingRef.current = false;
      }
    };
    
    fetchAnalytics();
    
    // Clean up function
    return () => {
      abortController.abort();
    };
  }, [filters, toast]);

  return {
    pageViews,
    uniqueVisitors,
    popularPosts,
    conversionEvents,
    timeOnPageAvg,
    scrollDepthAvg,
    isLoading,
    error
  };
}
