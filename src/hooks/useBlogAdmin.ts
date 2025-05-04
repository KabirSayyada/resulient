
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, BlogCategory } from '@/types/blog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useBlogAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: 'Not authorized',
        description: 'You must be logged in to create a post.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...post,
          author_id: user.id,
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Blog post created successfully.',
      });
      
      return data;
    } catch (err) {
      console.error('Error creating blog post:', err);
      toast({
        title: 'Error',
        description: 'Failed to create blog post. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePost = async (id: string, post: Partial<BlogPost>) => {
    if (!user) {
      toast({
        title: 'Not authorized',
        description: 'You must be logged in to update a post.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .eq('author_id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Blog post updated successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating blog post:', err);
      toast({
        title: 'Error',
        description: 'Failed to update blog post. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!user) {
      toast({
        title: 'Not authorized',
        description: 'You must be logged in to delete a post.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)
        .eq('author_id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting blog post:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete blog post. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (category: Omit<BlogCategory, 'id' | 'created_at'>) => {
    if (!user) {
      toast({
        title: 'Not authorized',
        description: 'You must be logged in to create a category.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('blog_categories')
        .insert(category)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Blog category created successfully.',
      });
      
      return data;
    } catch (err) {
      console.error('Error creating blog category:', err);
      toast({
        title: 'Error',
        description: 'Failed to create blog category. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id: string, category: Partial<BlogCategory>) => {
    if (!user) {
      toast({
        title: 'Not authorized',
        description: 'You must be logged in to update a category.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('blog_categories')
        .update(category)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Blog category updated successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating blog category:', err);
      toast({
        title: 'Error',
        description: 'Failed to update blog category. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) {
      toast({
        title: 'Not authorized',
        description: 'You must be logged in to delete a category.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Blog category deleted successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting blog category:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete blog category. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // For fetching all posts as an admin (including unpublished)
  const getAllPosts = async () => {
    if (!user) {
      toast({
        title: 'Not authorized',
        description: 'You must be logged in to view all posts.',
        variant: 'destructive',
      });
      return [];
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as BlogPost[];
    } catch (err) {
      console.error('Error fetching all blog posts:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch all blog posts. Please try again.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPost,
    updatePost,
    deletePost,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllPosts,
    isLoading
  };
}
