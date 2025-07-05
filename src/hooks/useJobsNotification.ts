
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function useJobsNotification() {
  const { user } = useAuth();
  const [hasSeenJobsNotification, setHasSeenJobsNotification] = useLocalStorage(
    "hasSeenJobsNotification",
    false
  );

  useEffect(() => {
    if (user && !hasSeenJobsNotification) {
      // Show the notification after a brief delay
      const timer = setTimeout(() => {
        toast({
          title: "🚀 Revolutionary Job Matching Coming Soon!",
          description: "Check out our upcoming AI-powered job matching feature that will transform your job search experience.",
          duration: 8000,
          action: (
            <button
              onClick={() => window.location.href = '/jobs'}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Check it out
            </button>
          ),
        });
        
        setHasSeenJobsNotification(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, hasSeenJobsNotification, setHasSeenJobsNotification]);
}
