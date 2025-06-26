
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, ExternalLink, Briefcase } from "lucide-react";
import { useJobs, type JobFilters } from "@/hooks/useJobs";
import { JobSeeder } from "@/components/jobs/JobSeeder";
import { JobFilters as JobFiltersComponent } from "@/components/jobs/JobFilters";
import { format } from "date-fns";

export default function Jobs() {
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    location: '',
    jobType: '',
    salaryRange: ''
  });

  const { jobs, loading, error, refetch, totalJobs } = useJobs(filters);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Job Opportunities
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover your next career opportunity with our curated job listings
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
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
                  Showing {jobs.length} of {totalJobs} jobs
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={refetch}>
                Refresh
              </Button>
            </div>
          )}

          {/* Temporary seeder component - can be removed once we have real data */}
          {totalJobs === 0 && !loading && (
            <div className="mb-8">
              <JobSeeder />
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600 dark:text-gray-400">Loading jobs...</div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600 dark:text-gray-400">
                {totalJobs === 0 ? "No jobs available at the moment." : "No jobs match your current filters."}
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
          ) : (
            <div className="grid gap-6">
              {jobs.map((job) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
