
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FileText, TrendingUp, Calendar, Target, Zap } from 'lucide-react';
import { format } from 'date-fns';
import type { ResumeScoreRecord } from '@/types/resume';

interface ResumeSelectorProps {
  onResumeSelected: (resumeScore: ResumeScoreRecord) => void;
  selectedResumeId?: string;
}

export function ResumeSelector({ onResumeSelected, selectedResumeId }: ResumeSelectorProps) {
  const [resumeScores, setResumeScores] = useState<ResumeScoreRecord[]>([]);
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
      
      // Auto-select the highest scoring resume if none selected
      if (data && data.length > 0 && !selectedResumeId) {
        const highestScoring = data.reduce((prev, current) => 
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
                  Choose your highest-scoring resume for the most accurate job matching
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 font-medium">
              <Target className="h-3 w-3 mr-1" />
              AI Powered
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
                Why Resume Selection Matters
              </h4>
            </div>
            <p className="text-sm text-indigo-700 dark:text-indigo-400 leading-relaxed">
              Our AI analyzes your resume's skills, experience, and industry focus to scan through 
              <span className="font-bold"> millions of job listings</span> and find opportunities 
              that match your exact profile. A higher-scoring resume leads to better job matches!
            </p>
          </div>

          <Select
            value={selectedResumeId || ''}
            onValueChange={(value) => {
              const selected = resumeScores.find(score => score.id === value);
              if (selected) {
                onResumeSelected(selected);
              }
            }}
          >
            <SelectTrigger className="h-14 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 transition-colors">
              <SelectValue placeholder="🎯 Choose your best resume for perfect matches" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
              {resumeScores.map((score) => (
                <SelectItem key={score.id} value={score.id} className="hover:bg-blue-50 dark:hover:bg-blue-950/30">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${score.overall_score >= 80 ? 'bg-green-500' : score.overall_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">{score.industry} Resume</span>
                    </div>
                    <Badge variant={score.overall_score >= 80 ? 'default' : 'secondary'} className="ml-2">
                      {score.overall_score}/100
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedResumeId && (
            <div className="mt-6">
              {resumeScores
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
