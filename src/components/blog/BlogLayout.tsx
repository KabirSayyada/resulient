
import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainNavigation } from '@/components/resume/MainNavigation';
import { useBlogCategories } from '@/hooks/useBlogCategories';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BlogLayoutProps {
  children: ReactNode;
  title?: string;
}

export function BlogLayout({ children, title }: BlogLayoutProps) {
  const { categories, isLoading } = useBlogCategories();
  const { user, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Check if user is admin using the isAdmin function
  const userIsAdmin = isAdmin();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      
      <div className="container px-4 py-8 flex-1">
        {/* Mobile sidebar toggle */}
        {isMobile && (
          <Button 
            variant="outline" 
            size="icon" 
            className="mb-4 md:hidden"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar - hidden on mobile unless toggled */}
          <div className={`${isMobile && !sidebarOpen ? 'hidden' : 'block'} md:col-span-1`}>
            <div className="sticky top-8 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Blog</h3>
                <Separator className="my-2" />
                <nav className="space-y-1">
                  <Link 
                    to="/blog" 
                    className="block px-2 py-1 hover:underline text-blue-600 dark:text-blue-400"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    All Articles
                  </Link>
                </nav>
              </div>
                
              <div>
                <h3 className="font-semibold text-lg mb-2">Categories</h3>
                <Separator className="my-2" />
                <ScrollArea className="h-[200px]">
                  <nav className="space-y-1">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-full mb-2" />
                      </>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/blog/category/${category.slug}`}
                          className="block px-2 py-1 hover:underline text-blue-600 dark:text-blue-400"
                          onClick={() => isMobile && setSidebarOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground px-2 py-1">
                        No categories yet
                      </p>
                    )}
                  </nav>
                </ScrollArea>
              </div>
                
              {/* Admin link (only visible to admin users) */}
              {userIsAdmin && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Admin</h3>
                  <Separator className="my-2" />
                  <nav className="space-y-1">
                    <Link 
                      to="/blog/admin" 
                      className="block px-2 py-1 hover:underline text-blue-600 dark:text-blue-400"
                      onClick={() => isMobile && setSidebarOpen(false)}
                    >
                      Manage Blog
                    </Link>
                  </nav>
                </div>
              )}
            </div>
          </div>
                
          {/* Main Content */}
          <div className="md:col-span-3">
            {title && (
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight break-words">{title}</h1>
                <Separator className="my-4" />
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
