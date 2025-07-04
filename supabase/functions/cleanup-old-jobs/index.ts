import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting cleanup of old jobs...')

    // Calculate the cutoff date (3 days ago)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    
    console.log(`Removing jobs posted before: ${threeDaysAgo.toISOString()}`)

    // First, get the count of jobs to be deleted for logging
    const { count: jobsToDelete, error: countError } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .lt('posted_date', threeDaysAgo.toISOString())

    if (countError) {
      console.error('Error counting jobs to delete:', countError)
      throw countError
    }

    console.log(`Found ${jobsToDelete || 0} jobs to delete`)

    if (jobsToDelete && jobsToDelete > 0) {
      // Delete old jobs (this will cascade delete related job applications due to foreign key)
      const { data: deletedJobs, error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .lt('posted_date', threeDaysAgo.toISOString())
        .select('id, title, company, posted_date')

      if (deleteError) {
        console.error('Error deleting old jobs:', deleteError)
        throw deleteError
      }

      console.log(`Successfully deleted ${deletedJobs?.length || 0} old jobs`)
      
      // Log some details of deleted jobs for debugging
      if (deletedJobs && deletedJobs.length > 0) {
        console.log('Deleted jobs sample:', deletedJobs.slice(0, 5).map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          posted_date: job.posted_date
        })))
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Successfully cleaned up ${deletedJobs?.length || 0} old jobs`,
          deletedCount: deletedJobs?.length || 0,
          cutoffDate: threeDaysAgo.toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      console.log('No old jobs found to delete')
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No old jobs found to clean up',
          deletedCount: 0,
          cutoffDate: threeDaysAgo.toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

  } catch (error) {
    console.error('Job cleanup failed:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to clean up old jobs'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})