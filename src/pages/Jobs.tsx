import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, DollarSign, ExternalLink, Briefcase, RefreshCw, Target, Users, Info, Download, Zap, Rocket } from "lucide-react";
import { useJobs, type JobFilters } from "@/hooks/useJobs";
import { useEnhancedJobMatching } from "@/hooks/useEnhancedJobMatching";
import { ResumeSelector } from "@/components/jobs/ResumeSelector";
import { JobGapAnalysis } from "@/components/jobs/JobGapAnalysis";
import { JobSeeder } from "@/components/jobs/JobSeeder";
import { JobFilters as JobFiltersComponent } from "@/components/jobs/JobFilters";
import { JobMatchCard } from "@/components/jobs/JobMatchCard";
import { useAuth } from "@/hooks/useAuth";
import { useJobScraper } from "@/hooks/useJobScraper";
import { format } from "date-fns";

export default function Jobs() {
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    location: '',
    jobType: '',
    salaryRange: ''
  });

  const { user } = useAuth();
  const { allJobs, loading, error, refetch, totalJobs } = useJobs(filters);
  const { scrapeJobs, loading: scrapingLoading } = useJobScraper();
  const { 
    matchedJobs, 
    allJobsWithScores, 
    loading: matchingLoading, 
    selectedResume,
    handleResumeSelection,
    reanalyzeJobs
  } = useEnhancedJobMatching();

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: '',
      salaryRange: ''
    });
  };

  const handleMassiveJobFetch = async () => {
    try {
      // Single broad search strategy for all jobs in the past 2 weeks
      await scrapeJobs({
        query: '', // No specific query - get all jobs
        location: '', // No specific location - get jobs from everywhere
        employment_types: 'FULLTIME',
        num_pages: 20, // Maximum pages to get as many jobs as possible
        date_posted: '2weeks' // Jobs from past 2 weeks
      });
      
      // Refresh jobs after fetch
      await refetch();
      await reanalyzeJobs();
    } catch (error) {
      console.error('Massive job fetch failed:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Job Opportunities
            </h1>
            <div className="text-red-600 dark:text-red-400">
              Error loading jobs: {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const JobCard = ({ job, showGapAnalysis = false }: { job: any; showGapAnalysis?: boolean }) => (
    <Card key={job.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
            <CardDescription className="text-base font-medium text-blue-600 dark:text-blue-400">
              {job.company}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">{job.type}</Badge>
            {job.source && job.source !== 'manual' && (
              <Badge variant="outline" className="text-xs">
                {job.source.replace('jsearch-', '').replace('-', ' ')}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {job.location}
          </div>
          {job.salary && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {job.salary}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {format(new Date(job.posted_date), 'MMM d, yyyy')}
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {job.description}
        </p>
        
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          {job.external_url ? (
            <Button asChild className="flex-1 sm:flex-none">
              <a href={job.external_url} target="_blank" rel="noopener noreferrer">
                Apply Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button className="flex-1 sm:flex-none">
              Apply Now
            </Button>
          )}
        </div>

        {showGapAnalysis && selectedResume && (
          <JobGapAnalysis job={job} selectedResume={selectedResume} />
        )}
      </CardContent>
    </Card>
  );

  const EnhancedJobCard = ({ jobMatch }: { jobMatch: any }) => (
    <Card key={jobMatch.job.id} className="hover:shadow-lg transition-shadow border-l-4" 
          style={{ borderLeftColor: jobMatch.matchScore >= 70 ? '#10b981' : jobMatch.matchScore >= 50 ? '#f59e0b' : '#3b82f6' }}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{jobMatch.job.title}</CardTitle>
              <Badge variant="secondary" className={`${jobMatch.matchScore >= 70 ? 'bg-green-500' : jobMatch.matchScore >= 50 ? 'bg-yellow-500' : 'bg-blue-500'} text-white`}>
                {jobMatch.matchScore}% Match
              </Badge>
            </div>
            <CardDescription className="text-base font-medium text-blue-600 dark:text-blue-400">
              {jobMatch.job.company}
            </CardDescription>
          </div>
          <Badge variant="secondary">{jobMatch.job.type}</Badge>
        </div>

        {jobMatch.matchReasons.length > 0 && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
              Why this matches:
            </div>
            <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
              {jobMatch.matchReasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span>•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {jobMatch.job.location}
          </div>
          {jobMatch.job.salary && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {jobMatch.job.salary}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {format(new Date(jobMatch.job.posted_date), 'MMM d, yyyy')}
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {jobMatch.job.description}
        </p>
        
        {jobMatch.job.tags && jobMatch.job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {jobMatch.job.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          {jobMatch.job.external_url ? (
            <Button asChild className="flex-1 sm:flex-none">
              <a href={jobMatch.job.external_url} target="_blank" rel="noopener noreferrer">
                Apply Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button className="flex-1 sm:flex-none">
              Apply Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Smart Job Matching
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover personalized job opportunities with our AI-powered matching system. Fresh jobs updated automatically throughout the day.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Massive Job Fetch Button */}
          <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">
                    Recent Jobs Collection
                  </h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Fetch all jobs posted in the past 2 weeks from all sources
                  </p>
                </div>
              </div>
              <Button
                onClick={handleMassiveJobFetch}
                disabled={scrapingLoading}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6"
              >
                {scrapingLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Fetching Recent Jobs...
                  </>
                ) : (
                  <>
                    <Rocket className="h-5 w-5 mr-2" />
                    Fetch Recent Jobs
                  </>
                )}
              </Button>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-purple-600 dark:text-purple-400">
              <Badge variant="outline" className="border-purple-300 text-purple-700 dark:text-purple-300">
                <Zap className="h-3 w-3 mr-1" />
                Past 2 Weeks
              </Badge>
              <span>•</span>
              <span>All Industries & Locations</span>
              <span>•</span>
              <span className="font-medium">Up to 1000+ recent jobs</span>
            </div>
          </div>

          {/* Auto-update info banner */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Info className="h-5 w-5" />
              <span className="font-medium">Smart Job Updates:</span>
              <span className="text-sm">
                Fresh jobs are automatically scraped and matched to your profile 6 times daily. Only relevant opportunities are shown.
              </span>
            </div>
          </div>

          {/* Fallback seeder for when no jobs exist */}
          {totalJobs === 0 && !loading && (
            <div className="mb-8">
              <JobSeeder />
            </div>
          )}

          {user ? (
            <div className="space-y-6">
              {/* Resume Selector */}
              <ResumeSelector 
                onResumeSelected={handleResumeSelection}
                selectedResumeId={selectedResume?.id}
              />

              <Tabs defaultValue="matches" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="matches" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    My Matches
                    {matchedJobs.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {matchedJobs.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    All Jobs
                    <Badge variant="outline" className="ml-2">
                      {totalJobs}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="matches" className="space-y-6">
                  <JobFiltersComponent 
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                  />

                  {!loading && !matchingLoading && selectedResume && (
                    <div className="mb-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span>Showing {matchedJobs.length} personalized matches</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => { refetch(); reanalyzeJobs(); }}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  )}

                  {loading || matchingLoading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-600 dark:text-gray-400">Loading your personalized job matches...</div>
                    </div>
                  ) : selectedResume ? (
                    <div className="space-y-6">
                      {matchedJobs.length > 0 ? (
                        <div className="grid gap-6">
                          {matchedJobs.map((jobMatch) => (
                            <EnhancedJobCard key={jobMatch.job.id} jobMatch={jobMatch} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-gray-600 dark:text-gray-400 mb-4">
                            No strong matches found with your current resume.
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={reanalyzeJobs}
                            className="mt-4"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh Matches
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-600 dark:text-gray-400">
                        Please select a resume above to see your personalized job matches.
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="all" className="space-y-6">
                  <JobFiltersComponent 
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                  />

                  {!loading && (
                    <div className="mb-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Showing {allJobs.length} of {totalJobs} jobs</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={refetch}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  )}

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-600 dark:text-gray-400">Loading job opportunities...</div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {allJobs.length > 0 ? (
                        <div className="grid gap-6">
                          {allJobs.map((job) => (
                            <JobCard key={job.id} job={job} showGapAnalysis={!!selectedResume} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-gray-600 dark:text-gray-400">
                            No jobs available right now. Fresh opportunities are added throughout the day!
                          </div>
                          {totalJobs > 0 && (
                            <Button 
                              variant="outline" 
                              onClick={handleClearFilters}
                              className="mt-4"
                            >
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            // Non-authenticated users see all jobs without gap analysis
            <div className="space-y-6">
              <JobFiltersComponent 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />

              {!loading && (
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Showing {allJobs.length} of {totalJobs} jobs</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={refetch}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-600 dark:text-gray-400">Loading job opportunities...</div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Latest Job Opportunities
                    </h2>
                  </div>

                  {allJobs.length > 0 ? (
                    <div className="grid gap-6">
                      {allJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-600 dark:text-gray-400">
                        No jobs available right now. Fresh opportunities are added throughout the day!
                      </div>
                      {totalJobs > 0 && (
                        <Button 
                          variant="outline" 
                          onClick={handleClearFilters}
                          className="mt-4"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
