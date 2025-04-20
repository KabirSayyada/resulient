
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { FileUploadSection } from "@/components/resume/FileUploadSection";
import { OptimizedResumeDisplay } from "@/components/resume/OptimizedResumeDisplay";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ATS Resume Optimizer
            </h1>
            <p className="text-gray-600">
              Optimize your resume to beat Applicant Tracking Systems (ATS)
            </p>
          </div>
          <UserMenu />
        </div>

        <div className="space-y-6">
          <JobDescriptionInput />
          <FileUploadSection />
          <OptimizedResumeDisplay />
        </div>
      </div>
    </div>
  );
};

export default Index;
