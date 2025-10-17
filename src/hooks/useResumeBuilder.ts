
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/components/resume/ResumeBuilderForm";

export const useResumeBuilder = (userId?: string) => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [enhancements, setEnhancements] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load saved resume data
  useEffect(() => {
    if (userId) {
      loadResumeData();
    }
  }, [userId]);

  const loadResumeData = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Load resume data with enhancement metadata
      const { data, error } = await supabase
        .from('user_resume_data')
        .select('resume_data, enhancements, applied_from_score_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading resume data:', error);
        return;
      }

      if (data) {
        setResumeData(data.resume_data as unknown as ResumeData);
        setEnhancements(data.enhancements);
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveResumeData = async (data: ResumeData) => {
    if (!userId) return;
    
    setSaving(true);
    try {
      // Direct table access to save user resume data
      const { error } = await supabase
        .from('user_resume_data')
        .upsert({
          user_id: userId,
          resume_data: data as unknown as any,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setResumeData(data);
      toast({
        title: "Saved",
        description: "Your resume information has been saved.",
      });
    } catch (error) {
      console.error('Error saving resume data:', error);
      toast({
        title: "Error",
        description: "Failed to save your resume data.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const generateResumeFromData = (data: ResumeData): string => {
    let resume = "";
    
    // Personal Info
    resume += `${data.personalInfo.name}\n`;
    if (data.personalInfo.email || data.personalInfo.phone || data.personalInfo.location) {
      const contact = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location]
        .filter(Boolean)
        .join(' | ');
      resume += `${contact}\n\n`;
    } else {
      resume += "\n";
    }

    // Work Experience
    if (data.workExperience.length > 0) {
      resume += "PROFESSIONAL EXPERIENCE\n";
      resume += "=====================================\n";
      data.workExperience.forEach(exp => {
        resume += `${exp.position} - ${exp.company}\n`;
        if (exp.startYear || exp.endYear || exp.location) {
          const details = [
            exp.startYear && exp.endYear ? `${exp.startYear} - ${exp.endYear}` : (exp.startYear || exp.endYear),
            exp.location
          ].filter(Boolean).join(' | ');
          resume += `${details}\n`;
        }
        if (exp.description) {
          resume += `• ${exp.description}\n`;
        }
        resume += "\n";
      });
    }

    // Skills
    if (data.skills.length > 0) {
      resume += "TECHNICAL SKILLS\n";
      resume += "==============================\n";
      resume += `• ${data.skills.join(', ')}\n\n`;
    }

    // Education
    if (data.education.length > 0) {
      resume += "EDUCATION\n";
      resume += "===================\n";
      data.education.forEach(edu => {
        resume += `${edu.degree}`;
        if (edu.field) resume += ` in ${edu.field}`;
        resume += ` - ${edu.institution}\n`;
        if (edu.year) resume += `${edu.year}\n`;
        resume += "\n";
      });
    }

    // Achievements
    if (data.achievements.length > 0) {
      resume += "ACHIEVEMENTS\n";
      resume += "========================\n";
      data.achievements.forEach(achievement => {
        resume += `• ${achievement.title}\n`;
        if (achievement.description) {
          resume += `  ${achievement.description}\n`;
        }
        resume += "\n";
      });
    }

    return resume.trim();
  };

  return {
    resumeData,
    enhancements,
    loading,
    saving,
    saveResumeData,
    generateResumeFromData,
    loadResumeData
  };
};
