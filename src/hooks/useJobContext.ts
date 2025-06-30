
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface JobContextData {
  jobDescription: string;
  jobData: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    type: string;
    external_url?: string;
  };
}

export const useJobContext = () => {
  const [jobContext, setJobContext] = useLocalStorage<JobContextData | null>('jobContext', null);
  const [isJobContextActive, setIsJobContextActive] = useState(false);

  useEffect(() => {
    // Check for both sessionStorage and localStorage data
    const checkForJobData = () => {
      try {
        // First check sessionStorage (for immediate navigation)
        const sessionData = sessionStorage.getItem('resumeOptimizerData');
        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          setJobContext(parsedData);
          setIsJobContextActive(true);
          // Don't clear sessionStorage immediately - let it persist
          return;
        }

        // Then check localStorage (for persistence across sessions)
        if (jobContext) {
          setIsJobContextActive(true);
        }
      } catch (error) {
        console.error('Error loading job context:', error);
      }
    };

    checkForJobData();
  }, [jobContext]);

  const clearJobContext = () => {
    setJobContext(null);
    setIsJobContextActive(false);
    sessionStorage.removeItem('resumeOptimizerData');
  };

  const saveJobForLater = () => {
    // Job is already saved in localStorage via useLocalStorage
    // Just show confirmation
    return true;
  };

  return {
    jobContext,
    isJobContextActive,
    clearJobContext,
    saveJobForLater
  };
};
