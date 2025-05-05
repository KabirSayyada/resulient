
import { useState, useEffect } from 'react';
import { BlogLayout } from '@/components/blog/BlogLayout';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { useBlogAdmin } from '@/hooks/useBlogAdmin';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlogAdminForm } from '@/components/blog/BlogAdminForm';
import { BlogInitialization } from '@/components/blog/BlogAdmin/BlogInitialization';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, 
  MoreHorizontal, 
  PenSquare, 
  Trash2, 
  Eye, 
  Search,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function BlogAdmin() {
  const { user, loading, isAdmin } = useAuth();
  const { getAllPosts, deletePost, isLoading } = useBlogAdmin();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [showEditPostForm, setShowEditPostForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Check if user is an admin, redirect to blog if not
  if (!loading && (!user || !isAdmin())) {
    return <Navigate to="/blog" />;
  }
  
  // Fetch all posts on mount
  useEffect(() => {
    if (user && isAdmin()) {
      fetchPosts();
    }
  }, [user]);
  
  // Fetch all posts (including drafts)
  const fetchPosts = async () => {
    const fetchedPosts = await getAllPosts();
    setPosts(fetchedPosts);
  };
  
  // Filter posts based on search query
  const filteredPosts = posts.filter(post => {
    const searchLower = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.slug.toLowerCase().includes(searchLower) ||
      (post.category && post.category.toLowerCase().includes(searchLower))
    );
  });
  
  // Published posts
  const publishedPosts = filteredPosts.filter(
    post => post.published_at !== null
  );
  
  // Draft posts
  const draftPosts = filteredPosts.filter(
    post => post.published_at === null
  );
  
  // Handle post deletion
  const handleDeletePost = async () => {
    if (!selectedPost) return;
    
    const success = await deletePost(selectedPost.id);
    if (success) {
      setShowDeleteDialog(false);
      fetchPosts();
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <BlogLayout title="Blog Administration">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </div>
      </BlogLayout>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Blog Admin | Resulient</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <BlogLayout title="Blog Administration">
        {/* New Post Form */}
        {showNewPostForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => setShowNewPostForm(false)}
              className="mb-6"
            >
              Back to Posts
            </Button>
            <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
            <BlogAdminForm 
              onSuccess={() => {
                setShowNewPostForm(false);
                fetchPosts();
              }} 
            />
          </>
        ) : showEditPostForm && selectedPost ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditPostForm(false);
                setSelectedPost(null);
              }}
              className="mb-6"
            >
              Back to Posts
            </Button>
            <h2 className="text-2xl font-bold mb-6">Edit Post: {selectedPost.title}</h2>
            <BlogAdminForm 
              initialData={selectedPost}
              onSuccess={() => {
                setShowEditPostForm(false);
                setSelectedPost(null);
                fetchPosts();
              }} 
            />
          </>
        ) : (
          <>
            <Tabs defaultValue="posts" className="mb-6">
              <TabsList>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search posts..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button onClick={() => setShowNewPostForm(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Post
                      </Button>
                    </div>
                    
                    <Tabs defaultValue="all" className="mb-6">
                      <TabsList>
                        <TabsTrigger value="all">All Posts ({posts.length})</TabsTrigger>
                        <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
                        <TabsTrigger value="drafts">Drafts ({draftPosts.length})</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all">
                        <PostsTable 
                          posts={filteredPosts}
                          onEdit={(post) => {
                            setSelectedPost(post);
                            setShowEditPostForm(true);
                          }}
                          onDelete={(post) => {
                            setSelectedPost(post);
                            setShowDeleteDialog(true);
                          }}
                        />
                      </TabsContent>
                      
                      <TabsContent value="published">
                        <PostsTable 
                          posts={publishedPosts}
                          onEdit={(post) => {
                            setSelectedPost(post);
                            setShowEditPostForm(true);
                          }}
                          onDelete={(post) => {
                            setSelectedPost(post);
                            setShowDeleteDialog(true);
                          }}
                        />
                      </TabsContent>
                      
                      <TabsContent value="drafts">
                        <PostsTable 
                          posts={draftPosts}
                          onEdit={(post) => {
                            setSelectedPost(post);
                            setShowEditPostForm(true);
                          }}
                          onDelete={(post) => {
                            setSelectedPost(post);
                            setShowDeleteDialog(true);
                          }}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div>
                    <BlogInitialization />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="max-w-2xl">
                  <Card>
                    <CardHeader>
                      <CardTitle>Blog Settings</CardTitle>
                      <CardDescription>
                        Configure your blog settings and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Blog Initialization</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Initialize your blog with default categories and sample posts
                        </p>
                        <BlogInitialization />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedPost?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeletePost}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </BlogLayout>
    </>
  );
}

interface PostsTableProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
}

function PostsTable({ posts, onEdit, onDelete }: PostsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <FileText className="h-12 w-12 mb-2 opacity-50" />
                  <p>No posts found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium max-w-[300px] truncate">
                  {post.title}
                </TableCell>
                <TableCell>
                  {post.published_at ? (
                    <Badge>Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </TableCell>
                <TableCell>{post.category || '—'}</TableCell>
                <TableCell>
                  {post.published_at 
                    ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true }) 
                    : formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(post)}>
                        <PenSquare className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        disabled={!post.published_at}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(post)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
