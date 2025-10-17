import { useState } from "react";
import { useWizard } from "../WizardContainer";
import { NavigationControls } from "../NavigationControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Edit, Sparkles, Download } from "lucide-react";
import { useATSResumeBuilder } from "@/hooks/useATSResumeBuilder";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ATSResumeModal } from "@/components/resume/ATSResumeModal";

export const ReviewStep = () => {
  const { formData, selectedTemplate, selectedColor, setCurrentStep } = useWizard();
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    generateResume, 
    downloadResume,
    downloadResumePDF, 
    downloadTextBasedPDF,
    downloadFreshTemplatePDF,
    resumeData, 
    isGenerating 
  } = useATSResumeBuilder(user?.id);
  const [showModal, setShowModal] = useState(false);

  const sections = [
    {
      title: "Personal Information",
      content: formData.personalInfo,
      step: "personal" as const,
      icon: CheckCircle2
    },
    {
      title: "Work Experience",
      content: `${formData.workExperience.length} position${formData.workExperience.length !== 1 ? 's' : ''} added`,
      step: "experience" as const,
      icon: CheckCircle2
    },
    {
      title: "Education",
      content: formData.education.length > 0 
        ? `${formData.education.length} degree${formData.education.length !== 1 ? 's' : ''} added`
        : "Skipped",
      step: "education" as const,
      icon: CheckCircle2
    },
    {
      title: "Skills",
      content: formData.skills ? "Added" : "Not added",
      step: "skills" as const,
      icon: CheckCircle2
    }
  ];

  const handleGenerate = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate your resume.",
        variant: "destructive"
      });
      return;
    }

    await generateResume(formData);
    setShowModal(true);
  };

  const handleDownload = async () => {
    await downloadResumePDF();
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-8">
      <div className="container max-w-3xl mx-auto px-4 space-y-6 animate-in fade-in slide-in-from-right duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-success/10 rounded-full mb-2">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-3xl font-bold">Review Your Resume</h2>
          <p className="text-muted-foreground">
            Double-check everything looks good before generating your professional resume
          </p>
        </div>

        <div className="space-y-4">
          {/* Sections Review */}
          {sections.map((section, index) => (
            <Card
              key={section.title}
              className="animate-in slide-in-from-left"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <section.icon className="h-5 w-5 text-success" />
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(section.step)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* Style Selection */}
          <Card className="animate-in slide-in-from-left" style={{ animationDelay: "200ms" }}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <CardTitle className="text-lg">Style & Format</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep("style")}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Badge variant="secondary">{selectedTemplate}</Badge>
              <Badge variant="secondary">{selectedColor} color</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Generate Button */}
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Ready to Generate?</h3>
              <p className="text-sm text-muted-foreground">
                Your resume will be optimized for ATS systems and formatted professionally
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 gap-2"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Resume
                  </>
                )}
              </Button>
              
              {resumeData && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download PDF
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <NavigationControls
          nextLabel="Generate Resume"
          onNext={handleGenerate}
          nextDisabled={isGenerating}
          isLoading={isGenerating}
        />
      </div>

      <ATSResumeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        resumeData={resumeData}
        onDownloadTXT={downloadResume}
        onDownloadPDF={downloadResumePDF}
        onDownloadTextBasedPDF={downloadTextBasedPDF}
        onDownloadFreshTemplate={downloadFreshTemplatePDF}
      />
    </div>
  );
};
