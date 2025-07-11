
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useState } from "react";
import { GuidedTour } from "@/components/onboarding/GuidedTour";
import { BookOpen, CreditCard, Gift, FileText } from "lucide-react";

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile(user?.id);
  const [showTutorial, setShowTutorial] = useState(false);

  const initials = profile 
    ? `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "??";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="Profile picture" />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Account</p>
              <p className="text-xs leading-none text-muted-foreground">
                {profile ? `${profile.first_name} ${profile.last_name}` : user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile-edit">Profile Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/pricing">
              <CreditCard className="h-4 w-4 mr-2" />
              <span>Pricing</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/subscription">
              <CreditCard className="h-4 w-4 mr-2" />
              <span>Subscription</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/referrals">
              <Gift className="h-4 w-4 mr-2" />
              <span>Referrals</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/blog">
              <FileText className="h-4 w-4 mr-2" />
              <span>Blog</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowTutorial(true)}>
            <BookOpen className="h-4 w-4 mr-2" />
            <span>Help & Tutorial</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {showTutorial && (
        <GuidedTour forceOpen={true} onClose={() => setShowTutorial(false)} />
      )}
    </>
  );
};
