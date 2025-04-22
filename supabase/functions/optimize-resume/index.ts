
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
    First optimize the resume content, then identify any missing but important qualifications from the job description
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
      "optimizedResume": "the optimized resume content",
      "qualificationGaps": [gap objects array]
    }
    `

    // Use the correct method for the new OpenAI version
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS optimization specialist and career advisor."
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
