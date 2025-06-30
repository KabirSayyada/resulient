import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, ExternalLink, RefreshCw, Target, Info, Zap } from "lucide-react";
import { useJobs, type JobFilters } from "@/hooks/useJobs";
import { useEnhancedJobMatching } from "@/hooks/useEnhancedJobMatching";
import { ResumeSelector } from "@/components/jobs/ResumeSelector";
import { EnhancedJobMatchCard } from "@/components/jobs/EnhancedJobMatchCard";
import { useAuth } from "@/hooks/useAuth";
import { useJobScraper } from "@/hooks/useJobScraper";
import { format } from "date-fns";

export default function Jobs() {
  const [filters] = useState<JobFilters>({
    search: '',
    location: '',
    jobType: '',
    salaryRange: ''
  });

  const { user } = useAuth();
  const { allJobs, loading, error, refetch, totalJobs } = useJobs(filters);
  const { scrapeJobs, loading: scrapingLoading, lastScrapeTime } = useJobScraper();
  const { 
    matchedJobs, 
    loading: matchingLoading, 
    selectedResume,
    handleResumeSelection,
    reanalyzeJobs
  } = useEnhancedJobMatching();

  const canFetchJobs = () => {
    if (!lastScrapeTime) return true;
    const tenHoursAgo = new Date(Date.now() - 10 * 60 * 60 * 1000);
    return new Date(lastScrapeTime) < tenHoursAgo;
  };

  const getTimeUntilNextFetch = () => {
    if (!lastScrapeTime) return null;
    const nextFetchTime = new Date(lastScrapeTime).getTime() + (10 * 60 * 60 * 1000);
    const now = Date.now();
    if (nextFetchTime <= now) return null;
    
    const hoursLeft = Math.ceil((nextFetchTime - now) / (60 * 60 * 1000));
    return hoursLeft;
  };

  const handleTargetedJobFetch = async () => {
    if (!selectedResume || !user || !canFetchJobs()) {
      console.error('Cannot fetch jobs: no resume selected, user not authenticated, or cooldown active');
      return;
    }

    try {
      const jobTitle = selectedResume.industry || 'software engineer';
      const location = 'United States';
      
      await scrapeJobs({
        query: jobTitle,
        location: location,
        employment_types: 'FULLTIME',
        num_pages: 5,
        date_posted: '3days',
        user_id: user.id
      });
      
      await refetch();
      await reanalyzeJobs();
    } catch (error) {
      console.error('Targeted job fetch failed:', error);
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

  const hoursUntilNextFetch = getTimeUntilNextFetch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Personal Job Matches
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your personalized job opportunities with detailed match analysis and scoring breakdowns
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {user ? (
            <div className="space-y-6">
              {/* Resume Selector */}
              <ResumeSelector 
                onResumeSelected={handleResumeSelection}
                selectedResumeId={selectedResume?.id}
              />

              {/* Targeted Job Fetch Button */}
              <div className="mb-6 p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-purple-500 rounded-full">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                        Fetch My Personal Job Matches
                      </h3>
                      <p className="text-lg text-purple-600 dark:text-purple-400 mt-2">
                        {selectedResume 
                          ? `Get ${selectedResume.industry} jobs from the past 3 days matching your resume`
                          : 'Select a resume first to fetch personalized job opportunities'
                        }
                      </p>
                      {!canFetchJobs() && (
                        <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                          Our system needs time to look through thousands of jobs from many job boards to get you the best matches
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleTargetedJobFetch}
                    disabled={scrapingLoading || !selectedResume || !canFetchJobs()}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-12 py-4 text-lg rounded-full disabled:opacity-50 min-w-[300px]"
                  >
                    {scrapingLoading ? (
                      <>
                        <RefreshCw className="h-6 w-6 mr-3 animate-spin" />
                        Searching Thousands of Jobs...
                      </>
                    ) : (
                      <>
                        <Target className="h-6 w-6 mr-3" />
                        {!canFetchJobs() ? 'System Processing Jobs...' : 'Fetch My Job Matches'}
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-purple-600 dark:text-purple-400">
                  <Badge variant="outline" className="border-purple-300 text-purple-700 dark:text-purple-300">
                    <Zap className="h-3 w-3 mr-1" />
                    Past 3 Days Only
                  </Badge>
                  <span>•</span>
                  <span>Personal & Private</span>
                  <span>•</span>
                  <span className="font-medium">
                    {selectedResume ? `${selectedResume.industry} focused` : 'Select resume first'}
                  </span>
                </div>
              </div>

              {/* Privacy notice */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Info className="h-5 w-5" />
                  <span className="font-medium">Personal Job Storage:</span>
                  <span className="text-sm">
                    Jobs you fetch are stored privately in your account and only visible to you. Other users cannot see your job listings.
                  </span>
                </div>
              </div>

              {/* Job Stats */}
              {!loading && !matchingLoading && (
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>Showing {selectedResume ? matchedJobs.length : totalJobs} of your personal jobs from past 3 days</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => { refetch(); reanalyzeJobs(); }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              )}

              {/* Job Content */}
              {loading || matchingLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-600 dark:text-gray-400">Loading your personal job matches...</div>
                </div>
              ) : selectedResume ? (
                <div className="space-y-8">
                  {matchedJobs.length > 0 ? (
                    <div className="grid gap-8">
                      {matchedJobs.map((jobMatch) => (
                        <EnhancedJobMatchCard 
                          key={jobMatch.job.id} 
                          jobMatch={jobMatch} 
                          selectedResumeContent={selectedResume.resume_content}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-600 dark:text-gray-400 mb-4">
                        No personal job matches found. Click "Fetch My Job Matches" above to get fresh job listings!
                      </div>
                    </div>
                  )}
                </div>
              ) : totalJobs > 0 ? (
                <div className="space-y-6">
                  <div className="grid gap-6">
                    {allJobs.map((job) => (
                      <Card key={job.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                              <CardDescription className="text-base font-medium text-blue-600 dark:text-blue-400">
                                {job.company}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary">{job.type}</Badge>
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-600 dark:text-gray-400">
                    No personal jobs found. Select a resume above and click "Fetch My Job Matches" to get started!
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-600 dark:text-gray-400">
                Please sign in to access your personal job matching features.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
