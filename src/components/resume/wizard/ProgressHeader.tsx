import { useWizard, WizardStep } from "./WizardContainer";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

const steps: { key: WizardStep; label: string; number: number }[] = [
  { key: "path", label: "Choose Path", number: 1 },
  { key: "personal", label: "Personal Info", number: 2 },
  { key: "experience", label: "Experience", number: 3 },
  { key: "education", label: "Education", number: 4 },
  { key: "skills", label: "Skills", number: 5 },
  { key: "style", label: "Style", number: 6 },
  { key: "review", label: "Review", number: 7 }
];

export const ProgressHeader = () => {
  const { currentStep, setCurrentStep } = useWizard();
  const currentIndex = steps.findIndex(s => s.key === currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container max-w-6xl mx-auto px-4 py-4">
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Step {currentIndex + 1} of {steps.length}</span>
              <span className="font-medium text-primary">{Math.round(progress)}% Complete</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
              indicatorClassName="bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
            />
          </div>

          {/* Step indicators - desktop */}
          <div className="hidden md:flex items-center justify-between gap-2">
            {steps.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isClickable = index <= currentIndex;

              return (
                <button
                  key={step.key}
                  onClick={() => isClickable && setCurrentStep(step.key)}
                  disabled={!isClickable}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
                    ${isCurrent ? 'bg-primary text-primary-foreground scale-105 shadow-lg' : ''}
                    ${isCompleted ? 'text-success hover:bg-success/10' : ''}
                    ${!isCompleted && !isCurrent ? 'text-muted-foreground' : ''}
                    ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 animate-in zoom-in" />
                  ) : (
                    <Circle className={`h-5 w-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                  )}
                  <span className="text-xs font-medium whitespace-nowrap">{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Current step indicator - mobile */}
          <div className="md:hidden text-center">
            <h3 className="text-lg font-semibold">{steps[currentIndex].label}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
