
import { useEffect, useState } from 'react';
import { BlogLayout } from '@/components/blog/BlogLayout';
import { BlogInitialization } from '@/components/blog/BlogAdmin/BlogInitialization';
import { BlogAdminForm } from '@/components/blog/BlogAdminForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { InitializeBlogCategories } from '@/components/blog/InitializeBlogCategories';
import { CreateNewBlogPosts } from '@/components/blog/CreateNewBlogPosts';
import { Sitemap } from '@/components/blog/Sitemap';
import { CreateEnhancedBlogPosts } from '@/components/blog/CreateEnhancedBlogPosts';

export default function BlogAdmin() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('new-post');

  // For rendering the title based on the active tab
  const getTabTitle = () => {
    switch (activeTab) {
      case 'new-post':
        return 'Create New Post';
      case 'initialize':
        return 'Initialize Blog';
      case 'init-categories':
        return 'Initialize Categories';
      case 'create-posts':
        return 'Create Demo Posts';
      case 'enhanced-posts':
        return 'Create Enhanced Posts';
      case 'sitemap':
        return 'Generate Sitemap';
      default:
        return 'Blog Admin';
    }
  };

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <Helmet>
        <title>Blog Admin | Resulient</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <BlogLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Blog Administration</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-6">
              <TabsTrigger value="new-post">New Post</TabsTrigger>
              <TabsTrigger value="initialize">Initialize</TabsTrigger>
              <TabsTrigger value="init-categories">Categories</TabsTrigger>
              <TabsTrigger value="create-posts">Demo Posts</TabsTrigger>
              <TabsTrigger value="enhanced-posts">Enhanced Posts</TabsTrigger>
              <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
            </TabsList>
            
            <h2 className="text-2xl font-semibold mb-4">{getTabTitle()}</h2>
            
            <TabsContent value="new-post">
              <BlogAdminForm />
            </TabsContent>
            
            <TabsContent value="initialize">
              <BlogInitialization />
            </TabsContent>
            
            <TabsContent value="init-categories">
              <InitializeBlogCategories />
            </TabsContent>
            
            <TabsContent value="create-posts">
              <CreateNewBlogPosts />
            </TabsContent>
            
            <TabsContent value="enhanced-posts">
              <CreateEnhancedBlogPosts />
            </TabsContent>
            
            <TabsContent value="sitemap">
              <Sitemap />
            </TabsContent>
          </Tabs>
        </div>
      </BlogLayout>
    </>
  );
}
