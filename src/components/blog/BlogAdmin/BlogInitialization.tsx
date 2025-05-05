
import { InitializeBlogCategories } from '@/components/blog/InitializeBlogCategories';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlogPosts';

export function BlogInitialization() {
  const { posts, isLoading } = useBlogPosts();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Blog Management</CardTitle>
          <CardDescription>
            Manage your blog categories and create new posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoading && posts.length > 0 && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Blog Status</AlertTitle>
              <AlertDescription>
                You have {posts.length} published posts that are visible to search engines and visitors.
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-6">
            <InitializeBlogCategories />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
