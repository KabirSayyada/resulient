import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, ExternalLink, RefreshCw, Target, Info, Zap, Lock, Crown } from "lucide-react";
import { useJobs, type JobFilters } from "@/hooks/useJobs";
import { useEnhancedJobMatching } from "@/hooks/useEnhancedJobMatching";
import { useJobFetchLimits } from "@/hooks/useJobFetchLimits";
import { ResumeSelector } from "@/components/jobs/ResumeSelector";
import { EnhancedJobMatchCard } from "@/components/jobs/EnhancedJobMatchCard";
import { RestrictedJobView } from "@/components/jobs/RestrictedJobView";
import { useAuth } from "@/hooks/useAuth";
import { useJobScraper } from "@/hooks/useJobScraper";
import { useSubscription } from "@/hooks/useSubscription";
import { extractLocationFromResumeContent, formatLocationForDisplay } from "@/utils/resume/locationExtractor";
import { format } from "date-fns";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { LocationFilter } from "@/components/jobs/LocationFilter";

export default function Jobs() {
  const [filters] = useState<JobFilters>({
    search: '',
    location: '',
    jobType: '',
    salaryRange: ''
  });

  const [customLocation, setCustomLocation] = useState<string>("us"); // Default to lowercase "us"

  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { allJobs, loading, error, refetch, totalJobs } = useJobs(filters);
  const { scrapeJobs, loading: scrapingLoading, lastScrapeTime } = useJobScraper();
  const { limits, incrementUsage, showUpgradeMessage } = useJobFetchLimits();
  const { 
    matchedJobs, 
    loading: matchingLoading, 
    selectedResume,
    handleResumeSelection,
    handleJobApplication,
    reanalyzeJobs
  } = useEnhancedJobMatching();

  // Check if user has premium access (premium or platinum)
  const hasPremiumAccess = subscription.tier === "premium" || subscription.tier === "platinum";

  // Removed cooldown functionality for testing
  const canFetchJobs = () => {
    return true; // Always allow fetching for testing
  };

  const handleTargetedJobFetch = async () => {
    if (!selectedResume || !user) {
      console.error('Cannot fetch jobs: no resume selected or user not authenticated');
      return;
    }

    // Check subscription limits - free tier cannot fetch
    if (subscription.tier === "free" || limits.hasReachedLimit) {
      showUpgradeMessage();
      return;
    }

    try {
      const jobTitle = selectedResume.industry || 'software engineer';
      
      // Use the custom location from the filter (now in proper JSearch format)
      const targetLocation = customLocation || 'us';
      
      console.log(`🎯 Fetching jobs for ${jobTitle} in ${targetLocation} (using JSearch format)`);
      console.log(`📍 Location source: Filter selection (lowercase ISO format)`);
      
      await scrapeJobs({
        query: jobTitle,
        location: targetLocation,
        employment_types: 'FULLTIME',
        num_pages: 5,
        date_posted: '3days',
        user_id: user.id
      });
      
      // Increment usage count after successful fetch
      await incrementUsage();
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <MainNavigation />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
          <div className="relative px-8 py-16 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                <Zap className="h-4 w-4 text-yellow-300" />
                <span className="text-white font-medium text-sm">AI-Powered Job Matching with Location Intelligence</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Your Perfect Job
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Matches Await
                </span>
              </h1>
              
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
                We scour <span className="font-bold text-yellow-300">every single job board</span> across the internet, 
                analyze <span className="font-bold text-yellow-300">millions of opportunities</span>, and use advanced AI 
                to find jobs that perfectly match your skills, experience, and <span className="font-bold text-green-300">location preferences</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-white/80">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-300" />
                  <span className="font-medium">99.2% Match Accuracy</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-300" />
                  <span className="font-medium">Updated Every Hour</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-300" />
                  <span className="font-medium">Location-Smart Matching</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {user ? (
            <div className="space-y-6">
              {/* Enhanced Subscription Experience Notice for Free Users */}
              {subscription.tier === "free" && (
                <div className="relative overflow-hidden mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-red-400/20 rounded-3xl"></div>
                  <div className="relative p-8 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-red-950/30 border-2 border-gradient-to-r from-amber-200 to-orange-200 dark:from-amber-800 dark:to-orange-800 rounded-3xl shadow-2xl">
                    <div className="absolute top-4 right-4">
                      <div className="animate-pulse">
                        <Crown className="h-8 w-8 text-amber-500" />
                      </div>
                    </div>
                    
                    <div className="max-w-4xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg">
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            Unlock AI Job Matching
                          </h3>
                          <p className="text-amber-700 dark:text-amber-400 mt-1">
                            Job fetching requires a Premium or Platinum subscription
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 mb-6">
                        <p className="text-amber-800 dark:text-amber-300 text-lg leading-relaxed mb-4">
                          🚀 Experience our advanced AI job matching with location intelligence by upgrading to Premium or Platinum!
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="font-bold text-purple-700 dark:text-purple-300">PREMIUM</span>
                            </div>
                            <p className="text-sm text-purple-600 dark:text-purple-400">20 job fetches + unlimited access</p>
                          </div>
                          
                          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="h-3 w-3 text-emerald-500" />
                              <span className="font-bold text-emerald-700 dark:text-emerald-300">PLATINUM</span>
                            </div>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">Unlimited job fetches</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resume Selector */}
              <ResumeSelector 
                onResumeSelected={handleResumeSelection}
                selectedResumeId={selectedResume?.id}
              />

              {/* Location Filter - Show for all users but require premium for fetching */}
              <LocationFilter
                onLocationChange={setCustomLocation}
                defaultLocation={customLocation}
                disabled={scrapingLoading}
              />

              {/* AI-Powered Job Fetch Section */}
              <div className="relative overflow-hidden mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 rounded-3xl"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent rounded-3xl"></div>
                
                <div className="relative p-10 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-red-950/30 rounded-3xl border-2 border-purple-200 dark:border-purple-800 shadow-2xl">
                  <div className="text-center space-y-8 max-w-5xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
                        <div className="relative p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-xl">
                          <Target className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <div className="text-left">
                        <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
                          AI Job Discovery Engine
                        </h3>
                        <p className="text-xl text-purple-600 dark:text-purple-400 font-medium">
                          Now with intelligent location-based matching
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 mb-8">
                      <p className="text-2xl text-purple-800 dark:text-purple-300 leading-relaxed mb-6">
                        {subscription.tier === "free" 
                          ? '🔒 Job fetching requires Premium or Platinum subscription'
                          : selectedResume 
                            ? `🎯 Ready to find perfect ${selectedResume.industry} opportunities!`
                            : '🔍 Select your resume above to unlock personalized job discovery'
                        }
                      </p>
                      
                      {selectedResume && hasPremiumAccess && (
                        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                            <MapPin className="h-5 w-5" />
                            <span className="font-medium">
                              Target location: {customLocation} (selected in location filter)
                            </span>
                          </div>
                        </div>
                      )}
                      
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                              <span className="text-white font-bold text-xl">10K+</span>
                            </div>
                            <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-1">Job Boards</h4>
                            <p className="text-sm text-blue-600 dark:text-blue-400">Scanned daily</p>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-emerald-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                              <span className="text-white font-bold text-xl">1M+</span>
                            </div>
                            <h4 className="font-bold text-emerald-700 dark:text-emerald-300 mb-1">Jobs Daily</h4>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">Analyzed by AI</p>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/40 p-6 rounded-2xl border border-purple-200 dark:border-purple-800">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-purple-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                              <span className="text-white font-bold text-xl">99%</span>
                            </div>
                            <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-1">Match Rate</h4>
                            <p className="text-sm text-purple-600 dark:text-purple-400">Accuracy</p>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 p-6 rounded-2xl border border-amber-200 dark:border-amber-800">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-amber-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-1">Location</h4>
                            <p className="text-sm text-amber-600 dark:text-amber-400">Smart matching</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleTargetedJobFetch}
                      disabled={scrapingLoading || !selectedResume || subscription.tier === "free"}
                      size="lg"
                      className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold px-8 sm:px-16 py-6 text-lg sm:text-xl rounded-full disabled:opacity-50 w-full sm:w-auto shadow-2xl transform transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {scrapingLoading ? (
                        <>
                          <RefreshCw className="h-7 w-7 mr-4 animate-spin" />
                          🚀 Scanning The Internet For Your Jobs...
                        </>
                      ) : subscription.tier === "free" ? (
                        <>
                          <Lock className="h-7 w-7 mr-4" />
                          🔓 Upgrade to Access Job Fetching
                        </>
                      ) : limits.hasReachedLimit ? (
                        <>
                          <Lock className="h-7 w-7 mr-4" />
                          Fetch Limit Reached - Upgrade for More
                        </>
                      ) : (
                        <>
                          <Target className="h-7 w-7 mr-4" />
                          🎯 Find My Perfect Jobs Now
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-purple-600 dark:text-purple-400">
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-sm">Freshest Jobs (Updated Hourly)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800">
                      <Target className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-sm">100% Personal & Private</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-sm">Location-Smart Matching</span>
                    </div>
                    {selectedResume && (
                      <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800">
                        <Crown className="h-4 w-4 text-amber-500" />
                        <span className="font-medium text-sm">
                          {selectedResume.industry} + {customLocation} Focused
                        </span>
                      </div>
                    )}
                    {subscription.tier === "premium" && (
                      <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800">
                        <RefreshCw className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-blue-600 dark:text-blue-400 text-sm">
                          {limits.limit - limits.used} Premium Fetches Left
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              
              {/* Quality work notice */}
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <Target className="h-5 w-5" />
                  <span className="font-medium">Premium Job Matching:</span>
                  <span className="text-sm">
                    Our AI scans thousands of job boards daily to find the perfect matches for your skills, experience, and location. Each job is carefully analyzed for compatibility with your resume.
                  </span>
                </div>
              </div>

              {/* Job Stats */}
              {!loading && !matchingLoading && (
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>Showing {selectedResume ? matchedJobs.length : totalJobs} of your personal jobs with the most latest postings</span>
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
                    hasPremiumAccess ? (
                      <div className="grid gap-8">
                         {matchedJobs.map((jobMatch) => (
                           <EnhancedJobMatchCard 
                             key={jobMatch.job.id} 
                             jobMatch={jobMatch} 
                             selectedResumeContent={selectedResume.resume_content}
                             onJobApplication={handleJobApplication}
                           />
                         ))}
                      </div>
                    ) : (
                      <RestrictedJobView jobs={matchedJobs.map(match => match.job)} tier={subscription.tier} />
                    )
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
                    {hasPremiumAccess ? (
                      allJobs.map((job) => (
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
                      ))
                    ) : (
                      <RestrictedJobView jobs={allJobs} tier={subscription.tier} />
                    )}
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
