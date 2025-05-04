
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogCategory } from '@/types/blog';
import { useToast } from '@/components/ui/use-toast';

export function useBlogCategories() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('blog_categories')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setCategories(data as BlogCategory[]);
      } catch (err) {
        console.error('Error fetching blog categories:', err);
        setError(err as Error);
        toast({
          title: 'Error',
          description: 'Failed to fetch blog categories. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCategories();
  }, [toast]);

  return { categories, isLoading, error };
}

export function useBlogCategory(slug: string) {
  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    async function fetchCategory() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('blog_categories')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        setCategory(data as BlogCategory);
      } catch (err) {
        console.error('Error fetching blog category:', err);
        setError(err as Error);
        toast({
          title: 'Error',
          description: 'Failed to fetch blog category. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCategory();
  }, [slug, toast]);

  return { category, isLoading, error };
}
