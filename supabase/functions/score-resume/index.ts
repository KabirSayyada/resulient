
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

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

    // Get API key
    const supabaseAdminClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Call OpenAI API for resume analysis
    const configuration = new Configuration({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });
    const openai = new OpenAIApi(configuration);

    let prompt = "";
    if (scoringMode === "resumeOnly") {
      prompt = `
      Analyze this resume, and benchmark it for modern industry standards.

      RESUME:
      ${resumeContent}
      
      Please estimate the industry this resume best matches. Then, provide a comprehensive scoring breakdown with the following on a scale of 0-100:
      
      1. Overall Score: How well the resume demonstrates candidate fit for the industry
      2. Keyword Relevance: Use of relevant keywords for the industry (do not use a job description)
      3. Skills Breadth: Range of in-demand skills covered
      4. Experience Duration: Appropriateness of experience for typical roles in this space
      5. Content Structure: Quality and clarity of the resume's organization
      6. ATS Readiness: How likely the resume is to pass modern ATS systems
      
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

      Return ONLY the JSON object, no extra text.
      `;
    } else {
      // Default or "jobDescription" mode
      prompt = `
      Analyze this resume against the provided job description:
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      RESUME:
      ${resumeContent}
      
      Please provide a comprehensive analysis of how well this resume matches the job description. Include the following scores on a scale of 0-100:
      
      1. Overall Score: How well the resume matches the job description overall.
      2. Keyword Relevance: How well the resume uses keywords from the job description.
      3. Skills Breadth: The range of relevant skills covered.
      4. Experience Duration: Appropriateness of experience level for the role.
      5. Content Structure: Quality and clarity of the resume's organization.
      6. ATS Readiness: How likely the resume is to pass ATS systems.
      
      Also determine:
      1. The industry this job belongs to.
      2. Suggested missing skills that would improve the resume.
      3. Estimated percentile ranking compared to other candidates (e.g., top 20%).
      
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
      
      Return ONLY the JSON object without any additional text.
      `;
    }

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 1500,
      temperature: 0.3,
    });

    const content = response.data.choices[0].text?.trim() || "";

    try {
      // Parse the JSON response
      const scoreData = JSON.parse(content);
      // If resumeOnly mode, remove numSimilarResumes from response if present as frontend doesn't expect it
      if ("numSimilarResumes" in scoreData) {
        delete scoreData.numSimilarResumes;
      }
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

