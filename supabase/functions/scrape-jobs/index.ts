
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Sample job data for demonstration
    // In production, this would scrape real job sites
    const sampleJobs = [
      {
        title: "Senior React Developer",
        company: "Tech Innovations Inc",
        location: "San Francisco, CA",
        salary_min: 120000,
        salary_max: 180000,
        job_type: "full-time",
        work_arrangement: "hybrid",
        description: "We are seeking a Senior React Developer to join our dynamic team. You will work on cutting-edge web applications using React, TypeScript, and modern development tools. This role offers the opportunity to mentor junior developers and contribute to architectural decisions.",
        requirements: "5+ years of React experience, TypeScript proficiency, experience with state management libraries (Redux/Zustand), understanding of modern build tools (Vite/Webpack), strong problem-solving skills.",
        posted_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        source_url: "https://example.com/job/1",
        source_platform: "indeed",
        company_size: "100-500 employees",
        industry: "Technology",
        experience_level: "senior-level"
      },
      {
        title: "Frontend Developer",
        company: "Digital Solutions LLC",
        location: "Remote",
        salary_min: 80000,
        salary_max: 120000,
        job_type: "full-time",
        work_arrangement: "remote",
        description: "Join our remote-first team as a Frontend Developer. You'll build responsive web applications using modern JavaScript frameworks and collaborate with designers to create exceptional user experiences.",
        requirements: "3+ years of frontend development experience, proficiency in JavaScript/TypeScript, experience with React or Vue.js, understanding of CSS frameworks, good communication skills for remote collaboration.",
        posted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        source_url: "https://example.com/job/2",
        source_platform: "linkedin",
        company_size: "50-100 employees",
        industry: "Technology",
        experience_level: "mid-level"
      },
      {
        title: "Full Stack Engineer",
        company: "StartupXYZ",
        location: "New York, NY",
        salary_min: 100000,
        salary_max: 150000,
        job_type: "full-time",
        work_arrangement: "onsite",
        description: "Looking for a Full Stack Engineer to help build our next-generation platform. You'll work across the entire stack, from React frontend to Node.js backend, in a fast-paced startup environment.",
        requirements: "4+ years of full-stack development, experience with React and Node.js, database design skills (PostgreSQL/MongoDB), familiarity with cloud platforms (AWS/GCP), startup experience preferred.",
        posted_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        source_url: "https://example.com/job/3",
        source_platform: "glassdoor",
        company_size: "10-50 employees",
        industry: "Technology",
        experience_level: "mid-level"
      }
    ];

    // Insert sample jobs into the database
    const { data, error } = await supabaseClient
      .from('job_postings')
      .upsert(sampleJobs, { 
        onConflict: 'source_url',
        ignoreDuplicates: true 
      })
      .select()

    if (error) {
      console.error('Error inserting jobs:', error)
      throw error
    }

    console.log(`Successfully scraped and inserted ${data?.length || 0} jobs`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        jobsInserted: data?.length || 0,
        message: 'Jobs scraped successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in scrape-jobs function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
