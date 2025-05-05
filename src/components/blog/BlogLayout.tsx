
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MainNavigation } from '@/components/resume/MainNavigation';
import { useBlogCategories } from '@/hooks/useBlogCategories';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface BlogLayoutProps {
  children: ReactNode;
  title?: string;
}

export function BlogLayout({ children, title }: BlogLayoutProps) {
  const { categories, isLoading } = useBlogCategories();
  const { user, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Check if user is admin
  const userIsAdmin = isAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      
      <div className="container px-4 py-8 flex-1">
        {/* Mobile sidebar toggle */}
        {isMobile && (
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex items-center mb-4 text-primary"
          >
            <Menu className="h-5 w-5 mr-2" />
            <span>Menu</span>
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar - conditionally shown on mobile */}
          <div className={`${isMobile && !sidebarOpen ? 'hidden' : 'block'} md:col-span-1 z-10`}>
            <div className="sticky top-8 space-y-6 bg-background md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none shadow-lg md:shadow-none">
              {isMobile && (
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Blog Navigation</h3>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              )}
              
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
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
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
