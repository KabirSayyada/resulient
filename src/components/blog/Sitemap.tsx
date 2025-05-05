
import { useEffect, useState } from 'react';
import { generateSitemap } from '@/utils/sitemapGenerator';

export function Sitemap() {
  const [sitemap, setSitemap] = useState<string>('');

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const sitemapContent = await generateSitemap();
        setSitemap(sitemapContent);
      } catch (error) {
        console.error('Error generating sitemap:', error);
      }
    };

    fetchSitemap();
  }, []);

  // Set XML Content-Type and serve the XML content
  useEffect(() => {
    if (sitemap) {
      // Set proper XML content type
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Type');
      meta.setAttribute('content', 'text/xml; charset=UTF-8');
      document.head.appendChild(meta);
    }
  }, [sitemap]);

  if (!sitemap) {
    return null;
  }

  return <pre dangerouslySetInnerHTML={{ __html: sitemap }} />;
}
