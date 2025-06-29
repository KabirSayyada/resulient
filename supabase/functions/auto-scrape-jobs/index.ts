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

// High-volume strategic searches designed to capture maximum job diversity
const HIGH_VOLUME_SEARCHES = [
  {
    query: 'software OR developer OR engineer OR programmer OR analyst OR data OR tech OR IT',
    location: 'United States',
    description: 'Tech & Development (High Volume)',
    pages: 10 // Fetch 10 pages per request for maximum jobs
  },
  {
    query: 'manager OR director OR coordinator OR assistant OR admin OR executive OR lead',
    location: 'Remote',
    description: 'Management & Leadership (High Volume)',
    pages: 8
  },
  {
    query: 'sales OR marketing OR business OR account OR customer OR consultant OR specialist',
    location: 'California',
    description: 'Sales & Marketing (High Volume)',
    pages: 8
  },
  {
    query: 'nurse OR healthcare OR medical OR therapist OR social OR education OR teacher',
    location: 'New York',
    description: 'Healthcare & Education (High Volume)',
    pages: 6
  },
  {
    query: 'finance OR accounting OR banking OR investment OR insurance OR real estate',
    location: 'Texas',
    description: 'Finance & Real Estate (High Volume)',
    pages: 6
  },
  {
    query: 'entry level OR junior OR intern OR graduate OR trainee OR associate OR part time',
    location: 'Florida',
    description: 'Entry Level & Flexible (High Volume)',
    pages: 6
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting HIGH-VOLUME automated job scraping...');
    
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

    // Calculate 48 hours ago for broader job collection
    const twoDaysAgo = new Date();
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

    // Execute high-volume searches
    for (let i = 0; i < HIGH_VOLUME_SEARCHES.length; i++) {
      const search = HIGH_VOLUME_SEARCHES[i];
      
      try {
        console.log(`High-volume search ${i + 1}/6: ${search.description} - fetching ${search.pages} pages`);
        
        const baseUrl = 'https://jsearch.p.rapidapi.com/search';
        const url = new URL(baseUrl);
        
        url.searchParams.append('query', search.query);
        url.searchParams.append('location', search.location);
        url.searchParams.append('employment_types', 'FULLTIME,PARTTIME,CONTRACTOR,INTERN');
        url.searchParams.append('date_posted', '3days'); // Get more recent jobs
        url.searchParams.append('num_pages', search.pages.toString()); // High page count for maximum jobs
        url.searchParams.append('page', '1');

        console.log(`Making API request for: ${search.query} (${search.pages} pages)`);

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
          // Filter jobs posted in the last 48 hours for broader collection
          const recentJobs = jsearchData.data.filter(job => {
            const jobDate = new Date(job.job_posted_at_datetime_utc);
            return jobDate >= twoDaysAgo;
          });

          console.log(`🎯 Found ${recentJobs.length} jobs for ${search.description} (${jsearchData.data.length} total from ${search.pages} pages)`);
          
          // Transform jobs with enhanced data
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

            // Enhanced tag extraction for better matching
            const tags = [];
            if (job.job_required_skills) {
              tags.push(...job.job_required_skills.slice(0, 6));
            }
            if (job.job_highlights?.Qualifications) {
              job.job_highlights.Qualifications.slice(0, 4).forEach(qual => {
                const skillMatches = qual.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g);
                if (skillMatches) tags.push(...skillMatches.slice(0, 2));
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
              external_job_id: job.job_id
            };
          });

          allJobs.push(...transformedJobs);
          totalJobsScraped += transformedJobs.length;
        }

        // Shorter delay between requests since we're doing fewer total requests
        if (i < HIGH_VOLUME_SEARCHES.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
      } catch (error) {
        console.error(`Error in high-volume search ${i + 1} (${search.description}):`, error);
        continue;
      }
    }

    console.log(`🚀 TOTAL JOBS SCRAPED: ${totalJobsScraped} across all high-volume searches`);

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

      console.log(`📊 Inserting ${newJobs.length} NEW jobs (${allJobs.length - newJobs.length} duplicates filtered)`);

      if (newJobs.length > 0) {
        // Insert in batches for better performance with large datasets
        const batchSize = 100;
        let insertedCount = 0;

        for (let i = 0; i < newJobs.length; i += batchSize) {
          const batch = newJobs.slice(i, i + batchSize);
          
          const { data: insertedBatch, error: insertError } = await supabase
            .from('jobs')
            .insert(batch)
            .select();

          if (insertError) {
            console.error(`Batch insertion error (${i}-${i + batch.length}):`, insertError);
            continue;
          }

          insertedCount += insertedBatch?.length || 0;
          console.log(`✅ Inserted batch ${Math.ceil((i + batch.length) / batchSize)}: ${insertedBatch?.length} jobs`);
        }

        console.log(`🎉 Successfully inserted ${insertedCount} total jobs`);

        // Clean up old jobs (older than 45 days to keep more jobs available)
        const cleanupDate = new Date();
        cleanupDate.setDate(cleanupDate.getDate() - 45);

        const { error: cleanupError } = await supabase
          .from('jobs')
          .delete()
          .lt('posted_date', cleanupDate.toISOString());

        if (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        } else {
          console.log('🧹 Old jobs cleaned up successfully');
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: `🚀 HIGH-VOLUME SUCCESS: Scraped and stored ${insertedCount} new jobs!`,
            totalScraped: totalJobsScraped,
            newJobs: insertedCount,
            duplicatesFiltered: allJobs.length - newJobs.length,
            searchStrategies: HIGH_VOLUME_SEARCHES.map(search => `${search.description} (${search.pages} pages)`),
            apiRequestsUsed: HIGH_VOLUME_SEARCHES.length,
            volumeStrategy: 'High-volume with maximum page requests per search'
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
        message: 'High-volume scraping completed - no new jobs found',
        totalScraped: totalJobsScraped,
        newJobs: 0,
        apiRequestsUsed: HIGH_VOLUME_SEARCHES.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('High-volume auto job scraping error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Failed to execute high-volume job scraping'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
