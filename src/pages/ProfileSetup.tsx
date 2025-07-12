
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarSelector } from "@/components/profile/AvatarSelector";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GuidedTour } from "@/components/onboarding/GuidedTour";

export default function ProfileSetup() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showAvatar, setShowAvatar] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileCreated, setProfileCreated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !jobTitle.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in your first name, last name, and job title.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        username: `${firstName.trim()} ${lastName.trim()}`,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        avatar_url: avatar,
        job_title: jobTitle.trim(),
        show_avatar_on_scorecard: showAvatar,
      })
      .eq("id", user.id);

    setSubmitting(false);

    if (error) {
      console.error("Profile setup error:", error);
      toast({
        title: "Profile Setup Failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Profile Created!",
      description: "Welcome to ATS Resume Optimizer."
    });
    
    // Set profile created flag to show guided tour
    setProfileCreated(true);
    
    // Navigate to home page after a delay to allow guided tour to show
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 py-6 px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-1 text-indigo-700 dark:text-indigo-400 text-center">Set Up Your Profile</h2>
        <p className="mb-4 text-sm text-center text-gray-500 dark:text-gray-400">
          Complete your profile to personalize your experience.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="firstName" className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                First Name *
              </label>
              <Input
                id="firstName"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                autoFocus
                disabled={submitting}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Last Name *
              </label>
              <Input
                id="lastName"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
          </div>
          <div>
            <label htmlFor="jobTitle" className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Job Title *
            </label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="E.g. Product Designer"
              required
              disabled={submitting}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              We use your job title to score your resume against thousands of people with the same title who are your competition.
            </p>
          </div>
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Photo (optional)</label>
            <AvatarSelector value={avatar} onChange={setAvatar} />
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Upload a photo of yourself (or leave blank if you prefer no photo).</div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showAvatar"
              checked={showAvatar}
              disabled={submitting}
              onChange={e => setShowAvatar(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showAvatar" className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Show my avatar or photo on the resume scorecard
            </label>
          </div>
          <Button
            type="submit"
            className="w-full flex items-center justify-center"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Complete Profile"}
          </Button>
        </form>
      </div>
      
      {/* Guided tour that shows when profile is created */}
      {profileCreated && <GuidedTour forceOpen={true} />}
    </div>
  );
}
