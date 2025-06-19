
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
          content: "You are an expert ATS optimization specialist. You MUST be conservative and never add sensitive information, placeholders, or sections that don't exist in the original resume. Focus on enhancing existing content only. Always respond with valid JSON format. ENSURE the optimizedResume field contains the complete, full resume content without any truncation."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.3, // Lower temperature for more conservative responses
      max_tokens: 3500, // Increased to ensure complete resume content
      response_format: { type: "json_object" }
    })

    const responseContent = completion.choices[0].message.content;
    
    if (!responseContent) {
      throw new Error('No response content from OpenAI');
    }

    let response;
    try {
      response = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Response content:', responseContent);
      throw new Error('Failed to parse AI response as JSON');
    }
    
    if (!response.optimizedResume || !response.qualificationGaps) {
      console.error('Invalid response structure:', response);
      throw new Error('Failed to generate complete analysis - missing required fields');
    }

    console.log('Successfully generated conservative resume optimization');
    console.log(`Found ${response.qualificationGaps.length} genuine qualification gaps`);

    // Enhanced cleaning to ensure complete content preservation
    let cleanOptimizedResume = response.optimizedResume;
    
    // Validate that we have substantial content
    if (!cleanOptimizedResume || cleanOptimizedResume.length < 50) {
      console.error('Optimized resume content is too short or empty:', cleanOptimizedResume);
      throw new Error('Generated resume content appears incomplete');
    }
    
    // If optimizedResume is somehow an object, convert it to string
    if (typeof cleanOptimizedResume === 'object') {
      try {
        cleanOptimizedResume = JSON.stringify(cleanOptimizedResume);
      } catch (stringifyError) {
        console.error('Error stringifying optimized resume:', stringifyError);
        throw new Error('Failed to process optimized resume content');
      }
    }
    
    // Minimal cleaning - only remove obvious JSON artifacts
    cleanOptimizedResume = String(cleanOptimizedResume);
    
    // Only remove quotes if they wrap the entire content
    if ((cleanOptimizedResume.startsWith('"') && cleanOptimizedResume.endsWith('"')) ||
        (cleanOptimizedResume.startsWith("'") && cleanOptimizedResume.endsWith("'"))) {
      cleanOptimizedResume = cleanOptimizedResume.slice(1, -1);
    }
    
    // Handle escaped characters
    cleanOptimizedResume = cleanOptimizedResume
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r') 
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\');
    
    // Final validation
    cleanOptimizedResume = cleanOptimizedResume.trim();
    
    if (cleanOptimizedResume.length < 50) {
      console.error('Final cleaned resume content is too short:', cleanOptimizedResume.length);
      throw new Error('Resume optimization resulted in incomplete content');
    }

    console.log(`Final optimized resume length: ${cleanOptimizedResume.length} characters`);

    return new Response(
      JSON.stringify({
        optimizedResume: cleanOptimizedResume,
        qualificationGaps: response.qualificationGaps
      }),
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
