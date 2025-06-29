import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, ExternalLink, Briefcase, RefreshCw, Target, Sparkles, Info } from "lucide-react";
import { useJobs, type JobFilters } from "@/hooks/useJobs";
import { useJobMatching } from "@/hooks/useJobMatching";
import { JobSeeder } from "@/components/jobs/JobSeeder";
import { JobFilters as JobFiltersComponent } from "@/components/jobs/JobFilters";
import { JobMatchCard } from "@/components/jobs/JobMatchCard";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

export default function Jobs() {
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    location: '',
    jobType: '',
    salaryRange: ''
  });

  const { user } = useAuth();
  const { jobs, loading, error, refetch, totalJobs } = useJobs(filters);
  const { matchedJobs, loading: matchingLoading, refindMatches } = useJobMatching();

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

  // Filter out jobs that are already in matched jobs to avoid duplicates
  const matchedJobIds = new Set(matchedJobs.map(match => match.job.id));
  const otherJobs = jobs.filter(job => !matchedJobIds.has(job.id));

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

          {/* Job Filters */}
          <JobFiltersComponent 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Results Summary */}
          {!loading && (
            <div className="mb-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>
                  {user && matchedJobs.length > 0 ? (
                    <>
                      Showing {matchedJobs.length} personalized matches
                      {otherJobs.length > 0 && (
                        <span> + {otherJobs.length} other jobs</span>
                      )}
                    </>
                  ) : (
                    <>Showing {jobs.length} of {totalJobs} jobs</>
                  )}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => { refetch(); refindMatches(); }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          )}

          {/* Fallback seeder for when no jobs exist */}
          {totalJobs === 0 && !loading && (
            <div className="mb-8">
              <JobSeeder />
            </div>
          )}

          {loading || matchingLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-600 dark:text-gray-400">Loading your personalized job matches...</div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Personalized Job Matches */}
              {user && matchedJobs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Target className="h-5 w-5 text-orange-500" />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Your Personalized Matches
                    </h2>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                      {matchedJobs.length} matches
                    </Badge>
                  </div>
                  <div className="grid gap-6 mb-8">
                    {matchedJobs.map((jobMatch) => (
                      <JobMatchCard key={jobMatch.job.id} jobMatch={jobMatch} />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Jobs (for authenticated users) or All Jobs (for non-authenticated) */}
              {(!user || otherJobs.length > 0) && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {user && matchedJobs.length > 0 ? 'More Opportunities' : 'Latest Job Opportunities'}
                    </h2>
                  </div>
                  <div className="grid gap-6">
                    {(user ? otherJobs : jobs).map((job) => (
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* No jobs message */}
              {jobs.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-600 dark:text-gray-400">
                    {user ? 
                      "No jobs match your profile yet. Check back later as we add fresh opportunities throughout the day!" :
                      "No jobs available right now. Fresh opportunities are added throughout the day!"
                    }
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
      </div>
    </div>
  );
}
