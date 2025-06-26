
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Building, DollarSign, ExternalLink, CheckCircle } from "lucide-react";
import { JobPosting, JobMatch } from "@/types/job";
import { useJobApplication } from "@/hooks/useJobApplication";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: JobPosting;
  match?: JobMatch;
  onViewDetails: (job: JobPosting) => void;
}

export function JobCard({ job, match, onViewDetails }: JobCardProps) {
  const { applyToJob, hasApplied, applying } = useJobApplication();
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      const hasAppliedToJob = await hasApplied(job.id);
      setApplied(hasAppliedToJob);
    };
    checkApplicationStatus();
  }, [job.id, hasApplied]);

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await applyToJob(job.id);
    if (result) {
      setApplied(true);
    }
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return null;
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const timeAgo = formatDistanceToNow(new Date(job.posted_at), { addSuffix: true });

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 hover:text-blue-600" onClick={() => onViewDetails(job)}>
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Building className="h-4 w-4" />
              <span className="font-medium">{job.company}</span>
              {job.location && (
                <>
                  <span>•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Posted {timeAgo}</span>
              {match && (
                <Badge className={`ml-2 ${getMatchColor(match.match_score)}`}>
                  {match.match_score}% match
                </Badge>
              )}
            </div>
          </div>
          {job.source_platform && (
            <Badge variant="outline" className="ml-2">
              {job.source_platform}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {job.job_type && (
              <Badge variant="secondary">{job.job_type}</Badge>
            )}
            {job.work_arrangement && (
              <Badge variant="secondary">{job.work_arrangement}</Badge>
            )}
            {job.experience_level && (
              <Badge variant="outline">{job.experience_level}</Badge>
            )}
          </div>
          
          {formatSalary(job.salary_min, job.salary_max) && (
            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
              <DollarSign className="h-4 w-4" />
              {formatSalary(job.salary_min, job.salary_max)}
            </div>
          )}
          
          <p className="text-sm text-gray-600 line-clamp-3">
            {job.description.substring(0, 200)}...
          </p>
          
          <div className="flex gap-2 pt-2">
            {applied ? (
              <Button disabled className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Applied
              </Button>
            ) : (
              <Button 
                onClick={handleApply}
                disabled={applying}
                className="flex-1"
              >
                {applying ? 'Applying...' : 'Quick Apply'}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => onViewDetails(job)}
              className="flex-1"
            >
              View Details
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.open(job.source_url, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
