
import { createAllResumeEnhancedPosts } from './createResumeEnhancedPosts';
import { createAllJobSearchStrategyPosts } from './createJobSearchStrategyPosts';
import { createAllResumeTipsPosts } from './createResumeTipsPosts';

/**
 * Creates all enhanced blog posts including resume tips and job search strategy
 */
export async function createAllEnhancedBlogPosts(authorId: string) {
  try {
    // Create all resume tips posts (both existing and new)
    const resumeTipsCount = await createAllResumeTipsPosts(authorId);
    
    // Create all new enhanced resume tips posts
    const enhancedResumePostsCount = await createAllResumeEnhancedPosts(authorId);
    
    // Create all job search strategy posts
    const jobSearchPostsCount = await createAllJobSearchStrategyPosts(authorId);
    
    // Calculate total created posts
    const totalCreated = resumeTipsCount + enhancedResumePostsCount + jobSearchPostsCount;
    
    return totalCreated;
  } catch (error) {
    console.error('Error creating enhanced blog posts:', error);
    throw error;
  }
}

/**
 * Creates all enhanced blog posts with specified categories
 * @param authorId The ID of the author creating the posts
 * @param categories Array of categories to create posts for ('resume-tips', 'job-search-strategy', or both)
 */
export async function createCategoryEnhancedBlogPosts(authorId: string, categories: string[]) {
  try {
    let createdCount = 0;
    
    // Create resume tips posts if requested
    if (categories.includes('resume-tips')) {
      const resumeTipsCount = await createAllResumeTipsPosts(authorId);
      const enhancedResumePostsCount = await createAllResumeEnhancedPosts(authorId);
      createdCount += resumeTipsCount + enhancedResumePostsCount;
    }
    
    // Create job search strategy posts if requested
    if (categories.includes('job-search-strategy')) {
      const jobSearchPostsCount = await createAllJobSearchStrategyPosts(authorId);
      createdCount += jobSearchPostsCount;
    }
    
    return createdCount;
  } catch (error) {
    console.error('Error creating category enhanced blog posts:', error);
    throw error;
  }
}
