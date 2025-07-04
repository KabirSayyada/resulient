import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, GraduationCap, Award, Code, Plus, Sparkles } from "lucide-react";
import { ATSResumeData } from "@/types/atsResume";

interface ATSResumeFormProps {
  onGenerate: (data: ATSResumeData) => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export const ATSResumeForm = ({ onGenerate, isGenerating, disabled = false }: ATSResumeFormProps) => {
  const [formData, setFormData] = useState<ATSResumeData>({
    personalInfo: "",
    workExperience: [],
    education: [],
    skills: "",
    achievements: "",
    additionalSections: ""
  });

  const [currentWorkExp, setCurrentWorkExp] = useState("");
  const [currentEducation, setCurrentEducation] = useState("");

  const addWorkExperience = () => {
    if (currentWorkExp.trim()) {
      setFormData(prev => ({
        ...prev,
        workExperience: [...prev.workExperience, currentWorkExp.trim()]
      }));
      setCurrentWorkExp("");
    }
  };

  const addEducation = () => {
    if (currentEducation.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, currentEducation.trim()]
      }));
      setCurrentEducation("");
    }
  };

  const removeWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleGenerate = () => {
    if (disabled) return;
    onGenerate(formData);
  };

  const isFormValid = formData.personalInfo && (formData.workExperience.length > 0 || formData.education.length > 0);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal" className="text-xs">Personal</TabsTrigger>
          <TabsTrigger value="work" className="text-xs">Work</TabsTrigger>
          <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
          <TabsTrigger value="other" className="text-xs">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="personal-info">Tell us about yourself</Label>
                <div className="text-sm text-muted-foreground mb-2 p-3 bg-info/10 border border-info/20 rounded-lg">
                  <strong>Template:</strong> "My name is [Your Name]. I live in [Your City, State]. 
                  You can reach me at [your.email@example.com] or [your phone number]. 
                  My LinkedIn profile is [linkedin.com/in/yourprofile] and my portfolio is [yourwebsite.com]."
                </div>
                <Textarea
                  id="personal-info"
                  placeholder="Example: My name is John Smith. I live in San Francisco, CA. You can reach me at john.smith@email.com or (555) 123-4567. My LinkedIn profile is linkedin.com/in/johnsmith."
                  value={formData.personalInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, personalInfo: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="work-exp">Add work experience (one at a time)</Label>
                <div className="text-sm text-muted-foreground mb-2 p-3 bg-info/10 border border-info/20 rounded-lg">
                  <strong>Template:</strong> "I worked as [Job Title] at [Company Name] from [Start Date] to [End Date]. 
                  I was responsible for [key responsibilities]. I achieved [specific accomplishments with numbers if possible]."
                </div>
                <Textarea
                  id="work-exp"
                  placeholder="Example: I worked as Senior Software Engineer at Google from January 2020 to Present. I was responsible for developing scalable web applications and leading a team of 5 developers. I achieved a 40% improvement in application performance and reduced bug reports by 60%."
                  value={currentWorkExp}
                  onChange={(e) => setCurrentWorkExp(e.target.value)}
                  rows={4}
                />
                <Button onClick={addWorkExperience} className="mt-2" disabled={!currentWorkExp.trim()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Experience
                </Button>
              </div>
              
              {formData.workExperience.length > 0 && (
                <div className="space-y-2">
                  <Label>Added Experiences:</Label>
                  {formData.workExperience.map((exp, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                       className="p-2 text-left block cursor-pointer hover:bg-destructive/20"
                      onClick={() => removeWorkExperience(index)}
                    >
                      {exp.substring(0, 100)}...
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="education">Add education (one at a time)</Label>
                <div className="text-sm text-muted-foreground mb-2 p-3 bg-info/10 border border-info/20 rounded-lg">
                  <strong>Template:</strong> "I studied [Degree] in [Field of Study] at [University Name] from [Start Year] to [End Year]. 
                  My GPA was [GPA] and I was involved in [relevant activities or honors]."
                </div>
                <Textarea
                  id="education"
                  placeholder="Example: I studied Bachelor of Science in Computer Science at Stanford University from 2016 to 2020. My GPA was 3.8 and I was involved in the Computer Science Club and received Dean's List honors for 3 semesters."
                  value={currentEducation}
                  onChange={(e) => setCurrentEducation(e.target.value)}
                  rows={4}
                />
                <Button onClick={addEducation} className="mt-2" disabled={!currentEducation.trim()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Education
                </Button>
              </div>
              
              {formData.education.length > 0 && (
                <div className="space-y-2">
                  <Label>Added Education:</Label>
                  {formData.education.map((edu, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="p-2 text-left block cursor-pointer hover:bg-destructive/20"
                      onClick={() => removeEducation(index)}
                    >
                      {edu.substring(0, 100)}...
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code className="h-5 w-5" />
                Skills & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="skills">Technical and soft skills</Label>
                <div className="text-sm text-muted-foreground mb-2 p-3 bg-info/10 border border-info/20 rounded-lg">
                  <strong>Template:</strong> "My technical skills include [list technologies, programming languages, tools]. 
                  My soft skills include [communication, leadership, etc.]. I am proficient in [specific tools or certifications]."
                </div>
                <Textarea
                  id="skills"
                  placeholder="Example: My technical skills include JavaScript, Python, React, Node.js, AWS, and Docker. My soft skills include team leadership, project management, and cross-functional collaboration. I am proficient in Agile methodologies and have AWS Solutions Architect certification."
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="achievements">Notable achievements and awards</Label>
                <div className="text-sm text-muted-foreground mb-2 p-3 bg-info/10 border border-info/20 rounded-lg">
                  <strong>Template:</strong> "Some of my key achievements include [specific accomplishments with metrics]. 
                  I have received [awards, recognitions, or certifications]. I have also [published work, speaking engagements, etc.]."
                </div>
                <Textarea
                  id="achievements"
                  placeholder="Example: Some of my key achievements include increasing team productivity by 50% and reducing system downtime by 30%. I received the Employee of the Year award in 2022 and have AWS Solutions Architect certification. I have also published 3 technical articles and spoken at 2 industry conferences."
                  value={formData.achievements}
                  onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="additional">Projects, certifications, languages, volunteer work</Label>
                <div className="text-sm text-muted-foreground mb-2 p-3 bg-info/10 border border-info/20 rounded-lg">
                  <strong>Template:</strong> "I have worked on projects including [project descriptions]. 
                  I hold certifications in [certifications]. I speak [languages]. 
                  I have volunteered for [organizations or causes]."
                </div>
                <Textarea
                  id="additional"
                  placeholder="Example: I have worked on projects including a mobile app with 10,000+ downloads and an open-source library used by 50+ companies. I hold certifications in AWS and Google Cloud. I speak English and Spanish fluently. I have volunteered for local coding bootcamps teaching web development to underrepresented communities."
                  value={formData.additionalSections}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalSections: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button 
        onClick={handleGenerate} 
        disabled={!isFormValid || isGenerating || disabled}
        className="w-full bg-success hover:bg-success/90 text-success-foreground py-3"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Sparkles className="h-5 w-5 mr-2 animate-spin" />
            Generating Your Resume...
          </>
        ) : disabled ? (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Upgrade to Build More Resumes
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Generate ATS-Optimized Resume
          </>
        )}
      </Button>
    </div>
  );
};
