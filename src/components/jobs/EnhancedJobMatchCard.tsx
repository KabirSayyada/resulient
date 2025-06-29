
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, Clock, DollarSign, ExternalLink, Target, Sparkles, 
  TrendingUp, Building, Calendar, Award, AlertTriangle, CheckCircle, 
  XCircle, User, Zap, BookOpen, Briefcase, Star, FileText, 
  ArrowRight, Lightbulb, Shield
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { EnhancedJobMatch } from "@/hooks/useEnhancedJobMatching";

interface EnhancedJobMatchCardProps {
  jobMatch: EnhancedJobMatch;
}

export function EnhancedJobMatchCard({ jobMatch }: EnhancedJobMatchCardProps) {
  const { job, matchScore, detailedScoring } = jobMatch;
  const navigate = useNavigate();

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

  const handleOptimizeResume = () => {
    // Navigate to resume optimization page with job description pre-filled
    const jobDescription = `${job.title} at ${job.company}\n\nLocation: ${job.location}\n\nJob Description:\n${job.description}\n\nRequirements:\n${job.requirements || 'See job description above'}`;
    
    // Store job description in localStorage to pre-fill the form
    localStorage.setItem('prefilledJobDescription', jobDescription);
    navigate('/resume-optimization');
  };

  const getApplicationTips = () => {
    const tips = [];
    if (detailedScoring.skillsGapAnalysis.criticalMissingSkills.length > 0) {
      tips.push(`Focus on ${detailedScoring.skillsGapAnalysis.criticalMissingSkills[0]} skills`);
    }
    if (detailedScoring.resumeQualityAnalysis.overallScore < 75) {
      tips.push('Improve resume quality first');
    }
    if (detailedScoring.skillsAnalysis.matchingSkills.length > 3) {
      tips.push('Highlight relevant experience');
    } else {
      tips.push('Emphasize transferable skills');
    }
    tips.push('Tailor resume to job keywords');
    return tips;
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

            {/* Skills Gap Analysis */}
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-gray-800 dark:text-gray-200">Skills Gap Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getScoreColor(detailedScoring.skillsGapAnalysis.score, detailedScoring.skillsGapAnalysis.maxScore)}`}>
                    {detailedScoring.skillsGapAnalysis.score}/{detailedScoring.skillsGapAnalysis.maxScore}
                  </span>
                </div>
              </div>
              <Progress 
                value={(detailedScoring.skillsGapAnalysis.score / detailedScoring.skillsGapAnalysis.maxScore) * 100} 
                className="h-2 mb-3"
              />
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-blue-700 dark:text-blue-400">
                    {detailedScoring.skillsGapAnalysis.skillsStrength}
                  </span>
                </div>
                
                {detailedScoring.skillsGapAnalysis.criticalMissingSkills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-red-700 dark:text-red-400">Critical Skills Gap</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {detailedScoring.skillsGapAnalysis.criticalMissingSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {detailedScoring.skillsGapAnalysis.recommendedSkills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-yellow-700 dark:text-yellow-400">Nice to Have</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {detailedScoring.skillsGapAnalysis.recommendedSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
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

        {/* Application Tips */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h5 className="font-semibold text-purple-800 dark:text-purple-300">Application Tips</h5>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {getApplicationTips().map((tip, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                <ArrowRight className="h-3 w-3 flex-shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-3 flex-1">
            {job.external_url ? (
              <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <a href={job.external_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Apply Now
                </a>
              </Button>
            ) : (
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <ExternalLink className="mr-2 h-4 w-4" />
                Apply Now
              </Button>
            )}
            <Button variant="outline" size="default" className="border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Star className="mr-2 h-4 w-4" />
              Save Job
            </Button>
          </div>
          
          {/* Resume Optimization Button */}
          <Button 
            onClick={handleOptimizeResume}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
          >
            <FileText className="mr-2 h-4 w-4" />
            Optimize Resume for This Job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
