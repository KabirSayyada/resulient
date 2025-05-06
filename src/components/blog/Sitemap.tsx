
import { useEffect, useState } from 'react';
import { generateSitemap } from '@/utils/sitemapGenerator';
import { Helmet } from 'react-helmet-async';

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

  if (!sitemap) {
    return null;
  }

  return (
    <>
      <Helmet>
        <meta httpEquiv="Content-Type" content="text/xml; charset=UTF-8" />
        <title>Sitemap - Resulient</title>
      </Helmet>
      <div style={{ display: 'none' }}>
        <pre dangerouslySetInnerHTML={{ __html: sitemap }} />
      </div>
      {/* This ensures proper rendering of XML content */}
      {typeof document !== 'undefined' && document.open('text/xml') && document.write(sitemap) && document.close()}
    </>
  );
}
