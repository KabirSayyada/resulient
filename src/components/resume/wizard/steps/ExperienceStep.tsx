import { useState } from "react";
import { useWizard } from "../WizardContainer";
import { NavigationControls } from "../NavigationControls";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus, X, Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const ExperienceStep = () => {
  const { formData, updateFormData, goToNextStep } = useWizard();
  const [experiences, setExperiences] = useState<string[]>(formData.workExperience || []);
  const [currentExp, setCurrentExp] = useState("");

  const handleAdd = () => {
    if (currentExp.trim()) {
      const updated = [...experiences, currentExp.trim()];
      setExperiences(updated);
      setCurrentExp("");
    }
  };

  const handleRemove = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    updateFormData({ workExperience: experiences });
    goToNextStep();
  };

  const isValid = experiences.length > 0;

  return (
    <div className="min-h-[calc(100vh-200px)] py-8">
      <div className="container max-w-3xl mx-auto px-4 space-y-6 animate-in fade-in slide-in-from-right duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary/10 rounded-full mb-2">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Work Experience</h2>
          <p className="text-muted-foreground">
            Add your professional experiences. Include your biggest wins and achievements.
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Add Experience</CardTitle>
            <CardDescription>
              Add one position at a time. Include quantifiable achievements when possible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-info/10 border-info/20">
              <Lightbulb className="h-4 w-4 text-info" />
              <AlertDescription>
                <strong>Pro tip:</strong> Focus on achievements with metrics (e.g., "Increased sales by 40%") rather than just responsibilities
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Label htmlFor="experience" className="text-base font-medium">
                Describe Your Role
              </Label>
              <Textarea
                id="experience"
                placeholder="Example: Senior Software Engineer at Google (Jan 2020 - Present). Led a team of 5 developers to build scalable web applications. Improved app performance by 40% and reduced bug reports by 60%. Mentored 3 junior engineers to promotion."
                value={currentExp}
                onChange={(e) => setCurrentExp(e.target.value)}
                rows={5}
                className="resize-none text-base"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleAdd();
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Press Ctrl+Enter to add quickly
                </span>
                <Button
                  onClick={handleAdd}
                  disabled={!currentExp.trim()}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Experience
                </Button>
              </div>
            </div>

            {experiences.length > 0 && (
              <div className="space-y-3 pt-4">
                <Label className="text-base font-medium">
                  Added Experiences ({experiences.length})
                </Label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {experiences.map((exp, index) => (
                    <div
                      key={index}
                      className="group relative p-4 bg-muted/50 rounded-lg border border-border hover:border-primary transition-all animate-in slide-in-from-left"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Button
                        onClick={() => handleRemove(index)}
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="text-sm pr-8 line-clamp-3">{exp}</p>
                      <Badge variant="secondary" className="mt-2">
                        Experience {index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {experiences.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No experiences added yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <NavigationControls
          onNext={handleNext}
          nextLabel="Continue to Education"
          nextDisabled={!isValid}
        />
      </div>
    </div>
  );
};
