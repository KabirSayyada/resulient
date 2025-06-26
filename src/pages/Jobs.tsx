
import React, { useState } from "react";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { useJobSearch, JobSearchFilters } from "@/hooks/useJobSearch";
import { JobPosting } from "@/types/job";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Briefcase, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Jobs() {
  const [filters, setFilters] = useState<JobSearchFilters>({});
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { jobs, loading, error, refreshJobs, getJobMatch } = useJobSearch(filters);

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleViewDetails = (job: JobPosting) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const recentJobs = jobs.filter(job => {
    const postedDate = new Date(job.posted_at);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return postedDate > twentyFourHoursAgo;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <MainNavigation />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
              <p className="text-gray-600">
                Discover and apply to jobs that match your skills and preferences
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                Filters
              </Button>
              <Button
                variant="outline"
                onClick={refreshJobs}
                disabled={loading}
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Total Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jobs.length}</div>
                <p className="text-xs text-muted-foreground">Available positions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Posted Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentJobs.length}</div>
                <p className="text-xs text-muted-foreground">Fresh opportunities</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Best Match
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobs.length > 0 && getJobMatch(jobs[0]?.id) 
                    ? `${getJobMatch(jobs[0].id)?.match_score}%` 
                    : 'N/A'
                  }
                </div>
                <p className="text-xs text-muted-foreground">Top compatibility</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <JobFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading jobs...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={refreshJobs} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or check back later for new opportunities.
                </p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    match={getJobMatch(job.id)}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        match={selectedJob ? getJobMatch(selectedJob.id) : undefined}
        open={!!selectedJob}
        onClose={handleCloseModal}
      />
    </div>
  );
}
