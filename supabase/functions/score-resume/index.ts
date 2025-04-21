
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
Important: If up to two of the following sections are missing (Experience, Skills, Education, Achievements) and the final score of resume is over 40/100 then automatically just give overallScore as 40 else leave the score as it is (overallScore).   
If the resume has less than 300 words and its score exceeds 50 then automatically give it 50 else leave the right score as it is (overallScore)

Please use the following weighted criteria for the scoring:
1. Skills Alignment (25%): Technical and soft skills relevant to the job and industry.
2. Work Experience (25%): Company reputation, role relevance to the job, and career progression. Include personal projects.
3. Achievements (20%): Quantifiable accomplishments with measurable impact relevant to the job.
4. Education Quality (15%): Institution prestige and degree relevance to the position.
5. Certifications/Awards (10%): Industry-recognized credentials and honors relevant to the job.
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

    // Using chat completions API instead of completions API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
