
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarSelector } from "@/components/profile/AvatarSelector";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function ProfileSetup() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Save to profiles table (overwrite username as "First Last" for compatibility)
    const { error } = await supabase
      .from("profiles")
      .update({
        username: `${firstName.trim()} ${lastName.trim()}`,
        avatar_url: avatar,
        // Optionally add job_title field if/when schema updated
      })
      .eq("id", user.id);

    setSubmitting(false);

    if (error) {
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
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-6 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-1 text-indigo-700 text-center">Set Up Your Profile</h2>
        <p className="mb-4 text-sm text-center text-gray-500">
          Complete your profile to personalize your experience.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="firstName" className="block font-semibold text-gray-700 mb-1">
                First Name
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
              <label htmlFor="lastName" className="block font-semibold text-gray-700 mb-1">
                Last Name
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
            <label htmlFor="jobTitle" className="block font-semibold text-gray-700 mb-1">
              Job Title (optional)
            </label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="E.g. Product Designer"
              disabled={submitting}
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Avatar (optional)</label>
            <AvatarSelector value={avatar} onChange={setAvatar} />
            <div className="text-xs text-gray-400 mt-1">Choose one of our avatars or upload your own!</div>
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
    </div>
  );
}
