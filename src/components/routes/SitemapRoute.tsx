
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function SitemapRoute() {
  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        // Call the Supabase edge function to get the sitemap
        const { data, error } = await supabase.functions.invoke('sitemap');
        
        if (error) {
          console.error('Error fetching sitemap:', error);
          return;
        }
        
        // Set the proper content type for XML
        document.querySelector('html')?.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        
        // Replace the entire document with the sitemap XML
        document.documentElement.innerHTML = data;
        document.contentType = 'text/xml';
      } catch (error) {
        console.error('Error generating sitemap:', error);
      }
    };

    fetchSitemap();
  }, []);

  return null;
}
