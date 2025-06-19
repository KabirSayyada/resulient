
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, Wand2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ATSResumeFormProps {
  onGenerate: (data: any) => Promise<void>;
  isGenerating: boolean;
  disabled?: boolean;
}

export const ATSResumeForm = ({ onGenerate, isGenerating, disabled = false }: ATSResumeFormProps) => {
  const [formData, setFormData] = useState({
    personalInfo: "",
    skills: "",
    experience: "",
    education: "",
    jobTarget: "",
    certifications: "",
    projects: "",
    achievements: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    await onGenerate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.personalInfo.trim() && formData.experience.trim() && formData.skills.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Describe yourself in natural sentences. Our AI will automatically organize your information into a professional resume format.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="personalInfo" className="text-sm font-medium">
            Personal Information *
          </Label>
          <Textarea
            id="personalInfo"
            placeholder="Tell us about yourself: your name, contact information, professional summary..."
            value={formData.personalInfo}
            onChange={(e) => handleInputChange("personalInfo", e.target.value)}
            className="mt-1 min-h-[100px]"
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="jobTarget" className="text-sm font-medium">
            Target Job/Career Goal
          </Label>
          <Input
            id="jobTarget"
            placeholder="What position or career are you targeting?"
            value={formData.jobTarget}
            onChange={(e) => handleInputChange("jobTarget", e.target.value)}
            className="mt-1"
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="experience" className="text-sm font-medium">
            Work Experience *
          </Label>
          <Textarea
            id="experience"
            placeholder="Describe your work experience, including company names, roles, dates, and key achievements..."
            value={formData.experience}
            onChange={(e) => handleInputChange("experience", e.target.value)}
            className="mt-1 min-h-[120px]"
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="skills" className="text-sm font-medium">
            Skills *
          </Label>
          <Textarea
            id="skills"
            placeholder="List your technical skills, soft skills, programming languages, tools, etc..."
            value={formData.skills}
            onChange={(e) => handleInputChange("skills", e.target.value)}
            className="mt-1 min-h-[100px]"
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="education" className="text-sm font-medium">
            Education
          </Label>
          <Textarea
            id="education"
            placeholder="Describe your educational background: degrees, institutions, graduation dates, relevant coursework..."
            value={formData.education}
            onChange={(e) => handleInputChange("education", e.target.value)}
            className="mt-1 min-h-[80px]"
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="certifications" className="text-sm font-medium">
            Certifications & Licenses
          </Label>
          <Textarea
            id="certifications"
            placeholder="List any professional certifications, licenses, or credentials you hold..."
            value={formData.certifications}
            onChange={(e) => handleInputChange("certifications", e.target.value)}
            className="mt-1 min-h-[80px]"
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="projects" className="text-sm font-medium">
            Projects & Portfolio
          </Label>
          <Textarea
            id="projects"
            placeholder="Describe significant projects, portfolio pieces, or personal work that showcases your abilities..."
            value={formData.projects}
            onChange={(e) => handleInputChange("projects", e.target.value)}
            className="mt-1 min-h-[100px]"
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="achievements" className="text-sm font-medium">
            Achievements & Awards
          </Label>
          <Textarea
            id="achievements"
            placeholder="Mention any awards, recognitions, publications, or notable achievements..."
            value={formData.achievements}
            onChange={(e) => handleInputChange("achievements", e.target.value)}
            className="mt-1 min-h-[80px]"
            disabled={disabled}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200"
        disabled={!isFormValid || isGenerating || disabled}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating Your Resume...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-5 w-5" />
            Generate Professional Resume
          </>
        )}
      </Button>

      {!isFormValid && (
        <p className="text-sm text-orange-600 dark:text-orange-400 text-center">
          Please fill in the required fields marked with *
        </p>
      )}
    </form>
  );
};
