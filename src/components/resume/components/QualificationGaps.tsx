
import React from 'react';
import { QualificationGap } from '@/types/resume';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Lightbulb, Star } from 'lucide-react';

interface QualificationGapsProps {
  qualifications: QualificationGap[];
}

export const QualificationGaps: React.FC<QualificationGapsProps> = ({ qualifications }) => {
  if (!qualifications || qualifications.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 mb-6">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">Qualification Gaps & Growth Opportunities</h2>
      <div className="text-gray-600 mb-4">
        <p>
          These are skills or qualifications that could significantly improve your chances. You may consider adding 
          these if you already have them, or look into acquiring them for future opportunities.
        </p>
        <p className="mt-2 text-indigo-600 font-medium">
          Remember: Only include skills you genuinely possess. If asked during an interview, be prepared to demonstrate these skills.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {qualifications.map((qualification, index) => (
          <Card key={index} className="border-indigo-200 bg-gradient-to-br from-white to-indigo-50">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <div className="font-bold text-indigo-800 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>{qualification.skill}</span>
                </div>
                
                <div className="ml-7 space-y-3 mt-1">
                  <div>
                    <span className="font-semibold text-gray-700 flex items-center gap-1">
                      <Lightbulb className="h-4 w-4 text-indigo-500" />
                      Why it matters:
                    </span>
                    <p className="text-gray-600 mt-1 ml-5">{qualification.importance}</p>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-700 flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-green-500" />
                      How to acquire:
                    </span>
                    <p className="text-gray-600 mt-1 ml-5">{qualification.howToAcquire}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
