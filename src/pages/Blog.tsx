
import { BlogLayout } from '@/components/blog/BlogLayout';
import { BlogCard } from '@/components/blog/BlogCard';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { Search, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const { posts, isLoading, error } = useBlogPosts();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post => {
    const searchLower = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      (post.category && post.category.toLowerCase().includes(searchLower)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  });

  return (
    <>
      <Helmet>
        <title>Blog | Resulient - Resume Optimization & Career Resources</title>
        <meta name="description" content="Read the latest articles about resume optimization, job search strategies, career advice and industry insights from Resulient's experts." />
        <meta name="keywords" content="resume tips, career advice, job search, resume optimization, ATS-friendly resumes" />
        <meta property="og:title" content="Blog | Resulient - Resume Optimization & Career Resources" />
        <meta property="og:description" content="Read the latest articles about resume optimization, job search strategies, career advice and industry insights from Resulient's experts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://resulient.ai/blog" />
      </Helmet>

      <BlogLayout title="Latest Articles">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-8 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="h-10 w-10 mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4 max-w-md px-4">
                {searchQuery 
                  ? "No articles match your search criteria. Try different keywords."
                  : "We're preparing some great content for you. Check back soon for new articles!"}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        )}
      </BlogLayout>
    </>
  );
}
