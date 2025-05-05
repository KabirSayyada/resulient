
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
        
        // Fetch unique visitors
        let uniqueVisitorsQuery = supabase
          .from('blog_analytics')
          .select('visitor_id', { count: 'exact', head: true });
          
        // Use a separate query to filter and count distinct visitor IDs
        if (fromDate && toDate) {
          uniqueVisitorsQuery = uniqueVisitorsQuery.gte('visit_timestamp', fromDate).lte('visit_timestamp', toDate);
        }
        
        if (filters.postId) {
          uniqueVisitorsQuery = uniqueVisitorsQuery.eq('post_id', filters.postId);
        }
        
        const { count: totalUnique, error: uniqueError } = await uniqueVisitorsQuery;
        
        if (uniqueError) throw uniqueError;
        
        // Fetch popular posts
        const { data: postsData, error: postsError } = await supabase
          .from('blog_analytics')
          .select(`
            post_id,
            published_blog_posts!inner (
              id,
              title,
              slug,
              category
            )
          `)
          .filter('post_id', 'not.is', null);
          
        if (postsError) throw postsError;
        
        // Count views per post manually
        const postCounts: Record<string, { 
          count: number; 
          title: string; 
          slug: string;
          category: string;
        }> = {};
        
        postsData.forEach(item => {
          const postId = item.post_id as string;
          const post = item.published_blog_posts as any;
          
          if (!postCounts[postId]) {
            postCounts[postId] = { 
              count: 0, 
              title: post.title,
              slug: post.slug,
              category: post.category
            };
          }
          
          postCounts[postId].count++;
        });
        
        // Convert to array and sort
        const popularPostsData = Object.entries(postCounts).map(([id, data]) => ({
          id,
          ...data
        })).sort((a, b) => b.count - a.count).slice(0, 10);
        
        // Fetch average time on page and scroll depth
        const { data: interactionsData, error: interactionsError } = await supabase
          .from('blog_user_interactions')
          .select(`
            time_on_page,
            scroll_depth,
            analytics_id,
            blog_analytics!inner (id)
          `);
        
        if (interactionsError) throw interactionsError;
        
        // Calculate averages
        let totalTime = 0;
        let totalScroll = 0;
        let count = interactionsData.length;
        
        interactionsData.forEach(interaction => {
          if (interaction.time_on_page) totalTime += interaction.time_on_page;
          if (interaction.scroll_depth) totalScroll += interaction.scroll_depth;
        });
        
        const avgTime = count > 0 ? Math.round(totalTime / count) : 0;
        const avgScroll = count > 0 ? Math.round(totalScroll / count) : 0;
        
        // Fetch conversion events
        const { data: eventsData, error: eventsError } = await supabase
          .from('blog_conversion_events')
          .select(`
            id,
            event_type,
            event_timestamp,
            event_data,
            analytics_id,
            blog_analytics!inner (
              id,
              post_id,
              page_path
            )
          `)
          .order('event_timestamp', { ascending: false })
          .limit(50);
        
        if (eventsError) throw eventsError;
        
        // Update state with all fetched data
        setPageViews(totalViews || 0);
        setUniqueVisitors(totalUnique || 0);
        setPopularPosts(popularPostsData || []);
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
