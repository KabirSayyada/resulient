import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import OpenAI from "https://esm.sh/openai@4.17.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // New: Support resume-only or job description scoring
    const { jobDescription, resumeContent, scoringMode } = body;

    if (!resumeContent) {
      return new Response(
        JSON.stringify({
          error: "Resume content is required",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Initialize OpenAI client with the latest SDK
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    let prompt = "";
    if (scoringMode === "resumeOnly") {
      prompt = `
      Analyze this resume with BRUTAL HONESTY, following extremely high industry standards. This analysis should be thorough and critical, with a low baseline for scores.

      RESUME:
      ${resumeContent}
      
      Please estimate the industry this resume best matches. Then, provide a comprehensive scoring breakdown with the following on a scale of 0-100, where 70 is considered decent for a professional resume, and 90+ is exceptional and rare:
      
      1. Overall Score: How well the resume demonstrates candidate qualifications (be very critical)
      2. Keyword Relevance: Appropriate use of industry-specific terminology (penalize generic terms)
      3. Skills Breadth: Range of in-demand technical and soft skills (verify alignment with industry standards)
      4. Experience Duration: Appropriate experience level, gaps in employment history, and relevance
      5. Content Structure: Professional organization, formatting consistency, and readability
      6. ATS Readiness: Compatibility with Applicant Tracking Systems (penalize overformatting)
      
      Additional Scoring Factors (factor these into the appropriate above categories):
      - Length: Penalize if too short (<1 page) or too long (>2 pages for most industries)
      - Completeness: Missing crucial sections like education, experience, skills (severe penalty)
      - Professionalism: Language formality, third-person perspective, no personal pronouns
      - Grammar/Spelling: Any errors should significantly lower scores
      - Prestige Factors: Education institutions, notable employers (globally recognized names)
      - Quantifiable Achievements: Specific metrics and accomplishments (not just responsibilities)
      
      Estimate:
      1. The likely industry this resume targets
      2. Estimated percentile ranking compared to other resumes in this industry (e.g., top 25%)
      3. Number of similar resumes in this industry (approximate, e.g., "about 12,000+")
      4. Suggested missing or in-demand skills to improve competitiveness
      
      Format your response as a JSON object with these fields:
      {
        "overallScore": number,
        "keywordRelevance": number,
        "skillsBreadth": number,
        "experienceDuration": number,
        "contentStructure": number,
        "atsReadiness": number,
        "industry": string,
        "percentile": number,
        "numSimilarResumes": number,
        "suggestedSkills": string[]
      }

      Return ONLY the JSON object, no extra text. BE BRUTALLY HONEST IN YOUR SCORES - most resumes should score below 70 in multiple categories.
      `;
    } else {
      // Default or "jobDescription" mode
      prompt = `
      Analyze this resume against the provided job description with BRUTAL HONESTY and extremely high standards:
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      RESUME:
      ${resumeContent}
      
      Please provide a rigorous analysis with the following scores on a scale of 0-100, where 70 is considered decent, and 90+ is exceptional and rare:
      
      1. Overall Score: Total alignment between resume and job requirements (be very critical)
      2. Keyword Relevance: How precisely the resume uses key terminology from the job description
      3. Skills Breadth: Coverage of required and preferred skills (penalize missing critical skills)
      4. Experience Duration: Appropriate length and relevance of experience for this specific role
      5. Content Structure: Professional organization and readability (penalize poor formatting)
      6. ATS Readiness: How likely the resume is to pass ATS systems for this job
      
      Additional Scoring Factors (factor these into the appropriate above categories):
      - Length: Penalize if too short (<1 page) or too long (>2 pages for most industries)
      - Completeness: Missing crucial sections (severe penalty)
      - Professionalism: Language formality, third-person perspective, no personal pronouns
      - Grammar/Spelling: Any errors should significantly lower scores
      - Prestige Factors: Education institutions, notable employers (globally recognized names)
      - Quantifiable Achievements: Specific metrics and accomplishments (not just responsibilities)
      
      Also determine:
      1. The industry this job belongs to
      2. Critical missing skills that would improve the resume for this specific job
      3. Estimated percentile ranking compared to typical applicants (e.g., top 20%)
      
      Format your response as a JSON object with these fields:
      {
        "overallScore": number,
        "keywordRelevance": number,
        "skillsBreadth": number,
        "experienceDuration": number,
        "contentStructure": number,
        "atsReadiness": number,
        "industry": string,
        "suggestedSkills": string[],
        "percentile": number
      }
      
      Return ONLY the JSON object without any additional text. BE BRUTALLY HONEST IN YOUR SCORES - most resumes should score below 70 in multiple categories when compared to an actual job.
      `;
    }

    // Call OpenAI with the updated SDK
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 1500,
      temperature: 0.3,
    });

    const content = response.choices[0].text?.trim() || "";

    try {
      // Parse the JSON response
      const scoreData = JSON.parse(content);
      // If resumeOnly mode, keep numSimilarResumes for frontend to use in graph
      return new Response(
        JSON.stringify(scoreData),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (error) {
      console.error("Error parsing AI response:", error);
      console.log("Raw AI response:", content);

      return new Response(
        JSON.stringify({
          error: "Failed to process the resume scoring. Please try again.",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
