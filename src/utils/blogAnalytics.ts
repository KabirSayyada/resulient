
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Generate a persistent visitor ID using localStorage
const getVisitorId = (): string => {
  const storageKey = 'blog_visitor_id';
  let visitorId = localStorage.getItem(storageKey);
  
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem(storageKey, visitorId);
  }
  
  return visitorId;
};

// Generate a session ID that persists for the current browser session
const getSessionId = (): string => {
  const storageKey = 'blog_session_id';
  let sessionId = sessionStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
};

// Track a page view
export const trackPageView = async (pagePath: string, postId?: string): Promise<string | null> => {
  try {
    // Basic visitor data
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const referrer = document.referrer || null;
    const userAgent = navigator.userAgent;
    
    // Create analytics entry
    const { data, error } = await supabase
      .from('blog_analytics')
      .insert({
        post_id: postId || null,
        page_path: pagePath,
        visitor_id: visitorId,
        session_id: sessionId,
        referrer,
        user_agent: userAgent,
        ip_address: null, // IP addresses are captured and anonymized on the server side
        is_unique: true, // We'll set this to true by default
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error tracking page view:', error);
      return null;
    }
    
    return data.id;
  } catch (err) {
    console.error('Exception tracking page view:', err);
    return null;
  }
};

// Track user interaction (time on page, scroll depth)
export const trackUserInteraction = async (
  analyticsId: string, 
  timeOnPage: number, 
  scrollDepth: number,
  interactions: any = {}
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blog_user_interactions')
      .insert({
        analytics_id: analyticsId,
        time_on_page: timeOnPage,
        scroll_depth: scrollDepth,
        interactions,
      });
    
    if (error) {
      console.error('Error tracking user interaction:', error);
    }
  } catch (err) {
    console.error('Exception tracking user interaction:', err);
  }
};

// Track conversion events (newsletter signup, share, etc.)
export const trackConversion = async (
  analyticsId: string,
  eventType: string,
  eventData: any = {}
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blog_conversion_events')
      .insert({
        analytics_id: analyticsId,
        event_type: eventType,
        event_data: eventData,
      });
    
    if (error) {
      console.error('Error tracking conversion event:', error);
    }
  } catch (err) {
    console.error('Exception tracking conversion event:', err);
  }
};

// Event types constants
export const EVENT_TYPES = {
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  SHARE: 'share',
  CTA_CLICK: 'cta_click',
  EXTERNAL_LINK_CLICK: 'external_link_click',
};
