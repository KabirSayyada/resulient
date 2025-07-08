
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FileText, TrendingUp, Calendar, Target, Zap, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import type { ResumeScoreRecord } from '@/types/resume';

interface ResumeSelectorProps {
  onResumeSelected: (resumeScore: ResumeScoreRecord) => void;
  selectedResumeId?: string;
}

export function ResumeSelector({ onResumeSelected, selectedResumeId }: ResumeSelectorProps) {
  const [resumeScores, setResumeScores] = useState<ResumeScoreRecord[]>([]);
  const [qualifyingResumes, setQualifyingResumes] = useState<ResumeScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserResumeScores();
    }
  }, [user]);

  const fetchUserResumeScores = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('resume_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setResumeScores(data || []);
      
      // Filter resumes with score > 60
      const qualifying = (data || []).filter(resume => resume.overall_score > 60);
      setQualifyingResumes(qualifying);
      
      // Auto-select the highest scoring qualifying resume if none selected
      if (qualifying.length > 0 && !selectedResumeId) {
        const highestScoring = qualifying.reduce((prev, current) => 
          (prev.overall_score > current.overall_score) ? prev : current
        );
        onResumeSelected(highestScoring);
      }
    } catch (error) {
      console.error('Error fetching resume scores:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading your resumes...</div>
        </CardContent>
      </Card>
    );
  }

  if (resumeScores.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Resume Scores Found
            </h3>
            <p className="text-gray-500 mb-4">
              Score your resume first to get personalized job matches
            </p>
            <Button onClick={() => window.location.href = '/resume-scoring'}>
              Score My Resume
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show message if no qualifying resumes (score > 60)
  if (qualifyingResumes.length === 0) {
    return (
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-3xl"></div>
        
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-900 dark:to-orange-950/30 shadow-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>
          
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Resume Score Too Low
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Your resume needs improvement before using job matching
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 text-orange-700 font-medium">
                <Target className="h-3 w-3 mr-1" />
                Score Required: 60+
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-300">
                  Why You Need a Higher Score
                </h4>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-400 leading-relaxed mb-4">
                Our AI job matching works best with well-optimized resumes. A score of 60+ ensures you get 
                <span className="font-bold"> accurate job matches</span> that truly fit your qualifications and experience.
              </p>
              
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4">
                <h5 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Your Current Resume Scores:</h5>
                <div className="space-y-2">
                  {resumeScores.map((score) => (
                    <div key={score.id} className="flex items-center justify-between">
                      <span className="text-sm text-orange-700 dark:text-orange-400">
                        {score.industry} Resume
                      </span>
                      <Badge variant={score.overall_score >= 60 ? 'default' : 'destructive'}>
                        {score.overall_score}/100
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => window.location.href = '/resume-scoring'}
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 text-white font-bold px-8 py-4 text-lg rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <TrendingUp className="h-6 w-6 mr-3" />
                Improve My Resume Score Now
              </Button>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-3">
                Get personalized suggestions to boost your resume and unlock job matching
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
      
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/30 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Select Your Best Resume
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Choose from your high-scoring resumes for accurate job matching
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 font-medium">
              <Target className="h-3 w-3 mr-1" />
              {qualifyingResumes.length} Qualified Resume{qualifyingResumes.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-300">
                High-Quality Resume Selection
              </h4>
            </div>
            <p className="text-sm text-indigo-700 dark:text-indigo-400 leading-relaxed">
              Only resumes with scores above 60 are shown to ensure the best job matching accuracy. 
              Our AI will scan <span className="font-bold">millions of job listings</span> to find 
              opportunities that perfectly match your optimized profile!
            </p>
          </div>

          <Select
            value={selectedResumeId || ''}
            onValueChange={(value) => {
              const selected = qualifyingResumes.find(score => score.id === value);
              if (selected) {
                onResumeSelected(selected);
              }
            }}
          >
            <SelectTrigger className="h-14 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 transition-colors">
              <SelectValue placeholder="🎯 Choose your best resume for perfect matches" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
              {qualifyingResumes.map((score) => (
                <SelectItem key={score.id} value={score.id} className="hover:bg-blue-50 dark:hover:bg-blue-950/30">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">{score.industry} Resume</span>
                    </div>
                    <Badge variant="default" className="ml-2 bg-green-600 text-white">
                      {score.overall_score}/100
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedResumeId && (
            <div className="mt-6">
              {qualifyingResumes
                .filter(score => score.id === selectedResumeId)
                .map((score) => (
                  <div key={score.id} className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl"></div>
                    <div className="relative p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500 rounded-xl">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-lg">
                              ✨ Selected: {score.industry} Resume
                            </h4>
                            <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                              Ready to find your perfect job matches!
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-emerald-600 text-white text-lg px-4 py-2">
                            Score: {score.overall_score}/100
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            {format(new Date(score.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-medium">Skills: {score.skills_breadth}/25</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                          <Target className="h-4 w-4" />
                          <span className="font-medium">Experience: {score.experience_duration}/25</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
