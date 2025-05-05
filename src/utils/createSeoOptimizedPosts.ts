
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

      // Update the original blog_posts entry first to mark it as published
      // and update the reading_time, seo fields if needed
      const publishTime = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          published_at: publishTime,
          reading_time: readingTime,
          seo_title: post.seo_title || post.title,
          seo_description: post.seo_description || post.excerpt,
          seo_keywords: post.seo_keywords || post.tags?.join(', ') || null,
        })
        .eq('id', post.id);

      if (updateError) {
        console.error(`Error updating post ${post.id}: ${updateError.message}`);
        continue; // Skip to the next post
      }

      console.log(`Successfully published post ${post.id}`);
    }

    console.log(`Finished processing ${unpublishedPosts.length} posts.`);
  } catch (error: any) {
    console.error('Error creating SEO-optimized blog posts:', error);
  }
};
