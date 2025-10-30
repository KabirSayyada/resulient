import { useState } from "react";
import { useWizard } from "../WizardContainer";
import { NavigationControls } from "../NavigationControls";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, X, Lightbulb, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const EducationStep = () => {
  const { formData, updateFormData, goToNextStep } = useWizard();
  const [education, setEducation] = useState<string[]>(formData.education || []);
  const [currentEdu, setCurrentEdu] = useState("");

  const handleAdd = () => {
    if (currentEdu.trim()) {
      const updated = [...education, currentEdu.trim()];
      setEducation(updated);
      setCurrentEdu("");
    }
  };

  const handleRemove = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    updateFormData({ education });
    goToNextStep();
  };

  const handleSkip = () => {
    updateFormData({ education: [] });
    goToNextStep();
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-8">
      <div className="container max-w-3xl mx-auto px-4 space-y-6 animate-in fade-in slide-in-from-right duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary/10 rounded-full mb-2">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Education</h2>
          <p className="text-muted-foreground">
            Add your educational background. Include degrees, certifications, and relevant coursework.
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Add Education</CardTitle>
            <CardDescription>
              Add one degree or certification at a time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-info/10 border-info/20">
              <Lightbulb className="h-4 w-4 text-info" />
              <AlertDescription>
                <strong>Pro tip:</strong> Include GPA if above 3.5, relevant coursework, honors, and extracurricular activities
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Label htmlFor="education" className="text-base font-medium">
                Describe Your Education
              </Label>
              <Textarea
                id="education"
                placeholder="Example: Bachelor of Science in Computer Science at Stanford University (2016-2020). GPA: 3.8/4.0. Dean's List for 3 semesters. Active member of Computer Science Club. Relevant coursework: Data Structures, Algorithms, Machine Learning."
                value={currentEdu}
                onChange={(e) => setCurrentEdu(e.target.value)}
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
                  disabled={!currentEdu.trim()}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Education
                </Button>
              </div>
            </div>

            {education.length > 0 && (
              <div className="space-y-3 pt-4">
                <Label className="text-base font-medium">
                  Added Education ({education.length})
                </Label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {education.map((edu, index) => (
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
                      <p className="text-sm pr-8 line-clamp-3">{edu}</p>
                      <Badge variant="secondary" className="mt-2">
                        Education {index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education.length === 0 && (
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No education added yet</p>
                </div>
                
                <Alert className="bg-warning/10 border-warning/20">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <AlertDescription>
                    You can skip this step if you prefer to focus on experience, but education is recommended for most resumes.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          {education.length === 0 && (
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="text-muted-foreground"
            >
              Skip Education
            </Button>
          )}
        </div>

        <NavigationControls
          onNext={handleNext}
          nextLabel="Continue to Skills"
        />
      </div>
    </div>
  );
};
