
import React from 'react';
import { QualificationGap } from '@/types/resume';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Lightbulb, Star, Target, TrendingUp, Award, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QualificationGapsProps {
  qualifications: QualificationGap[];
}

export const QualificationGaps: React.FC<QualificationGapsProps> = ({ qualifications }) => {
  if (!qualifications || qualifications.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 mb-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-indigo-200/20 dark:from-blue-800/10 dark:to-indigo-800/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Enhanced Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Growth Opportunities
            </h2>
            <p className="text-purple-600 dark:text-purple-400 font-medium mt-1">
              Skills that could boost your career prospects
            </p>
          </div>
        </div>
        
        {/* Enhanced Info Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-2 border-purple-200/60 dark:border-purple-800/60 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl">
                <Lightbulb className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  These are skills or qualifications that could significantly improve your chances. You may consider adding 
                  these if you already have them, or look into acquiring them for future opportunities.
                </p>
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <Award className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <p className="text-amber-700 dark:text-amber-300 font-medium text-sm">
                    <strong>Important:</strong> Only include skills you genuinely possess. Be prepared to demonstrate these skills if asked during an interview.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Enhanced Qualifications Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {qualifications.map((qualification, index) => (
          <Card 
            key={index} 
            className="group relative overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200/40 dark:border-purple-800/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Card Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-pink-100/20 dark:from-purple-900/10 dark:to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardContent className="pt-6 pb-6 relative z-10">
              <div className="flex flex-col gap-4">
                {/* Enhanced Skill Header */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      {qualification.skill}
                    </h3>
                    <Badge className="mt-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-md text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Growth Opportunity
                    </Badge>
                  </div>
                </div>
                
                {/* Enhanced Content Sections */}
                <div className="space-y-4 ml-2">
                  <div className="relative">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-lg shadow-sm">
                        <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                          Why it matters:
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                          {qualification.importance}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-lg shadow-sm">
                        <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                          How to acquire:
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-3 rounded-lg border border-green-100 dark:border-green-800">
                          {qualification.howToAcquire}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border-2 border-purple-300/50 dark:border-purple-700/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </Card>
        ))}
      </div>
    </div>
  );
};
