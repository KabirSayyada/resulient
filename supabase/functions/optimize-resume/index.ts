
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
    As an expert ATS optimization specialist, optimize this resume against the job description with STRICT LIMITATIONS on what you can add or modify.

    CRITICAL RULES - DO NOT VIOLATE:
    1. NEVER add sections that don't exist in the original resume (Education, Certifications, specific companies, degrees, etc.)
    2. NEVER add placeholder text like "[Company Name]", "[Year]", "[Certification Name]", "TBD", etc.
    3. NEVER invent specific experiences, companies, schools, certifications, or achievements
    4. NEVER add sensitive information like specific workplace names, educational institutions, or credentials not mentioned
    5. ONLY enhance and rewrite existing content for better ATS compatibility
    6. ONLY add general, non-sensitive sections if they don't exist but are crucial (like TECHNICAL SKILLS)

    WHAT YOU CAN DO:
    - Rewrite existing bullet points with stronger action verbs and quantified results
    - Reorganize existing content for better ATS readability
    - Add relevant keywords from job description to existing experiences (naturally)
    - Improve formatting with standard ATS section headers
    - Add a TECHNICAL SKILLS section if it doesn't exist (using only skills mentioned in existing content)
    - Enhance existing achievements with better formatting and stronger language

    MANDATORY ATS FORMATTING:
    1. Use ONLY these standardized section headers (exactly as written):
       - PROFESSIONAL SUMMARY (if summary/objective exists in original)
       - PROFESSIONAL EXPERIENCE (for work experience)
       - TECHNICAL SKILLS (only if skills are mentioned in original content or crucial for role)
       - EDUCATION (ONLY if education section exists in original)
       - PROJECTS (ONLY if projects section exists in original)
       - CERTIFICATIONS (ONLY if certifications exist in original)
       - ACHIEVEMENTS (ONLY if achievements/awards exist in original)

    2. Section header formatting:
       - Each section header in ALL CAPS
       - Under each header, add a line of equal signs (=) matching header length
       - Use bullet points (•) for all items under sections
       - Consistent spacing between sections

    3. Content enhancement rules:
       - Match keywords from job description naturally within existing experiences
       - Quantify existing achievements with numbers/percentages where logical
       - Use strong action verbs for existing responsibilities
       - Ensure ATS-friendly formatting (no special characters, tables, or complex formatting)

    EXAMPLE of what NOT to do:
    ❌ Adding "CERTIFICATIONS" section if none exist in original
    ❌ Adding "Bachelor's Degree - [University Name]" if education not mentioned
    ❌ Adding "Google Cloud Certified - [Year]" if no certifications mentioned
    ❌ Adding placeholder companies like "[Previous Company] - Software Developer"

    EXAMPLE of what TO do:
    ✅ Rewriting "Worked on software projects" to "Developed and maintained software applications, improving system performance by implementing efficient algorithms"
    ✅ Adding TECHNICAL SKILLS section with "JavaScript, Python, SQL" if these are mentioned in existing experience
    ✅ Improving "Managed team" to "Led cross-functional team of 5 developers, resulting in 25% faster project delivery"

    After optimizing, identify any missing qualifications from the job description that the candidate would need to genuinely acquire (don't suggest adding fake credentials).

    Job Description:
    ${jobDescription}

    Original Resume:
    ${resumeContent}

    Please respond with a JSON object containing the optimized resume and qualification gaps:
    {
      "optimizedResume": "the conservatively optimized resume content with proper ATS formatting",
      "qualificationGaps": [
        {
          "skill": "qualification name",
          "importance": "Critical/Important/Nice to have",
          "howToAcquire": "honest advice on how to genuinely acquire this qualification"
        }
      ]
    }
    `

    // Use the correct method for the new OpenAI version
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS optimization specialist. You MUST be conservative and never add sensitive information, placeholders, or sections that don't exist in the original resume. Focus on enhancing existing content only. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.3, // Lower temperature for more conservative responses
      max_tokens: 2500,
      response_format: { type: "json_object" }
    })

    const response = JSON.parse(completion.choices[0].message.content);
    
    if (!response.optimizedResume || !response.qualificationGaps) {
      throw new Error('Failed to generate complete analysis')
    }

    console.log('Successfully generated conservative resume optimization')
    console.log(`Found ${response.qualificationGaps.length} genuine qualification gaps`)

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
