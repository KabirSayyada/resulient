
import { supabase } from "@/integrations/supabase/client";
import { BlogCategory } from "@/types/blog";

// Function to add initial blog categories to the database
export const createInitialBlogCategories = async () => {
  // Check if we already have categories to avoid duplication
  const { data: existingCategories } = await supabase
    .from('blog_categories')
    .select('count')
    .limit(1);
  
  if (existingCategories && existingCategories.length > 0 && existingCategories[0].count > 0) {
    console.log('Blog categories already exist, skipping initial creation');
    return;
  }
  
  // Array of initial blog categories
  const initialCategories: Omit<BlogCategory, 'id' | 'created_at'>[] = [
    {
      name: "Resume Tips",
      slug: "resume-tips",
      description: "Expert advice and strategies for creating effective resumes that get noticed by employers and ATS systems."
    },
    {
      name: "Resume Formatting",
      slug: "resume-formatting",
      description: "Guidelines for properly formatting your resume to maximize readability and impact."
    },
    {
      name: "Job Search",
      slug: "job-search",
      description: "Strategies and techniques for finding job opportunities and navigating the application process."
    },
    {
      name: "Career Trends",
      slug: "career-trends",
      description: "Insights into emerging trends in hiring, career development, and the modern workplace."
    },
    {
      name: "Interview Preparation",
      slug: "interview-preparation",
      description: "Tips and strategies to help you prepare for and excel in job interviews."
    }
  ];
  
  // Create each category
  for (const category of initialCategories) {
    try {
      // Check if category with this slug already exists
      const { data: existingCategory } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug', category.slug)
        .maybeSingle();
      
      if (existingCategory) {
        console.log(`Category with slug "${category.slug}" already exists, skipping`);
        continue;
      }
      
      // Create the category
      const { error } = await supabase
        .from('blog_categories')
        .insert(category);
      
      if (error) {
        console.error(`Error creating category "${category.name}":`, error);
      } else {
        console.log(`Created category: ${category.name}`);
      }
    } catch (err) {
      console.error(`Failed to create category "${category.name}":`, err);
    }
  }
  
  return true;
};
