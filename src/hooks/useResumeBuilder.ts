
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/components/resume/ResumeBuilderForm";

export const useResumeBuilder = (userId?: string) => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
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
    setLoading(true);
    try {
      // Use raw SQL query since the table isn't in types yet
      const { data, error } = await supabase
        .rpc('get_user_resume_data', { user_uuid: userId });

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      if (data && data.length > 0) {
        setResumeData(data[0].resume_data as ResumeData);
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
      // For now, we'll silently handle this since the function might not exist yet
      // We can create the data later when saving
    } finally {
      setLoading(false);
    }
  };

  const saveResumeData = async (data: ResumeData) => {
    if (!userId) return;
    
    setSaving(true);
    try {
      // Use raw SQL query since the table isn't in types yet
      const { error } = await supabase
        .rpc('upsert_user_resume_data', { 
          user_uuid: userId,
          resume_data_json: data
        });

      if (error) throw error;

      setResumeData(data);
      toast({
        title: "Saved",
        description: "Your resume information has been saved.",
      });
    } catch (error) {
      console.error('Error saving resume data:', error);
      // Fallback: try direct table access
      try {
        const { error: directError } = await supabase
          .from('user_resume_data' as any)
          .upsert({
            user_id: userId,
            resume_data: data,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (directError) throw directError;

        setResumeData(data);
        toast({
          title: "Saved",
          description: "Your resume information has been saved.",
        });
      } catch (fallbackError) {
        console.error('Error saving resume data (fallback):', fallbackError);
        toast({
          title: "Error",
          description: "Failed to save your resume data.",
          variant: "destructive"
        });
      }
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
    loading,
    saving,
    saveResumeData,
    generateResumeFromData,
    loadResumeData
  };
};
