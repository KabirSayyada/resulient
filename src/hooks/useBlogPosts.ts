
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import { useToast } from '@/components/ui/use-toast';
import { calculateReadingTime } from '@/utils/blogUtils';

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        
        // Use the published_blog_posts view to get posts with author info
        const { data, error } = await supabase
          .from('published_blog_posts')
          .select('*')
          .order('published_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Calculate reading time for each post
        const postsWithReadingTime = data.map(post => ({
          ...post,
          reading_time: calculateReadingTime(post.content)
        })) as BlogPost[];
        
        setPosts(postsWithReadingTime);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err as Error);
        toast({
          title: 'Error',
          description: 'Failed to fetch blog posts. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPosts();
  }, [toast]);

  return { posts, isLoading, error };
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    async function fetchPost() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('published_blog_posts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Calculate reading time
          const postWithReadingTime = {
            ...data,
            reading_time: calculateReadingTime(data.content)
          } as BlogPost;
          
          setPost(postWithReadingTime);
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err as Error);
        toast({
          title: 'Error',
          description: 'Failed to fetch blog post. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPost();
  }, [slug, toast]);

  return { post, isLoading, error };
}

export function useCategoryPosts(categorySlug: string) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!categorySlug) {
      setIsLoading(false);
      return;
    }

    async function fetchCategoryPosts() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('published_blog_posts')
          .select('*')
          .eq('category', categorySlug)
          .order('published_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Calculate reading time for each post
        const postsWithReadingTime = data.map(post => ({
          ...post,
          reading_time: calculateReadingTime(post.content)
        })) as BlogPost[];
        
        setPosts(postsWithReadingTime);
      } catch (err) {
        console.error('Error fetching category posts:', err);
        setError(err as Error);
        toast({
          title: 'Error',
          description: 'Failed to fetch category posts. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCategoryPosts();
  }, [categorySlug, toast]);

  return { posts, isLoading, error };
}
