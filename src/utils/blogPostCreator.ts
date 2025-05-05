
import { supabase } from '@/integrations/supabase/client';
import { calculateReadingTime } from './blogUtils';

/**
 * Creates multiple blog posts
 * @param userId The user ID creating the posts
 * @returns The number of created posts
 */
export async function createMultipleBlogPosts(userId: string): Promise<number> {
  try {
    const createdPosts = await Promise.all([
      createCareerDevelopmentPosts(userId),
      createInterviewPreparationPosts(userId)
    ]);
    
    // Sum up all created posts
    return createdPosts.reduce((total, count) => total + count, 0);
  } catch (error) {
    console.error("Error creating multiple blog posts:", error);
    return 0;
  }
}

/**
 * Creates career development blog posts
 * @param userId The user ID creating the posts
 * @returns The number of created posts
 */
export async function createCareerDevelopmentPosts(userId: string): Promise<number> {
  try {
    let createdCount = 0;
    
    // Create career development blog posts here...
    // Example career post
    const careerPost = {
      title: "Building Your Career Roadmap for Success",
      slug: "building-your-career-roadmap-for-success",
      excerpt: "Learn how to create a strategic career plan that aligns with your long-term goals and values for sustainable professional growth.",
      content: `
<div class="blog-content">
  <p class="lead">A well-crafted career roadmap is essential for navigating the complex professional landscape of today's job market. This guide will help you create a strategic plan that supports your long-term career goals while remaining flexible enough to adapt to changing circumstances.</p>
  
  <h2>Why Career Planning Matters More Than Ever</h2>
  
  <p>In today's rapidly evolving job market, a reactive approach to career development is no longer sufficient. Technological advancements, industry disruptions, and changing workplace dynamics require professionals to be intentional about their career trajectories.</p>
  
  <p>A thoughtful career roadmap provides:</p>
  
  <ul>
    <li>Clear direction during periods of uncertainty</li>
    <li>A framework for evaluating opportunities</li>
    <li>Motivation during challenging career phases</li>
    <li>Strategic advantage in competitive environments</li>
  </ul>
  
  <h2>The 5-Step Career Roadmap Development Process</h2>
  
  <h3>1. Self-Assessment: Know Your Foundation</h3>
  
  <p>Before planning your destination, understand your starting point by conducting a thorough self-assessment:</p>
  
  <ul>
    <li><strong>Skills inventory:</strong> Document your technical, transferable, and soft skills</li>
    <li><strong>Values clarification:</strong> Identify what matters most to you in work and life</li>
    <li><strong>Interest exploration:</strong> Recognize what genuinely engages and energizes you</li>
    <li><strong>Personality insights:</strong> Consider how your traits influence work preferences</li>
  </ul>
  
  <p>This foundation of self-knowledge ensures your career direction aligns with who you are, not just what sounds impressive or lucrative.</p>
  
  <h3>2. Vision Crafting: Define Long-Term Success</h3>
  
  <p>With self-awareness as your foundation, project forward to envision your ideal professional future:</p>
  
  <ul>
    <li>Where do you want to be in 5-10 years?</li>
    <li>What level of responsibility do you aspire to?</li>
    <li>What impact do you want to make in your field or community?</li>
    <li>How does your career integrate with your personal life goals?</li>
  </ul>
  
  <p>Document this vision in specific, vivid terms. The more clearly you can see your destination, the more effectively you can plan your route.</p>
  
  <h3>3. Gap Analysis: Map the Distance</h3>
  
  <p>Compare your current position with your desired future to identify gaps in:</p>
  
  <ul>
    <li><strong>Skills and knowledge:</strong> What new capabilities must you develop?</li>
    <li><strong>Experience:</strong> What types of projects or roles would build relevant background?</li>
    <li><strong>Credentials:</strong> What degrees, certifications, or qualifications might you need?</li>
    <li><strong>Network:</strong> What relationships would support your progression?</li>
  </ul>
  
  <p>This gap analysis provides the basis for your development priorities and helps you avoid investing time in activities that don't advance your specific goals.</p>
  
  <h3>4. Strategy Development: Create Your Action Plan</h3>
  
  <p>Transform your gap analysis into a structured action plan with:</p>
  
  <ul>
    <li><strong>Short-term objectives:</strong> What can you accomplish in the next 6-12 months?</li>
    <li><strong>Medium-term goals:</strong> What should you achieve in 1-3 years?</li>
    <li><strong>Long-term targets:</strong> What are your 3-5 year milestones?</li>
  </ul>
  
  <p>For each goal, define specific actions, resources required, potential obstacles, and measures of success. Create a timeline with deadlines to maintain momentum.</p>
  
  <h3>5. Implementation and Refinement: Execute with Flexibility</h3>
  
  <p>Your career roadmap is a living document that should evolve as you progress and as circumstances change:</p>
  
  <ul>
    <li>Schedule quarterly reviews of your progress</li>
    <li>Adjust timelines and actions based on new information</li>
    <li>Celebrate achievements and document lessons learned</li>
    <li>Remain open to unexpected opportunities that align with your values</li>
  </ul>
  
  <p>The most effective career roadmaps balance strategic direction with tactical flexibility.</p>
  
  <h2>Common Career Roadmap Pitfalls to Avoid</h2>
  
  <ul>
    <li><strong>Excessive rigidity:</strong> Planning is important, but clinging to outdated goals despite changing circumstances leads to missed opportunities.</li>
    <li><strong>Neglecting personal values:</strong> Career decisions that conflict with your core values typically lead to dissatisfaction, regardless of external success.</li>
    <li><strong>Comparing to others:</strong> Your roadmap should reflect your unique combination of strengths, values, and interests—not someone else's journey.</li>
    <li><strong>Overlooking development of transferable skills:</strong> In a rapidly changing job market, adaptable capabilities often prove more valuable than narrow technical skills.</li>
  </ul>
  
  <h2>Tools for Effective Career Planning</h2>
  
  <p>Leverage these resources to support your career roadmap development:</p>
  
  <ul>
    <li>Career assessments (Myers-Briggs, StrengthsFinder, etc.)</li>
    <li>Industry reports and trend analyses</li>
    <li>Informational interviews with professionals in target roles</li>
    <li>Career counseling or coaching</li>
    <li>Professional association resources and communities</li>
  </ul>
  
  <h2>Conclusion: Your Roadmap to Meaningful Success</h2>
  
  <p>A thoughtful career roadmap doesn't just help you advance professionally—it ensures that your advancement takes you in a direction aligned with your authentic self. By investing time in this strategic planning process, you're more likely to create a career that provides not just external rewards, but genuine fulfillment.</p>
  
  <p>Remember that your first draft doesn't need to be perfect. Start where you are, use what you have, and refine your plan as you gain experience and clarity. The most important step is simply to begin.</p>
</div>
      `,
      featured_image: "https://images.unsplash.com/photo-1507099985932-87a4520ed1d5",
      category: "career-development",
      tags: ["career planning", "professional development", "goal setting", "career growth"],
      published_at: new Date().toISOString(),
      seo_title: "Building Your Career Roadmap for Success | Strategic Career Planning",
      seo_description: "Learn how to create a strategic career roadmap that aligns with your goals and values for long-term professional growth and success.",
      seo_keywords: "career roadmap, career planning, professional development, career strategy, career goals"
    };
    
    // Calculate reading time
    const readingTime = calculateReadingTime(careerPost.content);
    
    // Check if post already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', careerPost.slug)
      .maybeSingle();
    
    if (!existingPost) {
      // Insert new post
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          ...careerPost,
          author_id: userId,
          reading_time: readingTime
        });
      
      if (!error) {
        createdCount++;
      } else {
        console.error("Error creating career post:", error);
      }
    }
    
    return createdCount;
  } catch (error) {
    console.error("Error creating career development posts:", error);
    return 0;
  }
}

/**
 * Creates interview preparation blog posts
 * @param userId The user ID creating the posts
 * @returns The number of created posts
 */
export async function createInterviewPreparationPosts(userId: string): Promise<number> {
  try {
    let createdCount = 0;
    
    // Example interview preparation post
    const interviewPost = {
      title: "Mastering the STAR Method for Interview Success",
      slug: "mastering-star-method-interview-success",
      excerpt: "Learn how to effectively use the STAR method to structure compelling interview responses that showcase your skills and experience.",
      content: `
<div class="blog-content">
  <p class="lead">The STAR method is a structured approach to answering behavioral interview questions that helps you provide comprehensive, compelling responses. By mastering this technique, you'll be able to clearly demonstrate your capabilities and stand out from other candidates.</p>
  
  <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df" alt="Professional interview setting" class="featured-image" />
  
  <h2>What is the STAR Method?</h2>
  
  <p>The STAR method is an acronym that stands for:</p>
  
  <ul>
    <li><strong>Situation:</strong> The context or background for your example</li>
    <li><strong>Task:</strong> The specific challenge or responsibility you faced</li>
    <li><strong>Action:</strong> The steps you took to address the situation</li>
    <li><strong>Result:</strong> The outcomes you achieved through your actions</li>
  </ul>
  
  <p>This framework helps you construct complete, focused responses that tell a compelling story about your professional experiences and accomplishments.</p>
  
  <h2>Why the STAR Method Works</h2>
  
  <p>Behavioral interview questions are based on the premise that past performance predicts future behavior. When an interviewer asks questions like "Tell me about a time when..." or "Give me an example of how you handled...", they're looking for specific evidence of your skills and approach.</p>
  
  <p>The STAR method works because it:</p>
  
  <ul>
    <li>Provides structure that keeps your answers concise and relevant</li>
    <li>Ensures you include all essential elements of a complete response</li>
    <li>Helps you present your experience in a logical, easy-to-follow narrative</li>
    <li>Demonstrates your ability to analyze situations and measure results</li>
  </ul>
  
  <div class="callout">
    <h4>Common Behavioral Interview Topics</h4>
    <p>Be prepared to use the STAR method to address questions about:</p>
    <ul>
      <li>Leadership</li>
      <li>Teamwork</li>
      <li>Conflict resolution</li>
      <li>Problem-solving</li>
      <li>Adaptability</li>
      <li>Time management</li>
      <li>Communication</li>
    </ul>
  </div>
  
  <h2>Breaking Down the STAR Components</h2>
  
  <h3>S: Situation</h3>
  
  <p>Start by setting the scene. Provide context for your story that gives the interviewer enough background to understand the complexity and relevance of the situation.</p>
  
  <p><strong>Example:</strong> "In my previous role as Project Manager at XYZ Company, we were facing a critical product launch with an extremely tight deadline. Two weeks before launch, our lead developer unexpectedly went on medical leave."</p>
  
  <h3>T: Task</h3>
  
  <p>Clearly articulate your specific responsibility or challenge in this situation. What was required of you? What obstacles did you face?</p>
  
  <p><strong>Example:</strong> "As the project manager, I needed to ensure the product launched on schedule without compromising quality, despite being down a key team member. This meant reorganizing workloads and maintaining team morale during a stressful period."</p>
  
  <h3>A: Action</h3>
  
  <p>This is the most detailed section of your response. Describe the specific steps you took to address the challenge. Focus on <em>your</em> actions, even if you were working as part of a team.</p>
  
  <p><strong>Example:</strong> "First, I conducted a comprehensive assessment of the remaining tasks and identified the critical path items. Then, I met individually with each team member to reallocate responsibilities based on their strengths and bandwidth. I implemented daily stand-up meetings to increase visibility and quickly address blockers. Additionally, I brought in a contractor with specialized expertise to handle some of the more technical aspects of the absent developer's workload. Throughout the process, I maintained regular communication with stakeholders to manage expectations and provide progress updates."</p>
  
  <h3>R: Result</h3>
  
  <p>Conclude by explaining the outcomes of your actions. Whenever possible, quantify your results with specific metrics or data. Even if the situation didn't end perfectly, highlight what you learned or how you would approach it differently now.</p>
  
  <p><strong>Example:</strong> "As a result of these actions, we successfully launched the product on schedule with all core features intact. The client was extremely satisfied, and we received recognition from our executive team for handling the challenge effectively. Team satisfaction scores actually increased by 15% during this period, as members appreciated the clear communication and support. The experience also led us to develop better contingency planning for future projects."</p>
  
  <h2>Tips for STAR Method Excellence</h2>
  
  <h3>Preparation is Key</h3>
  
  <p>Before your interview, prepare several STAR examples that showcase different skills and situations. Review the job description and company values to identify the most relevant experiences to highlight.</p>
  
  <div class="example-response">
    <h4>Preparing a STAR Response Bank</h4>
    <p>Create a document with 5-7 strong STAR stories that demonstrate different competencies. For each story, write bullet points for each component (Situation, Task, Action, Result) so you can quickly adapt them during the interview.</p>
  </div>
  
  <h3>Be Specific and Concise</h3>
  
  <p>While you need to provide adequate detail, avoid rambling or including irrelevant information. A good STAR response typically takes 1-2 minutes to deliver. Practice timing yourself to ensure you're being concise while still providing a complete answer.</p>
  
  <h3>Focus on Your Individual Contribution</h3>
  
  <p>Even when describing team efforts, clearly articulate your personal role and contributions. Use "I" statements when describing actions you took, and "we" when referring to team outcomes.</p>
  
  <h3>Quantify Results Whenever Possible</h3>
  
  <p>Numbers and specific metrics make your accomplishments more concrete and impressive. Consider how you can quantify your results in terms of:</p>
  
  <ul>
    <li>Percentage improvements</li>
    <li>Time saved</li>
    <li>Money earned or saved</li>
    <li>Customer satisfaction scores</li>
    <li>Team productivity increases</li>
  </ul>
  
  <h3>Adapt to Different Question Types</h3>
  
  <p>While some behavioral questions clearly invite a STAR response, others may be more subtle. Listen carefully to the question and adapt your STAR framework accordingly. Sometimes you might need to emphasize certain components more than others.</p>
  
  <h2>STAR Method Example Responses</h2>
  
  <p>Here are additional examples of how to apply the STAR method to common interview questions:</p>
  
  <h3>Question: "Tell me about a time when you had to work under pressure."</h3>
  
  <div class="example-response">
    <p><strong>Situation:</strong> "During my time at ABC Marketing, our team was unexpectedly given responsibility for a major client campaign when another office closed down."</p>
    
    <p><strong>Task:</strong> "I was tasked with learning the client's brand guidelines, understanding their previous campaign performance, and developing a new strategy—all within two weeks."</p>
    
    <p><strong>Action:</strong> "I immediately scheduled a deep-dive session with the client to understand their expectations. I developed a project plan with clear milestones, created daily focus blocks on my calendar for uninterrupted work, and prioritized tasks based on dependencies. I also leveraged our internal knowledge base to quickly get up to speed on similar past campaigns."</p>
    
    <p><strong>Result:</strong> "We delivered the campaign on time, and it outperformed previous efforts by 22% in terms of engagement. The client specifically mentioned in their feedback how seamless the transition felt, and they've since increased their annual contract value by 30%."</p>
  </div>
  
  <h3>Question: "Describe a situation where you had to resolve a conflict with a colleague."</h3>
  
  <div class="example-response">
    <p><strong>Situation:</strong> "While working on a cross-functional project at DEF Tech, I had a significant disagreement with a colleague from the engineering team about project priorities and timeline."</p>
    
    <p><strong>Task:</strong> "I needed to resolve this conflict constructively to prevent it from impacting the project timeline and team morale."</p>
    
    <p><strong>Action:</strong> "Instead of continuing the debate in the team meeting, I suggested we meet privately to understand each other's perspectives better. During this conversation, I practiced active listening, acknowledging his technical concerns before explaining the business constraints I was working with. We used a whiteboard to map out both sets of priorities and identified areas of overlap and compromise."</p>
    
    <p><strong>Result:</strong> "We developed a revised timeline that accommodated the critical technical requirements while still meeting business deadlines. This compromise approach was presented to the team and adopted. Not only did the project succeed, but my relationship with this colleague strengthened, and we've collaborated effectively on three subsequent projects."</p>
  </div>
  
  <h2>Common STAR Method Mistakes to Avoid</h2>
  
  <ul>
    <li><strong>Choosing weak examples:</strong> Select situations that truly highlight your skills and align with the job requirements</li>
    <li><strong>Neglecting the "Result" component:</strong> Many candidates focus heavily on the situation and action but rush through the outcomes</li>
    <li><strong>Using the same example repeatedly:</strong> Prepare diverse examples to showcase different skills</li>
    <li><strong>Being too general:</strong> Specific details make your stories memorable and credible</li>
    <li><strong>Taking too much credit:</strong> Be honest about team contributions while still highlighting your role</li>
  </ul>
  
  <h2>Conclusion: Practice Makes Perfect</h2>
  
  <p>The STAR method is a powerful tool for interview success, but it requires practice to master. Rehearse your examples out loud, ideally with a friend or mentor who can provide feedback. Record yourself to identify areas for improvement in content and delivery.</p>
  
  <p>By preparing thoughtful STAR responses before your interview, you'll approach behavioral questions with confidence and provide compelling evidence of your capabilities—setting yourself apart as a candidate who not only claims to have certain skills but can prove their effectiveness in real-world situations.</p>
  
  <div class="cta-box">
    <h3>Ready to Enhance Your Interview Skills?</h3>
    <p>Prepare for your next interview with our Resume Optimization tool to ensure your application stands out from the competition.</p>
    <a href="/resume-scoring" class="cta-button">Try Our Free Resume Scanner</a>
  </div>
</div>
      `,
      featured_image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
      category: "interview-preparation",
      tags: ["interview tips", "STAR method", "behavioral interviews", "job search"],
      published_at: new Date().toISOString(),
      seo_title: "Master the STAR Interview Method | Behavioral Interview Success",
      seo_description: "Learn how to use the STAR method to structure compelling interview responses that showcase your skills and experience for interview success.",
      seo_keywords: "STAR method, behavioral interview, interview preparation, job interview tips, structured interview responses"
    };
    
    // Calculate reading time
    const readingTime = calculateReadingTime(interviewPost.content);
    
    // Check if post already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', interviewPost.slug)
      .maybeSingle();
    
    if (!existingPost) {
      // Insert new post
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          ...interviewPost,
          author_id: userId,
          reading_time: readingTime
        });
      
      if (!error) {
        createdCount++;
      } else {
        console.error("Error creating interview post:", error);
      }
    }
    
    return createdCount;
  } catch (error) {
    console.error("Error creating interview preparation posts:", error);
    return 0;
  }
}
