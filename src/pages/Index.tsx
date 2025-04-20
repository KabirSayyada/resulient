
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!jobDescription.trim() || !resumeContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both job description and resume content.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://lovable.dev/supabase-edge-function-url/optimize-resume",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobDescription,
            resumeContent,
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to optimize resume");
      }

      setOptimizedResume(data.optimizedResume);
      toast({
        title: "Success!",
        description: "Your resume has been optimized for ATS.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ATS Resume Optimizer
          </h1>
          <p className="text-gray-600">
            Optimize your resume to beat Applicant Tracking Systems (ATS)
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <Textarea
              placeholder="Paste the job description here..."
              className="min-h-[150px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Resume
            </label>
            <Textarea
              placeholder="Paste your current resume content here..."
              className="min-h-[200px]"
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
            />
          </div>

          <div className="text-center">
            <Button
              onClick={handleOptimize}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Optimizing..." : "Optimize Resume"}
            </Button>
          </div>

          {optimizedResume && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optimized Resume
              </label>
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                  {optimizedResume}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
