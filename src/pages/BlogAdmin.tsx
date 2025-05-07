
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BlogLayout } from '@/components/blog/BlogLayout';
import { CreateNewBlogPosts } from '@/components/blog/CreateNewBlogPosts';
import { CreateEnhancedBlogPosts } from '@/components/blog/CreateEnhancedBlogPosts';
import { BlogAdminForm } from '@/components/blog/BlogAdminForm';
import { useBlogAdmin } from '@/hooks/useBlogAdmin';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Navigate } from 'react-router-dom';
import { LucideHeading1, FileText, FilePlus2, FileEdit, List } from 'lucide-react';

export default function BlogAdmin() {
  const { user } = useAuth();
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const { getAllPosts } = useBlogAdmin();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (user) {
        setLoading(true);
        const allPosts = await getAllPosts();
        setPosts(allPosts);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, getAllPosts]);

  if (!user) {
    return <Navigate to="/blog" />;
  }

  return (
    <BlogLayout>
      <div className="container max-w-5xl py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <LucideHeading1 className="h-8 w-8 text-primary" />
              Blog Administration
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage blog content, create new posts, and monitor performance
            </p>
          </div>
          <Button 
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="w-full md:w-auto flex items-center gap-2"
          >
            {showNewPostForm ? <FileEdit className="h-4 w-4" /> : <FilePlus2 className="h-4 w-4" />}
            {showNewPostForm ? "Edit Existing Posts" : "Write New Post"}
          </Button>
        </div>

        <Tabs defaultValue="content-creation" className="space-y-6">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="content-creation" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Content Creation</span>
            </TabsTrigger>
            <TabsTrigger value="blog-posts" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Your Posts</span>
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{posts.length}</span>
            </TabsTrigger>
            <TabsTrigger value="new-post" className="flex items-center gap-2">
              <FilePlus2 className="h-4 w-4" />
              <span className="hidden sm:inline">New Post</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content-creation" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CreateEnhancedBlogPosts />
              <CreateNewBlogPosts />
            </div>
          </TabsContent>
          
          <TabsContent value="blog-posts">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {post.published_at ? (
                            <span className="text-green-600 dark:text-green-400">Published: {new Date(post.published_at).toLocaleString()}</span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400">Draft</span>
                          )}
                          {post.category && <span className="mx-2">•</span>}
                          {post.category && <span>{post.category}</span>}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">View</a>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowNewPostForm(true)}>
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg border-dashed">
                <h3 className="font-medium text-lg mb-2">No Posts Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first blog post or use the content creation tools</p>
                <Button onClick={() => setShowNewPostForm(true)}>Create Your First Post</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="new-post">
            <BlogAdminForm />
          </TabsContent>
        </Tabs>
      </div>
    </BlogLayout>
  );
}
