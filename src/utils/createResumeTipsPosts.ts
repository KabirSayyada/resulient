
import { supabase } from '@/integrations/supabase/client';
import { slugify } from './blogUtils';

/**
 * Creates a blog post about resume ATS optimization tips
 */
export async function createResumeATSTipsPost(authorId: string) {
  // Check if the post already exists
  const { data: existingPost } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', 'top-10-resume-ats-optimization-tips-for-2025')
    .maybeSingle();

  if (existingPost) {
    console.log('Resume ATS tips post already exists');
    return null;
  }

  const post = {
    title: 'Top 10 Resume ATS Optimization Tips for 2025',
    slug: 'top-10-resume-ats-optimization-tips-for-2025',
    excerpt: 'Learn proven strategies to optimize your resume for Applicant Tracking Systems (ATS) and increase your chances of landing interviews in 2025.',
    content: `
<div class="prose prose-lg dark:prose-invert max-w-none">
  <p class="lead">In today's competitive job market, getting past Applicant Tracking Systems (ATS) is a critical first step in landing your dream job. With over 99% of Fortune 500 companies and 75% of all employers using some form of ATS to screen candidates, optimizing your resume for these systems is no longer optional—it's essential.</p>
  
  <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" alt="Professional reviewing resume on laptop with ATS software" class="rounded-xl my-8 w-full object-cover h-[400px]" />
  
  <h2>How Applicant Tracking Systems Work</h2>
  
  <p>Before diving into optimization tips, it's important to understand how ATS software evaluates your resume:</p>
  
  <ul>
    <li><strong>Keyword Matching:</strong> ATS scans resumes for specific keywords relevant to the job description</li>
    <li><strong>Formatting Analysis:</strong> Complex formatting can confuse ATS and lead to misinterpretation</li>
    <li><strong>Ranking Algorithm:</strong> Resumes are scored and ranked based on matching criteria</li>
    <li><strong>Filtering:</strong> Only top-ranking resumes reach human recruiters</li>
  </ul>
  
  <p>With that understanding, here are our top 10 resume ATS optimization tips for 2025:</p>
  
  <h2>1. Use Job Description Keywords Strategically</h2>
  
  <p>ATS software is programmed to scan for specific keywords that indicate you're a good match for the role. This doesn't mean keyword stuffing—it means strategic placement.</p>
  
  <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg my-6">
    <h4 class="text-blue-800 dark:text-blue-300 font-semibold">Pro Tip:</h4>
    <p class="mt-2 text-blue-700 dark:text-blue-400">Use <a href="/resume-scoring" class="font-medium underline">Resulient's ATS Resume Scanner</a> to analyze how well your resume matches the specific job description. Our AI-powered tool identifies missing keywords and suggests strategic placements to boost your ATS score.</p>
  </div>
  
  <h2>2. Optimize Your Resume Format</h2>
  
  <p>ATS software can be particular about formatting. Stick to these guidelines:</p>
  
  <ul>
    <li>Use standard resume sections (Summary, Experience, Education, Skills)</li>
    <li>Choose a clean, single-column layout for maximum compatibility</li>
    <li>Avoid headers/footers as some ATS systems can't process this information</li>
    <li>Use standard fonts (Arial, Calibri, Times New Roman)</li>
  </ul>
  
  <h2>3. Use Standard Section Headings</h2>
  
  <p>While creative section titles might seem appealing, they can confuse ATS software. Stick to standard section headers:</p>
  
  <ul>
    <li>"Work Experience" rather than "Where I've Made an Impact"</li>
    <li>"Skills" instead of "My Toolkit"</li>
    <li>"Education" not "Learning Journey"</li>
  </ul>
  
  <h2>4. Include a Skills Section with Hard Skills</h2>
  
  <p>A dedicated skills section makes it easy for ATS to identify your capabilities. Focus on hard skills relevant to your industry:</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h4 class="font-semibold mb-2">Technical Skills</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li>Programming Languages (Python, JavaScript)</li>
        <li>Software (Adobe Suite, Microsoft Office)</li>
        <li>Data Analysis Tools (Tableau, Power BI)</li>
      </ul>
    </div>
    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h4 class="font-semibold mb-2">Industry-Specific Skills</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li>Project Management Methodologies</li>
        <li>Specific Certifications</li>
        <li>Technical Procedures & Protocols</li>
      </ul>
    </div>
  </div>
  
  <h2>5. Optimize File Type and Naming</h2>
  
  <p>The file type and name of your resume matter:</p>
  
  <ul>
    <li>Use .docx or .pdf formats (check job posting for preferences)</li>
    <li>Name your file professionally: FirstName-LastName-Resume.pdf</li>
    <li>Avoid special characters in the filename</li>
  </ul>
  
  <h2>6. Incorporate Industry-Specific Terminology</h2>
  
  <p>Every industry has its specific terminology and acronyms. Including these terms signals your familiarity with the field:</p>
  
  <div class="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-lg my-6">
    <h4 class="text-amber-800 dark:text-amber-300 font-semibold">Example:</h4>
    <p class="mt-2">For a marketing position, include terms like "conversion rate optimization," "customer acquisition cost," and "marketing automation platforms."</p>
  </div>
  
  <h2>7. Quantify Achievements</h2>
  
  <p>Numbers catch both ATS and human attention. Quantify your achievements wherever possible:</p>
  
  <ul>
    <li>Increased sales by 27% over 6 months</li>
    <li>Managed a team of 15 professionals</li>
    <li>Reduced customer complaints by 38%</li>
    <li>Implemented process saving $120K annually</li>
  </ul>
  
  <h2>8. Tailor Your Resume for Each Application</h2>
  
  <p>Generic resumes perform poorly in ATS systems. Take the time to customize your resume for each position:</p>
  
  <div class="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg my-6">
    <h4 class="text-green-800 dark:text-green-300 font-semibold">Customization Checklist:</h4>
    <ul class="mt-2 list-disc pl-5 space-y-1">
      <li>Adjust your professional summary to align with the specific role</li>
      <li>Reorder your skills to prioritize those mentioned in the job description</li>
      <li>Emphasize relevant experiences that match the position requirements</li>
    </ul>
  </div>
  
  <h2>9. Avoid Over-Formatting and Graphics</h2>
  
  <p>While visually appealing, heavily designed resumes with graphics, tables, and text boxes often perform poorly in ATS systems:</p>
  
  <ul>
    <li>Avoid text boxes (ATS often can't read the content inside)</li>
    <li>Skip tables (information may be misinterpreted)</li>
    <li>Don't use images to convey important information</li>
    <li>Limit use of icons and graphics</li>
  </ul>
  
  <h2>10. Use Resulient's ATS Optimization Tool</h2>
  
  <p>Take the guesswork out of ATS optimization with <a href="/resume-scoring" class="text-primary hover:underline font-medium">Resulient's AI-powered ATS Resume Optimizer</a>. Our tool:</p>
  
  <ul>
    <li>Analyzes your resume against specific job descriptions</li>
    <li>Identifies missing keywords and skills</li>
    <li>Recommends format improvements for better ATS compatibility</li>
    <li>Provides an overall ATS score with actionable improvements</li>
    <li>Suggests content enhancements to better highlight your qualifications</li>
  </ul>
  
  <div class="bg-primary/10 dark:bg-primary/20 border border-primary/20 p-6 rounded-xl my-8">
    <h3 class="text-xl font-bold text-primary">Ready to Optimize Your Resume?</h3>
    <p class="my-3">Stop wondering if your resume is getting lost in ATS systems. Get a free ATS compatibility score and targeted recommendations with Resulient.</p>
    <a href="/resume-scoring" class="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors">Try Our Free ATS Scanner</a>
  </div>
  
  <h2>Conclusion</h2>
  
  <p>In 2025's competitive job market, optimizing your resume for ATS is a critical step in your job search. By following these 10 tips and leveraging tools like Resulient's Resume Optimizer, you'll significantly improve your chances of getting past the ATS filters and into the hands of hiring managers.</p>
  
  <p>Remember that while ATS optimization is important, your resume still needs to impress human readers once it passes the algorithmic screening. Balance ATS-friendly elements with compelling content that showcases your value to potential employers.</p>
</div>`,
    category: 'resume-tips',
    tags: ['resume', 'ats', 'job search', 'career advice', 'resume optimization', 'job application', 'hiring process'],
    published_at: new Date().toISOString(),
    featured_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    author_id: authorId,
    seo_title: 'Top 10 Resume ATS Optimization Tips for 2025 | Beat the Algorithm',
    seo_description: 'Learn how to optimize your resume for ATS systems in 2025. These 10 proven tips will help your resume pass ATS screening and land more interviews.',
    seo_keywords: 'resume ATS optimization, ATS resume tips, applicant tracking system, resume keywords, ATS friendly resume, resume format, job application tips, resume scanner',
  };

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post)
    .select()
    .single();

  if (error) {
    console.error('Error creating resume ATS tips post:', error);
    throw error;
  }

  console.log('Resume ATS tips post created successfully');
  return data;
}

/**
 * Creates a blog post about resume mistakes to avoid
 */
export async function createResumeCommonMistakesPost(authorId: string) {
  // Check if the post already exists
  const { data: existingPost } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', '7-common-resume-mistakes-to-avoid-in-2025')
    .maybeSingle();

  if (existingPost) {
    console.log('Resume mistakes post already exists');
    return null;
  }

  const post = {
    title: '7 Common Resume Mistakes to Avoid in 2025',
    slug: '7-common-resume-mistakes-to-avoid-in-2025',
    excerpt: 'Discover the most common resume mistakes that could be costing you job opportunities and learn how to fix them to make your application stand out.',
    content: `
<div class="prose prose-lg dark:prose-invert max-w-none">
  <p class="lead">In the competitive job market of 2025, a single resume mistake can mean the difference between landing an interview and being overlooked. With recruiters spending an average of just 7.4 seconds scanning each resume, ensuring your application is flawless has never been more important.</p>
  
  <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" alt="Person reviewing resume with red pen marking mistakes" class="rounded-xl my-8 w-full object-cover h-[400px]" />
  
  <p>According to our research and feedback from hiring managers across industries, these are the seven most common resume mistakes that candidates are still making in 2025—and how you can avoid them.</p>
  
  <h2>1. Using Generic, One-Size-Fits-All Content</h2>
  
  <p>One of the biggest mistakes job seekers make is using the same generic resume for every application. In 2025's hyper-specialized job market, this approach is particularly ineffective.</p>
  
  <div class="bg-red-50 dark:bg-red-900/20 p-5 rounded-lg my-6 border-l-4 border-red-500">
    <h4 class="text-red-800 dark:text-red-300 font-semibold">Common Mistake:</h4>
    <p class="mt-2">Sending identical resumes to different companies without tailoring them to the specific job requirements.</p>
  </div>
  
  <div class="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg my-6 border-l-4 border-green-500">
    <h4 class="text-green-800 dark:text-green-300 font-semibold">Better Approach:</h4>
    <p class="mt-2">Customize your resume for each position by highlighting relevant skills and experiences that match the job description. Use <a href="/resume-scoring" class="text-primary hover:underline font-medium">Resulient's Resume Analyzer</a> to identify which keywords and qualifications you should emphasize for specific roles.</p>
  </div>
  
  <h2>2. Formatting Issues That Confuse ATS Systems</h2>
  
  <p>Applicant Tracking Systems (ATS) remain a critical first hurdle in 2025, with over 95% of large companies using them to filter applications. Many qualified candidates get rejected simply because their resumes aren't formatted properly for these automated systems.</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
    <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
      <h4 class="font-semibold mb-2 text-red-700 dark:text-red-300">Formatting Mistakes</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li>Using tables, text boxes, or columns</li>
        <li>Including headers or footers with key information</li>
        <li>Using creative or uncommon section headers</li>
        <li>Submitting PDFs with security restrictions</li>
      </ul>
    </div>
    <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
      <h4 class="font-semibold mb-2 text-green-700 dark:text-green-300">ATS-Friendly Formatting</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li>Simple, clean layout with standard margins</li>
        <li>Common section headers (Work Experience, Education)</li>
        <li>Standard fonts (Arial, Calibri, Times New Roman)</li>
        <li>Plain bullet points (•) rather than fancy symbols</li>
      </ul>
    </div>
  </div>
  
  <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg my-6">
    <h4 class="text-blue-800 dark:text-blue-300 font-semibold">Pro Tip:</h4>
    <p class="mt-2 text-blue-700 dark:text-blue-400">Use <a href="/resume-scoring" class="font-medium underline">Resulient's ATS Resume Checker</a> to test your resume against ATS systems before submitting. Our tool will highlight formatting issues and provide a compatibility score with specific suggestions for improvement.</p>
  </div>
  
  <h2>3. Focusing on Job Duties Instead of Achievements</h2>
  
  <p>Many resumes read like job descriptions, listing responsibilities without showcasing actual achievements. This misses a crucial opportunity to demonstrate your unique value.</p>
  
  <div class="my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
    <div class="bg-red-100 dark:bg-red-900/30 p-4">
      <h4 class="font-semibold">Weak Example:</h4>
      <p class="italic">"Responsible for managing social media accounts and creating content for company platforms."</p>
    </div>
    <div class="bg-green-100 dark:bg-green-900/30 p-4">
      <h4 class="font-semibold">Strong Example:</h4>
      <p class="italic">"Grew Instagram following by 200% (15K to 45K) in 6 months through strategic content campaigns, increasing customer engagement by 35% and directly contributing to $120K in attributable sales."</p>
    </div>
  </div>
  
  <h2>4. Including Irrelevant Information</h2>
  
  <p>In 2025's focused job market, irrelevant information not only wastes precious resume space but can actively distract from your key qualifications.</p>
  
  <div class="bg-red-50 dark:bg-red-900/20 p-5 rounded-lg my-6">
    <h4 class="text-red-800 dark:text-red-300 font-semibold">What to Leave Out:</h4>
    <ul class="mt-2 list-disc pl-5 space-y-1">
      <li>Outdated experiences (generally over 10-15 years old unless highly relevant)</li>
      <li>Obvious skills (basic computer literacy is assumed for most professional roles)</li>
      <li>Personal information unrelated to job performance (age, marital status, etc.)</li>
      <li>Generic objectives that don't add value</li>
      <li>Hobbies unrelated to the position or company culture</li>
    </ul>
  </div>
  
  <h2>5. Overlooking Keywords from the Job Description</h2>
  
  <p>Keyword optimization remains crucial in 2025, as both ATS systems and human recruiters look for specific terms that indicate a good match for the role.</p>
  
  <div class="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-lg my-6">
    <h4 class="text-amber-800 dark:text-amber-300 font-semibold">Keyword Strategy:</h4>
    <p class="mt-2">Analyze each job description for industry-specific terms, required skills, and repeated phrases. Incorporate these naturally throughout your resume, especially in your skills section and work experiences.</p>
    <p class="mt-2">Don't just focus on hard skills—include soft skills mentioned in the job description as well, supported by examples that demonstrate these qualities.</p>
  </div>
  
  <h2>6. Grammatical Errors and Typos</h2>
  
  <p>Even in 2025, with advanced spell-check tools widely available, grammatical errors and typos remain among the most common reasons resumes get rejected. These mistakes signal carelessness and lack of attention to detail.</p>
  
  <div class="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg my-6">
    <h4 class="text-purple-800 dark:text-purple-300 font-semibold">Proofreading Essentials:</h4>
    <ul class="mt-2 list-disc pl-5 space-y-1">
      <li>Use grammar and spell-check tools, but don't rely on them exclusively</li>
      <li>Read your resume aloud to catch awkward phrasing</li>
      <li>Have someone else review your resume for errors you might have missed</li>
      <li>Check for consistency in formatting, tense, and punctuation</li>
      <li>Review company names, job titles, and dates for accuracy</li>
    </ul>
  </div>
  
  <h2>7. Poor Digital Optimization</h2>
  
  <p>In 2025's digital-first hiring landscape, how your resume performs electronically matters as much as its content.</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
    <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
      <h4 class="font-semibold mb-2 text-red-700 dark:text-red-300">Digital Mistakes</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li>Complex file names with special characters</li>
        <li>Missing or vague LinkedIn profile link</li>
        <li>Non-clickable contact information</li>
        <li>Portfolio links without context</li>
      </ul>
    </div>
    <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
      <h4 class="font-semibold mb-2 text-green-700 dark:text-green-300">Digital Best Practices</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li>Simple, descriptive file name (FirstName-LastName-Resume.pdf)</li>
        <li>Clickable email and phone links</li>
        <li>Customized LinkedIn URL with complete profile</li>
        <li>Descriptive portfolio/work sample links</li>
      </ul>
    </div>
  </div>
  
  <h2>How Resulient Can Help Perfect Your Resume</h2>
  
  <p>Avoiding these common resume mistakes is crucial, but creating a truly outstanding resume that passes both ATS screening and impresses hiring managers requires expert insight.</p>
  
  <div class="bg-primary/10 dark:bg-primary/20 border border-primary/20 p-6 rounded-xl my-8">
    <h3 class="text-xl font-bold text-primary">Resulient's Resume Optimization Suite</h3>
    <p class="my-3">Our AI-powered platform offers comprehensive resume analysis that:</p>
    <ul class="list-disc pl-5 space-y-1 mb-4">
      <li>Scans your resume against specific job descriptions</li>
      <li>Identifies missing keywords and skills</li>
      <li>Highlights formatting issues that could trip up ATS systems</li>
      <li>Suggests improvements to transform job duties into compelling achievements</li>
      <li>Provides an overall ATS compatibility score</li>
      <li>Delivers actionable recommendations to increase interview chances</li>
    </ul>
    <a href="/resume-scoring" class="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors">Check Your Resume Now</a>
  </div>
  
  <h2>Conclusion</h2>
  
  <p>In 2025's competitive job market, avoiding these common resume mistakes can significantly improve your chances of landing interviews. Remember that your resume is often your first impression with potential employers—make it count.</p>
  
  <p>By focusing on customization, achievement-oriented content, proper formatting, and strategic keyword usage, you can create a resume that not only passes ATS screening but also impresses hiring managers and showcases your unique value as a candidate.</p>
  
  <p>For personalized resume feedback and optimization, try <a href="/resume-scoring" class="text-primary hover:underline font-medium">Resulient's free resume check</a> and discover how small improvements can lead to significantly better results in your job search.</p>
</div>`,
    category: 'resume-tips',
    tags: ['resume mistakes', 'job application', 'resume tips', 'career advice', 'ats optimization', 'job search', 'resume writing'],
    published_at: new Date().toISOString(),
    featured_image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    author_id: authorId,
    seo_title: '7 Critical Resume Mistakes to Avoid in 2025 | Expert Resume Tips',
    seo_description: 'Discover the 7 most damaging resume mistakes that could be costing you job interviews in 2025. Learn how to fix them and create a standout resume.',
    seo_keywords: 'resume mistakes, common resume errors, resume tips, resume improvement, job application mistakes, resume writing, ats resume mistakes, resume formatting errors',
  };

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post)
    .select()
    .single();

  if (error) {
    console.error('Error creating resume mistakes post:', error);
    throw error;
  }

  console.log('Resume mistakes post created successfully');
  return data;
}

/**
 * Creates both resume tips blog posts
 */
export async function createAllResumeTipsPosts(authorId: string) {
  try {
    const results = await Promise.all([
      createResumeATSTipsPost(authorId),
      createResumeCommonMistakesPost(authorId)
    ]);
    
    const createdCount = results.filter(result => result !== null).length;
    return createdCount;
  } catch (error) {
    console.error('Error creating resume tips posts:', error);
    throw error;
  }
}
