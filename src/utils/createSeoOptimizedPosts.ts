
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";
import { calculateReadingTime } from "@/utils/blogUtils";

/**
 * Creates SEO-optimized blog posts by fetching data from a source,
 * generating slugs, and calculating reading times.
 */
export const createSeoOptimizedPosts = async () => {
  try {
    // Fetch blog posts from the 'blog_posts' table, including author information
    const { data: blogPosts, error: postsError } = await supabase
      .from('blog_posts')
      .select(`
        id,
        created_at,
        updated_at,
        title,
        slug,
        content,
        excerpt,
        category,
        tags,
        featured_image,
        author_id,
        published_at,
        seo_title,
        seo_description,
        seo_keywords,
        author:profiles (
          id,
          first_name,
          last_name,
          avatar_url,
          job_title
        )
      `)
      .order('created_at', { ascending: false });

    if (postsError) {
      throw new Error(`Error fetching blog posts: ${postsError.message}`);
    }

    if (!blogPosts) {
      console.warn('No blog posts found.');
      return;
    }

    // Filter out posts that are already published to the published_blog_posts view
    const unpublishedPosts = blogPosts.filter(post => !post.published_at);

    if (unpublishedPosts.length === 0) {
      console.log('No new blog posts to process.');
      return;
    }

    // Process each unpublished blog post
    for (const post of unpublishedPosts) {
      // Extract author information from the nested 'profiles' object
      const author = post.author ? post.author[0] : null;

      // Calculate reading time
      const readingTime = calculateReadingTime(post.content);

      // Construct the data object for the 'published_blog_posts' table
      const publishedPostData = {
        id: post.id,
        created_at: post.created_at,
        updated_at: post.updated_at,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags,
        featured_image: post.featured_image,
        author_id: post.author_id,
        author_first_name: author?.first_name || null,
        author_last_name: author?.last_name || null,
        author_avatar_url: author?.avatar_url || null,
        author_job_title: author?.job_title || null,
        reading_time: readingTime,
        published_at: post.published_at || new Date().toISOString(), // Set published_at to current time
        seo_title: post.seo_title || post.title,
        seo_description: post.seo_description || post.excerpt,
        seo_keywords: post.seo_keywords || post.tags?.join(', ') || null,
      };

      // Insert the processed post into the 'published_blog_posts' table
      const { error: insertError } = await supabase
        .from('published_blog_posts')
        .insert([publishedPostData]);

      if (insertError) {
        console.error(`Error inserting post ${post.id} into published_blog_posts:`, insertError);
        continue; // Skip to the next post
      }

      // Update the original 'blog_posts' table to mark the post as published
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ published_at: new Date().toISOString() })
        .eq('id', post.id);

      if (updateError) {
        console.error(`Error updating post ${post.id} in blog_posts:`, updateError);
      } else {
        console.log(`Successfully processed and published post ${post.id}`);
      }
    }
  } catch (error: any) {
    console.error('Error creating SEO-optimized blog posts:', error);
  }
};
