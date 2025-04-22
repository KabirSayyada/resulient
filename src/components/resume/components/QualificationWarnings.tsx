
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Lightbulb, Trophy } from "lucide-react";
import { QualificationGap } from "@/types/resume";

interface QualificationWarningsProps {
  qualificationGaps: QualificationGap[];
}

export const QualificationWarnings: React.FC<QualificationWarningsProps> = ({
  qualificationGaps
}) => {
  if (!qualificationGaps?.length) return null;

  return (
    <Card className="mt-6 border-t-4 border-t-amber-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700">
          <AlertTriangle className="h-5 w-5" />
          Missing Qualifications Review
        </CardTitle>
        <CardDescription>
          We've identified some qualifications from the job description that aren't present in your resume.
          Consider these recommendations carefully before adding them to your resume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
          <AlertDescription className="text-sm">
            <Lightbulb className="inline-block h-4 w-4 mr-2" />
            If you choose to include any of these qualifications, ensure you can confidently discuss and demonstrate them during interviews.
            Consider this an opportunity for professional growth!
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {qualificationGaps.map((gap, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-amber-200">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-amber-900">{gap.skill}</h4>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  gap.importance === 'Critical' ? 'bg-red-100 text-red-700' :
                  gap.importance === 'Important' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {gap.importance}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                <Trophy className="inline-block h-4 w-4 mr-1 text-amber-500" />
                Growth Opportunity: {gap.howToAcquire}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
