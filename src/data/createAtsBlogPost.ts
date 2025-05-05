
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { calculateReadingTime } from '@/utils/blogUtils';

export async function createAtsBlogPost(userId: string) {
  try {
    // First, make sure we have the "Resume Tips" category
    let { data: categoryData } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('slug', 'resume-tips')
      .single();
    
    if (!categoryData) {
      const { data: newCategory, error: categoryError } = await supabase
        .from('blog_categories')
        .insert({
          name: 'Resume Tips',
          slug: 'resume-tips',
          description: 'Expert advice on creating and optimizing your resume for job applications.'
        })
        .select()
        .single();
      
      if (categoryError) {
        console.error('Error creating Resume Tips category:', categoryError);
        return false;
      }
      
      categoryData = newCategory;
    }

    // Create the blog post content
    const postContent = `
<div class="blog-content">
  <p class="lead">In today's competitive job market, your resume needs to impress not just human recruiters but also the software that screens applications before they ever reach human eyes. Applicant Tracking Systems (ATS) are used by an estimated 99% of Fortune 500 companies and 75% of all employers. Understanding how these systems work—and why they reject resumes—could be the difference between landing an interview and never getting a response.</p>
  
  <h2>What is an ATS and How Does it Work?</h2>
  
  <p>An Applicant Tracking System (ATS) is software that helps employers manage the recruitment process by automatically scanning, evaluating, and ranking resumes before a hiring manager reviews them. Think of it as the digital gatekeeper standing between your application and a human reader.</p>
  
  <p>When you submit your resume, the ATS will:</p>
  
  <ul>
    <li>Parse your resume into a digital format</li>
    <li>Scan for specific keywords related to the job description</li>
    <li>Score your application based on matching criteria</li>
    <li>Rank you among other applicants</li>
    <li>Either forward your resume to recruiters or reject it based on predefined thresholds</li>
  </ul>
  
  <div class="callout">
    <p><strong>Shocking Statistic:</strong> Up to 75% of qualified applicants are rejected by ATS before a human ever sees their resume.</p>
  </div>
  
  <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" alt="Computer screen showing resume being processed" class="featured-image my-8 rounded-lg" />
  
  <h2>The 7 Main Reasons ATS Systems Reject Resumes</h2>
  
  <h3>1. Missing Keywords</h3>
  
  <p>The most common reason for ATS rejection is the absence of relevant keywords from the job description. ATS systems are programmed to look for specific terms that indicate you have the skills and experience required for the position.</p>
  
  <p><strong>Solution:</strong> Carefully analyze the job description and incorporate relevant keywords into your resume naturally. Focus on both hard skills (technical abilities) and soft skills (interpersonal traits) mentioned in the posting.</p>
  
  <h3>2. Incompatible File Format</h3>
  
  <p>Many ATS systems struggle with certain file formats, particularly PDFs that are image-based rather than text-based, or documents created in programs other than Microsoft Word.</p>
  
  <p><strong>Solution:</strong> Unless otherwise specified, submit your resume as a .docx file or a text-based PDF. These formats are most compatible with ATS systems.</p>
  
  <h3>3. Complex Formatting</h3>
  
  <p>Creative designs with multiple columns, tables, headers, footers, images, and graphics often confuse ATS systems, causing them to misread or completely miss important information.</p>
  
  <p><strong>Solution:</strong> Keep your formatting simple with standard section headings, bullet points, and a clean, single-column layout. Avoid text boxes, tables, and excessive formatting.</p>
  
  <h3>4. Non-Standard Section Headings</h3>
  
  <p>ATS systems are programmed to look for standard section headings like "Work Experience," "Education," and "Skills." Creative alternatives might be missed entirely.</p>
  
  <p><strong>Solution:</strong> Stick to conventional section headings that ATS systems can easily recognize and categorize.</p>
  
  <div class="callout warning">
    <p><strong>Common Mistake:</strong> Using "Professional Journey" instead of "Work Experience" might sound creative, but it can confuse an ATS and cause it to overlook your valuable experience.</p>
  </div>
  
  <h3>5. Spelling and Grammatical Errors</h3>
  
  <p>Typos and grammatical mistakes aren't just unprofessional; they can prevent the ATS from recognizing key terms and skills on your resume.</p>
  
  <p><strong>Solution:</strong> Proofread thoroughly, use spell-check, and consider having someone else review your resume before submission.</p>
  
  <h3>6. Inconsistent Work History</h3>
  
  <p>Unexplained gaps in employment, job-hopping, or inconsistent date formats can raise red flags in ATS screening.</p>
  
  <p><strong>Solution:</strong> Be consistent with how you format dates (MM/YYYY is standard) and consider using a functional resume format if you have employment gaps.</p>
  
  <h3>7. Overcustomization for Multiple Positions</h3>
  
  <p>Applying to multiple positions at the same company with substantially different resumes can create conflicting records in the ATS.</p>
  
  <p><strong>Solution:</strong> Maintain consistency in your core qualifications while tailoring specific sections to each position.</p>
  
  <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" alt="Person reviewing resume on computer" class="featured-image my-8 rounded-lg" />
  
  <h2>How to Optimize Your Resume for ATS Success</h2>
  
  <h3>Keyword Optimization Strategy</h3>
  
  <ol>
    <li><strong>Identify primary keywords</strong> from the job description (usually mentioned multiple times)</li>
    <li><strong>Include secondary keywords</strong> related to your industry and role</li>
    <li><strong>Use both acronyms and spelled-out terms</strong> (e.g., "SEO" and "Search Engine Optimization")</li>
    <li><strong>Place keywords strategically</strong> in your summary, skills section, and throughout work experience</li>
    <li><strong>Avoid keyword stuffing</strong> which can flag your resume as spam</li>
  </ol>
  
  <h3>ATS-Friendly Formatting Guidelines</h3>
  
  <ul>
    <li>Use a clean, single-column layout</li>
    <li>Choose standard fonts like Arial, Calibri, or Times New Roman</li>
    <li>Avoid headers and footers (place contact information in the main body)</li>
    <li>Use standard section headings</li>
    <li>Save as .docx or text-based PDF</li>
    <li>Include your name at the top of every page</li>
    <li>Keep bullets simple (avoid fancy symbols or emoji)</li>
  </ul>
  
  <div class="callout success">
    <p><strong>Pro Tip:</strong> After optimizing your resume, try copying and pasting it into a plain text document. If it remains readable and well-organized, it's likely to pass through an ATS successfully.</p>
  </div>
  
  <h2>Testing Your Resume Against ATS Systems</h2>
  
  <p>One of the best ways to ensure your resume is ATS-friendly is to test it before submitting. There are several tools designed specifically for this purpose:</p>
  
  <ul>
    <li><strong>Resume Optimization Tools:</strong> Services like Resulient can analyze your resume against specific job descriptions and provide optimization recommendations.</li>
    <li><strong>ATS Simulators:</strong> These tools mimic how an ATS would read your resume and highlight potential issues.</li>
    <li><strong>Jobscan:</strong> Compare your resume to job descriptions and receive a match rate with suggestions for improvement.</li>
  </ul>
  
  <h2>The Human Element: Don't Forget the Reader</h2>
  
  <p>While optimizing for ATS is crucial, remember that if your resume passes the digital screening, it will ultimately be read by a human. Balance ATS optimization with readability and engagement for human recruiters by:</p>
  
  <ul>
    <li>Including compelling achievements with quantifiable results</li>
    <li>Telling your career story coherently</li>
    <li>Highlighting your unique value proposition</li>
    <li>Ensuring the document is visually appealing and easy to scan</li>
  </ul>
  
  <p>A truly effective resume satisfies both the ATS and the human reader, increasing your chances of landing an interview.</p>
  
  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" alt="Person reviewing applications" class="featured-image my-8 rounded-lg" />
  
  <h2>Conclusion: Beating the ATS is Just the First Step</h2>
  
  <p>Understanding how ATS systems work and why they reject resumes is essential knowledge for today's job seeker. By optimizing your resume with relevant keywords, using ATS-friendly formatting, and testing your document before submission, you can significantly increase the chances of your application reaching human recruiters.</p>
  
  <p>Remember that passing the ATS is just the first hurdle in the application process. Once your resume reaches human eyes, it needs to quickly communicate your value and make a compelling case for your candidacy.</p>
  
  <p>At Resulient, our resume optimization tool can help you create an ATS-optimized resume that also impresses human recruiters. By analyzing your resume against specific job descriptions, we provide actionable recommendations to help you beat the ATS and land more interviews.</p>
  
  <div class="cta-box">
    <h3>Ready to stop getting rejected by ATS systems?</h3>
    <p>Try our <a href="/">Resume Optimization Tool</a> today and increase your interview chances by up to 70%.</p>
  </div>
</div>
    `;

    // Calculate reading time for the content
    const readingTime = calculateReadingTime(postContent);

    // Check if the post already exists to avoid duplicates
    const { data: existingPosts } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', 'how-ats-systems-reject-resumes')
      .maybeSingle();
    
    if (existingPosts) {
      console.log('ATS blog post already exists');
      return false;
    }

    // Create the blog post
    const { error: postError } = await supabase
      .from('blog_posts')
      .insert({
        title: "How ATS Systems Reject Resumes: What You Need to Know",
        slug: "how-ats-systems-reject-resumes",
        excerpt: "Learn why Applicant Tracking Systems (ATS) might be rejecting your resume and the exact steps you can take to ensure your application makes it past the digital gatekeepers.",
        content: postContent,
        featured_image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
        author_id: userId,
        category: 'resume-tips',
        tags: ['ATS', 'Resume Optimization', 'Job Search', 'Career Advice', 'Hiring Process'],
        published_at: new Date().toISOString(),
        seo_title: 'How ATS Systems Reject Resumes: What You Need to Know in 2025',
        seo_description: 'Discover why ATS systems reject 75% of resumes and learn proven strategies to optimize your resume to pass automated screenings and land more interviews.',
        seo_keywords: 'ATS resume, applicant tracking system, resume rejection, optimize resume for ATS, ATS friendly resume, resume keywords, ATS screening',
        reading_time: readingTime
      });

    if (postError) {
      console.error('Error creating ATS blog post:', postError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createAtsBlogPost:', error);
    return false;
  }
}
