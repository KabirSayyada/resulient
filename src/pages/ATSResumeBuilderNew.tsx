import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { WizardProvider, useWizard } from "@/components/resume/wizard/WizardContainer";
import { ProgressHeader } from "@/components/resume/wizard/ProgressHeader";
import { PathSelectionStep } from "@/components/resume/wizard/steps/PathSelectionStep";
import { PersonalInfoStep } from "@/components/resume/wizard/steps/PersonalInfoStep";
import { ExperienceStep } from "@/components/resume/wizard/steps/ExperienceStep";
import { EducationStep } from "@/components/resume/wizard/steps/EducationStep";
import { SkillsStep } from "@/components/resume/wizard/steps/SkillsStep";
import { StyleSelectionStep } from "@/components/resume/wizard/steps/StyleSelectionStep";
import { ReviewStep } from "@/components/resume/wizard/steps/ReviewStep";
import { LivePreviewPanel } from "@/components/resume/wizard/LivePreviewPanel";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { Loader2 } from "lucide-react";

const WizardContent = () => {
  const { currentStep } = useWizard();

  const renderStep = () => {
    switch (currentStep) {
      case "path":
        return <PathSelectionStep />;
      case "personal":
        return <PersonalInfoStep />;
      case "experience":
        return <ExperienceStep />;
      case "education":
        return <EducationStep />;
      case "skills":
        return <SkillsStep />;
      case "style":
        return <StyleSelectionStep />;
      case "review":
        return <ReviewStep />;
      default:
        return <PathSelectionStep />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNavigation />
      
      <ProgressHeader />

      <div className="flex-1">
        <div className="container max-w-7xl mx-auto p-4">
          <div className="grid lg:grid-cols-[1fr,400px] gap-6">
            <div className="min-h-[600px]">
              {renderStep()}
            </div>
            <LivePreviewPanel />
          </div>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default function ATSResumeBuilderNew() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?redirect=/ats-resume-builder");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}
