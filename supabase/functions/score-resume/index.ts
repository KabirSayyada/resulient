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
    const { resumeContent } = body;

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

    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    const systemPrompt = `Score this resume based on the following criteria:     
Important rules: If more than one of the following sections are missing from the resume(experience, skills, education, achievements) and the overallScore of resume is greater than 40 then automatically just give overallScore as 40 else leave the score as it is.   
If the resume has less than 300 words and it's score is greater than 50 then automatically make overallScore 50 else leave the score as it is if it's less than 50. If resume is just below standard and bad feel free to give it low score from 1-30

Please use the following weighted criteria for the scoring:
1. Skills Alignment (25%): Technical and soft skills relevant to the industry resume belongs to.
2. Work Experience (25%): Company reputation, role relevance to the industry, and career progression. Include personal projects.
3. Achievements (20%): Quantifiable accomplishments with measurable impact.
4. Education Quality (15%): Institution prestige and degree relevance.
5. Certifications/Awards (10%): Industry-recognized credentials and honors relevant to the industry.
6. Formatting/Completeness (5%): Organization, length, and clarity.

Format your response ONLY as a valid JSON object with these fields:
{
  "overallScore": number,
  "skillsAlignment": number, 
  "WorkExperience": number, 
  "Achievements": number, 
  "EducationQuality": number, 
  "Certifications": number, 
  "ContentStructure": number, 
  "keywordRelevance": number,
  "atsReadiness": number,
  "Industry": string, 
  "percentile": number,
  "numSimilarResumes": number, 
  "suggestedSkills": string[],
  "eliteIndicatorsFound": string[]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: systemPrompt 
        },
        { 
          role: "user", 
          content: `RESUME:\n${resumeContent}` 
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.3,
    });

    const content = response.choices[0].message.content?.trim() || "";

    try {
      const scoreData = JSON.parse(content);

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
