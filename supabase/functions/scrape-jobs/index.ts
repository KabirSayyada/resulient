
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface JobSearchParams {
  query?: string;
  location?: string;
  employment_types?: string;
  job_requirements?: string;
  num_pages?: number;
  date_posted?: string;
  user_id?: string; // Add user_id parameter
}

interface JSearchJob {
  job_id: string;
  employer_name: string;
  employer_logo?: string;
  job_publisher: string;
  job_employment_type: string;
  job_title: string;
  job_apply_link: string;
  job_apply_is_direct: boolean;
  job_apply_quality_score: number;
  job_description: string;
  job_is_remote: boolean;
  job_posted_at_timestamp: number;
  job_posted_at_datetime_utc: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_latitude: number;
  job_longitude: number;
  job_benefits?: string[];
  job_google_link: string;
  job_offer_expiration_datetime_utc?: string;
  job_offer_expiration_timestamp?: number;
  job_required_experience?: {
    no_experience_required: boolean;
    required_experience_in_months: number;
    experience_mentioned: boolean;
    experience_preferred: boolean;
  };
  job_required_skills?: string[];
  job_required_education?: {
    postgraduate_degree: boolean;
    professional_certification: boolean;
    high_school: boolean;
    associates_degree: boolean;
    bachelors_degree: boolean;
    degree_mentioned: boolean;
    degree_preferred: boolean;
    professional_certification_mentioned: boolean;
  };
  job_experience_in_place_of_education: boolean;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
  job_salary_period?: string;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
  job_job_title?: string;
  job_posting_language: string;
  job_onet_soc: string;
  job_onet_job_zone: string;
}

interface JSearchResponse {
  status: string;
  request_id: string;
  parameters: any;
  data: JSearchJob[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting user-specific job scraping request...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    if (!rapidApiKey) {
      throw new Error('RAPIDAPI_KEY not found in environment variables');
    }

    // Parse request body for search parameters
    const body = await req.json().catch(() => ({}));
    const searchParams: JobSearchParams = {
      query: body.query || 'software engineer',
      location: body.location || 'United States',
      employment_types: body.employment_types || 'FULLTIME',
      num_pages: Math.min(body.num_pages || 5, 10), // Default to 5 pages, max 10 for high volume
      date_posted: body.date_posted || 'week',
      user_id: body.user_id // Get user_id from request
    };

    // Validate user_id is provided
    if (!searchParams.user_id) {
      throw new Error('User ID is required for job scraping');
    }

    console.log('User-specific search parameters:', searchParams);

    // Build URL for JSearch API
    const baseUrl = 'https://jsearch.p.rapidapi.com/search';
    const url = new URL(baseUrl);
    
    // Add search parameters (excluding user_id which is not for the API)
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && key !== 'user_id') {
        url.searchParams.append(key, value.toString());
      }
    });

    console.log(`🚀 Fetching personalized jobs from JSearch API (${searchParams.num_pages} pages) for user: ${searchParams.user_id}...`);
    
    // Fetch jobs from JSearch API
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('JSearch API error:', response.status, errorText);
      throw new Error(`JSearch API error: ${response.status} - ${errorText}`);
    }

    const jsearchData: JSearchResponse = await response.json();
    console.log(`🎯 Found ${jsearchData.data?.length || 0} jobs from JSearch API for user: ${searchParams.user_id}`);

    if (!jsearchData.data || jsearchData.data.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No jobs found for the given criteria',
          count: 0,
          jobs: []
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Transform JSearch jobs to our database format with enhanced data
    const transformedJobs = jsearchData.data.map((job: JSearchJob) => {
      // Build location string
      let location = '';
      if (job.job_is_remote) {
        location = 'Remote';
      } else {
        const locationParts = [job.job_city, job.job_state, job.job_country].filter(Boolean);
        location = locationParts.join(', ');
      }

      // Build salary string
      let salary = null;
      if (job.job_min_salary && job.job_max_salary) {
        const currency = job.job_salary_currency || 'USD';
        const period = job.job_salary_period || 'year';
        salary = `$${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()} per ${period}`;
      }

      // Enhanced tag extraction from skills and highlights
      const tags = [];
      if (job.job_required_skills) {
        tags.push(...job.job_required_skills.slice(0, 6)); // More skills for better matching
      }
      if (job.job_highlights?.Qualifications) {
        // Extract key qualifications as tags
        job.job_highlights.Qualifications.slice(0, 4).forEach(qual => {
          const match = qual.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g);
          if (match) tags.push(...match.slice(0, 2));
        });
      }

      return {
        title: job.job_title,
        company: job.employer_name,
        location: location || 'Location not specified',
        salary: salary,
        type: job.job_employment_type === 'FULLTIME' ? 'Full-time' : 
              job.job_employment_type === 'PARTTIME' ? 'Part-time' : 
              job.job_employment_type === 'CONTRACTOR' ? 'Contract' : 
              job.job_employment_type === 'INTERN' ? 'Internship' : 'Full-time',
        description: job.job_description?.substring(0, 600) + (job.job_description?.length > 600 ? '...' : ''),
        requirements: job.job_highlights?.Qualifications?.join('; ') || null,
        tags: [...new Set(tags)].slice(0, 10), // More tags for better matching
        posted_date: new Date(job.job_posted_at_datetime_utc).toISOString(),
        expires_at: job.job_offer_expiration_datetime_utc ? 
                   new Date(job.job_offer_expiration_datetime_utc).toISOString() : null,
        is_active: true,
        external_url: job.job_apply_link,
        source: `jsearch-${job.job_publisher.toLowerCase().replace(/\s+/g, '-')}`,
        external_job_id: job.job_id,
        user_id: searchParams.user_id // Add user_id to each job
      };
    });

    console.log(`📊 Transformed ${transformedJobs.length} jobs for user: ${searchParams.user_id}`);

    // Check for duplicates for this specific user before inserting
    const existingJobIds = new Set();
    const { data: existingJobs } = await supabase
      .from('jobs')
      .select('external_job_id')
      .eq('user_id', searchParams.user_id)
      .not('external_job_id', 'is', null);

    if (existingJobs) {
      existingJobs.forEach(job => existingJobIds.add(job.external_job_id));
    }

    // Filter out duplicates
    const newJobs = transformedJobs.filter(job => 
      job.external_job_id && !existingJobIds.has(job.external_job_id)
    );

    console.log(`✅ Inserting ${newJobs.length} new jobs for user: ${searchParams.user_id} (${transformedJobs.length - newJobs.length} duplicates filtered)`);

    // Insert jobs into database
    const { data: insertedJobs, error: insertError } = await supabase
      .from('jobs')
      .insert(newJobs)
      .select();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      throw new Error(`Failed to insert jobs: ${insertError.message}`);
    }

    console.log(`🎉 Successfully inserted ${insertedJobs?.length || 0} jobs for user: ${searchParams.user_id}`);

    return new Response(
      JSON.stringify({
        message: `🚀 SUCCESS: Scraped and stored ${insertedJobs?.length || 0} personalized jobs from ${searchParams.num_pages} pages!`,
        count: insertedJobs?.length || 0,
        totalScraped: transformedJobs.length,
        duplicatesFiltered: transformedJobs.length - newJobs.length,
        jobs: insertedJobs,
        searchParams,
        pagesRequested: searchParams.num_pages,
        userId: searchParams.user_id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('User-specific job scraping error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'Failed to execute user-specific job scraping'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
