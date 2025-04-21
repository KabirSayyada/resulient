
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
      Analyze this resume with BRUTAL HONESTY, following these industry standards and criteria:

      RESUME:
      ${resumeContent}
      
      Please provide a comprehensive scoring breakdown using the following weighted criteria:
      
      CORE CRITERIA TO ANALYZE:
      1. Skills Alignment (25%): Technical and soft skills relevant to the industry.
      2. Work Experience (25%): Company reputation, role relevance, and career progression. Include personal projects.
      3. Achievements (20%): Quantifiable accomplishments with measurable impact.
      4. Education Quality (15%): Institution prestige and degree relevance.
      5. Certifications/Awards (10%): Industry-recognized credentials and honors.
      6. Formatting/Completeness (5%): Organization, length, and clarity.
      
      CRITICAL SCORING RULES:
      - If the resume contains any elite indicators—such as elite universities (e.g., Harvard, MIT, Oxford, Stanford, Cambridge, Yale, Princeton), world-leading companies (e.g., Google, Microsoft, Apple, Netflix, Amazon, Meta, Tesla), major global awards (e.g., Nobel, Pulitzer, Olympics), or high-impact terms (e.g., million, billion, patent, keynote, founder)—add extra points in the relevant category (Education, Experience, Achievements).
      
      - CRITICAL: Resumes that are too short (under 250 words) must be severely penalized in ALL categories.
      - CRITICAL: Resumes missing major sections (such as education, work experience, or skills) must receive very low scores (maximum 40/100) in those missing categories.
      - CRITICAL: Resumes with only one section must never score above 30/100 overall, regardless of content.
      - CRITICAL: Resumes missing more than one major section must never score above 50/100 overall.
      - CRITICAL: Generic/buzzword-filled resumes without substantial content should receive low scores.
      
      AUTOMATIC DISQUALIFIERS (Zero or Very Low Score):
      - No contact information
      - No relevant skills for the industry
      - No relevant experience
      - Excessive spelling/grammar errors
      
      HIGH SCORING FACTORS:
      - Direct alignment of skills, experience, and education with the industry
      - Quantifiable achievements with metrics
      - No errors or typos
      - Relevant certifications and in-demand skills

      Estimate:
      1. The likely industry this resume targets
      2. Estimated percentile ranking compared to other resumes in this industry (use a realistic distribution - a resume missing sections should NEVER be ranked above 50th percentile)
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

      Return ONLY the JSON object, no extra text. BE BRUTALLY HONEST IN YOUR SCORES following these rules:
      - Resumes with elite indicators should not score below 80/100 overall UNLESS they are extremely short or missing multiple major sections.
      - Resumes with only one section must NEVER score above 30/100 overall.
      - Resumes with missing sections must receive maximum 40/100 in those categories.
      - Resumes missing multiple sections must not score above 50/100 overall.
      - Resumes shorter than 250 words must be severely penalized in all categories.
      - The percentile ranking must be realistic - incomplete resumes should never be above 50th percentile.
      `;
    } else {
      // Default or "jobDescription" mode
      prompt = `
      Analyze this resume against the provided job description with BRUTAL HONESTY, using these industry standards and criteria:
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      RESUME:
      ${resumeContent}
      
      Please provide a comprehensive scoring breakdown using the following weighted criteria:
      
      CORE CRITERIA TO ANALYZE:
      1. Skills Alignment (25%): Technical and soft skills relevant to the job and industry.
      2. Work Experience (25%): Company reputation, role relevance to the job, and career progression. Include personal projects.
      3. Achievements (20%): Quantifiable accomplishments with measurable impact relevant to the job.
      4. Education Quality (15%): Institution prestige and degree relevance to the position.
      5. Certifications/Awards (10%): Industry-recognized credentials and honors relevant to the job.
      6. Formatting/Completeness (5%): Organization, length, and clarity.
      
      CRITICAL SCORING RULES:
      - If the resume contains any elite indicators—such as elite universities (e.g., Harvard, MIT, Oxford, Stanford, Cambridge, Yale, Princeton), world-leading companies (e.g., Google, Microsoft, Apple, Netflix, Amazon, Meta, Tesla), major global awards (e.g., Nobel, Pulitzer, Olympics), or high-impact terms (e.g., million, billion, patent, keynote, founder)—add extra points in the relevant category (Education, Experience, Achievements).
      
      - CRITICAL: Resumes that are too short (under 250 words) must be severely penalized in ALL categories.
      - CRITICAL: Resumes missing major sections (such as education, work experience, or skills) must receive very low scores (maximum 40/100) in those missing categories.
      - CRITICAL: Resumes with only one section must never score above 30/100 overall, regardless of content.
      - CRITICAL: Resumes missing more than one major section must never score above 50/100 overall.
      - CRITICAL: Generic/buzzword-filled resumes without substantial content should receive low scores.
      
      AUTOMATIC DISQUALIFIERS (Zero or Very Low Score):
      - No contact information
      - No relevant skills for the job
      - No relevant experience for the role
      - Excessive spelling/grammar errors
      
      HIGH SCORING FACTORS:
      - Direct alignment of skills, experience, and education with the job requirements
      - Quantifiable achievements with metrics
      - No errors or typos
      - Relevant certifications and in-demand skills for the position

      Also determine:
      1. The industry this job belongs to
      2. Critical missing skills that would improve the resume for this specific job
      3. Estimated percentile ranking compared to typical applicants (use a realistic distribution - a resume missing sections should NEVER be ranked above 50th percentile)
      
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
      
      Return ONLY the JSON object without any additional text. BE BRUTALLY HONEST IN YOUR SCORES following these rules:
      - Resumes with elite indicators should not score below 80/100 overall UNLESS they are extremely short or missing multiple major sections.
      - Resumes with only one section must NEVER score above 30/100 overall.
      - Resumes with missing sections must receive maximum 40/100 in those categories.
      - Resumes missing multiple sections must not score above 50/100 overall.
      - Resumes shorter than 250 words must be severely penalized in all categories.
      - The percentile ranking must be realistic - incomplete resumes should never be above 50th percentile.
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
