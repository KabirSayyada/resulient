import { useWizard } from "../WizardContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, FileText, Zap, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const paths = [
  {
    id: "ai" as const,
    icon: Sparkles,
    title: "Quick AI Build",
    description: "Describe yourself and let AI create a professional resume in minutes",
    time: "2-3 minutes",
    features: ["AI-powered content", "Industry-optimized", "ATS-friendly"],
    gradient: "from-primary/20 to-info/20",
    recommended: true
  },
  {
    id: "manual" as const,
    icon: FileText,
    title: "Build from Scratch",
    description: "Guided step-by-step process to create your resume manually",
    time: "5-10 minutes",
    features: ["Full control", "Step-by-step guidance", "Real-time preview"],
    gradient: "from-success/20 to-primary/20"
  },
  {
    id: "enhance" as const,
    icon: Zap,
    title: "Smart Enhance",
    description: "Upload your existing resume and let AI improve it",
    time: "3-5 minutes",
    features: ["Upload existing resume", "AI enhancements", "Keep your style"],
    gradient: "from-warning/20 to-success/20",
    comingSoon: true
  }
];

export const PathSelectionStep = () => {
  const { setBuildPath, goToNextStep } = useWizard();

  const handlePathSelect = (pathId: typeof paths[0]["id"]) => {
    if (pathId === "enhance") return; // Coming soon
    setBuildPath(pathId);
    goToNextStep();
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Choose Your Path
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select how you'd like to build your professional resume. Each path is designed to create an ATS-optimized result.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {paths.map((path, index) => {
            const Icon = path.icon;
            return (
              <Card
                key={path.id}
                className={`
                  relative overflow-hidden cursor-pointer transition-all duration-300
                  hover:scale-105 hover:shadow-xl
                  ${path.comingSoon ? 'opacity-60 cursor-not-allowed' : ''}
                  animate-in slide-in-from-bottom
                `}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => !path.comingSoon && handlePathSelect(path.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${path.gradient} opacity-50`} />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-background rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    {path.recommended && (
                      <Badge className="bg-success text-success-foreground">
                        Recommended
                      </Badge>
                    )}
                    {path.comingSoon && (
                      <Badge variant="secondary">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl mt-4">{path.title}</CardTitle>
                  <CardDescription className="text-base">
                    {path.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Estimated time: {path.time}</span>
                  </div>

                  <ul className="space-y-2">
                    {path.features.map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-success" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {!path.comingSoon && (
                    <div className="pt-4">
                      <div className="text-primary font-medium flex items-center gap-2">
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground">
            All paths create professional, ATS-optimized resumes. Choose the one that fits your workflow best.
          </p>
        </div>
      </div>
    </div>
  );
};
