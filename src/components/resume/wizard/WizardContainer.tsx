import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ATSResumeData } from "@/types/atsResume";
import { ScoreData } from "@/types/resume";

export type WizardStep = "path" | "personal" | "experience" | "education" | "skills" | "style" | "review";
export type BuildPath = "ai" | "manual" | "enhance";

interface WizardContextType {
  currentStep: WizardStep;
  buildPath: BuildPath | null;
  formData: ATSResumeData;
  selectedTemplate: string;
  selectedColor: string;
  scoreData: ScoreData | null;
  setCurrentStep: (step: WizardStep) => void;
  setBuildPath: (path: BuildPath) => void;
  updateFormData: (data: Partial<ATSResumeData>) => void;
  setSelectedTemplate: (template: string) => void;
  setSelectedColor: (color: string) => void;
  setScoreData: (data: ScoreData | null) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) throw new Error("useWizard must be used within WizardProvider");
  return context;
};

const stepOrder: WizardStep[] = ["path", "personal", "experience", "education", "skills", "style", "review"];

const defaultFormData: ATSResumeData = {
  personalInfo: "",
  workExperience: [],
  education: [],
  skills: "",
  achievements: "",
  additionalSections: ""
};

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("path");
  const [buildPath, setBuildPath] = useState<BuildPath | null>(null);
  const [formData, setFormData] = useState<ATSResumeData>(defaultFormData);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    const saveData = {
      currentStep,
      buildPath,
      formData,
      selectedTemplate,
      selectedColor,
      timestamp: Date.now()
    };
    localStorage.setItem("resumeWizardData", JSON.stringify(saveData));
  }, [currentStep, buildPath, formData, selectedTemplate, selectedColor]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("resumeWizardData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const timeDiff = Date.now() - (parsed.timestamp || 0);
        // Only restore if less than 24 hours old
        if (timeDiff < 24 * 60 * 60 * 1000) {
          setCurrentStep(parsed.currentStep || "path");
          setBuildPath(parsed.buildPath || null);
          setFormData(parsed.formData || defaultFormData);
          setSelectedTemplate(parsed.selectedTemplate || "modern");
          setSelectedColor(parsed.selectedColor || "blue");
        }
      } catch (e) {
        console.error("Failed to load saved wizard data", e);
      }
    }
  }, []);

  const updateFormData = (data: Partial<ATSResumeData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const resetWizard = () => {
    setCurrentStep("path");
    setBuildPath(null);
    setFormData(defaultFormData);
    setSelectedTemplate("modern");
    setSelectedColor("blue");
    setScoreData(null);
    localStorage.removeItem("resumeWizardData");
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        buildPath,
        formData,
        selectedTemplate,
        selectedColor,
        scoreData,
        setCurrentStep,
        setBuildPath,
        updateFormData,
        setSelectedTemplate,
        setSelectedColor,
        setScoreData,
        goToNextStep,
        goToPreviousStep,
        resetWizard
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};
