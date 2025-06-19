
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

    // Check which sections have content
    const hasPersonalInfo = formData.personalInfo && formData.personalInfo.trim()
    const hasWorkExperience = formData.workExperience && formData.workExperience.length > 0
    const hasEducation = formData.education && formData.education.length > 0
    const hasSkills = formData.skills && formData.skills.trim()
    const hasAchievements = formData.achievements && formData.achievements.trim()
    const hasAdditional = formData.additionalSections && formData.additionalSections.trim()

    const parsePrompt = `
    You are an expert resume writer and ATS optimization specialist. Your task is to take the user's natural language input about themselves and create a professional, ATS-optimized resume.

    CRITICAL FORMATTING REQUIREMENTS:
    1. ONLY include sections that the user has actually provided information for
    2. CONSOLIDATE related sections together - do NOT create separate sections for similar content:
       - Combine ALL skills (technical skills, soft skills, general skills) into ONE "SKILLS" section
       - Combine ALL achievements, awards, honors into ONE "ACHIEVEMENTS" section
       - Do NOT create separate "TECHNICAL SKILLS" and "SKILLS" sections
       - Do NOT create separate "ACHIEVEMENTS" and "AWARDS" sections
    
    3. Use ONLY these standardized ATS-friendly section headers (exactly as written):
       - [FULL NAME] (as the document title - extract from personal info)
       - CONTACT INFORMATION
       - PROFESSIONAL SUMMARY (brief 2-3 sentence overview if you can extract meaningful career info)
       - PROFESSIONAL EXPERIENCE (only if work experience provided)
       - EDUCATION (only if education provided)
       - SKILLS (combine ALL types of skills here - technical, soft, general)
       - PROJECTS (only if projects mentioned in additional sections)
       - ACHIEVEMENTS (combine awards, honors, achievements here)
       - CERTIFICATIONS (only if certifications mentioned)
       - LANGUAGES (only if languages mentioned)
       - VOLUNTEER EXPERIENCE (only if volunteer work mentioned)
       - HOBBIES AND INTERESTS (only if hobbies mentioned in additional sections)

    4. Section header formatting:
       - Each section header in ALL CAPS
       - Under each header, add a line of equal signs (=) matching header length
       - Use bullet points (•) for all items under sections
       - Consistent spacing between sections

    5. Content enhancement rules:
       - Extract dates, company names, institutions, and organize chronologically (most recent first)
       - Quantify achievements with numbers/percentages where logical
       - Use strong action verbs for responsibilities
       - Ensure ATS-friendly formatting (no special characters, tables, or complex formatting)
       - Make all content professional and polished
       - Keep bullet points concise but impactful

    6. SECTION CONSOLIDATION RULES:
       - NEVER create both "SKILLS" and "TECHNICAL SKILLS" sections
       - NEVER create both "ACHIEVEMENTS" and "AWARDS" sections
       - Combine ALL skill types into ONE unified "SKILLS" section
       - Combine ALL achievements, awards, honors into ONE "ACHIEVEMENTS" section
       - DO NOT create empty sections
       - DO NOT add placeholder text for missing sections
       - ONLY include sections where the user provided actual content

    USER INPUT ANALYSIS:
    ${hasPersonalInfo ? `Personal Info: "${formData.personalInfo}"` : ''}
    ${hasWorkExperience ? `Work Experience: ${formData.workExperience.map((exp: string, i: number) => `\n${i + 1}. ${exp}`).join('')}` : ''}
    ${hasEducation ? `Education: ${formData.education.map((edu: string, i: number) => `\n${i + 1}. ${edu}`).join('')}` : ''}
    ${hasSkills ? `Skills: "${formData.skills}"` : ''}
    ${hasAchievements ? `Achievements: "${formData.achievements}"` : ''}
    ${hasAdditional ? `Additional Information: "${formData.additionalSections}"` : ''}

    PARSING INSTRUCTIONS:
    1. Personal Information: Extract name, contact details, location, email, phone, LinkedIn, website
    2. Work Experience: Parse company, role, dates, location, responsibilities and achievements (ONLY if provided)
    3. Education: Extract institution, degree, field, graduation dates, GPA if mentioned (ONLY if provided)
    4. Skills: Combine ALL skills (technical, soft, general) into ONE unified section (ONLY if provided)
    5. Projects: Extract project names, descriptions, technologies used from additional sections (ONLY if mentioned)
    6. Certifications: Parse certification names, issuers, dates from additional sections (ONLY if mentioned)
    7. Achievements: Combine ALL awards, honors, achievements, accomplishments into ONE section (ONLY if provided)
    8. Languages: Parse languages from additional sections (ONLY if mentioned)
    9. Volunteer: Parse volunteer work from additional sections (ONLY if mentioned)
    10. Hobbies: Parse hobbies and interests from additional sections (ONLY if mentioned)

    Please create a professional, ATS-optimized resume with proper formatting and organization. Include ONLY the sections where the user provided actual information. Consolidate related sections together - do not create separate sections for similar content types.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer and ATS optimization specialist. Create professional, well-formatted resumes from user input. Always use proper ATS formatting with clear sections and bullet points. ONLY include sections where users provided actual content. CONSOLIDATE related sections together - never create separate sections for similar content."
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
