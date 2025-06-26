
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { JobApplication } from "@/types/job";

export function useJobApplication() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applying, setApplying] = useState(false);

  const applyToJob = async (
    jobId: string,
    applicationMethod: string = 'direct',
    coverLetter?: string,
    resumeVersion?: string
  ): Promise<JobApplication | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for jobs.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setApplying(true);

      // Check if user already applied to this job
      const { data: existingApplication } = await supabase
        .from('job_applications')
        .select('id')
        .eq('user_id', user.id)
        .eq('job_posting_id', jobId)
        .single();

      if (existingApplication) {
        toast({
          title: "Already Applied",
          description: "You have already applied to this job.",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_posting_id: jobId,
          application_method: applicationMethod,
          cover_letter: coverLetter,
          resume_version: resumeVersion,
          status: 'applied'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your job application has been submitted successfully!",
      });

      return data;
    } catch (error) {
      console.error('Error applying to job:', error);
      toast({
        title: "Application Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setApplying(false);
    }
  };

  const getUserApplications = async (): Promise<JobApplication[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  };

  const hasApplied = async (jobId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data } = await supabase
        .from('job_applications')
        .select('id')
        .eq('user_id', user.id)
        .eq('job_posting_id', jobId)
        .limit(1);

      return (data && data.length > 0) || false;
    } catch (error) {
      console.error('Error checking application status:', error);
      return false;
    }
  };

  return {
    applyToJob,
    getUserApplications,
    hasApplied,
    applying
  };
}
