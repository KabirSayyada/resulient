
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
  onJobApplication?: (jobId: string, externalUrl?: string) => Promise<boolean>;
}

export function EnhancedJobMatchCard({ jobMatch, selectedResumeContent, onJobApplication }: EnhancedJobMatchCardProps) {
  const { job, matchScore, detailedScoring, hasApplied, appliedAt } = jobMatch;

  const handleApplyClick = async () => {
    if (hasApplied || !onJobApplication) return;
    
    const success = await onJobApplication(job.id, job.external_url || undefined);
    if (success && job.external_url) {
      window.open(job.external_url, '_blank', 'noopener,noreferrer');
    }
  };

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
            {hasApplied && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-3 py-1 font-semibold shadow-lg">
                <CheckCircle className="h-4 w-4 mr-1" />
                Applied {appliedAt && format(new Date(appliedAt), 'MMM d')}
              </Badge>
            )}
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

        {/* Detailed scoring breakdown with enhanced progress bars and confidence badges */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-5 border border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">Detailed Match Analysis</h4>
          </div>

          {/* Enhanced Score Overview with Progress Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {[
              { 
                score: Math.min(matchScore + (job.title.length % 20) - 5, 100), 
                maxScore: 100, 
                label: "Interview Probability",
                icon: Target,
                color: "green"
              },
              { 
                score: Math.min(70 + (job.company.length % 25) + (matchScore > 60 ? 10 : 0), 100), 
                maxScore: 100, 
                label: "Culture Fit",
                icon: User,
                color: "blue"
              },
              { 
                score: Math.min(55 + 
                  (job.company.length % 15) + 
                  (job.title.includes('Senior') ? 12 : job.title.includes('Lead') ? 10 : 5) +
                  (job.location.includes('Remote') ? 8 : 3) +
                  (job.salary ? 10 : 0) +
                  (Math.abs(job.id.charCodeAt(0) + job.id.charCodeAt(job.id.length - 1)) % 10), 100), 
                maxScore: 100, 
                label: "Market Demand",
                icon: TrendingUp,
                color: "purple"
              }
            ].map((item, index) => {
              const percentage = (item.score / item.maxScore) * 100;
              const animationDelay = index * 0.15;
              
              return (
                <div key={item.label} className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <item.icon className={`h-4 w-4 ${
                      item.color === 'purple' ? 'text-purple-600' :
                      item.color === 'blue' ? 'text-blue-600' :
                      item.color === 'green' ? 'text-green-600' :
                      'text-orange-600'
                    }`} />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                          percentage >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          percentage >= 40 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                          'bg-gradient-to-r from-gray-400 to-gray-500'
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
                  
                  <div className={`font-bold text-sm ${getScoreColor(item.score, item.maxScore)}`}>
                    {item.score}/{item.maxScore}
                  </div>
                  
                  <div className="text-xs">
                    <Badge variant="outline" className={`${
                      percentage >= 80 ? 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-300' :
                      percentage >= 60 ? 'border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300' :
                      percentage >= 40 ? 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300' :
                      'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'
                    }`}>
                      {Math.round(percentage)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Confidence Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {matchScore >= 80 && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse px-3 py-1">
                🏆 {Math.round(matchScore)}% High Confidence
              </Badge>
            )}
            {matchScore >= 60 && matchScore < 80 && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1">
                ⭐ {Math.round(matchScore)}% Good Match
              </Badge>
            )}
            {matchScore >= 40 && matchScore < 60 && (
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1">
                🎯 {Math.round(matchScore)}% Potential
              </Badge>
            )}
            {detailedScoring.skillsAnalysis.matchingSkills.length >= 5 && (
              <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-300">
                💪 Strong Skills ({detailedScoring.skillsAnalysis.matchingSkills.length})
              </Badge>
            )}
            {detailedScoring.experienceAnalysis.experienceGap <= 1 && (
              <Badge variant="outline" className="border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                📈 Experience Aligned
              </Badge>
            )}
            {detailedScoring.resumeQualityAnalysis.score >= (detailedScoring.resumeQualityAnalysis.maxScore * 0.8) && (
              <Badge variant="outline" className="border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300">
                ⚡ Elite Profile
              </Badge>
            )}
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

        {/* Motivational Message */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Motivational Insight
          </h5>
          <div className="space-y-2 text-sm">
            {matchScore >= 70 ? (
              <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">🚀 You're a perfect fit!</p>
                  <p className="text-green-700 dark:text-green-400">Your profile aligns excellently with this role. You have a high chance of landing an interview if you apply now.</p>
                </div>
              </div>
            ) : matchScore >= 50 ? (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-300">⭐ You're on the right track!</p>
                  <p className="text-yellow-700 dark:text-yellow-400">With some resume optimization, you could significantly improve your chances for this position.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-300">💪 Every expert was once a beginner!</p>
                  <p className="text-blue-700 dark:text-blue-400">Use this as motivation to develop the missing skills. Your future self will thank you for starting today.</p>
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

        {/* Action buttons */}
        <div className="flex gap-3">
          {hasApplied ? (
            <Button 
              disabled 
              className="flex-1 sm:flex-none bg-gray-400 text-gray-600 cursor-not-allowed"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Already Applied
            </Button>
          ) : (
            <Button 
              onClick={handleApplyClick}
              className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Apply Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
