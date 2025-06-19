
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles } from "lucide-react";

interface JobDescriptionInputProps {
  jobDescription: string;
  setJobDescription: (description: string) => void;
}

export const JobDescriptionInput = ({ jobDescription, setJobDescription }: JobDescriptionInputProps) => {
  const wordCount = jobDescription.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <FileText className="h-5 w-5" />
          </div>
          Job Description
          <Sparkles className="h-4 w-4 text-blue-500" />
        </CardTitle>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          Paste the complete job posting here for precise optimization
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Copy and paste the full job description here...

Include:
• Job title and company
• Required skills and qualifications
• Job responsibilities
• Experience requirements
• Any specific keywords mentioned"
            className="min-h-[180px] text-sm bg-white/80 dark:bg-gray-800/80 border-2 border-blue-200 dark:border-blue-700 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all resize-none"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          {wordCount > 0 && (
            <div className="absolute bottom-3 right-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-md">
              {wordCount} words
            </div>
          )}
        </div>
        
        <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-semibold">Pro Tip:</span> Include the entire job posting for best results. Our AI analyzes every detail to perfectly match your resume to what employers want.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
