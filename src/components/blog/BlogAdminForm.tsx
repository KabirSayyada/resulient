
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/blog/RichTextEditor';
import { Checkbox } from '@/components/ui/checkbox';
import { BlogPost, BlogCategory } from '@/types/blog';
import { useBlogAdmin } from '@/hooks/useBlogAdmin';
import { useBlogCategories } from '@/hooks/useBlogCategories';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Separator } from '@/components/ui/separator';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type BlogFormData = Partial<BlogPost> & {
  publish: boolean;
};

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
      message: 'Slug must contain only lowercase letters, numbers, and hyphens' 
    }),
  excerpt: z.string().min(10, { message: 'Excerpt must be at least 10 characters' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters' }),
  featured_image: z.string().url({ message: 'Please enter a valid URL' }).optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  publish: z.boolean().optional(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
  seo_keywords: z.string().optional().nullable(),
});

interface BlogAdminFormProps {
  initialData?: BlogPost;
  onSuccess?: () => void;
}

export function BlogAdminForm({ initialData, onSuccess }: BlogAdminFormProps) {
  const { categories } = useBlogCategories();
  const { createPost, updatePost, isLoading } = useBlogAdmin();
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState('');
  
  // Set up form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      featured_image: initialData?.featured_image || '',
      category: initialData?.category || '',
      tags: initialData?.tags || [],
      publish: initialData?.published_at ? true : false,
      seo_title: initialData?.seo_title || '',
      seo_description: initialData?.seo_description || '',
      seo_keywords: initialData?.seo_keywords || '',
    },
  });
  
  // Auto-generate slug from title (only if slug is empty)
  useEffect(() => {
    const title = form.watch('title');
    const currentSlug = form.watch('slug');
    
    if (title && !currentSlug && !initialData) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      form.setValue('slug', newSlug);
    }
  }, [form.watch('title'), form]);
  
  // Add a tag
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    const currentTags = form.watch('tags') || [];
    if (!currentTags.includes(tagInput.trim())) {
      form.setValue('tags', [...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    const currentTags = form.watch('tags') || [];
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const postData: Partial<BlogPost> = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      featured_image: data.featured_image || null,
      category: data.category || null,
      tags: data.tags || [],
      published_at: data.publish ? new Date().toISOString() : null,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      seo_keywords: data.seo_keywords || null,
    };
    
    let success = false;
    
    if (initialData?.id) {
      // Update existing post
      success = await updatePost(initialData.id, postData);
    } else {
      // Create new post
      const result = await createPost(postData as any);
      success = !!result;
    }
    
    if (success) {
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/blog/admin');
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="content">
          <TabsList className="mb-6">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter post title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="your-post-slug" />
                    </FormControl>
                    <FormDescription>
                      This will be used in the URL: /blog/your-post-slug
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Brief summary of the post" 
                        className="resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <RichTextEditor 
                        value={field.value} 
                        onChange={field.onChange}
                        minHeight="500px"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="featured_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ''} 
                          placeholder="https://example.com/image.jpg" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ''} 
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.slug}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <Label>Tags</Label>
                <div className="flex items-center gap-2 mt-1.5 mb-3">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={addTag}
                  >
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {form.watch('tags')?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your post for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="seo_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ''} 
                          placeholder="Enter SEO title (optional)" 
                        />
                      </FormControl>
                      <FormDescription>
                        If left empty, the post title will be used
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="seo_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value || ''} 
                          placeholder="Enter meta description (optional)" 
                          className="resize-none"
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        If left empty, the post excerpt will be used
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="seo_keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Keywords</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ''} 
                          placeholder="keyword1, keyword2, keyword3" 
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated keywords for SEO
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-6" />
        
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="publish"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {initialData?.published_at ? 'Published' : 'Publish immediately'}
                  </FormLabel>
                  <FormDescription>
                    {initialData?.published_at 
                      ? 'This post is currently published'
                      : 'If unchecked, the post will be saved as a draft'}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/blog/admin')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'} Post
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
