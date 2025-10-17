import { useWizard } from "./WizardContainer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

interface NavigationControlsProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
  isLoading?: boolean;
}

export const NavigationControls = ({
  onNext,
  onBack,
  nextLabel = "Continue",
  nextDisabled = false,
  showBack = true,
  isLoading = false
}: NavigationControlsProps) => {
  const { goToNextStep, goToPreviousStep, currentStep } = useWizard();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      goToNextStep();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goToPreviousStep();
    }
  };

  return (
    <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {showBack && currentStep !== "path" ? (
            <Button
              onClick={handleBack}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            onClick={handleNext}
            disabled={nextDisabled || isLoading}
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {nextLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
