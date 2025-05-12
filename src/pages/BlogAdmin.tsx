import { useState, useEffect } from 'react';
import { BlogLayout } from '@/components/blog/BlogLayout';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { useBlogAdmin } from '@/hooks/useBlogAdmin';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlogAdminForm } from '@/components/blog/BlogAdminForm';
import { CreateInterviewPrepPosts } from '@/components/blog/CreateInterviewPrepPosts';
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
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function BlogAdmin() {
  const { user, loading, isAdmin } = useAuth();
  
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
  
  // Check if user is an admin, redirect to blog if not
  if (!user || !isAdmin()) {
    return <Navigate to="/blog" />;
  }
  
  // Now that we've verified the user is an admin, we can safely use hooks
  const { getAllPosts, deletePost, isLoading } = useBlogAdmin();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [showEditPostForm, setShowEditPostForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); // Show 10 posts per page
  
  // Fetch all posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);
  
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
  
  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatePublished = publishedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const paginateDrafts = draftPosts.slice(indexOfFirstPost, indexOfLastPost);
  const paginateAll = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Calculate total pages
  const totalPagesAll = Math.ceil(filteredPosts.length / postsPerPage);
  const totalPagesPublished = Math.ceil(publishedPosts.length / postsPerPage);
  const totalPagesDrafts = Math.ceil(draftPosts.length / postsPerPage);
  
  // Handle post deletion
  const handleDeletePost = async () => {
    if (!selectedPost) return;
    
    const success = await deletePost(selectedPost.id);
    if (success) {
      setShowDeleteDialog(false);
      fetchPosts();
    }
  };
  
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
                    
                    <Tabs defaultValue="all" className="mb-6" onValueChange={() => setCurrentPage(1)}>
                      <TabsList>
                        <TabsTrigger value="all">All Posts ({posts.length})</TabsTrigger>
                        <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
                        <TabsTrigger value="drafts">Drafts ({draftPosts.length})</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all">
                        <PostsTable 
                          posts={paginateAll}
                          onEdit={(post) => {
                            setSelectedPost(post);
                            setShowEditPostForm(true);
                          }}
                          onDelete={(post) => {
                            setSelectedPost(post);
                            setShowDeleteDialog(true);
                          }}
                        />
                        
                        {totalPagesAll > 1 && (
                          <BlogPagination 
                            currentPage={currentPage}
                            totalPages={totalPagesAll}
                            onPageChange={paginate}
                          />
                        )}
                      </TabsContent>
                      
                      <TabsContent value="published">
                        <PostsTable 
                          posts={paginatePublished}
                          onEdit={(post) => {
                            setSelectedPost(post);
                            setShowEditPostForm(true);
                          }}
                          onDelete={(post) => {
                            setSelectedPost(post);
                            setShowDeleteDialog(true);
                          }}
                        />
                        
                        {totalPagesPublished > 1 && (
                          <BlogPagination 
                            currentPage={currentPage}
                            totalPages={totalPagesPublished}
                            onPageChange={paginate}
                          />
                        )}
                      </TabsContent>
                      
                      <TabsContent value="drafts">
                        <PostsTable 
                          posts={paginateDrafts}
                          onEdit={(post) => {
                            setSelectedPost(post);
                            setShowEditPostForm(true);
                          }}
                          onDelete={(post) => {
                            setSelectedPost(post);
                            setShowDeleteDialog(true);
                          }}
                        />
                        
                        {totalPagesDrafts > 1 && (
                          <BlogPagination 
                            currentPage={currentPage}
                            totalPages={totalPagesDrafts}
                            onPageChange={paginate}
                          />
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Create new blog content</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CreateInterviewPrepPosts />
                      </CardContent>
                    </Card>
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
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Interview Preparation Content</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Create professional interview preparation tips and advice posts
                        </p>
                        <CreateInterviewPrepPosts />
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

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    if (currentPage > 2) {
      pageNumbers.push(1);
    }
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      pageNumbers.push('ellipsis-start');
    }
    
    // Show pages around current page
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pageNumbers.push('ellipsis-end');
    }
    
    // Always show last page
    if (currentPage < totalPages - 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  return (
    <Pagination className="mt-4 mb-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }} 
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {getPageNumbers().map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <span className="px-4 py-2">...</span>
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={index}>
              <PaginationLink 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page as number);
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
