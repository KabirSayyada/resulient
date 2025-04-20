
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

    // Create OpenAI client using the new version
    const openai = new OpenAI({
      apiKey: openAiKey,
    })

    console.log('Sending request to OpenAI...')

    const prompt = `
    As an expert ATS (Applicant Tracking System) optimization specialist and professional resume writer, 
    optimize the following resume content to match the job description while maintaining truthfulness. 
    Focus on:
    1. Keyword alignment with the job description
    2. Clear, achievement-focused bullet points
    3. ATS-friendly formatting
    4. Quantifiable results where possible

    Job Description:
    ${jobDescription}

    Original Resume:
    ${resumeContent}

    Please provide the optimized resume content maintaining professional formatting.`

    // Use the correct method for the new OpenAI version
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS optimization specialist and professional resume writer."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const optimizedResume = completion.choices[0].message.content

    if (!optimizedResume) {
      throw new Error('Failed to generate optimized resume')
    }

    console.log('Successfully generated optimized resume')

    return new Response(
      JSON.stringify({ optimizedResume }),
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
