
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarSelector } from "@/components/profile/AvatarSelector";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { UserMenuWithTheme } from "@/components/theme/UserMenuWithTheme";

const ProfileEdit = () => {
  const { user } = useAuth();
  const { profile, setProfile, loading } = useUserProfile(user?.id);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showAvatar, setShowAvatar] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setJobTitle(profile.job_title || "");
      setAvatar(profile.avatar_url || null);
      setShowAvatar(profile.show_avatar_on_scorecard !== false); // default true
    }
  }, [profile]);

  if (!user || loading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        username: `${firstName.trim()} ${lastName.trim()}`,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        avatar_url: avatar,
        job_title: jobTitle,
        show_avatar_on_scorecard: showAvatar,
      })
      .eq("id", user.id);

    setSubmitting(false);

    if (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Profile Update Failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Profile Updated",
    });
    
    setProfile({
      ...profile,
      first_name: firstName,
      last_name: lastName,
      job_title: jobTitle,
      avatar_url: avatar,
      show_avatar_on_scorecard: showAvatar,
    });
    
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 py-6 px-4">
      <div className="absolute top-4 right-4">
        <UserMenuWithTheme />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-1 text-indigo-700 dark:text-indigo-400 text-center">Edit Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="firstName" className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <Input
                id="firstName"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
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
            <label htmlFor="jobTitle" className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
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
            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Avatar (optional)</label>
            <AvatarSelector value={avatar} onChange={setAvatar} />
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
            {submitting ? "Saving..." : "Update Profile"}
          </Button>
        </form>
        <div className="mt-6 text-xs text-center text-gray-400 dark:text-gray-500">
          <Link to="/terms-of-service" className="text-primary hover:underline">Terms</Link>
          {" · "}
          <Link to="/privacy-policy" className="text-primary hover:underline">Privacy</Link>
          {" · "}
          <Link to="/refund-policy" className="text-primary hover:underline">Refunds</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
