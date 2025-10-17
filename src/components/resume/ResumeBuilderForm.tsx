import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Minus, User, Mail, Phone, MapPin, Building, Calendar, GraduationCap, Award, Code, Sparkles, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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
  const [searchParams] = useSearchParams();
  const [enhancedFields, setEnhancedFields] = useState<string[]>([]);
  
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

  // Check if we're in enhancement mode
  useEffect(() => {
    const isEnhanced = searchParams.get('enhanced') === 'true';
    if (isEnhanced && existingData) {
      // Mark recently added fields
      const newFields: string[] = [];
      if (existingData.skills.length > 0) newFields.push('skills');
      if (existingData.achievements.some(a => a.title || a.description)) newFields.push('achievements');
      setEnhancedFields(newFields);
      
      // Show success message
      setTimeout(() => {
        toast({
          title: "✨ Enhancements Applied!",
          description: "Your resume has been enhanced with AI suggestions. Review and customize as needed.",
        });
      }, 500);
    }
  }, [searchParams, existingData]);

  // Update form data when existing data changes
  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    }
  }, [existingData]);

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
    <div className="space-y-8">
      {/* Personal Information */}
      <Card className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 dark:from-blue-950/30 dark:via-background dark:to-indigo-950/30 border-2 border-blue-200/60 dark:border-blue-800/60 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Personal Information
            </span>
            <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              Required
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-base font-semibold text-foreground">
              <User className="h-4 w-4 text-blue-600" />
              Full Name *
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.personalInfo.name}
              onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
              className="h-12 text-base bg-white/80 dark:bg-background/80 border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm transition-all duration-200"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Mail className="h-4 w-4 text-green-600" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                className="h-12 text-base bg-white/80 dark:bg-background/80 border-2 border-green-200 dark:border-green-800 focus:border-green-500 dark:focus:border-green-400 rounded-xl shadow-sm transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Phone className="h-4 w-4 text-purple-600" />
                Phone
              </Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                className="h-12 text-base bg-white/80 dark:bg-background/80 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl shadow-sm transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2 text-base font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-red-600" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="New York, NY"
              value={formData.personalInfo.location}
              onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
              className="h-12 text-base bg-white/80 dark:bg-background/80 border-2 border-red-200 dark:border-red-800 focus:border-red-500 dark:focus:border-red-400 rounded-xl shadow-sm transition-all duration-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card className="bg-gradient-to-br from-emerald-50/80 via-white to-green-50/80 dark:from-emerald-950/30 dark:via-background dark:to-green-950/30 border-2 border-emerald-200/60 dark:border-emerald-800/60 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Work Experience
            </span>
            <Badge variant="outline" className="ml-auto border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
              Optional
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground mt-2 text-base">Add your professional experience to showcase your career journey</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.workExperience.map((exp, index) => (
            <div key={index} className="border-2 border-emerald-200/60 dark:border-emerald-800/60 rounded-2xl p-6 space-y-4 bg-white/60 dark:bg-background/40 shadow-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg text-emerald-800 dark:text-emerald-200">Experience #{index + 1}</h4>
                {formData.workExperience.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWorkExperience(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                  className="h-11 bg-white dark:bg-background border-2 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl"
                />
                <Input
                  placeholder="Job Title"
                  value={exp.position}
                  onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                  className="h-11 bg-white dark:bg-background border-2 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl"
                />
                <Input
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => handleWorkExperienceChange(index, 'location', e.target.value)}
                  className="h-11 bg-white dark:bg-background border-2 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl"
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Start Year"
                    value={exp.startYear}
                    onChange={(e) => handleWorkExperienceChange(index, 'startYear', e.target.value)}
                    className="h-11 bg-white dark:bg-background border-2 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl"
                  />
                  <Input
                    placeholder="End Year"
                    value={exp.endYear}
                    onChange={(e) => handleWorkExperienceChange(index, 'endYear', e.target.value)}
                    className="h-11 bg-white dark:bg-background border-2 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl"
                  />
                </div>
              </div>
              
              <Textarea
                placeholder="Describe your responsibilities and achievements..."
                value={exp.description}
                onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                className="min-h-[100px] bg-white dark:bg-background border-2 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl resize-none"
              />
            </div>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={addWorkExperience} 
            className="w-full h-12 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-950 rounded-xl font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Work Experience
          </Button>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className={`bg-gradient-to-br from-purple-50/80 via-white to-fuchsia-50/80 dark:from-purple-950/30 dark:via-background dark:to-fuchsia-950/30 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 ${
        enhancedFields.includes('skills') 
          ? 'border-indigo-400 dark:border-indigo-600 ring-4 ring-indigo-200/50 dark:ring-indigo-800/50' 
          : 'border-purple-200/60 dark:border-purple-800/60'
      }`}>
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-xl shadow-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              Skills
            </span>
            {enhancedFields.includes('skills') && (
              <Badge className="ml-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white gap-1">
                <Sparkles className="h-3 w-3" />
                AI Enhanced
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-3">
              <Input
                placeholder="e.g., JavaScript, Project Management, Communication"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className="h-12 bg-white dark:bg-background border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl"
              />
              {formData.skills.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 px-3"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={addSkill} 
            className="w-full h-12 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950 rounded-xl font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="bg-gradient-to-br from-orange-50/80 via-white to-amber-50/80 dark:from-orange-950/30 dark:via-background dark:to-amber-950/30 border-2 border-orange-200/60 dark:border-orange-800/60 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Education
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.education.map((edu, index) => (
            <div key={index} className="border-2 border-orange-200/60 dark:border-orange-800/60 rounded-2xl p-6 space-y-4 bg-white/60 dark:bg-background/40 shadow-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg text-orange-800 dark:text-orange-200">Education #{index + 1}</h4>
                {formData.education.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Institution Name"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  className="h-11 bg-white dark:bg-background border-2 border-orange-200 dark:border-orange-800 focus:border-orange-500 dark:focus:border-orange-400 rounded-xl"
                />
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  className="h-11 bg-white dark:bg-background border-2 border-orange-200 dark:border-orange-800 focus:border-orange-500 dark:focus:border-orange-400 rounded-xl"
                />
                <Input
                  placeholder="Field of Study"
                  value={edu.field}
                  onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                  className="h-11 bg-white dark:bg-background border-2 border-orange-200 dark:border-orange-800 focus:border-orange-500 dark:focus:border-orange-400 rounded-xl"
                />
                <Input
                  placeholder="Graduation Year"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                  className="h-11 bg-white dark:bg-background border-2 border-orange-200 dark:border-orange-800 focus:border-orange-500 dark:focus:border-orange-400 rounded-xl"
                />
              </div>
            </div>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={addEducation} 
            className="w-full h-12 border-2 border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950 rounded-xl font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Education
          </Button>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className={`bg-gradient-to-br from-rose-50/80 via-white to-pink-50/80 dark:from-rose-950/30 dark:via-background dark:to-pink-950/30 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 ${
        enhancedFields.includes('achievements') 
          ? 'border-indigo-400 dark:border-indigo-600 ring-4 ring-indigo-200/50 dark:ring-indigo-800/50' 
          : 'border-rose-200/60 dark:border-rose-800/60'
      }`}>
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl shadow-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Achievements & Awards
            </span>
            {enhancedFields.includes('achievements') && (
              <Badge className="ml-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white gap-1">
                <Sparkles className="h-3 w-3" />
                AI Enhanced
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.achievements.map((achievement, index) => (
            <div key={index} className="border-2 border-rose-200/60 dark:border-rose-800/60 rounded-2xl p-6 space-y-4 bg-white/60 dark:bg-background/40 shadow-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg text-rose-800 dark:text-rose-200">Achievement #{index + 1}</h4>
                {formData.achievements.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <Input
                placeholder="Achievement Title"
                value={achievement.title}
                onChange={(e) => handleAchievementChange(index, 'title', e.target.value)}
                className="h-12 bg-white dark:bg-background border-2 border-rose-200 dark:border-rose-800 focus:border-rose-500 dark:focus:border-rose-400 rounded-xl"
              />
              
              <Textarea
                placeholder="Describe your achievement..."
                value={achievement.description}
                onChange={(e) => handleAchievementChange(index, 'description', e.target.value)}
                className="min-h-[80px] bg-white dark:bg-background border-2 border-rose-200 dark:border-rose-800 focus:border-rose-500 dark:focus:border-rose-400 rounded-xl resize-none"
              />
            </div>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={addAchievement} 
            className="w-full h-12 border-2 border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-950 rounded-xl font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Achievement
          </Button>
        </CardContent>
      </Card>

      <div className="pt-8">
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading} 
          className="w-full py-6 text-lg font-bold rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white border-0"
        >
          {isLoading ? (
            <>
              <Sparkles className="h-6 w-6 mr-3 animate-spin" />
              Generating Your Resume...
            </>
          ) : (
            <>
              <Target className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
              Generate Resume from Job Description
              <Sparkles className="h-5 w-5 ml-3 group-hover:animate-pulse transition-transform duration-300" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
