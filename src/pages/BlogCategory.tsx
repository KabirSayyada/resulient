
import { useParams, Navigate, Link } from 'react-router-dom';
import { BlogLayout } from '@/components/blog/BlogLayout';
import { useCategoryPosts } from '@/hooks/useBlogPosts';
import { useBlogCategory } from '@/hooks/useBlogCategories';
import { BlogCard } from '@/components/blog/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function BlogCategory() {
  const { category } = useParams<{ category: string }>();
  const { posts, isLoading: postsLoading } = useCategoryPosts(category || '');
  const { category: categoryData, isLoading: categoryLoading } = useBlogCategory(category || '');

  if (!category) {
    return <Navigate to="/blog" />;
  }

  const isLoading = postsLoading || categoryLoading;

  return (
    <>
      <Helmet>
        <title>{categoryData ? `${categoryData.name} | Resulient Blog` : 'Category | Resulient Blog'}</title>
        <meta 
          name="description" 
          content={categoryData?.description || `Browse all articles in the ${category} category on Resulient's blog`} 
        />
        <meta property="og:title" content={categoryData ? `${categoryData.name} | Resulient Blog` : 'Category | Resulient Blog'} />
        <meta 
          property="og:description" 
          content={categoryData?.description || `Browse all articles in the ${category} category on Resulient's blog`} 
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://resulient.ai/blog/category/${category}`} />
      </Helmet>

      <BlogLayout title={categoryData ? categoryData.name : 'Category'}>
        <div className="mb-8">
          <Link to="/blog">
            <Button variant="ghost" className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to All Articles
            </Button>
          </Link>
          
          {categoryData?.description && (
            <p className="text-muted-foreground mt-2">
              {categoryData.description}
            </p>
          )}
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
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              There are no articles in this category yet. Check back soon!
            </p>
            <Button variant="outline" asChild>
              <Link to="/blog">
                Browse All Articles
              </Link>
            </Button>
          </div>
        )}
      </BlogLayout>
    </>
  );
}
