
import { supabase } from '@/integrations/supabase/client';
import { slugify } from '@/utils/blogUtils';

// Interview preparation blog post topics and content
const interviewPrepPosts = [
  {
    title: "How to Answer 'Tell Me About Yourself' in Job Interviews",
    excerpt: "Master the most common opening interview question with our structured approach and practical examples.",
    content: `
## The Perfect Formula for Introducing Yourself

The "Tell me about yourself" question is almost guaranteed to start any job interview. Despite being predictable, it catches many candidates off-guard. This seemingly casual question is actually your opportunity to set the tone and take control of the interview narrative.

### Why This Question Matters

Interviewers use this question to:
- Ease into the conversation
- Assess your communication skills
- Understand what you consider important about your background
- Determine how well you can structure a response

### The Proven 'Past-Present-Future' Framework

A well-crafted response follows this simple structure:

1. **Past**: Briefly summarize your relevant background and experience
2. **Present**: Highlight your current skills and recent accomplishments
3. **Future**: Connect your aspirations to this specific role

### Example Response for a Marketing Professional

*"I began my career in digital marketing five years ago after completing my marketing degree. I've always been fascinated by the intersection of creativity and data-driven decision making.*

*Currently, I'm a Senior Marketing Specialist at ABC Company, where I've led campaigns that increased conversion rates by 32% over the past year. I specialize in SEO and content strategy, and recently completed Google's Advanced Analytics certification.*

*Looking forward, I'm excited to bring my experience optimizing customer journeys to your team, as I was particularly impressed by your company's innovative approach to personalized marketing. I believe my skills in data analysis and content creation align perfectly with the growth initiatives mentioned in the job description."*

### Key Mistakes to Avoid

- **Too personal**: Don't discuss family, hobbies, or unrelated background
- **Too lengthy**: Aim for 60-90 seconds (about 200-250 words)
- **Unstructured**: Follow a clear narrative arc
- **Reciting your resume**: Add insights, not just a chronological list of jobs

### Preparation Strategies

1. **Research thoroughly**: Understand the company's mission, challenges, and culture
2. **Tailor to the role**: Emphasize experiences most relevant to this position
3. **Practice aloud**: Record yourself and refine until it sounds natural
4. **Prepare triggers**: Have 3-4 key points to remember, not a memorized script

### Final Tips

- **Start strong**: Begin with a confident, engaging opening statement
- **Be authentic**: Your personality should shine through
- **End with enthusiasm**: Express genuine interest in the role
- **Read the room**: Adjust length and detail based on interviewer engagement

Master this question, and you'll set yourself up for success throughout the rest of the interview.
    `,
    image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    tags: ["interview tips", "introduction", "self-presentation", "job hunting"],
    category: "Interview Preparation",
    seo_title: "Perfect 'Tell Me About Yourself' Interview Answer Framework",
    seo_description: "Learn the proven past-present-future formula for answering the most common interview question with confidence and clarity.",
  },
  {
    title: "Top 20 Behavioral Interview Questions and How to Answer Them",
    excerpt: "Prepare for your next interview with expert strategies for answering the most common behavioral questions.",
    content: `
## Mastering Behavioral Interview Questions

Behavioral interview questions have become a standard tool for employers to predict your future performance based on past behavior. The theory is simple: how you handled situations in the past indicates how you'll handle similar situations in the future.

### Why Employers Use Behavioral Questions

These questions help employers assess:
- How you approach challenges
- Your problem-solving methodology
- Your interpersonal skills
- Your ability to reflect on experiences

### The STAR Method: Your Secret Weapon

For any behavioral question, structure your response using the STAR framework:

- **Situation**: Set the context
- **Task**: Describe your responsibility
- **Action**: Explain what you did
- **Result**: Share the outcome

### Top 20 Behavioral Questions with Response Strategies

#### 1. Tell me about a time you faced a significant challenge at work.

**Strategy**: Choose a relevant challenge that demonstrates valuable skills for the role. Focus on your analytical approach and positive attitude.

#### 2. Describe a situation where you had to work under tight deadlines.

**Strategy**: Highlight your prioritization skills, stress management, and ability to maintain quality under pressure.

#### 3. Give an example of a time you had to make a difficult decision.

**Strategy**: Emphasize your decision-making process, consideration of alternatives, and ownership of outcomes.

#### 4. Tell me about a time you had a conflict with a colleague.

**Strategy**: Focus on your communication skills, empathy, and resolution approach rather than the conflict itself.

#### 5. Describe a situation where you demonstrated leadership.

**Strategy**: Choose examples showing your ability to motivate others, take initiative, and achieve results through teamwork.

#### 6. Tell me about a time you failed and what you learned.

**Strategy**: Be honest about the failure, but focus primarily on the lessons learned and how you've applied them since.

#### 7. Give an example of when you had to adapt to a significant change.

**Strategy**: Highlight your flexibility, positive attitude toward change, and ability to thrive in new situations.

#### 8. Describe a time when you exceeded expectations.

**Strategy**: Choose an example that relates to the job you're applying for, with measurable results if possible.

#### 9. Tell me about a time you had to learn something new quickly.

**Strategy**: Showcase your learning agility, resourcefulness, and willingness to step outside your comfort zone.

#### 10. Give an example of a time you persuaded someone to see things your way.

**Strategy**: Emphasize your communication skills, empathy, and evidence-based approach.

#### 11. Describe a situation where you had to solve a complex problem.

**Strategy**: Highlight your analytical thinking, creativity, and systematic approach to problem-solving.

#### 12. Tell me about a time you had to deliver bad news.

**Strategy**: Focus on your communication approach, empathy, and professionalism.

#### 13. Give an example of when you had to work with someone difficult.

**Strategy**: Emphasize your patience, communication strategies, and focus on shared goals.

#### 14. Describe a time when you showed initiative.

**Strategy**: Choose an example that demonstrates your proactivity and willingness to go beyond your job description.

#### 15. Tell me about a time you had to prioritize multiple projects.

**Strategy**: Highlight your organizational skills, decision-making process, and ability to communicate effectively about priorities.

#### 16. Give an example of a time you received constructive criticism.

**Strategy**: Demonstrate your openness to feedback, self-awareness, and commitment to growth.

#### 17. Describe a situation where you had to motivate others.

**Strategy**: Showcase your leadership style, understanding of different motivations, and people skills.

#### 18. Tell me about a time you had to work with limited resources.

**Strategy**: Highlight your creativity, resourcefulness, and ability to achieve results despite constraints.

#### 19. Give an example of a time you had to make a decision without all the information.

**Strategy**: Focus on your analytical process, risk assessment, and confidence in decision-making.

#### 20. Describe your proudest professional achievement.

**Strategy**: Choose an achievement relevant to the position, with clear impact and demonstration of key skills.

### Common Mistakes to Avoid

- **Being too vague**: Provide specific, detailed examples
- **Not preparing enough examples**: Have 5-7 versatile stories ready
- **Choosing weak examples**: Select situations that highlight your strengths
- **Focusing too much on the problem**: Spend more time on actions and results
- **Not adapting to the role**: Tailor your examples to the position

### Final Preparation Tips

1. **Research the company culture**: Understand what behaviors they value
2. **Analyze the job description**: Identify key competencies they're seeking
3. **Practice aloud**: Rehearse your stories until they flow naturally
4. **Keep stories concise**: Aim for 1-2 minutes per response
5. **Be honest**: Authenticity resonates more than perfect but fabricated stories

With thorough preparation using the STAR method and these strategies, you'll be ready to tackle any behavioral question with confidence.
    `,
    image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    tags: ["behavioral interviews", "STAR method", "interview questions", "interview preparation"],
    category: "Interview Preparation",
    seo_title: "20 Behavioral Interview Questions: Complete Answer Guide",
    seo_description: "Master the STAR method and prepare expert answers for the top 20 behavioral interview questions that hiring managers ask.",
  },
  {
    title: "7 Expert Strategies for Answering Technical Interview Questions",
    excerpt: "Learn proven techniques to tackle challenging technical questions with confidence in your next job interview.",
    content: `
## Mastering Technical Interview Questions

Technical interviews can be among the most challenging parts of the job application process. Whether you're a software developer, engineer, financial analyst, or healthcare professional, employers use technical questions to assess your specialized knowledge and problem-solving abilities.

### Understanding the Purpose of Technical Questions

Interviewers use technical questions to evaluate:
- Your depth of knowledge in your field
- Your problem-solving methodology
- How you think under pressure
- Your communication skills when discussing complex topics

### Strategy #1: Think Aloud

One of the most valuable approaches to technical questions is verbalizing your thought process.

**Why it works:**
- Demonstrates your analytical thinking
- Shows interviewers how you approach problems
- Gives them insight into your reasoning
- Allows them to provide hints if you're on the wrong track

**Example implementation:**
"I'll start by understanding what we're trying to accomplish here... The first approach that comes to mind is... Let me consider the edge cases..."

### Strategy #2: Clarify Before Solving

Never rush into answering a technical question before fully understanding what's being asked.

**Steps to clarify:**
1. Paraphrase the question back to confirm understanding
2. Ask about constraints or specific requirements
3. Confirm what a successful solution looks like
4. Discuss any assumptions you're making

**Example clarification:**
"So I understand you're asking me to design a system that... Are there any performance constraints I should consider? What volume of data should this handle?"

### Strategy #3: Structure Your Response

For complex technical questions, follow a clear structure:

1. **Understand**: Restate the problem and ask clarifying questions
2. **Plan**: Outline your approach before diving into details
3. **Execute**: Implement your solution step by step
4. **Review**: Evaluate your answer for correctness and efficiency

This structure helps you organize your thoughts and demonstrates methodical thinking.

### Strategy #4: Start Simple, Then Optimize

Begin with a working solution before optimizing.

**The approach:**
1. Start with a brute-force or naive solution
2. Explain that it's a starting point
3. Analyze limitations and inefficiencies
4. Progressively refine toward a more optimal solution

**Why it works:**
- Shows you can create working solutions
- Demonstrates your understanding of performance considerations
- Highlights your iterative improvement process

### Strategy #5: Use Relevant Examples

Connect theoretical concepts to real-world applications.

**Implementation tips:**
- Draw from your professional experience
- Relate to industry-standard practices
- Describe scenarios where you've applied similar concepts
- Discuss alternatives and why you chose a specific approach

**Example in practice:**
"When I faced a similar challenge at my previous position, I implemented... This approach was effective because..."

### Strategy #6: Handle "I Don't Know" Gracefully

Not knowing an answer isn't automatic failure if handled properly.

**Steps when you don't know:**
1. Acknowledge what you don't know
2. Share what you do know about related concepts
3. Describe how you would find the answer
4. If possible, work through a similar problem you're familiar with

**Example response:**
"I haven't worked directly with that technology, but I'm familiar with similar concepts in... Here's how I would approach learning about this..."

### Strategy #7: Practice Active Listening

Technical interviews are dialogues, not monologues.

**How to implement:**
- Pay attention to interviewer reactions
- Watch for hints or guidance
- Ask if you're on the right track
- Be willing to pivot based on feedback

**Example in action:**
"Based on your question about scalability, should I focus more on the distributed aspect of this solution?"

### Preparing for Different Types of Technical Questions

#### Coding/Programming Questions
- Practice on platforms like LeetCode, HackerRank
- Review core algorithms and data structures
- Understand time and space complexity
- Practice writing clean, readable code

#### Design Questions
- Study system design patterns and architectures
- Prepare to discuss tradeoffs between different approaches
- Practice whiteboarding complex systems
- Consider scalability, reliability, and maintainability

#### Knowledge-Based Questions
- Review fundamental concepts in your field
- Stay current with industry developments
- Prepare concise explanations of complex topics
- Connect theoretical knowledge to practical applications

#### Case Studies
- Practice analyzing business or technical scenarios
- Develop frameworks for approaching different types of problems
- Prepare to justify recommendations with data and reasoning
- Practice presenting solutions clearly and confidently

### Final Preparation Tips

1. **Research company-specific technical challenges**: Understand what problems the company is solving
2. **Practice with peers**: Conduct mock interviews with colleagues
3. **Record yourself**: Review your explanations for clarity
4. **Time your responses**: Aim for concise, complete answers
5. **Review fundamentals**: Solid grasp of basics is often more important than specialized knowledge

By implementing these seven strategies, you'll approach technical interviews with greater confidence and demonstrate not just what you know, but how effectively you can apply your knowledge to solve real-world problems.
    `,
    image_url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    tags: ["technical interviews", "problem-solving", "coding interviews", "whiteboard interviews"],
    category: "Interview Preparation",
    seo_title: "Technical Interview Question Strategies: Expert Guide",
    seo_description: "Master 7 proven strategies for answering technical interview questions with confidence, clarity, and expertise in any professional field.",
  },
  {
    title: "The Ultimate Guide to Body Language in Job Interviews",
    excerpt: "Learn how to use non-verbal communication to make a powerful impression and build rapport with interviewers.",
    content: `
## Mastering Non-Verbal Communication in Interviews

While your words matter in an interview, research suggests that up to 55% of communication is non-verbal. Your body language can either reinforce your message or contradict it entirely. Learning to control these signals can give you a significant edge in the interview process.

### The Science Behind Body Language

Our brains process non-verbal cues largely at the subconscious level:

- **Fast processing**: We form impressions within milliseconds
- **Emotional connection**: Body language establishes trust and rapport
- **Authenticity check**: Non-verbal cues help assess truthfulness
- **Confidence indicator**: Posture and gestures signal self-assurance

Understanding and mastering these signals can dramatically improve your interview outcomes.

### First Impressions: The Critical First 7 Seconds

#### The Handshake (Post-Pandemic Considerations)

In settings where handshakes are appropriate:
- Use firm but not crushing pressure
- Maintain 2-3 seconds of contact
- Include a slight up-down motion
- Make eye contact during the handshake

Alternative greetings:
- A confident head nod with a smile
- A slight bow from the shoulders
- A hand over heart gesture

#### Entrance and Seating

- Enter the room with purpose and confidence
- Wait to be invited to sit or ask politely
- Sit fully back in the chair with good posture
- Keep feet flat on the floor or crossed at the ankles

### Power Posture: Projecting Confidence

#### Upper Body

- **Shoulders**: Keep them back and relaxed, not hunched
- **Chest**: Slightly open, not concave
- **Back**: Straight but not rigid, about 1 inch from chair back
- **Arms**: Uncrossed, either loosely in lap or on chair arms

#### Lower Body

- **Feet**: Planted firmly on floor about hip-width apart
- **Legs**: Uncrossed or crossed at ankles (avoid knee crossing)
- **Position**: Slight forward lean when engaged
- **Movement**: Minimal fidgeting or bouncing

### Hand Gestures: Enhancing Your Message

Effective gestures:
- **Open palms**: Indicates honesty and openness
- **Steepling fingers**: Projects confidence and expertise
- **Measured gestures**: Emphasizes key points
- **Hand visibility**: Keep hands visible, not hidden

Gestures to avoid:
- **Touching face/hair**: Suggests nervousness or deception
- **Fidgeting with items**: Indicates anxiety
- **Crossed arms**: Creates impression of defensiveness
- **Excessive movement**: Can be distracting

### Eye Contact: The Connection Builder

- Maintain eye contact for 4-5 seconds at a time
- Use the "triangle technique": Move between both eyes and forehead
- In panel interviews, address primary questioner but include others
- Break contact occasionally to appear thoughtful, not intimidated

### Facial Expressions: Emotional Intelligence

- **Authentic smile**: Involves both mouth and eyes (crow's feet)
- **Active listening face**: Slight nod, eyebrows showing interest
- **Thoughtful expression**: Brief pause with slightly raised eyebrows
- **Mirroring**: Subtly match interviewer's expression when appropriate

### Mirroring and Matching: Building Rapport

- Subtly match interviewer's:
  - Tempo and volume of speech
  - Energy level
  - Body positioning
  - Vocabulary style

**Important**: Mirroring should be subtle and natural, not obvious mimicry.

### Virtual Interview Body Language

Special considerations for video interviews:
- **Camera position**: At eye level or slightly above
- **Background**: Professional and uncluttered
- **Lighting**: Even light source in front of you
- **Frame yourself**: Show head, shoulders, and upper chest
- **Look at camera**: Not at interviewer's image
- **Posture**: Sit up straight, lean slightly forward
- **Gesture containment**: Keep hand movements within frame
- **Technical preparation**: Test equipment in advance

### Common Body Language Mistakes

#### Nervousness Signals

- Rapid blinking
- Shallow breathing
- Throat clearing
- Lip licking
- Hair touching
- Watch checking

#### Disinterest Signals

- Slumped posture
- Minimal eye contact
- Checking phone/watch
- Distracted gaze
- Flat affect
- Excessive stillness

#### Overconfidence Signals

- Dominating personal space
- Interrupting
- Overly relaxed posture
- Excessive gesturing
- Looking around the room
- Touching interviewer's belongings

### Practice Techniques

1. **Record yourself**: Practice interviews on video to identify habits
2. **Mirror practice**: Rehearse responses while watching your expressions
3. **Feedback partner**: Ask for honest input on your non-verbal cues
4. **Virtual setup**: Test and perfect your video interview environment
5. **Power posing**: Practice confidence poses before interviews

### Adapting to Different Interview Formats

#### Panel Interviews

- Acknowledge all panelists initially
- Direct answers primarily to the questioner
- Include others with occasional eye contact
- Position yourself to see all panelists without turning dramatically

#### Casual Interviews

- Maintain professionalism despite informal setting
- Stay engaged even if interviewer is relaxed
- Keep boundaries appropriate regardless of setting
- Adapt to but don't mimic excessive casualness

### Final Body Language Checklist

Before your interview:
- Practice power poses privately for 2 minutes
- Take deep breaths to center yourself
- Check your appearance one final time
- Turn off phone completely, not just silent
- Prepare your entrance and greeting

During your interview:
- Check your posture every few minutes
- Maintain appropriate eye contact
- Use hands to emphasize key points
- Show active listening when not speaking
- Match your facial expression to your message

By mastering these non-verbal communication techniques, you'll complement your verbal responses and create a powerful, consistent impression that resonates with interviewers long after the questions end.
    `,
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    tags: ["body language", "non-verbal communication", "interview techniques", "professional presence"],
    category: "Interview Preparation",
    seo_title: "Body Language in Interviews: Complete Expert Guide",
    seo_description: "Learn how to use powerful non-verbal communication techniques to make lasting impressions and build rapport during job interviews.",
  },
  {
    title: "How to Answer the 'What's Your Greatest Weakness?' Interview Question",
    excerpt: "Transform this tricky question into an opportunity to demonstrate self-awareness and growth with our strategic framework.",
    content: `
## Mastering the "Greatest Weakness" Question

The "What's your greatest weakness?" question remains one of the most challenging and feared interview moments. While it may feel like a trap, this question actually offers a strategic opportunity to demonstrate self-awareness, growth mindset, and professional maturity.

### Why Interviewers Ask This Question

Understanding the interviewer's motivation helps frame your response:
- To assess your self-awareness and honesty
- To evaluate your capacity for self-improvement
- To determine how you handle vulnerability
- To check if you've prepared thoughtfully for the interview

### The Strategic Framework for Your Answer

Follow this four-part structure for an effective response:

#### 1. Select an Authentic, Professional Weakness

Choose a skill or trait that:
- Is genuinely an area for improvement
- Is not central to the core job function
- Has a clear path to improvement
- Demonstrates professional relevance

**Examples of good weakness areas:**
- Public speaking/presentation skills
- Delegation
- Detail orientation (for big-picture roles) or strategic thinking (for detail-oriented roles)
- Specific technical skills that aren't central requirements
- Work/life balance management
- Receiving feedback
- Patience with long processes

**Weaknesses to avoid:**
- Character flaws ("I'm dishonest")
- Core job requirements ("I struggle with coding" for a developer role)
- Clichéd non-weaknesses ("I'm a perfectionist" or "I work too hard")
- Personal issues unrelated to work
- Anything suggesting you're difficult to manage

#### 2. Show Self-Awareness and Context

Briefly explain the weakness with specific context:
- How you identified this area for improvement
- How it has manifested in professional settings
- Why you recognize it as important to address

**Example:**
*"I've recognized that I sometimes find it challenging to delegate tasks to others. In my previous role as a project manager, I noticed I was taking on too many tasks myself rather than distributing them across the team."*

#### 3. Describe Your Improvement Actions

This is the most important section. Detail:
- Specific steps you've taken to address the weakness
- Tools or resources you've utilized
- Measurable progress you've made
- Ongoing efforts for continued growth

**Example:**
*"To address this, I created a delegation framework that helps me identify which tasks are appropriate to delegate and to whom. I also enrolled in a leadership course that included modules on effective delegation. I've been maintaining a 'delegation log' to track what I assign and the outcomes, which has helped me build trust in my team's capabilities."*

#### 4. Share Results and Continuing Growth

Conclude with:
- Tangible improvements you've achieved
- Remaining areas for growth
- How this growth mindset will benefit the prospective employer

**Example:**
*"As a result, I've increased my delegation by about 40% over the past six months, which has not only made our team more efficient but has also allowed team members to develop new skills. I'm still working on delegating high-visibility projects, but I'm making steady progress. I believe this growth area has actually made me a more effective leader and would help me build strong teams here as well."*

### Sample Answers for Different Scenarios

#### For a Management Position

**Weakness: Strategic thinking when focused on operations**

*"While I excel at operational execution, I've recognized that I sometimes focus so intently on immediate tasks that I miss opportunities for strategic improvements. After receiving this feedback from my previous director, I instituted a personal practice of blocking 2 hours weekly for strategic planning and enrolled in a business strategy course. I now regularly contribute strategic insights during leadership meetings, recently proposing a process change that reduced department costs by 12%. I'm still developing this muscle and have started mentoring with our VP of Strategy to continue my growth in this area."*

#### For a Technical Role

**Weakness: Documentation**

*"I've identified that comprehensive documentation hasn't always been my strength. As a developer focused on solving problems, I would sometimes move to the next challenge before thoroughly documenting my work. Recognizing how this affected knowledge transfer, I implemented a personal documentation-first approach, creating templates for different types of code solutions. I also adopted a practice of reviewing documentation as part of my definition of 'done.' My team lead noted in my last review that my documentation quality has improved significantly, though I'm still refining this skill by studying examples of exceptional documentation and building it into my workflow from the start rather than as an afterthought."*

#### For an Entry-Level Position

**Weakness: Speaking up in meetings**

*"As someone early in my career, I've noticed I sometimes hesitate to contribute ideas in group settings, particularly with senior colleagues present. To address this, I joined Toastmasters six months ago and have been practicing structured participation in my current internship by preparing at least one question or comment before each meeting. My supervisor has commented on my increased engagement, and I recently had my suggestion for improving our customer intake form implemented. I'm still working on spontaneous contributions, but I'm making consistent progress and understand how important this skill is for adding value to team discussions."*

### Advanced Techniques for Experienced Candidates

#### The Evolution Approach

For senior roles, consider discussing how your weaknesses have evolved:

*"Earlier in my career, my weakness was taking on too much work personally. As I moved into leadership, I developed strong delegation skills, but then faced a new challenge: providing sufficiently detailed guidance when delegating. I've addressed this by creating comprehensive delegation protocols and check-in structures. My current development area is balancing oversight with empowerment—knowing when to step back completely versus when to maintain involvement."*

#### The Contextual Weakness

For career changers or role transitions, acknowledge context-specific challenges:

*"Coming from a startup environment to a larger organization like yours, I recognize my weakness in navigating formal approval processes. In preparation for this transition, I've studied enterprise governance frameworks and consulted with mentors from larger companies about effective stakeholder management. I've already implemented more structured documentation in my current role to build this muscle, though I know there will be a learning curve as I adapt to your specific processes."*

### Handling Follow-Up Questions

Be prepared for probing questions:
- "Can you give a specific example of how this weakness affected your work?"
- "What feedback have you received about this area?"
- "How would your current manager describe this weakness?"

Have concrete examples ready that demonstrate both the weakness and your improvement efforts.

### Common Mistakes to Avoid

- **Memorizing a script**: Sound authentic, not rehearsed
- **Being too brief**: Provide sufficient detail about your improvement actions
- **Focusing too much on the weakness**: Spend 70% of your answer on improvement actions and results
- **Choosing a weakness unrelated to work**: Keep it professionally relevant
- **Avoiding the question**: Don't try to reframe it as a strength without acknowledging the real weakness

### Final Preparation Steps

1. **Write out your full answer**: Include all four components
2. **Practice aloud**: Record yourself to assess authenticity and clarity
3. **Get feedback**: Ask a trusted colleague or mentor for input
4. **Prepare alternatives**: Have 2-3 different weakness examples ready
5. **Customize for the role**: Adjust your example based on the specific position

By approaching this challenging question with a strategic framework, you transform it from a dreaded obstacle into an opportunity to demonstrate your self-awareness, growth mindset, and professional maturity—qualities highly valued by virtually all employers.
    `,
    image_url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    tags: ["interview questions", "weakness question", "self-improvement", "interview strategy"],
    category: "Interview Preparation",
    seo_title: "Perfect 'Greatest Weakness' Interview Answer Framework",
    seo_description: "Learn the proven 4-step framework for answering the 'What's your greatest weakness?' interview question with confidence and strategic insight.",
  }
];

/**
 * Creates interview preparation blog posts in the database
 * @param userId - The user ID to associate with the posts
 * @returns Success status and message
 */
export const createInterviewPrepPosts = async (userId: string) => {
  try {
    // Get existing posts to avoid duplicates
    const { data: existingPosts } = await supabase
      .from('blog_posts')
      .select('slug');
    
    const existingSlugs = new Set(existingPosts?.map(post => post.slug) || []);
    
    // Process each post
    for (const post of interviewPrepPosts) {
      const slug = slugify(post.title);
      
      // Skip if post with same slug already exists
      if (existingSlugs.has(slug)) {
        console.log(`Post with slug "${slug}" already exists. Skipping.`);
        continue;
      }
      
      // Current timestamp
      const now = new Date().toISOString();
      
      // Insert post into database
      const { error } = await supabase.from('blog_posts').insert({
        title: post.title,
        slug,
        content: post.content,
        excerpt: post.excerpt,
        author_id: userId,
        category: post.category,
        tags: post.tags,
        image_url: post.image_url,
        created_at: now,
        updated_at: now,
        published_at: now,
        seo_title: post.seo_title || post.title,
        seo_description: post.seo_description || post.excerpt
      });
      
      if (error) {
        console.error(`Error creating post "${post.title}":`, error);
        return { success: false, message: `Error creating posts: ${error.message}` };
      }
    }
    
    return { success: true, message: 'Interview preparation posts created successfully' };
  } catch (error) {
    console.error('Error in createInterviewPrepPosts:', error);
    return { success: false, message: `Unexpected error: ${error.message}` };
  }
};
