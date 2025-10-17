import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface IndividualSkillButtonProps {
  skill: string;
}

export const IndividualSkillButton = ({ skill }: IndividualSkillButtonProps) => {
  const navigate = useNavigate();
  const { resumeData, saveResumeData } = useResumeBuilder();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddSkill = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsAdding(true);

    try {
      const currentResume = resumeData || {
        personalInfo: { name: "", email: "", phone: "", location: "" },
        workExperience: [{ company: "", position: "", location: "", startYear: "", endYear: "", description: "" }],
        skills: [""],
        achievements: [{ title: "", description: "" }],
        education: [{ institution: "", degree: "", field: "", year: "" }]
      };

      const existingSkills = currentResume.skills.map(s => s.toLowerCase().trim());
      
      if (existingSkills.includes(skill.toLowerCase().trim())) {
        toast({
          title: "Already Added",
          description: "This skill is already in your resume.",
        });
        setIsAdding(false);
        return;
      }

      const updatedResume = {
        ...currentResume,
        skills: [...currentResume.skills.filter(s => s.trim()), skill]
      };

      await saveResumeData(updatedResume);
      
      setIsAdded(true);
      toast({
        title: "✨ Skill Added!",
        description: `"${skill}" has been added to your resume.`,
      });

      setTimeout(() => {
        navigate("/ats-resume-builder?enhanced=true");
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleAddSkill}
      disabled={isAdding || isAdded}
      className="h-7 px-2 text-xs gap-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
    >
      {isAdded ? (
        <>
          <Check className="h-3 w-3" />
          Added
        </>
      ) : (
        <>
          <Plus className="h-3 w-3" />
          Add
        </>
      )}
    </Button>
  );
};
