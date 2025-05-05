
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
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
        
        // Fetch unique visitors - use count of distinct visitor_ids
        let uniqueVisitorsQuery = supabase
          .from('blog_analytics')
          .select('visitor_id', { count: 'exact' })
          .not('visitor_id', 'is', null);
          
        if (fromDate && toDate) {
          uniqueVisitorsQuery = uniqueVisitorsQuery.gte('visit_timestamp', fromDate).lte('visit_timestamp', toDate);
        }
        
        if (filters.postId) {
          uniqueVisitorsQuery = uniqueVisitorsQuery.eq('post_id', filters.postId);
        }
        
        // Count distinct visitor IDs (this query gets all records, but we'll count unique IDs in JS)
        const { data: visitorData, error: uniqueError } = await uniqueVisitorsQuery;
        
        if (uniqueError) throw uniqueError;
        
        // Count unique visitor IDs
        const uniqueVisitorIds = new Set();
        visitorData?.forEach(record => {
          if (record.visitor_id) {
            uniqueVisitorIds.add(record.visitor_id);
          }
        });
        
        // Fetch popular posts
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
        
        // Get analytics data for each post
        const popularPostsWithCounts = await Promise.all(
          (postsData || []).map(async (post) => {
            const { count, error } = await supabase
              .from('blog_analytics')
              .select('*', { count: 'exact' })
              .eq('post_id', post.id);
              
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
        const sortedPosts = popularPostsWithCounts
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        
        // Fetch average time on page and scroll depth
        const { data: interactionsData, error: interactionsError } = await supabase
          .from('blog_user_interactions')
          .select(`
            time_on_page,
            scroll_depth
          `);
        
        if (interactionsError) throw interactionsError;
        
        // Calculate averages safely
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
            analytics_id,
            blog_analytics:analytics_id(
              id,
              page_path,
              post_id
            )
          `)
          .order('event_timestamp', { ascending: false })
          .limit(50);
        
        if (eventsError) throw eventsError;
        
        // Update state with all fetched data
        setPageViews(totalViews || 0);
        setUniqueVisitors(uniqueVisitorIds.size || 0);
        setPopularPosts(sortedPosts || []);
        setTimeOnPageAvg(avgTime);
        setScrollDepthAvg(avgScroll);
        setConversionEvents(eventsData || []);
        
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err as Error);
        toast({
          title: 'Error',
          description: 'Failed to fetch analytics data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
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
