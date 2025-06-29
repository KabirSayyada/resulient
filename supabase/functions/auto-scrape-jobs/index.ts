
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

// Strategic search queries that capture broad job categories
const STRATEGIC_SEARCHES = [
  {
    query: 'software engineer OR developer OR programmer OR data scientist OR analyst',
    location: 'United States',
    description: 'Tech & Data roles'
  },
  {
    query: 'manager OR director OR coordinator OR assistant OR administrator',
    location: 'Remote',
    description: 'Management & Admin roles'
  },
  {
    query: 'sales OR marketing OR business development OR account manager OR consultant',
    location: 'New York, NY',
    description: 'Sales & Marketing roles'
  },
  {
    query: 'nurse OR teacher OR healthcare OR therapist OR counselor OR social worker',
    location: 'California',
    description: 'Healthcare & Education roles'
  },
  {
    query: 'engineer OR technician OR specialist OR designer OR architect',
    location: 'Texas',
    description: 'Engineering & Design roles'
  },
  {
    query: 'finance OR accounting OR analyst OR recruiter OR human resources',
    location: 'Florida',
    description: 'Finance & HR roles'
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting automated job scraping with strategic searches...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    if (!rapidApiKey) {
      throw new Error('RAPIDAPI_KEY not found in environment variables');
    }

    let totalJobsScraped = 0;
    const allJobs: any[] = [];

    // Calculate 24 hours ago
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    // Make 6 strategic requests to maximize job diversity while staying within API limits
    for (let i = 0; i < STRATEGIC_SEARCHES.length; i++) {
      const search = STRATEGIC_SEARCHES[i];
      
      try {
        console.log(`Strategic search ${i + 1}/6: ${search.description} - "${search.query}" in ${search.location}`);
        
        const baseUrl = 'https://jsearch.p.rapidapi.com/search';
        const url = new URL(baseUrl);
        
        url.searchParams.append('query', search.query);
        url.searchParams.append('location', search.location);
        url.searchParams.append('employment_types', 'FULLTIME,PARTTIME,CONTRACTOR,INTERN');
        url.searchParams.append('date_posted', 'today');
        url.searchParams.append('num_pages', '3'); // Get more results per request
        url.searchParams.append('page', '1');

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
          }
        });

        if (!response.ok) {
          console.error(`API error for ${search.description}: ${response.status} - ${response.statusText}`);
          continue;
        }

        const jsearchData: JSearchResponse = await response.json();
        
        if (jsearchData.data && jsearchData.data.length > 0) {
          // Filter jobs posted in the last 24 hours
          const recentJobs = jsearchData.data.filter(job => {
            const jobDate = new Date(job.job_posted_at_datetime_utc);
            return jobDate >= yesterday;
          });

          console.log(`Found ${recentJobs.length} recent jobs for ${search.description} (${jsearchData.data.length} total)`);
          
          // Transform jobs
          const transformedJobs = recentJobs.map((job: JSearchJob) => {
            let location = '';
            if (job.job_is_remote) {
              location = 'Remote';
            } else {
              const locationParts = [job.job_city, job.job_state, job.job_country].filter(Boolean);
              location = locationParts.join(', ');
            }

            let salary = null;
            if (job.job_min_salary && job.job_max_salary) {
              const currency = job.job_salary_currency || 'USD';
              const period = job.job_salary_period || 'year';
              salary = `$${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()} per ${period}`;
            }

            const tags = [];
            if (job.job_required_skills) {
              tags.push(...job.job_required_skills.slice(0, 5));
            }
            if (job.job_highlights?.Qualifications) {
              job.job_highlights.Qualifications.slice(0, 3).forEach(qual => {
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
              description: job.job_description?.substring(0, 500) + (job.job_description?.length > 500 ? '...' : ''),
              requirements: job.job_highlights?.Qualifications?.join('; ') || null,
              tags: [...new Set(tags)].slice(0, 8),
              posted_date: new Date(job.job_posted_at_datetime_utc).toISOString(),
              expires_at: job.job_offer_expiration_datetime_utc ? 
                         new Date(job.job_offer_expiration_datetime_utc).toISOString() : null,
              is_active: true,
              external_url: job.job_apply_link,
              source: `jsearch-${job.job_publisher.toLowerCase().replace(/\s+/g, '-')}`,
              external_job_id: job.job_id
            };
          });

          allJobs.push(...transformedJobs);
          totalJobsScraped += transformedJobs.length;
        }

        // Add 2-second delay between requests to be respectful to the API
        if (i < STRATEGIC_SEARCHES.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        console.error(`Error in strategic search ${i + 1} (${search.description}):`, error);
        continue;
      }
    }

    console.log(`Total jobs scraped across all strategic searches: ${totalJobsScraped}`);

    if (allJobs.length > 0) {
      // Check for existing jobs to avoid duplicates
      const existingJobIds = new Set();
      const { data: existingJobs } = await supabase
        .from('jobs')
        .select('external_job_id')
        .not('external_job_id', 'is', null);

      if (existingJobs) {
        existingJobs.forEach(job => existingJobIds.add(job.external_job_id));
      }

      // Filter out duplicates
      const newJobs = allJobs.filter(job => 
        job.external_job_id && !existingJobIds.has(job.external_job_id)
      );

      console.log(`Inserting ${newJobs.length} new jobs (${allJobs.length - newJobs.length} duplicates filtered)`);

      if (newJobs.length > 0) {
        const { data: insertedJobs, error: insertError } = await supabase
          .from('jobs')
          .insert(newJobs)
          .select();

        if (insertError) {
          console.error('Database insertion error:', insertError);
          throw new Error(`Failed to insert jobs: ${insertError.message}`);
        }

        console.log(`Successfully inserted ${insertedJobs?.length || 0} jobs`);

        // Clean up old jobs (older than 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { error: cleanupError } = await supabase
          .from('jobs')
          .delete()
          .lt('posted_date', thirtyDaysAgo.toISOString());

        if (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        } else {
          console.log('Old jobs cleaned up successfully');
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: `Successfully scraped and stored ${insertedJobs?.length || 0} new jobs using strategic searches`,
            totalScraped: totalJobsScraped,
            newJobs: insertedJobs?.length || 0,
            duplicatesFiltered: allJobs.length - newJobs.length,
            searchStrategies: STRATEGIC_SEARCHES.map(search => search.description),
            apiRequestsUsed: STRATEGIC_SEARCHES.length
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'No new jobs found in strategic searches',
        totalScraped: totalJobsScraped,
        newJobs: 0,
        apiRequestsUsed: STRATEGIC_SEARCHES.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Auto job scraping error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Failed to auto-scrape jobs'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
