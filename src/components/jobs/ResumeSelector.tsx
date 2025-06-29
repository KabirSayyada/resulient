
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FileText, TrendingUp, Calendar } from 'lucide-react';
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Select Resume for Job Matching
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            value={selectedResumeId || ''}
            onValueChange={(value) => {
              const selected = resumeScores.find(score => score.id === value);
              if (selected) {
                onResumeSelected(selected);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose your best resume" />
            </SelectTrigger>
            <SelectContent>
              {resumeScores.map((score) => (
                <SelectItem key={score.id} value={score.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{score.industry} Resume</span>
                    <Badge variant={score.overall_score >= 80 ? 'default' : 'secondary'}>
                      {score.overall_score}/100
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedResumeId && (
            <div className="mt-4">
              {resumeScores
                .filter(score => score.id === selectedResumeId)
                .map((score) => (
                  <div key={score.id} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-800 dark:text-green-300">
                        Selected: {score.industry} Resume
                      </h4>
                      <Badge className="bg-green-600 text-white">
                        Score: {score.overall_score}/100
                      </Badge>
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-400 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(score.created_at), 'MMM d, yyyy')}
                      </span>
                      <span>Skills: {score.skills_breadth}/100</span>
                      <span>Experience: {score.experience_duration}/100</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
