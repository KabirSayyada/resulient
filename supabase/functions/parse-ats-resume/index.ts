
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
    const { formData } = await req.json()

    // Validate inputs
    if (!formData) {
      throw new Error('Form data is required')
    }

    const openAiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAiKey) {
      throw new Error('OpenAI API key not found')
    }

    const openai = new OpenAI({
      apiKey: openAiKey,
    })

    console.log('Parsing ATS resume from user input...')

    const parsePrompt = `
    You are an expert resume writer and ATS optimization specialist. Your task is to take the user's natural language input about themselves and create a professional, ATS-optimized resume.

    CRITICAL FORMATTING REQUIREMENTS:
    1. Use ONLY these standardized section headers (exactly as written):
       - [FULL NAME] (as the document title)
       - CONTACT INFORMATION
       - PROFESSIONAL SUMMARY (brief 2-3 sentence overview)
       - PROFESSIONAL EXPERIENCE (for work history)
       - EDUCATION
       - TECHNICAL SKILLS (if technical skills mentioned)
       - SKILLS (for general skills)
       - PROJECTS (if projects mentioned)
       - CERTIFICATIONS (if certifications mentioned)
       - ACHIEVEMENTS (for accomplishments and awards)
       - VOLUNTEER EXPERIENCE (if volunteer work mentioned)
       - LANGUAGES (if languages mentioned)

    2. Section header formatting:
       - Each section header in ALL CAPS
       - Under each header, add a line of equal signs (=) matching header length
       - Use bullet points (•) for all items under sections
       - Consistent spacing between sections

    3. Content enhancement rules:
       - Extract dates, company names, institutions, and organize chronologically (most recent first)
       - Quantify achievements with numbers/percentages where logical
       - Use strong action verbs for responsibilities
       - Ensure ATS-friendly formatting (no special characters, tables, or complex formatting)
       - Make all content professional and polished
       - Keep bullet points concise but impactful

    PARSING INSTRUCTIONS:
    1. Personal Information: Extract name, contact details, location, email, phone, LinkedIn, website
    2. Work Experience: Parse company, role, dates, location, responsibilities and achievements
    3. Education: Extract institution, degree, field, graduation dates, GPA if mentioned
    4. Skills: Categorize into technical skills and general skills
    5. Projects: Extract project names, descriptions, technologies used
    6. Certifications: Parse certification names, issuers, dates
    7. Achievements: Extract accomplishments, awards, recognitions
    8. Additional: Parse volunteer work, languages, other relevant information

    User Input:
    Personal Info: "${formData.personalInfo}"
    Work Experience: ${formData.workExperience.map((exp: string, i: number) => `\n${i + 1}. ${exp}`).join('')}
    Education: ${formData.education.map((edu: string, i: number) => `\n${i + 1}. ${edu}`).join('')}
    Skills: "${formData.skills}"
    Achievements: "${formData.achievements}"
    Additional: "${formData.additionalSections}"

    Please create a professional, ATS-optimized resume with proper formatting and organization. Make sure all information is accurately extracted and professionally presented.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer and ATS optimization specialist. Create professional, well-formatted resumes from user input. Always use proper ATS formatting with clear sections and bullet points."
        },
        {
          role: "user",
          content: parsePrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })

    const optimizedResume = completion.choices[0].message.content;
    
    if (!optimizedResume) {
      throw new Error('Failed to generate resume')
    }

    console.log('Successfully generated ATS-optimized resume')

    return new Response(
      JSON.stringify({ optimizedResume }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in parse-ats-resume function:', error)
    
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
