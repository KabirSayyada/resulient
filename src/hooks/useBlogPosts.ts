
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
        
        // Use a join with profiles to get author information
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles:author_id (
              first_name,
              last_name,
              avatar_url
            )
          `)
          .not('published_at', 'is', null) // Fixed: Using not() instead of is()
          .order('published_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Process the joined data to flatten the author information
        const processedPosts = data.map(post => {
          // Calculate reading time for each post
          const readingTime = calculateReadingTime(post.content);
          
          // Extract profile info if it exists
          const authorProfile = post.profiles || {};
          
          // Type assertion to access nested properties safely
          const typedProfile = authorProfile as { 
            first_name?: string | null, 
            last_name?: string | null, 
            avatar_url?: string | null 
          };
          
          return {
            ...post,
            reading_time: readingTime,
            author_first_name: typedProfile.first_name || null,
            author_last_name: typedProfile.last_name || null,
            author_avatar_url: typedProfile.avatar_url || null,
            // Remove the profiles object as we've extracted what we need
            profiles: undefined
          };
        }) as BlogPost[];
        
        setPosts(processedPosts);
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
        
        // Use a join with profiles to get author information
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles:author_id (
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('slug', slug)
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Process the post data to flatten the author information
          const authorProfile = data.profiles || {};
          
          // Type assertion to access nested properties safely
          const typedProfile = authorProfile as { 
            first_name?: string | null, 
            last_name?: string | null, 
            avatar_url?: string | null 
          };
          
          // Calculate reading time
          const readingTime = calculateReadingTime(data.content);
          
          const processedPost = {
            ...data,
            reading_time: readingTime,
            author_first_name: typedProfile.first_name || null,
            author_last_name: typedProfile.last_name || null,
            author_avatar_url: typedProfile.avatar_url || null,
            // Remove the profiles object as we've extracted what we need
            profiles: undefined
          } as BlogPost;
          
          setPost(processedPost);
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
        
        // Use a join with profiles to get author information
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles:author_id (
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('category', categorySlug)
          .not('published_at', 'is', null) // Fixed: Using not() instead of is()
          .order('published_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Process the joined data to flatten the author information
        const processedPosts = data.map(post => {
          // Calculate reading time for each post
          const readingTime = calculateReadingTime(post.content);
          
          // Extract profile info if it exists
          const authorProfile = post.profiles || {};
          
          // Type assertion to access nested properties safely
          const typedProfile = authorProfile as { 
            first_name?: string | null, 
            last_name?: string | null, 
            avatar_url?: string | null 
          };
          
          return {
            ...post,
            reading_time: readingTime,
            author_first_name: typedProfile.first_name || null,
            author_last_name: typedProfile.last_name || null,
            author_avatar_url: typedProfile.avatar_url || null,
            // Remove the profiles object as we've extracted what we need
            profiles: undefined
          };
        }) as BlogPost[];
        
        setPosts(processedPosts);
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
