
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Lock, Crown, Zap } from "lucide-react";
import { format } from "date-fns";
import type { Tables } from '@/integrations/supabase/types';

type Job = Tables<'jobs'>;

interface RestrictedJobViewProps {
  jobs: Job[];
  tier: string;
}

export function RestrictedJobView({ jobs, tier }: RestrictedJobViewProps) {
  const visibleJobs = jobs.slice(0, 3);
  const hiddenJobs = jobs.slice(3);

  return (
    <div className="space-y-6">
      {/* Show first 3 jobs normally */}
      {visibleJobs.map((job) => (
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
            
            <Button className="flex-1 sm:flex-none">
              Apply Now
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Show blurred/locked remaining jobs */}
      {hiddenJobs.length > 0 && (
        <div className="space-y-6">
          {hiddenJobs.map((job) => (
            <Card key={job.id} className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/90 dark:via-gray-900/50 dark:to-gray-900/90 z-10 backdrop-blur-sm"></div>
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-center p-6 bg-white/90 dark:bg-gray-900/90 rounded-lg border shadow-lg">
                  <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Premium Feature
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Upgrade to see all job matches
                  </p>
                </div>
              </div>
              
              <CardHeader className="filter blur-sm">
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
              <CardContent className="filter blur-sm">
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
                
                <Button disabled className="flex-1 sm:flex-none">
                  <Lock className="h-4 w-4 mr-2" />
                  Locked
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {/* Upgrade call-to-action */}
          <Card className="border-2 border-gradient bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="text-center py-8">
              <Crown className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-2xl font-bold mb-2 text-purple-800 dark:text-purple-300">
                Unlock All Job Opportunities
              </h3>
              <p className="text-purple-600 dark:text-purple-400 mb-4">
                You're seeing {visibleJobs.length} of {jobs.length} personalized job matches
              </p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">Premium</Badge>
                  <p className="text-sm">20 job fetches</p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">
                    <Zap className="h-3 w-3 mr-1" />
                    Platinum
                  </Badge>
                  <p className="text-sm">Unlimited access</p>
                </div>
              </div>
              <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
