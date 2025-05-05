
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackUserInteraction, EVENT_TYPES } from '@/utils/blogAnalytics';

export function useBlogAnalytics(postId?: string) {
  const location = useLocation();
  const [analyticsId, setAnalyticsId] = useState<string | null>(null);
  const startTime = useRef<number>(Date.now());
  const maxScrollPercent = useRef<number>(0);
  const isTracking = useRef<boolean>(false);

  // Track page view when the component mounts
  useEffect(() => {
    // Don't track if already tracking this view
    if (isTracking.current) return;
    
    isTracking.current = true;
    startTime.current = Date.now();
    maxScrollPercent.current = 0;
    
    const trackView = async () => {
      try {
        const id = await trackPageView(location.pathname, postId);
        setAnalyticsId(id);
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };
    
    trackView();
  
    // Reset tracking when unmounting
    return () => {
      isTracking.current = false;
    };
  }, [location.pathname, postId]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = 
        Math.max(
          document.body.scrollHeight, 
          document.body.offsetHeight, 
          document.documentElement.clientHeight, 
          document.documentElement.scrollHeight, 
          document.documentElement.offsetHeight
        ) - window.innerHeight;
      
      if (docHeight <= 0) return;
      
      const scrollPercent = Math.floor((scrollTop / docHeight) * 100);
      maxScrollPercent.current = Math.max(maxScrollPercent.current, scrollPercent);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Send user interaction data when the component unmounts or user leaves
  useEffect(() => {
    const recordInteraction = async () => {
      if (!analyticsId) return;
      
      try {
        const timeOnPage = Math.floor((Date.now() - startTime.current) / 1000); // in seconds
        await trackUserInteraction(analyticsId, timeOnPage, maxScrollPercent.current);
      } catch (error) {
        console.error('Error recording user interaction:', error);
      }
    };

    // Record data when user is about to leave
    window.addEventListener('beforeunload', recordInteraction);
    
    // Record data when unmounting
    return () => {
      window.removeEventListener('beforeunload', recordInteraction);
      if (analyticsId && isTracking.current) {
        recordInteraction();
      }
    };
  }, [analyticsId]);

  return { analyticsId, EVENT_TYPES };
}
