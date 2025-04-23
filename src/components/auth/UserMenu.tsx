
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { User2, Image, Pencil } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Link } from "react-router-dom";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile(user?.id);

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 justify-end">
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover border-2 border-indigo-400"
        />
      ) : (
        <span className="rounded-full bg-indigo-100 flex items-center justify-center w-8 h-8">
          <Image className="text-indigo-500" />
        </span>
      )}
      <span className="font-medium text-gray-700">{profile?.first_name || user.email}</span>
      <Link to="/profile-edit">
        <Button variant="ghost" size="sm" className="px-2 py-1" title="Edit Profile">
          <Pencil className="w-4 h-4 mr-1" /> Edit
        </Button>
      </Link>
      <Button variant="outline" size="sm" onClick={signOut}>
        <User2 className="mr-1" /> Logout
      </Button>
    </div>
  );
}
