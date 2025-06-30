
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, Clock, DollarSign, ExternalLink, Target, Sparkles, 
  TrendingUp, Building, Calendar, Award, AlertTriangle, CheckCircle, 
  XCircle, User, BookOpen, Briefcase, Star
} from "lucide-react";
import { format } from "date-fns";
import type { EnhancedJobMatch } from "@/hooks/useEnhancedJobMatching";

interface EnhancedJobMatchCardProps {
  jobMatch: EnhancedJobMatch;
  selectedResumeContent?: string;
}

export function EnhancedJobMatchCard({ jobMatch, selectedResumeContent }: EnhancedJobMatchCardProps) {
  const { job, matchScore, detailedScoring } = jobMatch;

  const getMatchColor = (score: number) => {
    if (score >= 70) return "from-green-500 to-emerald-600";
    if (score >= 50) return "from-yellow-500 to-orange-500";
    return "from-blue-500 to-indigo-600";
  };

  const getMatchBadgeColor = (score: number) => {
    if (score >= 70) return "bg-gradient-to-r from-green-500 to-emerald-600";
    if (score >= 50) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-blue-500 to-indigo-600";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 70) return "Excellent Match";
    if (score >= 50) return "Good Match";
    return "Potential Match";
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header with gradient border */}
      <div className={`h-1 bg-gradient-to-r ${getMatchColor(matchScore)}`} />
      
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {job.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-base font-medium mt-1">
                  <Building className="h-4 w-4" />
                  {job.company}
                </CardDescription>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge 
              className={`${getMatchBadgeColor(matchScore)} text-white border-0 px-3 py-1 font-semibold shadow-lg`}
            >
              <Target className="h-4 w-4 mr-1" />
              {matchScore}% {getMatchLabel(matchScore)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {job.type}
            </Badge>
          </div>
        </div>

        {/* Job details row */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>{job.salary}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(job.posted_date), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Job description */}
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {job.description.length > 200 
              ? `${job.description.substring(0, 200)}...` 
              : job.description
            }
          </p>
        </div>

        {/* Detailed scoring breakdown */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-5 border border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">Detailed Match Analysis</h4>
          </div>

          <div className="space-y-4">
            {/* Skills Analysis */}
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-gray-800 dark:text-gray-200">Skills Match</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getScoreColor(detailedScoring.skillsAnalysis.score, detailedScoring.skillsAnalysis.maxScore)}`}>
                    {detailedScoring.skillsAnalysis.score}/{detailedScoring.skillsAnalysis.maxScore}
                  </span>
                </div>
              </div>
              <Progress 
                value={(detailedScoring.skillsAnalysis.score / detailedScoring.skillsAnalysis.maxScore) * 100} 
                className="h-2 mb-3"
              />
              
              {detailedScoring.skillsAnalysis.matchingSkills.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      Matching Skills ({detailedScoring.skillsAnalysis.matchingSkills.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {detailedScoring.skillsAnalysis.matchingSkills.slice(0, 5).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        {skill}
                      </Badge>
                    ))}
                    {detailedScoring.skillsAnalysis.matchingSkills.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{detailedScoring.skillsAnalysis.matchingSkills.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {detailedScoring.skillsAnalysis.missingSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-400">
                      Skills to Develop ({detailedScoring.skillsAnalysis.missingSkills.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {detailedScoring.skillsAnalysis.missingSkills.slice(0, 5).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                        {skill}
                      </Badge>
                    ))}
                    {detailedScoring.skillsAnalysis.missingSkills.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{detailedScoring.skillsAnalysis.missingSkills.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Experience Analysis */}
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-800 dark:text-gray-200">Experience Match</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getScoreColor(detailedScoring.experienceAnalysis.score, detailedScoring.experienceAnalysis.maxScore)}`}>
                    {detailedScoring.experienceAnalysis.score}/{detailedScoring.experienceAnalysis.maxScore}
                  </span>
                </div>
              </div>
              <Progress 
                value={(detailedScoring.experienceAnalysis.score / detailedScoring.experienceAnalysis.maxScore) * 100} 
                className="h-2 mb-3"
              />
              
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {detailedScoring.experienceAnalysis.requiredExperience && (
                  <div>Required: <span className="font-medium">{detailedScoring.experienceAnalysis.requiredExperience}+ years</span></div>
                )}
                {detailedScoring.experienceAnalysis.experienceGap > 0 && (
                  <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Gap: {detailedScoring.experienceAnalysis.experienceGap} years</span>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Quality Analysis */}
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-gray-800 dark:text-gray-200">Profile Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getScoreColor(detailedScoring.resumeQualityAnalysis.score, detailedScoring.resumeQualityAnalysis.maxScore)}`}>
                    {detailedScoring.resumeQualityAnalysis.score}/{detailedScoring.resumeQualityAnalysis.maxScore}
                  </span>
                </div>
              </div>
              <Progress 
                value={(detailedScoring.resumeQualityAnalysis.score / detailedScoring.resumeQualityAnalysis.maxScore) * 100} 
                className="h-2 mb-3"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {detailedScoring.resumeQualityAnalysis.strengthAreas.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3 w-3 text-green-500" />
                      <span className="font-medium text-green-700 dark:text-green-400">Strengths</span>
                    </div>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {detailedScoring.resumeQualityAnalysis.strengthAreas.map((strength, index) => (
                        <li key={index}>• {strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailedScoring.resumeQualityAnalysis.improvementAreas.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="h-3 w-3 text-orange-500" />
                      <span className="font-medium text-orange-700 dark:text-orange-400">Improve</span>
                    </div>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {detailedScoring.resumeQualityAnalysis.improvementAreas.map((area, index) => (
                        <li key={index}>• {area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Application tips */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Application Tips
          </h5>
          <div className="space-y-2 text-sm">
            {matchScore >= 70 ? (
              <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">Strong Match - Apply Now!</p>
                  <p className="text-green-700 dark:text-green-400">Always optimize your resume first before applying.</p>
                </div>
              </div>
            ) : matchScore >= 50 ? (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-300">Good Potential - Optimize First</p>
                  <p className="text-yellow-700 dark:text-yellow-400">Tailor your resume to highlight relevant skills before applying.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-300">Room for Improvement</p>
                  <p className="text-blue-700 dark:text-blue-400">Focus on developing missing skills and optimizing your resume structure.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resume Optimization Reminder */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl p-5 border border-orange-200/50 dark:border-orange-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 dark:text-orange-300">Important Reminder</h4>
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Before applying, make sure to come back and use our Resume Optimizer to get a tailored resume for this specific job. This significantly increases your chances of getting an interview!
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action buttons - removed Save Job button */}
        <div className="flex gap-3">
          {job.external_url ? (
            <Button asChild className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <a href={job.external_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Apply Now
              </a>
            </Button>
          ) : (
            <Button className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <ExternalLink className="mr-2 h-4 w-4" />
              Apply Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
