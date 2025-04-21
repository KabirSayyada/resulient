
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
      Analyze this resume with BRUTAL HONESTY, following extremely high industry standards. This analysis should be thorough and critical, with a detailed, weighted scoring system.

      RESUME:
      ${resumeContent}
      
      Please provide a comprehensive scoring breakdown using the following weighted criteria:
      
      1. Skills Alignment (25%): Technical and soft skills relevant to the industry.
      2. Work Experience (25%): Company reputation, role relevance, and career progression. Include personal projects.
      3. Achievements (20%): Quantifiable accomplishments with measurable impact.
      4. Education Quality (15%): Institution prestige and degree relevance.
      5. Certifications/Awards (10%): Industry-recognized credentials and honors.
      6. Formatting/Completeness (5%): Organization, length, and clarity.
      
      IMPORTANT SCORING RULES:
      - If the resume contains any of the following keywords or similar indicators of top-tier achievement—such as elite universities (e.g., Harvard, MIT, Oxford, Stanford, Cambridge, Yale, Princeton), world-leading companies (e.g., Google, Microsoft, Apple, Netflix, Amazon, Meta, Tesla), major global awards (e.g., Nobel, Pulitzer, Olympics), or high-impact terms (e.g., million, billion, patent, keynote, founder)—add extra points in the relevant category (Education, Experience, Achievements). If any of those is found, the resume cannot be scored below 80/100 overall.
      
      - CRITICAL: Resumes that are too short (under 250 words) should be severely penalized in ALL categories.
      - CRITICAL: Resumes missing major sections (such as education, work experience, or skills) should receive very low scores (maximum 40/100) in those missing categories.
      - CRITICAL: Resumes with only one section should never score above 30/100 overall, regardless of content.
      - CRITICAL: Resumes missing more than one major section should never score above 50/100 overall.
      
      ADDITIONAL FACTORS TO CONSIDER:
      - Length: Penalize if too short (<1 page) or too long (>2 pages for most industries)
      - Completeness: Missing crucial sections like education, experience, skills (severe penalty)
      - Professionalism: Language formality, third-person perspective, no personal pronouns
      - Grammar/Spelling: Any errors should significantly lower scores
      - Quantifiable Achievements: Specific metrics and accomplishments (not just responsibilities)
      
      Estimate:
      1. The likely industry this resume targets
      2. Estimated percentile ranking compared to other resumes in this industry (e.g., top 25%)
      3. Number of similar resumes in this industry (approximate, e.g., "about 12,000+")
      4. Suggested missing or in-demand skills to improve competitiveness
      
      Calculate the final overall score as a weighted average of the individual category scores based on the percentages above.
      
      Format your response as a JSON object with these fields:
      {
        "overallScore": number,
        "skillsBreadth": number,
        "experienceDuration": number,
        "achievements": number,
        "educationQuality": number,
        "certifications": number,
        "contentStructure": number,
        "keywordRelevance": number,
        "atsReadiness": number,
        "industry": string,
        "percentile": number,
        "numSimilarResumes": number,
        "suggestedSkills": string[],
        "eliteIndicatorsFound": string[]
      }

      Return ONLY the JSON object, no extra text. BE BRUTALLY HONEST IN YOUR SCORES but remember that resumes containing elite indicators cannot score below 80/100 overall, UNLESS they are extremely short or missing multiple major sections.
      `;
    } else {
      // Default or "jobDescription" mode
      prompt = `
      Analyze this resume against the provided job description with BRUTAL HONESTY, using a weighted scoring system:
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      RESUME:
      ${resumeContent}
      
      Please provide a comprehensive scoring breakdown using the following weighted criteria:
      
      1. Skills Alignment (25%): Technical and soft skills relevant to the job and industry.
      2. Work Experience (25%): Company reputation, role relevance to the job, and career progression. Include personal projects.
      3. Achievements (20%): Quantifiable accomplishments with measurable impact relevant to the job.
      4. Education Quality (15%): Institution prestige and degree relevance to the position.
      5. Certifications/Awards (10%): Industry-recognized credentials and honors relevant to the job.
      6. Formatting/Completeness (5%): Organization, length, and clarity.
      
      IMPORTANT SCORING RULES:
      - If the resume contains any of the following keywords or similar indicators of top-tier achievement—such as elite universities (e.g., Harvard, MIT, Oxford, Stanford, Cambridge, Yale, Princeton), world-leading companies (e.g., Google, Microsoft, Apple, Netflix, Amazon, Meta, Tesla), major global awards (e.g., Nobel, Pulitzer, Olympics), or high-impact terms (e.g., million, billion, patent, keynote, founder)—add extra points in the relevant category (Education, Experience, Achievements). If any of those is found, the resume cannot be scored below 80/100 overall.
      
      - CRITICAL: Resumes that are too short (under 250 words) should be severely penalized in ALL categories.
      - CRITICAL: Resumes missing major sections (such as education, work experience, or skills) should receive very low scores (maximum 40/100) in those missing categories.
      - CRITICAL: Resumes with only one section should never score above 30/100 overall, regardless of content.
      - CRITICAL: Resumes missing more than one major section should never score above 50/100 overall.
      
      ADDITIONAL FACTORS TO CONSIDER:
      - Keyword Matching: How well the resume uses key terminology from the job description
      - ATS Compatibility: How likely the resume is to pass ATS systems for this job
      - Length: Penalize if too short (<1 page) or too long (>2 pages for most industries)
      - Completeness: Missing crucial sections like education, experience, skills (severe penalty)
      - Professionalism: Language formality, third-person perspective, no personal pronouns
      - Grammar/Spelling: Any errors should significantly lower scores
      - Quantifiable Achievements: Specific metrics and accomplishments (not just responsibilities)
      
      Also determine:
      1. The industry this job belongs to
      2. Critical missing skills that would improve the resume for this specific job
      3. Estimated percentile ranking compared to typical applicants (e.g., top 20%)
      
      Calculate the final overall score as a weighted average of the individual category scores based on the percentages above.
      
      Format your response as a JSON object with these fields:
      {
        "overallScore": number,
        "skillsBreadth": number,
        "experienceDuration": number,
        "achievements": number,
        "educationQuality": number,
        "certifications": number,
        "contentStructure": number,
        "keywordRelevance": number,
        "atsReadiness": number,
        "industry": string,
        "suggestedSkills": string[],
        "percentile": number,
        "eliteIndicatorsFound": string[]
      }
      
      Return ONLY the JSON object without any additional text. BE BRUTALLY HONEST IN YOUR SCORES but remember that resumes containing elite indicators cannot score below 80/100 overall, UNLESS they are extremely short or missing multiple major sections.
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
