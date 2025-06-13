
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Minus, User, Mail, Phone, MapPin, Building, Calendar, GraduationCap, Award, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkExperience {
  company: string;
  position: string;
  location: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

interface Achievement {
  title: string;
  description: string;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  workExperience: WorkExperience[];
  skills: string[];
  achievements: Achievement[];
  education: Education[];
}

interface ResumeBuilderFormProps {
  onSubmit: (data: ResumeData) => void;
  isLoading?: boolean;
  existingData?: ResumeData | null;
}

export const ResumeBuilderForm = ({ onSubmit, isLoading = false, existingData }: ResumeBuilderFormProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ResumeData>(existingData || {
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: ""
    },
    workExperience: [{ company: "", position: "", location: "", startYear: "", endYear: "", description: "" }],
    skills: [""],
    achievements: [{ title: "", description: "" }],
    education: [{ institution: "", degree: "", field: "", year: "" }]
  });

  const handlePersonalInfoChange = (field: keyof ResumeData['personalInfo'], value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handleWorkExperienceChange = (index: number, field: keyof WorkExperience, value: string) => {
    const newExperience = [...formData.workExperience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setFormData(prev => ({ ...prev, workExperience: newExperience }));
  };

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { company: "", position: "", location: "", startYear: "", endYear: "", description: "" }]
    }));
  };

  const removeWorkExperience = (index: number) => {
    if (formData.workExperience.length > 1) {
      setFormData(prev => ({
        ...prev,
        workExperience: prev.workExperience.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setFormData(prev => ({ ...prev, skills: [...prev.skills, ""] }));
  };

  const removeSkill = (index: number) => {
    if (formData.skills.length > 1) {
      setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
    }
  };

  const handleAchievementChange = (index: number, field: keyof Achievement, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = { ...newAchievements[index], [field]: value };
    setFormData(prev => ({ ...prev, achievements: newAchievements }));
  };

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, { title: "", description: "" }]
    }));
  };

  const removeAchievement = (index: number) => {
    if (formData.achievements.length > 1) {
      setFormData(prev => ({
        ...prev,
        achievements: prev.achievements.filter((_, i) => i !== index)
      }));
    }
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData(prev => ({ ...prev, education: newEducation }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institution: "", degree: "", field: "", year: "" }]
    }));
  };

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.personalInfo.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to continue.",
        variant: "destructive"
      });
      return;
    }

    // Clean up empty entries
    const cleanedData: ResumeData = {
      ...formData,
      workExperience: formData.workExperience.filter(exp => exp.company.trim() && exp.position.trim()),
      skills: formData.skills.filter(skill => skill.trim()),
      achievements: formData.achievements.filter(ach => ach.title.trim()),
      education: formData.education.filter(edu => edu.institution.trim() && edu.degree.trim())
    };

    onSubmit(cleanedData);
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.personalInfo.name}
              onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="New York, NY"
              value={formData.personalInfo.location}
              onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Work Experience
          </CardTitle>
          <p className="text-sm text-gray-600">Add your work experience (skip if no experience)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.workExperience.map((exp, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Experience #{index + 1}</h4>
                {formData.workExperience.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWorkExperience(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                />
                <Input
                  placeholder="Job Title"
                  value={exp.position}
                  onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                />
                <Input
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => handleWorkExperienceChange(index, 'location', e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Start Year"
                    value={exp.startYear}
                    onChange={(e) => handleWorkExperienceChange(index, 'startYear', e.target.value)}
                  />
                  <Input
                    placeholder="End Year"
                    value={exp.endYear}
                    onChange={(e) => handleWorkExperienceChange(index, 'endYear', e.target.value)}
                  />
                </div>
              </div>
              
              <Textarea
                placeholder="Describe your responsibilities and achievements..."
                value={exp.description}
                onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addWorkExperience} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Work Experience
          </Button>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="e.g., JavaScript, Project Management, etc."
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
              />
              {formData.skills.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addSkill} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.education.map((edu, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Education #{index + 1}</h4>
                {formData.education.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Institution Name"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                />
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                />
                <Input
                  placeholder="Field of Study"
                  value={edu.field}
                  onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                />
                <Input
                  placeholder="Graduation Year"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                />
              </div>
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addEducation} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements & Awards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.achievements.map((achievement, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Achievement #{index + 1}</h4>
                {formData.achievements.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <Input
                placeholder="Achievement Title"
                value={achievement.title}
                onChange={(e) => handleAchievementChange(index, 'title', e.target.value)}
              />
              
              <Textarea
                placeholder="Describe your achievement..."
                value={achievement.description}
                onChange={(e) => handleAchievementChange(index, 'description', e.target.value)}
                className="min-h-[60px]"
              />
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addAchievement} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Button>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSubmit} 
        disabled={isLoading} 
        className="w-full py-3 text-lg font-semibold"
      >
        {isLoading ? "Generating Resume..." : "Generate Resume from Job Description"}
      </Button>
    </div>
  );
};
