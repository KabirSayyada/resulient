
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.20.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { jobDescription, resumeContent } = await req.json()

    // Validate inputs
    if (!jobDescription || !resumeContent) {
      throw new Error('Job description and resume content are required')
    }

    const openAiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAiKey) {
      throw new Error('OpenAI API key not found')
    }

    const openai = new OpenAI({
      apiKey: openAiKey,
    })

    console.log('Analyzing resume and job description...')

    const analysisPrompt = `
    As an expert ATS optimization specialist and career advisor, analyze this resume against the job description.
    
    CRITICAL ATS FORMATTING REQUIREMENTS:
    1. Use ONLY these standardized section headers (exactly as written):
       - PROFESSIONAL SUMMARY (not "Summary", "Objective", "Profile", etc.)
       - PROFESSIONAL EXPERIENCE (not "Work Experience", "Experience", "Employment History", etc.)
       - TECHNICAL SKILLS (not "Skills", "Core Competencies", "Competencies", etc.)
       - EDUCATION (exactly this, not "Academic Background", "Qualifications", etc.)
       - PROJECTS (if applicable)
       - CERTIFICATIONS (if applicable, not "Certificates", "Credentials", etc.)
       - ACHIEVEMENTS (if applicable, not "Accomplishments", "Awards", etc.)
    
    2. MANDATORY formatting rules:
       - Each section header must be in ALL CAPS
       - Under each section header, add a line of equal signs (=) the same length as the header
       - Use bullet points (•) or dashes (-) for ALL items under sections when there are multiple items
       - For PROFESSIONAL EXPERIENCE: Each job should have company/title on one line, then bullet points for responsibilities
       - For TECHNICAL SKILLS: Use bullet points or commas to separate different skills/categories
       - For EDUCATION: Each degree/institution should be on separate lines with bullet points if multiple entries
       - For CERTIFICATIONS: Use bullet points for each certification
       - Ensure consistent spacing between sections
    
    3. Content optimization:
       - Match keywords from the job description naturally
       - Quantify achievements with numbers, percentages, or dollar amounts where possible
       - Use strong action verbs (led, developed, implemented, improved, etc.)
       - Ensure all content is ATS-friendly (no special characters, tables, or complex formatting)
    
    4. Structure example:
    ```
    [Name]
    [Contact Information: Email | Phone | LinkedIn | Location]
    
    PROFESSIONAL SUMMARY
    =====================================
    [2-3 lines summarizing key qualifications and value proposition]
    
    PROFESSIONAL EXPERIENCE
    =========================================
    Job Title - Company Name
    Start Date - End Date | Location
    • Achievement-focused bullet point with quantified results
    • Another accomplishment using strong action verbs
    • Technical skills and tools used in this role
    
    TECHNICAL SKILLS
    ==============================
    • Programming Languages: [list]
    • Frameworks & Tools: [list]
    • Databases: [list]
    
    EDUCATION
    ===================
    Degree - Institution Name
    Graduation Date | Location
    • Relevant coursework or achievements if applicable
    ```
    
    After optimizing the resume content, identify any missing but important qualifications from the job description
    that might be sensitive or require verification (certifications, specific experiences, etc.).
    For each gap, provide:
    1. What qualification/skill is missing
    2. How important it is (Critical/Important/Nice to have)
    3. Constructive advice on how to acquire it
    
    Format the gaps analysis as a JSON array of objects with these fields:
    {
      "skill": "qualification name",
      "importance": "importance level",
      "howToAcquire": "advice"
    }

    Remember to be encouraging and empowering in the advice, suggesting practical ways to gain these qualifications.

    Job Description:
    ${jobDescription}

    Original Resume:
    ${resumeContent}

    Response format:
    {
      "optimizedResume": "the optimized resume content with proper ATS section headers and formatting",
      "qualificationGaps": [gap objects array]
    }
    `

    // Use the correct method for the new OpenAI version
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS optimization specialist and career advisor. You MUST follow the exact formatting requirements for section headers and use proper bullet points throughout the resume."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: "json_object" }
    })

    const response = JSON.parse(completion.choices[0].message.content);
    
    if (!response.optimizedResume || !response.qualificationGaps) {
      throw new Error('Failed to generate complete analysis')
    }

    console.log('Successfully generated optimized resume and qualification gaps analysis')
    console.log(`Found ${response.qualificationGaps.length} qualification gaps`)

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in optimize-resume function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
