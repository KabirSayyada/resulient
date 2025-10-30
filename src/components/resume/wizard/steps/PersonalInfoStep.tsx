import { useState, useEffect } from "react";
import { useWizard } from "../WizardContainer";
import { NavigationControls } from "../NavigationControls";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const PersonalInfoStep = () => {
  const { formData, updateFormData, goToNextStep } = useWizard();
  const [localData, setLocalData] = useState(formData.personalInfo || "");
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    setCharacterCount(localData.length);
  }, [localData]);

  const handleNext = () => {
    updateFormData({ personalInfo: localData });
    goToNextStep();
  };

  const isValid = localData.trim().length > 20;

  return (
    <div className="min-h-[calc(100vh-200px)] py-8">
      <div className="container max-w-3xl mx-auto px-4 space-y-6 animate-in fade-in slide-in-from-right duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary/10 rounded-full mb-2">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Personal Information</h2>
          <p className="text-muted-foreground">
            Tell us about yourself. This helps us create a personalized resume.
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>About You</CardTitle>
            <CardDescription>
              Share your contact information and a brief introduction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-info/10 border-info/20">
              <Lightbulb className="h-4 w-4 text-info" />
              <AlertDescription>
                <strong>Pro tip:</strong> Include your name, location, email, phone number, and professional links (LinkedIn, portfolio, etc.)
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Label htmlFor="personal-info" className="text-base font-medium">
                Your Information
              </Label>
              <Textarea
                id="personal-info"
                placeholder="Example: My name is Alex Johnson. I'm based in Seattle, WA. You can reach me at alex.johnson@email.com or (555) 123-4567. View my work at linkedin.com/in/alexjohnson and github.com/alexj"
                value={localData}
                onChange={(e) => setLocalData(e.target.value)}
                rows={6}
                className="resize-none text-base focus-visible:ring-2 focus-visible:ring-primary transition-all"
              />
              <div className="flex justify-between text-sm">
                <span className={`${characterCount < 20 ? 'text-destructive' : 'text-success'}`}>
                  {characterCount < 20 ? `${20 - characterCount} more characters needed` : '✓ Looks good'}
                </span>
                <span className="text-muted-foreground">
                  {characterCount} characters
                </span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Suggested Format:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Full name and professional title</li>
                <li>Current location (city, state)</li>
                <li>Email address and phone number</li>
                <li>Professional links (LinkedIn, portfolio, GitHub)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <NavigationControls
          onNext={handleNext}
          nextLabel="Continue to Experience"
          nextDisabled={!isValid}
        />
      </div>
    </div>
  );
};
