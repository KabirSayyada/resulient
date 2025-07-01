
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useResumeOptimizationHistory } from "@/hooks/useResumeOptimizationHistory";
import { OptimizedResumeContent } from "./components/OptimizedResumeContent";
import { TemplateSelector } from "./components/TemplateSelector";
import { generateTextFormattedPDF } from "@/utils/textFormattedPdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { 
  History, 
  Calendar, 
  BarChart, 
  Download, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Sparkles 
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ResumeTemplateType } from "@/utils/resumeTemplates/templateSelector";

export const OptimizationHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { optimizationHistory, fetchOptimizationHistory, regenerateOptimizationWithTemplate } = useResumeOptimizationHistory(user?.id);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user?.id) {
      fetchOptimizationHistory();
    }
  }, [user?.id]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleDownloadPDF = async (resumeContent: string, templateUsed: string, createdAt: string) => {
    toast({
      title: "Generating PDF...",
      description: "Creating your PDF resume, please wait.",
    });

    const fileName = `optimized-resume-${templateUsed}-${new Date(createdAt).toISOString().split('T')[0]}.pdf`;
    const success = await generateTextFormattedPDF(resumeContent, fileName);

    if (success) {
      toast({
        title: "PDF Downloaded!",
        description: "Your optimized resume has been downloaded as PDF.",
      });
    } else {
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadText = (resumeContent: string, templateUsed: string, createdAt: string) => {
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized-resume-${templateUsed}-${new Date(createdAt).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Downloaded!",
      description: "Your optimized resume has been downloaded as text file.",
    });
  };

  const handleTemplateChange = async (optimizationId: string, templateType: ResumeTemplateType) => {
    await regenerateOptimizationWithTemplate(optimizationId, templateType);
  };

  if (!user) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <History className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">Sign In Required</h3>
          <p className="text-gray-400 max-w-md">
            Please sign in to view your optimization history.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (optimizationHistory.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <History className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No Optimization History</h3>
          <p className="text-gray-400 max-w-md">
            Your resume optimizations will appear here once you start optimizing resumes for job descriptions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <History className="h-5 w-5" />
            Optimization History ({optimizationHistory.length})
          </CardTitle>
        </CardHeader>
      </Card>

      {optimizationHistory.map((optimization) => {
        const isExpanded = expandedItems.has(optimization.id);
        const templateUsed = optimization.template_used || 'standard';
        
        return (
          <Card key={optimization.id} className="bg-white/80 backdrop-blur-sm shadow-lg">
            <Collapsible>
              <CollapsibleTrigger 
                onClick={() => toggleExpanded(optimization.id)}
                className="w-full"
              >
                <CardHeader className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(optimization.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {templateUsed} template
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <BarChart className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-600">
                          {optimization.overall_score}% Match
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-6">
                  {/* Template Selector */}
                  {optimization.parsed_resume_data && (
                    <TemplateSelector
                      selectedTemplate={templateUsed as ResumeTemplateType}
                      onTemplateChange={(template) => handleTemplateChange(optimization.id, template)}
                    />
                  )}

                  {/* Download Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => handleDownloadText(optimization.optimized_resume, templateUsed, optimization.created_at)}
                      size="sm"
                      variant="outline"
                      className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download TXT
                    </Button>
                    <Button
                      onClick={() => handleDownloadPDF(optimization.optimized_resume, templateUsed, optimization.created_at)}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-indigo-600">{optimization.overall_score}%</div>
                      <div className="text-xs text-gray-600">Overall</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{optimization.keyword_score}%</div>
                      <div className="text-xs text-gray-600">Keywords</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{optimization.structure_score}%</div>
                      <div className="text-xs text-gray-600">Structure</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{optimization.ats_score}%</div>
                      <div className="text-xs text-gray-600">ATS</div>
                    </div>
                  </div>

                  {/* Optimized Resume Content */}
                  <OptimizedResumeContent content={optimization.optimized_resume} />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
};
