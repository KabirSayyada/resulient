
import { supabase } from "@/integrations/supabase/client";
import { calculateReadingTime } from "@/utils/blogUtils";

export async function createJobSearchPost(userId: string) {
  // Check if post already exists to avoid duplication
  const { data: existingPost } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("slug", "mastering-job-search-strategy-digital-age")
    .maybeSingle();

  if (existingPost) {
    console.log("Job search strategy blog post already exists");
    return false;
  }

  const title = "Mastering Your Job Search Strategy in the Digital Age";
  const slug = "mastering-job-search-strategy-digital-age";
  
  const content = `
<div class="blog-content">
  <p class="lead">In today's competitive job market, having a well-defined strategy is the difference between endless applications and landing your dream role. This comprehensive guide will walk you through proven tactics to optimize your job search in the digital era.</p>
  
  <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" alt="Person working on laptop during job search" />
  
  <h2>Why Traditional Job Search Methods Are Failing You</h2>
  
  <p>If you're still relying solely on job boards and sending the same resume to dozens of employers, you're likely experiencing frustration and diminishing returns. Today's job market requires a more sophisticated and personalized approach.</p>
  
  <p>According to recent studies, <strong>80% of jobs are never publicly advertised</strong>, and <strong>only 2% of applicants actually get interviews</strong> through online applications alone. This means the traditional "spray and pray" method of sending out numerous applications is highly inefficient.</p>
  
  <div class="callout">
    <p><strong>Pro Tip:</strong> Job seekers who combine multiple strategies including networking, targeted applications, and personal branding are 3x more likely to find employment within 90 days.</p>
  </div>
  
  <h2>The 5-Step Strategic Job Search Framework</h2>
  
  <p>Based on our work with thousands of successful job seekers, we've developed a proven framework that consistently delivers results:</p>
  
  <h3>1. Strategic Self-Assessment</h3>
  
  <p>Before diving into job applications, take time to clearly define:</p>
  
  <ul>
    <li>Your unique value proposition (skills, experience, and qualities that set you apart)</li>
    <li>Industry and role preferences with salary expectations</li>
    <li>Non-negotiable factors (location, work culture, benefits)</li>
    <li>Long-term career goals and how this next role fits in</li>
  </ul>
  
  <p>This clarity will help you focus your efforts on positions that truly align with your goals and requirements.</p>
  
  <h3>2. Market Research and Targeting</h3>
  
  <p>Identify 10-15 companies that match your criteria and research them thoroughly:</p>
  
  <ul>
    <li>Study their mission, values, products/services, and recent news</li>
    <li>Follow them on LinkedIn and other social platforms</li>
    <li>Research their hiring processes and company culture</li>
    <li>Look for connections who work there (or have worked there)</li>
  </ul>
  
  <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" alt="Person researching companies on computer" />
  
  <h3>3. Resume and Online Presence Optimization</h3>
  
  <p>Your digital footprint matters more than ever:</p>
  
  <ul>
    <li>Create tailored resume versions for different types of roles</li>
    <li>Optimize your LinkedIn profile with relevant keywords and achievements</li>
    <li>Develop a consistent personal brand across platforms</li>
    <li>Consider creating a personal website or digital portfolio</li>
  </ul>
  
  <div class="callout success">
    <p><strong>Success Factor:</strong> Job seekers with ATS-optimized resumes are 60% more likely to get past initial screening. <a href="/resume-scoring">Try our free ATS Resume Scanner</a> to check your resume's compatibility.</p>
  </div>
  
  <h3>4. Strategic Networking and Outreach</h3>
  
  <p>Proactive networking remains the most effective job search strategy:</p>
  
  <ul>
    <li>Schedule 2-3 informational interviews weekly with industry professionals</li>
    <li>Engage meaningfully in industry-specific online communities</li>
    <li>Attend virtual and in-person industry events</li>
    <li>Create a structured follow-up system for all your connections</li>
  </ul>
  
  <p>Remember: effective networking is about building genuine relationships, not just asking for job leads.</p>
  
  <h3>5. Application and Interview Mastery</h3>
  
  <p>Approach each application as a mini-project:</p>
  
  <ul>
    <li>Customize application materials for each position</li>
    <li>Research the specific team and potential interviewers</li>
    <li>Prepare company-specific interview stories and questions</li>
    <li>Develop a post-interview follow-up strategy</li>
  </ul>
  
  <h2>Leveraging Technology in Your Job Search</h2>
  
  <p>The right tools can significantly increase your efficiency and effectiveness:</p>
  
  <ul>
    <li><strong>Job search aggregators</strong> like Indeed or LinkedIn Jobs to find openings</li>
    <li><strong>ATS optimization tools</strong> to ensure your resume passes automated screenings</li>
    <li><strong>CRM systems</strong> like Huntr or Notion to track applications and follow-ups</li>
    <li><strong>Networking platforms</strong> beyond LinkedIn, like industry-specific communities</li>
  </ul>
  
  <img src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" alt="Person using job search technology tools" />
  
  <h2>Common Job Search Strategy Mistakes to Avoid</h2>
  
  <p>Even well-intentioned job seekers often make these critical errors:</p>
  
  <ul>
    <li><strong>Focusing on quantity over quality</strong> in applications</li>
    <li><strong>Neglecting to follow up</strong> after applications or interviews</li>
    <li><strong>Relying exclusively on online applications</strong></li>
    <li><strong>Failing to properly prepare</strong> for different interview stages</li>
    <li><strong>Not leveraging existing connections</strong> for referrals</li>
  </ul>
  
  <div class="callout warning">
    <p><strong>Warning:</strong> Rushing through applications can actually extend your job search. Research shows that candidates who spend an average of 3-4 hours on each application have a 20% higher interview rate than those who spend less than an hour.</p>
  </div>
  
  <h2>Maintaining Resilience During Your Search</h2>
  
  <p>Job searching can be emotionally challenging. Implement these strategies to stay motivated:</p>
  
  <ul>
    <li>Set process-oriented goals (e.g., "reach out to 5 connections weekly") rather than outcome-oriented ones</li>
    <li>Celebrate small wins along your journey</li>
    <li>Develop a support network of fellow job seekers</li>
    <li>Schedule regular breaks and self-care activities</li>
    <li>Track progress to visualize your momentum</li>
  </ul>
  
  <p>Remember that the average job search takes 3-6 months. Persistence and adaptability are key to success.</p>
  
  <div class="cta-box">
    <h3>Optimize Your Resume for ATS Systems</h3>
    <p>Our advanced ATS Resume Scanner analyzes your resume against job descriptions and provides actionable improvement recommendations.</p>
    <a href="/resume-scoring">Try our FREE Resume Scanner →</a>
  </div>
  
  <h2>Conclusion: Your Strategic Advantage</h2>
  
  <p>The job search landscape has evolved dramatically, but with the right strategy, you can navigate it successfully. By approaching your search with intention, focusing on quality connections, and leveraging the right tools, you'll position yourself ahead of the competition.</p>
  
  <p>At Resulient, we've helped thousands of professionals transform their job search with our AI-powered tools and expert guidance. Our resume optimization technology ensures your application stands out to both human recruiters and automated systems.</p>
  
  <p>What job search strategies have worked best for you? Share your experiences in the comments below!</p>
</div>
`;

  const excerpt = "Discover proven strategies to transform your job search in the digital age. Learn how to stand out in competitive markets, leverage networking effectively, and optimize your applications for success.";
  
  const seoTitle = "Mastering Your Job Search Strategy in 2025 | Expert Guide";
  const seoDescription = "Learn the proven 5-step job search framework that top candidates use to land interviews faster. Includes actionable strategies for networking, resume optimization, and interview preparation.";
  const seoKeywords = "job search strategy, job hunting tips, effective job search, career development, job application tips, networking strategy, resume optimization, interview preparation";
  
  const featuredImage = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d";
  
  const category = "job-search-strategy";
  
  const tags = [
    "job search",
    "career development",
    "networking",
    "resume tips",
    "interview preparation",
    "career strategy",
    "job hunting"
  ];

  const now = new Date().toISOString();

  // Calculate reading time
  const readingTime = calculateReadingTime(content);
  console.log(`Estimated reading time: ${readingTime} minutes`);

  // Create the blog post
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title,
      slug,
      excerpt,
      content,
      featured_image: featuredImage,
      category,
      tags,
      author_id: userId,
      published_at: now,
      created_at: now,
      updated_at: now,
      seo_title: seoTitle,
      seo_description: seoDescription,
      seo_keywords: seoKeywords,
      reading_time: readingTime
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating job search strategy blog post:", error);
    throw error;
  }

  console.log("Job search strategy blog post created successfully:", data.id);
  return true;
}
