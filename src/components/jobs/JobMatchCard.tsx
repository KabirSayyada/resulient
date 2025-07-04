
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, ExternalLink, Target, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import type { JobMatch } from "@/hooks/useJobMatching";

interface JobMatchCardProps {
  jobMatch: JobMatch;
}

export function JobMatchCard({ jobMatch }: JobMatchCardProps) {
  const { job, matchScore, matchReasons, keywordMatches, skillsScore, experienceScore, locationScore, industryScore, qualityBonus } = jobMatch;

  const getMatchColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 70) return "Excellent Match";
    if (score >= 50) return "Good Match";
    return "Potential Match";
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-blue-600 dark:text-blue-400";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: matchScore >= 70 ? '#10b981' : matchScore >= 50 ? '#f59e0b' : '#3b82f6' }}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-orange-500" />
                <Badge variant="secondary" className={`${getMatchColor(matchScore)} text-white`}>
                  {matchScore}% {getMatchLabel(matchScore)}
                </Badge>
              </div>
            </div>
            <CardDescription className="text-base font-medium text-blue-600 dark:text-blue-400">
              {job.company}
            </CardDescription>
          </div>
          <Badge variant="secondary">{job.type}</Badge>
        </div>

        {/* Enhanced Match Breakdown */}
        <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-1 mb-2">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-300">
              Smart Match Analysis:
            </span>
          </div>
          
          {/* Enhanced Score Breakdown with Progress Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
            {[
              { score: skillsScore, label: "Skills", max: 35 },
              { score: experienceScore, label: "Experience", max: 25 },
              { score: industryScore, label: "Industry", max: 20 },
              { score: locationScore, label: "Location", max: 10 },
              { score: qualityBonus, label: "Profile", max: 10 }
            ].map((item, index) => {
              const percentage = (item.score / item.max) * 100;
              const animationDelay = index * 0.1;
              
              return (
                <div key={item.label} className="text-center space-y-2">
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                          percentage >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-blue-500 to-indigo-600'
                        }`}
                        style={{ 
                          width: `${Math.min(percentage, 100)}%`,
                          animationDelay: `${animationDelay}s`
                        }}
                      />
                    </div>
                    <div className="absolute -top-1 -right-1">
                      {percentage >= 80 && (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${getScoreColor(item.score)}`}>
                    {Math.round(item.score)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confidence Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {matchScore >= 80 && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse">
                🏆 {Math.round((matchScore / 100) * 100)}% Confidence
              </Badge>
            )}
            {matchScore >= 60 && matchScore < 80 && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                ⭐ {Math.round((matchScore / 100) * 100)}% Match
              </Badge>
            )}
            {matchScore >= 40 && matchScore < 60 && (
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                🎯 {Math.round((matchScore / 100) * 100)}% Potential
              </Badge>
            )}
            {skillsScore >= 25 && (
              <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-300">
                💪 Strong Skills Match
              </Badge>
            )}
            {experienceScore >= 20 && (
              <Badge variant="outline" className="border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                📈 Experience Aligned
              </Badge>
            )}
          </div>

          {/* Match Reasons */}
          {matchReasons.length > 0 && (
            <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
              {matchReasons.slice(0, 4).map((reason, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span>•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          )}
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
        
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {job.description}
        </p>

        {/* Matching keywords */}
        {keywordMatches.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Your matching skills:
            </p>
            <div className="flex flex-wrap gap-1">
              {keywordMatches.map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Job tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Resume Optimization Reminder */}
        <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-500 rounded-lg flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                Important Reminder
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-400">
                Before applying, make sure to come back and use our Resume Optimizer to get a tailored resume for this specific job. This significantly increases your chances of getting an interview!
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {job.external_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={job.external_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
