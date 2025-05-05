
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MainNavigation } from '@/components/resume/MainNavigation';
import { useBlogCategories } from '@/hooks/useBlogCategories';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { LegalFooter } from '@/components/layout/LegalFooter';

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
    <div className="flex min-h-screen flex-col overflow-x-hidden w-full">
      <MainNavigation />
      
      <div className="container px-4 py-6 sm:py-8 flex-1 overflow-hidden">
        {/* Mobile sidebar toggle */}
        {isMobile && (
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex items-center mb-4 text-primary"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            <Menu className="h-5 w-5 mr-2" />
            <span>Menu</span>
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar - conditionally shown on mobile */}
          {/* Mobile sidebar overlay */}
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
          
          {/* Sidebar content */}
          <div 
            className={`${
              isMobile ? 
                sidebarOpen ? 
                  "fixed left-0 top-0 h-full w-[85%] max-w-[300px] z-40 transform translate-x-0 transition-transform duration-300 ease-in-out" : 
                  "fixed left-0 top-0 h-full w-[85%] max-w-[300px] z-40 transform -translate-x-full transition-transform duration-300 ease-in-out" : 
                "relative"
            } md:block md:col-span-1 md:transform-none md:static md:z-auto`}
          >
            <div className="bg-background md:bg-transparent h-full p-4 md:p-0 overflow-y-auto border-r md:border-r-0 border-gray-200 dark:border-gray-800 shadow-lg md:shadow-none">
              {isMobile && (
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Blog Navigation</h3>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
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
          <div className="md:col-span-3 overflow-x-hidden">
            {title && (
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
                <Separator className="my-4" />
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
      <LegalFooter />
    </div>
  );
}
