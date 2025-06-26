
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Building, DollarSign, ExternalLink, CheckCircle, Target } from "lucide-react";
import { JobPosting, JobMatch } from "@/types/job";
import { useJobApplication } from "@/hooks/useJobApplication";
import { formatDistanceToNow } from "date-fns";

interface JobDetailModalProps {
  job: JobPosting | null;
  match?: JobMatch;
  open: boolean;
  onClose: () => void;
}

export function JobDetailModal({ job, match, open, onClose }: JobDetailModalProps) {
  const { applyToJob, hasApplied, applying } = useJobApplication();
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (job) {
      const checkApplicationStatus = async () => {
        const hasAppliedToJob = await hasApplied(job.id);
        setApplied(hasAppliedToJob);
      };
      checkApplicationStatus();
    }
  }, [job, hasApplied]);

  if (!job) return null;

  const handleApply = async () => {
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{job.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Job Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-medium">
              <Building className="h-5 w-5" />
              {job.company}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {job.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Posted {timeAgo}</span>
              </div>
              {match && (
                <Badge className={`${getMatchColor(match.match_score)}`}>
                  <Target className="h-3 w-3 mr-1" />
                  {match.match_score}% match
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {job.job_type && <Badge variant="secondary">{job.job_type}</Badge>}
              {job.work_arrangement && <Badge variant="secondary">{job.work_arrangement}</Badge>}
              {job.experience_level && <Badge variant="outline">{job.experience_level}</Badge>}
              {job.industry && <Badge variant="outline">{job.industry}</Badge>}
              <Badge variant="outline">{job.source_platform}</Badge>
            </div>
            
            {formatSalary(job.salary_min, job.salary_max) && (
              <div className="flex items-center gap-2 text-lg font-medium text-green-600">
                <DollarSign className="h-5 w-5" />
                {formatSalary(job.salary_min, job.salary_max)}
              </div>
            )}
          </div>
          
          {/* Match Details */}
          {match && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Match Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{match.skills_match}%</div>
                  <div className="text-sm text-gray-600">Skills Match</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{match.experience_match}%</div>
                  <div className="text-sm text-gray-600">Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{match.location_match}%</div>
                  <div className="text-sm text-gray-600">Location</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{match.salary_match}%</div>
                  <div className="text-sm text-gray-600">Salary</div>
                </div>
              </div>
            </div>
          )}
          
          <Separator />
          
          {/* Job Description */}
          <div>
            <h3 className="font-semibold mb-3">Job Description</h3>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>
          
          {/* Requirements */}
          {job.requirements && (
            <div>
              <h3 className="font-semibold mb-3">Requirements</h3>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{job.requirements}</p>
              </div>
            </div>
          )}
          
          {/* Company Info */}
          {job.company_size && (
            <div>
              <h3 className="font-semibold mb-3">Company Information</h3>
              <p className="text-sm text-gray-600">Company Size: {job.company_size}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {applied ? (
              <Button disabled className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Applied
              </Button>
            ) : (
              <Button onClick={handleApply} disabled={applying} className="flex-1">
                {applying ? 'Applying...' : 'Quick Apply'}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => window.open(job.source_url, '_blank')}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Original
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
